# agent-armory

Personal Claude Code skills and tools. Phase 1: the workflow skills. Phase 2: the `agent-browser` tool
and the `browse` skill that wraps it. The design is in [docs/DESIGN.md](docs/DESIGN.md).

| Skill | What it does |
|---|---|
| `plan` | Pre-work on Fable. Modes `none`, `min`, `full`; no mode means a quiz. `min`: tech quiz and a plan in Claude Code's plan mode, saved to the docs folder only on request. `full`: research, business and tech quizzes (`BR-n`, `TR-n`), plan review, approval, then the requirements and plan files. Every item carries an executor tag (`[opus]`, `[fable]`, `[sonnet]`, `[haiku]`). |
| `code` | Coding workflow: branch per task, requirements as RFC 2119 statements and tests (TDD), the smallest complete change, test gates from the project `AGENTS.md`, delegation to project agents, atomic commits. |
| `review` | Review of a change. Reads the connected code, runs the project gates, checks the summary against the diff. Numbered findings with a fix each. Changes no code. |
| `audit` | Audit of a whole repo or package: bugs, security, load, missing tests, speed, bloat, and the `tech-debt:` ledger. Changes no code. |
| `test` | Test guide: the pyramid, the levels (unit, integration, contract, functional, e2e), sociable unit tests, what to test, structure, speed, review checks. Loaded by `code`, `review` and `audit`. |
| `research` | How to research a technical claim: official sources first, independent sources next, dates, disagreements, the caveat line for `AGENTS.md`. Loaded by `code`, `plan` and the `researcher` agent. |
| `browse` | Web search and page reading through `agent-browser`: the two commands, exit codes, the daemon, and the install check. Loaded before any web search or page read. |
| `init-project` | Writes `AGENTS.md` (commands, test levels, gates, model table, rules, glossary, caveats) and the project agents `coder`, `reviewer`, `researcher`, `writer` in `.claude/agents/`. |

## Tools

| Tool | What it does |
|---|---|
| `agent-browser` | CLI that reads pages as markdown and searches the web through a Chrome that a daemon owns. See [docs/agent-browser.md](docs/agent-browser.md). |

## Install

As a plugin, from GitHub:

```bash
/plugin marketplace add nafania217518/agent-armory
```

Or from a local checkout:

```bash
/plugin marketplace add /path/to/agent-armory
```

Then install:

```bash
/plugin install armory@agent-armory
```

The skills then run as `/armory:plan`, `/armory:code`, `/armory:review`, `/armory:audit`,
`/armory:test`, `/armory:init-project`, `/armory:research` and `/armory:browse`.

As plain skills, one symlink per skill:

```bash
for s in plan code review audit test init-project research browse; do ln -s "$PWD/skills/$s" ~/.claude/skills/$s; done
```

## Release

Run this command from the repo root:

```bash
node scripts/bump-version.mjs <major|minor|patch>
```

It raises that part of the version in `.claude-plugin/plugin.json` and sets the lower
parts to 0. It prints the new version.

## Notes

- Rules use RFC 2119 words. The project `AGENTS.md` (template in
  `skills/init-project/templates/AGENTS.md`) defines what MUST, SHOULD and MAY mean here
  and which SHOULD rules are off.
- `AGENTS.md` without a `CLAUDE.md` needs Claude Code 2.1.277 or later. Below that,
  add a `CLAUDE.md` with the one line `@AGENTS.md`.
- The ponytail plugin injects its own rules at every session start. Disable it when
  `armory` is installed, so rules do not come twice.
- Always-on rules stay in `~/.claude/CLAUDE.md`. The skills hold the workflows. The
  project `AGENTS.md` holds the project facts and repeats the base rules only when the
  global file lacks them.
