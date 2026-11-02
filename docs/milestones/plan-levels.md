# Milestone: plan-levels

Parent: `docs/DESIGN.md` section Milestones, line `plan-levels`; design in section
Planning levels. Branch: `milestone-plan-levels`.

## Goal

The three planning horizons of `DESIGN.md` section Planning levels become rules in
`plan` and `code`, with one template per doc, so that a fresh session can run a
strategic, milestone or task plan from the skills alone. When the last task lands,
`DESIGN.md` section 5 holds one paragraph and a pointer to `plan` section Levels, and the
caveat in the project context is gone.

## Scope

In:

- `plan`: the level choice, the levels table, the chain rule, the `BR` home, the
  status homes and values, the amendment homes, the branch per level, the templates.
- `skills/plan/templates/`: one template per doc kind.
- `code`: the done write at task end, before the merge question.
- `docs/DESIGN.md`: section 5 shrinks; the milestone goal line drops "the milestones
  folder in `setup`"; the status writes of this milestone.
- The project context `## Caveats`: the planning-level caveat is removed.

Out:

- `setup`: no change. The levels table in `plan` names the doc paths; `setup` section
  Write already binds `<docs>`.
- The four plan files under `docs/plans/` that predate milestones: no parent line.
- The four edge cases of `DESIGN.md` section Open.
- Any skill other than `plan` and `code`, beyond a reference that a renamed or moved
  `plan` section forces.

## Requirements

Each `BR` is checked by reading the skill, by `lint`, or by a dry run of the level.

- BR-1: `plan` MUST take the level from its argument (`strategic`, `milestone`,
  `task`); with no argument, the first question MUST ask the level.
- BR-2: a strategic run MUST edit `<docs>/DESIGN.md` on a `design-<topic>` branch;
  the doc MUST hold the sections Decisions (dated lines with dropped alternatives) and
  Milestones (`name : goal : status`); the run MUST have no testable item and MUST
  stop at the milestone list.
- BR-3: a milestone run MUST write `<docs>/milestones/<name>.md` on a
  `milestone-<name>` branch, with the sections parent line, Goal, Scope (in, out),
  Requirements (the `BR` list), Tasks (ordered, branch names, status), Risks and Done
  criteria, in that order.
- BR-4: a task run MUST write `<docs>/plans/<branch>.md` with a parent line; each `TR`
  MUST trace to `<milestone>/BR-m`; a task with no milestone MUST keep its own `BR`
  list in the plan file; the plan file MUST exist also when the quiz has zero rounds.
- BR-5: each doc MUST name its parent in its first lines and MUST reference a parent
  fact instead of restating it.
- BR-6: milestone status MUST live only in `<docs>/DESIGN.md`, task status only in the
  milestone doc; the values MUST be open, done and dropped.
- BR-7: the final commit on a task branch, before the merge question, MUST mark the
  task done in the milestone doc; when that task was the milestone's last open one,
  the same commit MUST mark the milestone done in `<docs>/DESIGN.md`; no commit MUST
  land on `<base>`.
- BR-8: an amendment MUST go to the level that owns the fact: a `BR` gap found in a
  task amends the milestone doc on the task branch after the user's yes; an
  architecture gap re-enters plan mode at the strategic level on a design branch.
- BR-9: the three doc formats MUST live as templates under `skills/plan/templates/`;
  `plan` MUST reference them and MUST NOT restate their section lists.
- BR-10: `lint` MUST pass; `plan` MAY raise its `max-lines`.
- BR-11: the `plan` sections that other skills name (The plan, Amendments, Plan file,
  Self-review and approval) MUST keep their names, or every reference MUST be updated
  in the same commit.
- BR-12 (replaced by BR-13): once BR-1 to BR-9 hold, `<docs>/DESIGN.md` section
  Planning levels MUST hold only the levels table and one line that points at `plan`,
  and the planning-level caveat MUST be removed from the project context `## Caveats`.
- BR-13: once BR-1 to BR-9 hold, `<docs>/DESIGN.md` section Planning levels MUST hold
  one paragraph and one line that points at `plan` section Levels, and the
  planning-level caveat MUST be removed from the project context `## Caveats`.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order.

- plan-levels-skill : the `plan` skill rework, the three templates, the `delegate`
  section Briefs reference and the part-to-section references in `core`, `delegate`
  and `review` : BR-1, BR-2, BR-3, BR-4, BR-5, BR-6, BR-8, BR-9, BR-10,
  BR-11 : done
- code-done-write : the done write in `code`, the `DESIGN.md` section 5 shrink and
  goal-line fix, the caveat removal, the done writes of this milestone : BR-7, BR-10,
  BR-13 : done

## Risks

- `plan` is at 117 of 122 lines; the levels add rules. The templates take the section
  lists out, but `max-lines` likely rises. `lint` is the check.
- Nine references from `core`, `code`, `delegate`, `test`, `review` and `implement`
  point at `plan` sections. A rename breaks them silently; BR-11 is the guard.
- The done write of task 2 is the first real use of BR-7. If the rule reads wrong in
  practice, the fix is an amendment on that task branch (BR-8).
- No automated test reads a skill. A `BR` here is proven by reading, by `lint`, or by a
  dry run; the reviewer checks the text.

## Done criteria

- Both tasks are merged into `<base>` and marked done here; `plan-levels` is marked
  done in `<docs>/DESIGN.md`.
- `lint` passes on `<base>`.
- A fresh session that loads `plan` alone can run each of the three levels: the
  acceptance check is one dry run per level, read-only, stopped before the first
  write.
- `<docs>/DESIGN.md` section Planning levels is one paragraph plus one pointer line, and
  the project context `## Caveats` has no planning-level line.
