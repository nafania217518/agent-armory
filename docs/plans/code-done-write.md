# Plan: the done write in `code` and the design-doc shrink

Parent: `docs/milestones/plan-levels.md` section Tasks, line `code-done-write`.
Branch: `code-done-write`, cut from local `master` (section Overrides). Markers: none.

## Goal

The last task of milestone `plan-levels`. `code` gains the done-write step that BR-7
sets, so every task under a milestone ends with one status commit. `docs/DESIGN.md`
section Planning levels shrinks to one paragraph and a pointer at `plan` section
Levels, and the planning-level caveat leaves the project context. The last commit of
this branch marks the task and the milestone done.

Quiz of 2026-11-02: four small edits with no `BR` ride as plain edits in the BR-13
commit (the milestone goal line drops "the milestones folder in `setup`"; the section 4
`plan` row names the three templates; a dated decision line records "pointer only";
the plugin description names the plan templates); the branch is cut from local
`master`. The `TR` draft comes from the task-level dry run of 2026-11-02, which loaded
`plan`, `test` and `implement` and drafted against BR-7, BR-10 and BR-13.

Execution, in this order:

1. Writer (Opus, medium): TR-1 in `skills/code/SKILL.md`, one commit.
2. Writer (Opus, medium): TR-2 in `docs/DESIGN.md`, one commit.
3. Main session: TR-3, the caveat line in `AGENTS.md` (only the main session writes
   there) and the one-line `plugin.json` description (config, which the writer must
   not touch), one commit.
4. Reviewer on the three commits with the whole-task checks on `master..HEAD`.
5. Task end (`code` section Task end), then the main session: TR-4, the done-write
   commit, last on the branch, before the merge question.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line.

- TR-1 (plan-levels/BR-7, plan-levels/BR-10): `code` section Task end MUST add one
  step between Cleanup and Finish, the done write: when the task has a milestone, the
  main session MUST make one more commit, the last on the task branch, that marks the
  task done in the milestone doc; when that task was the milestone's last open one,
  the same commit MUST mark the milestone done in `<docs>/DESIGN.md`; the commit MUST
  change only status lines and needs no review; no commit MUST land on `<base>`; a task
  with no milestone skips the step. The frontmatter `max-lines` MUST end at the final
  size plus 5.
  tests: `lint`; the reviewer reads the step against BR-7; the task-level dry run of
  2026-11-02 already proved the `plan` side.
- TR-2 (plan-levels/BR-13): `docs/DESIGN.md` section Planning levels MUST hold one
  paragraph and one line that points at `plan` section Levels; the table and the bullet
  list MUST leave. The same commit MUST make the four plain edits named under Goal
  that touch `docs/DESIGN.md` (goal line, section 4 row, decision line).
  tests: none, doc text; the reviewer reads the section and the three edits.
- TR-3 (plan-levels/BR-13): the main session MUST remove the line "`DESIGN.md` section
  Planning levels repeats `plan` section Levels, and `code` lacks the done write, until
  milestone plan-levels lands" from the project context `## Caveats`.
  tests: none, project-context text; the reviewer reads it.
- TR-4 (plan-levels/BR-7): the last commit of this branch MUST mark `code-done-write`
  done in `docs/milestones/plan-levels.md` section Tasks and `plan-levels` done in
  `docs/DESIGN.md` section Milestones, and MUST change nothing else.
  tests: none, a status write; checked by `git show` on that commit at the finish.

## Test scope

none : — : the task changes skill text, docs, the project context and one plugin
description; `scripts/*.test.mjs` read none of them.

## Risks

- `code` is at 106 of 111 lines; the step adds about six. `max-lines` rises to the
  final size plus 5.
- `docs/DESIGN.md` numbers its headings; a reference to "section Planning levels"
  matches `## 5. Planning levels` only when the number is ignored (project caveat).
- The done-write commit lands after the final review by design; TR-1 states that it
  changes only status lines, so the rule and the practice agree.

## Stack choices

none

## Out of scope

- The four edge cases of `docs/DESIGN.md` section Open, and the Retry worktree
  refresh (a separate session card exists).
- Any skill other than `code`.
- A push of `master` or of this branch; the finish question decides it.

## Accepted tech debt

none

## Overrides

- `code` section Branch and plan file, `<base>` is `origin/HEAD` with a remote : the
  user chose to cut from local `master`, because `origin/master` lacks all of today's
  work and nothing is pushed yet.

## Caveats

none
