import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { startFixtureServer, type FixtureServer } from './helpers.js';

const CLI = fileURLToPath(new URL('../../dist/cli.js', import.meta.url));
const CHANNEL = process.env.AGENT_BROWSER_TEST_CHANNEL ?? 'chrome';

interface Run {
  code: number;
  stdout: string;
  stderr: string;
}

let fixtures: FixtureServer;
let home: string;
let port: number;

function freePort(): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
}

function writeConfig(overrides: Record<string, unknown> = {}): void {
  const config = { headless: true, idleMinutes: 0.05, port, channel: CHANNEL, ...overrides };
  writeFileSync(join(home, 'config.json'), JSON.stringify(config));
}

function cli(...args: string[]): Promise<Run> {
  const env = {
    ...process.env,
    AGENT_BROWSER_HOME: home,
    AGENT_BROWSER_SEARCH_URL: `${fixtures.baseUrl}/yahoo-page1.html?p=`,
  };
  return new Promise((resolve) => {
    execFile(process.execPath, [CLI, ...args], { env }, (error, stdout, stderr) => {
      resolve({ code: error ? Number(error.code) : 0, stdout, stderr });
    });
  });
}

function statePath(): string {
  return join(home, 'daemon.json');
}

async function waitFor(check: () => boolean, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return check();
}

/** Daemon processes of this test's home: the spawn argv holds the profile path under it. */
function daemonCount(): Promise<number> {
  return new Promise((resolve) => {
    execFile('ps', ['-ax', '-o', 'command'], (_error, stdout) => {
      resolve(stdout.split('\n').filter((line) => line.includes('daemon.js') && line.includes(home)).length);
    });
  });
}

beforeAll(async () => {
  fixtures = await startFixtureServer();
});

afterAll(async () => {
  await fixtures.close();
});

beforeEach(async () => {
  home = mkdtempSync(join(tmpdir(), 'agent-browser-tr10-'));
  port = await freePort();
  writeConfig();
});

afterEach(async () => {
  const pid = existsSync(statePath()) ? (JSON.parse(readFileSync(statePath(), 'utf8')) as { pid: number }).pid : null;
  const { code } = await cli('stop');
  if (code !== 0 && pid !== null) process.kill(pid, 'SIGTERM');
}, 20_000);

test('test_tr10_open_prints_markdown_and_wakes_daemon', async () => {
  const run = await cli('open', `${fixtures.baseUrl}/article.html`);
  expect(run.code).toBe(0);
  expect(run.stdout).toContain('Understanding Idle Timers');
  expect(existsSync(statePath())).toBe(true);
}, 60_000);

test('test_tr10_search_prints_rendered_list', async () => {
  const run = await cli('search', 'playwright', '--limit', '2');
  expect(run.code).toBe(0);
  expect(run.stdout).toMatch(/^### 1\. \[/);
  expect(run.stdout).toContain('### 2. [');
  expect(run.stdout).not.toContain('### 3. [');
}, 60_000);

test('test_tr10_daemon_exits_after_idle_and_removes_state', async () => {
  expect((await cli('open', `${fixtures.baseUrl}/article.html`)).code).toBe(0);
  expect(existsSync(statePath())).toBe(true);
  expect(await waitFor(() => !existsSync(statePath()), 15_000)).toBe(true);
  expect((await cli('status')).stdout.trim()).toBe('not running');
  expect(await daemonCount()).toBe(0);
}, 60_000);

test('test_tr10_two_concurrent_opens_one_daemon', async () => {
  writeConfig({ idleMinutes: 1 });
  const url = `${fixtures.baseUrl}/article.html`;
  const runs = await Promise.all([cli('open', url), cli('open', url)]);
  expect(runs.map((run) => run.code)).toEqual([0, 0]);
  // The losing daemon fails to bind and exits before it launches a browser.
  let count = await daemonCount();
  const deadline = Date.now() + 15_000;
  while (count > 1 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    count = await daemonCount();
  }
  expect(count).toBe(1);
}, 60_000);

test('test_tr10_stop_when_not_running_exits_0', async () => {
  const run = await cli('stop');
  expect(run.code).toBe(0);
  expect(run.stdout.trim()).toBe('not running');
});

test('test_tr10_start_headless_shows_in_status', async () => {
  writeConfig({ headless: false, idleMinutes: 1 });
  const start = await cli('start', '--headless');
  expect(start.code).toBe(0);
  expect(start.stdout).toMatch(/^running: .*headless=true/);
  expect((await cli('status')).stdout).toContain('headless: true');
}, 60_000);

// Headed needs a display: the Docker service runs under xvfb; on the host it would open a window.
test.skipIf(process.platform !== 'linux')('test_tr10_start_headed_shows_in_status', async () => {
  writeConfig({ headless: true, idleMinutes: 1 });
  expect((await cli('start', '--headed')).code).toBe(0);
  expect((await cli('status')).stdout).toContain('headless: false');
}, 60_000);

test('test_tr10_start_twice_reports_already_running', async () => {
  writeConfig({ idleMinutes: 1 });
  expect((await cli('start')).code).toBe(0);
  const second = await cli('start');
  expect(second.code).toBe(0);
  expect(second.stdout).toMatch(new RegExp(`^already running: .*port=${port}`));
}, 60_000);

test('test_tr10_open_bad_url_exit_1_message_on_stderr', async () => {
  const run = await cli('open', 'http://127.0.0.1:1/');
  expect(run.code).toBe(1);
  expect(run.stderr).toMatch(/net::ERR_/);
  expect(run.stdout).toBe('');
}, 60_000);

test('test_tr10_status_not_running', async () => {
  const run = await cli('status');
  expect(run.code).toBe(0);
  expect(run.stdout.trim()).toBe('not running');
  expect(existsSync(statePath())).toBe(false);
});

test('test_tr12_eight_parallel_opens_all_succeed', async () => {
  writeConfig({ idleMinutes: 1 });
  const url = `${fixtures.baseUrl}/article.html`;
  expect((await cli('start')).code).toBe(0);
  const runs = await Promise.all(Array.from({ length: 8 }, () => cli('open', url)));
  for (const run of runs) {
    expect(run.code).toBe(0);
    expect(run.stdout).toContain('Understanding Idle Timers');
  }
}, 90_000);

// In-flight back to 0 shows every slot was released; test_tr8_pages_closed_after_each_call covers pages.
test('test_tr12_in_flight_back_to_zero_after_parallel_calls', async () => {
  writeConfig({ idleMinutes: 1 });
  const url = `${fixtures.baseUrl}/article.html`;
  expect((await cli('start')).code).toBe(0);
  await Promise.all(Array.from({ length: 6 }, () => cli('open', url)));
  expect((await cli('status')).stdout).toContain('inFlight: 0');
}, 90_000);
