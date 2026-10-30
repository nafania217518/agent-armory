import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, test, describe } from 'vitest';
import { resolveSettings } from '../../src/config.js';
import { homePaths } from '../../src/paths.js';

// req: agent-browser/TR-2
describe('resolveSettings', () => {
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

test('defaults_when_no_file', () => {
  expect(resolveSettings({})).toEqual({
    profile: join(home, 'profile'),
    headless: false,
    idleMinutes: 10,
    port: 7788,
    concurrency: 4,
    channel: 'chrome',
  });
});

test('file_overrides_defaults', () => {
  writeConfig(JSON.stringify({ port: 9000, headless: true, idleMinutes: 0.5 }));

  const settings = resolveSettings({});

  expect(settings).toMatchObject({ port: 9000, headless: true, idleMinutes: 0.5, concurrency: 4 });
});

test('flags_override_file', () => {
  writeConfig(JSON.stringify({ port: 9000, concurrency: 2 }));

  const settings = resolveSettings({ port: 9100 });

  expect(settings).toMatchObject({ port: 9100, concurrency: 2 });
});

test('malformed_json_names_the_file', () => {
  writeConfig('{ not json');

  expect(() => resolveSettings({})).toThrow(join(home, 'config.json'));
});

test('unknown_key_rejected', () => {
  writeConfig(JSON.stringify({ colour: 'red' }));

  expect(() => resolveSettings({})).toThrow(/colour/);
});

test('negative_idle_rejected', () => {
  expect(() => resolveSettings({ idleMinutes: -1 })).toThrow(/idleMinutes.*-1/);
});

test('port_out_of_range_rejected', () => {
  writeConfig(JSON.stringify({ port: 70000 }));

  expect(() => resolveSettings({})).toThrow(/port.*70000/);
});

test('concurrency_zero_rejected', () => {
  expect(() => resolveSettings({ concurrency: 0 })).toThrow(/concurrency.*0/);
});

test('home_env_var_moves_all_paths', () => {
  expect(homePaths()).toEqual({
    config: join(home, 'config.json'),
    profile: join(home, 'profile'),
    state: join(home, 'daemon.json'),
    log: join(home, 'daemon.log'),
  });
});

test('default_home_without_env_var', () => {
  delete process.env.AGENT_BROWSER_HOME;
  expect(homePaths().config).toBe(join(homedir(), '.agent-browser', 'config.json'));
});
});

// req: agent-browser/TR-13
describe('resolveSettings channel', () => {
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

test('channel_default_chrome', () => {
  expect(resolveSettings({}).channel).toBe('chrome');
});

test('channel_chromium_from_file', () => {
  writeFileSync(join(home, 'config.json'), JSON.stringify({ channel: 'chromium' }));

  expect(resolveSettings({}).channel).toBe('chromium');
});

test('channel_invalid_rejected', () => {
  writeFileSync(join(home, 'config.json'), JSON.stringify({ channel: 'firefox' }));

  expect(() => resolveSettings({})).toThrow(/channel.*firefox/);
});
});
