---
name: research
description: >
  How to research a technical claim: official sources first, independent sources next,
  dates, disagreements, and the one-line caveat for AGENTS.md. Load for any fact about a
  library, API, model, tool or domain that may be outdated, for the plan's research step,
  and in the researcher agent. Use for "check the docs", "is this still true",
  "research this", "/research".
---

# research

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. When

Any claim about a library, API, model, tool or domain fact that may be outdated: a
version, a parameter, a default, a limit, a price, a behaviour. Your own knowledge is a
hypothesis until a source confirms it.

## 2. Sources

- MUST read the official documentation, changelog or source code first.
- SHOULD read at least 3 further independent sources. A copy of the same text is not
  independent.
- Read the web with the access the environment's rules name.
- Note the date of each source. Prefer the newest primary source; an older primary
  source beats a newer secondary one.
- When sources disagree: say so, name the one you trust, and say why.

## 3. Result

Report, in this order:

1. The claim, in one or two sentences, with its confidence: confirmed, likely, or open.
2. The sources, one per line: title, URL, date, what it says.
3. One line for `## Caveats` in `AGENTS.md`, in the format
   `SHORT_DESCRIPTION : file_reference.md`, or `no caveat`. A caveat is anything a later
   reader of the code would not expect: a changed default, a pinned version pair, a
   deprecated call, a limit.

The caller writes the caveat line into `AGENTS.md` (the `plan` skill at its save step,
the `code` skill during work). The `researcher` agent reports it and MUST NOT change any
file.
