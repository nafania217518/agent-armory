# agent-armory design

The skills under `skills/` are the single source of the rules. This file holds the
architecture: where each rule lives, how strong a rule is, the shape of the project
context, the planning levels, the dated decisions, the milestones and the open points.
What the project is: the project context `## What this is`. `docs/archive/RULES.md` is
the pre-split record; it is reference only.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Rule homes

- The always-on rules live in two skills, the single source: `core`, the rules for every
  actor, and `core-main`, the rules for the main session only. The user's global rules
  are part of them. The agent-only rules (report slots, timer, `stuck:`) sit in `core`
  for now, as an exception to the placement rule below.
- A build writes two hook payloads: the main payload (`core` plus `core-main`) and the
  agent payload (`core` alone). Two plugin hooks inject them (`hooks/hooks.json`): the
  main payload at session start, the agent payload at subagent start. The git commit of
  the payloads is a separate step.
- Only `core` and `core-main` hold a marker line, `armory-core <version>` and
  `armory-core-main <version>`, so each payload holds the marker of each skill it
  contains. A marker of any version counts as found.
- The host injects no hook output over 10,000 characters. The size check warns on a
  payload over 9,000 characters and on one over 10,000, marker lines included. For now
  both levels only warn; making them errors is a later step. This cap is the only size
  limit of `core` and `core-main`: `scripts/skill-sizes.mjs` exempts them from
  `metadata.max-lines`.
- A parent MUST be loaded with its child, lazily: a pointer
  ``Load `<parent>` before <when>`` loads it just before the step that needs it. A
  pointer to `core` or `core-main` loads it only when its marker is missing from
  context; it is the fallback when neither the hook nor the project-context pointer ran.
  For now each skill holds its own pointers; a later step makes the build write them
  from `metadata.extends`.
- The `core-main` skill opens with a disclaimer that its rules are for the main session
  only, and each of its section names carries a main-session-only tag. The build drops
  both from the main payload. The hook-fallback pointer loads both skills.
- `setup` writes the pointer into the project context when the hook probe fails; the
  user keeps personal items there.
- The skill set has twenty skills: `core`, `core-main`, `workflow`, `tracking`,
  `requirements`, `plan-draft`, `craft`, `plan`, `delegate`, `code`,
  `implement`, `test`, `debug`, `review`, `audit`, `research`, `retro`, `triage`, `dnd`
  and `setup`. The skills other than `core` and `core-main` hold the workflows.
- The migration map of `skill-architecture-redesign` extracts more abstract skills. Each
  task that adds one also adds it to each doc-checks skill list.
- The skills form a hierarchy, like code built by composition. A skill's frontmatter
  lists its parents in `metadata.extends`, explicitly, with no implicit root: `core` has
  none, `core-main` extends `core`, and each other skill lists `core` or `core-main` and
  any other parent. A skill MAY have several parents. The extends graph MUST be acyclic.
- `code`, `plan`, `setup` and `triage` extend `core-main`, since they cite its rules.
  `audit` extends `review`; `dnd` extends `plan` and `code`. `code` and `plan` extend
  `delegate` and not each other; `core-main` holds the hand-off between them.
- A rule goes to `core` only when every actor needs it, and to `core-main` only when
  every main-session run needs it.
- When two skills share rules, or cite each other, the shared part moves to an abstract
  skill that both extend, as a shared helper moves out of two modules.
  `metadata.type: abstract` marks it. An abstract skill has `user-invocable: false`,
  which hides it from the user's `/` menu; the model can still load it. Its description
  says "Abstract: load only through a skill that extends it". It is loaded only through
  a child's pointer; an agent card MUST NOT load one. Its name takes no prefix. Each
  skill carries `metadata.type`: `abstract`, `user-only` for a skill with
  `disable-model-invocation: true`, or `regular`.
- `workflow` and `tracking` are the abstract skills of the run mechanics that the
  main-session skills share. `tracking` holds the tracker verbs and write rules (the
  five main-only tracker sub-bullets of `core` included), the docs fallback, the docs
  and status homes, the `triage` roles and label lines, amendments and the business quiz
  topics. `workflow` extends `tracking` and holds the claim, branches, caveat-base
  writes, finish and the done write. `triage` extends `tracking`, not `workflow`, so a
  triage run loads no branch, caveat or finish rule. The plan templates, the `BR` and
  `TR` formats, the plan-doc section rules, the milestone check and the flow walk live
  in the abstract skill `requirements` instead, which `tracking`, `plan` and
  `plan-draft` extend: a skill that a card loads cannot have `tracking`, a child of
  `core-main`, as an ancestor.
- `plan-draft` is a concrete skill of the planner's drafting rules: the task check, the
  `tests:` case walk, the task-level flow walk and the drafting rules, on top of
  `requirements`. The `planner` card loads it, not `plan`. The parts it shares with
  `plan`, `implement` and `test` move to abstract skills; the definitions only the
  planner reads stay in it as plain text.
- `core-main` and each new concrete skill, `plan-draft` included, get 3 load eval cases
  and 1 skip eval case. An abstract skill gets none.
- A skill cites only its ancestors: the skills it extends, directly or through a parent.
  An agent card and a brief payload, ``brief loads `<skill>` ``, are exempt.
  A skill that needs none of another skill's rules and names it only as a command for the
  user or a home for a rule names it in plain text, as `core-main` §4 does. A user-only
  skill MUST NOT be a parent, since the host does not let the model load it; a skill
  names it in plain text instead.
- Each skill numbers its own sections; a rule reference takes the form
  `` `<skill>` §<n> ``, or `` `<skill>` §<n>.<m> `` for a `###` subsection.
- `lint` fails when a skill that an agent card loads has `core-main` as an ancestor.
- The graph tool is a Node script in `scripts/`. Its build writes the payloads. Its check
  runs by default and in `lint`. It draws the graph on demand, with `--mermaid` or
  `--html`. Its nodes are the skills and the agent cards; a card is a kind of its own,
  exempt from the hierarchy rules. An edge is each backticked skill name in a skill, its
  description included, not only a rule reference or a pointer. Each skill pair has one
  edge, labelled with its section set: `§3`, `§4` and `§6` make one edge.
- The graph check reports a skill whose pointers and `metadata.extends` differ, a cycle,
  a cite of a skill that is not an ancestor, a card that loads an abstract skill, and a
  rule reference by name or with no such heading. It reads the rule references of the
  skill templates too, with no other check. A `§` after a file path names a doc section
  and is not checked. A run with any report exits 1, so `lint` fails.
- The project agents are six: `coder`, `debugger`, `reviewer`, `researcher`, `writer`
  and `planner`. The plugin ships their templates, not agent cards; `setup`
  writes the cards into each project.
- The agent cards a project holds are generated instances of the plugin templates,
  which are the single source.
- The project context (AGENTS.md) holds project facts and project-only rules (`setup`
  section Project context).
- The skills use host terms (`core` section Host terms) as host-neutral names.
- The `tracker` host term binds per project, in the project context `## Tracker`. With no
  binding, the docs fallback takes its place (`tracking` §1).

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
| `core` | the parts of 1, 2, 3, 4 that every actor needs; the one-line Fable MUST of 23; the output-size rule: none (new) | the hook, in both payloads, or the pointer; a skill that finds its marker missing; so every actor |
| `core-main` | the main-session parts of 1, 2, 3, 4; the hand-off between `plan` and `code`: none (new) | the hook, in the main payload, or the pointer; a main-session skill that finds its marker missing |
| `plan` | 5 (push back); 6: the levels, the quiz rounds, the strategic check, the approval | main session |
| `workflow` + template `pr.md` | parts of 7 (caveat writes) and 17 (branch, push and merge guard, finish); the claim and the done write: none (new) | main session, through the pointer of a child skill |
| `tracking` | parts of 6 (docs and status homes, amendments, business quiz topics); the main-session tracker rules and the `triage` roles, label lines and notes form: none (new) | main session, through the pointer of `workflow` or `triage` |
| `requirements` + templates `strategic.md`, `milestone.md`, `task.md` | parts of 6 (`BR` and `TR` formats, plan-doc section rules, milestone check, flow walk, plan templates) | main session and planner, through the pointers of `tracking`, `plan` and `plan-draft` |
| `plan-draft` | 6 (drafting part: task check) | `planner` |
| `delegate` | 15, 16 (briefs, contracts), 23 (table, effort map, Fable question, re-spawn, retry), 17 (worktree merge) | main session, from `plan` and `code` |
| `code` | 18 (review loop, task end), 14 (handover gates) | main session |
| `implement` | 9, 10, 12, 14 (per-commit gates), 17 (commit message) | coder, debugger |
| `test` | 13, except the parts in `craft` | coder, debugger, reviewer, planner |
| `craft` | 5 (before you write), 11, parts of 13 (TDD, test scope, the benchmark row check); the data-growth path definition: none (new) | coder, debugger, reviewer, planner, through the pointers of `implement` and `test` |
| `debug` | none (new) | debugger |
| `review` | 19 | reviewer |
| `audit` | 20 | reviewer on an audit brief |
| `research` | 7 | researcher; reviewer, through the pointer of `review`; main session, through the pointers of `plan`, `code` and `delegate` |
| `retro` | none (new) | main session, when the user starts it (user-only) |
| `triage` | none (new) | main session, when the user starts it (user-only) |
| `dnd` | none (new) | main session, when the user starts it (user-only) |
| `setup` | 21, 22; templates `AGENTS.md` and six card templates | main session, when the user starts it (user-only) |
| card templates | 16 (role rules, report format, default model row) | the spawn |

| Actor | Loads |
|---|---|
| main session, full task | `core`, `core-main` (the main payload or the pointer), `workflow`, `tracking`, `requirements`, `plan`, `delegate`, `code`, `research` |
| main session, triage | `core`, `core-main` (the main payload or the pointer), `tracking`, `requirements`, `triage` |
| main session, dnd | `core`, `core-main` (the main payload or the pointer), `workflow`, `tracking`, `dnd`, `requirements`, `plan`, `delegate`, `code`, `research` |
| coder | `core` (the agent payload), `implement`, `test`, `craft` |
| debugger | `core` (the agent payload), `debug`, `implement`, `test`, `craft` |
| reviewer | `core` (the agent payload), `review`, `implement`, `test`, `craft`, `research` |
| reviewer, audit brief | `core` (the agent payload), `audit`, `review`, `implement`, `test`, `craft`, `research` |
| researcher | `core` (the agent payload), `research` |
| planner | `core` (the agent payload), `plan-draft`, `requirements`, `implement`, `test`, `craft` |
| writer | `core` (the agent payload) |

A load set has two sizes, never added: its hook payload in characters, and the sum of the
`metadata.max-lines` fields of its other skills in lines.

The skills are the truth; the plan files under `docs/plans/` hold the execution records.

## 5. Planning levels

Planning has three horizons: strategic, milestone and task. One `plan` skill covers all
three; `requirements` holds one template per doc.

With a tracker bound, the milestone list, each milestone (scope and `BR` list), its
tasks and every status live in the tracker. The repo keeps this file's architecture and
decisions and the task plan files.

The rules: `plan` section Levels; the doc and status homes: `tracking`; the claim and
the done write: `workflow`.

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
- 2026-11-14: follow-ups for fix rounds and re-reviews, a fresh final review, briefs
  name project context sections, leaner reviewer-subagent reports. Dropped: a terse
  report register (research and an A/B test: small saving, reader risk); resuming the
  final review; a project-context probe in `setup`.
- 2026-11-14: plan-file diet, from 8 plan retros: the plan file holds only the template
  sections. Dropped: numbered test cases, a plan-lint check, quoting plan sections in
  briefs, dropped alternatives in Design. Milestone docs and items follow the same
  rules, without Done criteria and the Scope In list. Dropped: migrating the old
  milestone docs.
- 2026-11-14: agent reuse: follow-up work goes to the agent whose output is still
  open, until that output closes; a change by another actor to its files forces a fresh
  spawn. Dropped: reuse until task end, a fresh spawn on any new commit, a recorded
  bypass for word-for-word fixes, a fresh coder after a diagnose-only run.
- 2026-11-14: lean main session: the main session writes only through git steps, gate
  runs and scripts, and writes the plan-level docs, project context and `setup` files.
  It reads only agent reports, git and gate output, the templates it fills, `setup`
  reads and one claim check or lookup, its output cut to 20 lines. A task scribe takes
  the caveat topic-file writes. Dropped: a MAY for word-for-word fixes, the main session
  writing caveat topic files, reads as a SHOULD.
- 2026-11-15: skill simplification: 51 looser rules in every skill but `core`: one
  retry on Opus high, then ask; main gate runs only where no tip run exists; no
  `debug-<id>` branch; one recorded-items quiz; one `setup` consent question;
  plugin-only skills. Dropped: the kept-on-purpose variants, the Fable retry rung,
  a second quiz round.
- 2026-11-15: squire: one Sonnet-medium squire per session does every main-session
  file read and write outside git steps, gate runs, scripts, armory templates,
  `setup` runs and the plan-mode file; it writes only given text and makes no commit.
  It replaces the task scribe; the writer keeps prose. Dropped: a writer-card mode, a
  squire per task, squire commits, a SHOULD route.
- 2026-11-16: short reads: the main session itself does a short non-diff read that needs
  no judgment, since a squire round trip costs more than the read. Dropped: a line bound,
  grep and line-range reads only, small diffs.
- 2026-11-16: skill-owned file cases: a skill MAY add to the main session's
  read and write cases for its own run; the `setup` cases moved from `core` into `setup`.
- 2026-11-16: squire removed: main-session context holds decisions, intents and
  conclusions, not low-level text; given-text writes put the exact text into main
  context anyway, and each round cost about 60k tokens. Replaced by short reads, short
  in-context writes and file copies by the main session, claim checks by a researcher
  that returns a verdict, and other writes by intent to the writer or coder.
- 2026-11-16: broad agent reuse: new work for a writer, researcher or planner goes to an
  idle agent of that card already spawned in the session, to keep its knowledge, shorten
  briefs and keep main-session context lean. Coder, debugger and reviewer stay on
  follow-ups of their open output only (context bleed, debugger anchoring, worktree
  lifecycle, review independence). A fresh spawn replaces reuse on another model or
  effort, on staleness, and for work that judges the agent's own output (no self-judging),
  and after 4 minutes 30 seconds idle (the 5-minute subagent cache TTL; a resume after
  expiry re-writes the whole history). Follow-ups have no idle limit; the limit applies to
  new work only. A writer follow-up is only a change to its own text. Idle means no turn
  running; an open output does not block reuse. No context-window cap: current models have
  1M windows, so it never triggers. The writer gets its own worktree like the coder.
  Dropped: a 1h subagent cache TTL.
- 2026-11-16: card tool lists: each card gets a `tools:` line that lists only the tools
  it needs. Cards had no `tools:`, so every spawn got all tools: measured, an all-tools
  spawn starts at about 54k tokens and a two-tool spawn at about 14k. `Skill` stays on
  every list so the agent can load skills. The reviewer lists `ToolSearch` and
  `mcp__Claude_Browser__*` to reach browser tools. Dropped: turning off MCP servers,
  which is user config.
- 2026-11-16: rules audit fixes: recorded Should fix and Nice to have findings are
  restored; a stuck follow-up keeps the worktree; the wait-for-user rule on an
  uncommitted worktree is dropped; a diagnose-only branch is kept before a fix follow-up;
  a run resumes an existing task branch with its committed plan file; `research`
  delegates by card, not by `delegate` §Models row number; the task-end gates reuse a
  `lint` and `unit` run at the tip.
- 2026-11-16: the planner drafts every `TR` item, its `tests:` lines and the test-scope
  list, since a main-session draft needs searches that `core` §Tools and background tasks
  forbids. Dropped: a main session that drafts them itself.
- 2026-11-16: the main session writes the plan file itself: the approved plan is already
  in its context, and a writer spawn costs 19–28k tokens. It reverts the writer part of
  the squire-removal decision.
- 2026-11-16: `review` drops its "with no brief" clause, since a main-session review is
  banned. It reverts the main-session review part of the 2026-11-03 edge-case decision.
- 2026-11-18: the always-on rules split into two level-1 skills, `core` for every actor
  and `core-main` for the main session, each with its own section numbers and marker
  line (`armory-core <version>`, `armory-core-main <version>`; any version counts). A
  build writes two hook payloads, main (`core` plus `core-main`) and agent (`core`),
  capped at 10,000 characters (error) and 9,000 (warning), marker lines included; the
  cap replaces their `metadata.max-lines`. The skill set grows to fifteen, so each
  doc-checks skill list names `core-main`. The skills take three levels (level 1, shared,
  special), declared in frontmatter, with references only up; `core` cites no other
  skill. A graph tool in `scripts/` builds the payloads and checks the levels in
  `lint`. Load evals per special skill are deferred. Reason: the payload cap, and the
  main-session rules that reach every subagent through the hook. It reverts the
  2026-11-06 drop of a second SessionStart file for the main-session rules. Kept as
  options: an agent-only source or the agent cards as the home of the agent-only rules;
  the reference form only, with brief payloads in frontmatter. Dropped: a per-role agent
  core, a combined `core` skill built from two sources, one numbering with gaps for the
  main-only sections, a main-only section tag for lint.
- 2026-11-18: the skills form a hierarchy built like code, instead of levels. Each skill
  lists its parents in `metadata.extends`, with no implicit root; a skill may have
  several parents, the graph has no cycle, and a pointer loads each parent lazily, just
  before the step that needs it. A skill cites only its ancestors. A part that two
  skills share moves to an abstract skill (`metadata.type: abstract`,
  `user-invocable: false`, no evals) that both extend; no agent card loads one.
  `workflow` is the first abstract skill. `plan-draft` is a concrete skill that the
  `planner` card loads instead of `plan`. Only `core` and `core-main` keep a marker
  line. An edge is each backticked skill name in a skill, its description included. The
  skill set grows to seventeen. Every graph check only reports until the flip task.
  Both payload size levels only warn for now. It reverts the level part and the 10,000
  error of the decision above. Reason: the reference map holds 22 two-way pairs, `dnd`
  overlays `plan` and `code`, `audit` builds on `review`, and the `planner` card loads
  all of `plan`. Dropped: levels 1–3; a level 4 or an exemption for user-only skills;
  `dnd` rewritten by question kind; `audit` merged into `review`; a shared `findings`
  skill; two shared skills from the start; only rule references and pointers as edges;
  a card that loads one section or an abstract skill; drafting rules in the `planner`
  card; amending DESIGN.md on the milestone branch; markers in every skill; eager
  parent loading; a name prefix for abstract skills; an implicit `core` root; abstract
  skills with evals; a single parent per skill.
- 2026-11-19: the output-size rule moves from the abstract skill `output-budget` into
  `core` §3, and `output-budget` goes. A rule that every actor needs lives in `core`,
  not in an abstract skill. Reason: every actor runs commands and reads files, so both
  payloads carry the rule in about 215 characters, in place of a skill, four pointers
  and four card lines. Dropped: keep `output-budget` as an abstract skill (the
  2026-11-18 rule), and a new `core` section for the rule.

## 7. Milestones

Format: `<name> : <one-line goal> : <status>`; the status values are in `tracking`
§2.

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
- skill-architecture-redesign : split `core` into `core` and `core-main`, the two hook
  payloads, the marker lines, the skill hierarchy (`metadata.extends`, the abstract
  skills, `plan-draft`), the graph tool, a probe of whether SessionStart `compact`
  output survives the summary, and the release bump : open
- skill-adoption : adopt the drafts parked in `docs/adoption-drafts/` on branch
  `drafts-stash`, chosen in its milestone run and fitted to the skill levels : open

## 8. Open

No open item.
