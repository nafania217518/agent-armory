# agent-armory

Personal agent skills, packaged as the `armory` plugin. The skills hold the rules
and the workflows. The design is in [docs/DESIGN.md](docs/DESIGN.md). The skills use host
terms and run on Claude Code, Codex CLI, Cursor, GitHub Copilot and any host that reads a
`SKILL.md`.

Web search and page reading moved to the agent-browser plugin:
<https://github.com/nafania217518/agent-browser>. Its `browse` skill loads as
`/agent-browser:browse`.

## Skills

| Skill | What it does | Loaded by |
|---|---|---|
| `core` | Always-on base rules for every actor: rule words, writing, design principles, reports. | the hook or the pointer; every armory skill |
| `plan` | Pre-work for a task: quizzes, requirements, the plan, approval and the plan file. | main session; `planner` |
| `delegate` | How the main session hands work to agents: briefs, worktrees, model and effort. | main session, from `plan` and `code` |
| `code` | Main-session coding lifecycle from the approved plan to the finish question. | main session |
| `implement` | The coder's rules: smallest complete change, readability, gates, atomic commits. | `coder`, `debugger`, `reviewer`; main session when it codes itself |
| `test` | Test rules: pyramid, levels, unit style, TDD, test scope, markers, determinism. | `coder`, `debugger`, `reviewer`, `planner`, auditor |
| `debug` | Diagnosis of a bug whose cause is not known: feedback loop, hypotheses, probes, cleanup. | `debugger`; main session when it debugs itself |
| `review` | Review of a change. Lists findings and changes no code. | `reviewer`, auditor |
| `audit` | Ranked one-shot quality audit of a whole repo or package. Changes nothing. | `reviewer` on an audit brief |
| `research` | How to research a technical claim: official sources first, dates, disagreements. | `researcher` |
| `setup` | Sets up armory on the host you run in: global, project or session scope; asks the host what it can do and the user what to install; writes the project context and the agents. | main session |

## Agents

`setup` writes the agents into the host's agent location from the templates in
`skills/setup/templates/agents/`.

| Agent | Role | Default model | Effort |
|---|---|---|---|
| `coder` | Implements one coding brief with TDD, in its own worktree. | Opus | low |
| `debugger` | Diagnoses one bug whose cause is not known, and fixes it in the fix flow, in its own worktree. | Opus | high |
| `reviewer` | Reviews a change or audits a repo. Changes no tracked file. | Opus | high |
| `researcher` | Answers one technical question from sources. | Sonnet | low |
| `writer` | Writes or edits prose. Changes no code, tests or config. | Sonnet | low |
| `planner` | Read-only. Drafts a design, a test design or an analysis of options. | Opus | high |

## Install

Clone the repo. Then run `setup` from your host; on a host without the skill loaded,
point the host at `skills/setup/SKILL.md` in the clone. `setup` asks the scope (global,
project or session), reports what the host can do, asks what to install, and prints a
report with usage notes.

On Claude Code, install the plugin first, then run `/armory:setup`. Add the plugin from
GitHub:

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

The skills then load by name; on Claude Code as `/armory:<name>`.

## Release

Run this command from the repo root:

```bash
node scripts/bump-version.mjs <major|minor|patch>
```

It raises that part of the version in `.claude-plugin/plugin.json` and sets the lower
parts to 0. It prints the new version.

## Notes

- Rules use RFC 2119 words. `core` defines what MUST, SHOULD and MAY mean. The project
  context (template in `skills/setup/templates/AGENTS.md`) holds the gates.
- On Claude Code, `AGENTS.md` without a `CLAUDE.md` needs version 2.1.277 or later.
  Below that, add a `CLAUDE.md` with the one line `@AGENTS.md`.
- The global rules 1–8 live in `core`; the plugin hook, or the hook or pointer that
  `setup` installs, loads it.
