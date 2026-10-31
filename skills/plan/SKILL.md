---
name: plan
description: >
  Pre-work for a task: plan mode, business and tech quizzes, BR-n and TR-n requirements,
  the plan, self-review, approval, the plan file, amendments, and the planner's drafting
  part. Use for a new task, "plan this", "make a plan", "design this change", a changed
  requirement, "/plan", and from the code skill when no plan exists.
max-lines: 130
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# plan

Pre-work before any edit: quizzes, requirements, the plan, approval and the plan file.
The main session runs every section except Drafting. The planner runs only Drafting.

## 1. Before the plan

- The main session MUST run plan mode, the quizzes and the approval itself.
- Planning spawns researchers and the planner: MUST load `delegate` first (`/delegate`,
  or `/armory:delegate` in the plugin).
- The quizzes, the planning research and the plan MUST run in plan mode. Research
  during coding runs outside plan mode.
- When the main session runs on a model below Opus or an effort below `high`, it SHOULD
  suggest to the user to switch before planning.
- SHOULD push back, before building, on any part of the request that the need does not
  justify.
- Before any edit, MUST quiz the user in rounds until no open point remains (an unclear
  requirement, a choice between options, an assumption), and wait for the answers.
  Section Quizzes sets the order and topics; `core` section Writing and questions sets
  the question format.
- MUST NOT write any repo file before the approval. Planning MUST NOT write code, tests
  or config.

## 2. Quizzes

- The business quiz MUST come first: goal, who is affected, done criteria, users,
  features, business rules, out of scope, constraints.
- The tech quiz MUST follow: stack, data, interfaces, constraints, test levels, risks,
  acceptance.
- Each topic MUST be covered when it is relevant to the task, and only then.
- An unknown during planning (a library, API, model or domain fact) MUST go to research
  (`research` section When to research). Then, if needed, the user MUST get a quiz on
  the findings and the next steps.

## 3. Requirements

- An answer MUST become a `BR` or a `TR` only when it is testable: a behavior or a
  measurable constraint, such as `TR-5 (BR-2): MUST NOT lock the table for more than
  1 s`. A `BR` is testable when its `TR` items can prove it together. A goal that no
  test can prove goes into the plan's Goal part instead.
- Each testable business answer MUST become `BR-n: MUST <behavior>`.
- Each testable tech answer MUST become a `TR` in the item format of section The plan.
  Each `TR` MUST trace to a `BR`. The numbered `TR` list MUST exist before the code.

## 4. The plan

- Besides the `TR` list, the plan MUST hold these parts: Goal (the context), Risks,
  Stack choices, Out of scope, Accepted tech debt and Overrides. Their items MUST NOT go
  into a `BR` or a `TR`.
- The Overrides part MUST name every design rule the plan overrides (`core` section
  Rule words), each with its reason.
- The plan MUST list the `TR` items in execution order. An item that a later item's gate
  command depends on MUST come first. Each item MUST take the item format
  `TR-<n> (BR-<m>, ...): MUST <behavior>` and MUST have an indented `tests:` line that
  names its tests, or `tests: none, <why>`, under the rules of `test` section TDD.
- The plan MUST hold the test-scope list (`test` section Test scope).
- The draft of the items, their `tests:` lines and the test-scope list SHOULD come from
  the planner (section Drafting), which loads `test` and `implement`. When the main
  session drafts them itself, it MUST load `test` (`/test`, or `/armory:test` in the
  plugin) and `implement` (`/implement`, or `/armory:implement`).
- The plan SHOULD name the gates that apply, when relevant.
- Planning SHOULD look for complexity to take out before adding anything; deletion
  SHOULD beat addition. The plan MAY include that simplification. During coding, the
  scope rule of `implement` section The smallest complete change wins.
- A caveat found during planning (`core` section Reports) MUST go into the plan.

## 5. Self-review and approval

- Before proposing, MUST review the plan: every `BR` has a `TR`; every `TR` has tests
  for its edge cases and failure paths, or a `tests: none` line (`test` section TDD);
  the design issues under `core` section Design principles, `implement` section Before
  you write and `implement` section Domain, boundaries and state are fixed.
- An open question MUST go to one more quiz round.
- Exiting plan mode is the approval. On a reject, MUST fix the part the user names and
  propose again.

## 6. Plan file

- After the approval, the main session MUST cut the task branch (`code` section Branch
  and plan file).
- It MUST then write the plan, `BR` and `TR` text included, as the first commit:
  `<docs>/plans/<task-branch>.md`. `init-project` section Write sets `<docs>`.
- The plan file MUST hold the requirements. They MUST NOT go into a separate file.
- Right after that commit, the main session MUST write the plan's caveats into
  `AGENTS.md` `## Caveats` (`core` section Reports).

## 7. Amendments

- A requirement that changes during work, or needs the user's answer, MUST stop the
  work. The work continues after the user's yes.
- An added or changed requirement MUST get a new id. It MUST go to the user for
  approval through `AskUserQuestion`, with the new text. The one exception is the `TR`
  of a defect in built code (below): it needs no approval, because a defect fix repairs
  approved work.
- A change to the design MUST go back to plan mode: quizzes, plan, approval. A redesign
  the user approves (`implement` section Before you write) is such a change.
- A defect in built code MUST get a new `TR-n` and its test (`implement` section Fixing
  and refactoring).
- The main session MUST allocate every new id. A subagent MUST NOT allocate one.
- Before the next brief, the main session MUST write each new id and each
  `(replaced by TR-m)` mark into the plan file, and commit it.
- An old id MUST NOT be rewritten or renumbered. MUST mark it `(replaced by TR-m)`.

## 8. Drafting

- The main session MAY spawn the planner agent for a draft. The `planner` agent card
  sets its role; `delegate` section Models sets its model.

The planner drafts in the formats of sections Requirements and The plan, checked against
section Self-review and approval. Its limits are on the planner card.
