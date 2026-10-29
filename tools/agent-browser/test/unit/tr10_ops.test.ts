import { expect, test } from 'vitest';
import { searchBaseUrl } from '../../src/ops.js';
import { YAHOO_SEARCH } from '../../src/search.js';

test('test_tr10_search_url_defaults_to_yahoo', () => {
  expect(searchBaseUrl({})).toBe(YAHOO_SEARCH);
});

test('test_tr10_search_url_from_env', () => {
  expect(searchBaseUrl({ AGENT_BROWSER_SEARCH_URL: 'http://127.0.0.1:9/s?p=' })).toBe('http://127.0.0.1:9/s?p=');
});

test('test_tr10_empty_search_url_env_means_yahoo', () => {
  expect(searchBaseUrl({ AGENT_BROWSER_SEARCH_URL: '' })).toBe(YAHOO_SEARCH);
});
