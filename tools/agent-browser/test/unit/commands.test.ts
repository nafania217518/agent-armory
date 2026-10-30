import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { EventEmitter } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { USAGE } from '../../src/args.js';
import { main, type CommandDeps } from '../../src/commands.js';
import { renderResults } from '../../src/search.js';

const PORT = 7788; // the default port, used when no config file exists
const RESULTS = [{ title: 'Playwright', url: 'https://playwright.dev', content: 'browser automation' }];

let home: string;
let out: string[];
let err: string[];

/** A fake daemon behind fake fetch and spawn: answers while `alive`; POST /stop stops its HTTP and, unless `stuck` (shutdown still in progress), removes the state file. */
function fakeDaemon(alive: boolean, readReply: [number, unknown] = [200, { markdown: '# Hello' }], stuck = false) {
  const daemon = { alive, spawned: 0 };
  const fetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    if (!daemon.alive) throw new TypeError('fetch failed: ECONNREFUSED');
    const path = new URL(String(input)).pathname;
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
    if (path === '/status') return reply(200, { pid: 42, port: PORT, headless: true, inFlight: 0 });
    if (path === '/read') return reply(...readReply);
    if (path === '/search') {
      expect(JSON.parse(String(init?.body))).toEqual({ query: 'playwright', limit: 1 });
      return reply(200, { results: RESULTS });
    }
    daemon.alive = false;
    if (!stuck) rmSync(join(home, 'daemon.json'), { force: true });
    return reply(200, { stopping: true });
  });
  const spawn = vi.fn(() => {
    daemon.spawned += 1;
    daemon.alive = true;
    writeState();
    return Object.assign(new EventEmitter(), { unref: () => {} });
  });
  const deps: Partial<CommandDeps> = { fetch: fetch as never, spawn: spawn as never, pollMs: 1, readyTimeoutMs: 200 };
  return { daemon, deps };
}

function writeState(): void {
  writeFileSync(join(home, 'daemon.json'), JSON.stringify({ pid: 42, port: PORT }));
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), 'agent-browser-tr10-'));
  vi.stubEnv('AGENT_BROWSER_HOME', home);
  out = [];
  err = [];
  vi.spyOn(console, 'log').mockImplementation((text: string) => void out.push(text));
  vi.spyOn(console, 'error').mockImplementation((text: string) => void err.push(text));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(home, { recursive: true, force: true });
});

// req: agent-browser/TR-10
test('usage_error_exits_2_with_usage_on_stderr', async () => {
  const { deps } = fakeDaemon(false);
  expect(await main(['fly'], deps)).toBe(2);
  expect(err.join('\n')).toContain(USAGE);
});

test('main_open_prints_markdown', async () => {
  const { daemon, deps } = fakeDaemon(false);
  expect(await main(['open', 'https://example.com'], deps)).toBe(0);
  expect(out).toEqual(['# Hello']);
  expect(daemon.spawned).toBe(1);
});

test('main_open_daemon_error_exits_1', async () => {
  writeState();
  const { deps } = fakeDaemon(true, [500, { error: 'net::ERR_NAME_NOT_RESOLVED' }]);
  expect(await main(['open', 'https://example.invalid'], deps)).toBe(1);
  expect(err).toEqual(['net::ERR_NAME_NOT_RESOLVED']);
  expect(out).toEqual([]);
});

test('main_search_prints_rendered_results', async () => {
  writeState();
  const { deps } = fakeDaemon(true);
  expect(await main(['search', 'playwright', '--limit', '1'], deps)).toBe(0);
  expect(out).toEqual([renderResults(RESULTS)]);
});

test('main_start_when_running_says_already_running', async () => {
  writeState();
  const { daemon, deps } = fakeDaemon(true);
  expect(await main(['start'], deps)).toBe(0);
  expect(out[0]).toMatch(/^already running: pid=42 port=7788 headless=true/);
  expect(daemon.spawned).toBe(0);
});

test('main_start_when_not_running_starts', async () => {
  const { daemon, deps } = fakeDaemon(false);
  expect(await main(['start', '--headless'], deps)).toBe(0);
  expect(out[0]).toMatch(/^running: pid=42 port=7788/);
  expect(daemon.spawned).toBe(1);
});

test('main_start_bad_flag_value_exits_2', async () => {
  const { deps } = fakeDaemon(false);
  expect(await main(['start', '--port', '0'], deps)).toBe(2);
  expect(err[0]).toContain('invalid value for port');
});

test('main_start_bad_config_file_exits_1', async () => {
  writeFileSync(join(home, 'config.json'), '{ not json');
  const { deps } = fakeDaemon(false);
  expect(await main(['start', '--port', '9000'], deps)).toBe(1);
  expect(err[0]).toContain('is not valid JSON');
});

test('main_stop_running_stops', async () => {
  writeState();
  const { daemon, deps } = fakeDaemon(true);
  expect(await main(['stop'], deps)).toBe(0);
  expect(out).toEqual(['stopped']);
  expect(daemon.alive).toBe(false);
});

test('main_stop_waits_until_state_file_gone', async () => {
  writeState();
  const { deps } = fakeDaemon(true);
  expect(await main(['stop'], deps)).toBe(0);
  expect(existsSync(join(home, 'daemon.json'))).toBe(false);
});

test('main_stop_daemon_still_there_after_wait_exits_1', async () => {
  writeState();
  const { deps } = fakeDaemon(true, undefined, true);
  expect(await main(['stop'], { ...deps, stopTimeoutMs: 20, stopPollMs: 1 })).toBe(1);
  expect(err[0]).toMatch(/still runs after/);
});

test('main_stop_not_running', async () => {
  const { deps } = fakeDaemon(false);
  expect(await main(['stop'], deps)).toBe(0);
  expect(out).toEqual(['not running']);
});

test('main_status_running_prints_fields', async () => {
  writeState();
  const { deps } = fakeDaemon(true);
  expect(await main(['status'], deps)).toBe(0);
  expect(out[0].split('\n')).toEqual(['pid: 42', 'port: 7788', 'headless: true', 'inFlight: 0']);
});

test('main_status_not_running_never_spawns', async () => {
  const { daemon, deps } = fakeDaemon(false);
  expect(await main(['status'], deps)).toBe(0);
  expect(out).toEqual(['not running']);
  expect(daemon.spawned).toBe(0);
});
