# Plan: retro-rules

Parent: `docs/milestones/retro-fixes.md` section Tasks, line `retro-rules`.

## Goal

Three of the retro follow-ups land as text: `plan` self-review walks each new flow end
to end at the milestone and the task level; the coder and debugger cards report gates
for each commit; this repo's `AGENTS.md` names the plugin lag in a caveat. Zero quiz
rounds: the milestone doc settles every point. The flow walk is one bullet after the
level checks, so the fact has one home for both levels.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill, card or project context; these
surfaces have no test level, so lint and the review check them`.

- TR-1 (retro-fixes/BR-1, retro-fixes/BR-7): `plan` section Self-review and approval
  MUST hold, right after the level checks (after the task check's last line "Domain,
  boundaries and state are fixed."): `- At the milestone and the task level, the review
  MUST also walk each new or changed flow path by path, end to end, against the branch,
  worktree and gate rules.`
  tests: none (see above)
- TR-2 (retro-fixes/BR-3, retro-fixes/BR-8): in `skills/setup/templates/agents/coder.md`
  and `.claude/agents/coder.md` (item 2), and in
  `skills/setup/templates/agents/debugger.md` and `.claude/agents/debugger.md` (item
  5), "Gate results, one line per gate." MUST read `Gate results for each commit SHA,
  one line per gate.`
  tests: none (see above)
- TR-3 (retro-fixes/BR-2): this repo's `AGENTS.md` `## Caveats` MUST hold, as its last
  line: `The installed armory plugin can lag this repo; a brief here names the repo
  path of each skill it loads and, for an agent card, its template path :
  .claude-plugin/plugin.json` (one line). The main session writes it (`core` section
  Reports), right after the plan-file commit.
  tests: none (see above)
- TR-4 (retro-fixes/BR-7, retro-fixes/BR-8): `lint` and `unit` MUST pass on every
  commit. No other file restates the changed lines (checked: `code` section Task end
  and `review` section Output speak of the main-session and review reports, not the
  cards).
  tests: none (see above)

Backslashes are not used; the text in backticks is exact. Wrap at about 88 characters,
two-space continuation, as each file does. One commit per TR; TR-4 holds no commit of
its own.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: no test under `scripts/` reads these files.

## Risks

- `plan` grows by about 3 lines (189/194 `max-lines`).
- The flow walk is a judgement step; no check enforces it.

## Stack choices

None.

## Out of scope

- The width and list checks (task `doc-checks`).
- `review` section Output and `code` section Task end gate lines (they are not card
  reports).

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` eight commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`875324c`); not a design rule, recorded for the user's approval.

## Caveats

- The installed armory plugin can lag this repo; a brief here names the repo path of
  each skill it loads and, for an agent card, its template path :
  .claude-plugin/plugin.json
