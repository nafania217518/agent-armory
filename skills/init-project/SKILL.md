---
name: init-project
description: >
  Set up a project for the armory skills: the setup questions, then AGENTS.md (what this
  is, commands, gates, test levels, glossary, caveats, rules) and the five agents in
  .claude/agents (coder, reviewer, researcher, writer, planner). Use for "set up
  AGENTS.md", "new project setup", "add the project agents", "/init-project".
max-lines: 100
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context (`/core`, or
`/armory:core` in the plugin).

# init-project

The main session sets up a project. This skill also owns the project-file rules.

## 1. Flow

- MUST load `code` (`/code`, or `/armory:code` in the plugin) for the branch,
  `delegate` (`/delegate`, or `/armory:delegate`) for the default rows and `test`
  (`/test`, or `/armory:test`) for the levels.
- Setup MUST run as its own flow, in this order: the questions in rounds; the user's
  yes to write the files; a task branch (`code` section Branch and plan file); the files;
  a commit of the files; the report; the finish question (`code` section Finish).
- No repo: MUST run `git init` and an empty first commit on the default branch before
  the task branch.

```
git init
git commit --allow-empty -m "Start the repository"
```

- `plan` does not apply: no plan mode, no plan file. Caveat writes: `code` section
  Caveats.

## 2. Questions

- Setup MUST ask this question set in rounds until no open point remains. Each default
  is in brackets:
  1. Name [the folder name], one paragraph on what the project is, the docs folder
     [`docs/`].
  2. Surfaces: frontend, backend, CLI, library, other.
  3. One command per check: `lint`, `owasp`, `unit`, `integration`, `contract`,
     `functional`, `e2e`, `coverage`, `run`. A level the project does not have: no line.
  4. Which flexible levels are `on`: `contract`, `functional`, `e2e` [all three
     `off (not chosen)`].
  5. What the project adds to or changes in the level lines of `test` section Levels,
     with the level names fixed [none], and the unit style [`sociable`].
  6. Other gates that are `off`, each with a reason [all `on`].
  7. Project-only rules, as MUST or SHOULD lines [none].
- A missing answer MUST take the default. MUST say so.

## 3. Answer checks

- A gate with no command MUST be `off <reason>`.
- Each surface of question 2 MUST meet the surface rule (`test` section Levels) with a
  command and its gate `on`. Else MUST ask for the command, or for the gate to be `off`
  with a reason.
- The `coverage` command MUST fail below the threshold set in the build tools (default
  90% per core module), through a fail-under setting (`--cov-fail-under`,
  `--coverage.thresholds`, a config key). Else MUST ask for it, or set the gate `off`
  with a reason.

## 4. Write

- Documentation MUST live in the docs folder, `<docs>`. Only the README stays at the root.
- `AGENTS.md` `## Rules` MUST hold the line `Documentation lives in <folder>` (default
  `docs/`). Every actor resolves `<docs>` from that line.
- `AGENTS.md` MUST have these sections: `## What this is` (first, one paragraph on what
  the project is), `## Commands`, `## Gates`, `## Test levels`, `## Glossary`,
  `## Caveats`, `## Rules` (project-only rules).
- `## Commands` MUST hold one line per check. A gate's command MUST carry the gate's
  name. `run` is not a gate.
- `## Gates` MUST hold one line per gate: `on`, or `off <reason>`.
- The gates MUST be: `lint`, `owasp`, `unit`, `integration`, `coverage` (default `on`);
  `contract`, `functional`, `e2e` (default `off (not chosen)` until turned on).
- `AGENTS.md` MUST NOT copy the global rules or the armory rules, the level lines of
  `test` section Levels included. `## Test levels` MUST hold only what the project adds
  to or changes in those lines, and its unit style.
- `## Glossary` and `## Caveats` MUST start empty, with their format lines. The formats
  MUST be `Term : one-line meaning` and the caveat format of `core` section Reports.
- Setup MUST write one file per project agent (`delegate` section What each agent
  returns) into `.claude/agents/`, from the templates, which are the single source. Each
  MUST hold the model and effort of its default row (`delegate` section Models).
- MUST NOT overwrite an existing `AGENTS.md` or agent file. MUST show what exists and
  stop. MUST add only the missing parts, and only when the user says so.
- Fill `templates/AGENTS.md` and `templates/agents/<agent>.md` (next to this file) from
  the answers. Drop a command line with no command and any placeholder line left
  empty. `{{MODEL}}` is the row's model in lower case (`opus`).

## 5. Report

- The report MUST list the files written and the gates that are `off`.
