import { expect, test } from 'vitest';
import { parseCommand } from '../../src/args.js';

test('test_tr13_channel_flag_on_start', () => {
  expect(parseCommand(['start', '--channel', 'chromium'])).toEqual({
    kind: 'start',
    flags: { channel: 'chromium' },
  });
});
