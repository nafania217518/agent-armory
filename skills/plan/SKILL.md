---
name: plan
description: >
  Plans work before any edit, at three levels: strategic (design doc and milestones),
  milestone (scope and BR requirements) and task (TR requirements and the plan file),
  with quizzes and the user's approval in plan mode. Use for a new task, "plan this",
  "make a plan", "plan a milestone", "design doc", "design this change", a changed
  requirement, "/plan", and from the code skill when no plan exists.
max-lines: 306
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# plan

Pre-work before any edit, at three levels. The main session runs every section except
Drafting; the planner runs only Drafting.

## 1. Levels

- The level MUST come from the argument `strategic`, `milestone` or `task`. With no
  argument, the first question MUST ask the level.
- The level question MUST come before any quiz round.
- Each level MUST use the doc, template and branch of this table. Template paths are
  relative to this skill.

| Level | Doc | Template | Branch | Holds | Ids |
|---|---|---|---|---|---|
| strategic | `<docs>/DESIGN.md`, edited in place | `templates/strategic.md`; other sections free | `design-<topic>` | architecture, dated decisions, the milestone list and milestone status | none |
| milestone | `<docs>/milestones/<name>.md` | `templates/milestone.md`, fixed | `milestone-<name>` | scope, the `BR` list, the tasks and their status | `BR-n` |
| task | `<docs>/plans/<branch>.md` | `templates/task.md`, fixed | the task branch | the `TR` list, test scope, overrides, accepted tech debt | `TR-n` |

- A milestone or task doc MUST name its parent in its first lines, with the template's
  parent line. It MUST reference a parent fact, not restate it.
- A milestone run MUST read `<docs>/DESIGN.md` first. A task run MUST read its milestone
  doc first. Each MUST read it on `<base>`; when `<base>` lacks it, the run MUST ask the
  user to merge the parent branch first.
- A milestone name MUST match a line of `<docs>/DESIGN.md` section Milestones. With none,
  the strategic level MUST add it first.
- A task run MUST take its milestone from the request. When the request names none, the
  first quiz round MUST ask which milestone the task belongs to, or none.
- With no tracker bound, a task with no milestone MUST take a slug of its title as its
  branch.
- Each title slug MUST be ASCII: a non-Latin title transliterated, lower case, words
  joined by `-`.
- A strategic run MUST have no testable item. It MUST stop at the milestone list; each
  milestone plan MUST be a separate run.
- A strategic run SHOULD add a decision line only when the decision is hard to reverse,
  surprising without context and the result of a real trade-off.
- When `<docs>/DESIGN.md` is missing, a strategic run MUST create it from the template.
  Else it MUST edit the file in place and keep its free sections.
- Milestone status MUST live only in `<docs>/DESIGN.md`. Task status MUST live only in
  the milestone doc. The status values MUST be open, done and dropped.
- A task-level plan run or a code run that adds no task to a milestone and reads that
  all its tasks are done MUST mark the milestone done: a status-line edit in
  `<docs>/DESIGN.md`, or, with a tracker bound, a status write under the `core` tracker
  write rule.
- With a tracker bound in the project context `## Tracker` (`core` section Host terms),
  each level MUST follow this tracker variant. The variant replaces only the docs-fallback
  rules it names; the table and the rules above MUST stay the docs fallback.
  - strategic: `<docs>/DESIGN.md` keeps its architecture and decisions and MUST hold no
    milestone list. Each new milestone MUST become a top-level tracker item. A run that
    creates `DESIGN.md` from `templates/strategic.md` MUST drop its Milestones section.
  - milestone: the milestone item body MUST take the sections of
    `templates/milestone.md` except the title line, the parent line and Tasks, and
    except `## Goal` when the item already holds its one-line goal. Each task MUST
    become a child item of the milestone item. Its body MUST hold the `<what> : <BR list>`
    of the Tasks format line. Blocked-by edges MUST hold the task's needs (section The
    plan).
  - Status MUST live only in the tracker.
  - A milestone name MUST match a top-level tracker item, not a `DESIGN.md` line. A task
    run MUST read its milestone item, body and comments, first.
  - A run MAY start from an existing tracker item. It MUST then read the item's body and
    comments first and take the item as its milestone or its task. Else it MUST create
    the items only after the approval. An item that holds its own `## Requirements`
    (`triage` section Outcomes) MUST be the milestone of a milestone run, or a task with
    no milestone of a task run, with no milestone question.
  - A task run with no task named MUST take the first ready task in the milestone item's
    child order: open, every blocker done, no assignee.
  - A task run MUST claim its task item right after it reads the item, before any quiz
    round or spawn. The user's start request is the yes for this write. When the item is
    closed or has any assignee, the user included, the run MUST stop and ask the user:
    take it over, pick another ready task, or stop. A task item the run creates after
    the approval MUST be claimed right after its create.
  - A task's branch MUST be the tracker's branch name for its item when the binding has
    that verb, else `<item id>-<title slug>`. The plan file path MUST be the branch with
    each `/` replaced by `-`.

## 2. Before the plan

- The main session itself MUST run the quizzes, the research and the approval.
- Planning spawns researchers and the planner: MUST load `delegate` first.
- Until the first proposal, the quizzes, the research and the drafts MUST run outside
  plan mode. The main session MUST enter plan mode only to propose, after the
  self-review (section Self-review and approval) passes.
- On a model below Opus or an effort below `high`, the main session SHOULD suggest a
  switch to the user before planning.
- Before building, SHOULD push back on any part of the request the need does not justify.
- Before the first quiz round, the main session MUST read each topic file whose
  pointer fits the request (`code` section Caveats).
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
  list in the plan file. With a tracker bound (section Levels, tracker variant), it MUST
  keep that list in its own task item body, and the plan file only the `TR` list.
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
- Each `TR` and each milestone task MUST name its needs: the items whose code, contract
  or data it uses, or `none`. A preferred order alone MUST NOT become a need; such items
  stay free to run at once.
- When items build both sides of one interface (an API spec, a module boundary, a
  service message, a shared type), the plan SHOULD put the contract in its own first
  item: the spec, the shared types and a contract test or stub. The items on each side
  then need only that item. A last item joins them through an integration or e2e test.
- Each milestone task and each `TR` SHOULD be a vertical slice: a thin path through
  every layer it needs, checkable on its own. A preparatory refactor SHOULD come first.
  A change that breaks callers across the codebase SHOULD use expand–contract: add the
  new form, move the callers in batches, remove the old form.
- The plan MUST hold the test-scope list (`test` section Test scope).
- The items, their `tests:` lines and the test-scope list SHOULD come as a draft from the
  planner (section Drafting), which loads `test` and `implement`. A main session that
  drafts them itself MUST load both.
- The plan SHOULD name the gates that apply, when relevant.
- A data-growth path is a read or write path whose cost grows with stored data: a
  query, a loop over stored rows, an index build.
- A `TR` that adds or changes a data-growth path MUST have a load `TR`: the data size,
  the operations measured and a latency target, such as p95. The figures MUST come from
  the expected load (`review` section Understand first).
- Before a load `TR` sets an absolute bar on an existing path, the plan MUST cite a
  current value measured on the current code. When that value misses the bar or lies
  within its run-to-run spread, the load `TR` MUST compare before and after instead:
  the median of at least 3 runs per side, on one machine in one session, with a stated
  bound, such as +5 ms per query.
- When the repo states no expected load, the quiz MUST ask the user for one; section
  Plan file writes the answer into `<docs>/DESIGN.md`.
- A load `TR` is the measurement that `core` section Design principles requires before
  an optimization; it is not itself an optimization.
- When a load `TR` may gate a later fix, the quiz SHOULD recommend keeping its
  benchmark as a tagged build target outside every gate, over a throwaway run.
- Planning SHOULD look for complexity to remove before adding; deletion SHOULD beat
  addition. The plan MAY include that simplification; during coding, the scope rule of
  `implement` section The smallest complete change wins.
- In a task run, a caveat found during planning (`core` section Reports) MUST go into
  the plan.

## 6. Self-review and approval

- Before proposing, MUST review the doc with the check of its level:
  - strategic: the doc has no testable item; every milestone line has a goal; every new
    milestone line has the status open; every new decision line carries its date and
    its dropped alternatives. With a tracker bound, the check MUST read the planned
    milestone items (a goal, status open) in place of the milestone lines.
  - milestone: each `BR` is testable and sits in exactly one task's `BR` list. A
    gate-type `BR`, one that applies to every task, such as one for `lint`, MUST sit
    in every open task's list.
  - task: every `BR` of the task has a `TR`; every `TR` has tests for its edge cases and
    failure paths, or a `tests: none` line; the design issues under `core` section
    Design principles, `implement` section Before you write and `implement` section
    Domain, boundaries and state are fixed; each claim in Caveats or Stack choices with
    "every", "all", "never" or "only" holds on each file that the `TR` items name, or
    is narrowed or dropped; every `TR` on a data-growth path (section The plan) has its
    load `TR`; each absolute bar of a load `TR` cites a current measurement.
- At the milestone and the task level, the review MUST also walk each new or changed
  flow path by path, end to end, against the branch, worktree and gate rules.
- At the milestone and the task level, the review MUST also check that each need is
  real and that each interface two items build has its contract item (section The
  plan).
- At the task level, the review MUST also walk each new `tests:` case, with its
  expected value, through its own `TR` and the existing rules of its component, in the
  plan and in the code. A case that one of them makes impossible MUST be dropped or
  rewritten.
- With a tracker bound (section Levels, tracker variant), the proposal MUST list each
  tracker write the run will make: creates, body edits, links, edges, comments and
  status sets, and the create of each follow-up item the plan cites. A task run MUST
  also list the done write of its `code` run, and the claim of a task item it creates.
- An open question MUST go to one more quiz round.
- Exiting plan mode is the approval. On a reject, MUST fix the part the user names and
  propose again. A fix that needs only plan edits or a quiz round MUST stay in plan
  mode. Any other fix MUST first ask the user to switch to auto mode or bypass
  permissions, and name the work; after it, MUST enter plan mode again.

## 7. Plan file

- After the approval, the main session MUST cut the level's branch (section Levels,
  column Branch) from `<base>` with the commands of `code` section Branch and plan file.
- It MUST then write the level's doc at its Doc path as the first commit; `core`
  section Host terms sets `<docs>`. The requirements MUST NOT go into a separate file.
- A task run MUST write its plan file also after zero quiz rounds.
- Right after that commit, the main session MUST write the caveats into the caveat
  base (`code` section Caveats): for a task run, the doc's caveats, except one about
  code that a `TR` of this task still builds or changes; for a strategic
  or milestone run, the caveats found during planning.
- In the same step, the main session MUST write each term the quiz settled into the
  project context `## Glossary`, in its format line. A plan template MUST NOT hold a
  glossary section.
- In the same step, the main session MUST write an expected load that the quiz
  settled into `<docs>/DESIGN.md`.
- A strategic or milestone run with a branch MUST end with the finish question of `code`
  section Finish for its branch.
- With a tracker bound (section Levels, tracker variant), a strategic or milestone run
  MUST follow this rule in place of the branch and doc-commit bullets above. It MUST
  create its items after the approval. A milestone run MUST write no milestone doc.
  Such a run MUST cut its level's branch only when it writes a repo file (`DESIGN.md`,
  the glossary or the caveats); that write MUST be its first commit. Else it
  MUST skip the branch and the finish question. A new milestone item body MUST hold its
  one-line goal.
- A run that creates several tracker items MUST create the blockers first. It MUST then
  add the blocked-by edges and the cross-references in a second pass, with real ids. It
  MUST NOT write a placeholder id; it MUST wait for the real id instead.

## 8. Amendments

- A requirement that changes during work, or needs the user's answer, MUST stop the work
  until the user's yes.
- An added or changed requirement MUST get a new id and MUST go to the user for a yes,
  with the new text, through the question tool. One exception, the
  `TR` of a defect in built code (below), needs no yes: it repairs approved work.
- A change the user asks for during a code run MUST get its `BR` in the same
  amendment as its `TR`; the user's request is the yes for both.
- An amendment MUST go to the doc that owns the fact (section Levels).
- A `BR` gap found in a task run MUST amend the owning doc, after the user's yes: the
  milestone doc on the task branch, or the milestone item with a tracker bound.
- With a tracker bound, an amendment that cites a follow-up item MUST list that item's
  create in its question and in the plan's tracker writes.
- A task that its milestone doc does not list MUST get its Tasks line as an amendment.
- An amendment that adds a gate-type `BR` (section Self-review and approval) MUST also
  add it to each open task of the milestone: to the `<what> : <BR list>` line of each
  open child item body, with the AI marker line above the changed line, or, in the docs
  fallback, to each open task line of the milestone doc. The amendment question MUST
  list these tracker writes.
- A change to the design MUST go back to section Before the plan: quizzes, plan,
  approval. A redesign the user approves is such a change.
- An architecture gap MUST re-plan at the strategic level, on a `design-<topic>` branch.
- A defect in built code MUST get a new `TR-n` and its test (`implement` section Fixing
  and refactoring).
- The main session MUST allocate every new id. A subagent MUST NOT allocate one.
- Before the next brief, the main session MUST write each new id and
  `(replaced by <new id>)` mark into the owning doc and commit it.
- An old item's id and text MUST NOT be rewritten or renumbered. MUST mark it
  `(replaced by <new id>)`; the mark covers its old text.
- The brief of a `TR` that replaces another MUST tell the coder to re-point each
  `req:` marker of the old id to the new id.
- A wrong `tests:` case of a `TR` whose behavior stays MUST get a dated note below the
  `TR` list that names the `TR` and gives the corrected case. A changed behavior takes
  a new id (above).
- When an amendment replaces or removes a term (a profile, a file, a class), the main
  session MUST grep the owning doc, the plan file and the project context for that
  term before it asks the user. Each requirement line that names the term
  MUST join that amendment's question, with its new id. At the amendment commit, the
  main session MUST mark those lines `(replaced by <new id>)` and MUST update each
  line that is not a requirement and names the term, such as a Risks or a Caveats line.

## 9. Drafting

- The main session MAY spawn the planner agent for a draft, in the formats of sections
  Requirements and The plan, checked against section Self-review and approval. The
  `planner` agent card sets its role and limits; `delegate` section Models sets its
  model.
