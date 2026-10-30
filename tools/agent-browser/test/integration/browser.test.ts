import { afterAll, beforeAll, expect, test } from 'vitest';
import type { BrowserContext } from 'playwright';
import { launchBrowser } from '../../src/browser.js';
import { readPage } from '../../src/read.js';
import { searchWeb } from '../../src/search.js';
import { startFixtureServer, testSettings, type FixtureServer } from './helpers.js';

let server: FixtureServer;
let context: BrowserContext;
let searchBase: string;

beforeAll(async () => {
  server = await startFixtureServer();
  context = await launchBrowser(testSettings());
  // searchWeb appends the encoded query; a query string keeps the fixture path intact.
  searchBase = `${server.baseUrl}/yahoo-page1.html?p=`;
});

afterAll(async () => {
  await context.close();
  await server.close();
});

// req: agent-browser/TR-8
test('launch_leaves_no_blank_page', () => {
  expect(context.pages()).toHaveLength(0);
});

// Headed Chrome on Linux quits with its last window; the blank page keeps it alive.
test.skipIf(process.platform !== 'linux')('headed_linux_keeps_blank_page', async () => {
  const headed = await launchBrowser({ ...testSettings(), headless: false });
  try {
    expect(headed.pages()).toHaveLength(1);
  } finally {
    await headed.close();
  }
});

test('read_fixture_article', async () => {
  const html = await readPage(context, `${server.baseUrl}/article.html`);
  expect(html).toContain('<h1>Understanding Idle Timers</h1>');
});

test('read_unreachable_url_throws', async () => {
  await expect(readPage(context, 'http://127.0.0.1:1/')).rejects.toThrow();
});

test('read_timeout_throws', async () => {
  await expect(readPage(context, `${server.baseUrl}/slow`, 500)).rejects.toThrow(/Timeout/);
});

test('search_fixture_extracts_results', async () => {
  const results = await searchWeb(context, { query: 'playwright', limit: 3, baseUrl: searchBase });
  expect(results).toEqual([
    {
      title: 'Installation | Playwright',
      url: 'https://playwright.dev/docs/intro',
      content: 'Playwright Test is an end-to-end test framework for modern web apps.',
    },
    {
      title: 'Playwright (software) - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Playwright_(software)',
      content: 'Playwright is an open-source automation library for browser testing.',
    },
    {
      title: 'GitHub - microsoft/playwright',
      url: 'https://github.com/microsoft/playwright',
      content: 'Playwright is a framework for Web Testing and Automation.',
    },
  ]);
});

test('search_stops_at_limit', async () => {
  const results = await searchWeb(context, { query: 'playwright', limit: 2, baseUrl: searchBase });
  expect(results.map((r) => r.title)).toEqual(['Installation | Playwright', 'Playwright (software) - Wikipedia']);
});

// Page 2 links back to page 1, so only MAX_PAGES ends this search.
test('search_follows_next_until_two_pages', async () => {
  const results = await searchWeb(context, { query: 'playwright', limit: 10, baseUrl: searchBase });
  expect(results).toHaveLength(6);
  expect(results[5].title).toBe('Playwright for Python');
});

test('search_no_next_link_stops', async () => {
  const base = `${server.baseUrl}/yahoo-last.html?p=`;
  const results = await searchWeb(context, { query: 'playwright', limit: 10, baseUrl: base });
  expect(results.map((r) => r.title)).toEqual([
    'BrowserContext | Playwright',
    'playwright - npm',
    'Playwright for Python',
  ]);
});

test('pages_closed_after_each_call', async () => {
  const before = context.pages().length;
  await readPage(context, `${server.baseUrl}/article.html`);
  await readPage(context, 'http://127.0.0.1:1/').catch(() => undefined);
  await searchWeb(context, { query: 'playwright', limit: 10, baseUrl: searchBase });
  expect(context.pages().length).toBe(before);
});

test('cookie_survives_relaunch_on_same_profile', async () => {
  const settings = testSettings();
  const first = await launchBrowser(settings);
  await readPage(first, `${server.baseUrl}/set-cookie`);
  await first.close();

  const second = await launchBrowser(settings);
  try {
    const html = await readPage(second, `${server.baseUrl}/cookies`);
    expect(html).toContain('ab=1');
  } finally {
    await second.close();
  }
});
