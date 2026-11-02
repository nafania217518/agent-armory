# Plan: the `plan` skill levels and templates

Parent: `docs/milestones/plan-levels.md` section Tasks, line `plan-levels-skill`.
Branch: `plan-levels-skill`, cut from `master`. Markers: none (skill text has no code).

## Goal

The three planning levels of `docs/DESIGN.md` section Planning levels become rules in
`plan`, with one template per doc under `skills/plan/templates/`, so that a fresh
session that loads `plan` alone can run a strategic, milestone or task plan. The eight
section names of `plan` stay. `delegate` section Briefs learns that a `BR` under a
milestone is quoted from the milestone doc.

Quiz of 2026-11-02, after the planner draft: the merge question after a strategic or
milestone run stays separate (an existing MUST in `code`); the levels table in the skill
summarises the Holds column and adds a Template column; template names follow the
levels; a one-off task's parent line reads `Parent: none (no milestone)`; `task.md`
carries format lines for Test scope and Overrides and a Caveats section; `max-lines` is
the final size plus 5; the description names the levels; the `delegate` reference is
fixed here as a scope addition; after task 2, `DESIGN.md` section 5 holds one paragraph
and a pointer, no table (BR-13 replaces BR-12); the checks are four read-only dry runs
plus the reviewer.

Execution: the writer agent (Opus, effort medium) in three commits, then one fix
commit after the review (TR-19 to TR-22, the review's Should fix and Nice to have items), in this order:
templates (TR-2 to TR-4); the `plan` rework (TR-1, TR-5 to TR-17); `delegate` (TR-18).
The reviewer runs on each commit. Then four dry runs, each a fresh agent that loads
`plan` alone from the task branch, reports what it would read, ask, cut and write, and
stops before any write: D-S strategic, D-M milestone on `plan-levels`, D-T task on
`code-done-write`, D-0 no argument.

Plan-file commit: this file as `docs/plans/plan-levels-skill.md`, plus two edits to
`docs/milestones/plan-levels.md`: the task line `plan-levels-skill` gains `delegate`
section Briefs; BR-12 gets `(replaced by BR-13)` and BR-13 reads: once BR-1 to BR-9
hold, `<docs>/DESIGN.md` section Planning levels MUST hold one paragraph and one line
that points at `plan` section Levels, and the planning-level caveat MUST be removed from
the project context `## Caveats`.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line. A dry run is named D-S, D-M, D-T or D-0 as in Goal.

- TR-1 (plan-levels/BR-10): each commit that takes `skills/plan/SKILL.md` past
  `max-lines` MUST raise `max-lines` in that same commit; the last commit MUST leave it
  at the final size plus 5.
  tests: `lint`, at every commit.
- TR-2 (plan-levels/BR-2, plan-levels/BR-9): `skills/plan/templates/strategic.md` MUST
  hold the section Decisions with the format line
  `- <YYYY-MM-DD>: <decision>. Dropped: <alternatives>.` and the section Milestones with
  the format line `<name> : <one-line goal> : <status>` and the doc path
  `<docs>/milestones/<name>.md`. It MUST hold no other section.
  tests: none, prose; the reviewer reads the template against BR-2.
- TR-3 (plan-levels/BR-3, plan-levels/BR-5, plan-levels/BR-9):
  `skills/plan/templates/milestone.md` MUST hold, in this order: the parent line
  `Parent: <docs>/DESIGN.md section Milestones, line <name>`, Goal, Scope (In, Out),
  Requirements with the format line `BR-<n>: MUST <behavior>`, Tasks with the format
  line `<branch> : <what> : <BR list> : <status>` in execution order, Risks, Done
  criteria.
  tests: none, prose; the reviewer reads the template against BR-3.
- TR-4 (plan-levels/BR-4, plan-levels/BR-5, plan-levels/BR-9):
  `skills/plan/templates/task.md` MUST hold, in this order: the parent line
  `Parent: <docs>/milestones/<name>.md section Tasks, line <branch>` (or
  `Parent: none (no milestone)`), Goal, Requirements with the `TR` item format and its
  `tests:` line and the own `BR` list of a task with no milestone, Test scope with the
  format line `<test case> : <break | rework | remove> : <reason>`, Risks, Stack
  choices, Out of scope, Accepted tech debt, Overrides with the format line
  `<design rule> : <reason>`, Caveats with the caveat line of `core` section Reports.
  tests: none, prose; the reviewer reads the template against BR-4 and today's section
  The plan.
- TR-5 (plan-levels/BR-1): `plan` section Levels MUST take the level from the argument
  `strategic`, `milestone` or `task`; with no argument, the first question MUST ask the
  level. The frontmatter description MUST name the three levels.
  tests: D-0, whose first question asks the level; D-T, which asks no level question.
- TR-6 (plan-levels/BR-2, plan-levels/BR-3, plan-levels/BR-4): `plan` section Levels
  MUST hold the levels table with the columns Level, Doc, Template, Branch, Holds and
  Ids; Holds MUST summarise the content and MUST NOT list sections; Template MUST name
  the file under `templates/`.
  tests: D-S, D-M and D-T each report the doc path, template and branch from the table.
- TR-7 (plan-levels/BR-5): each doc MUST name its parent in its first lines and MUST
  reference a parent fact, not restate it; a milestone run MUST read `<docs>/DESIGN.md`
  first; a task run MUST read its milestone doc first.
  tests: D-M and D-T, whose first read is the parent doc and whose drafted doc starts
  with the parent line.
- TR-8 (plan-levels/BR-2): a strategic run MUST have no testable item and MUST stop at
  the milestone list; it MUST create `<docs>/DESIGN.md` from the template when the file
  is missing, else edit it in place and keep the free sections.
  tests: D-S, which proposes no `BR` or `TR` and ends at the milestone list without
  starting a milestone plan.
- TR-9 (plan-levels/BR-6): `plan` section Levels MUST state that milestone status
  lives only in `<docs>/DESIGN.md`, task status only in the milestone doc, and that
  the values are open, done and dropped; the template format lines MUST point at that
  rule.
  tests: none, prose; no read-only run writes a status, so the reviewer reads section
  Levels and the format lines.
- TR-10 (plan-levels/BR-4): section Requirements MUST put the `BR` list in the
  milestone doc, or in the plan file for a task with no milestone; each `TR` MUST
  trace to `<milestone>/BR-m`, or to `BR-m` with no milestone; a task run under a
  milestone MUST NOT add a `BR`.
  tests: D-T, whose drafted `TR` items trace to `plan-levels/BR-7`,
  `plan-levels/BR-10` and `plan-levels/BR-13`; the one-off case by reading.
- TR-11 (plan-levels/BR-4, plan-levels/BR-9): section The plan MUST take the
  sections, order and format lines of `templates/task.md` and MUST keep its rules on
  them: Overrides content, execution order, test-scope list, drafting load, gates,
  deletion over addition, caveats.
  tests: D-T, whose draft takes the template's sections.
- TR-12 (replaced by TR-19) (plan-levels/BR-2, plan-levels/BR-3, plan-levels/BR-4):
  section Self-review and approval MUST hold one check per level: strategic, no testable item and every
  milestone line has a goal and status open; milestone, each `BR` is checkable and in
  exactly one task's `BR` list (`lint`-type gates excepted); task, today's checks.
  tests: D-S, D-M and D-T each report the self-review check of their level.
- TR-13 (plan-levels/BR-2, plan-levels/BR-3, plan-levels/BR-4): after the approval,
  section Plan file MUST cut the level's branch from `<base>` with the commands of
  `code` section Branch and plan file, write the level's doc as the first commit, then
  the caveats; a strategic or milestone run MUST end with the merge question of `code`
  section Finish for its branch.
  tests: D-S, D-M and D-T report the branch they would cut and the path they would
  write, then stop.
- TR-14 (plan-levels/BR-4): a task plan file MUST exist also after zero quiz rounds;
  section Quizzes MUST NOT ask a fact the parent doc settles.
  tests: D-T, which names the plan-file write whatever the round count is; the
  reviewer reads the rule.
- TR-15 (plan-levels/BR-8): section Amendments MUST send an amendment to the doc that
  owns the fact: a `BR` gap found in a task amends the milestone doc on the task
  branch after the user's yes; an architecture gap re-enters plan mode at the
  strategic level on a `design-<topic>` branch; a new id goes into the owning doc
  before the next brief.
  tests: none, prose; a read-only run stops before any amendment, so the reviewer
  reads section Amendments.
- TR-16 (plan-levels/BR-9): `plan` MUST NOT restate the section list of any template.
  tests: none, prose; the reviewer reads `plan` against the three templates.
- TR-17 (plan-levels/BR-11): the section names Before the plan, Quizzes,
  Requirements, The plan, Self-review and approval, Plan file, Amendments and Drafting
  MUST stay; every `` `plan` section <Name> `` reference in `skills/`,
  `docs/DESIGN.md` and `.claude/agents/` MUST resolve to a heading of `plan`.
  tests: none, prose; the reviewer greps the references against the `plan` headings.
- TR-18 (plan-levels/BR-4): `delegate` section Briefs MUST say that a brief quotes
  each `BR` from the milestone doc, or from the plan file for a task with no
  milestone, and each `TR` from the plan file.
  tests: none, prose; the reviewer reads the line.
- TR-19 (plan-levels/BR-2, plan-levels/BR-3, plan-levels/BR-4), replaces TR-12: section
  Self-review and approval MUST hold one check per level: strategic, no testable item,
  every milestone line has a goal, every new milestone line has the status open, and
  every new decision line carries its date and its dropped alternatives; milestone,
  each `BR` is testable and in exactly one task's `BR` list (a gate-type `BR` MAY be in
  several); task, every `BR` of the task has a `TR`, and today's other checks.
  tests: D-S, D-M and D-T each report the self-review check of their level; the
  reviewer reads the text.
- TR-20 (plan-levels/BR-5): a milestone name MUST match a line of `<docs>/DESIGN.md`
  section Milestones; with none, the strategic level MUST add it first. A task run
  MUST take its milestone from the request; when the request names none, the first
  quiz round MUST ask which milestone the task belongs to, or none.
  tests: none, prose; the reviewer reads section Levels.
- TR-21 (plan-levels/BR-2, plan-levels/BR-3): at the strategic and milestone levels,
  a caveat found during planning MUST go into the project context `## Caveats` right
  after the doc commit; in a milestone run, a testable tech answer MUST become a `BR`
  or a Risks line, never a `TR`.
  tests: none, prose; the reviewer reads sections Requirements and Plan file.
- TR-22 (plan-levels/BR-11): every reference to the plan's "Overrides part" or
  "Accepted tech debt part" in `core`, `delegate` and `review` MUST say section, as
  `plan` and `templates/task.md` now do.
  tests: none, prose; the reviewer greps the three skills.

## Test scope

none : — : the task changes skill text and templates only; `scripts/*.test.mjs` build
their fixtures in temp folders and read no skill.

## Risks

- `plan` grows by about 40 lines; the planner loads all of `plan`, so its load set
  grows (`DESIGN.md` section 4).
- `lint` does not read the templates; `skill-sizes.mjs` counts only `SKILL.md`. A
  template error shows only in a reading or a dry run.
- A dry run shows that a model can follow the text; it does not prove the rule.
- `code` loads `plan` with no argument, so a task run started from `code` gets the
  level question first.

## Stack choices

none

## Out of scope

- `setup`; the four old plan files under `docs/plans/`; the four edge cases of
  `DESIGN.md` section Open.
- Task `code-done-write`: BR-7, BR-13, the `DESIGN.md` section 5 change and its dated
  decision line, the goal-line fix, the caveat removal, the done writes.
- `docs/DESIGN.md` section 4 row for `plan` templates and the `plugin.json`
  description: task 2 takes them with its `DESIGN.md` edits.

## Accepted tech debt

none

## Overrides

none

## Caveats

- The `plan` templates are not checked by `lint`; `skill-sizes.mjs` counts only `SKILL.md` : scripts/skill-sizes.mjs
- The template headings carry no number, but this repo's `DESIGN.md` numbers its headings; a match by section name must ignore the number : docs/DESIGN.md
