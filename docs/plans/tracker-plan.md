# Plan: tracker-plan

Parent: `docs/milestones/tracker.md` section Tasks, line `tracker-plan`.

## Goal

`plan` runs each level against a bound tracker: milestones and tasks become tracker
items, status lives only in the tracker, and the repo keeps `DESIGN.md` and the task
plan files. Without a tracker, `plan` works as before. Quiz on 2026-11-03: an
amendment edits the owning item after the user's yes (BR-29); a run lists its tracker
writes in its approval proposal only; the naming rule (BR-21) lives in `core`.

## Requirements

- TR-1 (tracker/BR-5, tracker/BR-17): `plan` section Levels MUST give the tracker
  variant, after the table, for a tracker bound in the project context `## Tracker`
  (`core` section Host terms):
  - strategic: `DESIGN.md` keeps its architecture and decisions and MUST hold no
    milestone list; each new milestone MUST become a top-level tracker item.
  - milestone: the milestone item body MUST take the sections of
    `templates/milestone.md` except the parent line and Tasks; each task MUST become a
    child item of the milestone item, its body the `<what> : <BR list>` of the Tasks
    format line, with blocked-by edges for its order.
  - Status MUST live only in the tracker.
  - A milestone name MUST match a top-level tracker item, not a `DESIGN.md` line. A task
    run MUST read its milestone item, body and comments, first.
  The table's rules for the repo docs MUST stay the docs fallback.
  tests: none, a prose rule; checked by reading, by `lint` and by the GitHub dry run of
  `tracker-code`.
- TR-2 (replaced by TR-12) (tracker/BR-6, tracker/BR-17): `plan` section Plan file MUST
  say that with a tracker bound, a milestone run creates its items after the approval
  and cuts the `milestone-<name>` branch only when it writes a repo file (glossary or
  caveats); with no repo write it has no branch and no merge question.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-3 (tracker/BR-7, tracker/BR-17): `plan` MUST let a run start from an existing
  tracker item: the run MUST read its body and comments first and take it as its
  milestone or its task. Else it MUST create the items only after the approval.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-4 (replaced by TR-22) (tracker/BR-8, tracker/BR-17): `plan` section Self-review and
  approval MUST require that, with a tracker bound, the proposal lists each tracker
  write the run will make: creates, links, edges, comments and status sets, and for a
  task run also the `code` run's claim and done write.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-5 (tracker/BR-9, tracker/BR-17): with a tracker bound, a task with no milestone
  MUST keep its `BR` list in its own task item body, and the plan file only the `TR`
  list: `plan` section Requirements and the matching line of `templates/task.md`.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-6 (tracker/BR-10, tracker/BR-17): `templates/task.md` MUST give the tracker parent
  line: `Parent: [<task title>](<link>), child of [<milestone title>](<link>).`, and
  for a task with no milestone `Parent: [<task title>](<link>) (no milestone).`
  tests: none, a template; checked by reading and by `lint`.
- TR-7 (replaced by TR-11) (tracker/BR-11, tracker/BR-17): `plan` MUST say that with a
  tracker bound, a task run with no task named takes the first frontier task of its
  milestone: open, every blocker done, no assignee.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-8 (replaced by TR-14) (tracker/BR-20, tracker/BR-17): `plan` section Plan file MUST
  say that a run that creates several items creates the blockers first, then adds the
  blocked-by edges and the cross-references in a second pass with real ids, and writes
  no placeholder id.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-9 (tracker/BR-21, tracker/BR-17): `core` section Host terms MUST gain a sub-bullet
  under the tracker term: a report or an item text MUST name a tracker item by its
  title, with its link inside, not by a bare id. `core` MAY raise `max-lines` from 149.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-10 (replaced by TR-13) (tracker/BR-22, tracker/BR-17): the `core` sub-bullet "A run
  MUST NOT edit a parent item that it did not create" MUST gain the exception "except to
  write an amendment the user approved (`plan` section Amendments)". `plan` section
  Amendments MUST say that with a tracker bound, the owning doc is the owning item:
  after the user's yes, the main session writes the new id and the `(replaced by <new
  id>)` mark into the item body before the next brief.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-11 (tracker/BR-24, tracker/BR-17): `plan`, tracker variant, MUST say that a task
  run with no task named takes the first ready task in the milestone item's child order:
  open, every blocker done, no assignee. The term MUST be "ready task", not "frontier",
  which `delegate` section Models uses for a model tier.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-12 (replaced by TR-18) (tracker/BR-26, tracker/BR-17): `plan` section Plan file
  MUST say that with a tracker bound, a strategic or milestone run creates its items
  after the approval, and a milestone run MUST write no milestone doc. Each such run
  MUST cut its level's branch only when it writes a repo file (`DESIGN.md` decisions,
  glossary or caveats); that write is its first commit. Else it MUST skip the branch and
  the merge question. A new milestone item body MUST hold its one-line goal. The
  strategic self-review MUST check the milestone items (a goal, status open) in place of
  milestone lines.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-13 (replaced by TR-17, TR-20) (tracker/BR-23, tracker/BR-17): the `core`
  parent-item sub-bullet MUST read: a run MUST NOT edit a parent item (an item above the
  one the run plans or codes), except to write an amendment the user approved (`plan`
  section Amendments); a run that starts from an existing item MUST keep the item's text
  and add its own sections below it. `plan` section Amendments MUST say that a `BR` gap
  found in a task run MUST amend the owning doc (the milestone doc on the task branch,
  or the milestone item with a tracker bound), after the user's yes.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-14 (tracker/BR-20, tracker/BR-17): the create-order rule of `plan` section Plan
  file MUST name tracker items: "A run that creates several tracker items ...".
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-15 (replaced by TR-21) (tracker/BR-27, tracker/BR-17): the `core` tracker term MUST
  gain the optional verb "branch name" (the tracker's branch name for an item). `plan`,
  tracker variant, MUST say that a task's branch is that name when the binding has the
  verb, else `<item id>-<title slug>`, and that the plan file path follows the branch.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-16 (tracker/BR-28, tracker/BR-17): the `core` tracker verb list MUST gain "edit an
  item body"; `setup` binds it like every verb.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-17 (tracker/BR-29, tracker/BR-17): the `core` tracker sub-bullets MUST read: a run
  MUST NOT edit the body of a parent item (an item above the one the run plans or
  codes), except to write an amendment the user approved (`plan` section Amendments),
  and MUST comment on that item instead; a run that starts from an existing item MUST
  keep the item's text and add its own sections below it; each item body, added section
  and comment that an agent writes MUST start with the line `> *This was generated by
  AI.*`.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-18 (tracker/BR-26, tracker/BR-17): `plan` section Plan file MUST say that with a
  tracker bound, a strategic or milestone run follows this rule in place of the branch
  and doc-commit bullets: it creates its items after the approval, and a milestone run
  MUST write no milestone doc. It MUST cut its level's branch only when it writes a repo
  file (`DESIGN.md`, glossary or caveats); that write is its first commit. Else it MUST
  skip the branch and the merge question. A new milestone item body MUST hold its
  one-line goal. The strategic self-review MUST check the planned milestone items (a
  goal, status open) in place of milestone lines.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-19 (tracker/BR-5, tracker/BR-17): with a tracker bound, a strategic run that
  creates `DESIGN.md` from `templates/strategic.md` MUST drop its Milestones section.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-20 (tracker/BR-29, tracker/BR-17): `plan` section Amendments MUST say that a `BR`
  gap found in a task run MUST amend the owning doc (the milestone doc on the task
  branch, or the milestone item with a tracker bound), after the user's yes; with a
  tracker bound, the main session writes the new id and the `(replaced by <new id>)`
  mark into the owning item's body before the next brief.
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-21 (tracker/BR-27, tracker/BR-17): the `core` tracker term MUST hold the optional
  verb "branch name". `plan`, tracker variant, MUST say that a task's branch is that
  name when the binding has the verb, else `<item id>-<title slug>`, and that the plan
  file path is the branch with each `/` replaced by `-`. `setup` (Questions and Answer
  checks) MUST NOT count an unbound optional verb as unbound, and MUST bind it when the
  tracker has it. `skills/setup/templates/AGENTS.md` and `docs/DESIGN.md` section 3 MUST
  say "one line per bound verb".
  tests: none, a prose rule; checked by reading and by `lint`.
- TR-22 (tracker/BR-8, tracker/BR-17): `plan` section Self-review and approval MUST
  require that, with a tracker bound, the proposal lists each tracker write the run will
  make: creates, body edits, links, edges, comments and status sets, and for a task run
  also the `code` run's claim and done write.
  tests: none, a prose rule; checked by reading and by `lint`.

BR-16 (`lint` and `unit` pass on every commit) is a gate on every commit. `plan` MAY
raise `max-lines` from 194.

## Test scope

None: the change is prose and a template; `lint` checks the skills (`AGENTS.md`
`## Test levels`).

## Risks

- `plan` grows by about 25 lines; it loads in every planning run.
- The docs fallback (BR-15) can break if a rule loses its docs wording; the reviewer
  walks each level in both modes.
- The writer can reword a list sentence that `doc-checks.mjs` matches; `lint` catches
  it.

## Stack choices

## Out of scope

- The claim, the done write and briefs from tracker items: task `tracker-code`.
- Drift detection (milestone Scope Out).
- `templates/strategic.md` and `templates/milestone.md`: `plan` names the sections to
  drop; the templates stay the docs format.

## Accepted tech debt

## Overrides

## Caveats
