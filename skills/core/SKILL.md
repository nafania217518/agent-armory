---
name: core
description: >
  Always-on base rules for the main session and every subagent; the hook injects them at
  session and subagent start. Use for "/core" and "show the armory base rules".
metadata:
  type: regular
  extends: []
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

# core

armory-core <version>

## 1. Rule words

- MUST and MUST NOT have one exception for every actor: approved plan MAY override
  a design rule, a rule of §4 or one a skill names as a design rule.
- Agent MAY bypass a SHOULD rule for one task only, with a reasonable cause or after user
  approves.
- Every rule MUST carry one RFC 2119 word.

## 2. Writing and questions

- Replies and docs MUST follow "80% ASD-STE100": sentences of about 20 words max, one idea
  each, active voice, present tense, one meaning per word, no idioms, no filler, no hedge
  that carries no doubt. Natural phrasing and domain terms stay where strict STE reads
  badly.
- Report SHOULD explain each technical term at first use.
- Reply or report of an error MUST state its cause, fix and `path:line`, or say which is
  unknown or absent, with no exclamation or apology. A skill's fixed output format wins
  over it.
- Code comment MUST say only the why code cannot show, in one line. Exceptions: `req:`
  and `tech-debt:` markers.
- Subagent MUST NOT ask user; it MUST report `stuck: <question>` instead.
- Recommended option MUST name its basis, the ground it rests on, or be unmarked.

## 3. Tools and background tasks

- MUST NOT use `nohup`, `command &` or any other detached shell job for a background task.
  MUST start it as host's tracked background task.
- Tracked background task or spawned agent MUST stop once no longer needed. One left
  running MUST have a valid reason, stated in report. An idle agent or a subagent's timer
  (§6) does not count as running.
- A run you wait on before your next step (gate, build, tests) SHOULD run in the
  foreground, with host's timeout above its expected time. A background task SHOULD be
  used only to do other work while it runs, or past host's foreground limit. MUST NOT
  poll a background task with a sleep loop; MUST wait for host's completion notice
  instead. A subagent turn that ends only to wait for that notice MUST reply `wait`
  only; it is not a report.
- Subagent MUST keep temp files in its own `mktemp -d` folder.
- Gate, build and test output MUST reach your context only as its tail or a grep for FAIL
  or error, and a long file only by line range or a search. On a failing gate, MUST read
  only the failing part of its log.

## 4. Design principles

- YAGNI: MUST NOT design or implement anything not requested.
- DRY + SSOT: each fact, rule, decision or piece of logic MUST live in exactly one
  place. Everywhere else MUST reference it.
- Big design up front: design MUST be complete and refined before implementation.
- MUST NOT optimize without a measured problem.
- Occam's razor + KISS: SHOULD prefer explanation or solution with fewest elements, so a
  reader understands it without help.
- SHOULD get data shape right before logic. SHOULD do first what helps every later phase.
  SHOULD aim at an end state you can check; a break in the middle MAY happen when it is
  planned and can be undone.
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
  code line; those stay in plan or code.
- Subagent report MUST hold only items of its card's report format, both slots, and the
  returns other armory rules require. It MUST NOT narrate steps, restate the brief, or
  paste file content, a diff or command output that none of these asks for. It MUST point
  to code by `path:lines` or commit SHA instead.
- A subagent's timer is its own tracked background task that ends 4 minutes after start.
  A turn that a timer's end starts MUST reply `pong` only; a pong is not a report. A
  subagent whose brief or a later message holds `timer: on` MUST end each turn with
  exactly one timer running, started as the turn's last action unless one from an earlier
  turn still runs. The turn of its 7th pong in a row MUST end with none instead.
- A report item is needed when main session uses it to spawn an agent, to plan or change
  next work, or to put a decision to user. A report format and a report MUST hold only
  needed items, and every needed item. Each item MUST give only its value. An item whose
  condition does not hold MUST be left out.
- Caveat base: project context `## Caveats` plus topic files
  `<docs>/caveats/<topic>.md`.
- Caveat line, in a report or the caveat base, MUST take the format
  `- SHORT_DESCRIPTION : <file>`, a list item, or `- SHORT_DESCRIPTION : —` when no file
  exists yet. It MUST hold one fact. A caveat with two facts MUST become two lines, or one
  line with only the fact a reader would not expect.
- Each SHOULD bypass made during work (§1) MUST be recorded during the task, and so
  MUST each item a skill names as recorded.
- Subagent MUST NOT write to caveat base; it MUST report the caveat in its caveat slot
  instead.

## 7. Host terms

- question tool: host's structured way to ask user.
- spawn: host's way to run a subagent from an agent card.
- agent card: host's agent definition file, rendered from an armory template.
- worktree: isolated checkout per agent that edits files.
- plan mode: host's read-only planning mode; its exit is the approval.
- plan-mode file: host's file that holds the proposal.
- hook: host's command that injects hook payloads at session and subagent start: core
  for every actor, plus core-main in main session. Fallback: pointer line in project
  context.
- project context: file the host loads for a project (`AGENTS.md`, plus a `CLAUDE.md` with
  the line `@AGENTS.md`); skills MUST name its sections. Its `## Rules` line
  `Documentation lives in <folder>` sets `<docs>` for main session and every subagent.
  One that holds both `## Commands` and `## Gates` is in the old form: MUST NOT run its
  gates; MUST ask user for a setup update run first.
- tracker: system that holds milestones, tasks and their status; project context
  `## Tracker` binds it.
  - Subagent MAY read tracker but MUST NOT write to it. It MUST report a needed write to
    main session instead.
  - A report or item text MUST name a tracker item by its title, with its link
    inside, not by a bare id. A PR closing line is exempt.
