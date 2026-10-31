# agent-armory

Personal Claude Code skills, packaged as the `armory` plugin. The skills hold the rules
and the workflows. The design is in [docs/DESIGN.md](docs/DESIGN.md).

Web search and page reading moved to the agent-browser plugin:
<https://github.com/nafania217518/agent-browser>. Its `browse` skill loads as
`/agent-browser:browse`.

## Skills

| Skill | What it does | Loaded by |
|---|---|---|
| `core` | Always-on base rules for every actor: rule words, writing, design principles, reports. | the hooks; every armory skill |
| `plan` | Pre-work for a task: quizzes, requirements, the plan, approval and the plan file. | main session; `planner` |
| `delegate` | How the main session hands work to agents: briefs, worktrees, model and effort. | main session, from `plan` and `code` |
| `code` | Main-session coding lifecycle from the approved plan to the finish question. | main session |
| `implement` | The coder's rules: smallest complete change, readability, gates, atomic commits. | `coder`, `reviewer`; main session when it codes itself |
| `test` | Test rules: pyramid, levels, unit style, TDD, test scope, markers, determinism. | `coder`, `reviewer`, `planner`, auditor |
| `review` | Review of a change. Lists findings and changes no code. | `reviewer`, auditor |
| `audit` | Ranked one-shot quality audit of a whole repo or package. Changes nothing. | `reviewer` on an audit brief |
| `research` | How to research a technical claim: official sources first, dates, disagreements. | `researcher` |
| `init-project` | Writes the project `AGENTS.md` and the five project agents. | main session |

## Agents

`init-project` writes the agents into `.claude/agents/` from the templates in
`skills/init-project/templates/agents/`.

| Agent | Role | Default model | Effort |
|---|---|---|---|
| `coder` | Implements one coding brief with TDD, in its own worktree. | Opus | low |
| `reviewer` | Reviews a change or audits a repo. Changes no tracked file. | Opus | high |
| `researcher` | Answers one technical question from sources. | Sonnet | low |
| `writer` | Writes or edits prose. Changes no code, tests or config. | Sonnet | low |
| `planner` | Read-only. Drafts a design, a test design or an analysis of options. | Opus | high |

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

The skills then run as `/armory:<name>`: `/armory:core`, `/armory:plan`,
`/armory:delegate`, `/armory:code`, `/armory:implement`, `/armory:test`,
`/armory:review`, `/armory:audit`, `/armory:research` and `/armory:init-project`. The
plugin hooks inject `core` into every session and every subagent.

As plain skills, one symlink per skill:

```bash
for s in core plan delegate code implement test review audit research \
  init-project; do
  ln -s "$PWD/skills/$s" ~/.claude/skills/$s
done
```

The plain install has no hooks. Put this line in `~/.claude/CLAUDE.md`: "Load the `core`
skill first in every session (`/core`)".

## Release

Run this command from the repo root:

```bash
node scripts/bump-version.mjs <major|minor|patch>
```

It raises that part of the version in `.claude-plugin/plugin.json` and sets the lower
parts to 0. It prints the new version.

## Notes

- Rules use RFC 2119 words. `core` defines what MUST, SHOULD and MAY mean. The project
  `AGENTS.md` (template in `skills/init-project/templates/AGENTS.md`) holds the gates.
- `AGENTS.md` without a `CLAUDE.md` needs Claude Code 2.1.277 or later. Below that,
  add a `CLAUDE.md` with the one line `@AGENTS.md`.
- The global rules 1–8 now live in `core`. `~/.claude/CLAUDE.md` shrinks to a pointer to
  `core`, plus personal items outside armory.
