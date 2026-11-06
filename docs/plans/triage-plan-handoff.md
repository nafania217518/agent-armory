# Plan: Triage to plan handoff

Parent: none (no milestone)

## Goal

Close finding cross-1 of the 2026-11-06 conflict review. `triage` gives an `accepted`
item its own `## Requirements` (`BR` lines). A `plan` run that starts from that item
can still ask "which milestone?" (plan:42-43) and put it under a milestone, where a task
MUST NOT hold `BR` lines (plan:128) and each `TR` traces to the milestone's `BR`
(plan:134). The item's `BR` lines are then orphaned. The user chose: the run level
decides. A milestone run takes the item as the milestone; a task run takes it as a task
with no milestone; no milestone question runs. The rule lives in `plan` (it owns the
run); `triage` only points to it.

Branch `triage-plan-handoff`, cut from `conflict-fixes` (19a1cb3) at the user's choice,
not from `<base>`: the two tasks touch the same `plan` and `triage` lines. No version
bump: both unreleased tasks ship as 0.2.3. Plan file: `docs/plans/triage-plan-handoff.md`.

## Requirements

Format: `BR-<n>: MUST <behavior>`.

- BR-1: A `plan` run that starts from a tracker item holding its own `## Requirements`
  MUST take the item as the milestone of a milestone run, or as a task with no
  milestone of a task run, and MUST ask no milestone question.
- BR-2: The `triage` `accepted` outcome MUST say that a later `plan` milestone or task
  run starts from the item.
- BR-3: `lint` and `unit` MUST pass on every commit. Each changed `SKILL.md` MUST stay
  within its `max-lines`, raised in the same commit where it grows past. Each changed
  line MUST stay at or under 90 characters.

`TR-<n> (BR-<m>, ...): MUST <behavior>`, then an indented `tests:` line. Line numbers
are at 19a1cb3. Each block is the NEW text; it replaces the cited lines in full.

- TR-1 (BR-1, BR-3): MUST apply these edits to `skills/plan/SKILL.md`, one commit.
  tests: none, skill text; checked by `lint` and by reading.
  - line 10: `max-lines: 239` → `max-lines: 240`.
  - lines 73-75 (tracker variant, the bullet "- A run MAY start from an existing
    tracker item. …only after the approval."):
    ```
      - A run MAY start from an existing tracker item. It MUST then read the item's body
        and comments first and take the item as its milestone or its task. Else it MUST
        create the items only after the approval. An item that holds its own
        `## Requirements` (`triage` section Outcomes) MUST be the milestone of a milestone
        run, or a task with no milestone of a task run, with no milestone question.
    ```
- TR-2 (BR-2, BR-3): MUST apply this edit to `skills/triage/SKILL.md`, one commit.
  tests: none, skill text; checked by `lint` and by reading.
  - line 76: `A later `plan` task run starts from the item.` →
    `A later `plan` milestone or task run starts from the item.`

### Run order

1. Commit this plan file on `triage-plan-handoff`.
2. One coder (Sonnet low, "Coding, trivial change"), in its own worktree reset to the
   task branch: TR-1, then TR-2.
3. Merge; `lint` and `unit`; review (reviewer, Opus high) of the task range; `code`
   Task end.

Sizes after: plan 240/240 (raised), triage 97/97.

## Test scope

None. No test in `scripts/` reads `plan` or `triage` text.

## Risks

- A milestone run from such an item already finds a `## Requirements` section in the
  item; adding more `BR` lines there is left to the model (`core`: keep the item's text,
  add own sections below it).
- The task branch is cut from `conflict-fixes`, not `<base>` (`code` section Branch and
  plan file), at the user's choice; it merges only after `conflict-fixes`.

## Stack choices

## Out of scope

- Putting an accepted item under an existing milestone (option 3, not chosen).
- A dry run on the tracker dry-run repo.

## Accepted tech debt

## Overrides

Format: `<design rule> : <reason>`.

## Caveats

Format: the caveat line of the armory `core` skill, section Reports.
