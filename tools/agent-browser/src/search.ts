import type { BrowserContext } from 'playwright';

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

function escapeTitle(title: string): string {
  return title.replace(/[[\]]/g, '\\$&');
}

// encodeURI keeps parentheses, which end a markdown link, so encode them too.
function encodeUrl(url: string): string {
  return encodeURI(url).replace(/\(/g, '%28').replace(/\)/g, '%29');
}

export function renderResults(results: SearchResult[]): string {
  if (results.length === 0) return 'no results';
  return results
    .map((r, i) => `### ${i + 1}. [${escapeTitle(r.title)}](${encodeUrl(r.url)})\n${r.content}`)
    .join('\n\n');
}

export const YAHOO_SEARCH = 'https://search.yahoo.com/search?p=';
const MAX_PAGES = 2;

// tech-debt: coupled to Yahoo markup (.algo, .compTitle, .compText.aAbs, a.next); a markup change gives an empty list silently, upgrade the selectors (or move to a search API) when that happens.
// Coverage cannot see code that runs in the browser page; test_tr8_search_* cover it.
/* v8 ignore start */
/** Runs inside the page through page.evaluate, so it uses only the DOM. */
export function extractResults(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const node of document.querySelectorAll('.algo')) {
    const anchor = node.querySelector('.compTitle a');
    const url = anchor?.getAttribute('href');
    const title = anchor?.querySelector('h3 span, h3')?.textContent?.trim();
    if (!url || !title) continue;
    const content = node.querySelector('.compText.aAbs p')?.textContent?.trim() ?? '';
    results.push({ title, url, content });
  }
  return results;
}
/* v8 ignore stop */

export async function searchWeb(
  context: BrowserContext,
  opts: { query: string; limit: number; baseUrl: string },
): Promise<SearchResult[]> {
  const page = await context.newPage();
  try {
    await page.goto(opts.baseUrl + encodeURIComponent(opts.query), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    const results: SearchResult[] = [];
    for (let pageNumber = 1; ; pageNumber++) {
      results.push(...(await page.evaluate(extractResults)));
      if (results.length >= opts.limit || pageNumber >= MAX_PAGES) break;
      const next = await page.$('a.next');
      if (!next) break;
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), next.click()]);
    }
    return results.slice(0, opts.limit);
  } finally {
    await page.close();
  }
}
