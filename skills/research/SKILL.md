---
name: research
description: >
  How to research a technical claim: official sources first, independent sources next,
  dates, disagreements, the result format and the report slots. Load for any fact about a
  library, API, model, tool or domain that may be outdated, for the plan's research step,
  and in the researcher agent. Use for "check the docs", "is this still true", "research
  this", "/research".
max-lines: 60
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# research

How to check a claim against sources. The main session delegates; the researcher reads.

## 1. When to research

- Own knowledge can be outdated. A claim that can be outdated (a version, a parameter, a
  default, a limit, a price, a behavior) is a hypothesis until a source confirms it.
  Such a claim MUST go to research when the plan or the code depends on it and the
  installed source, the types or the repo docs do not settle it.
- The main session MUST delegate web search and page reading to an agent on a research
  row (`delegate` section Models). Raw page text MUST NOT enter the main context.
- The agent MUST load the `browse` skill (`/browse`, or `/armory:browse` in the plugin)
  and return only the result of section Result.
- A subagent MUST run `agent-browser` itself (`delegate` section What each agent
  returns). It MUST cut the output as `browse` section Commands sets.

## 2. Sources

- MUST read the official documentation, changelog or source code first.
- When the official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent.
- An agent on the Sonnet research row that meets an unclear, old or disputed official
  source MUST stop and report `sources disagree`. The main session MUST then re-spawn
  the question on the Opus research row (`delegate` section Models).
- MUST note the date of each source. SHOULD prefer the newest primary source. An older
  primary source SHOULD beat a newer secondary one.
- When sources disagree, MUST say so, name the source you trust, and say why.

## 3. Result

The result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: confirmed, likely, or open.
2. The sources, one per line: title, URL, date, what it says.
3. The recorded-items slot and the caveat slot (section Caveats).

## 4. Caveats

The two slots, and what counts as a caveat, are in `core` section Reports. The line
format is in `init-project` section Write. The main session writes each caveat into
`AGENTS.md` (`code` section Caveats).
