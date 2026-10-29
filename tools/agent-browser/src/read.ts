import type { BrowserContext } from 'playwright';
import TurndownService from 'turndown';

// head and title too: turndown parses a fragment, so the title text would leak in.
const BOILERPLATE_TAGS = ['head', 'title', 'script', 'style', 'noscript', 'iframe', 'nav', 'footer', 'aside'] as const;
const BOILERPLATE_ROLES = new Set(['banner', 'navigation', 'complementary']);
const BOILERPLATE_CLASSES = new Set([
  'ad', 'ads', 'advertisement', 'sidebar', 'comment', 'comments', 'social', 'share',
  'menu', 'header', 'footer', 'popup', 'modal',
]);

// turndown's Node build parses with its bundled DOM; filters get its elements.
function isBoilerplateByAttribute(node: HTMLElement): boolean {
  const role = node.getAttribute('role');
  if (role !== null && BOILERPLATE_ROLES.has(role.trim().toLowerCase())) return true;
  const classes = (node.getAttribute('class') ?? '').toLowerCase().split(/\s+/);
  return classes.some((name) => BOILERPLATE_CLASSES.has(name));
}

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
turndown.remove([...BOILERPLATE_TAGS]);
turndown.remove(isBoilerplateByAttribute);

export function pageToMarkdown(html: string): string {
  return turndown.turndown(html).trim();
}

export async function readPage(context: BrowserContext, url: string, timeoutMs = 30_000): Promise<string> {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    return await page.content();
  } finally {
    await page.close();
  }
}
