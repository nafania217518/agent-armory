# design-qa (new skill)

Sources:
- https://github.com/alirezarezvani/claude-skills `product-team/design-qa/skills/design-qa/SKILL.md`, `engineering-team/a11y-audit/skills/a11y-audit/SKILL.md` @f8593c4 (MIT)
- https://github.com/wshobson/agents `plugins/ui-design/skills/accessibility-compliance`, `plugins/accessibility-compliance/skills/wcag-audit-patterns` @9c61ab2 (MIT)
- https://github.com/gsd-build/get-shit-done `commands/gsd/ui-review.md`, `agents/gsd-ui-auditor.md` @bdcaab2 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text or script is copied.

## What it does
Checks a built UI before it counts as done: no inert controls or placeholder copy, every
required state built, and the rendered page meets measurable WCAG 2.2 AA checks at mobile and
desktop widths. It also checks the build against the `ui-design` contract.

## What it brings to armory
Armory has no UI check: `review` reads code, not a rendered page, and `implement` names
accessibility only as a never-cut item. This skill gives the reviewer a checkable UI standard.
`review` §The diff is the truth and `audit` §Audit-only checks would point to it.

Split with `ui-design`: `ui-design` writes the contract before the code and checks nothing
rendered. `design-qa` runs on built code, checks against that contract (or its defaults), and
writes no contract.

Evidence needed: a session where a UI change passed review with a no-op handler, a missing
empty or error state, or a contrast or focus failure.

## Cons
- Needs a headless browser in the project to render pages; without one, the rendered checks
  stay unverified.
- UI projects only.
- The rezvani source ships scripts; armory must not copy them and would need its own probes
  or none.
- Automated checks cover only part of WCAG; a screen-reader pass stays manual.
- The GSD 1–4 pillar score is dropped: a score adds a number but no finding the reviewer
  can act on.

## Fit
- Invocation: model-loaded. The reviewer loads it when a diff touches UI code; the user may
  ask for a UI check directly.
- Hooks into:
  - `review` §The diff is the truth: add "When diff touches UI code, MUST also apply
    `design-qa`."
  - `audit` §Audit-only checks: same rule for a UI repo.
  - `code` §Task end, step 7: the acceptance list MAY name the screenshots design-qa took.
  - `ui-design` §Contract supplies the contract and the state list.
- Size: 64 lines.

## Draft SKILL.md

````markdown
---
name: design-qa
description: >
  Check of a built UI before it counts as done: inert controls, placeholder copy, missing
  states, contract drift, and rendered WCAG 2.2 AA checks at mobile and desktop widths.
  Loaded by the reviewer when a diff touches UI code; "check the UI", "/design-qa".
max-lines: 64
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# design-qa

Reviewer runs it on built UI, next to `review`. It checks; it writes no contract and no code.
`ui-design` writes the contract before the code. Findings use `review` §Output.

## 1. Contract

- MUST read `<docs>/ui-contract.md` (`ui-design` §Contract). With no contract, MUST check
  against the defaults of `ui-design` §Contract: the state list and the contrast floor.
- MUST list each surface the diff adds or changes, with its kind. Done when each surface has
  its kind and its required states.

## 2. Finish checks

- Each of these MUST be a Must fix finding: a handler that is empty, logs only or returns a
  fixed value; a link with no target; placeholder or sample copy; a focus outline removed
  with no replacement.
- A hard-coded color, spacing or type value outside the contract MUST be a Should fix
  finding, unless a `tech-debt:` marker covers it.
- Generic action copy that the contract does not set MUST be a Should fix finding.
- Done when each changed UI file is read against this list.

## 3. States

- A required state that the code does not build MUST be a Must fix finding. A state that no
  one listed counts as missing.
- A state counts as built only with evidence: a test that renders it, or a screenshot path.
- Done when each required state of each surface has evidence or a finding.

## 4. Rendered checks

- MUST run the app and capture each surface at 320 px and at a desktop width, once per key
  state (empty, error, long content). Screenshots MUST stay in the `mktemp -d` folder
  (`core` §Tools and background tasks), never in git.
- Each of these MUST be checked on the rendered page, and each failure is Must fix:
  - text contrast meets the contract floor, measured on the real background, through layers
    and opacity;
  - focus is visible on each control, and no fixed element hides it;
  - keyboard reaches and runs each action;
  - each control has an accessible name; each input has a label;
  - each target is at least 24×24 px, or has the WCAG spacing exception;
  - content reflows at 320 px with no horizontal scroll;
  - color is never the only signal.
- A taste issue (a template look, a weak focal point) MUST be a Nice to have finding only.
- Done when each check has pass, fail or unverified for each surface.

## 5. Verdict

- A check that could not run MUST be reported as unverified, with what it needs. Unverified
  MUST NOT count as pass.
- `Not checked:` (`review` §Output) MUST name the screen-reader pass and each unverified
  check.
````
