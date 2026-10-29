import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import type { Settings } from '../../src/config.js';
import { startServer, type BrowserOps } from '../../src/server.js';

const SETTINGS: Settings = {
  profile: '/tmp/profile',
  headless: true,
  idleMinutes: 10,
  port: 0,
  concurrency: 2,
  channel: 'chrome',
};

interface Deferred {
  url: string;
  resolve(markdown: string): void;
  reject(error: Error): void;
}

let dir: string;
let calls: Deferred[];
let base: string;
let close: () => Promise<void>;

// read() parks each call until the test settles it; a call is named by its URL host.
const ops: BrowserOps = {
  read: (url) =>
    new Promise((resolve, reject) => {
      calls.push({ url: new URL(url).hostname, resolve, reject });
    }),
  search: async () => [],
};

async function start(concurrency: number): Promise<void> {
  const server = await startServer({
    settings: { ...SETTINGS, concurrency },
    ops,
  });
  base = `http://127.0.0.1:${server.port}`;
  close = server.close;
}

function read(url: string): Promise<Response> {
  return fetch(base + '/read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: `http://${url}/` }) });
}

// Starts a read the test does not await; teardown may cut it, so its outcome is dropped.
function fire(url: string): void {
  read(url).catch(() => undefined);
}

async function status(): Promise<{ inFlight: number; idleRemainingMs: number | null }> {
  return (await fetch(base + '/status')).json();
}

async function waitFor(check: () => boolean | Promise<boolean>): Promise<void> {
  for (let i = 0; i < 200 && !(await check()); i++) await new Promise((r) => setTimeout(r, 5));
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'tr12-'));
  calls = [];
});

afterEach(async () => {
  for (const call of calls) call.resolve('');
  await close();
  rmSync(dir, { recursive: true, force: true });
});

test('test_tr12_two_reads_run_at_once', async () => {
  await start(2);

  const a = read('a');
  const b = read('b');
  await waitFor(() => calls.length === 2);

  expect(calls.map((c) => c.url).sort()).toEqual(['a', 'b']);
  calls.forEach((c) => c.resolve(c.url));
  expect((await a).status).toBe(200);
  expect((await b).status).toBe(200);
});

test('test_tr12_third_waits_when_concurrency_is_2', async () => {
  await start(2);

  fire('a');
  fire('b');
  fire('c');
  await waitFor(async () => (await status()).inFlight === 3);

  expect(calls).toHaveLength(2);
});

test('test_tr12_waiting_request_runs_after_release_in_order', async () => {
  await start(1);
  fire('a');
  await waitFor(() => calls.length === 1);
  fire('b');
  await waitFor(async () => (await status()).inFlight === 2);
  fire('c');
  await waitFor(async () => (await status()).inFlight === 3);

  calls[0].resolve('a');
  await waitFor(() => calls.length === 2);
  calls[1].resolve('b');
  await waitFor(() => calls.length === 3);

  expect(calls.map((c) => c.url)).toEqual(['a', 'b', 'c']);
});

test('test_tr12_failed_request_releases_its_slot', async () => {
  await start(1);
  const a = read('a');
  await waitFor(() => calls.length === 1);
  const b = read('b');
  await waitFor(async () => (await status()).inFlight === 2);

  calls[0].reject(new Error('a failed'));
  await waitFor(() => calls.length === 2);
  calls[1].resolve('b ok');

  expect((await a).status).toBe(500);
  const second = await b;
  expect(second.status).toBe(200);
  expect(await second.json()).toEqual({ markdown: 'b ok' });
});

test('test_tr12_idle_held_while_queue_not_empty', async () => {
  await start(1);
  fire('a');
  fire('b');
  await waitFor(async () => (await status()).inFlight === 2);

  const queued = await status();
  expect(calls).toHaveLength(1);
  expect(queued.idleRemainingMs).toBeNull();

  calls[0].resolve('a');
  await waitFor(() => calls.length === 2);
  expect((await status()).idleRemainingMs).toBeNull();
  calls[1].resolve('b');
  await waitFor(async () => (await status()).inFlight === 0);

  expect((await status()).idleRemainingMs).toBeGreaterThan(0);
});
