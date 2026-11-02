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
- The skill set has twelve skills: `core`, `plan`, `delegate`, `code`, `implement`,
  `test`, `debug`, `review`, `audit`, `research`, `retro` and `setup`. The skills other
  than `core` hold the workflows.
- The project agents are six: `coder`, `debugger`, `reviewer`, `researcher`, `writer`
  and `planner`. The plugin ships their templates, not agent files; `setup` writes the
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
- `## Glossary`: `Term : one-line meaning`, with an optional
  `. Avoid: <synonyms>`; domain terms only.
- `## Caveats`: the caveat line of `core` section Reports.
- `## Rules`: project-only rules, and always the line `Documentation lives in <folder>`
  (`setup` section Write).

## 4. Where each rule lives

RULES sections are the sections of `docs/archive/RULES.md`.

| Home | RULES sections | Loaded by |
|---|---|---|
| `core` | 1, 2, 3, 4; the one-line Fable MUST of 23 | the hook or the pointer; every armory skill, so every actor |
| `plan` + templates `strategic.md`, `milestone.md`, `task.md` | 5 (push back), 6 | main session; `planner`, drafting part only |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` + template `pr.md` | 17 (branch, plan-file commit, push and merge guard), 18 (review loop, task end), 14 (handover gates), 7 (caveat writes) | main session |
| `implement` | 5 (before you write), 9, 10, 11, 12, 14 (per-commit gates), 17 (commit message) | coder, debugger; main session when it codes itself |
| `test` | 13 | coder, debugger, reviewer, planner, auditor |
| `debug` | none (new) | debugger; main session when it debugs itself |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher |
| `retro` | none (new) | main session, when the user starts it (user-only) |
| `setup` | 21, 22; templates `AGENTS.md` and six agent cards | main session, when the user starts it (user-only) |
| agent cards | 16 (role rules, report format, default model row) | the spawn |

| Actor | Loads |
|---|---|
| main session, full task | `core` (the hook or the pointer), `plan`, `delegate`, `code` |
| coder | `core`, `implement`, `test` |
| debugger | `core`, `debug`, `implement`, `test` |
| reviewer | `core`, `review`, `implement`, `test` |
| auditor | `core`, `audit`, `review`, `test` |
| researcher | `core`, `research`, `browse` (agent-browser plugin) |
| planner | `core`, `plan`, `test` |
| writer | `core` |

The size of a load set is the sum of the `max-lines` fields of its skills.

The skills are the truth; the plan files under `docs/plans/` hold the execution records.

## 5. Planning levels

Planning has three horizons: strategic, milestone and task. One `plan` skill covers all
three, with one template per doc.

The rules: `plan` section Levels; the done write: `code` section Task end.

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
- 2026-11-02: section Planning levels holds one paragraph and a pointer at `plan`
  section Levels, no table, so the levels table has one home. Dropped: the table plus a
  pointer.
- 2026-11-02: adopt seven rule edits from mattpocock/skills
  (<https://github.com/mattpocock/skills>, commit 4ae2317, MIT) as milestone
  `adopt-mp-rules`: quiz rounds ordered by prerequisites, with facts looked up and not
  asked; glossary work during the quiz; a test for when a decision earns a line; one
  test, then its code; vertical slices and expand–contract; the deletion test; six
  Fowler smells. Dropped: its `research`, `to-spec`, `implement`, `implement-spec`,
  `triage` and `wayfinder` skills (armory covers them); `mocking.md`; `handoff`;
  `wait-what`; `teach`, `prototype`, `wizard`, `to-questionnaire` and the misc and
  in-progress skills; the two-axis review in separate subagents; grilling in plain text
  instead of the question tool.
- 2026-11-02: adopt six more items from mattpocock/skills in two milestones:
  small-rules (a PR body template in `code` section Finish, churn-first reading in
  `audit` section Map first, project rules for writing skills, `setup` as a
  user-only skill) and new-skills (a `debug` skill that owns diagnosis while
  `implement` keeps the fix rules; a user-only `retro` skill that lists findings and
  changes nothing). Dropped: the guard hook that blocks a push and a commit on
  `<base>` (the prose guard held in every run, and a host script must still let an
  approved push through); `retro` as a step of `code` section Task end.
- 2026-11-02: a user-only skill keeps the Claude Code key
  `disable-model-invocation: true`, and its description says that the model must not
  load it on its own; other hosts read only that text. Dropped: a new host term with a
  fallback in `core` section Host terms.

## 7. Milestones

Format: `<name> : <one-line goal> : <status>`; the status values are in `plan`
section Levels. The milestone doc is `docs/milestones/<name>.md`.

- plan-levels : the three planning levels in `plan`, the three doc templates, the done
  write in `code` : done
- adopt-mp-rules : seven rule edits from mattpocock/skills in `plan`, `test`, `review`
  and the glossary format : done
- small-rules : a PR body template, churn-first audit reading, rules for writing
  skills, `setup` as a user-only skill : done
- new-skills : the `debug` and `retro` skills : done
- retro-fixes : the five follow-ups of the 2026-11-02 retro: a flow walk in `plan`
  self-review, a line-width check and a skill-list check, a plugin-lag caveat, gates
  per commit in the agent cards : done
- lean-reports : one fact per caveat line, a worktree for each parallel coder,
  subagent reports cut to the card's items : open

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
