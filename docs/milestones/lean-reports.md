# Milestone: lean-reports

Parent: `docs/DESIGN.md` section Milestones, line `lean-reports`. Branch:
`milestone-lean-reports`.

## Goal

Three rule edits keep the main session context small and its rules clear. A caveat
line holds one fact, so a reader can scan `## Caveats`. Parallel coding agents run only
in their own worktree. A subagent report holds only the items its card lists, so it
does not flood the main session context. Quiz on 2026-11-02: one fact per caveat line,
checked by reading, no lint check; parallel coders without isolation are banned (the
first request, a SHOULD fallback, was dropped); only subagent reports shrink, through a
content rule with no line cap; review and audit keep their output format; the
term-explanation rule stays for all reports.

## Scope

In:

- `core` section Reports.
- `delegate` section Delegation and worktrees.
- This repo's `AGENTS.md` `## Caveats`: rewrite or split the lines that join facts.

Out:

- `core` section Host terms: the worktree fallback stays MUST.
- The report formats in `review` and `audit` section Output, and in the six cards.
- `core` section Writing and questions: the rule that a report explains each term at
  first use stays for all reports.
- The main session's replies to the user.
- A lint check for caveat lines.
- Old plan files and `docs/archive/`.

## Requirements

Each `BR` is checked by reading the files, by `lint` or by `unit`.

- BR-1: `core` section Reports MUST require one fact per caveat line, in a report and
  in the project context `## Caveats`. A caveat with two facts MUST become two lines,
  or one line that keeps only the fact a reader would not expect.
- BR-2: each line of this repo's `AGENTS.md` `## Caveats` MUST hold one fact and keep
  the format `SHORT_DESCRIPTION : <file>`.
- BR-3: `delegate` section Delegation and worktrees MUST require that coding agents
  that run at once each run in their own worktree. Without worktrees, they MUST run one
  at a time (the `core` fallback). No SHOULD bypass MAY run them at once in one
  checkout.
- BR-4: `core` section Reports MUST require that a subagent report holds only the items
  of its card's report format and the two slots: no narration of the steps, no
  restated brief, and no pasted file content, diff or command output that a card item
  does not ask for. The report MUST point to code by `path:line` or commit SHA.
- BR-5: `lint` and `unit` MUST pass on every commit. A skill MAY raise its `max-lines`.
- BR-6: a changed fact or rule MUST have every reference and restatement updated in
  the same commit.

## Tasks

Format: `<branch> : <what> : <BR list> : <status>`. In execution order; the status
values are in the armory `plan` skill, section Levels.

- lean-reports-edits : the caveat rule and the rewrite, the worktree MUST, the report
  content rule : BR-1, BR-2, BR-3, BR-4, BR-5, BR-6 : open

## Risks

- A subagent MUST NOT write `## Caveats`. So the main session rewrites the BR-2 lines
  in a commit of its own, not in a coder commit.
- `core` is at 128/131 `max-lines`; BR-1 and BR-4 add lines.
- BR-3 covers coding agents only. A writer that runs next to a coder in a worktree
  still shares the task branch checkout with nobody else, so the same-file ban stays
  enough.
- The BR-4 content rule and the card items can overlap. The debugger card asks for the
  loop output, so that output stays in the report.

## Done criteria

- Each `BR` is met, checked by reading, by `lint` or by `unit`.
- The task is done, and the done write marks the milestone done in `docs/DESIGN.md`
  (`code` section Task end).
