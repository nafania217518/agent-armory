import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { resolveSettings } from '../../src/config.js';

let home: string;
const savedHome = process.env.AGENT_BROWSER_HOME;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), 'ab-tr13-'));
  process.env.AGENT_BROWSER_HOME = home;
});

afterEach(() => {
  rmSync(home, { recursive: true, force: true });
  if (savedHome === undefined) delete process.env.AGENT_BROWSER_HOME;
  else process.env.AGENT_BROWSER_HOME = savedHome;
});

test('test_tr13_channel_default_chrome', () => {
  expect(resolveSettings({}).channel).toBe('chrome');
});

test('test_tr13_channel_chromium_from_file', () => {
  writeFileSync(join(home, 'config.json'), JSON.stringify({ channel: 'chromium' }));

  expect(resolveSettings({}).channel).toBe('chromium');
});

test('test_tr13_channel_invalid_rejected', () => {
  writeFileSync(join(home, 'config.json'), JSON.stringify({ channel: 'firefox' }));

  expect(() => resolveSettings({})).toThrow(/channel.*firefox/);
});
