import { expect, test } from 'vitest';
import { launchOptions } from '../../src/browser.js';
import type { Settings } from '../../src/config.js';

const SETTINGS: Settings = {
  profile: '/tmp/profile',
  headless: true,
  idleMinutes: 10,
  port: 7788,
  concurrency: 4,
  channel: 'chrome',
};

test('test_tr8_sandbox_on_when_not_root', () => {
  const { args } = launchOptions(SETTINGS, 501);

  expect(args).not.toContain('--no-sandbox');
  expect(args).not.toContain('--disable-setuid-sandbox');
});

test('test_tr8_sandbox_off_when_root', () => {
  const { args } = launchOptions(SETTINGS, 0);

  expect(args).toContain('--no-sandbox');
  expect(args).toContain('--disable-setuid-sandbox');
});

test('test_tr8_sandbox_on_when_uid_unknown', () => {
  expect(launchOptions(SETTINGS, undefined).args).not.toContain('--no-sandbox');
});

test('test_tr8_chrome_channel_passed', () => {
  expect(launchOptions(SETTINGS, 501).channel).toBe('chrome');
});

test('test_tr8_chromium_takes_no_channel', () => {
  expect(launchOptions({ ...SETTINGS, channel: 'chromium' }, 501)).not.toHaveProperty('channel');
});
