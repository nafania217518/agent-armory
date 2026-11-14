---
name: core
description: >
  Always-on base rules for the main session and every subagent; the hook injects them at
  session and subagent start. Use for "/core" and "show the armory base rules".
max-lines: 151
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

# core

## 1. Rule words

- MUST and MUST NOT have only two exceptions:
  - approved plan MAY override a design rule: §Design principles, and `implement` §The
    smallest complete change and §Domain, boundaries and state;
  - under user-only `dnd` skill, main session's own answer MAY replace a user question
    or yes, within the limits `dnd` sets.
- Agent MAY bypass a SHOULD rule for one task only, with a reasonable cause or after user
  approves.
- Every rule MUST carry one RFC 2119 word.

## 2. Writing and questions

- Replies and docs MUST follow "80% ASD-STE100": sentences of about 20 words max, one idea
  each, active voice, present tense, one meaning per word, no idioms, no filler. Natural
  phrasing and domain terms stay where strict STE reads badly.
- Skill text MAY drop a, an and the where meaning stays.
- Each main-session reply to user MUST follow the three rules below. A skill's fixed
  output format and this section's question bullets win over them.
  - Shape: MUST lead with the answer or next action, a command, path or snippet first.
    MUST delete an announcing first line, a recap of done work, an offer as last line, and
    a side remark. First and last lines alone MUST tell what happened and what is next. A
    reply to "explain" or "walk through" MAY run long, under headers.
  - Lists: steps MUST be numbered, one bounded action each, the fewest that work. A
    free-prose group SHOULD hold about five items max, most relevant first, rest on
    request. When completeness matters, MUST keep every relevant item.
  - Flow: when anything is open, MUST end with one concrete next action. A second issue
    MUST get its own question, never a clause of the first. With an approved plan, each
    turn MUST restate step n of m and the next step through host's task list, with no
    prose copy of the plan.
- A report SHOULD explain each technical term at first use.
- Code comment MUST say only the why the code cannot show, in one line. Exceptions: the
  `req:` marker (`test` §Markers) and the `tech-debt:` marker (`implement` §The smallest
  complete change).
- Main session MUST ask user through the question tool; message text MUST hold only the
  context. Free-text question MAY offer only "Other", or go as a plain message. Subagent
  MUST report `stuck: <question>` instead.
- Choice question MUST have 2–4 options, recommended one first. One call MUST hold 1–4
  questions.

## 3. Tools and background tasks

- MUST NOT use `nohup`, `command &` or any other detached shell job for a background task.
  MUST start it as a tracked background task of the host.
- Tracked background task or spawned agent MUST stop once it is no longer needed. One left
  running MUST have a valid reason, stated in the report.
- Web search and page reading MUST follow `research` §When to research.

## 4. Design principles

- YAGNI: MUST NOT design or implement anything not requested.
- DRY + SSOT: each fact, rule, decision or piece of logic MUST live in exactly one place.
  Everywhere else MUST reference it.
- DAMP: test code MAY repeat itself when that reads easier; the one exception to DRY.
  SHOULD extract a helper at the third repeat.
- Big design up front: design MUST be complete and refined before implementation.
- MUST NOT optimize without a measured problem.
- Occam's razor + KISS: SHOULD prefer the explanation or solution with the fewest
  elements, so a reader understands it without help.
- SHOULD get the data shape right before the logic. SHOULD do first what helps every later
  phase. SHOULD aim at an end state you can check; a break in the middle MAY happen when
  it is planned and can be undone.
- Work not obvious at a glance: SHOULD do one unit by hand, then build the tool that does
  the rest, matched to that unit.

## 5. Models

- MUST NOT run anything on Fable without user's yes.

## 6. Reports

- Every subagent report MUST hold two slots, each under its label. Recorded-items slot,
  `Recorded items:`: each recorded item with its kind, or `no recorded item`. Caveat slot,
  `Caveats:`: each caveat as one caveat line, or `no caveat`. A caveat is a fact a reader
  of its file would still not expect: a library or platform behavior, a cross-file
  coupling or a trap. It MUST NOT restate a plan decision, a requirement or one visible
  code line; those stay in the plan or code.
- Subagent report MUST hold only the items of its card's report format, the two slots, and
  the returns other armory rules require. It MUST NOT narrate steps, restate the brief, or
  paste file content, a diff or command output that none of these asks for. It MUST point
  to code by `path:lines` or commit SHA instead.
- A report item is needed when main session uses it to spawn an agent, to plan or change
  the next work, or to put a decision to user. A report format and a report MUST hold only
  needed items, and every needed item. Each item MUST give only its value. An item whose
  condition does not hold MUST be left out.
- Caveat line, in a report or the caveat base (`code` §Caveats), MUST take the format
  `- SHORT_DESCRIPTION : <file>`, a list item, or `- SHORT_DESCRIPTION : —` when no file
  exists yet. It MUST hold one fact. A caveat with two facts MUST become two lines, or one
  line with only the fact a reader would not expect.
- A finding the output already numbers MUST be referenced by its number in the
  recorded-items slot, not repeated.
- These items MUST be recorded during the task: each SHOULD bypass made during the work
  (§Rule words), scope addition (`test` §Test scope), design misfit (`implement` §Before
  you write), out-of-scope finding (`implement` §The smallest complete change and §Gates
  per commit; `test` §Pyramid), and Should fix or Nice to have finding (`review` §Output).
- Main session MUST make every write to the caveat base (`code` §Caveats); subagent
  MUST NOT write to it. `code` §Caveats sets when main session writes. Outside a plan or
  code run, main session MUST ask user first.

## 7. Host terms

- question tool: host's structured way to ask user.
- spawn: host's way to run a subagent from an agent card.
- agent card: host's agent definition file, rendered from an armory template.
- worktree: an isolated checkout per coding agent.
- plan mode: host's read-only planning mode; its exit is the approval.
- hook: host's command that injects `core` at session and subagent start. Fallback: the
  pointer (`setup` §Install).
- project context: the file the host loads for a project (`AGENTS.md`, plus a `CLAUDE.md`
  with the line `@AGENTS.md`); skills MUST name its sections. Its `## Rules` line
  `Documentation lives in <folder>` sets `<docs>` for main session and every subagent.
- tracker: the system that holds milestones, tasks and their status. Verbs: read an item
  (body, comments and labels), list an item's children, in order, each with its status,
  assignee and blockers, create an item, edit an item body, link a child to its parent,
  add a blocked-by edge, claim (assign to the user), comment, set the status open, done or
  dropped; optional: branch name (a read of the tracker's branch name for an item, with no
  side effect), and the label verbs: list items (by status and label), list labels, set
  labels (add or remove) and create label. Project context `## Tracker` binds each verb.
  Fallback: the docs fallback of `plan` §Levels.
  - Subagent MAY read the tracker but MUST NOT write to it. It MUST report a needed write
    to main session instead.
  - Each write MUST be one the approved plan lists. Any other write MUST get user's yes
    first.
  - Before a run's first create, main session MUST check that the binding targets the
    project's own tracker. It MUST ask user when the target points elsewhere.
  - A run MUST put the AI marker line `> *This was generated by AI.*` above each text
    block it adds to an existing item body, and at the start of each comment and each new
    item body.
  - A report or item text MUST name a tracker item by its title, with its link inside, not
    by a bare id. The PR closing line (`code` §Finish) is exempt.
  - A run MUST NOT edit the body of a parent item (an item above the one the run plans or
    codes), except to write an amendment the user approved (`plan` §Amendments). It MUST
    comment on that item instead. A run that starts from an existing item MUST keep the
    item's text and add its own sections below it.
  - When a bound tracker is unreachable, the run MUST stop before the tracker step and ask
    user. It MUST NOT use the docs fallback.

Outside this section, every skill uses these terms and skill names; it MUST NOT name a
host's own tool or file.
