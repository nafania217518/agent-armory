import { mkdirSync } from 'node:fs';
import type { BrowserContext } from 'playwright';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Settings } from './config.js';

chromium.use(StealthPlugin());

const ARGS = ['--disable-blink-features=AutomationControlled', '--disable-infobars', '--disable-gpu'];
// Chrome cannot sandbox as root (the test container); on the host the sandbox stays on.
const ROOT_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];

/** The launch options for the settings; uid is the process user id (undefined off POSIX). */
export function launchOptions(settings: Settings, uid: number | undefined) {
  return {
    headless: settings.headless,
    // chromium means Playwright's bundled browser, which takes no channel.
    ...(settings.channel === 'chrome' ? { channel: 'chrome' } : {}),
    viewport: { width: 1280, height: 720 },
    args: uid === 0 ? [...ARGS, ...ROOT_ARGS] : ARGS,
  };
}

/** Opens the persistent profile; take pages from context.newPage(), never browser().newPage(). */
export async function launchBrowser(settings: Settings): Promise<BrowserContext> {
  mkdirSync(settings.profile, { recursive: true });
  const context = await chromium.launchPersistentContext(settings.profile, launchOptions(settings, process.getuid?.()));
  // The persistent context opens with a blank page; every call opens its own.
  if (closesStartupPage(settings.headless, process.platform)) {
    await Promise.all(context.pages().map((page) => page.close()));
  }
  return context;
}

/** Chrome outlives its last window only when headless or on macOS; elsewhere the blank page keeps it alive. */
export function closesStartupPage(headless: boolean, platform: NodeJS.Platform): boolean {
  return headless || platform === 'darwin';
}
