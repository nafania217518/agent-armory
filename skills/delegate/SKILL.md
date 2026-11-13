---
name: delegate
description: >
  How the main session spawns project agents: the brief, the worktree, the model and
  effort per spawn, and retries. Load it before any spawn or hand-off to an agent:
  "delegate", "spawn an agent", "which model", "write a brief", "/delegate".
max-lines: 160
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# delegate

The main session follows this skill for each spawn of a project agent.

## 1. Context

- The main session SHOULD stay small: it delegates intensive reading (many files, long
  files, wide searches) and other bulk work to agents, and keeps only what they return.
  It SHOULD delegate coding, review and writing to the project agents through a spawn.
- When the main session wrote code in the task, every review MUST go to a reviewer
  agent through a spawn. A bypass of the delegation rule above MUST
  NOT cover it.
- In any other task, a main session that bypasses the delegation rule for a review
  MUST load `review` and run it itself.

## 2. Delegation and worktrees

- The coder and the debugger always work in their own worktree; their cards set it. A
  brief MUST NOT send them to the main checkout, in words or by an absolute path into
  it. It MUST name each project script by its path from the worktree root.
- Two agents that run at once MUST NOT edit the same file.
- A worktree a spawn cuts MAY start from the default branch: the brief MUST name the
  task branch (the coder and debugger cards set the reset).
- When a spawn in a worktree does not fail (section Re-spawn and retry), the main
  session MUST merge its branch into the task branch, run `lint` and `unit`, then remove
  the worktree. `code` section Review loop sets the review that follows.
- Before it removes an agent worktree, the main session MUST run
  `git worktree unlock <path>`, since the host locks the worktree for the agent.
- This merge MAY run without the user's yes.
- A diagnose-only debugger result MUST NOT be merged: the main session keeps its
  `debug-<id>` branch and removes the worktree.
- A worktree with uncommitted work MUST wait for the user's decision when no retry
  follows (section Re-spawn and retry) or the last retry fails.

## 3. Briefs

- A coding or review brief MUST hold: the full text of each `TR` it covers, quoted from
  the plan file, and of each `BR` it covers, quoted from the doc or item that holds it
  (`plan` section Requirements), read at brief time; the test-scope list (`test` section
  Test scope), from the plan; for a review brief, also each scope addition with its
  reason, from the coder or debugger recorded-items slot; the project context lines of
  `## Commands`, `## Gates`, `## Test levels` (the unit style included), `## Rules` that
  apply; the paths of the topic files whose pointers fit the brief's work (`code`
  section Caveats), for the agent to read; which skills or skill sections the agent
  loads; the task branch and `<base>` (`code` section Branch and plan file); the plan's
  Overrides and Accepted tech debt sections (`plan` section The plan).
- In place of quoting a plan section (the `TR` items, the test-scope list, Overrides,
  Accepted tech debt), the brief MAY name the plan file path, the sections that apply and
  the task-branch commit at brief time. A `BR` that lives outside the plan file MUST
  still be quoted.
- A review brief MUST also hold the commit range and, for a final review, the
  whole-task checks. An audit brief MUST hold the audit target (`audit` section Map
  first) in place of the range and the task's requirements. A re-review brief MUST
  hold the findings sent to fix.
- Any other brief (research, reading, writing) MUST hold the question and the context
  the agent needs.
- A brief MAY leave an `on` gate to the main session only when the brief's change
  touches no file that the gate runs.
- The `core` rules reach every subagent through the hook, else the pointer. A brief
  MUST NOT repeat them or claim `core` is in context; the agent loads it when the hook
  did not.

## 4. What each agent returns

- The project agents MUST be these six: coder, debugger, reviewer, researcher, writer
  and planner. Each card template `skills/setup/templates/agents/<agent>.md` holds the
  role rules and the report format.
- Only the main session MAY delegate. A subagent cannot spawn agents, so it MUST do the
  work of its brief itself.
- Each report MUST hold the recorded-items slot and the caveat slot of `core` section
  Reports.
- Each agent returns its card's report. The coder and the debugger also return
  `stuck: <why>`; the researcher, `sources disagree`.
- A bug whose cause neither the plan nor a diagnose-only report names MUST go to the
  debugger, not the coder. So MUST a coder's `stuck: cause unknown`; it MUST NOT get the
  retry of section Re-spawn and retry.
- The main session MUST name the debugger's flow in the brief: diagnose only when the
  user asks for the cause; the fix flow when the user asks for a fix, or for a coder's
  `stuck: cause unknown`. When the request is unclear, it MUST ask the user. A fix after
  a diagnose-only run MUST go to the coder, with the cause, the loop command, the
  proposed fix outline and the debug branch in the brief.

## 5. Models

- Fable, Opus, Sonnet and Haiku are tier names; each name in lower case is the model
  value of a spawn and of an agent card.
- Each subagent spawn SHOULD use the model and effort of its row in the table below
  (`core` section Rule words covers a bypass). The user picks the main session model.
- A task that no row names SHOULD run on Opus, with effort from the effort map.
- Effort map, each SHOULD: `low` for one clear step or a ready spec; `medium` for
  several steps with some judgment; `high` for analysis, comparison, review, design, an
  unknown cause.
- `max` MUST be used only through the Fable question, or when the user asks.

| Task | Model | Effort |
|---|---|---|
| Coding from a brief (TDD), a fix whose cause the plan or a diagnose-only report names included | Opus | low |
| Coding, trivial change in a few short files, with no e2e or full gate run | Sonnet | low |
| Debugging: a bug whose cause neither the plan nor a diagnose-only report names | Opus | high |
| Refactoring; code review, except of a trivial change; audit; planner: any draft | Opus | high |
| Code review of a trivial change | Sonnet | high |
| Caveat claim check, one topic file | Sonnet | medium |
| Writing or summary, restating given facts | Sonnet | low |
| Writing or reading that needs judgment | Opus | effort map |
| Research, one fact from an official source | Sonnet | low |
| Research: sources disagree, many sources, a comparison, a design choice | Opus | high |
| Trivial task, no reading (run, list, grep, format, gate runs) | Haiku | low |
| Trivial task, light reading | Sonnet | low |
| Frontier task | the Fable question | — |

- Default rows: coder "Coding from a brief" (Opus low); debugger "Debugging" (Opus
  high); reviewer and planner (Opus high); researcher "one fact" and writer
  "restating" (Sonnet low). A spawn MAY override the default with another row. A
  failed spawn retries up the chain of section Re-spawn and retry.
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

- A frontier task, or a user request for Fable, MUST go through the Fable question once
  per task (its answer covers each later spawn): a question through the question tool,
  with the options Opus high (default, first), Opus max, Fable high, Fable max. `core`
  section Models requires the user's yes for any run on Fable.

## 7. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count
  as a fail: a failing gate (`implement` section Gates per commit and `review` section
  The diff is the truth handle it); a `sources disagree` report (`research` section
  Sources), whose section sets the re-spawn.
- A spawn that fails because of an open requirement or a question for the user MUST go
  to the user at once.
- Any other failed spawn SHOULD be retried one rung up, once per rung: Haiku or Sonnet
  → the next tier at the same effort; Opus below `high` → Opus high; Opus high → Fable
  high (`core` section Models). When the failed spawn left work in its worktree, the
  main session MUST first commit any uncommitted part as a WIP commit on that spawn's
  branch, name that branch in the retry brief, and remove the first worktree. When the
  Fable retry fails, or the user declines it, the main session MUST ask the user.
