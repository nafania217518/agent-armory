# Plan: split RULES.md into skills and agents

Branch: `rebuild-skills`. Status: approved 2026-10-31, not started. The rules themselves
are in `docs/RULES.md`; the decisions behind them in `docs/DESIGN.md`. This file holds
the split: where each rule lives, the conventions, and the steps.

## Goal

Every rule of `docs/RULES.md` lives in exactly one skill or agent card, and each actor
loads only what it needs. The main session, a coder, a reviewer, a researcher, a writer
and a planner each get a known, small load set.

## Decisions

- The always-on rules (RULES sections 1–4, the global rules 1–8 included) live in one
  `core` skill. A SessionStart hook injects it into every session. Every armory skill
  opens with "load `core`", so subagents get it too. `~/.claude/CLAUDE.md` shrinks to a
  pointer plus personal items outside armory.
- `init-project` writes the agent files per project, from templates.
- Five agents: `coder`, `reviewer`, `researcher`, `writer`, `planner` (read-only; drafts
  the design, the test design or an analysis of options).
- Eleven skills: `core`, `plan`, `delegate`, `code`, `implement`, `test`, `review`,
  `audit`, `research`, `browse`, `init-project`.
- When the split is complete, `docs/archive/` (old skills, agents, old design) is
  deleted, and `docs/RULES.md` moves to `docs/archive/RULES.md` as the pre-split record.
- Version bump to 0.2.0 at the end.

## Map: where each rule lives

| Home | RULES sections | Loaded by |
|---|---|---|
| `core` | 1, 2, 3, 4; the one-line Fable MUST of 23 | the hook at session start; every armory skill, so every actor |
| `plan` | 5 (push back), 6 | main session (`/plan`); `planner`, drafting part only |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` | 17 (branch, plan-file commit, push and merge guard), 18 (review loop, task end), 14 (handover gates), 7 (caveat writes) | main session (`/code`) |
| `implement` | 5 (before you write), 9, 10, 11, 12, 14 (per-commit gates), 17 (commit message) | coder; main session when it codes itself |
| `test` | 13 | coder, reviewer, planner, auditor |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher |
| `browse` | 8 | researcher; any subagent that browses |
| `init-project` | 21, 22; templates `AGENTS.md` and five agent cards | main session (`/init-project`) |
| agent cards | 16 (role rules, report format, default model row) | the spawn |

## Load graph

| Actor | Loads |
|---|---|
| main session, full task | `core` (hook), `plan`, `delegate`, `code` |
| coder | `core`, `implement`, `test` |
| reviewer | `core`, `review`, `implement`, `test` |
| auditor | `core`, `audit`, `review`, `test` |
| researcher | `core`, `research`, `browse` |
| planner | `core`, `plan`, `test` |
| writer | `core` |

The size of a load set is the sum of the `max-lines` fields of its skills.

The reviewer judges code against `implement`, so `review` holds no coding rule.

## Conventions

- One rule, one home. Every other skill references it by skill name and section
  title, never by number.
- Each skill opens with the RFC 2119 line and "Load `core` first when it is not in
  context". A file that loads another skill names both forms (`/review`,
  `/armory:review`).
- Size targets in lines: the `max-lines` field in the frontmatter of each skill holds
  its target. The `lint` gate checks it.
- `plan` has two marked parts: leading (plan mode, quizzes, approval: main session
  only) and drafting (the planner's part).
- Agent card: frontmatter `name`, `description`, `model`, `effort`; `coder` adds
  `isolation: worktree`. A role card of 25 lines or fewer loads its skills by name and
  holds only role rules.
- Hooks: `hooks/hooks.json`; SessionStart and SubagentStart both run one script that
  prints the body of `skills/core/SKILL.md`.
- Models per step follow RULES section 23: skill writing on Opus (merging and rewording
  need judgment), the coverage check by the reviewer on Opus high, the spike on Haiku.

## Steps

One commit per step. Each step names its end state.

0. Spike. Done when a note in this file says whether a subagent sees `CLAUDE.md`,
   `AGENTS.md` and the SessionStart hook output. This decides whether a brief must
   repeat `core`.
   Result (2026-10-31): a custom subagent loads `~/.claude/CLAUDE.md`, the project
   `AGENTS.md` and `CLAUDE.md` (verified: a Haiku subagent quoted both). The built-in
   Explore and Plan agents and any agent with `omitClaudeMd` do not. SessionStart hook
   output is not documented to reach subagents; a `SubagentStart` hook injects
   `additionalContext` into a subagent, matched by agent type
   (code.claude.com/docs/en/hooks.md). Plugin hooks live in `hooks/hooks.json`, with
   the `settings.json` hook shape; plain stdout of a SessionStart hook is added to the
   context. Agent frontmatter supports `model`, `effort`, `isolation: worktree`,
   `skills` and `omitClaudeMd` (code.claude.com/docs/en/sub-agents.md).
   Decision: the plugin injects `core` through both a SessionStart and a SubagentStart
   hook. The "load `core` when it is not in context" line stays in each skill as the
   fallback for the plain install. A brief never repeats `core`.
1. Commit the pending RULES.md fixes. Done when the working tree is clean.
2. This plan file. Done when it is committed.
3. `core` and the hook. Done when `claude plugin validate .` passes and a new session
   shows the core rules in context.
4. The ten other skills, written by parallel Opus writer agents, one per skill, each
   with its RULES sections, the map and the conventions. No two agents touch one file.
   Done when each skill exists, is under its size target and references others by
   title only.
5. The five agent templates and the `AGENTS.md` template; `init-project` finished.
   Done when `/init-project` in an empty folder writes `AGENTS.md` and five agent
   files, and the agents show in the Agent tool list.
6. Coverage check. A reviewer agent maps every RULES.md bullet to exactly one skill
   location. Done when the map has no gap and no duplicate.
7. Consistency check of the skill set, per actor load set, with the method used on
   RULES.md. Done when the findings are fixed or recorded.
8. Cleanup. Delete `docs/archive/`; move `docs/RULES.md` to `docs/archive/RULES.md`;
   DESIGN gets the map and the decisions; README updated; version 0.2.0. Done when no
   file outside `docs/archive/RULES.md` holds a rule twice.
9. Dogfood. `/init-project` on this repo rebuilds the root `AGENTS.md` and
   `.claude/agents`; `/plan` and `/code` on a toy task; `/review` on the last commit;
   `/audit` on `tools/agent-browser`. Done when each run prints the format its skill
   defines.
10. Finish question: push, PR, or stop.

## Out of scope

- Changes to `tools/agent-browser`.
- New rules. A gap found during the split goes into RULES.md first, then into its skill.

## Risks

- A subagent may not see the hook output (step 0 decides the fallback).
- Parallel writers may word one shared concept two ways; step 6 catches it.
- The reviewer load set is the largest; if it grows past 500 lines, `implement` splits
  its readability and domain parts into a smaller shared skill.

## Amendment 1 (2026-10-31): skill size check, the toy task of step 9

Approved in plan mode. The amendment adds BR-1, BR-2 and TR-1 to TR-8 to this task.

### Goal

Guard skill growth from the current sizes. Each commit of this repo fails `lint` when a
skill is over its target. Each target lives in one home: the skill's own frontmatter.

### Requirements

- BR-1: MUST fail the `lint` gate when a skill in `skills/` grows past its size target.
- BR-2: MUST keep each size target in one home, the `max-lines: <n>` field in the
  skill's frontmatter.

### Plan items, in execution order

- TR-1 (BR-1): `node scripts/skill-sizes.mjs` MUST print one line per `<dir>/*/SKILL.md`
  on stdout, `<name>: <lines>/<max>`, sorted by name; `<lines>` counts newlines as
  `wc -l` does. It MUST exit 0 when every skill is at or under its max.
  tests: all_under_max_exits_0; prints_one_line_per_skill_sorted; skill_at_exact_max_passes;
  counts_lines_like_wc_without_trailing_newline
- TR-2 (BR-1): a skill over its max MUST cause exit 1, with one stderr line per such
  skill that names it.
  tests: one_over_by_one_exits_1_and_names_it; two_over_names_both;
  over_skill_still_prints_stdout_line
- TR-3 (BR-1, BR-2): a skill with no `max-lines` in its leading `---` block, or a value
  that is not a positive integer (`/^[1-9]\d*$/`), MUST cause exit 1 and be named on
  stderr.
  tests: missing_field_exits_1_named; value_abc_exits_1_named; value_1_5_exits_1_named;
  value_0_exits_1_named; value_negative_exits_1_named;
  field_only_in_body_counts_as_missing; no_frontmatter_exits_1_named
- TR-4 (BR-1): the skills dir MUST be `skills/` under the cwd, or the first argument.
  tests: default_dir_from_cwd; first_argument_dir_used
- TR-5 (BR-1): two or more arguments MUST cause exit 2 with the usage line on stderr. A
  dir that is missing, unreadable, or holds no `*/SKILL.md` MUST cause exit 1 with one
  stderr line that names it.
  tests: two_args_exits_2_prints_usage; missing_dir_exits_1_names_it; empty_dir_exits_1
- TR-6 (BR-2), Sonnet row (trivial change): add `max-lines` to the frontmatter of the
  eleven `skills/<name>/SKILL.md`: audit 75, browse 60, code 115, core 100,
  delegate 140, implement 155, init-project 100, plan 130, research 60, review 130,
  test 130.
  tests: none, the `lint` gate runs the script on the real skills after TR-7
- TR-7 (BR-1), Sonnet row: the `lint` line of `AGENTS.md` `## Commands` MUST end with
  `&& node scripts/skill-sizes.mjs`.
  tests: none, wiring; a passing `lint` run proves it
- TR-8 (BR-2), Sonnet row: the "Size targets in lines" item of
  `docs/plans/rebuild-skills.md` section Conventions MUST point to the `max-lines`
  field and list no numbers.
  tests: none, prose
- TR-9 (BR-1), defect of TR-1 found in the final review: the script MUST check a skill
  whose `<dir>/<name>/SKILL.md` exists through a symlinked `<name>`, and MUST exit 1
  with one stderr line that names the path when a `SKILL.md` cannot be read. Before
  this, both cases were skipped and `lint` passed.
  tests: symlinked_skill_dir_is_checked; unreadable_skill_md_exits_1_named;
  dangling_skill_md_link_exits_1_named
- TR-10 (BR-2), Sonnet row, from the recorded-items quiz of the final review: the plan
  and `docs/DESIGN.md` MUST hold no second home for skill sizes. The Conventions line
  "`core` and `delegate` ... may exceed 100 lines" goes away; the "About" column of
  both Load graph tables points to the `max-lines` field instead of line totals.
  tests: none, prose

Test file: `tools/agent-browser/test/unit/skill-sizes.test.ts`, in the style of
`tools/agent-browser/test/unit/bump-version.test.ts`: fixtures in a `mkdtempSync` dir,
the script run with `execFileSync`, each case marked `// req: rebuild-skills/TR-n`.

### Test scope

None. No existing test breaks, changes or goes away.

### Risks

- `claude plugin validate .claude-plugin/plugin.json` may reject the unknown frontmatter
  key `max-lines`. The `lint` run after TR-6 shows it. If it fails: stop, quiz.

### Stack choices

Node ESM `.mjs`, `node:fs` and `node:path` only, no dependency; the frontmatter is read
with a line regex inside the leading `---` block, as `bump-version.mjs` reads its file.

### Out of scope

Any change to skill text; the Docker test image (it lacks `scripts/` and `skills/`, so
`bump-version.test.ts` and this test run only outside Docker); `vitest.config.ts`.

### Accepted tech debt

- The script stays outside the coverage threshold, like `bump-version.mjs`: v8 cannot
  measure a child process, and `vitest.config.ts` covers `src/**` only. The unit gate
  still runs its tests.
- The frontmatter read finds `max-lines: <n>` only on its own line (TR-3 tests this).

### Overrides

None.

### Gates

lint, owasp, unit, integration, coverage: all on.

### Verification

- `npm --prefix tools/agent-browser run test:unit` passes with the new cases.
- The `lint` command of `AGENTS.md` passes on the real skills and fails when one skill
  gets one line over its `max-lines`.
- Review by the reviewer agent per `code` section Review loop.

## Amendment 2 (2026-10-31): the five Must fix items of the `/audit` dogfood run

Approved through the recorded-items quiz of the final review of Amendment 1. The user
chose "fix as amendment" for the audit's Must fix 1 to 5 on `tools/agent-browser`.

### Goal

`agent-browser` gives a correct result or a usage error for every call. No call crashes
the daemon, and no valid call fails because of the idle cycle.

### Requirements

- BR-3: `agent-browser` MUST give a correct result or a usage error for every call,
  without a daemon crash or a false failure.

### Plan items, in execution order

- TR-11 (BR-3): `renderResults` in `src/search.ts` MUST keep percent escapes that a
  result URL already holds (`Caf%C3%A9` stays as is), and MUST still encode spaces,
  `(` and `)`.
  tests: already_encoded_url_is_kept; parentheses_are_encoded
- TR-12 (BR-3): `idleMinutes` above 35791 (the `setTimeout` limit, 2^31-1 ms) MUST be
  rejected by `CHECKS.idleMinutes` in `src/config.ts` like the other config checks.
  tests: idle_minutes_above_timeout_limit_is_rejected
- TR-14 (BR-3): `search` with an empty query MUST exit 2 with a usage error from
  `src/args.ts`, before any daemon contact.
  tests: empty_search_query_is_usage_error
- TR-13 (BR-3): a malformed request target (`GET http://[ HTTP/1.1`) MUST get 400 from
  `src/server.ts` and MUST NOT end the daemon.
  tests: malformed_target_gets_400_daemon_stays_up
- TR-15 (BR-3): after the idle shutdown starts, `/read` and `/search` MUST answer 503;
  the CLI (`src/commands.ts`) MUST then wait for the daemon to go, start it again and
  retry once.
  tests: read_during_shutdown_gets_503; cli_retries_once_after_503

TR-14 runs before TR-13 so that the two `server.ts` items (TR-13, TR-15) run last, in
one coder.

### Test scope

None expected. A coder that finds an existing case must change stops and reports.

### Risks

- Docker was down at approval time; the user starts it. Until it runs, the
  `integration` and `coverage` gates are reported as not run.

### Stack choices

No new dependency. TR-11 uses `new URL(url).href`, then replaces `(` and `)`.

### Out of scope

The audit's Should fix 6 to 12 (follow-up, below).

### Accepted tech debt

None.

### Overrides

None.

### Gates

lint, owasp, unit, integration, coverage: all on.

## Follow-ups recorded by the quiz (2026-10-31)

- Audit Should fix 6 to 12 on `tools/agent-browser` (the audit report of the `/audit`
  dogfood run): a later task.
- The Docker test image has no `scripts/` or `skills/`, so `bump-version.test.ts` and
  `skill-sizes.test.ts` fail under the `coverage` command: a later task.
- `lint` type-checks `tools/agent-browser/src` only: a later task widens the include.
- `scripts/core-context.sh` has no test and a 3-line comment: a later task.
- Ignored: the changed plan prose has no gate (the project has no prose gate by design).
- From the reviews of Amendment 2, all Should fix, a later task: `search.ts` guards
  `new URL(url)` with `URL.canParse` (one bad href must not fail the whole search) and
  fixes the stale comment; `skill-sizes.test.ts` covers the `catch` of `hasSkillFile`
  (an unreadable skill dir) and a plain file in `skills/`; `config.test.ts` pins the
  accepted bound 35791; `commands.test.ts` makes the 503 fake keep answering `/status`
  for a few polls so the wait before the retry is proven.
- Ignored: a shutdown from SIGINT, SIGTERM or a closed headed window does not set the
  shutting-down flag; a call in that short window still gets 500 (BR-3 gap outside
  TR-15).

## Step 9 result: dogfood notes applied to the skills

The runs of `/plan`, `/code`, `/review` and `/audit` on this task produced these notes,
all applied in one writer commit (the user chose "apply all"): the worktree base check
(the Agent tool cuts a worktree from the default branch, not the task branch); a gate
status for an `on` gate that cannot run in the environment; execution order across
executors; a brief never claims `core` is in context; a slot for the re-review result;
the marker scan ignores prose and code blocks in docs; one coder result may hold one
commit per requirement; a changed prose file that no gate covers is not a finding; where
the reviewer runs the gates when HEAD moved past the range or the range lacks a file
the gate calls; the coder report always carries both report slots.
