# Plan: retro-skill

Parent: `docs/milestones/new-skills.md` section Tasks, line `retro-skill`.

## Goal

The `retro` skill, adapted from mattpocock `retro` (commit 4ae2317, MIT), lands as a
user-only skill. The main session runs it on the current session and lists ranked
findings: what to change in the project or in armory so that later sessions go better.
It changes no file. Quiz on 2026-11-02: severity High, Medium or Low; each finding
names the session step where the miss cost something; after the list, one question
asks which findings to turn into a task. This is the last task of the milestone.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill or doc; these surfaces have no test
level, so lint and the review check them`.

- TR-1 (section 1 read rule replaced by TR-4, section 4 done line by TR-3)
  (new-skills/BR-8, new-skills/BR-9, new-skills/BR-11, new-skills/BR-12): a new
  `skills/retro/SKILL.md` MUST open like `setup` (frontmatter `name`, `description`,
  `disable-model-invocation: true`, `max-lines` at the line count plus 5; the RFC 2119
  line; the `core` load line), with the description `User-only: the model MUST NOT
  load this skill on its own; it MUST ask the user to start it instead. Retrospective
  on the current session: ranked findings on what to change in the project or in
  armory so that later sessions go better. Changes no file. Use for "/retro", "run a
  retro".` It MUST hold these numbered sections, in this order, each rule with one RFC
  2119 word and each step with a done condition an agent can check:
  1. Scope: the main session runs it on the current session only. It MUST change no
     file: it MUST NOT edit, commit or spawn a coder, and MUST list the change
     instead. It reads the session and the files the session touched.
  2. Finding classes, each with a "use when" trigger:
     - Navigation and information access: a fact the session took long to find, or
       could not reach. The change: a pointer in the project context or a doc, or
       read access (logs, a tool).
     - Checks and review rules: a mistake that got past a gate or the reviewer. A
       mechanical miss (a fixed pattern, a banned call, a file place) gets a check: a
       lint rule, a gate or a hook. A judgement miss gets a review rule (`review`, or
       the project context `## Rules`). The actor SHOULD read the project's gates
       first, so an existing check that is off or broken is the finding.
     - Context size and no-op lines: a line of the project context, the global
       context or a skill that changed no behavior, or that belongs in a check or a
       review rule.
     - Tool economy: a costly tool call or spawn that a cheaper call, model row or
       tool could replace.
     Done when each class was checked against the session.
  3. Findings: each MUST name its class; its severity (High: the miss gave a wrong
     result, or would again; Medium: it cost a round, a retry or a re-review; Low: it
     cost only tokens or time); its target, the project or armory; the file to change
     (for armory, the skill file and section); the change; and the evidence, the step
     of this session where the miss cost something. The list MUST be ranked High
     first. Done when each finding has every field.
  4. After the list: the main session MUST ask the user, through the question tool,
     which findings to turn into a task (multi-select). It MUST NOT start the task
     itself; it MUST name each chosen finding as a task to plan instead. Done when the
     user answered.
  In the same commit, every skill list MUST name `retro`: `docs/DESIGN.md` section 1
  (the skill-set line, "twelve skills"), section 4 (a Home row `` `retro` `` : `none
  (new)` : `main session, when the user starts it (user-only)`), this repo's
  `AGENTS.md` section What this is, the `README.md` Skills table (a row in the form of
  the others), and the three `description` strings of `.claude-plugin/plugin.json` and
  `.claude-plugin/marketplace.json`.
  tests: none (see above)
- TR-2 (new-skills/BR-11, new-skills/BR-12): `lint` and `unit` MUST pass on every
  commit. After TR-1, a grep for `eleven` in `skills/`, `docs/DESIGN.md`, `README.md`,
  `AGENTS.md` and `.claude-plugin/` MUST show no stale count, and every skill list
  there MUST name `retro`.
  tests: none (see above)
- TR-3 (one-finding sentence replaced by TR-5) (new-skills/BR-9): `retro` section 4 MUST
  hold, after the question bullets: `- No
  finding: MUST say so and skip the question. One finding: MUST ask yes or no. More than
  four: MUST split them into questions of 2–4 options, up to four questions per call
  (\`core\` section Writing and questions).` Its done line MUST read `- Done when the
  user answered, or no finding exists.` Defect in built code, review finding 1: the
  question broke the `core` option limit.
  tests: none (see above)
- TR-4 (new-skills/BR-8): `retro` section 1, "MUST read the session and the files the
  session touched." MUST read `MUST read the session, and each touched file that a
  finding's evidence needs.`, and its done line MUST read `- Done when the steps of the
  session are read, and each file a finding's evidence needs.` Review finding 2, the
  user chose to fix it now.
  tests: none (see above)
- TR-5 (new-skills/BR-9): in `retro` section 4, "One finding: MUST ask yes or no." MUST
  read `One finding: MUST ask yes or no, single-select.` Re-review finding 1: a
  multi-select yes or no lets the user tick both.
  tests: none (see above)

Backslashes before backticks are escapes only. Wrap at about 88 characters, two-space
continuation, as each file does. One commit for TR-1; TR-2 holds no commit of its own.
The new prose MUST follow the four writing rules of this repo's `AGENTS.md` `## Rules`
and `core` section Writing and questions.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: the tests under `scripts/` use temporary fixtures, not the real skill files.

## Risks

- On Claude Code, `disable-model-invocation: true` hides `retro` from the model; only
  the user's `/armory:retro` loads it (the `setup` caveat holds for it too).
- `retro` reads only the current session; a long session that was compacted gives it
  only the summary.

## Stack choices

None.

## Out of scope

- The source's `writing-for-agents` load, its `CODING_STANDARDS.md` and its session
  log search (milestone Scope).
- `retro` as a step of `code` section Task end (dropped on 2026-11-02).

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` five commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`09bb202`); not a design rule, recorded for the user's approval.

## Caveats

None.
