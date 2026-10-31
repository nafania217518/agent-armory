---
name: delegate
description: >
  How the main session hands work to project agents: context, worktrees, briefs,
  returns, model and effort per spawn, the Fable question, re-spawn and retry. Loaded by
  `plan` and `code` before a spawn. Use for "delegate", "spawn an agent", "which
  model", "write a brief", "/delegate".
max-lines: 140
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# delegate

The main session follows this skill for each spawn of a project agent: what goes in,
what comes back, and on which model and effort the agent runs.

## 1. Context

- Context is precious. The main session SHOULD stay small: it delegates intensive
  reading (many files, long files, wide searches) and other bulk work to agents, and
  keeps only what they return. It SHOULD delegate coding, review and writing to the
  project agents.
- In a task in which the main session wrote code, every review MUST go to a reviewer
  agent. A bypass of the delegation rule above MUST NOT cover it.
- In any other task, a main session that bypasses the delegation rule for a review
  MUST load `review` (`/review`, or `/armory:review` in the plugin) and run it itself.

## 2. Delegation and worktrees

- Two or more coding agents that run at once SHOULD each run in their own worktree.
- Two agents that run at once MUST NOT edit the same file.
- A worktree the tool cuts MAY start from the default branch: the brief MUST name the
  task branch (the coder card sets the reset).
- When an agent finishes in a worktree, the main session MUST merge its branch into the
  task branch, run `lint` and `unit`, then remove the worktree. `code` section Review
  loop sets the review that follows.
- The merge of a worktree branch into the task branch MAY run without the user's yes.
- A worktree with uncommitted work MUST wait for the user's decision when no retry
  follows (section Re-spawn and retry) or the retry fails too.

## 3. Briefs

- A coding or review brief MUST hold: the full text of each `BR` and `TR` it covers,
  quoted from the plan file (`plan` section Plan file), not only the ids; the
  test-scope list (`test` section Test scope), from the plan for a coding brief and from
  the coder report for a review brief; the `AGENTS.md` lines of `## Commands`,
  `## Gates`, `## Test levels` (the unit style included), `## Rules` and `## Caveats`
  that apply; the names of the skills, or skill sections, that the agent loads; the task
  branch name and `<base>` (`code` section Branch and plan file); the plan's Overrides
  and Accepted tech debt parts (`plan` section The plan).
- A review brief MUST also hold the commit range and, for a final review, the
  whole-task checks (`code` section Review loop). A re-review brief MUST hold the
  findings sent to fix.
- Any other brief (research, reading, writing) MUST hold the question and the context
  the agent needs.
- The `core` rules reach every subagent through the plugin hook. A brief MUST NOT
  repeat them or claim `core` is in context; the agent loads it when the hook did not.

## 4. What each agent returns

- The project agents MUST be these five: coder, reviewer, researcher, writer and
  planner. The card `skills/init-project/templates/agents/<agent>.md` of each holds its
  role rules and its report format.
- Only the main session MAY delegate. A subagent cannot spawn agents, so it MUST do the
  work of its brief itself.
- Each report MUST hold the recorded-items slot and the caveat slot of `core` section
  Reports.

| Agent | Returns |
|---|---|
| coder | the coder card's report, or `stuck: <why>` |
| reviewer | the reviewer card's report |
| researcher | the researcher card's report, `sources disagree`, or a missing command |
| writer | the writer card's report |
| planner | the planner card's report |

## 5. Models

- Each subagent spawn SHOULD use the model and effort of its row in the table below
  (`core` section Rule words covers a bypass). The user picks the main session model.
- A task that no row names SHOULD run on Opus, with effort from the effort map.
- Effort map, each SHOULD: `low` for one clear step or a ready spec (simple summary,
  routine edit); `medium` for several steps with some judgment (a summary of many
  files, an answer that combines facts from several files); `high` for analysis,
  comparison, review, design, an unknown cause.
- `max` MUST be used only through the Fable question, or when the user asks.

| Task | Model | Effort |
|---|---|---|
| Coding from a brief (TDD), a fix whose cause the plan names included | Opus | low |
| Coding, trivial change | Sonnet | low |
| Debugging: a bug whose cause the plan does not name | Opus | high |
| Refactoring; code review, any diff size; audit; planner: any draft | Opus | high |
| Writing or summary, restating given facts | Sonnet | low |
| Writing or reading that needs judgment | Opus | effort map |
| Research, one fact from an official source | Sonnet | low |
| Research: sources disagree, many sources, a comparison, a design choice | Opus | high |
| Trivial task, no reading (run, list, grep, format, gate runs) | Haiku | low |
| Trivial task, light reading | Sonnet | low |
| Frontier task | the Fable question | — |

- Default rows: coder "Coding from a brief" (Opus low); reviewer and planner (Opus
  high); researcher "one fact" and writer "restating" (Sonnet low). A spawn MAY
  override the default with another row of the table.
- The table MUST be read with these definitions:
  - Trivial change: no new branch, loop or data shape (renames, typos, config values,
    copy edits, code moved as is, a change given in full in the brief). Trivial task:
    mechanical work that needs no judgment.
  - Judgment test: Sonnet when the input holds every fact and the job is to restate it;
    Opus when the job is to choose, compare, find gaps or decide.
  - Frontier task: complex, unusual work that needs a frontier model (pentests, attack
    prevention, complex vulnerabilities, deep reverse engineering, big system design,
    complex analysis from many sources). Triggers: security-critical work, work across
    many systems, a case that an Opus-high reviewer cannot judge.
- A task with a frontier trigger MUST count as a frontier task. A planner or researcher
  spawn MUST move to the frontier row when the case is complex or has a trigger.

## 6. The Fable question

- A frontier task, or a user request for Fable, MUST go through the Fable question: an
  `AskUserQuestion` with the options Opus high (default, first), Opus max, Fable high,
  Fable max. `core` section Models requires the user's yes for any run on Fable.

## 7. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count
  as a fail: a failing gate (`implement` section Gates per commit and `review` section
  The diff is the truth handle it); a `sources disagree` report (`research` section
  Sources) or a missing-command report (`browse` of the agent-browser plugin, section
  When the command is missing), whose section sets the re-spawn.
- A spawn that fails because of an open requirement or a question for the user MUST go
  to the user at once.
- Any other failed spawn SHOULD get one retry on Opus high. When the spawn had a
  worktree, the retry MUST run in it, on its uncommitted work: its brief MUST name the
  worktree path of the first spawn, because the card's `isolation: worktree` gives a
  fresh one. When the retry fails too, the main session MUST ask the user.
