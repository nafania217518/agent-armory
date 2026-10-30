---
name: init-project
description: >
  Set up a project for the armory skills: write AGENTS.md (what the project is,
  commands, test levels, gates, model table, rules, glossary, caveats) and the project agents in
  .claude/agents (coder, reviewer, researcher, writer). Use for "init project", "set up
  AGENTS.md", "new project setup", "add the project agents", "/init-project".
---

# init-project

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

## 1. Ask

One question set, all at once. A missing answer takes the template default; say so.

1. Name (default: the folder name), one paragraph on what the project is, and the
   documentation folder (default: `docs/`).
2. Surfaces: frontend, backend, CLI, library, other.
3. One command per check: `lint`, `owasp`, `unit`, `integration`, `contract`,
   `functional`, `e2e`, `coverage`, `run`. A level the project does not have: leave the
   line out.
4. Which flexible levels are `on`: `contract`, `functional`, `e2e`. Default: all three
   `off (not chosen)`.
5. Changes to the `## Test levels` lines, and the unit style. Default: the template
   text, `sociable`.
6. Other gates that are `off`, each with a reason. Default: `on`.
7. Project-only rules, as MUST or SHOULD lines.
8. Changes to the model table. Default: keep it.
9. The web rule (base rule 3, the `browse` skill): include it? Default: no. It is
   written only on a yes.

## 2. Check the answers

- A gate whose command is missing MUST be `off <reason>`.
- The surface rule in the template `## Test levels` MUST hold: each surface named in
  question 2 has at least one test level command with its gate `on`. Else ask for the command, or for the
  gate to be `off` with a reason.
- The `coverage` command MUST carry a fail-under setting (for example
  `--cov-fail-under`, `--coverage.thresholds`, a config key). Else ask for it, or set the
  gate `off` with a reason.

## 3. Write `AGENTS.md`

- MUST fill `templates/AGENTS.md` with the answers.
- Base rules: MUST read `~/.claude/CLAUDE.md`. Keep a base rule only when that file does
  not hold the same rule in any wording. Base rule 3 (the web rule) MUST be left out
  unless question 9 was answered yes. Number the rules that remain from 1 without gaps.
  Then add the project-only rules.
- `## Glossary` and `## Caveats` start empty, with their format lines.

## 4. Write the agents

- MUST write `.claude/agents/coder.md`, `reviewer.md`, `researcher.md` and `writer.md`
  from `templates/agents/`. Replace `{{MODEL}}` and `{{EFFORT}}` from the row of the
  project's `## Models` whose `Agent` column names the agent without a tag.
- Gate `worktree-per-agent` off: remove the `isolation: worktree` line from `coder.md`.

## 5. Do not overwrite

- MUST NOT overwrite an existing `AGENTS.md` or agent file. Show what exists and stop.
  When the user says so, add only the missing sections or files.
- Report: the files written, the gates that are off, the base rules skipped because the
  global file holds them, and the version note from the README.
