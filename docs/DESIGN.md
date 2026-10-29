# agent-armory design

Status: six skills built 2026-10-29, not yet used on a project. This is the only
design document. Fix it when the skills disagree with it.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY in this document and in every
file of this repo follow RFC 2119.

## 1. Goal

One repo for personal Claude Code skills and tools. Phase 1 is skills only.

The skills replace the workflow rules that today live in project `CLAUDE.md` files
(`local-rag`, `maihem-cli`) and in the ponytail plugin. Always-on rules stay in
`~/.claude/CLAUDE.md` (writing style, no `nohup`, the `browse` skill for the web, YAGNI, DRY, SSOT,
big design up front, no premature optimization, Occam). Skills hold the workflows.
Each project holds its own facts in `AGENTS.md` (section 5).

Sources merged:

| Source | What we take |
|---|---|
| `~/.claude/CLAUDE.md` | nothing moves; the `AGENTS.md` template repeats rules 1, 2, 4–8 as base rules for projects whose global file lacks them, plus the user's question rule (base rule 8) |
| `local-rag/CLAUDE.md` | TDD rules, test-scope rule, branch rule, per-surface test rule, Caveats section |
| ponytail `SKILL.md` | the ladder, "before you write", user-impact check, debt marker, never-cut list |
| ponytail-review | order of importance, finding format, check-before-report |
| ponytail-audit | map, look-for list, finding format |
| ponytail-debt | the ledger scan, row format, `no-trigger` tag |
| ub-mode | every bullet of Work → Right → Practice except the tool names: data shape first, do first what helps every phase, outcome-oriented execution, attack the premise, build the lever, glossary, boundary and type discipline, idempotent operations, one writer, root causes, refactoring (pin, change, prove), log, small commits, worktree cleanup |
| maihem-cli | the diff is the truth; a defect gets a new requirement id; research findings go to Caveats; `AGENTS.md` as the project file |
| user | RFC 2119 rule strength, gates, worktrees, lint and OWASP, test levels, model table, atomic commits, `tech-debt:` marker, readability ("code like a poem"), model routing: Fable only for the plan and what Opus cannot carry, an executor tag per plan item, Opus leads implementation, Sonnet or Haiku for mechanics |
| Fowler, [Unit Test](https://martinfowler.com/bliki/UnitTest.html) | the unit is the team's choice; sociable by default, doubles only for awkward collaborators; compile suite and commit suite; speed as the reason to run often |
| Vocke, [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) | pyramid shape, narrow integration tests, contract tests, acceptance tests from the user's view, few end-to-end tests, push tests down and avoid duplication, test public behavior not structure, no tests for trivial code, arrange-act-assert, one condition per test, DAMP over DRY in tests, terms are the project's choice |

Dropped on purpose: ponytail levels (lite/full/ultra), "the shortest working diff wins",
ponytail-debt as a skill, its custom marker word, `git blame` owner and persist-to-file,
ponytail-gain, ub-mode tool names (crapper, dryer, mutator) and "push to the main line"
(the branch rule replaces it), the SOLID list (covered by the ladder and boundary
discipline). The "Opus sub-agents" rule becomes the per-project model table.

## 2. Rule strength

Every rule in a skill, a brief, a requirement or an `AGENTS.md` carries one RFC 2119 word.
Descriptive steps (how to read, what to trace) carry none.

| Word | Meaning here | Who can change it |
|---|---|---|
| MUST / MUST NOT | always; no project setting turns it off | nobody |
| SHOULD / SHOULD NOT | on by default; a project turns it off in `AGENTS.md` `## Gates` with a reason | the user, per project |
| MAY | optional; the agent decides | the agent |

The meaning is stated once, in the `AGENTS.md` template. Every SHOULD rule has a gate.
The skills MUST NOT use "always", "never", "try to" or "consider" where an RFC 2119 word
fits. Every file declares the five words with one fixed line.

## 3. Layout

```
agent-armory/
  .claude-plugin/
    marketplace.json          # marketplace "agent-armory", one plugin "armory", source ./
    plugin.json               # name, version, description; skills auto-found in skills/
  skills/
    plan/SKILL.md
    code/SKILL.md
    review/SKILL.md
    audit/SKILL.md
    test/SKILL.md
    browse/SKILL.md           # how agents use agent-browser (section 7.7)
    init-project/
      SKILL.md
      templates/AGENTS.md
      templates/agents/coder.md
      templates/agents/reviewer.md
      templates/agents/researcher.md
      templates/agents/writer.md
  docs/
    DESIGN.md                 # this file
    agent-browser.md          # user docs of the tool
    plans/                    # approved plans, one per task branch
  tools/
    agent-browser/            # phase 2: the browser CLI and its daemon (section 7.7)
  README.md                   # install, the skills and the tools as tables, notes
  LICENSE
```

`skills/` is the source of truth. The plugin manifest only wraps it.

Install, two ways:

- Plugin: `/plugin marketplace add <path-or-github>` then `/plugin install armory@agent-armory`.
  Skills appear as `armory:code`, `armory:review`, `armory:audit`, `armory:init-project`,
  `armory:browse`.
- Plain: one symlink per skill into `~/.claude/skills/`.

A file that loads another skill names both forms (`/review`, or `/armory:review`).
No hooks in phase 1. Skills trigger by description or by `/name`.

## 4. Models

One table, shipped in `templates/AGENTS.md` under `## Models`. The project copy is the
truth for that project; the user edits it there. Skills MUST pick the model, effort and
agent from the project table, not from this file.

| Task kind | Model | Effort | Agent |
|---|---|---|---|
| Pre-work: research, requirement quizzes, the plan; tasks Opus cannot carry (architecture, data risk, non-trivial RCA, core conflicts) | fable | high | researcher, tag `[fable]` |
| Coding (TDD implementation) | opus | low | coder |
| Deep research | opus | medium | researcher |
| Code review, audit | opus | medium | reviewer |
| Mechanics: docs, test runs, i18n strings, formatting, routine edits per a ready spec or tests | sonnet or haiku | low | writer; coder with tag |
| Routine lookup, grep, file reads | sonnet | low | none (built-in Explore) |

- The template states the Fable rule: Fable only for the first row, that is the plan and
  the items the plan tags `[fable]`. The table binds the session model too: a skill that
  runs on another model than its row names says so in one line and delegates to the
  row's agent. No agent file in the project: a general agent with the row's model and
  effort.
- Executor tags. The `plan` skill tags every item `[opus]` (default), `[sonnet]`,
  `[haiku]` or `[fable]`; a tag other than `[opus]` carries a one-line why; `[fable]`
  needs a reason from the first row. On a spawn the tag is the Agent tool's `model` and
  overrides the agent file. The agent files carry `model` and `effort` of their untagged
  row; Claude Code applies them.
- Phases. Pre-work (research, both quizzes, the plan) runs on Fable (`plan` skill); for
  a task the user marks trivial in the workflow question it MAY run on Opus. On
  "implement", Opus leads: the session on `/model opus` or the `coder` agent. Fable returns only for `[fable]` items or for an
  item where the coder reports `stuck: <why>`; after that item the work returns to Opus.
  Never "just in case".

## 5. The project file: `AGENTS.md`

Claude Code reads `AGENTS.md` in place of `CLAUDE.md` from v2.1.277. Below that
version a `CLAUDE.md` with the one line `@AGENTS.md` is needed. `init-project` writes
`AGENTS.md` only; the README and the `init-project` report carry the version note.

Sections, written by `init-project`, read by the other skills:

| Section | Content | Who reads it |
|---|---|---|
| `# <name>` + `## What this is` | one paragraph; the RFC 2119 meaning line (section 2) | all |
| `## Commands` | one line per check, same names as the gates: `lint`, `owasp` (dependency and OWASP scan), `unit`, `integration`, `contract`, `functional`, `e2e`, `coverage`; plus `run`, which is not a gate. A level the project does not have has no line and its gate is `off`. The `coverage` command MUST fail below the threshold set in the build tools (default 90% per core module); the skills hold no number. | `code`, `review`, `audit` |
| `## Test levels` | one line per test level, what it covers in this project. The template prefills the article's definitions (section 7.6, item 2); the project edits them. The unit style line: `sociable` (default) or `solitary`. The surface rule: each surface has at least one test level (frontend `unit` or `e2e`; backend `unit` or `integration`; CLI and library `unit`). | `code`, `review`, `audit`, `test` |
| `## Gates` | one line per SHOULD gate: `on` or `off <reason>`. Gates: `worktree-per-agent`, `delegate`, `lint`, `owasp`, `unit`, `integration`, `contract`, `functional`, `e2e`, `coverage`. The first two have no command. Default `on`, except the flexible test levels `contract`, `functional` and `e2e`: default `off (not chosen)` until the project turns them on. | `code`, `review`, `audit` |
| `## Models` | the table from section 4 | `code`, `review`, `audit` |
| `## Rules` | first the base rules (below) when the global file lacks them, then project rules: documentation MUST live in the docs folder (default `docs/`, only the README at the root), requirements in `<docs>/requirements/<task-branch>.md` and plans in `<docs>/plans/<task-branch>.md`, then the project-only MUST/SHOULD lines the user gave; workflows live in the armory skills | all |
| `## Glossary` | domain terms, `Term : one-line meaning` | `code` |
| `## Caveats` | research findings, format `SHORT_DESCRIPTION : file_reference.md` | all |

An `on` gate with no command is a finding for `review` and `audit`, not a silent skip.

Base rules. The template holds them in RFC 2119 form. `init-project` writes them into
`## Rules` when `~/.claude/CLAUDE.md` does not hold the same rule in any wording, so the
project file works on a machine or agent without that global file:

1. Replies and documentation MUST be "80% of the way to ASD-STE100": short sentences
   (about 20 words max), one idea per sentence, active voice, present tense, one
   approved meaning per word, no idioms, no filler. Keep natural phrasing and domain
   terms where strict STE would read awkwardly.
2. Background tasks MUST start through the tools (`run_in_background=true`), MUST NOT
   start with `nohup` or `command &`: such tasks cannot be tracked or stopped.
3. YAGNI: MUST NOT design or implement anything that was not requested.
4. DRY + SSOT: each fact, rule or piece of logic MUST live in exactly one place;
   everywhere else references it.
5. Big design up front: the design MUST be complete and refined before implementation
   starts.
6. MUST NOT optimize without a measured problem.
7. Occam's razor: SHOULD prefer the solution built from the smallest set of elements.
8. Questions to the user MUST go through the `AskUserQuestion` tool: at least 2 options, the
   recommended one first. The message text holds only the context, not the question.

## 6. Writing rules for every skill

- "80% ASD-STE100": short sentences, one idea each, active voice, present tense.
- RFC 2119 words in capitals (section 2).
- Frontmatter: `name`, `description` (what it does, when to use, the trigger words).
- Imperative voice to the agent. No persona prose.
- Each rule appears in exactly one file. Other files reference it by skill name and
  section. A skill that needs another skill's text loads that skill first.
- Target size: `code` under 220 lines, `review` under 130, `audit` under 120,
  `test` under 150, `plan` under 150, `init-project` under 70.

## 7. Skills

### 7.1 `code`

Trigger: any coding task: write, add, fix, refactor, choose a dependency. `/code`.

1. **Start.** MUST `git fetch origin`, take the base branch from `origin/HEAD`, and
   `git switch -c <task-branch> <base>`. MUST NOT commit to the base branch. MUST read
   `AGENTS.md`. MUST read the plan: the file at `<docs>/plans/<task-branch>.md`, else
   the plan approved in plan mode in this conversation; its tagged items are the task.
   No plan: MUST run the `plan` skill first (section 7.5); it asks the mode. In mode
   `none` the code skill writes the requirements itself as `TR-n [opus]: MUST
   <behavior>`, every item tagged. Each
   requirement gets its tests, every test name starts with its id (`test_tr3_...`);
   the report lists the requirements. A vague request gets the smallest version
   that does the core job. Implementation runs on Opus (section 4, phases): when the
   session model is not Opus, say so and delegate; MUST NOT write code on Fable.
2. **Understand first.** MUST read the code the task touches and list every place the
   change reaches: callers, tests, fixtures, config, exports; every item is part of the
   change. MUST check what the change could break for users: data destroyed or exposed,
   callers that stop working. Data shape before logic; do first what helps every later
   phase; aim at a checkable end state, a planned and undoable break is allowed. Bug fix:
   MUST grep every caller and fix the root cause once; a guard that hides the crash is
   not a fix. MUST NOT bolt a requirement onto the old design. Two fixes sharing one
   premise fail the same check: MUST write the premise down and remove it first. Work
   not obvious at a glance: one unit by hand, then build the tool. SHOULD keep domain
   terms in `## Glossary`.
3. **The ladder.** Take the first rung that fully works: does it need to exist;
   already in this codebase; standard library or platform; installed dependency; one
   line a reader gets at a glance; else the minimum that works. Subtract before you add.
4. **TDD.** MUST load the `test` skill before writing or changing tests; its rules
   apply. Tests are the only proof. Requirement → test → code. The failing test comes
   first; see it fail for the expected reason; make the smallest change that passes.
   Each requirement and each bug finding MUST have at least one test; each edge case it
   touches and each failure path MUST have its own test. Tests MUST call the code the way its user does and check what that user sees. A test
   that still passes when every function returns nothing MUST be deleted. If an honest
   test is impractical, MUST NOT write a bad one; say so. Bug report or own finding: a
   test that reproduces it MUST come before the fix. Refactor: MUST pin the behavior with
   a passing test, change the structure, show the same test passes. A defect in built
   code, or a requirement that changes during work, gets a new `BR-n` or `TR-n`; an old
   id MUST NOT be rewritten or renumbered; the plan amendment goes through the `plan`
   skill's review and approval (7.5, steps 7–9) before the work continues. Every
   feature MUST ship with its tests unless the user says otherwise for that feature.
5. **Gates.** A gate has the command of the same name in `## Commands` (section 5):
   `lint`, `owasp`, `unit`, `integration`, `contract`, `functional`, `e2e`, `coverage`.
   Per commit: `lint` and `unit`, when `on`, MUST pass. Before handover: every `on` gate
   MUST pass or the report names the failing one. `owasp` is defined in `review`
   section 2. An `on` gate with no command is a finding.
6. **Test scope.** Before a change, MUST list the existing tests it will break or
   remove, with the reason. MUST change only listed tests. A failing test outside the
   list is most likely a new bug: stop, find the root cause, report with proof. Then
   either add it to the scope (expected) or escalate to the user (not expected).
7. **Delegation.** `delegate` gate: the main session SHOULD NOT write production or
   test code itself; coding goes to the agent that the `## Models` `Agent` column names
   (section 8), or to a general agent with the row's model and effort when the project
   has no agent files. The brief MUST hold: the requirements with ids, the
   test-scope list, the `## Commands`, `## Gates`, `## Rules` and `## Caveats` lines
   that apply, and the rules of this skill in short. The item's tag is the model of the
   spawn and overrides the agent file; `[fable]` only for tagged items or a coder
   `stuck:` report, then back to Opus. `worktree-per-agent` gate: two or
   more coders at once SHOULD each run in their own worktree (the `coder` agent carries
   `isolation: worktree`); two agents that run at once MUST NOT edit the same file. When
   a coder finishes: MUST merge its worktree branch into the task branch, run `lint` and
   `unit`, remove the merged worktree; uncommitted work in a worktree waits for the
   user. Keep the main thread small.
8. **Make it right.** MUST check data where it enters; inside, trust it. Business logic
   in pure functions. MUST make illegal values impossible to write; parse outside data
   once; MUST NOT silence the compiler. Operations MUST be idempotent. Shared mutable
   state MUST have one writer, enforced by structure. Moved code MUST keep its error
   handling and validation.
9. **Rules.** MUST NOT add an abstraction, wrapper, option, config or "for later" code
   nobody asked for. MUST keep the structure the codebase has; clear local code stays.
   Readability per `review` section 3, item 7 applies to every line written.
   Comment only the why, in one line. A shortcut with a known limit MUST carry
   `tech-debt: <the limit>, <when to upgrade>`. MUST NOT cut: validation at trust
   boundaries, error handling that prevents data loss, security, accessibility, hardware
   calibration, anything the user asked for. Between options of equal size, MUST take
   the one correct on edge cases.
10. **Research.** You may have outdated information. MUST check at least 4 independent
    sources (`agent-browser`, the `browse` skill) per claim about a library, API, model or tool; prefer
    official documentation; note dates; say when sources disagree. Anything worth
    noticing goes under `## Caveats` in `AGENTS.md`. This section is the single home
    of the research rule; the `researcher` agent loads it.
11. **Commits.** One requirement or one fix per commit, `lint` and `unit` (when `on`)
    green. Subject: one imperative sentence under 72 characters that says what was done,
    so `git log --oneline` reads as the task history. Body MAY hold one line on why and
    the proving test. MUST NOT push.
12. **Finish.** One small unit at a time. Before the report, SHOULD run the `reviewer`
    agent on `<base>..HEAD` (`delegate` off: run `review` yourself) and fix the Must fix
    findings. The review MUST show every `BR-n` and `TR-n` of the requirements document
    met by the diff or a test. A requirement that needs the user's answer: quiz, adjust
    the requirements and the plan through `plan` steps 7–9, then continue. Acceptance:
    a quiz asks which items the user wants to try by hand, with the exact commands or
    clicks for each. Report: requirements with ids and their status, the log of actions
    and reasons, gate results, what you skipped, what you did not check, any risk.

### 7.2 `review`

Trigger: "review this", "review the PR", "review the last commit", `/review`. Reads
the connected code, not only the diff. Lists findings, changes no code.

1. **Understand first.** MUST compare the session model with the `Code review, audit`
   row and delegate to `reviewer` when it differs. Target: what the user names, else
   uncommitted changes, else the last commit. MUST read the diff, then callers of every
   changed function, the functions it calls, the tests, `AGENTS.md`. Find the expected
   load and say which you assumed.
2. **The diff is the truth.** MUST check the commit messages or work summary against
   the diff. MUST run every `on` gate with its command; an `on` gate with no command is
   a finding. The `owasp` gate is defined here: run the `owasp` command, then read the
   changed code against the OWASP Top 10. Stray files are a finding. Each requirement
   `BR-n` and `TR-n` in `<docs>/requirements/<task-branch>.md`, or `TR-n` the task names:
   the diff or a check MUST show it is met; a `TR` with no `BR` is a finding (scope
   creep). A changed behavior
   with no test that fails without it is a finding (section 3, item 4); so is a
   requirement, bug fix, edge case or failure path with no test of its own. Tests changed
   outside the declared scope are a finding. When the diff touches tests, MUST load the
   `test` skill and apply its review checks (section 7.6, item 7). On a re-review, check
   each earlier finding.
3. **Look for**, in order of importance: bug (including callers that disagree with a
   return value, the same rule applied differently in two places), risk, scale, missing
   test, speed, lean (delete, reuse, stdlib, yagni, merge, split by job and MUST NOT by
   line count or into helpers that only shorten a function), readability (names MUST say
   what they hold or do; lines SHOULD stay under 120–140 characters, long signatures
   one argument per line; high-level code SHOULD be one short function over clear
   helpers; SHOULD prefer chaining, one call per line, unless it hurts readability; the
   code reads like a poem). This list is the single home of the seven classes; `code`
   section 9 and `audit` point to it.
4. **Check before you report.** Every finding MUST have a concrete case. Re-read the
   lines. A `tech-debt:` comment that names its limit is a decision, not a finding,
   unless the load already crosses it. Propose the smallest fix. No style taste.
5. **Output.** `What this change does:`; `Gates:` one line per gate (pass, fail, off,
   no command); groups Must fix, Should fix, Nice to have, numbered across groups; each
   finding with What this is, Problem, Fix, If we skip it; end with `Verdict:`, `Lean:`
   when lean findings exist, `Not checked:`. Nothing found: `Looks good. Ship.` and one
   line on what you checked.

### 7.3 `audit`

Trigger: "audit this codebase", "review the whole repo", "find bloat", `/audit`.
One-shot report, changes nothing. MUST load the `review` skill first; its sections 3
and 4 apply to the whole tree. MUST load the `test` skill when the tree has tests; its
review checks apply to the test suite as a whole (pyramid shape, duplication across
levels).

1. **Map first.** MUST compare the session model with the `Code review, audit` row and
   delegate to `reviewer` when it differs. Scope: what the user names, else the whole
   repo. MUST read README, `AGENTS.md`, build and deploy config, dependencies, entry
   points, tests. Find the expected load. Trace the main flows end to end. Big repo: go
   deep where a mistake costs most; say what you did not read.
2. **Look for.** The six classes from `review` section 3, on the whole tree. When the
   `owasp` gate is `on`: run its command on the whole tree and the Top 10 reading on
   entry points and data writes. Before calling code unused, MUST grep the tree
   including tests, fixtures, config and string references.
3. **Tech debt.** `git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:'`.
   One row per hit, grouped by file: file:line, what was simplified, limit, upgrade
   trigger. A marker without a trigger gets `no-trigger`. End with `<N> items, <M> with
   no trigger.`
4. **Check before you report.** `review` section 4.
5. **Output.** `What this repo does:` and the assumed load. The three groups as in
   `review`, at most 20 findings, say how many you left out. Then the Tech debt section.
   End: `Verdict:`, `Lean: -<N> lines, -<M> dependencies possible.`, `Not checked:`.

### 7.4 `init-project`

Trigger: "init project", "set up AGENTS.md", "new project setup", `/init-project`.

1. Ask, in one question set: name (default the folder name), one paragraph on what
   the project is, the docs folder (default `docs/`); the surfaces (frontend, backend,
   CLI, library); the commands per check; which flexible test levels (`contract`,
   `functional`, `e2e`) are on; changes to the `## Test levels` lines and the unit
   style; the other gates that are off, with reasons; project-only rules; changes to the
   model table.
2. Check the answers: a gate without a command MUST be `off <reason>`; the surface rule
   MUST hold; the `coverage` command MUST carry a fail-under setting, else ask or set the
   gate off.
3. MUST write `AGENTS.md` from the template with the answers filled in (section 5).
   MUST read `~/.claude/CLAUDE.md` and keep a base rule only when that file does not
   hold the same rule in any wording. `## Glossary` and `## Caveats` start empty.
4. MUST write `.claude/agents/coder.md`, `reviewer.md`, `researcher.md`, `writer.md`
   from the templates, with `model` and `effort` from the row whose `Agent` column
   names the agent. Gate `worktree-per-agent` off: leave out `isolation: worktree`.
5. MUST NOT overwrite an existing file. Show what exists and stop, or add the missing
   sections when the user says so. Report the files written, the gates off, the base
   rules skipped, and the Claude Code version note.

### 7.5 `plan`

Trigger: a new task, "plan this", "make a plan", `/plan [none|min|full]`, and the `code`
skill when no plan exists. The pre-work phase: input → research (optional) → business
quiz → tech quiz → plan → review the plan → propose → approve → save. Runs on the Fable
row; for a trivial task it MAY run on Opus.

1. **Mode.** `$ARGUMENTS` when given, else the first question of every task through
   `AskUserQuestion`. `none`: no plan, trivial task; the code skill writes tagged `TR-n`
   items itself. `min`: Claude Code's plan mode as is; tech quiz and plan; the plan lives
   in the plan-mode file outside the repo, approved at the exit; after approval one
   question asks whether to save it to `<docs>/plans/`. `full`: research, both quizzes,
   plan review, approval, requirements and plan files. The answer holds for the task.
2. **Plan mode.** MUST enter plan mode (the planning tool) for steps 3–8. The plan text
   goes into the plan-mode file; in `min` that file is the plan. Repo files are written
   only after approval (step 9).
3. **Research** (full only, optional). Unknowns about a library, API, model or domain
   go to `researcher` or follow `code` section 10. Findings go to `## Caveats` at step 9.
4. **Business quiz** (full only). Gather as much as the user can give: goal, users,
   features, business rules, out of scope, constraints, done criteria. Several rounds
   until no open question remains. Every answer becomes a `BR-n: MUST <behavior>`
   statement in RFC 2119 form; a non-testable goal becomes a `BR` with the `TR`s that
   prove it.
5. **Tech quiz.** Stack, data, interfaces, constraints, test levels, risks, acceptance
   per feature. Every answer becomes a `TR-n (BR-m): MUST <behavior>`; each `TR` traces
   to a `BR`. In `min`, the task text stands in for the `BR`s.
6. **The plan.** The `TR`s in execution order, each with an executor tag, a `why:` line
   when the tag is not `[opus]`, and a `tests:` line (at least one; `test` skill rules).
   `[fable]` only with a reason from the first row. After the items: test-scope list,
   gates, risks, accepted tech debt.
7. **Review the plan.** Before proposing: every `BR` has at least one `TR`; every `TR`
   has tests with edge cases and failure paths; design issues under `code` sections 2
   and 8 (data shape, boundaries, idempotence, one writer, bolt-on); open questions.
   Any question goes to the user through a quiz, and the requirements and the plan are
   adjusted. Loop until nothing is open. An untagged item means not ready.
8. **Propose.** The plan goes through the planning tool's exit (approval gate). Reject
   opens a quiz: rework the plan (step 6), revisit tech requirements (step 5), revisit
   business requirements (step 4), or cancel. Drop back to the chosen step.
9. **Save and stop.** `full`, on approval: write `<docs>/requirements/<task-branch>.md`
   (`## Business`, `## Technical`) and `<docs>/plans/<task-branch>.md`; add Caveats.
   `min`: ask once whether to save the plan to `<docs>/plans/`; no requirements
   document. MUST NOT write code, tests or config. Report: the paths written, item count
   per tag, "On 'implement', run the `code` skill on Opus."

Amendments: a new or changed requirement during work gets a new id and re-enters at
step 7; the work continues after approval.

### 7.6 `test`

Trigger: "how should we test this", "write tests for", "test strategy", "test plan",
`/test`. Loaded by `code` section 4 before any test is written, by `review` section 2
when a diff touches tests, and by `audit` when the tree has tests. The single home of
every test rule; `code` section 4 keeps only the TDD loop and the per-requirement rule.

1. **The pyramid.** Write tests at different granularity. The higher the level, the
   fewer the tests: many `unit`, some `integration` and `functional`, very few `e2e`.
   MUST push a test to the lowest level that can prove the behavior. When a higher-level
   test finds a bug and no lower-level test fails, MUST write the lower-level test. A
   higher-level test that only repeats a lower-level one MUST be deleted.
2. **Levels.** The project's `## Test levels` lines are the truth; the template prefills
   these definitions, and the names are the project's choice (do not argue terms):
   - `unit`: one unit (a function, a class, or a small cluster the team treats as one),
     fast, run on every change. Frontend unit tests with the backend stubbed are `unit`.
   - `integration`: narrow, one integration point at a time (a real database, the file
     system, one separate service or its double), at the boundary of the service.
   - `contract`: consumer-driven contract tests for each interface with a separate
     service; the consumer writes the contract, the provider verifies it. Keeps the
     doubles in `integration` honest.
   - `functional`: acceptance from the user's view, black box, given/when/then, through
     the API or the UI, externals doubled.
   - `e2e`: the deployed stack through its user interface or API, the main user
     journeys only. Slow and flaky by nature: keep to the few that earn their place.
3. **Unit style.** Sociable by default: real collaborators. Test doubles only for
   awkward collaborators: remote services, non-determinism, slow or side-effecting
   resources. Stub queries; verify a call only when the call is the behavior. A project
   switches to `solitary` in `## Test levels`.
4. **What to test.** The public interface and observable behavior: given `x` and `y`,
   the result is `z`; MUST NOT assert the order of internal calls. MUST NOT test private
   methods or trivial code (a getter, a pass-through, no branch). Happy path, every edge
   case the requirement touches, every failure path (`code` section 4). One test module
   per production module as the rule of thumb.
5. **Structure.** Arrange, act, assert (given, when, then). One condition per test. The
   test name starts with the requirement id and states the behavior. Test code gets the
   same care as production code. DAMP: duplication in test code is allowed when it
   improves readability; extract a helper at the third repeat (Rule of Three). This is
   the one exception to base rule 4 (DRY), for test code only.
6. **Speed.** The `unit` suite runs after every change (the compile suite). `lint` and
   `unit` run per commit (the commit suite, `code` section 11). Slower levels run before
   handover. A test MUST be deterministic: no sleep-and-hope, no shared mutable state
   between tests, no dependence on order or on the clock.
7. **Review checks.** Each is a finding: a test at a higher level than the lowest that
   can prove the behavior; the same behavior tested at two levels; a test of trivial
   code or of a private method; a test coupled to structure (mock verification of call
   order, assertions on internals); a missing edge case or failure path for a changed
   requirement; a non-deterministic test; a double for a collaborator that is neither
   remote, slow, non-deterministic nor side-effecting (sociable projects); a contract
   with a separate service that has no `contract` test when the gate is `on`.

Dropped from the articles on purpose: speed budgets in numbers (Beck's ten minutes),
exploratory testing as a step, test ownership across teams, the tool list.

### 7.7 `browse`

Trigger: any web search, page read or source check; `/browse`. The single home of how an
agent uses `agent-browser` (`tools/agent-browser/`, the first phase-2 tool): the two
commands and their output, the exit codes (0 ok, 1 the work failed, 2 the call is wrong),
the daemon (the first call starts it, it exits after 10 idle minutes, MUST NOT stop it
between calls), cutting the output before it enters the context, and the install check.
The user docs `docs/agent-browser.md` hold the settings, the profile and the limits; the
skill does not repeat them. Global rule 3, `code` section 10 and the `researcher` agent
point here.

## 8. Agent templates

Each file: frontmatter plus a short role card. No `tools` field: the master session
decides what the agent may touch through the brief, and Claude Code gives the agent the
full tool set. No `skills` frontmatter field: its value would differ between the plugin
and the plain install, so the role card loads the skill by name instead. A role card
holds no rule that a skill or the brief already holds.

| Agent | Frontmatter | Role card |
|---|---|---|
| `coder` | `model`, `effort`, `isolation: worktree` | reads `AGENTS.md`; loads the `test` skill before writing tests; follows the brief in full (requirements, scope, commands, gates, rules); changes only listed tests; stops and reports `stuck: <why>` instead of guessing; does not push; reports its worktree branch, log, gate results, uncovered lines, risks |
| `reviewer` | `model`, `effort` | loads the `review` skill and follows it in full; changes no file |
| `researcher` | `model`, `effort` | loads the `code` skill and follows section 10; reports claim, sources with dates, one Caveats line; changes no file |
| `writer` | `model`, `effort` | follows base rule 1 (STE) from `AGENTS.md` or the global file; RFC 2119 words; SSOT; marks missing facts `TODO`; changes no code |

The `worktree-per-agent` gate is the `isolation: worktree` line in `coder.md`. Off:
`init-project` leaves the line out and `## Gates` says why.

## 9. What changes outside this repo

- `local-rag/CLAUDE.md` and `maihem-cli/CLAUDE.md`: after the skills work, run
  `init-project` there, move project-only rules to `## Rules`, keep Caveats, delete
  `CLAUDE.md`. Separate task per project.
- The ponytail plugin injects its rules at every session start. Disable it once
  `armory` is installed, so rules do not come twice.
- Claude Code MUST be v2.1.277 or later for `AGENTS.md` without `CLAUDE.md`. Today:
  2.1.274.
- `~/.claude/CLAUDE.md`: no change.

## 10. Verification

1. `claude plugin validate .` passes.
2. Install from the local path, start a session in `local-rag`, run `/armory:review`
   on the last commit and `/armory:audit` on one package. `review` prints the format of
   7.2 with a `Gates:` line; `audit` prints the format of 7.3 with a Tech debt section.
3. In an empty folder run `/armory:init-project`; `AGENTS.md` and the four agents
   appear with the model table; the agents show in the Agent tool list; a `coverage`
   command without a fail-under setting is refused.
4. One small coding task in `local-rag` through `/armory:code` ends with: a branch from
   `origin/HEAD`, requirements `TR-n` in the report and the test names, a
   failing-then-passing test, lint and unit green per commit, atomic commits that read
   as the task history, a `reviewer` run before the report.
5. A session on Fable given a coding task through `/armory:code` delegates to `coder`
   and says so. Two coders at once each get a worktree, and their branches land in the
   task branch.
6. `/armory:plan` on Fable asks the mode; `/armory:plan min` skips the question, runs the
   tech quiz, proposes in plan mode and asks once whether to save; `full` runs both
   quizzes, proposes in plan mode, and on approval writes `<docs>/requirements/<branch>.md` with `BR`/`TR`
   ids and `<docs>/plans/<branch>.md` with every item tagged and a `why:` on each
   non-`[opus]` item. A reject opens the fallback quiz. `/armory:code` on Opus reads the
   plan, runs `[sonnet]` items on Sonnet through `coder`, sends a `stuck:` item to
   `researcher` on Fable once, shows every `BR` and `TR` met in the final review, and
   ends with the acceptance quiz.
7. `/armory:test` on a module with a database call and a remote service proposes a
   sociable unit test, one narrow integration test with a real database, a double plus
   a contract test for the remote service, and no `e2e` test. `/armory:review` on a
   diff that adds an end-to-end test for a pure function flags it as a finding.

## 11. Dual-host notes (Codex)

Not built. The skills follow the agent-skills standard that Codex reads too, so the
`skills/` folder ports as is. `AGENTS.md` is Codex's native file. These are the edits
for the day the skills must also run in Codex:

1. Tool-neutral wording for base rule 2 (`run_in_background=true` is a Claude Code
   parameter), base rule 8 (`AskUserQuestion` is a Claude Code tool; Codex asks in
   chat), the plan mode and its exit as the approval gate in `plan` (Codex has no plan
   mode; a quiz approves) and the skill-loading lines (Codex invokes a skill as `$name`).
2. The global instructions file named per host: `~/.claude/CLAUDE.md` in Claude Code,
   `~/.codex/AGENTS.md` in Codex (init-project step 3, the writer card).
3. Agent templates: TOML twins under `.codex/agents/` (`name`, `description`,
   `developer_instructions`, `model`, `model_reasoning_effort`), or drop the agent files
   and keep the table only; the table is host-neutral.
4. The `worktree-per-agent` gate as an instruction fallback: Codex subagents inherit the
   parent sandbox and have no isolation field, so the main thread runs
   `git worktree add` and names the path in the brief. Codex does not enforce it.
5. The model table: GPT model ids in the Codex copy; `explorer` beside `Explore` in the
   "Routine lookup" row.
6. A Codex marketplace manifest next to `.claude-plugin/`. The plain install is one
   symlink per skill into `~/.agents/skills`.

Codex caps the combined `AGENTS.md` chain at 32 KiB; the template is about 6 KB.

## 12. Open

- The OWASP check has no fixed tool. `## Commands` `owasp:` names the project's one
  (`npm audit`, `pip-audit`, `cargo audit`). The Top 10 self-check is a reading step.
- Not verified on a real agent load: the frontmatter fields `effort` and `isolation`
  and the model alias `fable`. The sub-agents documentation lists all three.
- Phase 2 began with `agent-browser` (`tools/agent-browser/`, docs in `docs/agent-browser.md`) and the `browse` skill that wraps it for agents. Hooks are not designed.
