# setup ← ecc (improvement)

Sources:
- https://github.com/affaan-m/everything-claude-code `skills/inherit-legacy-style/SKILL.md` @3f14a10 (MIT; the skill's metadata marks it as a community contribution)

Status: draft, not adopted

## What it brings

`setup` scans an existing repo for its unwritten conventions and prefills them as
project `## Rules` lines, each with an exemplar file. A clear majority becomes a rule
with no question; a near-even split goes to user, one conflict per question. This turns
`research` basis 2 (precedent) and the conventions rule of `implement` §The smallest
complete change into recorded lines.

## Cons

- The source writes its own rules file and an evolution log; both are dropped, because
  project context `## Rules` is the one home for project rules (`core` SSOT).
- A scan agent adds cost to each first `setup` run in a repo with code.
- Conflict questions add rounds; `setup` §Questions today allows a further round only from
  §Answer checks.
- The thresholds (50 files, 5%, 10 hits) come from the source, not from an armory
  measure.
- `setup` is at its `max-lines` cap (160).

## Proposed changes

### 1. Prefill question 6 from a convention scan

- Target: `setup` §Questions (add bullet, after "Before questions, `setup` MUST read repo
  and prefill each item")
- Text:
  ```
  - In a repo with source files, a first run MUST have an agent (`delegate` §Models row
    7) scan four conventions: order of parts inside a file, names of state and flags,
    where shared helpers live, and error-handling style. Up to 50 source files it MUST
    read each; above that, 2–3 files per convention from each layer.
  - A style that under 5% of hits and under 10 hits use MUST become a prefilled rule line
    for question 6: a `MUST NOT` that names the majority style to use instead. Each such
    line MUST name one exemplar file by path. Done when each convention has a line, a
    conflict, or no finding.
  ```
- Why: question 6 starts empty, so a project's real conventions reach agents only when
  user types them.
- Evidence needed: a coder result or review finding that broke an unwritten convention of
  the project; or an eval where prefilled rule lines cut such findings.

### 2. One question per convention conflict

- Target: `setup` §Questions (replace "A further round MUST come only from §Answer
  checks.")
- Text:
  ```
  A further round MUST come only from §Answer checks, or from a convention conflict:
  a split the threshold above does not settle. Each conflict MUST be its own question,
  with the two styles, one path each, and the options "style A", "style B" and "a new
  rule".
  ```
- Why: a near-even split has no majority to prefill, and guessing one writes a false
  rule.
- Evidence needed: as change 1.
