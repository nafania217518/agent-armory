import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import { createOps } from '../../src/ops.js';
import { startFixtureServer, testSettings, type FixtureServer } from './helpers.js';

let fixtures: FixtureServer;
let browser: Awaited<ReturnType<typeof createOps>>;

beforeAll(async () => {
  fixtures = await startFixtureServer();
  vi.stubEnv('AGENT_BROWSER_SEARCH_URL', `${fixtures.baseUrl}/yahoo-page1.html?p=`);
  browser = await createOps(testSettings());
}, 60_000);

afterAll(async () => {
  vi.unstubAllEnvs();
  await fixtures.close();
});

// req: agent-browser/TR-10
test('ops_read_returns_markdown', async () => {
  const markdown = await browser.ops.read(`${fixtures.baseUrl}/article.html`);
  expect(markdown).toMatch(/^Understanding Idle Timers\n=+|^# Understanding Idle Timers/m);
});

test('ops_search_uses_the_search_url', async () => {
  const results = await browser.ops.search('playwright', 2);
  expect(results).toHaveLength(2);
  expect(results[0].title).not.toBe('');
});

test('ops_close_closes_the_browser', async () => {
  await browser.close();
  await expect(browser.ops.read(`${fixtures.baseUrl}/article.html`)).rejects.toThrow(/closed/i);
});
