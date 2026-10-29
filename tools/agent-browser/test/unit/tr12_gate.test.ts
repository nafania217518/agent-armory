import { expect, test } from 'vitest';
import { Semaphore } from '../../src/gate.js';

test('test_tr12_semaphore_run_returns_fn_result_and_rethrows', async () => {
  const gate = new Semaphore(1);

  await expect(gate.run(async () => 42)).resolves.toBe(42);
  await expect(
    gate.run(async () => {
      throw new Error('boom');
    }),
  ).rejects.toThrow('boom');
  // The rejected run released its slot.
  await expect(gate.run(async () => 'next')).resolves.toBe('next');
});
