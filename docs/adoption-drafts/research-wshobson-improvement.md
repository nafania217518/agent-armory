# research ← wshobson (improvement)

Sources:
- https://github.com/wshobson/agents `plugins/content-marketing/skills/social-evidence-research/SKILL.md` @9c61ab2 (MIT)

Status: draft, not adopted

## What it brings

Ties each claim to the passage the agent actually read. A search snippet points to a
page but proves nothing. A claim from one secondary source stays `likely`. A failed or
empty search is an access gap, never proof that something is absent.

## Cons

- `research` is at its `max-lines` cap (80); three lines need cuts or a raised cap.
- The source's platform parts (reposts, commenters, sample counts) are cut; they do not
  fit claim research.
- "Copies of one original count once" is not proposed: `research` §Sources already says a
  copy is not independent.
- The source's fixed stopping rule is not proposed: a researcher brief already caps its
  questions (`research` §When to research) and its further sources (§Sources).
- Change 3 adds a reason value to the `open:` list of §Result, which other skills quote.

## Proposed changes

### 1. A snippet proves nothing

- Target: `research` §Sources (add bullet, first)
- Text:
  ```
  - A search result, snippet or preview MUST only point to a page. A claim MUST rest on a
    passage the agent read, and only on that passage.
  ```
- Why: §Sources sets which sources rank first, not what part of a source may prove a
  claim.
- Evidence needed: a researcher result whose cited URL did not hold the claim, or held it
  only in a search snippet.

### 2. One secondary source gives `likely` at most

- Target: `research` §Sources (add bullet, after the date bullet)
- Text:
  ```
  - A claim that only one secondary source states MUST take `likely` at most, and MUST
    name that source as the one that says it.
  ```
- Why: §Result defines `confirmed` and `likely` but not when a single blog or forum post
  earns `confirmed`.
- Evidence needed: a `confirmed` claim that rested on one secondary source and proved
  wrong.

### 3. An empty search is an access gap

- Target: `research` §Sources (add bullet)
- Text:
  ```
  - An empty search, a failed read, or a page behind a login, paywall or block MUST NOT
    count as proof that a thing is absent. The agent MUST list it as a source line with
    `could not read: <reason>`, and the claim MUST take `open: no readable source` when
    nothing else settles it.
  ```
- Target: `research` §Result, item 1 (replace "The reason MUST be `sources disagree`,
  `not on the page` or `not settled by the code`.")
- Text:
  ```
     The reason MUST be `sources disagree`, `not on the page`, `not settled by the code`
     or `no readable source`.
  ```
- Why: today a blocked page or empty search has no reason value, so a result can turn it
  into "does not exist".
- Evidence needed: a result that claimed a feature or flag does not exist because a search
  found nothing, later shown wrong.
