---
name: research
description: >
  How to research a technical claim: official sources first, independent sources next,
  dates, disagreements, the result format and the report slots. Load for any fact about a
  library, API, model, tool or domain that may be outdated, for the plan's research step,
  and in the researcher agent. Use for "check the docs", "is this still true", "research
  this", "/research".
max-lines: 55
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# research

How to check a claim against sources. Main session delegates; researcher reads.

## 1. When to research

- A claim that can be outdated is a hypothesis until a source confirms it. It MUST go to
  research when plan or code depends on it and installed source, types or repo docs do
  not settle it.
- A claim about a library's runtime behavior (a default, thread pool, order, version
  difference) MUST cite its source: the file in the dependency cache, official docs, or a
  run. Else it MUST carry the `Unverified:` part (`review` §Output).
- Main session MUST delegate web search and page reading to an agent on a research row
  (`delegate` §Models). Raw page text MUST NOT enter main context.
- The agent MUST return only the result of §Result. Subagent MUST do the web work itself
  (`delegate` §What each agent returns).

## 2. Sources

- MUST read official docs, changelog or source code first.
- When official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent. An agent on
  a Sonnet research row MUST skip that read, mark that question `sources disagree` and
  answer the rest. Main session MUST re-spawn only the disputed questions on the Opus
  research row.
- MUST note each source's date. SHOULD prefer newest primary source. Older primary source
  SHOULD beat a newer secondary one.
- When sources disagree, MUST say so, name the source you trust and say why.
- An agent on the web-read row MUST read only the pages its brief names, in place of the
  source order above; each answer MUST quote its passage or say `not on the page`.
  A question whose pages disagree MUST still take `sources disagree`.

## 3. Result

Result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: confirmed, likely, or open.
   With several questions or facts, the result MUST hold one claim line per question
   or fact, each with its confidence.
2. The sources, one per line: title, URL, date, what it says.
3. The recorded-items slot and the caveat slot (`core` §Reports).
