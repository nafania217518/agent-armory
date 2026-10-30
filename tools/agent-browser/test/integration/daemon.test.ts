import { existsSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Settings } from '../../src/config.js';
import { createOps } from '../../src/ops.js';
import { runDaemon, type DaemonBrowser } from '../../src/server.js';
import { testSettings } from './helpers.js';

let home: string;

function freePort(): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), 'agent-browser-tr7-'));
  vi.stubEnv('AGENT_BROWSER_HOME', home);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

// req: agent-browser/TR-7
test('daemon_exits_when_browser_closes', async () => {
  let browser: DaemonBrowser | undefined;
  const launch = async (settings: Settings) => (browser = await createOps(settings));
  const run = runDaemon(testSettings({ port: await freePort() }), launch);
  const state = join(home, 'daemon.json');
  for (let i = 0; i < 300 && !existsSync(state); i++) await new Promise((r) => setTimeout(r, 100));
  expect(existsSync(state)).toBe(true);

  // Closing the context is what the browser does when its window is closed or it dies.
  await browser!.close();
  await run;

  expect(existsSync(state)).toBe(false);
}, 60_000);
