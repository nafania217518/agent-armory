---
name: plan
description: >
  Pre-work at three levels: strategic (the design doc and its milestone list), milestone
  (scope, BR-n requirements, task list) and task (TR-n requirements, the plan file). Plan
  mode, quizzes, self-review, approval, amendments, and the planner's drafting part. Use
  for a new task, "plan this", "make a plan", "plan a milestone", "design doc", "design
  this change", a changed requirement, "/plan", and from the code skill when no plan
  exists.
max-lines: 194
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# plan

Pre-work before any edit, at three levels. The main session runs every section except
Drafting; the planner runs only Drafting.

## 1. Levels

- The level MUST come from the argument `strategic`, `milestone` or `task`. With no
  argument, the first question MUST ask the level.
- Plan mode MUST start before the level question. The level question MUST come before any
  quiz round.
- Each level MUST use the doc, template and branch of this table. Template paths are
  relative to this skill.

| Level | Doc | Template | Branch | Holds | Ids |
|---|---|---|---|---|---|
| strategic | `<docs>/DESIGN.md`, edited in place | `templates/strategic.md`; other sections free | `design-<topic>` | architecture, dated decisions, the milestone list and milestone status | none |
| milestone | `<docs>/milestones/<name>.md` | `templates/milestone.md`, fixed | `milestone-<name>` | scope, the `BR` list, the task list and task status | `BR-n` |
| task | `<docs>/plans/<branch>.md` | `templates/task.md`, fixed | the task branch | the `TR` list, test scope, overrides, accepted debt | `TR-n` |

- A milestone or task doc MUST name its parent in its first lines, with the template's
  parent line. It MUST reference a parent fact, not restate it.
- A milestone run MUST read `<docs>/DESIGN.md` first. A task run MUST read its milestone
  doc first.
- A milestone name MUST match a line of `<docs>/DESIGN.md` section Milestones. With none,
  the strategic level MUST add it first.
- A task run MUST take its milestone from the request. When the request names none, the
  first quiz round MUST ask which milestone the task belongs to, or none.
- A strategic run MUST have no testable item. It MUST stop at the milestone list; each
  milestone plan MUST be a separate run.
- A strategic run SHOULD add a decision line only when the decision is hard to reverse,
  surprising without context and the result of a real trade-off.
- When `<docs>/DESIGN.md` is missing, a strategic run MUST create it from the template.
  Else it MUST edit the file in place and keep its free sections.
- Milestone status MUST live only in `<docs>/DESIGN.md`. Task status MUST live only in
  the milestone doc. The status values MUST be open, done and dropped.

## 2. Before the plan

- The main session itself MUST run plan mode (else its fallback: the approval question,
  `core` section Host terms), the quizzes and the approval.
- Planning spawns researchers and the planner: MUST load `delegate` first.
- The quizzes, the planning research and the plan MUST run in plan mode. Research during
  coding does not.
- On a model below Opus or an effort below `high`, the main session SHOULD suggest a
  switch to the user before planning.
- Before building, SHOULD push back on any part of the request the need does not justify.
- Before any edit, MUST quiz the user in rounds until no open point remains (an unclear
  requirement, a choice, an assumption), and wait for the answers. Section Quizzes sets
  the order and topics; `core` section Writing and questions sets the question format.
- MUST NOT write any repo file before the approval. Planning MUST NOT write code, tests
  or config.

## 3. Quizzes

- The business quiz MUST come first: goal, who is affected, done criteria, users,
  features, business rules, out of scope, constraints.
- The tech quiz MUST follow: stack, data, interfaces, constraints, test levels, risks,
  acceptance.
- Each topic MUST be covered when, and only when, it is relevant to the task.
- A round MUST ask only the questions whose prerequisite answers are in. A question that
  depends on another open question of the round MUST wait for a later round.
- A quiz MUST NOT ask a fact that the parent doc, the repo, a tool or an agent can
  settle: the main session MUST find it. A running lookup MUST hold back only the
  questions that depend on it.
- During a quiz, the main session MUST name a term that conflicts with the project
  context `## Glossary`, MUST propose a precise term for a vague or overloaded one, and
  MUST check each claim the user makes about the code against the code, naming any
  contradiction.
- A task run MAY have zero quiz rounds when its parent doc leaves no open point.
- An unknown (a library, API, model or domain fact) MUST go to research (`research`
  section When to research), then, when needed, to a quiz on the findings and next steps.

## 4. Requirements

- An answer MUST become a `BR` or `TR` only when it is testable: a behavior or a
  measurable constraint, such as `TR-5 (BR-2): MUST NOT lock the table for more than 1 s`.
  A `BR` is testable when its `TR` items together prove it. A goal no test can prove MUST
  go into the doc's Goal section.
- In a milestone run, or a task run with no milestone, each testable business answer
  MUST become a `BR` in the item format of `templates/milestone.md`.
- A `BR` MUST live in the milestone doc. A task with no milestone MUST keep its own `BR`
  list in the plan file.
- A task run under a milestone MUST NOT add a `BR`. A `BR` gap MUST go to section
  Amendments.
- In a task run, each testable tech answer MUST become a `TR` in the item format of
  `templates/task.md`.
- In a milestone run, a testable tech answer MUST become a `BR` or a Risks line. A
  strategic or milestone doc MUST NOT hold a `TR`.
- Each `TR` MUST trace to `<milestone>/BR-m`, or to `BR-m` for a task with no milestone.
  The numbered `TR` list MUST exist before the code.

## 5. The plan

- The task plan MUST take the sections, order and format lines of `templates/task.md`.
  An item of a section other than Requirements MUST NOT go into a `BR` or a `TR`.
- The Overrides section MUST name each design rule the plan overrides (`core` section
  Rule words) and its reason.
- The plan MUST list the `TR` items in execution order; an item that a later item's gate
  command needs MUST come first. Each `tests:` line MUST follow `test` section TDD.
- Each milestone task and each `TR` SHOULD be a vertical slice: a thin path through
  every layer it needs, checkable on its own. A preparatory refactor SHOULD come first.
  A change that breaks callers across the codebase SHOULD use expand–contract: add the
  new form, move the callers in batches, remove the old form.
- The plan MUST hold the test-scope list (`test` section Test scope).
- The items, their `tests:` lines and the test-scope list SHOULD come as a draft from the
  planner (section Drafting), which loads `test` and `implement`. A main session that
  drafts them itself MUST load both.
- The plan SHOULD name the gates that apply, when relevant.
- Planning SHOULD look for complexity to remove before adding; deletion SHOULD beat
  addition. The plan MAY include that simplification; during coding, the scope rule of
  `implement` section The smallest complete change wins.
- In a task run, a caveat found during planning (`core` section Reports) MUST go into
  the plan.

## 6. Self-review and approval

- Before proposing, MUST review the doc with the check of its level:
  - strategic: the doc has no testable item; every milestone line has a goal; every new
    milestone line has the status open; every new decision line carries its date and
    its dropped alternatives.
  - milestone: each `BR` is testable and sits in exactly one task's `BR` list. A
    gate-type `BR`, such as one for `lint`, MAY sit in several.
  - task: every `BR` of the task has a `TR`; every `TR` has tests for its edge cases and
    failure paths, or a `tests: none` line; the design issues under `core` section
    Design principles, `implement` section Before you write and `implement` section
    Domain, boundaries and state are fixed.
- An open question MUST go to one more quiz round.
- Exiting plan mode, or a yes to the approval question, is the approval. On a reject,
  MUST fix the part the user names and propose again.

## 7. Plan file

- After the approval, the main session MUST cut the level's branch (section Levels,
  column Branch) from `<base>` with the commands of `code` section Branch and plan file.
- It MUST then write the level's doc at its Doc path as the first commit; `core`
  section Host terms sets `<docs>`. The requirements MUST NOT go into a separate file.
- A task run MUST write its plan file also after zero quiz rounds.
- Right after that commit, the main session MUST write the caveats into the project
  context `## Caveats`: for a task run, the doc's caveats; for a strategic or milestone
  run, the caveats found during planning.
- In the same step, the main session MUST write each term the quiz settled into the
  project context `## Glossary`, in its format line. A plan template MUST NOT hold a
  glossary section.
- A strategic or milestone run MUST end with the merge question of `code` section Finish
  for its branch.

## 8. Amendments

- A requirement that changes during work, or needs the user's answer, MUST stop the work
  until the user's yes.
- An added or changed requirement MUST get a new id and MUST go to the user for approval,
  with the new text, through the question tool, else its fallback. The one exception, the
  `TR` of a defect in built code (below), needs no approval: it repairs approved work.
- An amendment MUST go to the doc that owns the fact (section Levels).
- A `BR` gap found in a task run MUST amend the milestone doc on the task branch, after
  the user's yes.
- A change to the design MUST go back to plan mode: quizzes, plan, approval. A redesign
  the user approves is such a change.
- An architecture gap MUST re-enter plan mode at the strategic level, on a
  `design-<topic>` branch.
- A defect in built code MUST get a new `TR-n` and its test (`implement` section Fixing
  and refactoring).
- The main session MUST allocate every new id. A subagent MUST NOT allocate one.
- Before the next brief, the main session MUST write each new id and
  `(replaced by <new id>)` mark into the owning doc and commit it.
- An old id MUST NOT be rewritten or renumbered. MUST mark it `(replaced by <new id>)`.

## 9. Drafting

- The main session MAY spawn the planner agent for a draft, in the formats of sections
  Requirements and The plan, checked against section Self-review and approval. The
  `planner` agent card sets its role and limits; `delegate` section Models sets its
  model.
