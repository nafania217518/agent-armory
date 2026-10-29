import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { mkdtempSync, readFile } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Channel, Settings } from '../../src/config.js';

const FIXTURES = fileURLToPath(new URL('../fixtures/', import.meta.url));

export interface FixtureServer {
  baseUrl: string;
  close(): Promise<void>;
}

/** Serves test/fixtures/* on loopback, plus /set-cookie, /cookies and /slow (never answers). */
export async function startFixtureServer(): Promise<FixtureServer> {
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://x').pathname;
    if (path === '/slow') return;
    if (path === '/set-cookie') {
      // Max-Age: Chrome drops session cookies on close, so a persistent cookie proves the profile.
      res.writeHead(200, { 'Set-Cookie': 'ab=1; Path=/; Max-Age=3600', 'Content-Type': 'text/html' });
      res.end('<html><body>cookie set</body></html>');
      return;
    }
    if (path === '/cookies') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<html><body>${req.headers.cookie ?? ''}</body></html>`);
      return;
    }
    readFile(join(FIXTURES, basename(path)), (error, data) => {
      if (error) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(data);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

export function testSettings(overrides: Partial<Settings> = {}): Settings {
  return {
    profile: mkdtempSync(join(tmpdir(), 'agent-browser-profile-')),
    headless: true,
    idleMinutes: 10,
    port: 7788,
    concurrency: 4,
    channel: (process.env.AGENT_BROWSER_TEST_CHANNEL ?? 'chrome') as Channel,
    ...overrides,
  };
}
