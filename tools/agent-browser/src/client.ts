import { spawn as nodeSpawn } from 'node:child_process';
import { closeSync, mkdirSync, openSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Settings } from './config.js';
import { homePaths } from './paths.js';

export type Status = Record<string, unknown> & { pid: number; port: number };

export interface ClientDeps {
  spawn: typeof nodeSpawn;
  fetch: typeof fetch;
  pollMs: number;
  readyTimeoutMs: number;
  requestTimeoutMs: number;
}

const DEFAULTS: ClientDeps = {
  spawn: nodeSpawn,
  fetch: (input, init) => fetch(input, init),
  pollMs: 200,
  readyTimeoutMs: 30_000,
  // One search is two navigations of 30 s each, plus time in the queue.
  requestTimeoutMs: 150_000,
};

/** An error answer of the daemon, with its HTTP status. */
export class DaemonError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const DAEMON_SCRIPT = fileURLToPath(new URL('./daemon.js', import.meta.url));
const STATUS_TIMEOUT_MS = 1_000;

/** Sends one JSON request to the daemon; returns the body on 2xx, throws the server's error otherwise. */
export async function request(
  port: number,
  method: string,
  path: string,
  body?: unknown,
  deps: Partial<ClientDeps> = {},
): Promise<Record<string, unknown>> {
  const { fetch, requestTimeoutMs } = { ...DEFAULTS, ...deps };
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new DaemonError(res.status, String(data.error ?? `daemon answered ${res.status}`));
  return data;
}

async function statusAt(port: number, deps: Partial<ClientDeps>): Promise<Status | null> {
  try {
    return (await request(port, 'GET', '/status', undefined, { ...deps, requestTimeoutMs: STATUS_TIMEOUT_MS })) as Status;
  } catch {
    return null;
  }
}

function statePort(): number | null {
  try {
    const { port } = JSON.parse(readFileSync(homePaths().state, 'utf8')) as { port?: unknown };
    return typeof port === 'number' ? port : null;
  } catch {
    return null;
  }
}

/** Returns the /status of the daemon the state file names, or null when none answers. */
export async function findDaemon(deps: Partial<ClientDeps> = {}): Promise<Status | null> {
  const port = statePort();
  return port === null ? null : statusAt(port, deps);
}

function spawnDaemon(settings: Settings, spawn: ClientDeps['spawn']): ReturnType<ClientDeps['spawn']> {
  const { log } = homePaths();
  mkdirSync(dirname(log), { recursive: true });
  const logFd = openSync(log, 'a');
  try {
    const child = spawn(process.execPath, [DAEMON_SCRIPT, JSON.stringify(settings)], {
      detached: true,
      stdio: ['ignore', logFd, logFd],
    });
    child.unref();
    return child;
  } finally {
    // The child holds its own copy of the descriptor.
    closeSync(logFd);
  }
}

/** Returns the running daemon's /status; spawns the daemon first when none answers. */
export async function ensureDaemon(settings: Settings, partial: Partial<ClientDeps> = {}): Promise<Status> {
  const deps = { ...DEFAULTS, ...partial };
  const running = await findDaemon(deps);
  if (running) return running;
  let exitCode: number | null | undefined;
  spawnDaemon(settings, deps.spawn).once('exit', (code: number | null) => (exitCode = code));
  const deadline = Date.now() + deps.readyTimeoutMs;
  while (Date.now() < deadline) {
    // Ready means the state file names an answering daemon: it is written after the browser launch.
    const status = await findDaemon(deps);
    if (status) return status;
    // A daemon that lost the bind race exits too; then the winner holds the port and is still launching.
    if (exitCode !== undefined && !(await statusAt(settings.port, deps))) throw new Error(`daemon exited with code ${exitCode}; see the log ${homePaths().log}`);
    await new Promise((resolve) => setTimeout(resolve, deps.pollMs));
  }
  throw new Error(`daemon did not answer within ${deps.readyTimeoutMs / 1000} s; see the log ${homePaths().log}`);
}
