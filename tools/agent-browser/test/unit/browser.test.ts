import { expect, test } from 'vitest';
import { closesStartupPage, launchOptions } from '../../src/browser.js';
import type { Settings } from '../../src/config.js';

const SETTINGS: Settings = {
  profile: '/tmp/profile',
  headless: true,
  idleMinutes: 10,
  port: 7788,
  concurrency: 4,
  channel: 'chrome',
};

// req: agent-browser/TR-8
test('sandbox_on_when_not_root', () => {
  const { args } = launchOptions(SETTINGS, 501);

  expect(args).not.toContain('--no-sandbox');
  expect(args).not.toContain('--disable-setuid-sandbox');
});

test('sandbox_off_when_root', () => {
  const { args } = launchOptions(SETTINGS, 0);

  expect(args).toContain('--no-sandbox');
  expect(args).toContain('--disable-setuid-sandbox');
});

test('sandbox_on_when_uid_unknown', () => {
  expect(launchOptions(SETTINGS, undefined).args).not.toContain('--no-sandbox');
});

test('chrome_channel_passed', () => {
  expect(launchOptions(SETTINGS, 501).channel).toBe('chrome');
});

test('chromium_takes_no_channel', () => {
  expect(launchOptions({ ...SETTINGS, channel: 'chromium' }, 501)).not.toHaveProperty('channel');
});

test('startup_page_closed_on_macos_headed', () => {
  expect(closesStartupPage(false, 'darwin')).toBe(true);
});

test('startup_page_closed_when_headless', () => {
  expect(closesStartupPage(true, 'linux')).toBe(true);
});

// Headed Chrome on Linux and Windows quits with its last window.
test('startup_page_kept_on_linux_headed', () => {
  expect(closesStartupPage(false, 'linux')).toBe(false);
});

test('startup_page_kept_on_windows_headed', () => {
  expect(closesStartupPage(false, 'win32')).toBe(false);
});
