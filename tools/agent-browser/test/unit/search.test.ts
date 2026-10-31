import { expect, test } from 'vitest';
import { renderResults } from '../../src/search.js';

// req: agent-browser/TR-5
test('renders_numbered_markdown', () => {
  const results = [
    { title: 'One', url: 'https://a.example/x y', content: 'first' },
    { title: 'Two', url: 'https://b.example/', content: 'second' },
  ];

  expect(renderResults(results)).toBe(
    '### 1. [One](https://a.example/x%20y)\nfirst\n\n### 2. [Two](https://b.example/)\nsecond',
  );
});

test('empty_list_says_no_results', () => {
  expect(renderResults([])).toBe('no results');
});

test('title_with_brackets_is_escaped', () => {
  const results = [{ title: 'a [b] c', url: 'https://c.example/(p)', content: 'x' }];

  expect(renderResults(results)).toBe('### 1. [a \\[b\\] c](https://c.example/%28p%29)\nx');
});

// req: rebuild-skills/TR-11
test('already_encoded_url_is_kept', () => {
  const results = [{ title: 'Cafe', url: 'https://en.wikipedia.org/wiki/Caf%C3%A9', content: 'x' }];

  expect(renderResults(results)).toBe('### 1. [Cafe](https://en.wikipedia.org/wiki/Caf%C3%A9)\nx');
});

// req: rebuild-skills/TR-11
test('parentheses_are_encoded', () => {
  const results = [{ title: 'P', url: 'https://c.example/a b(c)', content: 'x' }];

  expect(renderResults(results)).toBe('### 1. [P](https://c.example/a%20b%28c%29)\nx');
});
