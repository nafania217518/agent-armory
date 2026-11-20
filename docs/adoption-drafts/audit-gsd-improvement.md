# audit ← gsd (improvement)

Sources: https://github.com/gsd-build/get-shit-done `agents/gsd-doc-verifier.md` @bdcaab2 (MIT); https://github.com/gsd-build/get-shit-done `get-shit-done/workflows/docs-update.md` (verify step) @bdcaab2 (MIT)
Status: draft, not adopted

## What it brings

An audit check of each checkable claim in the README and docs against the code: paths,
commands, endpoints, function names and dependencies. Today `audit` checks drift only in the
caveat base, so a dead path or a removed script in the README goes unseen.

## Cons

- Claim detection is heuristic; example and placeholder text gives false hits, so the draft
  carries the source's skip list.
- Adds reads to every audit; the scope is limited to the README and `<docs>`.
- Overlaps `review` §The diff is the truth for prose a change touches; audit covers prose no
  recent change touched.
- Grading needs no new rule: `review` §Output already grades a wrong fact in prose by its
  effect.
- Size: `audit` is at its `max-lines` (77 of 77); adopting adds about 8 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Docs claim check

- Target: `audit` §Audit-only checks (add bullet after the caveat-base bullets)
- Text: MUST check each checkable claim in the README and `<docs>` against the tree: a file
  path exists, a command's script or file exists in the build file or project context
  `## Commands`, an endpoint has a route, a named function is defined, a named dependency is
  declared. Each claim that fails MUST be a finding at `doc:line`.
- Why: the README is the first read of every user and agent, and nothing checks it today.
- Evidence needed: an armory or user repo whose README named a path or script that no longer
  existed and an audit passed it.

### 2. What the claim check skips

- Target: `audit` §Audit-only checks (add bullet after change 1)
- Text: The claim check MUST skip text marked as an example ("e.g.", "for example"),
  placeholder paths (`<name>`, `your-`), example and diff code blocks, and version numbers.
  It MUST NOT run any command it checks; existence alone settles the claim.
- Why: without the skip list most hits are false; running a documented command can change
  state, and `audit` changes nothing.
- Evidence needed: same as change 1; adopt only with it.
