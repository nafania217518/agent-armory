---
name: plan
description: >
  Plans work before any edit, at three levels: strategic (design doc and milestones),
  milestone (scope and BR requirements) and task (TR requirements and the plan file),
  with quizzes and the user's approval in plan mode. Use for "plan this",
  "plan a milestone", "design doc", a changed requirement, "/plan".
metadata:
  type: regular
  extends: [core-main, delegate, requirements, research, workflow]
  max-lines: 169
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core-main` before your first step when its rules are not in your context.
Load `workflow` before your first step when its rules are not in your context.
Load `requirements` before you write or check a `BR`, a `TR` or a plan doc when its rules
are not in your context.
Load `research` before your first quiz round when its rules are not in your context.
Load `delegate` before your first spawn when its rules are not in your context.

# plan

Pre-work before any edit, at three levels.

## 1. Levels

- Level MUST come from argument `strategic`, `milestone` or `task`. With no argument,
  first question MUST ask the level.
- Each level MUST use the doc and branch of `tracking` §2 and this template; template
  paths in this skill are relative to the `requirements` skill: strategic
  `templates/strategic.md`, other sections free; milestone `templates/milestone.md`,
  fixed; task `templates/task.md`, fixed.
- Milestone or task doc MUST name its parent in its first lines, with the template's
  parent line. It MUST reference a parent fact, not restate it.
- Milestone run MUST first have an agent read `<docs>/DESIGN.md`, and task run its
  milestone doc, on `<base>`, and report the facts the run needs. When `<base>` lacks
  the doc, run MUST ask user to merge the parent branch first.
- Milestone name MUST match a line of `<docs>/DESIGN.md` §Milestones. With none, strategic
  level MUST add it first.
- Task run MUST take its milestone from the request. When request names none, first quiz
  round MUST ask for the task's milestone, or none.
- Strategic run MUST have no testable item. It MUST stop at the milestone list; each
  milestone plan MUST be a separate run.
- Strategic run SHOULD add a decision line only when the decision is hard to reverse,
  surprising without context and the result of a real trade-off.
- When `<docs>/DESIGN.md` is missing, strategic run MUST create it from the template. Else
  it MUST edit the file in place and keep its free sections.
- With a tracker bound in project context `## Tracker` (`tracking` §1), each level
  MUST follow this tracker variant. The variant replaces only the docs-fallback rules it
  names; the rules above MUST stay the docs fallback.
  - strategic: a run that creates `DESIGN.md` from `templates/strategic.md` MUST drop
    its Milestones section.
  - milestone: milestone item body MUST take the sections of `templates/milestone.md`
    except the title line, parent line, Goal and Tasks. Each task item body MUST hold the
    `<what> : <BR list>` of the Tasks format line. Blocked-by edges MUST hold the task's
    needs (`requirements` §2).
  - Milestone name MUST match a top-level tracker item, not a `DESIGN.md` line. Task run
    MUST read its milestone item, body and comments, first.
  - A run MAY start from an existing tracker item. It MUST then read the item's body and
    comments first, take the item as its milestone or task, and keep the item's text,
    adding the run's sections below it. Else it MUST create the items only after approval.
    An item that holds its own `## Requirements` MUST be the
    milestone of a milestone run, or a task with no milestone of a task run, with no
    milestone question. That `## Requirements` section MUST be the item's `BR` list; a run
    MUST add each new `BR` line there.
  - Task run with no task named MUST take the first ready task in milestone item's child
    order: open, every blocker done, no assignee.

## 2. Before the plan

- Main session itself MUST run the quizzes and approval, and own the research step.
- Until the first proposal, quizzes, research and drafts MUST run outside plan mode. Main
  session MUST enter plan mode only to propose, after the self-review (§6)
  passes.
- On a model below Opus or an effort below `high`, main session SHOULD suggest a switch to
  user before planning.
- Before building, SHOULD push back on any part of the request the need does not justify.
- Before the first quiz round, main session MUST have an agent read each topic file whose
  pointer fits the request (`workflow` §3), or pass those paths in each planning brief.
- Before any edit, MUST quiz user in rounds until no open point remains (an unclear
  requirement, a choice, an assumption), and wait for answers. §3 sets the order
  and topics; `core-main` §2 sets the question format.
- MUST NOT write any repo file before approval. Planning MUST NOT write code, tests or
  config.

## 3. Quizzes

- Business quiz MUST come first, on the topics of `tracking` §5.
- Tech quiz MUST follow: stack, data, interfaces, constraints, test levels, risks,
  acceptance. When a plan item repairs a rule breach that the repo holds elsewhere too, it
  MUST ask: fix all here, a follow-up item, or leave.
- Each topic MUST be covered when, and only when, it is relevant to the task.
- A round MUST ask only questions whose prerequisite answers are in. A question that
  depends on another open question of the round MUST wait for a later round.
- A quiz MUST NOT ask a fact the parent doc, repo, a tool or an agent can settle: main
  session MUST get it by a short read (`core-main` §3) or by
  research (below). A running lookup MUST hold back only questions that depend on it.
- During a quiz, main session MUST name a term that conflicts with project context
  `## Glossary`, MUST propose a precise term for a vague or overloaded one, and MUST
  check each claim user makes about the code against the code as `workflow` §3 sets,
  naming any contradiction.
- Task run MAY have zero quiz rounds when its parent doc leaves no open point.
- Open points and claims MUST go to research as `research` §1 sets, then,
  when needed, to a quiz on the findings and next steps.

## 4. Requirements

- Task run under a milestone MUST NOT add a `BR`. A `BR` gap MUST go to `tracking` §4.

## 5. The plan

- Items, their `tests:` lines and the test-scope list MUST come as a draft from planner.
- Measured results MUST go to the task report and the PR body, never to the plan file.
- When the repo states no expected load, quiz MUST ask user for one; §7 writes the
  answer into `<docs>/DESIGN.md`.
- When a load `TR` may gate a later fix, quiz SHOULD recommend keeping its benchmark as a
  tagged build target outside every gate, over a throwaway run.

## 6. Self-review and approval

- Before proposing, MUST review the doc with the check of its level:
  - strategic: doc has no testable item; every milestone line has a goal; every new
    milestone line has status open; every new decision line carries its date and dropped
    alternatives. With a tracker bound, the check MUST read the planned milestone items (a
    goal, status open) instead of milestone lines.
  - milestone: the milestone check of `requirements` §3.
  - task: the planner's report holds a passed task check on the draft, each fix applied;
    else the draft goes back to the planner.
- At milestone level, review MUST also run the flow walk of `requirements` §3.
- With a tracker bound (§1, tracker variant), proposal MUST list each tracker write
  the run makes: creates with their labels (a missing role label's create included), body
  edits, links, edges, comments and status sets, and the create of each follow-up item the
  plan cites. Task run MUST also list the done write of its coding run, in its form per
  finish answer (`workflow` §5), and the claim of a task item it creates.
- An open question MUST go to one more quiz round.
- On a reject, MUST fix the part user names and propose again. A fix that needs only
  plan edits or a quiz round MUST stay in plan mode. Any other fix MUST first ask user to
  leave plan mode, and name the work; after it, MUST enter plan mode again.
- Done when the check of the level passes and user approves the proposal.

## 7. Plan file

- After approval, main session MUST cut the level's branch (`tracking` §2, column Branch)
  from `<base>` under `workflow` §2.
- It MUST then write the level's template sections of the approved proposal to the
  level's Doc path itself, as the first commit; `core` §7 sets `<docs>`.
  Requirements MUST NOT go into a separate file.
- Task run MUST write its plan file also after zero quiz rounds.
- Right after that commit, main session MUST write the planning caveats into the
  caveat base (`workflow` §3).
- In that step, main session MUST itself write each term the quiz settled into project
  context `## Glossary`, in its format line, and an expected load the quiz settled into
  `<docs>/DESIGN.md`, and MUST commit them. A plan template MUST NOT hold a glossary
  section.
- Strategic or milestone run with a branch MUST end with the finish question of
  `workflow` §4 for its branch.
- With a tracker bound (§1, tracker variant), a strategic or milestone run MUST
  follow this rule instead of the branch and doc-commit bullets above. It MUST create its
  items after approval. Milestone run MUST write no milestone doc. Such a run MUST cut its
  level's branch only when it writes a repo file (`DESIGN.md`, glossary or caveats); that
  write MUST be its first commit. Else it MUST skip the branch and finish question. A new
  milestone item body MUST open with its one-line goal, after the AI marker line and
  above its sections.
- A run that creates several tracker items MUST create the blockers first. It MUST then
  add blocked-by edges and cross-references in a second pass, with real ids. It MUST NOT
  write a placeholder id; it MUST wait for the real id instead.
- Done when the plan file, caveat, glossary and load commits are on the level's branch, or
  the tracker items are created.
