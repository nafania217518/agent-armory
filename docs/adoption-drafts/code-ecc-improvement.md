# code ← ecc (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `skills/santa-method/SKILL.md` @3f14a10 (MIT)
Status: draft, not adopted

## What it brings

An opt-in second reviewer for high-risk `TR`s: two reviewers get the same brief at once,
neither sees the other's report, and a finding either one reports counts. The task report
counts how often they disagree, which is the evidence to keep or drop the option.

## Cons

- Doubles review cost on each marked `TR`.
- Armory already has a fresh final review, a third-round ask and the Fable question for
  security-critical work; the gain over those is not measured.
- The source spawns a fresh pair each round. This draft keeps armory's re-review by the
  same reviewer (`delegate` §Briefs), since a fresh pair each round triples the cost.
- The merge rule in change 2 overlaps the multi-reviewer merge rule of
  `review-wshobson-improvement.md`; adopt it in one place only.
- `code` is at its `max-lines` (219); changes add about 7 lines.

## Proposed changes

### 1. Mark a TR for dual review

- Target: `plan` §The plan (add bullet, after the Risks bullet)
- Text:
  - A `TR` that changes authentication, deletes or migrates stored data, or handles
    secrets MAY carry the indented line `review: dual`, chosen in the tech quiz.
- Why: the option must be named in the plan, so the reviewer spawns are not a run-time
  guess.
- Evidence needed: same as change 2.

### 2. Two independent reviewers

- Target: `code` §Review loop (add bullet, after the first bullet)
- Text:
  - For a result that builds a `review: dual` `TR`, main session MUST spawn two reviewers
    at once with the same brief, and neither brief MUST name the other. Main session MUST
    merge the two reports: findings on the same lines with the same problem become one,
    in the higher group. Each finding of either report MUST count. The fix round's
    re-review MUST go to both. Done when both reviewers report no Must fix.
- Why: one Opus-high reviewer can miss a fault class; a second one with no shared context
  breaks that blind spot on the riskiest code.
- Evidence needed: a Must fix on auth, data or secrets code that one reviewer missed and a
  later review, a user or production found.

### 3. Agreement count in the task report

- Target: `code` §Task end, step 6 (add item to the report list, after "each measured
  result")
- Text: for each dual review, one line: findings both reviewers found, and findings only
  one found, per group;
- Why: the count is the measured gain the project rules require before the option stays.
- Evidence needed: none for the count itself; it collects the evidence for change 2.
