# agent-armory design

The skills under `skills/` are the single source of the rules. This file holds the
architecture: where each rule lives, how strong a rule is, the shape of the project
context, the planning levels, the dated decisions, the milestones and the open points.
What the project is: the project context `## What this is`. `docs/archive/RULES.md` is
the pre-split record; it is reference only.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Rule homes

- The always-on rules live in one `core` skill, the single source. The user's global rules
  are part of it.
- Two plugin hooks inject `core` into every session and every subagent
  (`hooks/hooks.json`, `scripts/core-context.sh`). The host caps hook output at 10,000
  characters; `scripts/core-context.test.mjs` guards it.
- Each skill opens with "load `core` when it is not in context"; this line is the
  fallback when neither hook nor pointer ran.
- `setup` installs the hook or writes the pointer into the project context; the
  user keeps personal items there.
- The skill set has fourteen skills: `core`, `plan`, `delegate`, `code`, `implement`,
  `test`, `debug`, `review`, `audit`, `research`, `retro`,
  `triage`, `dnd` and `setup`. The skills other than `core` hold the workflows.
- The project agents are six: `coder`, `debugger`, `reviewer`, `researcher`, `writer`
  and `planner`. The plugin ships their templates, not agent cards; `setup` writes the
  cards into each project.
- The agent cards a project holds are generated instances of the plugin templates,
  which are the single source.
- The project context (AGENTS.md) holds project facts and project-only rules (`setup`
  section Project context).
- The skills use host terms (`core` section Host terms) as host-neutral names.
- The `tracker` host term binds per project, in the project context `## Tracker`. With no
  binding, the docs fallback takes its place (`core` section Host terms).

## 2. Rule strength

Every rule carries one RFC 2119 word.

| Word | Meaning | Who can change it |
|---|---|---|
| MUST / MUST NOT | always | only the approved plan, for a design rule (`core` section Rule words) |
| SHOULD / SHOULD NOT | on by default | the agent, for one task, with a reasonable cause or after the user approves; the user rules on each bypass at task end (`code` section Task end) |
| MAY | optional | the agent |

## 3. The project context template

The template is `skills/setup/templates/AGENTS.md`. `setup` writes its sections into
AGENTS.md. Sections:

- `## What this is`: first; one paragraph on what the project is.
- `## Commands`: one line per check, with the same name as its gate.
- `## Gates`: `on`, or `off <reason>`. Gates: `lint`, `owasp`, `unit`, `integration`,
  `coverage`, and the flexible levels `contract`, `functional`, `e2e` (off until the
  project turns them on). No other rule has a project switch, except the `## Rules` line
  `auto-fix:` (`code` section Review loop).
- `## Test levels`: only what the project adds to or changes in the level lines of
  `test` section Levels, and the unit style (sociable or solitary).
- `## Tracker`: optional; one line per bound verb with its binding, then the
  `target:` line, the `closes by PR merge:` line and, with the label verbs bound, one
  `label <role>: <label>` line per `triage` role. Absent: the docs fallback holds
  what the tracker would hold (section Planning levels).
- `## Rules`: project-only rules, always the line `Documentation lives in <folder>`
  (`setup` section Write), and the template line `auto-fix: none` (`code` section
  Review loop).
- `## Glossary`: `Term : one-line meaning`, with an optional
  `. Avoid: <synonyms>`; domain terms only.
- `## Caveats`: the caveat line of `core` section Reports.

## 4. Where each rule lives

RULES sections are the sections of `docs/archive/RULES.md`.

| Home | RULES sections | Loaded by |
|---|---|---|
| `core` | 1, 2, 3, 4; the one-line Fable MUST of 23 | the hook or the pointer; every armory skill, so every actor |
| `plan` + templates `strategic.md`, `milestone.md`, `task.md` | 5 (push back), 6 | main session; `planner`, drafting part only |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` + template `pr.md` | 17 (branch, plan-file commit, push and merge guard), 18 (review loop, task end), 14 (handover gates), 7 (caveat writes) | main session |
| `implement` | 5 (before you write), 9, 10, 11, 12, 14 (per-commit gates), 17 (commit message) | coder, debugger; main session when it codes itself |
| `test` | 13 | coder, debugger, reviewer, planner |
| `debug` | none (new) | debugger; main session when it debugs itself |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher |
| `retro` | none (new) | main session, when the user starts it (user-only) |
| `triage` | none (new) | main session, when the user starts it (user-only) |
| `dnd` | none (new) | main session, when the user starts it (user-only) |
| `setup` | 21, 22; templates `AGENTS.md` and six card templates | main session, when the user starts it (user-only) |
| card templates | 16 (role rules, report format, default model row) | the spawn |

| Actor | Loads |
|---|---|
| main session, full task | `core` (the hook or the pointer), `plan`, `delegate`, `code` |
| main session, triage | `core` (the hook or the pointer), `triage` |
| main session, dnd | `core` (the hook or the pointer), `dnd`, `plan`, `delegate`, `code` |
| coder | `core`, `implement`, `test` |
| debugger | `core`, `debug`, `implement`, `test` |
| reviewer | `core`, `review`, `implement`, `test` |
| reviewer, audit brief | `core`, `audit`, `review`, `implement`, `test` |
| researcher | `core`, `research` |
| planner | `core`, `plan`, `implement`, `test` |
| writer | `core` |

The size of a load set is the sum of the `max-lines` fields of its skills.

The skills are the truth; the plan files under `docs/plans/` hold the execution records.

## 5. Planning levels

Planning has three horizons: strategic, milestone and task. One `plan` skill covers all
three, with one template per doc.

With a tracker bound, the milestone list, each milestone (scope and `BR` list), its
tasks and every status live in the tracker. The repo keeps this file's architecture and
decisions and the task plan files.

The rules and the claim: `plan` section Levels; the done write: `code`.

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
- 2026-11-02: web search and page reading use the host's own web tools, under the
  `research` rules; no live file names the `browse` skill. Dropped: a `web tool` host
  term; keeping the ban on the built-in web search.
- 2026-11-03: close the four open edge cases. Retry worktree: `delegate`
  section Re-spawn and retry already runs the retry in the first worktree. Main-session
  review: a review with no brief takes the range and checks of `code` section Review
  loop (`review` section Understand first). Writer commits: no review per result and no
  gate run of their own, by design; the whole-task checks of the final review cover
  them. Glossary: a main session that codes writes the term
  itself, by default. Dropped: a reviewer run on each writer result; a glossary rule
  for the main session.
- 2026-11-03: a bound tracker owns the milestone list, each milestone with its scope and
  `BR` list, the tasks with blocked-by edges, and all status; the repo keeps `DESIGN.md`
  architecture and decisions and the task plan files with `TR`; repo docs stay the
  fallback, and armory itself stays on them. Model: mattpocock/skills
  (<https://github.com/mattpocock/skills>, commit 4ae2317). Dropped: status only in the
  tracker; tasks and status only, with the milestone doc in the repo; a milestone list
  in `DESIGN.md` beside tracker status; a `BR` snapshot in the plan file; a triage flow;
  migration of existing milestone docs; armory on GitHub Issues.
- 2026-11-03: skills reach the tracker through abstract verbs of a `tracker` host term,
  bound in the project context `## Tracker`; `setup` probes the host's connections (MCP
  servers, CLIs) and asks the user when none fits. Only the main session writes to the
  tracker; the approved plan covers the writes it lists; every agent write carries an
  AI marker; an unreachable tracker stops the run. Dropped: a separate adapter file
  (mattpocock's `docs/agents/issue-tracker.md`); prose-only bindings; shipped seed
  bindings for GitHub or GitLab; a per-project write switch; a yes per write; writes
  from subagents; a queue of pending writes when the tracker is down.
- 2026-11-03: adopt a user-only `triage` skill on a bound tracker. It reverses the
  2026-11-02 drop of mattpocock's `triage`, the `tracker` milestone's Scope Out item
  "a triage flow and its labels", and the 2026-11-03 tracker decision's drop of a
  triage flow. Dropped: three of mattpocock's five states (ready-for-agent,
  ready-for-human, wontfix); the Agent Brief comment; `.out-of-scope/` files;
  reproduction during triage; PRs as a request surface; fixed label names; label
  creation in `setup`.
- 2026-11-05: subagent reports keep only needed items: an item the main session uses
  to spawn an agent, to plan or change the next work, or to put a decision to the user.
  Main-session replies follow the Shape, Lists and Flow rules of `core` section Writing
  and questions, adapted from ayghri/i-have-adhd (<https://github.com/ayghri/i-have-adhd>,
  MIT). Dropped: time estimates, wins and error tone from that source; reply rules for
  reports and briefs.
- 2026-11-05: `setup` serves Claude Code only, with host-neutral wording. Dropped: the
  session scope, the host profile, the model mapping and the other-host lines. The
  project context puts `## Glossary` and `## Caveats` last, because they change most
  often.
- 2026-11-05: the skills serve Claude Code only. Dropped: the host-capability fallbacks,
  the host profile and the user-only description text. The hook and its pointer
  fallback stay, and so does the `core` opener, because the hook passes only a 2 KB
  preview of `core`.
- 2026-11-06: `core` is trimmed under the 10,000-character hook cap (target 9,000 or
  less) by one tightening pass with garbage removal. Dropped by the user: moving the
  main-session rules to a second SessionStart file. A unit test guards the cap.
- 2026-11-06: `setup` keeps only the project; the global scope goes. Dropped: the
  `global` scope and its scope question.
- 2026-11-13: plan mode holds only the proposal. The quizzes, the research and the
  drafts run before it; on a reject, a fix beyond plan edits or a quiz round asks the
  user to leave plan mode. Dropped: plan mode from the level question, where each
  research call needed the user's yes.
- 2026-11-14: adopt a user-only `dnd` skill: one start question round, then each task
  of the session runs from `plan` to `code` Finish with no question to the user beyond
  what the start answers keep, and ends with an answers log. `core` section Rule words
  points to it. The Finish options are PR + merge, merge into `<base>`, open a PR and
  local only; each merge is a squash merge. A blocker stop adds a blocked-by edge, or
  sets `needs-info` with triage notes. Dropped: the names `auto`, `autopilot` and
  `vibe`; a scope of one task run; an auto-fix question; arguments to `/dnd`; a
  reviewer question in `dnd`; a `blocked` label (clashes with GitHub's native Blocked
  status); an `on-hold` triage state.

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
  subagent reports cut to the card's items and required returns : done
- tracker : a bound tracker owns milestones, tasks and status: the `tracker` term in
  `core`, its binding by `setup`, tracker paths in `plan`, `code` and `delegate`, and a
  dry run on a scratch GitHub repo : done

## 8. Open

No open item.
