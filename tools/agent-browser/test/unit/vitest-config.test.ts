import { expect, test } from 'vitest';
import config from '../../vitest.config.js';

// req: agent-browser/TR-1
test('coverage_config_fails_under_90', () => {
  const thresholds = config.test?.coverage?.thresholds;

  expect(thresholds).toEqual({ lines: 90, branches: 90, functions: 90, statements: 90, perFile: true });
});
