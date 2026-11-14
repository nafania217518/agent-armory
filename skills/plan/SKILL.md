---
name: plan
description: >
  Plans work before any edit, at three levels: strategic (design doc and milestones),
  milestone (scope and BR requirements) and task (TR requirements and the plan file),
  with quizzes and the user's approval in plan mode. Use for a new task, "plan this",
  "make a plan", "plan a milestone", "design doc", "design this change", a changed
  requirement, "/plan", and from the code skill when no plan exists.
max-lines: 356
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# plan

Pre-work before any edit, at three levels. Main session runs every section except
Drafting; planner runs only Drafting.

## 1. Levels

- Level MUST come from argument `strategic`, `milestone` or `task`. With no argument,
  first question MUST ask the level.
- Level question MUST come before any quiz round.
- Each level MUST use the doc, template and branch of this table. Template paths are
  relative to this skill.

| Level | Doc | Template | Branch | Holds | Ids |
|---|---|---|---|---|---|
| strategic | `<docs>/DESIGN.md`, edited in place | `templates/strategic.md`; other sections free | `design-<topic>` | architecture, dated decisions, the milestone list and milestone status | none |
| milestone | `<docs>/milestones/<name>.md` | `templates/milestone.md`, fixed | `milestone-<name>` | out of scope, the `BR` list, the tasks and their status, risks | `BR-n` |
| task | `<docs>/plans/<branch>.md` | `templates/task.md`, fixed | the task branch | design, the `TR` list, test scope, risks, overrides, accepted tech debt | `TR-n` |

- Milestone or task doc MUST name its parent in its first lines, with the template's
  parent line. It MUST reference a parent fact, not restate it.
- Milestone run MUST read `<docs>/DESIGN.md` first. Task run MUST read its milestone doc
  first. Each MUST read it on `<base>`; when `<base>` lacks it, run MUST ask user to merge
  the parent branch first.
- Milestone name MUST match a line of `<docs>/DESIGN.md` §Milestones. With none, strategic
  level MUST add it first.
- Task run MUST take its milestone from the request. When request names none, first quiz
  round MUST ask for the task's milestone, or none.
- With no tracker bound, a task with no milestone MUST take its title slug as its branch.
- Each title slug MUST be ASCII: a non-Latin title transliterated, lower case, words
  joined by `-`.
- Strategic run MUST have no testable item. It MUST stop at the milestone list; each
  milestone plan MUST be a separate run.
- Strategic run SHOULD add a decision line only when the decision is hard to reverse,
  surprising without context and the result of a real trade-off.
- When `<docs>/DESIGN.md` is missing, strategic run MUST create it from the template. Else
  it MUST edit the file in place and keep its free sections.
- Milestone status MUST live only in `<docs>/DESIGN.md`. Task status MUST live only in the
  milestone doc. Status values MUST be open, done and dropped.
- Task-level plan run or code run that adds no task to a milestone and reads that all its
  tasks are done MUST mark the milestone done: a status-line edit in `<docs>/DESIGN.md`,
  or, with a tracker bound, a status write under `core` tracker write rule.
- With a tracker bound in project context `## Tracker` (`core` §Host terms), each level
  MUST follow this tracker variant. The variant replaces only the docs-fallback rules it
  names; the table and rules above MUST stay the docs fallback.
  - strategic: `<docs>/DESIGN.md` keeps its architecture and decisions and MUST hold no
    milestone list. Each new milestone MUST become a top-level tracker item. A run that
    creates `DESIGN.md` from `templates/strategic.md` MUST drop its Milestones section.
  - milestone: milestone item body MUST take the sections of `templates/milestone.md`
    except the title line, parent line, Goal and Tasks. Each task MUST become a child
    item of the milestone item. Its body MUST hold the `<what> : <BR list>` of the Tasks
    format line. Blocked-by edges MUST hold the task's needs (§The plan).
  - Status MUST live only in the tracker.
  - Milestone name MUST match a top-level tracker item, not a `DESIGN.md` line. Task run
    MUST read its milestone item, body and comments, first.
  - A run MAY start from an existing tracker item. It MUST then read the item's body and
    comments first and take the item as its milestone or task. Else it MUST create the
    items only after approval. An item that holds its own `## Requirements` (`triage`
    §Outcomes) MUST be the milestone of a milestone run, or a task with no milestone of a
    task run, with no milestone question.
  - Task run with no task named MUST take the first ready task in milestone item's child
    order: open, every blocker done, no assignee.
  - Task run MUST claim its task item right after it reads the item, before any quiz round
    or spawn. User's start request is the yes for this write. When the item is closed or
    has any assignee, user included, run MUST stop and ask user: take it over, pick
    another ready task, or stop. A task item the run creates after approval MUST be
    claimed right after its create.
  - Task's branch MUST be the tracker's branch name for its item when the binding has that
    verb, else `<item id>-<title slug>`. Plan file path MUST be the branch with each `/`
    replaced by `-`.

## 2. Before the plan

- Main session itself MUST run the quizzes, research and approval.
- Planning spawns researchers and the planner: MUST load `delegate` first.
- Until the first proposal, quizzes, research and drafts MUST run outside plan mode. Main
  session MUST enter plan mode only to propose, after the self-review (§Self-review and
  approval) passes.
- On a model below Opus or an effort below `high`, main session SHOULD suggest a switch to
  user before planning.
- Before building, SHOULD push back on any part of the request the need does not justify.
- Before the first quiz round, main session MUST read each topic file whose pointer fits
  the request (`code` §Caveats).
- Before any edit, MUST quiz user in rounds until no open point remains (an unclear
  requirement, a choice, an assumption), and wait for answers. §Quizzes sets the order
  and topics; `core` §Writing and questions sets the question format.
- MUST NOT write any repo file before approval. Planning MUST NOT write code, tests or
  config.

## 3. Quizzes

- Business quiz MUST come first: goal, who is affected, done criteria, users, features,
  business rules, out of scope, constraints.
- Tech quiz MUST follow: stack, data, interfaces, constraints, test levels, risks,
  acceptance. When a plan item repairs a rule breach that the repo holds elsewhere too, it
  MUST ask: fix all here, a follow-up item, or leave.
- Each topic MUST be covered when, and only when, it is relevant to the task.
- A round MUST ask only questions whose prerequisite answers are in. A question that
  depends on another open question of the round MUST wait for a later round.
- A quiz MUST NOT ask a fact the parent doc, repo, a tool or an agent can settle: main
  session MUST find it. A running lookup MUST hold back only questions that depend on it.
- During a quiz, main session MUST name a term that conflicts with project context
  `## Glossary`, MUST propose a precise term for a vague or overloaded one, and MUST check
  each claim user makes about the code against the code, naming any contradiction.
- Task run MAY have zero quiz rounds when its parent doc leaves no open point.
- An unknown (a library, API, model or domain fact) MUST go to research (`research` §When
  to research), then, when needed, to a quiz on the findings and next steps.

## 4. Requirements

- An answer MUST become a `BR` or `TR` only when testable: a behavior or a measurable
  constraint, such as `TR-5 (BR-2): MUST NOT lock the table for more than 1 s`. A `BR` is
  testable when its `TR` items together prove it. A goal no test can prove MUST go into
  the doc's Goal section; with a tracker bound, a task plan or a milestone item body MUST
  leave it to its item.
- In a milestone run, or a task run with no milestone, each testable business answer MUST
  become a `BR` in the item format of `templates/milestone.md`.
- A `BR` MUST live in the milestone doc. A task with no milestone MUST keep its own `BR`
  list in the plan file, or, with a tracker bound (§Levels, tracker variant), in its own
  task item body. With a tracker bound, plan file MUST hold no `BR` text, only `BR` ids.
- Task run under a milestone MUST NOT add a `BR`. A `BR` gap MUST go to §Amendments.
- In a task run, each testable tech answer MUST become a `TR` in the item format of
  `templates/task.md`.
- In a milestone run, a testable tech answer MUST become a `BR` or a Risks line. A
  strategic or milestone doc MUST NOT hold a `TR`.
- Each `TR` MUST trace to `<milestone>/BR-m`, or to `BR-m` for a task with no milestone.
  The numbered `TR` list MUST exist before the code.

## 5. The plan

- Plan file MUST hold only the sections of `templates/task.md`, in its order, with only
  their items, each in its section's format line, never a format line or other template
  text. Each fact MUST sit in one section; another section MUST name it by section or `TR`
  id, never copy it, figures included.
- Context, assumptions, dropped alternatives, tracker writes, quiz answers and any other
  text that serves only the approval MUST stay in the plan-mode proposal.
- A section with no item MUST be left out, except Requirements and Test scope. A missing
  Overrides or Accepted tech debt section MUST mean none.
- The three bullets above MUST also hold for a milestone doc and a milestone item body,
  with `templates/milestone.md`; there, only Requirements and Tasks stay when empty; a
  milestone item body also keeps that opening goal line (§Plan file).
- Requirements MUST hold only `TR` items and the dated notes of §Amendments, beside the
  `BR` list of §Requirements: no order line, summary, API table or key that restates
  them, and no `TR` that only says the `on` gates pass; a gate-type `BR` needs no `TR`;
  each `tests:` line names the gate instead. A `TR` MUST state only its behavior and its
  indented lines, and MAY hold the exact text it prescribes as an indented block under
  it; its reason MUST go to Design. An item of another section MUST NOT go into a `BR`
  or `TR`; it MUST stay in its own section.
- Overrides section MUST name each design rule the plan overrides (`core` §Rule words) and
  its reason.
- Each Risks line MUST name the `TR`, or in a milestone the `BR` or task, that checks or
  limits it, or the quiz answer that accepts it. A risk of failure in behavior the task
  builds MUST go to a quiz round first.
- Plan MUST list `TR` items in execution order; an item that a later item's gate command
  needs MUST come first. Each `tests:` line MUST follow `test` §TDD and name a gate by
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
- Plan MUST hold the test-scope list (`test` §Test scope).
- Items, their `tests:` lines and the test-scope list SHOULD come as a draft from planner
  (§Drafting), which loads `test` and `implement`. A main session that drafts them itself
  MUST load both.
- A data-growth path is a read or write path whose cost grows with stored data: a query, a
  loop over stored rows, an index build.
- Each `TR` that adds or changes a data-growth path MUST carry its `load:` line: its load
  `TR` id, or `load: none, <why>`. A load `TR` MUST state data size, operations measured,
  each measured query as text or as the rule that draws it from seed data, and a latency
  target, such as p95. Figures MUST come from the expected load (`review` §Understand
  first). Its benchmark MUST fail when a measured query returns no row.
- A `TR` that sets a bar on a measured value MUST cite a current value, measured on
  current code or a probe, with its spread over at least 3 runs. A bar at the metric's
  ceiling or floor, or within that spread, MUST change before approval: another metric or
  data set, or a before-and-after bound (median of at least 3 runs per side, on one
  machine in one session, such as +5 ms per query).
- When the task's goal is a measured gain, its measurement item and data MUST come first,
  with `needs: none`, and MUST run before the first feature item. When the baseline
  leaves no room for the gain, main session MUST ask user.
- Measured results MUST go to the task report and the PR body (`code` §Task end, step 6),
  never to the plan file.
- When the repo states no expected load, quiz MUST ask user for one; §Plan file writes the
  answer into `<docs>/DESIGN.md`.
- A load `TR` is the measurement that `core` §Design principles requires before an
  optimization; it is not itself an optimization.
- When a load `TR` may gate a later fix, quiz SHOULD recommend keeping its benchmark as a
  tagged build target outside every gate, over a throwaway run.
- Planning SHOULD look for complexity to remove before adding; deletion SHOULD beat
  addition. Plan MAY include that simplification; during coding, the scope rule of
  `implement` §The smallest complete change wins.

## 6. Self-review and approval

- Before proposing, MUST review the doc with the check of its level:
  - strategic: doc has no testable item; every milestone line has a goal; every new
    milestone line has status open; every new decision line carries its date and dropped
    alternatives. With a tracker bound, the check MUST read the planned milestone items (a
    goal, status open) in place of milestone lines.
  - milestone: each `BR` is testable and sits in exactly one task's `BR` list. A gate-type
    `BR`, one that applies to every task, such as one for `lint`, MUST sit in every open
    task's list.
  - task: each line below holds; else the plan is fixed first.
    - Every `BR` of the task, except a gate-type `BR`, has a `TR`. Every `TR` meets §The
      plan and has a `tests:` case for each edge case and each failure path it names, or
      a `tests: none` line.
    - The design issues under `core` §Design principles, `implement` §Before you write
      and `implement` §Domain, boundaries and state are fixed.
    - Each claim in any section with "every", "each", "all", "always", "never" or "only",
      and each claim on the form of existing data a `TR` reads, holds on each path and
      file the `TR` touches, queue and retry paths included, by a search; else it is
      narrowed or dropped. Each file, symbol or step a `TR` prescribes exists and has an
      effect in the code it names.
    - Each claim on how a tool, library or platform behaves (a wait, a return value, a
      call used as a check) rests on a probe run during planning or a cited source; else
      it goes to a probe or research before the proposal.
    - Each `TR` that calls an outside part (fs, process, git, network, an engine API)
      names each failure of that call and its outcome. One that waits, locks or retries
      names each loop exit: success, timeout, a step that always fails, a half-written
      state after a crash.
    - Each bound a `TR` sets (count, length, range) is walked, largest value included,
      against the domain rules of its data. Each input it reads is walked for missing,
      empty and malformed values.
    - Each pair of `TR` items that act in one run states their order or shared state in
      the later `TR`.
- At milestone and task level, review MUST also walk each new or changed flow path by
  path, from the command the user runs (gate, CLI, page) to where each output lands,
  against the branch, worktree and gate rules.
- At milestone and task level, review MUST also check that each need is real and each
  interface two items build has its contract item (§The plan).
- At task level, review MUST also walk each new `tests:` case, with its expected value,
  through its `TR` and the existing rules of its component, in the plan and code. A case
  one of them makes impossible MUST be dropped or rewritten. A case whose expected value
  still holds without its `TR`'s code, a swappable test value included, MUST be rewritten.
- With a tracker bound (§Levels, tracker variant), proposal MUST list each tracker write
  the run makes: creates with their labels (a missing role label's create included), body
  edits, links, edges, comments and status sets, and the create of each follow-up item the
  plan cites. Task run MUST also list the done write of its `code` run, in its form per
  finish answer (`code` §Task end, step 11), and the claim of a task item it creates.
- An open question MUST go to one more quiz round.
- Exiting plan mode is the approval. On a reject, MUST fix the part user names and propose
  again. A fix that needs only plan edits or a quiz round MUST stay in plan mode. Any
  other fix MUST first ask user to switch to auto mode or bypass permissions, and name the
  work; after it, MUST enter plan mode again.

## 7. Plan file

- After approval, main session MUST cut the level's branch (§Levels, column Branch) from
  `<base>` with the commands of `code` §Branch and plan file.
- It MUST then write the level's doc at its Doc path as the first commit; `core` §Host
  terms sets `<docs>`. Requirements MUST NOT go into a separate file.
- Task run MUST write its plan file also after zero quiz rounds.
- Right after that commit, main session MUST write the caveats found during planning
  into the caveat base (`code` §Caveats). A task run MUST hold them in its plan-mode
  proposal, not its plan file, and MUST skip each one about code that a `TR` of this task
  builds or changes; the coder's caveat slot reports that one after the build.
- In that step, main session MUST write each term the quiz settled into project context
  `## Glossary`, in its format line. A plan template MUST NOT hold a glossary section.
- In that step, main session MUST write an expected load the quiz settled into
  `<docs>/DESIGN.md`.
- Strategic or milestone run with a branch MUST end with the finish question of `code`
  §Finish for its branch.
- With a tracker bound (§Levels, tracker variant), a strategic or milestone run MUST
  follow this rule in place of the branch and doc-commit bullets above. It MUST create its
  items after approval. Milestone run MUST write no milestone doc. Such a run MUST cut its
  level's branch only when it writes a repo file (`DESIGN.md`, glossary or caveats); that
  write MUST be its first commit. Else it MUST skip the branch and finish question. A new
  milestone item body MUST open with its one-line goal, after the AI marker line and
  above its sections.
- With `triage` label lines bound, each item a `plan` or `code` run creates MUST carry
  `accepted` and one category: `bug` for a fix, else `enhancement`. A missing role label
  MUST be created first.
- A run that creates several tracker items MUST create the blockers first. It MUST then
  add blocked-by edges and cross-references in a second pass, with real ids. It MUST NOT
  write a placeholder id; it MUST wait for the real id instead.

## 8. Amendments

- A requirement that changes during work, or needs user's answer, MUST stop the work until
  user's yes.
- An added or changed requirement MUST get a new id and MUST go to user for a yes, with
  the new text, through the question tool. One exception, the `TR` of a defect in built
  code (below), needs no yes: it repairs approved work.
- A change user asks for during a code run MUST get its `BR` in the same amendment as its
  `TR`; user's request is the yes for both.
- An amendment MUST go to the doc that owns the fact (§Levels).
- A `BR` gap found in a task run MUST amend the owning doc, after user's yes: the
  milestone doc on the task branch, or the milestone item with a tracker bound.
- With a tracker bound, an amendment that cites a follow-up item MUST list that item's
  create in its question.
- A task that its milestone doc does not list MUST get its Tasks line as an amendment.
- An amendment that adds a gate-type `BR` (§Self-review and approval) MUST also add it to
  each open task of the milestone: to the `<what> : <BR list>` line of each open child
  item body, with the AI marker line above the changed line, or, in the docs fallback, to
  each open task line of the milestone doc. The amendment question MUST list these tracker
  writes.
- A change to the design MUST go back to §Before the plan: quizzes, plan, approval. A
  redesign user approves is such a change.
- An architecture gap MUST re-plan at the strategic level, on a `design-<topic>` branch.
- A defect in built code MUST get a new `TR-n` and its test (`implement` §Fixing and
  refactoring). That `TR` MUST name its fault class and each call site of that class,
  found by a grep at amendment time.
- Main session MUST allocate every new id. Subagent MUST NOT allocate one.
- Before the next brief, main session MUST commit to the owning doc the new items, each
  `(replaced by <new id>)` mark, each dated note and the line updates below; no reason or
  history. The amendment's reason and history MUST go into the commit message, and into
  the tracker comment when one is written.
- A replacing item MUST state its full text. A replaced item MUST keep its id line, never
  renumbered, with the mark `(replaced by <new id>)`; its old text MAY go. Before the
  plan's first commit, an item that user's yes replaces MAY be rewritten in place.
- Brief of a `TR` that replaces another MUST tell the coder to re-point each `req:` marker
  of the old id to the new id.
- A wrong `tests:` case of a `TR` whose behavior stays MUST get a dated note below the
  `TR` list that names the `TR` and gives the corrected case. A changed behavior takes a
  new id (above).
- When a code run starts on a plan whose commit is behind `<base>`, main session MUST
  first check each `TR` against `<base>`. Each `TR` that `<base>` already meets MUST get
  a dated note below the `TR` list. Done when each `TR` is checked.
- When an amendment replaces or removes a term, id, design choice or figure (a profile,
  a file, a class, a bound), main session MUST grep the owning doc, plan file and project
  context for it before it asks user. Each requirement line that names it MUST join that
  amendment's question, with its new id, and get its `(replaced by <new id>)` mark at the
  amendment commit. A `needs:` line that names a replaced id MUST be updated in place at
  that commit, with no new id.
- At the amendment commit, main session MUST re-read each line that is not a requirement
  (Goal, Design, Risks, Test scope) and update each one the amendment makes false. An
  amendment that changes a tested behavior or a data shape MUST add each case it breaks
  to Test scope in the same commit. A line with an `Unverified:` part that a `TR` proves
  MUST be deleted.

## 9. Drafting

- Main session MAY spawn the planner for a draft, in the formats of §Requirements and §The
  plan, checked against §Self-review and approval. The `planner` agent card sets its role
  and limits; `delegate` §Models sets its model.
