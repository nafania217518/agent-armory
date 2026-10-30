import { expect, test } from 'vitest';
import { searchBaseUrl } from '../../src/ops.js';
import { YAHOO_SEARCH } from '../../src/search.js';

// req: agent-browser/TR-10
test('search_url_defaults_to_yahoo', () => {
  expect(searchBaseUrl({})).toBe(YAHOO_SEARCH);
});

test('search_url_from_env', () => {
  expect(searchBaseUrl({ AGENT_BROWSER_SEARCH_URL: 'http://127.0.0.1:9/s?p=' })).toBe('http://127.0.0.1:9/s?p=');
});

test('empty_search_url_env_means_yahoo', () => {
  expect(searchBaseUrl({ AGENT_BROWSER_SEARCH_URL: '' })).toBe(YAHOO_SEARCH);
});
