---
name: setup
description: >
  Sets up armory in the current project: probes the hook, asks the user what to install,
  then writes the project context and the agent cards. When armory is already set up, it
  only updates the project context and the agent cards. Use for "/setup", "set up
  armory", "add the project agents".
disable-model-invocation: true
max-lines: 162
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# setup

Main session sets up armory on its host. User decides every write.

## 1. Invocation

- Invocation MUST be `setup`. One run MUST set up armory in the current project: the
  pointer in project context when the probe fails, project context sections, agent cards.
- Run MUST follow the sections in order. Writes MUST run at Flow step "the files" of
  §Project context.
- Run in a project that already has armory MUST be an update run: project context holds
  the sections of §Write, and host's agent location holds the six cards. Update run MUST
  skip §Self-report and §Install, except the card render, the consent question and the
  rerun bullets of §Install. Its Questions round MUST show only items that project context
  lacks; the rest MUST keep their existing values. §Write sets how each changed file is
  shown and written. Update run MUST offer, in the consent question, to delete each card
  at host's agent location that no template names.
- Main session MAY do every file read and write of a run itself.

## 2. Self-report

- Before any other step, main session MUST probe the `core` hook. Hook term MUST count as
  bound only when the probe finds `core` text in the starting context of a session and of
  a spawned agent; a config entry alone MUST NOT count.

## 3. Install

- Skills and the `core` hook MUST come from the armory plugin. `setup` MUST NOT write hook
  config or skill files into the project; when the probe fails, it MUST write the pointer
  instead.
- Parts MUST be these: (a) the pointer, only when the probe fails; (b) agent cards, in
  host's format; (c) project context sections (§Project context).
- Before any write, `setup` MUST ask one consent question. Its message text MUST hold the
  probe result, or each present item in an update run, and the full write set: each write
  with its part, path and diff. Options MUST be:
  - "write on the setup branch" (recommended);
  - "write uncommitted": skips the task branch, the commit and the finish question;
  - "pick parts": opens one follow-up call with two questions, which parts to write and
    "setup branch" or "uncommitted";
  - "stop": ends the run with no write.
- `setup` MUST write only the chosen parts.
- Pointer MUST be one line in project context: "At session start, load the armory `core`
  skill when its rules are not in your context." Line MUST sit at the top of that context,
  before the first section.
- Main session MUST render the six card templates of `templates/agents/` (next to this
  file), one per project agent (`delegate` §What each agent returns), into host's agent
  format at its agent location. Keys: name, description, model, effort, tools, isolation.
  `{{MODEL}}` MUST be the model value of the card's default row (`delegate` §Models).
  `{{EFFORT}}` MUST be that row's effort. Drop a placeholder line left empty.
- After the writes, `setup` MUST list every write back, with its part and path.
- Rerun MUST be idempotent. Each item already present MUST be reported as present, with a
  refresh offered in the consent question. Project context and agent cards follow
  §Project context.
- Hook MUST count as present when probed active. In an update run, it MUST count as
  present when the armory plugin is enabled.

## 4. Project context

### Flow

- MUST load `code` for the branch, `delegate` for default rows and `test` for levels.
- In a repo the order MUST be: questions (§Questions); the consent question (§Install);
  task branch `setup-armory` (`code` §Branch and plan file); the files (every write of
  §Install, project context sections included); a commit of the files; the report; the
  finish question (`code` §Finish).
- When `setup-armory` exists, `setup` MUST delete and cut it again if it is merged into
  `<base>`, else cut `setup-armory-<n>` with the next free `<n>`.
- No repo: MUST run `git init` and `git commit --allow-empty -m "Start the repository"` on
  default branch before task branch.
- `plan` does not apply: no plan mode, no plan file.

### Questions

- Before the questions, `setup` MUST read the repo and prefill each item: name from
  folder; paragraph from README; docs folder when one exists; surfaces from layout;
  commands from the build tool's script list. Other items take their defaults. Each
  default is in brackets:
  1. Name [the folder name], one paragraph on what the project is, the docs folder
     [`docs/`].
  2. Surfaces: frontend, backend, CLI, library, other.
  3. One command per check: `lint`, `owasp`, `unit`, `integration`, `contract`,
     `functional`, `e2e`, `coverage`, `run`. A level the project does not have: no line.
  4. Which flexible levels are `on`: `contract`, `functional`, `e2e` [all three
     `off (not chosen)`].
  5. Other gates that are `off`, each with a reason [all `on`].
  6. Project-only rules, as MUST or SHOULD lines [none], and the `auto-fix:` classes
     [`none`] (`code` §Review loop).
  7. Tracker [the docs fallback].
- Before the round, `setup` MUST probe host's connections (MCP servers and CLIs) for a
  tracker. It MUST propose a binding for each verb of `core` §Host terms, term `tracker`,
  its target, and the `closes by PR merge:` line of `templates/AGENTS.md` (the closing
  reference form the probe finds, else `no`). It MUST bind an optional verb only when the
  tracker has it; a tracker that can only create a branch MUST leave the branch name verb
  unbound. Only when it binds every label verb, it MUST propose the five
  `label <role>: <label>` lines of `triage`. Each MUST default to an existing label of the
  same name first, then one of the same meaning, else the role name. Probe MUST prove the
  binding with one live read (list or read) against the target, with no write. Failed read
  MUST count as no fit.
- One round MUST show the prefilled set, item by item, and ask user to confirm or edit it.
  As a free-text question, it goes as a plain message (`core` §Writing and questions). A
  further round MUST come only from §Answer checks.
- Missing answer MUST take the prefilled value (detected value or default). MUST say so.

### Answer checks

- Gate with no command MUST be `off <reason>`.
- Each surface of question 2 MUST meet the `test` surface rule with a command and its gate
  `on`. Else MUST ask for the command, or for the gate to be `off` with a reason.
- `coverage` command MUST fail below the threshold set in build tools (default 90% per
  core module), through a fail-under setting. Else MUST ask for it, or set the gate `off`
  with a reason.
- With no tracker fit, a required verb unbound, or no `closes by PR merge:` value, `setup`
  MUST ask user how to reach tracker, that verb or that value, or keep the docs fallback.

### Write

- Main session MUST write the sections into project context.
- Project context `## Rules` MUST hold the line `Documentation lives in <folder>` (default
  `docs/`).
- `auto-fix:` answer to question 6 MUST replace template line `- auto-fix: none`.
- Project context MUST have these sections, in this order: `## What this is` (one
  paragraph on what the project is), `## Commands`, `## Gates`, `## Test levels`,
  `## Tracker`, `## Rules` (project-only rules), `## Glossary`, `## Caveats`.
- `## Tracker` is the one optional section. It MUST be written only for a bound tracker.
  With docs fallback, the section and its format line MUST be dropped.
- `## Commands`, `## Gates`, `## Glossary` and `## Caveats` MUST take format lines of
  `templates/AGENTS.md`. `## Glossary` MUST start empty, with its format line. Run MUST
  place each caveat it found under `code` §Caveats.
- Only when root `## Caveats` holds no topic pointer, update run MUST offer to sort it
  under `code` §Caveats. Its report MUST give entry count before and after, and each drop.
- Gate's command MUST carry the gate's name. `run` is not a gate. Gates MUST be: `lint`,
  `owasp`, `unit`, `integration`, `coverage` (default `on`); `contract`, `functional`,
  `e2e` (default `off (not chosen)` until turned on).
- Project context MUST NOT copy global rules or armory rules, `test` level lines included.
  `## Test levels` MUST hold only what the project adds to or changes in those lines, and
  its unit style.
- A new `## Test levels` MUST take the defaults: no change to the `test` level lines, and
  unit style `sociable`. An existing one MUST keep its lines.
- MUST NOT overwrite an existing project context or agent card outside the consent
  question. MUST put its diff into that question instead.
- Fill `templates/AGENTS.md` from answers. Drop a command line with no command and any
  placeholder line left empty.

## 5. Report

- Report MUST hold: what was installed per part, with paths, project context path
  included; usage notes (how to load each skill on this host, and how to rerun or
  refresh); gates that are `off`; the `## Test levels` defaults.
