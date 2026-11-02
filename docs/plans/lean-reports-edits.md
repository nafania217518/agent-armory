# Plan: lean-reports-edits

Parent: `docs/milestones/lean-reports.md` section Tasks, line `lean-reports-edits`.

## Goal

One fact per caveat line, a worktree for each parallel coding agent, and subagent
reports cut to their card's items and the returns other rules require.

## Requirements

- TR-1 (lean-reports/BR-1, lean-reports/BR-6): MUST append to the caveat-line bullet of
  `core` section Reports: "It MUST hold one fact. A caveat with two facts MUST become
  two lines, or one line with only the fact a reader would not expect."
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-2 (replaced by TR-5) (lean-reports/BR-4, lean-reports/BR-6): MUST add to `core`
  section Reports, after the two-slot bullet: "A subagent report MUST hold only the
  items of its card's report format and the two slots. It MUST NOT narrate the steps,
  restate the brief, or paste file content, a diff or command output that no card item
  asks for. It MUST point to code by `path:line` or commit SHA instead."
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-3 (lean-reports/BR-3, lean-reports/BR-6): MUST replace the first bullet of
  `delegate` section Delegation and worktrees with: "Coding agents that run at once
  MUST each run in their own worktree. Without worktrees, they MUST run one at a time
  (`core` section Host terms)."
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-4 (lean-reports/BR-2): each line of this repo's `AGENTS.md` `## Caveats` MUST hold
  one fact in the format `SHORT_DESCRIPTION : <file>`: split a line, or keep only its
  unexpected fact. No fact may be lost unless it is obvious from its file.
  tests: none, prose; checked by reading.
- TR-5 (lean-reports/BR-7, lean-reports/BR-6): MUST replace the TR-2 bullet of `core`
  section Reports with: "A subagent report MUST hold only the items of its card's report
  format, the two slots, and the returns other armory rules require. It MUST NOT narrate
  the steps, restate the brief, or paste file content, a diff or command output that
  none of these asks for. It MUST point to code by `path:lines` or commit SHA instead."
  tests: none, a prose rule; checked by reading and by `lint`.

BR-5 (`lint` and `unit` pass on every commit) is a gate on every commit. `core` MAY
raise `max-lines` from 131.

## Test scope

None: the change is prose; `lint` checks the skills (`AGENTS.md` `## Test levels`).

## Risks

- The writer can break the `doc-checks.mjs` list markers if it rewords a list sentence.
  `lint` catches that.

## Stack choices

## Out of scope

- The dated decision line in `docs/DESIGN.md` section Decisions that calls the
  worktree rule "plain SHOULD rules". It is a record of 2026-10-30 and stays.
- `core` section Host terms: the fallback text stays.

## Accepted tech debt

## Overrides

## Caveats
