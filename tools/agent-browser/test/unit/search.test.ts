import { expect, test } from 'vitest';
import { renderResults } from '../../src/search.js';

test('test_tr5_renders_numbered_markdown', () => {
  const results = [
    { title: 'One', url: 'https://a.example/x y', content: 'first' },
    { title: 'Two', url: 'https://b.example/', content: 'second' },
  ];

  expect(renderResults(results)).toBe(
    '### 1. [One](https://a.example/x%20y)\nfirst\n\n### 2. [Two](https://b.example/)\nsecond',
  );
});

test('test_tr5_empty_list_says_no_results', () => {
  expect(renderResults([])).toBe('no results');
});

test('test_tr5_title_with_brackets_is_escaped', () => {
  const results = [{ title: 'a [b] c', url: 'https://c.example/(p)', content: 'x' }];

  expect(renderResults(results)).toBe('### 1. [a \\[b\\] c](https://c.example/%28p%29)\nx');
});
