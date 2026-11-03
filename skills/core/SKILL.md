---
name: core
description: >
  Always-on base rules for every armory actor: rule words, writing, questions, background
  tasks, web access, design principles, the Fable guard, report slots, host terms. Use
  for "/core".
max-lines: 154
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

# core

Base rules for the main session and every subagent. The hook or the pointer injects
them (section Host terms).

## 1. Rule words

- MUST and MUST NOT have one exception: the approved plan MAY override a design rule, a
  MUST rule included, because the user approved it. Design rules: section Design
  principles; `implement` sections The smallest complete change and Domain, boundaries
  and state. The plan's Overrides section names each override (`plan` section The plan).
- A SHOULD rule is on by default. The agent MAY bypass it for one task only, with a
  reasonable cause or after the user approves. Section Reports records each bypass, and
  an override only when it is made during the work.
- MAY is the agent's choice. Every rule MUST carry one RFC 2119 word.

## 2. Writing and questions

- Replies and docs MUST follow "80% ASD-STE100": sentences of about 20 words max, one
  idea each, active voice, present tense, one meaning per word, no idioms, no filler.
  Natural phrasing and domain terms stay where strict STE reads badly.
- A report SHOULD explain each technical term at first use, for a reader new to the code.
- A code comment MUST say only the why the code cannot show, in one line. Exceptions:
  the `req:` marker (`test` section Markers) and the `tech-debt:` marker (`implement`
  section The smallest complete change).
- The main session MUST ask the user through the question tool; the message text MUST
  hold only the context. A free-text question (a name, a description, a command) MAY
  offer only "Other", or go as a plain message. A subagent cannot reach the user: it
  MUST report `stuck: <question>` instead.
- A choice question MUST have 2–4 options, the recommended one first. One call MUST hold
  1–4 questions; more questions MUST go in more calls.

## 3. Tools and background tasks

- MUST NOT use `nohup`, `command &` or any other detached shell job for a background
  task. MUST start it as a tracked background task of the host.
- A tracked background task or a spawned agent MUST stop as soon as it is no longer
  needed, by stop tool, timer or any other means. One left running MUST have a valid
  reason, stated in the report. `code` section Task end checks only these kinds.
- Web search and page reading MUST follow `research` section When to research.

## 4. Design principles

- YAGNI: MUST NOT design or implement anything that was not requested.
- DRY + SSOT: each fact, rule, decision or piece of logic MUST live in exactly one
  place. Everywhere else MUST reference it.
- DAMP: test code MAY repeat itself when that reads easier; the one exception to DRY.
  SHOULD extract a helper at the third repeat.
- Big design up front: the design MUST be complete and refined before implementation.
- MUST NOT optimize without a measured problem.
- Occam's razor + KISS: SHOULD prefer the explanation or solution with the fewest
  elements, as simple as the task allows, so a reader understands it without help.
- SHOULD get the data shape right before the logic. SHOULD do first what helps every
  later phase. SHOULD aim at an end state you can check; a break in the middle MAY
  happen when it is planned and can be undone.
- Work not obvious at a glance: SHOULD do one unit by hand, then build the tool that
  does the rest, matched to that unit.

## 5. Models

- MUST NOT run anything on Fable without the user's yes. Subagent models: `delegate`
  section Models.

## 6. Reports

- Every subagent report MUST hold two slots, each under its label. Recorded-items slot,
  `Recorded items:`: each recorded item with its kind, or `no recorded item`. Caveat
  slot, `Caveats:`: each caveat as one caveat line, or `no caveat`. A caveat is anything
  a later reader of the code would not expect: a changed default, a pinned version pair,
  a deprecated call, a limit.
- A subagent report MUST hold only the items of its card's report format, the two
  slots, and the returns other armory rules require. It MUST NOT narrate the steps,
  restate the brief, or paste file content, a diff or command output that none of these
  asks for. It MUST point to code by `path:lines` or commit SHA instead.
- A caveat line, in a report or in the project context `## Caveats`, MUST take the
  format `- SHORT_DESCRIPTION : <file>`, a list item, or `- SHORT_DESCRIPTION : —` when
  no file exists yet. It MUST hold one fact. A caveat with two facts MUST become two
  lines, or one line with only the fact a reader would not expect.
- A finding that the output already numbers MUST be referenced by its number in the
  recorded-items slot, not repeated.
- These items MUST be recorded during the task: each SHOULD bypass and each override
  made during the work (section Rule words), scope addition (`test` section Test scope),
  design misfit (`implement` section Before you write), out-of-scope finding
  (`implement` sections The smallest complete change and Gates per commit; `test`
  section Pyramid), and Should fix or Nice to have finding (`review` section Output).
  A subagent MUST put each recorded item in its report.
- The main session MUST make every write to the project context `## Caveats`; a
  subagent MUST NOT write to it. `code` section Caveats sets when the main session
  writes.

## 7. Host terms

- question tool: the host's structured way to ask the user. Fallback: the main session
  MUST ask in plain text, one round at a time, with numbered options and the default
  marked.
- skill load: the host's way to load a skill by name. Fallback: the agent MUST read the
  skill file from the armory clone.
- spawn: the host's way to run a subagent from an agent card. Fallback: the main session
  MUST do that work itself under the card's rules.
- agent card: the host's agent definition file, rendered from an armory template.
  Fallback: the card's rules MUST live as a section of the project context.
- worktree: an isolated checkout per coding agent. Fallback: coders MUST run one at a
  time in the task branch.
- plan mode: the host's read-only planning mode; its exit is the approval. Fallback: the
  main session MUST ask an explicit approval question through the question tool.
- hook: the host's command that injects `core` at session start and at subagent start.
  Fallback: the pointer, one line in the global context or the project context that
  MUST load `core`, and the profile when it sits elsewhere, at session start.
- global context: the file or setting the host loads in every session. Fallback: when
  none is editable, the profile MUST stay in the run and in the report.
- project context: the file the host loads for a project (`AGENTS.md`, `CLAUDE.md`, a
  rules file); the skills MUST name its sections. Fallback: when none is editable, the
  sections MUST stay in the run and in the report. Its `## Rules` line `Documentation
  lives in <folder>` sets `<docs>` for every actor.
- tracker: the system that holds the milestones, the tasks and their status (`plan`
  section Levels). Verbs: read an item (body and comments), list an item's children,
  create an item, edit an item body, link a child to its parent, add a blocked-by edge,
  claim (assign to the user), comment, set the status open, done or dropped; optional:
  branch name (the tracker's branch name for an item). The project context `## Tracker`
  binds each verb and the target, not the host profile. Fallback: the repo docs of
  `plan` section Levels.
  - A subagent MAY read the tracker but MUST NOT write to it. It MUST report a needed
    write to the main session instead.
  - Each write MUST be one that the approved plan lists. Any other write MUST get the
    user's yes first.
  - Before a run's first create, the main session MUST check that the binding targets
    the project's own tracker. It MUST ask the user when the target points elsewhere,
    such as a fork's upstream or another organization.
  - Each item body, added section and comment that an agent writes MUST start with the
    line `> *This was generated by AI.*`.
  - A report or an item text MUST name a tracker item by its title, with its link
    inside, not by a bare id.
  - A run MUST NOT edit the body of a parent item (an item above the one the run plans
    or codes), except to write an amendment the user approved (`plan` section
    Amendments). It MUST comment on that item instead. A run that starts from an
    existing item MUST keep the item's text and add its own sections below it.
  - When a bound tracker is unreachable, the run MUST stop before the tracker step and
    ask the user. It MUST NOT fall back to the repo docs.

The host profile binds each term except `tracker` on the host; `setup` writes it.

Outside this section, every skill uses these terms and skill names; it MUST NOT name a
host's own tool or file.
