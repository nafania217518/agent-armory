import { launchBrowser } from './browser.js';
import type { Settings } from './config.js';
import { pageToMarkdown, readPage } from './read.js';
import { searchWeb, YAHOO_SEARCH } from './search.js';
import type { DaemonBrowser } from './server.js';

// Test seam: the integration suite points search at a loopback fixture.
export function searchBaseUrl(env: NodeJS.ProcessEnv): string {
  return env.AGENT_BROWSER_SEARCH_URL || YAHOO_SEARCH;
}

/** Launches the browser and binds the daemon operations to it. */
export async function createOps(settings: Settings): Promise<DaemonBrowser> {
  const context = await launchBrowser(settings);
  const baseUrl = searchBaseUrl(process.env);
  return {
    ops: {
      read: (url) => readPage(context, url).then(pageToMarkdown),
      search: (query, limit) => searchWeb(context, { query, limit, baseUrl }),
    },
    close: () => context.close(),
    // The user closed the window, or the browser died.
    closed: new Promise((resolve) => context.once('close', () => resolve())),
  };
}
