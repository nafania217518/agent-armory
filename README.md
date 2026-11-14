# agent-armory

Personal agent skills, packaged as the `armory` plugin. The skills hold the rules
and the workflows. The design is in [docs/DESIGN.md](docs/DESIGN.md). The skills use host
terms and run on Claude Code.

## Skills

| Skill | What it does | Loaded by |
|---|---|---|
| `core` | Always-on base rules for every actor: rule words, writing, design principles, reports. | the hook or the pointer; every armory skill |
| `plan` | Pre-work for a task: quizzes, requirements, the plan, approval and the plan file. | main session; `planner` |
| `delegate` | How the main session hands work to agents: briefs, worktrees, model and effort. | main session, from `plan` and `code` |
| `code` | Main-session coding lifecycle from the approved plan to the finish question. | main session |
| `implement` | The coder's rules: smallest complete change, readability, gates, atomic commits. | `coder`, `debugger`, `reviewer`; main session when it codes itself |
| `test` | Test rules: pyramid, levels, unit style, TDD, test scope, markers, determinism. | `coder`, `debugger`, `reviewer`, `planner` |
| `debug` | Diagnosis of a bug whose cause is not known: feedback loop, hypotheses, probes, cleanup. | `debugger`; main session when it debugs itself |
| `review` | Review of a change. Lists findings and changes no code. | `reviewer` |
| `audit` | Ranked one-shot quality audit of a whole repo or package. Changes nothing. | `reviewer` on an audit brief |
| `research` | How to research a technical claim: official sources first, dates, disagreements. | `researcher` |
| `retro` | Retrospective on the current session: ranked findings on what to change in the project or in armory. Changes no file. | main session, when the user starts it |
| `triage` | Triage of inbound tracker items on a bound tracker: attention list, one item at a time, a recommended outcome, then the approved writes. Changes no repo file. | main session, when the user starts it |
| `dnd` | Do-not-disturb mode: one start question round, then each task runs from plan to Finish with no more questions and ends with an answers log. | main session, when the user starts it |
| `setup` | Sets up armory in the current project; probes the hook and asks the user what to install; writes the project context and the agent cards. | main session |

## Agents

`setup` writes the agent cards into the host's agent location from the templates in
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

Install the plugin, then run `/armory:setup`. `setup` sets up the current project,
probes the `core` hook, asks what to install, and prints a report with usage
notes. Add the plugin from GitHub:

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

The skills then load by name as `/armory:<name>`.

## Release

Run this command from the repo root:

```bash
node scripts/bump-version.mjs <major|minor|patch>
```

It raises that part of the version in `.claude-plugin/plugin.json` and sets the lower
parts to 0. It prints the new version.

## Evals

The suite in `evals/` checks skill triggers only: does a prompt load the right skill?
Each model-loaded skill has 3 load cases (`core` 1: the hook injects it),
`evals/<skill>-load-<n>/case.yaml`, and 1 skip case, `evals/<skill>-skip-<n>/case.yaml`,
whose near-miss prompt must not load it. `lint` fails when a skill lacks them.

A run costs money, so it stays manual. Run it from the repo root on one model:

```bash
claude plugin eval . --ablation none --runs 3 --no-publish --model haiku --max-cost-usd 25
claude plugin eval . --ablation none --runs 3 --no-publish --model sonnet --max-cost-usd 25
claude plugin eval . --ablation none --runs 3 --no-publish --model opus --max-cost-usd 25
```

One run per case is noisy: on Opus a load case can miss once and pass on the next run.
Treat a case as a real miss only when it fails on most of its 3 runs. The command still
exits 1 when any case scores below 1.0 (`--threshold`, default 1.0), so read the
per-case scores, not the exit code. An Opus run costs about $17 (114 runs at about
$0.15).

`--ablation none` is needed: under the default two arms, `tool: Skill` graders do not
score. Results go to `evals/results/`, which git ignores.

The eval child gets no keychain login. Export `CLAUDE_CODE_OAUTH_TOKEN` (from
`claude setup-token`) or `ANTHROPIC_API_KEY` in the shell that runs the command,
never in a tracked file.

## Notes

- Rules use RFC 2119 words. `core` defines what MUST, SHOULD and MAY mean. The project
  context (template in `skills/setup/templates/AGENTS.md`) holds the gates.
- `AGENTS.md` without a `CLAUDE.md` needs Claude Code 2.1.277 or later.
  Below that, add a `CLAUDE.md` with the one line `@AGENTS.md`.
- The global rules live in `core`; the plugin hook, or the hook or pointer that
  `setup` installs, loads it.
