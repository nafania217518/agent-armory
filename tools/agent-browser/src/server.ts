import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { dirname } from 'node:path';
import { isHttpUrl } from './args.js';
import type { Settings } from './config.js';
import { Semaphore } from './gate.js';
import { IdleTimer } from './idle.js';
import { homePaths } from './paths.js';
import type { SearchResult } from './search.js';

export interface BrowserOps {
  read(url: string): Promise<string>;
  search(query: string, limit: number): Promise<SearchResult[]>;
}

export interface DaemonDeps {
  settings: Settings;
  ops: BrowserOps;
  /** Runs when the server asks for a shutdown: idle, or POST /stop after its reply. */
  onShutdown?: () => void;
}

/** The browser side of the daemon; `closed` resolves when the browser goes away. */
export interface DaemonBrowser {
  ops: BrowserOps;
  close(): Promise<void>;
  closed: Promise<void>;
}

export interface RunningServer {
  port: number;
  close(): Promise<void>;
}

const MAX_BODY_BYTES = 1024 * 1024;
const DEFAULT_LIMIT = 5;

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type Route = { method: string; handle: (body: () => Promise<Record<string, unknown>>) => Promise<unknown> };

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'request body over 1 MiB');
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  let data: unknown;
  try {
    data = text === '' ? {} : JSON.parse(text);
  } catch {
    throw new HttpError(400, 'request body is not valid JSON');
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new HttpError(400, 'request body must be a JSON object');
  }
  return data as Record<string, unknown>;
}

function parseRead(body: Record<string, unknown>): string {
  if (typeof body.url !== 'string' || !isHttpUrl(body.url)) throw new HttpError(400, 'url must be an http or https url');
  return body.url;
}

function parseSearch(body: Record<string, unknown>): { query: string; limit: number } {
  if (typeof body.query !== 'string' || body.query === '') {
    throw new HttpError(400, 'query must be a non-empty string');
  }
  const limit = body.limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(limit) || (limit as number) < 1) throw new HttpError(400, 'limit must be a positive integer');
  return { query: body.query, limit: limit as number };
}

function listen(server: ReturnType<typeof createServer>, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve((server.address() as { port: number }).port);
    });
  });
}

export async function startServer(deps: DaemonDeps): Promise<RunningServer> {
  const { settings, ops } = deps;
  const startedAt = new Date();
  const gate = new Semaphore(settings.concurrency);
  let closing: Promise<void> | null = null;
  let shuttingDown = false;

  // An activity holds the idle timer from arrival, so a queued request counts too (TR-12).
  async function activity<T>(fn: () => Promise<T>): Promise<T> {
    idle.begin();
    try {
      return await gate.run(() => {
        // The browser closes before the port; 503 tells the CLI to start a new daemon.
        if (shuttingDown) throw new HttpError(503, 'daemon is shutting down');
        return fn();
      });
    } finally {
      idle.end();
    }
  }

  const routes: Record<string, Route> = {
    '/read': {
      method: 'POST',
      handle: async (body) => {
        const url = parseRead(await body());
        return { markdown: await activity(() => ops.read(url)) };
      },
    },
    '/search': {
      method: 'POST',
      handle: async (body) => {
        const { query, limit } = parseSearch(await body());
        return { results: await activity(() => ops.search(query, limit)) };
      },
    },
    '/status': {
      method: 'GET',
      handle: async () => ({
        pid: process.pid,
        port,
        headless: settings.headless,
        profile: settings.profile,
        channel: settings.channel,
        concurrency: settings.concurrency,
        idleMinutes: settings.idleMinutes,
        startedAt: startedAt.toISOString(),
        uptimeMs: Date.now() - startedAt.getTime(),
        idleRemainingMs: idle.remainingMs(),
        inFlight: idle.inFlight,
      }),
    },
    '/stop': { method: 'POST', handle: async () => ({ stopping: true }) },
  };

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = URL.parse(req.url ?? '/', 'http://localhost')?.pathname;
    if (path === undefined) return send(res, 400, { error: 'request target is not a valid url' });
    // A Host check stops DNS rebinding; a JSON content type forces a CORS preflight the daemon never answers.
    if (req.headers.host !== `127.0.0.1:${port}` && req.headers.host !== `localhost:${port}`) {
      return send(res, 403, { error: 'host must be 127.0.0.1 or localhost' });
    }
    const route = routes[path];
    if (!route) return send(res, 404, { error: `no route ${path}` });
    if (req.method !== route.method) return send(res, 405, { error: `${path} accepts ${route.method} only` });
    if (route.method === 'POST' && !(req.headers['content-type'] ?? '').startsWith('application/json')) {
      return send(res, 415, { error: 'content-type must be application/json' });
    }
    try {
      send(res, 200, await route.handle(() => readJson(req)));
      // Ask for the shutdown only after the reply is flushed.
      if (path === '/stop') res.once('finish', askShutdown);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 413) res.setHeader('Connection', 'close');
      send(res, status, { error: (error as Error).message });
    }
  }

  const server = createServer((req, res) => void handle(req, res));
  const askShutdown = () => {
    shuttingDown = true;
    deps.onShutdown?.();
  };
  const idle = new IdleTimer(settings.idleMinutes * 60_000, askShutdown);

  function close(): Promise<void> {
    closing ??= (async () => {
      idle.stop();
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    })();
    return closing;
  }

  let port: number;
  try {
    port = await listen(server, settings.port);
  } catch (error) {
    idle.stop();
    throw error;
  }
  return { port, close };
}

function writeState(statePath: string, settings: Settings, port: number): void {
  mkdirSync(dirname(statePath), { recursive: true });
  const state = {
    pid: process.pid,
    port,
    headless: settings.headless,
    profile: settings.profile,
    channel: settings.channel,
    startedAt: new Date().toISOString(),
  };
  writeFileSync(statePath, JSON.stringify(state));
}

/**
 * Binds the port first (the port is the lock), then launches the browser.
 * The state file exists only while both run. Shutdown: browser, then port, then state file.
 */
export async function runDaemon(settings: Settings, createOps: (settings: Settings) => Promise<DaemonBrowser>): Promise<void> {
  const statePath = homePaths().state;
  let bound!: () => void;
  const launched = new Promise<void>((resolve) => (bound = resolve)).then(() => createOps(settings));
  // Requests that arrive during the launch wait for it.
  const ops: BrowserOps = {
    read: async (url) => (await launched).ops.read(url),
    search: async (query, limit) => (await launched).ops.search(query, limit),
  };
  let stop!: () => void;
  const done = new Promise<void>((resolve) => (stop = resolve));
  const server = await startServer({ settings, ops, onShutdown: () => stop() });
  bound();
  let browser: DaemonBrowser;
  try {
    browser = await launched;
  } catch (error) {
    await server.close();
    throw error;
  }
  writeState(statePath, settings, server.port);
  void browser.closed.then(() => stop());
  const onSignal = () => stop();
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);
  try {
    await done;
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    await browser.close();
    await server.close();
    rmSync(statePath, { force: true });
  }
}
