# review ← gsd (improvement)

Sources: https://github.com/gsd-build/get-shit-done `agents/gsd-verifier.md` @bdcaab2 (MIT); https://github.com/gsd-build/get-shit-done `get-shit-done/references/verification-patterns.md` @bdcaab2 (MIT); https://github.com/gsd-build/get-shit-done `agents/gsd-integration-checker.md` @bdcaab2 (MIT)
Status: draft, not adopted

## What it brings

Makes "shown met" checkable: each new unit a requirement adds must exist, be real (not a
stub), be wired to a live caller, and get real data. The reviewer stops taking the coder's
word as proof.

## Cons

- Overlaps `review` §The diff is the truth ("shown met") and the `req:` markers; the change
  sharpens one bullet instead of adding a section.
- The source's grep patterns are React and Next.js only; the draft keeps only stack-neutral
  rules.
- Dropped: the threat-verdict part; the `threat-model` draft takes it.
- Dropped: the source's override file and token-overlap match. Armory already has plan
  Overrides and `plan` §Amendments.
- Size: `review` is at its `max-lines` (161 of 161); adopting adds about 10 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Four levels for "shown met"

- Target: `review` §The diff is the truth (replace bullet "Each requirement the task names
  MUST be shown met by diff or by a check.")
- Text: `Each requirement the task names MUST be shown met by diff or by a check. Each unit it
  adds MUST pass four levels: exists, real (no stub), wired (a live path calls it), and fed
  (its data comes from a real source, not a fixed return). A unit that fails a level MUST be
  reported as a requirement not met.`
- Why: a placeholder file meets "shown met by diff" today; the levels name what "met" means.
- Evidence needed: an armory review that passed a stub or an unwired unit, or an eval case
  that seeds one.

### 2. Stub signals

- Target: `review` §The diff is the truth (add bullet after change 1)
- Text: `A stub MUST count as such when a unit has an empty handler, a hard-coded empty result,
  a placeholder return, a body that only logs, or a parameter it never reads.`
- Why: gives the reviewer concrete signals for level "real" in change 1.
- Evidence needed: same as change 1; drop this change if change 1 alone catches the eval
  cases.

### 3. Coder's word is not proof

- Target: `review` §The diff is the truth (add bullet)
- Text: `A coder's claim in the brief MUST NOT count as proof that a requirement is met. Reviewer
  MUST check each such claim against code or a run.`
- Why: §The diff is the truth trusts handed-over gate runs at the right commit, but says
  nothing about other claims in the brief.
- Evidence needed: an armory review whose verdict repeated a coder claim that the code did not
  back.

### 4. A deviation that looks deliberate

- Target: `review` §Check before you report (add bullet)
- Text: A requirement not met where the code shows a deliberate other way MUST still be
  reported as Must fix. Its Fix MUST offer both options: implement it, or a plan amendment
  (`plan` §Amendments) for the user to approve.
- Why: without it a reviewer may pass a good alternative silently, and the plan drifts from
  the code.
- Evidence needed: an armory review that passed or silently accepted an unplanned
  alternative.
