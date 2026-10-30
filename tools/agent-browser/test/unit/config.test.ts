import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, describe } from 'vitest';
import { resolveSettings } from '../../src/config.js';
import { homePaths } from '../../src/paths.js';

describe('tr2_config', () => {
let home: string;
const savedHome = process.env.AGENT_BROWSER_HOME;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), 'ab-tr2-'));
  process.env.AGENT_BROWSER_HOME = home;
});

afterEach(() => {
  rmSync(home, { recursive: true, force: true });
  if (savedHome === undefined) delete process.env.AGENT_BROWSER_HOME;
  else process.env.AGENT_BROWSER_HOME = savedHome;
});

function writeConfig(content: string): void {
  writeFileSync(join(home, 'config.json'), content);
}

test('test_tr2_defaults_when_no_file', () => {
  expect(resolveSettings({})).toEqual({
    profile: join(home, 'profile'),
    headless: false,
    idleMinutes: 10,
    port: 7788,
    concurrency: 4,
    channel: 'chrome',
  });
});

test('test_tr2_file_overrides_defaults', () => {
  writeConfig(JSON.stringify({ port: 9000, headless: true, idleMinutes: 0.5 }));

  const settings = resolveSettings({});

  expect(settings).toMatchObject({ port: 9000, headless: true, idleMinutes: 0.5, concurrency: 4 });
});

test('test_tr2_flags_override_file', () => {
  writeConfig(JSON.stringify({ port: 9000, concurrency: 2 }));

  const settings = resolveSettings({ port: 9100 });

  expect(settings).toMatchObject({ port: 9100, concurrency: 2 });
});

test('test_tr2_malformed_json_names_the_file', () => {
  writeConfig('{ not json');

  expect(() => resolveSettings({})).toThrow(join(home, 'config.json'));
});

test('test_tr2_unknown_key_rejected', () => {
  writeConfig(JSON.stringify({ colour: 'red' }));

  expect(() => resolveSettings({})).toThrow(/colour/);
});

test('test_tr2_negative_idle_rejected', () => {
  expect(() => resolveSettings({ idleMinutes: -1 })).toThrow(/idleMinutes.*-1/);
});

test('test_tr2_port_out_of_range_rejected', () => {
  writeConfig(JSON.stringify({ port: 70000 }));

  expect(() => resolveSettings({})).toThrow(/port.*70000/);
});

test('test_tr2_concurrency_zero_rejected', () => {
  expect(() => resolveSettings({ concurrency: 0 })).toThrow(/concurrency.*0/);
});

test('test_tr2_home_env_var_moves_all_paths', () => {
  expect(homePaths()).toEqual({
    config: join(home, 'config.json'),
    profile: join(home, 'profile'),
    state: join(home, 'daemon.json'),
    log: join(home, 'daemon.log'),
  });
});

test('test_tr2_default_home_without_env_var', () => {
  delete process.env.AGENT_BROWSER_HOME;
  expect(homePaths().config).toBe(join(homedir(), '.agent-browser', 'config.json'));
});
});

describe('tr13_config', () => {
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
});
