import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { pageToMarkdown } from '../../src/read.js';

const article = readFileSync(new URL('../fixtures/article.html', import.meta.url), 'utf8');

test('test_tr4_article_fixture_keeps_headings_paragraphs_links_lists', () => {
  const markdown = pageToMarkdown(article);

  expect(markdown).toContain('# Understanding Idle Timers');
  expect(markdown).toContain('## How it works');
  expect(markdown).toContain('An idle timer fires after a _quiet_ period');
  expect(markdown).toContain('`begin()`');
  expect(markdown).toMatch(/-\s+Arm only at zero in-flight requests/);
  expect(markdown).toContain('[Node timers docs](https://nodejs.org/api/timers.html)');
});

test('test_tr4_nav_footer_script_removed', () => {
  const markdown = pageToMarkdown(article);

  for (const marker of ['NAV_BLOG_LINK', 'FOOTER_TEXT', 'TRACKING_SCRIPT', 'BODY_SCRIPT',
    'font-family', 'NOSCRIPT_TEXT', 'IFRAME_TEXT', 'ASIDE_TEXT']) {
    expect(markdown).not.toContain(marker);
  }
});

test('test_tr4_role_and_class_boilerplate_removed', () => {
  const markdown = pageToMarkdown(article);

  for (const marker of ['ROLE_BANNER_TEXT', 'ROLE_COMPLEMENTARY_TEXT', 'SIDEBAR_TEXT',
    'SHARE_BUTTONS_TEXT', 'COMMENTS_TEXT', 'ADS_TEXT']) {
    expect(markdown).not.toContain(marker);
  }
});

test('test_tr4_empty_body_gives_empty_string', () => {
  const html = '<!doctype html><html><head><title>t</title></head><body></body></html>';

  expect(pageToMarkdown(html)).toBe('');
});

test('test_tr4_malformed_html_does_not_throw', () => {
  const markdown = pageToMarkdown('<div><p>Unclosed <b>bold <nav>x</div></span><h2>Title');

  expect(markdown).toContain('Unclosed');
});
