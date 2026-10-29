import { expect, test } from 'vitest';
import { parseCommand, UsageError } from '../../src/args.js';

test('test_tr3_open_parses_url', () => {
  expect(parseCommand(['open', 'https://example.com/a'])).toEqual({
    kind: 'open',
    url: 'https://example.com/a',
  });
});

test('test_tr3_search_parses_query_and_limit', () => {
  expect(parseCommand(['search', 'node streams', '--limit', '3'])).toEqual({
    kind: 'search',
    query: 'node streams',
    limit: 3,
  });
});

test('test_tr3_search_limit_defaults_to_5', () => {
  expect(parseCommand(['search', 'x'])).toEqual({ kind: 'search', query: 'x', limit: 5 });
});

test('test_tr3_search_limit_not_a_number_is_usage_error', () => {
  expect(() => parseCommand(['search', 'x', '--limit', 'abc'])).toThrow(UsageError);
});

test('test_tr3_search_limit_zero_is_usage_error', () => {
  expect(() => parseCommand(['search', 'x', '--limit', '0'])).toThrow(UsageError);
});

test('test_tr3_start_parses_setting_flags', () => {
  const command = parseCommand([
    'start', '--profile', '/p', '--headless', '--idle', '0.5', '--port', '9000', '--concurrency', '2',
  ]);

  expect(command).toEqual({
    kind: 'start',
    flags: { profile: '/p', headless: true, idleMinutes: 0.5, port: 9000, concurrency: 2 },
  });
});

test('test_tr3_start_headed_sets_headless_false', () => {
  expect(parseCommand(['start', '--headed'])).toEqual({ kind: 'start', flags: { headless: false } });
});

test('test_tr3_start_headless_with_headed_is_usage_error', () => {
  expect(() => parseCommand(['start', '--headless', '--headed'])).toThrow(UsageError);
});

test('test_tr3_start_port_not_a_number_passes_to_config', () => {
  const command = parseCommand(['start', '--port', 'abc']);

  expect(command.kind === 'start' && Number.isNaN(command.flags.port)).toBe(true);
});

test('test_tr3_stop_and_status_parse', () => {
  expect([parseCommand(['stop']), parseCommand(['status'])]).toEqual([{ kind: 'stop' }, { kind: 'status' }]);
});

test('test_tr3_settings_flags_on_open_are_usage_error', () => {
  expect(() => parseCommand(['open', 'https://example.com', '--port', '9000'])).toThrow(UsageError);
});

test('test_tr3_unknown_command_is_usage_error', () => {
  expect(() => parseCommand(['fly'])).toThrow(UsageError);
});

test('test_tr3_no_command_is_usage_error', () => {
  expect(() => parseCommand([])).toThrow(UsageError);
});

test('test_tr3_open_without_url_is_usage_error', () => {
  expect(() => parseCommand(['open'])).toThrow(UsageError);
});

test('test_tr3_search_without_query_is_usage_error', () => {
  expect(() => parseCommand(['search'])).toThrow(UsageError);
});

test('test_tr3_invalid_url_is_usage_error', () => {
  expect(() => parseCommand(['open', 'not a url'])).toThrow(UsageError);
});

test('test_tr3_non_http_url_is_usage_error', () => {
  expect(() => parseCommand(['open', 'file:///etc/passwd'])).toThrow(UsageError);
});

test('test_tr3_usage_error_holds_usage_text', () => {
  expect(() => parseCommand(['fly'])).toThrow(/usage: agent-browser/);
});
