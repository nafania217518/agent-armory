---
name: delegate
description: >
  How the main session spawns project agents: the brief, the worktree, the model and
  effort per spawn, and retries. Load it before any spawn or hand-off to an agent:
  "delegate", "which model", "write a brief", "/delegate".
metadata:
  type: regular
  extends: [core, research, workflow]
  max-lines: 232
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `workflow` before your first brief when its rules are not in your context.
Load `research` before a researcher brief when its rules are not in your context.

# delegate

Main session follows this skill for each spawn of a project agent.

## 1. Delegation and worktrees

- Coder, debugger and writer always work in their own worktree; their cards set it. A
  brief MUST NOT send them to main checkout, in words or by an absolute path into it. It
  MUST name each project script by its path from worktree root.
- Two agents that run at once MUST NOT edit the same file.
- When a spawn in a worktree does not fail (§6), main session MUST merge
  its branch into task branch, or the branch the brief names, then remove its worktree
  once its output closes (§2). Main session MUST run `lint` and `unit`, each when
  `on` and every part included, only after a non-fast-forward merge.
- Before it removes an agent worktree, main session MUST run `git worktree unlock <path>`,
  since host locks it for the agent.
- This merge MAY run without user's yes.
- A diagnose-only debugger result MUST NOT be merged. Main session MUST keep a branch at
  diagnose-only tip, the diagnose-only branch, until the task-end cleanup; before a
  fix follow-up to that debugger, it MUST create that branch. It removes the worktree once
  its output closes (§2).

## 2. Briefs

- A coding or review brief MUST hold: plan file path and task-branch commit at brief time;
  each plan section that applies (Design, test-scope list, Overrides, Accepted tech debt)
  by name and each `TR` by id, with no line range and never quoted, for agent to read, and
  no word on a section the plan leaves out; each `BR` it covers that lives outside plan
  file, by path and line range for agent to read, or, in a tracker
  item, quoted in full, read at brief time; for a review brief, also each scope addition
  with its reason, from coder or debugger recorded-items slot; names of project context
  sections and `## Rules` lines that apply, not their text, since host loads project
  context into each subagent; paths of topic files whose pointers fit the brief's work
  (`workflow` §3), for agent to read; which skills or skill sections agent loads; task
  branch and `<base>` (`workflow` §2).
- A brief MUST hold no design choice the plan lacks. It MUST name the gap instead: coder
  then records the misfit, or main session first amends
  plan (`tracking` §4).
- A review brief MUST also hold commit range, each gate run at range's last commit with
  the actor that ran it, and, for a final review, whole-task checks. An audit brief MUST
  hold the audit target that user names instead of range and task's requirements.
- A writer brief, and a debugger brief outside a task, MUST name branch and commit to
  reset to.
- Follow-up work MUST go as a follow-up message to the agent whose open output it extends:
  a fix of its change, a re-review of fixes for its findings, a new request on its draft,
  a further question on its research or text. For a writer, a follow-up MUST be only a
  change to text it wrote in its open output; any other write is new work. Work that
  checks, reviews or settles a dispute about an agent's own output MUST go to another
  agent, except the planner's own task check on its draft.
- An output MUST count as open until: for a coder or debugger change, its review reports
  `fixed` or `not re-opened` for each finding sent to it, or sends it none; for reviewer
  findings, each finding sent to fix is `fixed` or `not re-opened`, or none was sent; for
  a diagnose-only debugger, user's no to a fix; on a yes, its fix-flow change counts as a
  debugger change; for a planner draft, plan approval; for a writer change, task end or
  run end; for a researcher report, commit or plan-mode proposal that uses its claims, or
  drop of its claim. An output MUST also count as closed once its follow-up work leaves
  the agent. Unless its fix leaves its agent, a finding left for recorded-items quiz keeps
  its coder or debugger and its reviewer open until quiz answer is applied and, for a fix,
  the review of its fix commits ends.
- An open output does not block reuse; a later follow-up on that output MUST name its
  earlier brief. Main session MUST note clock time of each reusable agent's (below)
  result or pong. It MUST read clock before each new-work message.
- A pong (`core` §6) MUST NOT change main session's next step. With no other step,
  main session MUST end its turn with an empty reply. Main session MUST stop a coder,
  debugger or reviewer once its output closes.
- A brief or message MUST hold the line `timer: on` (`core` §6) when main session
  expects to send that agent a later message.
- A follow-up message MUST name commits since agent's last turn, or `none`; when that turn
  was on another branch, it MUST name current branch and its tip instead. It MUST also
  hold each brief item that changed since agent's last brief or message: a new or replaced
  `TR` by id, a `req:` re-point order, and, in a fix follow-up to a diagnose-only
  debugger, the diagnose-only tip. To a coder, debugger or writer, it MUST also name the
  commit to reset to: tip of task branch, or of the branch its brief names, or, after a
  `stuck:` report, the WIP merge below. Before such a message, main session MUST commit
  any uncommitted work in that worktree as a WIP commit. After a `stuck:` report, it MUST
  also merge task branch, or the branch its brief names, into that WIP branch; the
  worktree stays. A re-review message MUST also name finding numbers and fix commits. A
  follow-up or new-work message's result counts as a spawn result for §1
  and §6.
- Follow-up work MUST leave its agent and go as new work (below) when it needs a §4
  row of a higher tier, or same tier with higher effort, when the message cannot reach its
  agent, or when a commit by another actor since agent's last turn changes a file of its
  work: a file its commits changed, its review range covered or its report named. A
  no-re-review commit (below), a merge of the agent's own commits, a WIP
  commit of the agent's own work, the commits the message sends it to check and a merge of
  those commits do not count. When agent's last turn was on another branch, the stale-file
  check MUST compare that branch's tip at that turn with current tip. A re-review brief to
  another agent MUST hold the findings sent to fix.
- A no-re-review commit only deletes caveat or doc lines a finding's Fix part names, or
  writes caveat or doc text that a Fix part gives word for word.
- Writer, researcher and planner are reusable agents. New work for one SHOULD go as a
  message to an idle reusable agent of that card already spawned in the session. The
  message MUST hold a full brief that replaces agent's earlier brief, and commits as for a
  follow-up message. Coder, debugger and reviewer MUST get only follow-ups on their open
  output.
- New work MUST go to a fresh spawn instead when agent's model or effort differs from the
  work's §4 row, when the work touches a file of its work that a commit by another
  actor changed since its last turn, with the exclusions and branch case of follow-up work
  above, when its last result or pong arrived more than 4 minutes 30 seconds ago, or when
  its worktree is removed.
- When a re-review marks a finding `open` and its fixer ran below Opus high, its next fix
  round MAY count as needing Opus high, with the finding and failed fix commits in its
  brief.
- A brief MUST ask only for its card's report items, plus an item main session uses next
  (`core` §6).
- Any other brief (research, reading, writing) MUST hold its questions and context the
  agent needs.
- Each brief MUST name the §4 row its task matches, or `no row`.
- A brief MAY leave an `on` gate to main session only when its change touches no file the
  gate runs.
- A brief MUST NOT repeat `core` rules or claim `core` is in context; agent loads it when
  hook (`core` §7) did not.

## 3. What each agent returns

- The project agents MUST be these six: coder, debugger, reviewer, researcher, writer and
  planner. Each card template `skills/setup/templates/agents/<agent>.md` holds role rules
  and report format.
- A bug whose cause neither the plan, a review finding nor a diagnose-only report names
  MUST go to debugger, not coder. So MUST a coder's `stuck: cause unknown`; it MUST NOT
  get the retry of §6; main session MUST first commit coder's uncommitted
  work as a WIP commit (§6), then remove its worktree. Its debugger brief
  MUST name the stuck coder's WIP branch as a read-only reference.
- Main session MUST name debugger's flow in brief or follow-up message: diagnose only when
  user asks for the cause; the fix flow when user asks for a fix, or for a coder's
  `stuck: cause unknown`. When request is unclear, flow MUST be diagnose only, with no
  question to user. After a diagnose-only report, main session MUST ask user whether to
  fix the bug. On a yes, the fix is a coding task; on a no, its output closes. A fix
  after a diagnose-only run SHOULD go to that debugger, in the fix flow, as a follow-up
  message (§2). A fresh spawn for it MUST be the coder, with the cause, loop command,
  proposed fix outline and diagnose-only branch in its brief.

## 4. Models

- Fable, Opus, Sonnet and Haiku are tier names; each name in lower case is the model value
  of a spawn and of an agent card.
- Each subagent spawn SHOULD use model and effort of its row in table below (`core` §1
  covers a bypass). User picks main session model.
- A task that no row names SHOULD run on Opus, with effort from effort map.
- Effort map, each SHOULD: `low` for one clear step or a ready spec; `medium` for several
  steps with some judgment; `high` for analysis, comparison, review, design, an unknown
  cause.
- `max` MUST be used only through the Fable question, or when user asks.

| # | Task | Model | Effort |
|---|---|---|---|
| 1 | Coding, full design | Opus | low |
| 2 | Coding, the coder makes the design: a slice of several layers or 3+ TRs, a new script with its tests, a benchmark or measurement, code handling external input or failure paths, a fix that names a fault class but not every site | Opus | medium |
| 3 | Coding with locking, transactions or cross-process state | Opus | high |
| 4 | Trivial coding in a few short files, with no integration or e2e gate | Sonnet | low |
| 5 | Refactoring by a pattern given in full | Opus | low |
| 6 | Debugging; refactoring; review and audit; planner draft; rewriting rule, requirement or contract text | Opus | high |
| 7 | Code map or trace; writing or reading that needs judgment | Opus | medium |
| 8 | Research where sources disagree, or that needs many sources, a comparison or a design choice (the Opus research row) | Opus | high |
| 9 | Web read of 1–3 named pages; 2–5 facts from official sources; caveat claim check of one topic file; code claim check | Sonnet | medium |
| 10 | One official fact; writing or summary that restates given facts; trivial task with light reading; repeated run | Sonnet | low |
| 11 | Trivial task with no reading | Haiku | low |
| 12 | Frontier task | the Fable question | — |

- Default rows: coder row 1; debugger, reviewer and planner row 6; researcher and writer
  row 10. A spawn MAY override the default with another row; it MUST then set its model
  and effort.
- A researcher brief with an open point (`research` §1) MUST name row 7, or row 8 with a
  web question.
- The table MUST be read with these definitions:
  - Trivial change: no new branch, loop or data shape (renames, typos, config values, copy
    edits that state no new behavior and are not rule, requirement or contract text, code
    moved as is, a change given in full in brief). Given in full: brief holds exact new
    code or text; a review Fix part that names only an outcome is not given in full. A
    pattern rewrite across many files is not trivial. Trivial task: mechanical work that
    needs no judgment.
  - Full design: brief gives every interface and failure path, not only test names. A
    change over 2+ modules, an external API, a poll or schedule, or file-system paths
    leaves design to coder, as does each case row 2 lists. A fix whose cause and every
    site are named stays full design.
  - Pattern given in full: brief shows old and new forms, or every step with its target,
    and names file set.
  - Research sizes: a fact is one claim that one passage of a source states. Many sources:
    over 3 named pages, over 5 facts, or sources the agent must weigh against each other.
    A web read holds up to 5 questions. One question on one official page takes row 10.
  - Judgment test: Sonnet when input holds every fact and job is to restate it; Opus when
    job is to choose, compare, find gaps or decide. An unchecked library or version fact
    in input does not count as held. A rewrite of rule, requirement or contract text is
    judgment.
  - Mixed brief: a brief that bundles tasks of several rows takes their highest row, by
    tier, then by effort. A single task that matches several rows takes the narrowest; a
    task that matches row 4 takes it. A coding task that row 3 names takes that row,
    unless it takes row 4.
  - Frontier task: complex, unusual work that needs a frontier model (pentests, attack
    prevention, complex vulnerabilities, deep reverse engineering, big system design,
    complex analysis from many sources). Triggers: security-critical work, work across
    many systems, a case that an Opus-high reviewer cannot judge, a fix loop on one area
    where round n's fix causes a new Must fix in round n+1, twice in a row.
- A task with a frontier trigger MUST count as a frontier task.

## 5. The Fable question

- A frontier task, or a user request for Fable, MUST go through the Fable question once
  per task (its answer covers each later spawn): a question through question tool, with
  options Opus high (default, first), Opus max, Fable high, Fable max.

## 6. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count as a
  fail: a failing gate, which the agent's own gate rules handle; a `sources disagree`
  report (`research` §2), whose section sets where disputed questions go.
- A spawn that fails because of an open requirement or a question for user MUST go to user
  at once.
- Any other failed spawn, from any row, SHOULD get one fresh retry on Opus high. When
  failed spawn left work in its worktree, main session MUST first commit any uncommitted
  part as a WIP commit on that spawn's branch, merge task branch, or the branch its brief
  names, into that branch, name it as the commit to reset to in retry brief, or in the
  brief of a fresh spawn that takes follow-up work after a `stuck:` report, and, for a
  retry or a fresh spawn, remove first worktree. When the retry also fails, main session
  MUST ask user.
