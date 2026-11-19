---
name: research
description: >
  How to research a claim: official sources first, independent sources next, dates,
  disagreements, the result format and the report slots. Load for any fact about a
  library, API, model, tool or domain, for the basis of a recommended option, for the
  plan's research step, and in the researcher agent. Use for "check the docs", "is this
  still true", "research this", "/research".
metadata:
  type: regular
  extends: [core]
  max-lines: 80
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.

# research

## 1. When to research

- A claim from model memory, not from repo, a run or a cited source, MUST be proven when
  code, a recommendation, a plan decision or a review finding rests on it.
- Proof MUST take first form that works: a run, installed source or types, official docs
  or changelog, independent sources (§2). A review finding or a report claim, caveat
  line included, with no proof MUST carry one more part, last:
  `Unverified: <the source or command that settles it>`; in a caveat line it follows one
  more ` : `. A proven claim MUST name its proof: the command, `path:line` or URL.
- Main session MUST delegate web search and page reading to a researcher. Raw page text
  MUST NOT enter main context.
- Before a question round, main session MUST send to research each open point whose
  options turn on an outside fact (library, tool, API, domain fact) or user's intent
  (goal, scope, priority, taste). One round's points and claims to prove MUST go in one
  researcher brief, split only past 5 web questions. Brief MUST state each point and its
  options with no preferred option.
- A claim or point MUST skip research when a skill or project rule, a `core` §4
  rule for a point that is not an intent point, repo evidence already in
  context or a result from this run settles it, it is logic over text already in context,
  a gate run in same step would fail if it were false, or it is a yes/no approval (push,
  merge, plan approval). What settles it is the point's basis; an intent point's basis
  takes its ladder number.
- An intent point's recommendation MUST take first basis that holds:
  1. a statement in an approved source: parent item, approved plan, design doc in
     `<docs>`, project context;
  2. a precedent: how repo already made same kind of choice (code, earlier plans, caveat
     base); an inferred reading counts as this basis at most;
  3. smallest option: one that leaves least built or changed at task end (`core` §4,
     YAGNI).
- An unprovable claim MUST NOT serve as basis; recommendation MUST take next one.
- Basis 1 and 2 MUST cite `path:line` or item link. Between two sources of one basis
  that disagree, newer MUST win, in place of §2 choice of winner; agent MUST still say
  so. Run MUST log it in question's message text.
- Agent MUST return only the result of §3.

## 2. Sources

- When official source is unclear, old or disputed, SHOULD read at least 3 further
  independent sources. A copy of the same text MUST NOT count as independent.
- MUST note each source's date; a local source MUST give its version instead. SHOULD
  prefer newest primary source. Older primary source SHOULD beat a newer secondary one.
- When sources disagree, MUST say so. An Opus agent MUST name the source it trusts and say
  why. A Sonnet agent MUST instead report what each source says, name no winner and mark
  that question `open: sources disagree`. Main session MUST send only disputed questions
  to an agent on the Opus research row, fresh or reused, with those sources in its
  brief.
- An agent whose brief names its pages MUST read only those pages, in place of proof order
  (§1); each answer MUST quote its passage or take `open: not on the page`.
  A question whose pages disagree MUST still take `open: sources disagree`.

## 3. Result

Result MUST hold, in this order:

1. The claim, in one or two sentences, with its confidence: `confirmed`, `likely` or
   `open: <reason>`. The reason MUST be `sources disagree`, `not on the page` or
   `not settled by the code`. Each question or fact MUST get its own claim line.
   For an open point, claim MUST name recommended option, its basis (number for an intent
   point) and its source, or `no recommendation`.
2. The sources, one per line: title, URL or path, date or version, what it says.
3. The recorded-items slot and the caveat slot (`core` §6).
