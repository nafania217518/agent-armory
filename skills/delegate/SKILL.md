---
name: delegate
description: >
  How the main session spawns project agents: the brief, the worktree, the model and
  effort per spawn, and retries. Load it before any spawn or hand-off to an agent:
  "delegate", "spawn an agent", "which model", "write a brief", "/delegate".
max-lines: 190
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# delegate

Main session follows this skill for each spawn of a project agent.

## 1. Context

- Main session SHOULD stay small: it delegates intensive reading (many files, long files,
  wide searches) and other bulk work to agents, and keeps only what they return. It
  SHOULD delegate coding, review and writing to project agents through a spawn.
- When main session wrote code in the task, every review MUST go to a reviewer agent
  through a spawn. A bypass of the delegation rule above MUST NOT cover it.
- In any other task, main session that bypasses the delegation rule for a review MUST
  load `review` and run it itself.

## 2. Delegation and worktrees

- Coder and debugger always work in their own worktree; their cards set it. A brief
  MUST NOT send them to the main checkout, in words or by an absolute path into it. It
  MUST name each project script by its path from the worktree root.
- Two agents that run at once MUST NOT edit the same file.
- A worktree a spawn cuts MAY start from the default branch: the brief MUST name the
  task branch (coder and debugger cards set the reset).
- When a spawn in a worktree does not fail (§Re-spawn and retry), main session MUST
  merge its branch into the task branch, run `lint` and `unit`, then remove the
  worktree. `code` §Review loop sets the review that follows. A fast-forward merge to a
  commit whose full gate run the spawn reported MAY skip that `lint` and `unit` run.
- Before it removes an agent worktree, main session MUST run
  `git worktree unlock <path>`, since the host locks it for the agent.
- This merge MAY run without user's yes.
- A diagnose-only debugger result MUST NOT be merged: main session keeps its
  `debug-<id>` branch and removes the worktree.
- A worktree with uncommitted work MUST wait for user's decision when no retry follows
  (§Re-spawn and retry) or the last retry fails.

## 3. Briefs

- A coding or review brief MUST hold: the full text of each `TR` it covers, quoted from
  the plan file, and of each `BR` it covers, quoted from the doc or item that holds it
  (`plan` §Requirements), read at brief time; the test-scope list (`test` §Test scope),
  from the plan; for a review brief, also each scope addition with its reason, from the
  coder or debugger recorded-items slot; project context lines of `## Commands`,
  `## Gates`, `## Test levels` (unit style included), `## Rules` that apply; paths of
  topic files whose pointers fit the brief's work (`code` §Caveats), for the agent to
  read; which skills or skill sections the agent loads; task branch and `<base>`
  (`code` §Branch and plan file); the plan's Overrides and Accepted tech debt sections
  (`plan` §The plan).
- Instead of quoting a plan section (`TR` items, test-scope list, Overrides, Accepted
  tech debt), the brief MAY name the plan file path, the sections that apply and the
  task-branch commit at brief time. A `BR` that lives outside the plan file MUST still
  be quoted.
- A review brief MUST also hold the commit range and, for a final review, the
  whole-task checks. An audit brief MUST hold the audit target (`audit` §Map first)
  instead of the range and the task's requirements. A re-review brief MUST hold the
  findings sent to fix.
- Any other brief (research, reading, writing) MUST hold its questions and the context
  the agent needs.
- Each brief MUST name the §Models row its task matches, or `no row`; a retry brief
  MUST also name its rung.
- A brief MAY leave an `on` gate to main session only when the brief's change touches
  no file the gate runs.
- `core` rules reach every subagent through the hook, else the pointer. A brief
  MUST NOT repeat them or claim `core` is in context; the agent loads it when the hook
  did not.

## 4. What each agent returns

- The project agents MUST be these six: coder, debugger, reviewer, researcher, writer
  and planner. Each card template `skills/setup/templates/agents/<agent>.md` holds the
  role rules and report format.
- Only main session MAY delegate. A subagent cannot spawn agents, so it MUST do the
  work of its brief itself.
- Each report MUST hold the recorded-items slot and the caveat slot of `core` §Reports.
- Each agent returns its card's report. Coder and debugger also return `stuck: <why>`;
  researcher, `sources disagree`.
- A bug whose cause neither the plan nor a diagnose-only report names MUST go to the
  debugger, not the coder. So MUST a coder's `stuck: cause unknown`; it MUST NOT get the
  retry of §Re-spawn and retry.
- Main session MUST name the debugger's flow in the brief: diagnose only when user asks
  for the cause; the fix flow when user asks for a fix, or for a coder's
  `stuck: cause unknown`. When the request is unclear, it MUST ask user. A fix after a
  diagnose-only run MUST go to the coder, with the cause, loop command, proposed fix
  outline and debug branch in the brief.

## 5. Models

- Fable, Opus, Sonnet and Haiku are tier names; each name in lower case is the model
  value of a spawn and of an agent card.
- Each subagent spawn SHOULD use the model and effort of its row in the table below
  (`core` §Rule words covers a bypass). User picks the main session model.
- A task that no row names SHOULD run on Opus, with effort from the effort map.
- Effort map, each SHOULD: `low` for one clear step or a ready spec; `medium` for
  several steps with some judgment; `high` for analysis, comparison, review, design, an
  unknown cause.
- `max` MUST be used only through the Fable question, or when user asks.

| Task | Model | Effort |
|---|---|---|
| Coding from a brief (TDD) with the full design: one layer, or a fix whose cause and every site the plan, a review finding or a diagnose-only report names | Opus | low |
| Coding from a brief (TDD) that leaves design to the coder: a slice of several layers or 3+ TRs, a new script with its tests, a benchmark or measurement, code handling external input or failure paths, a fix that names a fault class but not every site | Opus | medium |
| Coding locking, transactions, waits on a lock, a signal or a queue from another process or thread, retries or state shared across processes | Opus | high |
| Coding, trivial change in a few short files, with no integration or e2e gate | Sonnet | low |
| Debugging: a bug whose cause neither the plan nor a diagnose-only report names | Opus | high |
| Refactoring; review of a code or doc change; audit; planner: any draft | Opus | high |
| Refactoring by a pattern or step list given in full (style swap, caller move, one expand–contract batch), behavior pinned by existing tests | Opus | low |
| Code map for planning: read one area; return path:lines, signatures, data shapes and the tests that pin them | Opus | medium |
| Code trace: read the code for one reported behavior or one claim about it; return the path:lines that give it, or the gap that leaves it unproven; no run, no fix; not a bug whose cause is unknown (§What each agent returns) | Opus | medium |
| Caveat claim check, one topic file | Sonnet | medium |
| Writing or summary, restating given facts | Sonnet | low |
| Writing or reading that needs judgment | Opus | effort map |
| Rewriting rule, requirement or contract text to be shorter or clearer, with no change of meaning | Opus | high |
| Research, one fact from an official source | Sonnet | low |
| Research, web read: answer the brief's questions from the 1–3 pages it names by URL | Sonnet | medium |
| Research, 2–5 facts on one subject, each from official docs, a changelog or installed source | Sonnet | medium |
| Research: sources disagree, many sources, a comparison, a design choice | Opus | high |
| Trivial task, no reading (run, list, grep, format, gate runs) | Haiku | low |
| Trivial task, light reading | Sonnet | low |
| Repeated run of an existing command, call or benchmark, no code change | Sonnet | low |
| Frontier task | the Fable question | — |

- Default rows: coder "Coding from a brief … full design" (Opus low); debugger
  "Debugging" (Opus high); reviewer and planner (Opus high); researcher "one fact" and
  writer "restating" (Sonnet low). A spawn MAY override the default with another row or
  a retry rung; it MUST then set its model and effort. A failed spawn retries up the
  chain of §Re-spawn and retry.
- The table MUST be read with these definitions:
  - Trivial change: no new branch, loop or data shape (renames, typos, config values,
    copy edits that state no new behavior and are not rule, requirement or contract
    text, code moved as is, a change given in full in the brief). Given in full:
    the brief holds the exact new code or text; a review Fix part that names only an
    outcome is not given in full. A pattern rewrite across many files is not trivial.
    Trivial task: mechanical work that needs no judgment.
  - Full design: the brief gives every interface and failure path, not only test names.
    A change over 2+ modules, an external API, a poll or schedule, or file-system paths
    leaves design to the coder, as does each case the leaves-design row lists. A fix
    whose cause and every site are named stays full design.
  - Pattern given in full: the brief shows the old and new forms, or every step with its
    target, and names the file set.
  - Research sizes: a fact is one claim that one passage of a source states. Many sources:
    over 3 named pages, over 5 facts, or sources the agent must weigh against each other.
    A web read holds up to 5 questions. One question on one official page takes the
    one-fact row.
  - Judgment test: Sonnet when the input holds every fact and the job is to restate it;
    Opus when the job is to choose, compare, find gaps or decide. An unchecked library or
    version fact in the input does not count as held. A rewrite of rule, requirement or
    contract text is judgment.
  - Mixed brief: a brief that bundles tasks of several rows takes their highest row, by
    tier, then by effort. A single task that matches several rows takes the narrowest; a
    task that matches the "Coding, trivial change" row takes it. A coding task that the
    locking row names takes that row, unless it takes the trivial row.
  - Frontier task: complex, unusual work that needs a frontier model (pentests, attack
    prevention, complex vulnerabilities, deep reverse engineering, big system design,
    complex analysis from many sources). Triggers: security-critical work, work across
    many systems, a case that an Opus-high reviewer cannot judge, a fix loop on one area
    where round n's fix causes a new Must fix in round n+1, twice in a row.
- A task with a frontier trigger MUST count as a frontier task. A planner or researcher
  spawn MUST move to the frontier row when the case is complex or has a trigger.

## 6. The Fable question

- A frontier task, or a user request for Fable, MUST go through the Fable question once
  per task (its answer covers each later spawn): a question through the question tool,
  with options Opus high (default, first), Opus max, Fable high, Fable max. `core`
  §Models requires user's yes for any run on Fable.

## 7. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count as
  a fail: a failing gate (`implement` §Gates per commit and `review` §The diff is the
  truth handle it); a `sources disagree` report (`research` §Sources), whose section
  sets the re-spawn.
- A spawn that fails because of an open requirement or a question for user MUST go to
  user at once.
- Any other failed spawn SHOULD be retried one rung up, once per rung: Haiku or Sonnet
  → the next tier at the same effort; Opus below `high` → Opus high; Opus high → Fable
  high (`core` §Models). When the failed spawn left work in its worktree, main session
  MUST first commit any uncommitted part as a WIP commit on that spawn's branch, name
  that branch in the retry brief, and remove the first worktree. When the Fable retry
  fails, or user declines it, main session MUST ask user.
