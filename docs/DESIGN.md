# agent-armory design

Status: the skills of section 7 and the `agent-browser` tool are built, not yet used on a
project. This is the only
design document. `skills/` is the truth; this file holds the intent, the sources and
the decisions.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Goal

One repo for personal Claude Code skills and tools. Phase 1 is the skills; phase 2 adds
the tools, first `agent-browser` with the `browse` skill.

The skills replace the workflow rules that today live in project `CLAUDE.md` files
(`local-rag`, `maihem-cli`) and in the ponytail plugin. Always-on rules stay in
`~/.claude/CLAUDE.md` (writing style, no `nohup`, the `browse` skill for the web, YAGNI, DRY, SSOT,
big design up front, no premature optimization, Occam). Skills hold the workflows.
Each project holds its own facts in `AGENTS.md` (section 5).

Sources merged:

| Source | What we take |
|---|---|
| `~/.claude/CLAUDE.md` | nothing moves; the `AGENTS.md` template repeats rules 1–8 as base rules for projects whose global file lacks them (the web rule only when the user asks for it), plus the user's question rule; skills cite base rules by name, never by number |
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

The meaning is stated once, in the `AGENTS.md` template. Besides the named gates, a
project turns any SHOULD rule off by naming it in `## Gates`
(`<skill> section <n>: off <reason>`). The skills MUST NOT use "always", "never", "try
to" or "consider" where an RFC 2119 word fits. Every skill and agent card opens with one
fixed line: "The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119."

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
    research/SKILL.md         # the research rule (section 7.8)
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
  Skills appear as `armory:plan`, `armory:code`, `armory:review`, `armory:audit`,
  `armory:test`, `armory:init-project`, `armory:browse`, `armory:research`.
- Plain: one symlink per skill into `~/.claude/skills/`.

A file that loads another skill names both forms (`/review`, or `/armory:review`).
No hooks in phase 1. Skills trigger by description or by `/name`.

## 4. Models

One table, shipped in `templates/AGENTS.md` under `## Models`, with the Fable rule and
the tag rule below it. The project copy is the truth for that project; the user edits it
there. Skills MUST pick the model, effort and agent from the project table, not from this
file. Executor tags: `plan` section 6. Phases: `plan` section 1 (pre-work on Fable) and
`code` sections 1 and 7 (Opus leads; Fable only for `[fable]` items and `stuck:`
reports).

## 5. The project file: `AGENTS.md`

Claude Code reads `AGENTS.md` in place of `CLAUDE.md` from v2.1.277. Below that
version a `CLAUDE.md` with the one line `@AGENTS.md` is needed. `init-project` writes
`AGENTS.md` only; the README and the `init-project` report carry the version note.

Sections, written by `init-project`, read by the other skills:

| Section | Content | Who reads it |
|---|---|---|
| `# <name>` + `## What this is` | one paragraph; the RFC 2119 meaning line (section 2) | all |
| `## Commands` | one line per check, same names as the gates: `lint`, `owasp` (dependency and OWASP scan), `unit`, `integration`, `contract`, `functional`, `e2e`, `coverage`; plus `run`, which is not a gate. A level the project does not have has no line and its gate is `off`. The `coverage` command MUST fail below the threshold set in the build tools (default 90% per core module); the skills hold no number. | `code`, `review`, `audit` |
| `## Test levels` | one line per test level, what it covers in this project. The template prefills the article's definitions (`test` section 2); the project edits them. The unit style line: `sociable` (default) or `solitary`. The surface rule: each surface has at least one test level (frontend `unit` or `e2e`; backend `unit` or `integration`; CLI and library `unit`). | `code`, `review`, `audit`, `test` |
| `## Gates` | one line per SHOULD gate: `on` or `off <reason>`. Gates: `worktree-per-agent`, `delegate`, `lint`, `owasp`, `unit`, `integration`, `contract`, `functional`, `e2e`, `coverage`. The first two have no command. Default `on`, except the flexible test levels `contract`, `functional` and `e2e`: default `off (not chosen)` until the project turns them on. | `code`, `review`, `audit` |
| `## Models` | the table from section 4 | `code`, `review`, `audit` |
| `## Rules` | first the base rules (below) when the global file lacks them, then project rules: documentation MUST live in the docs folder (default `docs/`, only the README at the root), requirements in `<docs>/requirements/<task-branch>.md` and plans in `<docs>/plans/<task-branch>.md`, then the project-only MUST/SHOULD lines the user gave; workflows live in the armory skills | all |
| `## Glossary` | domain terms, `Term : one-line meaning` | `code` |
| `## Caveats` | research findings, format `SHORT_DESCRIPTION : file_reference.md` | all |

An `on` gate with no command is a finding for `review` and `audit`, not a silent skip.

Base rules: `skills/init-project/templates/AGENTS.md` `## Rules`. `init-project` writes
each one only when `~/.claude/CLAUDE.md` lacks it, so the project file works without the
global file.

## 6. Writing rules for every skill

- "80% ASD-STE100": short sentences, one idea each, active voice, present tense.
- RFC 2119 words in capitals (section 2).
- Frontmatter: `name`, `description` (what it does, when to use, the trigger words).
- Imperative voice to the agent. No persona prose.
- Each rule appears in exactly one file. Other files reference it by skill name and
  section. A skill that needs another skill's text loads that skill first.
- Target size: `code` under 220 lines, `review` under 130, `audit` under 120,
  `test` under 150, `plan` under 150, `init-project` under 70, `browse` under 60, `research` under 60.

## 7. Skills

Per skill: the trigger and the purpose. The steps live in `skills/`.

### 7.1 `code`

Trigger: any coding task: write, add, fix, refactor, choose a dependency. `/code`.

The implementation workflow, led by Opus: a branch per task, the approved plan as the
task, requirements as tests (TDD), the smallest complete change (the ladder), the project
gates, delegation to the project agents, atomic commits, and a reviewer run before the
report. The `research` skill is the single home of the research rule; `code`
section 10, `plan` section 3 and the `researcher` card point to it.

### 7.2 `review`

Trigger: "review this", "review the PR", "review the last commit", `/review`.

Reads the connected code, not only the diff. Checks the summary and the requirements
against the diff, runs the `on` gates, and lists numbered findings with a fix each.
Changes no code. `review` section 3 is the single home of the seven finding classes;
`code` and `audit` point to it.

### 7.3 `audit`

Trigger: "audit this codebase", "review the whole repo", "find bloat", `/audit`.

One-shot report on a whole repo or package; changes nothing. Loads `review` and applies
its classes to the whole tree, loads `test` when the tree has tests, and adds the
`tech-debt:` ledger.

### 7.4 `init-project`

Trigger: "init project", "set up AGENTS.md", "new project setup", `/init-project`.

Writes `AGENTS.md` (section 5) and the four agent files (section 8) from the templates,
after one question set. It does not overwrite an existing file.

### 7.5 `plan`

Trigger: a new task, "plan this", "make a plan", `/plan [none|min|full]`, and the `code`
skill when no plan exists. The pre-work phase: input → research (optional) → business
quiz → tech quiz → plan → review the plan → propose → approve → save. Runs on the Fable
row; for a trivial task it MAY run on Opus. The exit of plan mode is the approval gate.
`plan` section 10 is the single home of amendments.

### 7.6 `test`

Trigger: "how should we test this", "write tests for", "test strategy", "test plan",
`/test`. Loaded by `code` before any test is written, by `review` when a diff touches
tests, and by `audit` when the tree has tests. The single home of every test rule; `code`
section 4 keeps only the TDD loop and the per-requirement rule.

Dropped from the articles on purpose: speed budgets in numbers (Beck's ten minutes),
exploratory testing as a step, test ownership across teams, the tool list.

### 7.7 `browse`

Trigger: any web search, page read or source check; `/browse`. The single home of how an
agent uses `agent-browser` (`tools/agent-browser/`, the first phase-2 tool): the
commands, their output and exit codes, the daemon, and the install check. The user docs
`docs/agent-browser.md` hold the settings, the profile and the limits; the skill does not
repeat them. Global rule 3 points here; the `research` skill stays tool-neutral.

### 7.8 `research`

Trigger: any claim about a library, API, model, tool or domain fact that may be
outdated; the plan's research step; the `researcher` agent; `/research`. The single home
of the research rule: official documentation, changelog or source first; at least 3
further independent sources as a SHOULD; dates; disagreements with a named trust and
reason; the report (claim with confidence, sources, one Caveats line). Tool-neutral: it
reads the web with the access the environment's rules name, so a project without
`agent-browser` uses it unchanged. Moved out of `code` section 10 so the `researcher`
card and the `code` and `plan` skills share one text.

## 8. Agent templates

Each file: frontmatter plus a short role card. No `tools` field: the master session
decides what the agent may touch through the brief, and Claude Code gives the agent the
full tool set. No `skills` frontmatter field: its value would differ between the plugin
and the plain install, so the role card loads the skill by name instead. A role card
holds no rule that a skill or the brief already holds.

| Agent | Frontmatter | Role card |
|---|---|---|
| `coder` | `model`, `effort`, `isolation: worktree` | loads the `test` skill before writing tests; follows the brief in full (requirements, scope, commands, gates, rules); stops and reports `stuck: <why>` instead of guessing; reports its worktree branch, log, gate results, uncovered lines, risks |
| `reviewer` | `model`, `effort` | loads the skill the brief names (`review` or `audit`) and follows it in full |
| `researcher` | `model`, `effort` | loads the `research` skill and follows it, report format included; changes no file |
| `writer` | `model`, `effort` | RFC 2119 words; marks missing facts `TODO`; changes no code |

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
   `review` section 5 with a `Gates:` line; `audit` prints the format of `audit`
   section 4 with a Tech debt section.
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

## 11. Open

- The OWASP check has no fixed tool. `## Commands` `owasp:` names the project's one
  (`npm audit`, `pip-audit`, `cargo audit`). The Top 10 self-check is a reading step.
- Not verified on a real agent load: the frontmatter fields `effort` and `isolation`
  and the model alias `fable`. The sub-agents documentation lists all three.
- Phase 2 began with `agent-browser` (`tools/agent-browser/`, docs in `docs/agent-browser.md`) and the `browse` skill that wraps it for agents. Hooks are not designed.
