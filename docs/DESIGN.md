# agent-armory design

Status: the split is done on branch `rebuild-skills`. The ten skills under `skills/`
are the single source of the rules. `docs/archive/RULES.md` is the pre-split record; it
is reference only. This file holds the decisions from the requirement quiz of
2026-10-30 and the review quiz of 2026-10-31, and the map of where each rule lives.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Sources

Processed in this order. Each later source adds to the earlier ones.

| Source | Where |
|---|---|
| Existing rules | `~/.claude/CLAUDE.md` rules 1–8 (they move to `core`, section 2), and the project `AGENTS.md` |
| ub-mode | <https://raw.githubusercontent.com/unclebob/ub-mode/refs/heads/master/SKILL.md> |
| ponytail | <https://github.com/dietrichgebert/ponytail>: `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt` |
| Archived armory skills | the old skills and agents, archived under `docs/archive/` during the rebuild and deleted after it; the items the user kept in the gap quiz went into `docs/archive/RULES.md` |

## 2. Rule homes

- The always-on rules live in one `core` skill, the single source. The global rules 1–8
  are part of it.
- A SessionStart hook and a SubagentStart hook of the plugin inject `core` into every
  session and every subagent (`hooks/hooks.json`, `scripts/core-context.sh`).
- The plain install has no hooks. Each skill opens with "load `core` when it is not in
  context"; this line is the fallback.
- `~/.claude/CLAUDE.md` shrinks to a pointer to `core`, plus personal items outside
  armory. This is to do by the user.
- `core` changes two of the old global rules. It merges KISS into Occam's razor
  (rule 8), and it states rule 1 with MUST.
- The skill set has ten skills: `core`, `plan`, `delegate`, `code`, `implement`,
  `test`, `review`, `audit`, `research` and `init-project`. The skills other
  than `core` hold the workflows.
- The project agents are five: `coder`, `reviewer`, `researcher`, `writer` and
  `planner`. The plugin ships their templates, not agent files; `init-project` writes
  the files into each project.
- The agent files a project holds are generated instances of the plugin templates,
  which are the single source.
- The project `AGENTS.md` holds project facts and project-only rules (`init-project`
  section Write).
- On 2026-10-31 the `browse` skill and the tool moved to the agent-browser plugin repo;
  `research` loads `/agent-browser:browse`.

## 3. Rule strength

Every rule carries one RFC 2119 word.

| Word | Meaning | Who can change it |
|---|---|---|
| MUST / MUST NOT | always | only the approved plan, for a design rule (`core` section Rule words) |
| SHOULD / SHOULD NOT | on by default | the agent, for one task, with a reasonable cause or after the user approves; the user rules on each bypass at task end (`code` section Task end) |
| MAY | optional | the agent |

## 4. The `AGENTS.md` template

Sections:

- `## What this is`: first; one paragraph on what the project is.
- `## Commands`: one line per check, with the same name as its gate.
- `## Gates`: `on`, or `off <reason>`. Gates: `lint`, `owasp`, `unit`, `integration`,
  `coverage`, and the flexible levels `contract`, `functional`, `e2e` (off until the
  project turns them on). No other rule has a project switch.
- `## Test levels`: only what the project adds to or changes in the level lines of
  `test` section Levels, and the unit style (sociable or solitary).
- `## Glossary`: `Term : one-line meaning`.
- `## Caveats`: `SHORT_DESCRIPTION : <file>`, or `SHORT_DESCRIPTION : —` when no file
  exists yet.
- `## Rules`: project-only rules. When the docs folder is not `docs/`, it holds the line
  `Documentation lives in <folder>` (`init-project` section Write).

Removed: the `## Models` table, the plan executor tags, and the separate requirements
file under `docs/`. One model table for all projects lives in `delegate` section Models
instead. The plan file `<docs>/plans/<task-branch>.md` stays; it holds the requirements
(`plan` section Plan file).

## 5. Where each rule lives

RULES sections are the sections of `docs/archive/RULES.md`.

| Home | RULES sections | Loaded by |
|---|---|---|
| `core` | 1, 2, 3, 4; the one-line Fable MUST of 23 | the hooks; every armory skill, so every actor |
| `plan` | 5 (push back), 6 | main session (`/plan`); `planner`, drafting part only |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` | 17 (branch, plan-file commit, push and merge guard), 18 (review loop, task end), 14 (handover gates), 7 (caveat writes) | main session (`/code`) |
| `implement` | 5 (before you write), 9, 10, 11, 12, 14 (per-commit gates), 17 (commit message) | coder; main session when it codes itself |
| `test` | 13 | coder, reviewer, planner, auditor |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher |
| `init-project` | 21, 22; templates `AGENTS.md` and five agent cards | main session (`/init-project`) |
| agent cards | 16 (role rules, report format, default model row) | the spawn |

| Actor | Loads |
|---|---|
| main session, full task | `core` (hook), `plan`, `delegate`, `code` |
| coder | `core`, `implement`, `test` |
| reviewer | `core`, `review`, `implement`, `test` |
| auditor | `core`, `audit`, `review`, `test` |
| researcher | `core`, `research`, `browse` (agent-browser plugin) |
| planner | `core`, `plan`, `test` |
| writer | `core` |

The size of a load set is the sum of the `max-lines` fields of its skills.

The skills are the truth; `docs/plans/rebuild-skills.md` holds the execution record.

## 6. Dropped

- ub-mode: the tools crapper, dryer and mutator and the ideas behind them (CRAP score,
  duplication rank, mutation testing); "push to the main line"; the Work → Right →
  Practice frame (the content is kept, grouped by topic).
- ponytail: the levels lite, full and ultra (only ultra's push-back rule is kept);
  `ponytail-gain`; the debt ledger as its own skill; a custom marker word; the
  `git blame` owner; saving the ledger to a file; "never split into helpers that exist
  only to make a function shorter"; "one small test" (TDD replaces it).
- Existing rules: the per-project models table (one shared table replaces it,
  `delegate` section Models), the plan executor tags, the separate requirements file
  (the plan file is back and holds the requirements, `plan` section Plan file), the
  base-rule copy in `AGENTS.md`, and the per-project switch that turned off any SHOULD
  rule (a per-task bypass replaces it, `core` section Rule words).
- Archived armory skills (`docs/archive/`): the plan levels none, min and full (every
  plan covers each topic when relevant); the session-model check in review and audit;
  the setup questions on the models table and the web rule; the per-project model table
  (the `{{MODEL}}` and `{{EFFORT}}` template fields are back as placeholders that setup
  fills from the default row per agent, `delegate` section Models); the plan item
  count per model; the separate rule "the unit suite runs after every change" (the
  per-commit `unit` gate covers it); "ask all setup questions at once" (rounds until no
  open point remains replace it).
- Quiz of 2026-10-30: the `worktree-per-agent` and `delegate` gates (now plain SHOULD
  rules, `delegate` section Delegation and worktrees); renaming of test levels (the
  names are fixed); the audit cap of 20 findings.

## 7. Open

Four edge cases from the last check:

- Retry worktree: a retry spawn with `isolation: worktree` gets a fresh worktree. The
  first worktree stays behind, and no rule cleans it up.
- Main-session review: a review that the main session runs inside a task has no brief.
  No rule says where it takes the commit range from.
- Writer commits: commits of the writer enter only the final review, not a review per
  commit.
- Glossary: no rule says how the glossary rule applies when the main session codes
  itself.
