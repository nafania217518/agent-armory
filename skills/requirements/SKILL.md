---
name: requirements
description: >
  Abstract: load only through a skill that extends it. The `BR` and `TR` formats, the
  plan-doc section rules, the milestone check, the flow walk and the plan templates.
metadata:
  type: abstract
  extends: [core, craft]
  max-lines: 103
user-invocable: false
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `craft` before you write or check a `TR` when its rules are not in your context.

# requirements

## 1. Requirement items

- An answer MUST become a `BR` or `TR` only when testable: a behavior or a measurable
  constraint, such as `TR-5 (BR-2): MUST NOT lock the table for more than 1 s`. A `BR` is
  testable when its `TR` items together prove it. A goal no test can prove MUST go into
  the doc's Goal section; with a tracker bound, a task plan MUST leave it to its task
  item, and a milestone item body MUST put it in its opening one-line goal.
- In a milestone run, or a task run with no milestone, each testable business answer MUST
  become a `BR` in the item format of `templates/milestone.md`.
- In a task run, each testable tech answer MUST become a `TR` in the item format of
  `templates/task.md`.
- In a milestone run, a testable tech answer MUST become a `BR` or a Risks line. A
  strategic or milestone doc MUST NOT hold a `TR`.
- Each `TR` MUST trace to `<milestone>/BR-m`, or to `BR-m` for a task with no milestone.
  The numbered `TR` list MUST exist before the code.
- A defect in built code is a bug in code this task already merged, outside the commit
  range under review.

## 2. Plan docs

- Plan file MUST hold only the sections of `templates/task.md`, in its order, with only
  their items, each in its section's format line, never a format line or other template
  text. Each fact MUST sit in one section; another section MUST name it by section or `TR`
  id, never copy it, figures included.
- Context, assumptions, dropped alternatives, tracker writes, quiz answers and any other
  text that serves only the approval MUST stay in the plan-mode proposal.
- A section with no item MUST be left out, except Requirements and Test scope. A missing
  Overrides or Accepted tech debt section MUST mean none.
- The three bullets above MUST also hold for a milestone doc and a milestone item body,
  with `templates/milestone.md`; there, only Requirements and, in a milestone doc, Tasks
  stay when empty; a milestone item body also keeps its opening one-line goal.
  A triage `## Requirements` section that the item already holds MAY keep its place.
- Requirements MUST hold only `TR` items and dated amendment notes, beside the `BR` list:
  no order line, summary, API table or key that restates them, and no `TR` that only says
  the `on` gates pass; a gate-type `BR` needs no `TR`; each `tests:` line names the gate
  instead. A `TR` MUST state only its behavior and its indented lines, and MAY hold the
  exact text it prescribes as an indented block under it; its reason MUST go to Design.
  An item of another section MUST NOT go into a `BR` or `TR`; it MUST stay in its own
  section.
- Overrides section MUST name each design rule the plan overrides (`core` §1) and
  its reason.
- Each Risks line MUST name the `TR`, or in a milestone the `BR` or task, that checks or
  limits it, or the quiz answer that accepts it. A risk of failure in behavior the task
  builds MUST go to a quiz round first.
- Plan MUST list `TR` items in execution order; an item that a later item's gate command
  needs MUST come first. Each `tests:` line MUST follow `craft` §3 and name a gate by
  its name, never by its command or a case count. A `TR` that breaks or reworks a test of
  a gate MUST name that gate in its `tests:` line.
- Each `TR` and each milestone task MUST name its needs: the items whose code, contract or
  data it uses, or `none`. A preferred order alone MUST NOT become a need; such items stay
  free to run at once.
- When items build both sides of one interface (an API spec, a module boundary, a service
  message, a shared type), plan SHOULD put the contract in its own first item: the spec,
  shared types and a contract test or stub. Items on each side then need only that item. A
  last item joins them through an integration or e2e test.
- Each milestone task and each `TR` SHOULD be a vertical slice: a thin path through every
  layer it needs, checkable on its own. A preparatory refactor SHOULD come first. A change
  that breaks callers across the codebase SHOULD use expand–contract: add the new form,
  move callers in batches, remove the old form.
- Plan MUST hold the test-scope list (`craft` §4).
- Each `TR` that adds or changes a data-growth path (`craft` §6) MUST carry its `load:`
  line: its load `TR` id, or `load: none, <why>`. A load `TR` MUST state data size,
  operations measured, each measured query as text or as the rule that draws it from seed
  data, and a latency target, such as p95. Figures MUST come from the expected load that
  the repo states. Its benchmark MUST meet the row check of `craft` §6.
- A `TR` that sets a bar on a measured value MUST cite a current value, measured on
  current code or a probe, with its spread over at least 3 runs. A bar at the metric's
  ceiling or floor, or within that spread, MUST change before approval: another metric or
  data set, or a before-and-after bound (median of at least 3 runs per side, on one
  machine in one session, such as +5 ms per query).
- When the task's goal is a measured gain, its measurement item and data MUST come first,
  with `needs: none`, and MUST run before the first feature item. When the baseline
  leaves no room for the gain, main session MUST ask user.
- A load `TR` is the measurement that `core` §4 requires before an
  optimization; it is not itself an optimization.

## 3. Checks

- Milestone check: each `BR` MUST be testable and sit in exactly one task's `BR` list. A
  gate-type `BR`, one that applies to every task, such as one for `lint`, MUST sit in
  every open task's list.
- Flow walk: review MUST walk each new or changed flow path by path, from the command the
  user runs (gate, CLI, page) to where each output lands, against the branch, worktree and
  gate rules. It MUST also check that each need is real and each interface two items build
  has its contract item (§2).
