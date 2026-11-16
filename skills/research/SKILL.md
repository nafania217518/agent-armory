---
name: research
description: >
  How to research a technical claim: official sources first, independent sources next,
  dates, disagreements, the result format and the report slots. Load for any fact about a
  library, API, model, tool or domain that may be outdated, for the plan's research step,
  and in the researcher agent. Use for "check the docs", "is this still true", "research
  this", "/research".
max-lines: 57
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# research

How to check a claim against sources. Main session delegates; researcher reads.

## 1. When to research

- A claim that can be outdated is a hypothesis until source confirms it. It MUST go to
  research when plan or code depends on it and installed source, types or repo docs do not
  settle it.
- A claim about a library's runtime behavior (a default, thread pool, order, version
  difference) MUST cite its source: file in dependency cache, official docs, or a run.
  Else it MUST carry the `Unverified:` part (`review` §Output).
- Main session MUST delegate web search and page reading to a researcher (`delegate`
  §Models). Raw page text MUST NOT enter main context.
- Agent MUST return only the result of §Result.

## 2. Sources

- MUST read official docs, changelog or source code first.
- When official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent.
- MUST note each source's date; a local source MUST give its version instead. SHOULD
  prefer newest primary source. Older primary source SHOULD beat a newer secondary one.
- When sources disagree, MUST say so. An Opus agent MUST name the source it trusts and say
  why. A Sonnet agent MUST instead report what each source says, name no winner and mark
  that question `open: sources disagree`. Main session MUST send only disputed questions
  to an agent on the Opus research row, fresh or reused (`delegate` §Briefs), with those
  sources in its brief.
- An agent whose brief names its pages MUST read only those pages, in place of source
  order above; each answer MUST quote its passage or take `open: not on the page`. A
  question whose pages disagree MUST still take `open: sources disagree`.

## 3. Result

Result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: `confirmed`, `likely` or
   `open: <reason>`. The reason MUST be `sources disagree`, `not on the page` or
   `not settled by the code`. With several questions or facts, result MUST hold one claim
   line per question or fact.
2. The sources, one per line: title, URL or path, date or version for a local source, what
   it says.
3. The recorded-items slot and the caveat slot (`core` §Reports).
