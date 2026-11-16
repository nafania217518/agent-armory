---
name: delegate
description: >
  How the main session spawns project agents: the brief, the worktree, the model and
  effort per spawn, and retries. Load it before any spawn or hand-off to an agent:
  "delegate", "spawn an agent", "which model", "write a brief", "/delegate".
max-lines: 229
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# delegate

Main session follows this skill for each spawn of a project agent.

## 1. Delegation and worktrees

- Coder, debugger and writer always work in their own worktree; their cards set it. A
  brief MUST NOT send them to the main checkout, in words or by an absolute path into
  it. It MUST name each project script by its path from the worktree root.
- Two agents that run at once MUST NOT edit the same file.
- When a spawn in a worktree does not fail (§Re-spawn and retry), main session MUST merge
  its branch into the task branch, or the branch the brief names, then remove the worktree
  once its output closes (§Briefs). Main session MUST run `lint` and `unit` only after a
  non-fast-forward merge. `code` §Review loop sets the review that follows.
- Before it removes an agent worktree, main session MUST run `git worktree unlock <path>`,
  since the host locks it for the agent.
- This merge MAY run without user's yes.
- A diagnose-only debugger result MUST NOT be merged. Its worktree branch is the
  diagnose-only branch. When user declines the fix, or the fix goes to a fresh coder, main
  session MUST keep that branch. It removes the worktree once its output closes (§Briefs).
- A worktree with uncommitted work MUST wait for user's decision when no retry follows
  (§Re-spawn and retry) or the retry fails.

## 2. Briefs

- A coding or review brief MUST hold: plan file path and task-branch commit at brief time;
  each plan section that applies (Design, test-scope list, Overrides, Accepted tech debt)
  by name and each `TR` by id, with no line range and never quoted, for the agent to read,
  and no word on a section the plan leaves out; each `BR` it covers that lives outside the
  plan file (`plan` §Requirements), by path and line range for the agent to read, or, in a
  tracker item, quoted in full, read at brief time; for a review brief, also each scope
  addition with its reason, from the coder or debugger recorded-items slot; names of
  project context sections and `## Rules` lines that apply, not their text, since the host
  loads project context into each subagent; paths of topic files whose pointers fit the
  brief's work (`code` §Caveats), for the agent to read; which skills or skill sections
  the agent loads; task branch and `<base>` (`code` §Branch and plan file).
- A brief MUST hold no design choice the plan lacks. It MUST name the gap instead: the
  coder then records the misfit (`implement` §Before you write), or main session first
  amends the plan (`plan` §Amendments).
- A review brief MUST also hold the commit range, each gate run at the range's last commit
  with the actor that ran it, and, for a final review, the whole-task checks. An audit
  brief MUST hold the audit target (`audit` §Map first) instead of the range and the
  task's requirements.
- A writer brief, and a debugger brief outside a task, MUST name the branch and the commit
  to reset to.
- Follow-up work MUST go, as a follow-up message, to the agent whose open output it
  extends: a fix of its change, a re-review of the fixes for its findings, a new request
  on its draft, a further question on its research or text. For a writer, a follow-up
  MUST be only a change to text it wrote in its open output; any other write is new
  work. Work that checks, reviews or settles a dispute about an agent's own output MUST go
  to another agent, except the drafter's own task check (`plan` §Self-review and
  approval).
- An output MUST count as open until: for a coder or debugger change, its review reports
  `fixed` or `not re-opened` for each finding sent to it, or sends it none; for reviewer
  findings, each finding sent to fix is `fixed` or `not re-opened`, or none was sent; for
  a diagnose-only debugger, user's no to a fix; on a yes, its fix-flow change counts as a
  debugger change; for a planner draft, plan approval; for a writer change, task end or
  run end; for a researcher report, the commit or plan-mode proposal that uses its claims,
  or the drop of its claim. An output MUST also count as closed once its follow-up work
  leaves the agent. Unless its fix leaves its agent, a finding left for the
  recorded-items quiz keeps its coder or debugger and its reviewer open until the quiz
  answer is applied and, for a fix, its review in `code` §Task end, step 3 ends.
- An open output does not block reuse; a later follow-up on that output MUST name its
  earlier brief. Main session MUST note the clock time of each reusable agent's (below)
  result. It MUST read the clock before each new-work message.
- A follow-up message MUST name the commits since the agent's last turn, or `none`; when
  that turn was on another branch, it MUST name the current branch and its tip instead. It
  MUST also hold each brief item that changed since the agent's last brief or message: a
  new or replaced `TR` by id, a `req:` re-point order, and, in a fix follow-up to a
  diagnose-only debugger, the diagnose-only tip. To a coder, debugger or writer, it MUST
  also name the commit to reset to: the tip of the task branch, or of the branch its brief
  names, or, after a `stuck:` report, the WIP merge of §Re-spawn and retry. Before such a
  message, main session MUST commit any uncommitted work in that worktree as a WIP commit
  and, after a `stuck:` report, merge as §Re-spawn and retry sets. A
  re-review message MUST also name the finding numbers and the fix commits. A follow-up or
  new-work message's result counts as a spawn result for §Delegation and worktrees and
  §Re-spawn and retry.
- A finding that the fixer reports false MUST get the claim check of `code` §Review loop.
- Follow-up work MUST leave its agent and go as new work (below) when it needs a §Models
  row of a higher tier, or the same tier with higher effort, when the message cannot reach
  its agent, or when a commit by another actor since the agent's last turn changes a file
  of its work: a file its commits changed, its review range covered or its report named. A
  no-re-review commit (`code` §Review loop), a merge of the agent's own commits, a WIP
  commit of the agent's own work, the commits the message sends it to check and a merge of
  those commits do not count. When the agent's last turn was on another branch, the
  stale-file check MUST compare that branch's tip at that turn with the current tip. A
  re-review brief to another agent MUST hold the
  findings sent to fix.
- Writer, researcher and planner are reusable agents. New work for one SHOULD go as a
  message to an idle reusable agent of that card already spawned in the session. The
  message MUST hold a full brief that replaces the agent's earlier brief, and the commits
  as for a follow-up message.
  Coder, debugger and reviewer MUST get only follow-ups on their open output.
- New work MUST go to a fresh spawn instead when the agent's model or effort differs from
  the work's §Models row, when the work touches a file of its work that a commit by
  another actor changed since its last turn, with the exclusions and the branch case of
  follow-up work above, when its last result arrived more than 4 minutes 30 seconds ago,
  or when its worktree is removed.
- When a re-review marks a finding `open` and its fixer ran below Opus high, its next fix
  round MAY count as needing Opus high, with the finding and the failed fix commits in its
  brief.
- A brief MUST ask only for its card's report items, plus an item main session uses next
  (`core` §Reports).
- Any other brief (research, reading, writing) MUST hold its questions and the context the
  agent needs.
- Each brief MUST name the §Models row its task matches, or `no row`.
- A brief MAY leave an `on` gate to main session only when the brief's change touches no
  file the gate runs.
- A brief MUST NOT repeat `core` rules or claim `core` is in context; the agent loads it
  when the hook (`core` §Host terms) did not.

## 3. What each agent returns

- The project agents MUST be these six: coder, debugger, reviewer, researcher, writer and
  planner. Each card template `skills/setup/templates/agents/<agent>.md` holds
  the role rules and report format.
- Only main session MAY delegate. A subagent cannot spawn agents, so it MUST do the work
  of its brief itself.
- Each agent returns its card's report. Coder and debugger also return `stuck: <why>`;
  researcher, `sources disagree`.
- A bug whose cause neither the plan, a review finding nor a diagnose-only report names
  MUST go to the debugger, not the coder. So MUST a coder's `stuck: cause unknown`; it
  MUST NOT get the retry of §Re-spawn and retry; main session MUST first commit the
  coder's uncommitted work as a WIP commit (§Re-spawn and retry), then remove its
  worktree. Its debugger brief MUST name the stuck coder's WIP branch as a read-only
  reference.
- Main session MUST name the debugger's flow in the brief or follow-up message: diagnose
  only when user asks for the cause; the fix flow when user asks for a fix, or for a
  coder's `stuck: cause unknown`. When the request is unclear, the flow MUST be diagnose
  only, with no question to user. After a diagnose-only report, main session MUST ask user
  whether to fix the bug. On a yes, the fix follows `code`; on a no, its output closes. A
  fix after a diagnose-only run SHOULD go to that debugger, in the fix flow, as a
  follow-up message (§Briefs). A fresh spawn for it MUST be the coder, with the cause,
  loop command, proposed fix outline and diagnose-only branch in the brief.

## 4. Models

- Fable, Opus, Sonnet and Haiku are tier names; each name in lower case is the model value
  of a spawn and of an agent card.
- Each subagent spawn SHOULD use the model and effort of its row in the table below
  (`core` §Rule words covers a bypass). User picks the main session model.
- A task that no row names SHOULD run on Opus, with effort from the effort map.
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
  row 10. A spawn MAY override the default with another row; it MUST then
  set its model and effort.
- The table MUST be read with these definitions:
  - Trivial change: no new branch, loop or data shape (renames, typos, config values, copy
    edits that state no new behavior and are not rule, requirement or contract text, code
    moved as is, a change given in full in the brief). Given in full: the brief holds the
    exact new code or text; a review Fix part that names only an outcome is not given in
    full. A pattern rewrite across many files is not trivial. Trivial task: mechanical
    work that needs no judgment.
  - Full design: the brief gives every interface and failure path, not only test names. A
    change over 2+ modules, an external API, a poll or schedule, or file-system paths
    leaves design to the coder, as does each case row 2 lists. A fix whose cause and every
    site are named stays full design.
  - Pattern given in full: the brief shows the old and new forms, or every step with its
    target, and names the file set.
  - Research sizes: a fact is one claim that one passage of a source states. Many sources:
    over 3 named pages, over 5 facts, or sources the agent must weigh against each other.
    A web read holds up to 5 questions. One question on one official page takes row 10.
  - Judgment test: Sonnet when the input holds every fact and the job is to restate it;
    Opus when the job is to choose, compare, find gaps or decide. An unchecked library or
    version fact in the input does not count as held. A rewrite of rule, requirement or
    contract text is judgment.
  - Mixed brief: a brief that bundles tasks of several rows takes their highest row, by
    tier, then by effort. A single task that matches several rows takes the narrowest; a
    task that matches row 4 takes it. A coding task that row 3 names takes that row,
    unless it takes row 4.
  - Frontier task: complex, unusual work that needs a frontier model (pentests, attack
    prevention, complex vulnerabilities, deep reverse engineering, big system design,
    complex analysis from many sources). Triggers: security-critical work, work across
    many systems, a case that an Opus-high reviewer cannot judge, a fix loop on one area
    where round n's fix causes a new Must fix in round n+1, twice in a row.
- A task with a frontier trigger MUST count as a frontier task. A planner or researcher
  spawn MUST move to row 12 when the case is complex or has a trigger.

## 5. The Fable question

- A frontier task, or a user request for Fable, MUST go through the Fable question once
  per task (its answer covers each later spawn): a question through the question tool,
  with options Opus high (default, first), Opus max, Fable high, Fable max.

## 6. Re-spawn and retry

- A spawn fails when it returns no report or a `stuck:` report. These MUST NOT count as a
  fail: a failing gate (`implement` §Gates per commit and `review` §The diff is the truth
  handle it); a `sources disagree` report (`research` §Sources), whose section sets where
  the disputed questions go.
- A spawn that fails because of an open requirement or a question for user MUST go to user
  at once.
- Any other failed spawn, from any row, SHOULD get one fresh retry on Opus high. When the
  failed spawn left work in its worktree, main session MUST first commit any uncommitted
  part as a WIP commit on that spawn's branch, merge the task branch, or the branch its
  brief names, into that branch, name it as the commit to reset to in the retry brief, or
  in the brief of a fresh spawn that takes the follow-up work after a `stuck:` report, and
  remove the first worktree. When the retry also fails, main session MUST ask user.
