# agent-armory design

The skills under `skills/` are the single source of the rules. This file holds the
architecture: where each rule lives, how strong a rule is, the shape of the project
context, the planning levels, the dated decisions, the milestones and the open points.
What the project is: the project context `## What this is`. `docs/archive/RULES.md` is
the pre-split record; it is reference only.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Rule homes

- The always-on rules live in one `core` skill, the single source. The global rules 1–8
  are part of it.
- On Claude Code, two plugin hooks inject `core` into every session and every subagent
  (`hooks/hooks.json`, `scripts/core-context.sh`). On other hosts, `setup` installs the
  host's hook or the pointer (`core` section Host terms).
- Each skill opens with "load `core` when it is not in context"; this line is the
  fallback when neither hook nor pointer ran.
- `setup` writes the pointer into the host's context for the chosen scope; the user
  keeps personal items there.
- The skill set has ten skills: `core`, `plan`, `delegate`, `code`, `implement`,
  `test`, `review`, `audit`, `research` and `setup`. The skills other than `core` hold
  the workflows.
- The project agents are five: `coder`, `reviewer`, `researcher`, `writer` and
  `planner`. The plugin ships their templates, not agent files; `setup` writes the
  files into each project.
- The agent files a project holds are generated instances of the plugin templates,
  which are the single source.
- The project context (AGENTS.md, CLAUDE.md or a rules file, where the host loads it)
  holds project facts and project-only rules (`setup` section Project context).
- The skills use host terms (`core` section Host terms), bound per host by the profile
  that `setup` writes.

## 2. Rule strength

Every rule carries one RFC 2119 word.

| Word | Meaning | Who can change it |
|---|---|---|
| MUST / MUST NOT | always | only the approved plan, for a design rule (`core` section Rule words) |
| SHOULD / SHOULD NOT | on by default | the agent, for one task, with a reasonable cause or after the user approves; the user rules on each bypass at task end (`code` section Task end) |
| MAY | optional | the agent |

## 3. The project context template

The template is `skills/setup/templates/AGENTS.md`. `setup` hands its sections to the
host, which writes them where it loads project context. Sections:

- `## What this is`: first; one paragraph on what the project is.
- `## Commands`: one line per check, with the same name as its gate.
- `## Gates`: `on`, or `off <reason>`. Gates: `lint`, `owasp`, `unit`, `integration`,
  `coverage`, and the flexible levels `contract`, `functional`, `e2e` (off until the
  project turns them on). No other rule has a project switch.
- `## Test levels`: only what the project adds to or changes in the level lines of
  `test` section Levels, and the unit style (sociable or solitary).
- `## Glossary`: `Term : one-line meaning`.
- `## Caveats`: the caveat line of `core` section Reports.
- `## Rules`: project-only rules, and always the line `Documentation lives in <folder>`
  (`setup` section Write).

## 4. Where each rule lives

RULES sections are the sections of `docs/archive/RULES.md`.

| Home | RULES sections | Loaded by |
|---|---|---|
| `core` | 1, 2, 3, 4; the one-line Fable MUST of 23 | the hook or the pointer; every armory skill, so every actor |
| `plan` | 5 (push back), 6 | main session; `planner`, drafting part only |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` | 17 (branch, plan-file commit, push and merge guard), 18 (review loop, task end), 14 (handover gates), 7 (caveat writes) | main session |
| `implement` | 5 (before you write), 9, 10, 11, 12, 14 (per-commit gates), 17 (commit message) | coder; main session when it codes itself |
| `test` | 13 | coder, reviewer, planner, auditor |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher |
| `setup` | 21, 22; templates `AGENTS.md` and five agent cards | main session |
| agent cards | 16 (role rules, report format, default model row) | the spawn |

| Actor | Loads |
|---|---|
| main session, full task | `core` (the hook or the pointer), `plan`, `delegate`, `code` |
| coder | `core`, `implement`, `test` |
| reviewer | `core`, `review`, `implement`, `test` |
| auditor | `core`, `audit`, `review`, `test` |
| researcher | `core`, `research`, `browse` (agent-browser plugin) |
| planner | `core`, `plan`, `test` |
| writer | `core` |

The size of a load set is the sum of the `max-lines` fields of its skills.

The skills are the truth; the plan files under `docs/plans/` hold the execution records.

## 5. Planning levels

Three horizons, one `plan` skill. The skill holds the shared flow (plan mode, quizzes,
research, approval, amendments, drafting) and one levels table; the three doc formats
are templates under the skill. The level comes from the argument, else from the first
question. The rules live in `plan` and `code` once milestone `plan-levels` lands; until
then this section is the only record.

| Level | Doc | Branch | Holds | Ids |
|---|---|---|---|---|
| strategic | `<docs>/DESIGN.md`, edited in place | `design-<topic>`, merged after approval | required: Decisions (dated, with dropped alternatives) and Milestones (name, one-line goal, status); the rest is free | none |
| milestone | `<docs>/milestones/<name>.md` | `milestone-<name>`, merged after approval | fixed: parent line, Goal, Scope in and out, Requirements (`BR` list), Tasks (ordered, branch names, status), Risks, Done criteria | `BR-n` |
| task | `<docs>/plans/<branch>.md` | the task branch | parent line, `TR` list with tests, test scope, overrides, accepted debt | `TR-n (<milestone>/BR-m)` |

- Chain: each doc names its parent in its first lines and references parent facts,
  never restates them. `DESIGN.md` is enough to start a milestone plan in a fresh
  session; a milestone doc is enough to start each of its task plans.
- Strategic planning stops at the milestone list and has no testable item. A milestone
  plan is a separate run.
- `BR` lives in the milestone doc. A one-off task with no milestone keeps its own `BR`
  list in the plan file.
- A task plan file always exists, also when the milestone doc leaves no open point
  (zero quiz rounds), because `code` and the `req:` markers depend on it.
- Status has one home per fact: milestone status only in `DESIGN.md`, task status only
  in the milestone doc. Values: open, done, dropped. The final commit on a task branch,
  before the merge question, marks the task done; when that task was the milestone's
  last open one, the same commit marks the milestone done. No commit on base.
- An amendment goes to the level that owns the fact. A task that finds a `BR` gap
  amends the milestone doc on its own task branch, after the user's yes. A milestone
  that finds an architecture gap re-enters plan mode at the strategic level on a design
  branch.

## 6. Decisions

One dated line per decision, with the dropped alternatives.

- 2026-10-30: rebuild the skills from four sources, in this order, each later source
  adding to the earlier ones: the existing rules (`~/.claude/CLAUDE.md` rules 1–8, now
  in `core`, and the project `AGENTS.md`); ub-mode
  (<https://raw.githubusercontent.com/unclebob/ub-mode/refs/heads/master/SKILL.md>);
  ponytail (<https://github.com/dietrichgebert/ponytail>: `ponytail`, `ponytail-review`,
  `ponytail-audit`, `ponytail-debt`); the archived armory skills (archived under
  `docs/archive/` during the rebuild, deleted after it; the items kept in the gap quiz
  went into `docs/archive/RULES.md`). Record: `docs/plans/rebuild-skills.md`.
- 2026-10-30: `core` merges KISS into Occam's razor (global rule 8) and states global
  rule 1 with MUST.
- 2026-10-30, from ub-mode: dropped the tools crapper, dryer and mutator and the ideas
  behind them (CRAP score, duplication rank, mutation testing); "push to the main
  line"; the Work → Right → Practice frame (the content is kept, grouped by topic).
- 2026-10-30, from ponytail: dropped the levels lite, full and ultra (only ultra's
  push-back rule is kept); `ponytail-gain`; the debt ledger as its own skill; a custom
  marker word; the `git blame` owner; saving the ledger to a file; "never split into
  helpers that exist only to make a function shorter"; "one small test" (TDD replaces
  it).
- 2026-10-30, from the existing rules: dropped the per-project models table (one shared
  table replaces it, `delegate` section Models), the plan executor tags, the separate
  requirements file (the plan file holds the requirements, `plan` section Plan file),
  the base-rule copy in `AGENTS.md`, and the per-project switch that turned off any
  SHOULD rule (a per-task bypass replaces it, `core` section Rule words). The project
  context lost the `## Models` table with them.
- 2026-10-30, from the archived armory skills: dropped the plan levels none, min and
  full (depth levels; every plan covers each topic when relevant); the session-model
  check in review and audit; the setup questions on the models table and the web rule;
  the per-project model table (the `{{MODEL}}` and `{{EFFORT}}` template fields are
  placeholders that setup fills from the default row per agent, `delegate` section
  Models); the plan item count per model; the separate rule "the unit suite runs after
  every change" (the per-commit `unit` gate covers it); "ask all setup questions at
  once" (rounds until no open point remains replace it).
- 2026-10-30, quiz: dropped the `worktree-per-agent` and `delegate` gates (now plain
  SHOULD rules, `delegate` section Delegation and worktrees); renaming of test levels
  (the names are fixed); the audit cap of 20 findings.
- 2026-10-31: the `browse` skill and the tool moved to the agent-browser plugin repo;
  `research` loads `/agent-browser:browse`.
- 2026-10-31: the skills use host terms (`core` section Host terms), bound per host by
  the profile that `setup` writes; `setup` replaces `init-project`. Record:
  `docs/plans/setup-skill.md`.
- 2026-11-02: three planning horizons, section Planning levels. These are horizon
  levels, not the depth levels dropped on 2026-10-30. Dropped: `BR` in the task plan
  once a milestone exists; git-only status with no status field; status for every
  level in one doc; three skills `design`, `milestone` and `plan`; the strategic edit on
  the first task branch; the milestone doc on the design branch or on the first task
  branch; a strategic run that continues into the first milestone; a fixed section set
  for `DESIGN.md` (only Decisions and Milestones are required); a free section set for
  the milestone doc; a status "in progress"; a milestone amendment on its own branch; a
  docs-only commit on base for the done write; a lazy done write at the next planning
  run.
- 2026-11-02: this file is reworked, not rewritten: the status line and Sources leave,
  Dropped and the dated lines become Decisions, the rule map and the context template
  stay as free sections. Dropped: add only; rewrite from scratch.

## 7. Milestones

Format: `<name> : <one-line goal> : <status>`; status is open, done or dropped. The
milestone doc is `docs/milestones/<name>.md`.

- plan-levels : the three planning levels in `plan`, the three doc templates, the done
  write in `code`, the milestones folder in `setup` : open

## 8. Open

Four edge cases from the last check:

- Retry worktree: a retry spawn with `isolation: worktree` gets a fresh worktree. The
  first worktree stays behind, and no rule cleans it up.
- Main-session review: a review that the main session runs inside a task has no brief.
  No rule says where it takes the commit range from.
- Writer commits: commits of the writer enter only the final review, not a review per
  commit.
- Glossary: no rule says how the glossary rule applies when the main session codes
  itself.
