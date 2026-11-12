---
name: research
description: >
  How to research a technical claim: official sources first, independent sources next,
  dates, disagreements, the result format and the report slots. Load for any fact about a
  library, API, model, tool or domain that may be outdated, for the plan's research step,
  and in the researcher agent. Use for "check the docs", "is this still true", "research
  this", "/research".
max-lines: 58
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# research

How to check a claim against sources. The main session delegates; the researcher reads.

## 1. When to research

- A claim that can be outdated is a hypothesis until a source confirms it. It MUST go
  to research when the plan or the code depends on it and the installed source, the
  types or the repo docs do not settle it.
- A claim about a library's runtime behavior (a default, a thread pool, an order, a
  version difference) MUST cite its source: the file in the dependency cache, the
  official docs, or a run. Else it MUST carry the `Unverified:` part (`review` section
  Output).
- The main session MUST delegate web search and page reading to an agent on a research
  row (`delegate` section Models). Raw page text MUST NOT enter the main context.
- The agent MUST return only the result of section Result. A subagent MUST do the web
  work itself (`delegate` section What each agent returns).

## 2. Sources

- MUST read the official documentation, changelog or source code first.
- When the official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent. An agent
  on the Sonnet research row MUST stop there instead and report `sources disagree`. The
  main session MUST then re-spawn it on the Opus research row.
- MUST note the date of each source. SHOULD prefer the newest primary source. An older
  primary source SHOULD beat a newer secondary one.
- When sources disagree, MUST say so, name the source you trust, and say why.

## 3. Result

The result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: confirmed, likely, or open.
2. The sources, one per line: title, URL, date, what it says.
3. The recorded-items slot and the caveat slot (`core` section Reports).
