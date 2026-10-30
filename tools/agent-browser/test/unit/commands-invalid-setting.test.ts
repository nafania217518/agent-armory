import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { main } from '../../src/commands.js';

// The exit code must follow the error type and key, not the message text.
vi.mock('../../src/config.js', async (importActual) => {
  const actual = await importActual<typeof import('../../src/config.js')>();
  return {
    ...actual,
    resolveSettings: (flags: Record<string, unknown>) => {
      throw new actual.InvalidSetting('port' in flags ? 'port' : 'idleMinutes', 'some reworded text');
    },
  };
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// req: agent-browser/TR-10
test('reworded_invalid_flag_still_exits_2', async () => {
  expect(await main(['start', '--port', '0'])).toBe(2);
});

test('reworded_invalid_file_value_still_exits_1', async () => {
  expect(await main(['start', '--headless'])).toBe(1);
});
