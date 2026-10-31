---
name: plan
description: >
  Pre-work for a task: plan mode, business and tech quizzes, BR-n and TR-n requirements,
  the plan, self-review, approval, the plan file, amendments, and the planner's drafting
  part. Use for a new task, "plan this", "make a plan", "design this change", a changed
  requirement, "/plan", and from the code skill when no plan exists.
max-lines: 122
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# plan

Pre-work before any edit. The main session runs every section except Drafting; the
planner runs only Drafting.

## 1. Before the plan

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

## 2. Quizzes

- The business quiz MUST come first: goal, who is affected, done criteria, users,
  features, business rules, out of scope, constraints.
- The tech quiz MUST follow: stack, data, interfaces, constraints, test levels, risks,
  acceptance.
- Each topic MUST be covered when, and only when, it is relevant to the task.
- An unknown (a library, API, model or domain fact) MUST go to research (`research`
  section When to research), then, when needed, to a quiz on the findings and next steps.

## 3. Requirements

- An answer MUST become a `BR` or `TR` only when it is testable: a behavior or a
  measurable constraint, such as `TR-5 (BR-2): MUST NOT lock the table for more than 1 s`.
  A `BR` is testable when its `TR` items together prove it. A goal no test can prove goes
  into the plan's Goal part.
- Each testable business answer MUST become `BR-n: MUST <behavior>`.
- Each testable tech answer MUST become a `TR` in the item format of section The plan.
  Each `TR` MUST trace to a `BR`. The numbered `TR` list MUST exist before the code.

## 4. The plan

- Besides the `TR` list, the plan MUST hold these parts: Goal (the context), Risks,
  Stack choices, Out of scope, Accepted tech debt and Overrides. Their items MUST NOT go
  into a `BR` or a `TR`.
- The Overrides part MUST name each design rule the plan overrides (`core` section Rule
  words) and its reason.
- The plan MUST list the `TR` items in execution order; an item that a later item's gate
  command needs MUST come first. Each item MUST take the item format
  `TR-<n> (BR-<m>, ...): MUST <behavior>` and an indented `tests:` line that names its
  tests, or `tests: none, <why>` (`test` section TDD).
- The plan MUST hold the test-scope list (`test` section Test scope).
- The items, their `tests:` lines and the test-scope list SHOULD come as a draft from the
  planner (section Drafting), which loads `test` and `implement`. A main session that
  drafts them itself MUST load both.
- The plan SHOULD name the gates that apply, when relevant.
- Planning SHOULD look for complexity to remove before adding; deletion SHOULD beat
  addition. The plan MAY include that simplification; during coding, the scope rule of
  `implement` section The smallest complete change wins.
- A caveat found during planning (`core` section Reports) MUST go into the plan.

## 5. Self-review and approval

- Before proposing, MUST review the plan: every `BR` has a `TR`; every `TR` has tests
  for its edge cases and failure paths, or a `tests: none` line; the design issues under
  `core` section Design principles, `implement` section Before you write and `implement`
  section Domain, boundaries and state are fixed.
- An open question MUST go to one more quiz round.
- Exiting plan mode, or a yes to the approval question, is the approval. On a reject,
  MUST fix the part the user names and propose again.

## 6. Plan file

- After the approval, the main session MUST cut the task branch (`code` section Branch
  and plan file).
- It MUST then write the plan, the requirements (`BR` and `TR` text) included, as the
  first commit: `<docs>/plans/<task-branch>.md`; `setup` section Write sets `<docs>`.
  The requirements MUST NOT go into a separate file.
- Right after that commit, the main session MUST write the plan's caveats into the
  project context `## Caveats`.

## 7. Amendments

- A requirement that changes during work, or needs the user's answer, MUST stop the work
  until the user's yes.
- An added or changed requirement MUST get a new id and MUST go to the user for approval,
  with the new text, through the question tool, else its fallback. The one exception, the
  `TR` of a defect in built code (below), needs no approval: it repairs approved work.
- A change to the design MUST go back to plan mode: quizzes, plan, approval. A redesign
  the user approves is such a change.
- A defect in built code MUST get a new `TR-n` and its test (`implement` section Fixing
  and refactoring).
- The main session MUST allocate every new id. A subagent MUST NOT allocate one.
- Before the next brief, the main session MUST write each new id and `(replaced by TR-m)`
  mark into the plan file and commit it.
- An old id MUST NOT be rewritten or renumbered. MUST mark it `(replaced by TR-m)`.

## 8. Drafting

- The main session MAY spawn the planner agent for a draft, in the formats of sections
  Requirements and The plan, checked against section Self-review and approval. The
  `planner` agent card sets its role and limits; `delegate` section Models sets its
  model.
