import { expect, test, describe } from 'vitest';
import { parseCommand, UsageError } from '../../src/args.js';

// req: agent-browser/TR-3
describe('parseCommand', () => {
test('open_parses_url', () => {
  expect(parseCommand(['open', 'https://example.com/a'])).toEqual({
    kind: 'open',
    url: 'https://example.com/a',
  });
});

test('search_parses_query_and_limit', () => {
  expect(parseCommand(['search', 'node streams', '--limit', '3'])).toEqual({
    kind: 'search',
    query: 'node streams',
    limit: 3,
  });
});

test('search_limit_defaults_to_5', () => {
  expect(parseCommand(['search', 'x'])).toEqual({ kind: 'search', query: 'x', limit: 5 });
});

test('search_limit_not_a_number_is_usage_error', () => {
  expect(() => parseCommand(['search', 'x', '--limit', 'abc'])).toThrow(UsageError);
});

test('search_limit_zero_is_usage_error', () => {
  expect(() => parseCommand(['search', 'x', '--limit', '0'])).toThrow(UsageError);
});

test('start_parses_setting_flags', () => {
  const command = parseCommand([
    'start', '--profile', '/p', '--headless', '--idle', '0.5', '--port', '9000', '--concurrency', '2',
  ]);

  expect(command).toEqual({
    kind: 'start',
    flags: { profile: '/p', headless: true, idleMinutes: 0.5, port: 9000, concurrency: 2 },
  });
});

test('start_headed_sets_headless_false', () => {
  expect(parseCommand(['start', '--headed'])).toEqual({ kind: 'start', flags: { headless: false } });
});

test('start_headless_with_headed_is_usage_error', () => {
  expect(() => parseCommand(['start', '--headless', '--headed'])).toThrow(UsageError);
});

test('start_port_not_a_number_passes_to_config', () => {
  const command = parseCommand(['start', '--port', 'abc']);

  expect(command.kind === 'start' && Number.isNaN(command.flags.port)).toBe(true);
});

test('stop_and_status_parse', () => {
  expect([parseCommand(['stop']), parseCommand(['status'])]).toEqual([{ kind: 'stop' }, { kind: 'status' }]);
});

test('settings_flags_on_open_are_usage_error', () => {
  expect(() => parseCommand(['open', 'https://example.com', '--port', '9000'])).toThrow(UsageError);
});

test('unknown_command_is_usage_error', () => {
  expect(() => parseCommand(['fly'])).toThrow(UsageError);
});

test('no_command_is_usage_error', () => {
  expect(() => parseCommand([])).toThrow(UsageError);
});

test('open_without_url_is_usage_error', () => {
  expect(() => parseCommand(['open'])).toThrow(UsageError);
});

test('search_without_query_is_usage_error', () => {
  expect(() => parseCommand(['search'])).toThrow(UsageError);
});

test('invalid_url_is_usage_error', () => {
  expect(() => parseCommand(['open', 'not a url'])).toThrow(UsageError);
});

test('non_http_url_is_usage_error', () => {
  expect(() => parseCommand(['open', 'file:///etc/passwd'])).toThrow(UsageError);
});

test('usage_error_holds_usage_text', () => {
  expect(() => parseCommand(['fly'])).toThrow(/usage: agent-browser/);
});
});

// req: agent-browser/TR-13
describe('parseCommand channel flag', () => {
test('channel_flag_on_start', () => {
  expect(parseCommand(['start', '--channel', 'chromium'])).toEqual({
    kind: 'start',
    flags: { channel: 'chromium' },
  });
});
});
