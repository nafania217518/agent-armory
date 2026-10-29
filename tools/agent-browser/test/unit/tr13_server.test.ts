import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { startServer } from '../../src/server.js';

test('test_tr13_status_reports_channel', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tr13-'));
  const server = await startServer({
    settings: { profile: '/p', headless: true, idleMinutes: 10, port: 0, concurrency: 1, channel: 'chromium' },
    ops: { read: async () => '', search: async () => [] },
  });

  try {
    const body = await (await fetch(`http://127.0.0.1:${server.port}/status`)).json();

    expect(body.channel).toBe('chromium');
  } finally {
    await server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
