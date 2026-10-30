import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { EventEmitter } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ensureDaemon, request, type ClientDeps } from '../../src/client.js';
import type { Settings } from '../../src/config.js';

let home: string;

const SETTINGS: Settings = {
  profile: '/tmp/profile',
  headless: true,
  idleMinutes: 1,
  port: 7801,
  concurrency: 2,
  channel: 'chromium',
};

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), 'agent-browser-tr9-'));
  vi.stubEnv('AGENT_BROWSER_HOME', home);
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(home, { recursive: true, force: true });
});

function writeState(port: number): void {
  writeFileSync(join(home, 'daemon.json'), JSON.stringify({ pid: 1, port }));
}

/** What a spawned daemon does once ready: answers on its port and names it in the state file. */
function daemonUp(live: Set<number>): void {
  live.add(SETTINGS.port);
  writeState(SETTINGS.port);
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

/** A fake fetch: answers /status with 200 on the ports in `live`, refuses the rest. */
function fakeFetch(live: Set<number>) {
  return vi.fn(async (input: string | URL | Request) => {
    const url = new URL(String(input));
    const port = Number(url.port);
    if (!live.has(port)) throw new TypeError('fetch failed: ECONNREFUSED');
    return json(200, { pid: 42, port });
  });
}

/** A fake spawn; the child is an EventEmitter, so a test can emit its `exit`. */
function fakeSpawn(onSpawn: (child: EventEmitter) => void = () => {}) {
  return vi.fn(() => {
    const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
    onSpawn(child);
    return child;
  });
}

function deps(over: Partial<ClientDeps>): Partial<ClientDeps> {
  return { pollMs: 1, readyTimeoutMs: 200, ...over };
}

// req: agent-browser/TR-9
test('healthy_daemon_not_respawned', async () => {
  writeState(7900);
  const spawn = fakeSpawn();
  const status = await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(new Set([7900])) }));
  expect(status.port).toBe(7900);
  expect(spawn).not.toHaveBeenCalled();
});

test('missing_state_spawns', async () => {
  const live = new Set<number>();
  const spawn = fakeSpawn(() => daemonUp(live));
  const status = await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(live) }));
  expect(spawn).toHaveBeenCalledOnce();
  expect(status.port).toBe(SETTINGS.port);
});

test('stale_state_spawns', async () => {
  writeState(7900);
  const live = new Set<number>();
  const spawn = fakeSpawn(() => daemonUp(live));
  const status = await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(live) }));
  expect(spawn).toHaveBeenCalledOnce();
  expect(status.port).toBe(SETTINGS.port);
});

test('never_ready_fails_with_log_path', async () => {
  const run = ensureDaemon(SETTINGS, deps({ spawn: fakeSpawn() as never, fetch: fakeFetch(new Set()) }));
  await expect(run).rejects.toThrow(join(home, 'daemon.log'));
});

test('daemon_exit_at_startup_fails_fast_with_log_path', async () => {
  const spawn = fakeSpawn((child) => setImmediate(() => child.emit('exit', 1)));
  const started = Date.now();

  const run = ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(new Set()), readyTimeoutMs: 30_000 }));

  await expect(run).rejects.toThrow(/exited.*daemon\.log/s);
  expect(Date.now() - started).toBeLessThan(5_000);
});

test('losing_daemon_exit_uses_the_winner', async () => {
  const live = new Set<number>();
  // The spawned daemon loses the bind race and exits; the winner holds the port and writes its state file later.
  const spawn = fakeSpawn((child) => {
    live.add(SETTINGS.port);
    setImmediate(() => child.emit('exit', 1));
    setTimeout(() => writeState(SETTINGS.port), 30);
  });

  const status = await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(live) }));

  expect(status.port).toBe(SETTINGS.port);
});

test('ready_only_once_state_file_written', async () => {
  const live = new Set<number>();
  // The port answers at once; the state file follows when the browser has launched.
  const spawn = fakeSpawn(() => {
    live.add(SETTINGS.port);
    setTimeout(() => writeState(SETTINGS.port), 30);
  });

  await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(live) }));

  expect(existsSync(join(home, 'daemon.json'))).toBe(true);
});

test('work_requests_wait_150_s', async () => {
  const timeout = vi.spyOn(AbortSignal, 'timeout');
  const fetch = vi.fn(async () => json(200, {}));

  await request(SETTINGS.port, 'POST', '/search', { query: 'q' }, { fetch: fetch as never });

  expect(timeout).toHaveBeenCalledWith(150_000);
  timeout.mockRestore();
});

test('request_timeout_fails', async () => {
  const hang = vi.fn(
    (_input: unknown, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      }),
  );
  const run = request(SETTINGS.port, 'POST', '/read', { url: 'http://x' }, { fetch: hang as never, requestTimeoutMs: 20 });
  await expect(run).rejects.toThrow(/timeout|aborted/i);
});

test('request_sends_json_over_real_http', async () => {
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ method: req.method, type: req.headers['content-type'], body: JSON.parse(body) }));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const reply = await request(port, 'POST', '/read', { url: 'http://x' });

    expect(reply).toEqual({ method: 'POST', type: 'application/json', body: { url: 'http://x' } });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('spawn_passes_settings_as_args', async () => {
  const live = new Set<number>();
  const spawn = fakeSpawn(() => daemonUp(live));
  await ensureDaemon(SETTINGS, deps({ spawn: spawn as never, fetch: fakeFetch(live) }));
  const [command, args, options] = spawn.mock.calls[0] as unknown as [string, string[], { detached: boolean }];
  expect(command).toBe(process.execPath);
  expect(args[0]).toMatch(/daemon\.js$/);
  expect(JSON.parse(args[1])).toEqual(SETTINGS);
  expect(options.detached).toBe(true);
});
