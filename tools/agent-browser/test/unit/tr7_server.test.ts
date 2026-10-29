import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { createServer as createNetServer, type Server as NetServer } from 'node:net';
import { networkInterfaces, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Settings } from '../../src/config.js';
import { runDaemon, startServer, type BrowserOps } from '../../src/server.js';

const SETTINGS: Settings = {
  profile: '/tmp/profile',
  headless: true,
  idleMinutes: 10,
  port: 0,
  concurrency: 2,
  channel: 'chrome',
};

let dir: string;
let closers: Array<() => Promise<void>>;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'tr7-'));
  closers = [];
});

afterEach(async () => {
  for (const close of closers) await close();
  rmSync(dir, { recursive: true, force: true });
});

function fakeOps(overrides: Partial<BrowserOps> = {}): BrowserOps {
  return {
    read: async (url) => `# page ${url}`,
    search: async (query, limit) => [{ title: query, url: 'https://x.test', content: String(limit) }],
    ...overrides,
  };
}

async function start(ops: BrowserOps = fakeOps(), settings: Partial<Settings> = {}, onShutdown?: () => void) {
  const server = await startServer({ settings: { ...SETTINGS, ...settings }, ops, onShutdown });
  closers.push(server.close);
  return { ...server, url: `http://127.0.0.1:${server.port}` };
}

function post(base: string, path: string, body: unknown): Promise<Response> {
  return fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function waitFor(check: () => boolean): Promise<void> {
  for (let i = 0; i < 200 && !check(); i++) await new Promise((r) => setTimeout(r, 10));
}

function occupyPort(): Promise<NetServer> {
  return new Promise((resolve) => {
    const blocker = createNetServer();
    blocker.listen(0, '127.0.0.1', () => resolve(blocker));
  });
}

function portOf(server: NetServer): number {
  return (server.address() as { port: number }).port;
}

test('test_tr7_read_returns_markdown', async () => {
  const { url } = await start();

  const res = await post(url, '/read', { url: 'https://a.test' });

  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toContain('application/json');
  expect(await res.json()).toEqual({ markdown: '# page https://a.test' });
});

test('test_tr7_read_without_url_is_400', async () => {
  const { url } = await start();

  const res = await post(url, '/read', {});

  expect(res.status).toBe(400);
  expect((await res.json()).error).toMatch(/url/);
});

test('test_tr7_read_file_url_is_400', async () => {
  const read = vi.fn(async () => '');
  const { url } = await start(fakeOps({ read }));

  const res = await post(url, '/read', { url: 'file:///etc/passwd' });

  expect(res.status).toBe(400);
  expect(read).not.toHaveBeenCalled();
});

test('test_tr7_read_callee_error_is_500_with_message', async () => {
  const { url } = await start(fakeOps({ read: async () => Promise.reject(new Error('page timed out')) }));

  const res = await post(url, '/read', { url: 'https://a.test' });

  expect(res.status).toBe(500);
  expect(await res.json()).toEqual({ error: 'page timed out' });
});

test('test_tr7_search_returns_results', async () => {
  const { url } = await start();

  const res = await post(url, '/search', { query: 'cats', limit: 3 });

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ results: [{ title: 'cats', url: 'https://x.test', content: '3' }] });
});

test('test_tr7_search_default_limit_5', async () => {
  const search = vi.fn(async () => []);
  const { url } = await start(fakeOps({ search }));

  await post(url, '/search', { query: 'cats' });

  expect(search).toHaveBeenCalledWith('cats', 5);
});

test('test_tr7_search_without_query_is_400', async () => {
  const { url } = await start();

  const res = await post(url, '/search', { limit: 2 });

  expect(res.status).toBe(400);
});

test('test_tr7_search_bad_limit_is_400', async () => {
  const { url } = await start();

  const res = await post(url, '/search', { query: 'cats', limit: 0 });

  expect(res.status).toBe(400);
});

test('test_tr7_status_reports_settings_and_uptime', async () => {
  const { url, port } = await start();

  const res = await fetch(url + '/status');
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toMatchObject({
    pid: process.pid,
    port,
    headless: true,
    profile: '/tmp/profile',
    concurrency: 2,
    idleMinutes: 10,
    inFlight: 0,
  });
  expect(typeof body.startedAt).toBe('string');
  expect(body.uptimeMs).toBeGreaterThanOrEqual(0);
  expect(body.idleRemainingMs).toBeLessThanOrEqual(600_000);
});

test('test_tr7_status_does_not_reset_idle', async () => {
  let idled = false;
  const { url } = await start(fakeOps(), { idleMinutes: 200 / 60_000 }, () => {
    idled = true;
  });

  // Status calls every 20 ms; if they counted as activity the 200 ms idle never fires.
  for (let i = 0; i < 50 && !idled; i++) {
    await fetch(url + '/status').catch(() => undefined);
    await new Promise((r) => setTimeout(r, 20));
  }

  expect(idled).toBe(true);
});

test('test_tr7_stop_replies_then_asks_for_shutdown', async () => {
  let asked = false;
  const { url } = await start(fakeOps(), {}, () => {
    asked = true;
  });

  const res = await post(url, '/stop', {});

  expect(await res.json()).toEqual({ stopping: true });
  await waitFor(() => asked);
  expect(asked).toBe(true);
});

test('test_tr7_close_is_idempotent', async () => {
  const server = await start();

  await server.close();

  await expect(server.close()).resolves.toBeUndefined();
});

test('test_tr7_unknown_route_404', async () => {
  const { url } = await start();

  const res = await fetch(url + '/nope');

  expect(res.status).toBe(404);
  expect((await res.json()).error).toBeTruthy();
});

test('test_tr7_get_on_read_405', async () => {
  const { url } = await start();

  const res = await fetch(url + '/read');

  expect(res.status).toBe(405);
  expect((await res.json()).error).toBeTruthy();
});

test('test_tr7_invalid_json_body_is_400', async () => {
  const { url } = await start();

  const res = await post(url, '/read', '{not json');

  expect(res.status).toBe(400);
});

test('test_tr7_body_over_1mib_is_413', async () => {
  const { url } = await start();

  const res = await post(url, '/read', { url: 'x'.repeat(1024 * 1024 + 1) });

  expect(res.status).toBe(413);
});

test('test_tr7_binds_loopback_only', async () => {
  const { port } = await start();
  const external = Object.values(networkInterfaces())
    .flat()
    .find((nic) => nic && nic.family === 'IPv4' && !nic.internal);
  expect(external, 'this test needs one non-loopback IPv4 interface').toBeDefined();

  const loopback = await fetch(`http://127.0.0.1:${port}/status`);

  expect(loopback.status).toBe(200);
  await expect(fetch(`http://${external!.address}:${port}/status`)).rejects.toThrow();
});

function freePort(): Promise<number> {
  return occupyPort().then((server) => {
    const port = portOf(server);
    return new Promise((resolve) => server.close(() => resolve(port)));
  });
}

async function isListening(port: number): Promise<boolean> {
  return fetch(`http://127.0.0.1:${port}/status`).then(
    (res) => res.ok,
    () => false,
  );
}

/**
 * A fake browser for runDaemon on a known free port in a temp home.
 * `launch` gates createOps; `closed` plays the browser window going away; `events` logs what each step saw.
 */
async function fakeDaemon() {
  process.env.AGENT_BROWSER_HOME = dir;
  const port = await freePort();
  const state = join(dir, 'daemon.json');
  const launch = Promise.withResolvers<void>();
  const closed = Promise.withResolvers<void>();
  const events: string[] = [];
  const createOps = vi.fn(async () => {
    events.push(`launch listening=${await isListening(port)}`);
    await launch.promise;
    return {
      ops: fakeOps(),
      close: async () => {
        events.push(`close listening=${await isListening(port)} state=${existsSync(state)}`);
        closed.resolve();
      },
      closed: closed.promise,
    };
  });
  const run = (settings: Partial<Settings> = {}) => runDaemon({ ...SETTINGS, port, ...settings }, createOps);
  return { port, state, launch, closed, events, createOps, run };
}

afterEach(() => {
  delete process.env.AGENT_BROWSER_HOME;
});

test('test_tr7_state_file_written_after_launch', async () => {
  const daemon = await fakeDaemon();
  const run = daemon.run();
  await waitFor(() => daemon.events.length > 0);

  expect(existsSync(daemon.state)).toBe(false);
  daemon.launch.resolve();
  await waitFor(() => existsSync(daemon.state));

  expect(JSON.parse(readFileSync(daemon.state, 'utf8'))).toEqual({
    pid: process.pid,
    port: daemon.port,
    headless: true,
    profile: '/tmp/profile',
    channel: 'chrome',
    startedAt: expect.any(String),
  });
  process.emit('SIGTERM');
  await run;
});

test('test_tr7_binds_before_launch', async () => {
  const daemon = await fakeDaemon();
  const run = daemon.run();
  // The launch stays pending: a daemon that binds only after the launch is not listening here.
  await waitFor(() => daemon.events.length > 0);

  expect(daemon.events[0]).toBe('launch listening=true');
  daemon.launch.resolve();
  await waitFor(() => existsSync(daemon.state));
  process.emit('SIGTERM');
  await run;
});

test('test_tr7_request_before_launch_waits_for_it', async () => {
  const daemon = await fakeDaemon();
  const run = daemon.run();
  await waitFor(() => daemon.events.length > 0);

  const reply = post(`http://127.0.0.1:${daemon.port}`, '/read', { url: 'https://a.test' });
  daemon.launch.resolve();

  expect(await (await reply).json()).toEqual({ markdown: '# page https://a.test' });
  process.emit('SIGTERM');
  await run;
});

// The entry shim turns this rejection into exit code 1.
test('test_tr7_bind_failure_exits_nonzero_without_launch', async () => {
  const blocker = await occupyPort();
  closers.push(() => new Promise((r) => blocker.close(() => r())));
  const daemon = await fakeDaemon();

  await expect(daemon.run({ port: portOf(blocker) })).rejects.toMatchObject({ code: 'EADDRINUSE' });
  expect(daemon.createOps).not.toHaveBeenCalled();
  expect(existsSync(daemon.state)).toBe(false);
});

test('test_tr7_launch_failure_frees_port_and_rejects', async () => {
  const daemon = await fakeDaemon();
  const run = daemon.run();
  await waitFor(() => daemon.events.length > 0);

  daemon.launch.reject(new Error('no chrome'));

  await expect(run).rejects.toThrow('no chrome');
  expect(await isListening(daemon.port)).toBe(false);
  expect(existsSync(daemon.state)).toBe(false);
});

test('test_tr7_stop_resolves_run_daemon', async () => {
  const daemon = await fakeDaemon();
  daemon.launch.resolve();
  const run = daemon.run();
  await waitFor(() => existsSync(daemon.state));

  const res = await post(`http://127.0.0.1:${daemon.port}`, '/stop', {});
  await run;

  expect(await res.json()).toEqual({ stopping: true });
  expect(existsSync(daemon.state)).toBe(false);
  expect(await isListening(daemon.port)).toBe(false);
  expect(process.listenerCount('SIGTERM')).toBe(0);
});

test('test_tr7_shutdown_closes_browser_before_port_and_state_file', async () => {
  const daemon = await fakeDaemon();
  daemon.launch.resolve();
  const run = daemon.run();
  await waitFor(() => existsSync(daemon.state));

  process.emit('SIGTERM');
  await run;

  expect(daemon.events.slice(1)).toEqual(['close listening=true state=true']);
  expect(existsSync(daemon.state)).toBe(false);
  expect(process.listenerCount('SIGINT')).toBe(0);
});

test('test_tr7_browser_closed_resolves_run_daemon', async () => {
  const daemon = await fakeDaemon();
  daemon.launch.resolve();
  const run = daemon.run();
  await waitFor(() => existsSync(daemon.state));

  daemon.closed.resolve();
  await run;

  expect(existsSync(daemon.state)).toBe(false);
  expect(await isListening(daemon.port)).toBe(false);
});

/** Sends one raw request; fetch cannot set the Host header. */
function raw(port: number, method: string, path: string, headers: Record<string, string>): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = httpRequest({ host: '127.0.0.1', port, method, path, headers }, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on('error', reject);
    req.end(method === 'POST' ? '{}' : undefined);
  });
}

test('test_tr7_wrong_host_is_403', async () => {
  const { port } = await start();

  expect(await raw(port, 'GET', '/status', { Host: `evil.test:${port}` })).toBe(403);
});

test('test_tr7_stop_with_wrong_host_does_not_stop', async () => {
  const onShutdown = vi.fn();
  const { port } = await start(fakeOps(), {}, onShutdown);

  expect(await raw(port, 'POST', '/stop', { Host: `evil.test:${port}`, 'Content-Type': 'application/json' })).toBe(403);
  expect(onShutdown).not.toHaveBeenCalled();
});

test('test_tr7_localhost_host_is_accepted', async () => {
  const { port } = await start();

  expect(await raw(port, 'GET', '/status', { Host: `localhost:${port}` })).toBe(200);
});

test('test_tr7_post_without_json_content_type_is_415', async () => {
  const onShutdown = vi.fn();
  const { port } = await start(fakeOps(), {}, onShutdown);

  expect(await raw(port, 'POST', '/stop', { Host: `127.0.0.1:${port}`, 'Content-Type': 'text/plain' })).toBe(415);
  expect(onShutdown).not.toHaveBeenCalled();
});
