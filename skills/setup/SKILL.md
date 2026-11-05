---
name: setup
description: >
  Sets up armory in the current project on the host you run in. Probes the hook, asks
  the user what to install, then writes and reports.
  Use for "/setup", "set up armory", "add the project agents".
disable-model-invocation: true
max-lines: 163
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# setup

The main session sets up armory on its host. The user decides every write.

## 1. Invocation

- The invocation MUST be `setup`. One run MUST set up armory in the current project:
  the project hooks and skill location, the pointer in the project context, the project
  context sections, the agent cards.
- A run MUST follow the sections in order. The writes MUST run at the Flow step "the
  files" of section Project context.

## 2. Self-report

- Before any other step, the main session MUST probe the `core` hook. The hook term
  MUST count as bound only when the probe finds the `core` text in the starting context
  of a session and of a spawned agent; a config entry alone MUST NOT count.
- The user MUST see the probe result and confirm or correct it. The run MUST NOT go on
  before that answer.

## 3. Install

- The parts MUST be these: (a) core injection; (b) the skills, reachable by the host;
  (c) the agent cards, in the host's format; (d) the project context sections (section
  Project context).
- Before any write, `setup` MUST ask the install question per part through the question
  tool. Part (a) MUST offer "hook plus pointer" (recommended), "pointer only" and
  "stop". Parts (b) to (d) MUST offer "install" (recommended) and "stop". "stop" MUST
  leave the part out; the run MUST go on to the next part. `setup` MUST install only
  the chosen parts.
- The pointer MUST be one line in the project context: "At session start, load
  the armory `core` skill." The line MUST sit at the top of that context, before the
  first section.
- `setup` MUST name `scripts/core-context.sh` of the armory clone as the hook command
  candidate. It prints `core` as plain stdout when its input names no hook event.
- An embedded copy of `core` MAY go into the context only when the user asks for it,
  between `<!-- armory core -->` and `<!-- /armory core -->`, so a rerun can refresh it.
- Skills MUST reach the host by symlink from the armory clone into its skill location.
- The main session MUST render the six card templates of `templates/agents/` (next to this
  file), one per project agent (`delegate` section What each agent returns), into the
  host's agent format at its agent location. The fields are name, description, model,
  effort and isolation. `{{MODEL}}` MUST be the model value of the card's
  default row (`delegate` section Models). `{{EFFORT}}` MUST be that row's effort. Drop
  a placeholder line left empty.
- When it installs the hook or the skills in the repo, one question
  per run MUST ask whether the host files that `setup` writes inside the repo (hook
  config, skill links) are local and ignored by git, or committed with relative paths.
- After the writes, `setup` MUST list every write back, with its part and path.
- A rerun MUST be idempotent. Each item already present MUST be reported as present,
  with a refresh offered. A marker block, the pointer line, a hook entry or a skill
  link MAY be refreshed after the user's yes. The project context and the agent cards
  follow section Project context.
- An item that a host plugin already provides MUST count as present; for the hook,
  present MUST mean probed active.

## 4. Project context

The main session writes these sections (section Write).

### Flow

- MUST load `code` for the branch, `delegate` for the default rows and `test` for the
  levels.
- In a repo the order MUST be: the questions (section Questions); the user's yes to
  write the files; the task branch `setup-armory` (`code` section Branch and plan
  file); the files (every write of section Install, the project context sections
  included); a commit of the files; the report; the finish question (`code` section
  Finish).
- When `setup-armory` exists, `setup` MUST delete and cut it again if it is merged into
  `<base>`, else cut `setup-armory-<n>` with the next free `<n>`.
- No repo: MUST run `git init` and `git commit --allow-empty -m "Start the repository"`
  on the default branch before the task branch.
- `plan` does not apply: no plan mode, no plan file. Caveat writes: `code` section
  Caveats, with the task branch in the place of the plan-file commit.

### Questions

- Before the questions, `setup` MUST read the repo and prefill each item: the name
  from the folder; the paragraph from the README; the docs folder when one exists; the
  surfaces from the layout; the commands from the build tool's script list. The other
  items take their defaults. Each default is in brackets:
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
  8. Tracker [the docs fallback].
- Before the round, `setup` MUST probe the host's connections (MCP servers and CLIs)
  for a tracker. It MUST propose a binding for each verb of `core` section Host terms,
  term `tracker`, its target, and the `closes by PR merge:` line of `templates/AGENTS.md`
  (the closing reference form the probe finds, else `no`). It MUST bind an optional
  verb only when the tracker has it; a tracker that can only create a branch MUST leave
  the branch name verb unbound. Only when it binds every label verb, it MUST propose
  the five `label <role>: <label>` lines of `triage`. Each MUST default to an existing
  label of the same name first, then one of the same meaning, else the role name. The
  probe MUST prove the binding with one live read (list or read) against the target,
  with no write. A failed read MUST count as no fit.
- One round MUST show the prefilled set, item by item, and ask the user to confirm or
  edit it. As a free-text question, it goes as a plain message (`core` section Writing
  and questions). A further round MUST come only from section Answer checks.
- A missing answer MUST take the prefilled value (a detected value or the default). MUST
  say so.

### Answer checks

- A gate with no command MUST be `off <reason>`.
- Each surface of question 2 MUST meet the `test` surface rule with a command and its
  gate `on`. Else MUST ask for the command, or for the gate to be `off` with a reason.
- The `coverage` command MUST fail below the threshold set in the build tools (default
  90% per core module), through a fail-under setting. Else MUST ask for it, or set the
  gate `off` with a reason.
- With no tracker fit, a required verb unbound, or no `closes by PR merge:` value,
  `setup` MUST ask the user how to reach the tracker, that verb or that value, or keep
  the docs fallback.

### Write

- The main session MUST write the sections into the project context and report the path.
- Documentation MUST live in the docs folder, `<docs>`. Only the README stays at the root.
- The project context `## Rules` MUST hold the line `Documentation lives in <folder>`
  (default `docs/`).
- The project context MUST have these sections, in this order: `## What this is` (one
  paragraph on what the project is), `## Commands`, `## Gates`, `## Test levels`,
  `## Tracker`, `## Rules` (project-only rules), `## Glossary`, `## Caveats`.
- `## Tracker` is the one optional section. It MUST be written only for a bound
  tracker. With the docs fallback, the section and its format line MUST be dropped.
- `## Commands`, `## Gates`, `## Glossary` and `## Caveats` MUST take the format lines
  of `templates/AGENTS.md`. `## Glossary` and `## Caveats` MUST start empty, with them.
- A gate's command MUST carry the gate's name. `run` is not a gate. The gates MUST be:
  `lint`, `owasp`, `unit`, `integration`, `coverage` (default `on`); `contract`,
  `functional`, `e2e` (default `off (not chosen)` until turned on).
- The project context MUST NOT copy the global rules or the armory rules, the `test`
  level lines included. `## Test levels` MUST hold only what the project adds to or
  changes in those lines, and its unit style.
- MUST NOT overwrite an existing project context or agent card. MUST show what exists
  and stop. MUST add only the missing parts, and only when the user says so.
- Fill `templates/AGENTS.md` from the answers. Drop a command line with no command and
  any placeholder line left empty.

## 5. Report

- The report MUST hold: what was installed per part, with paths, the project context
  path included; usage notes (how to load each skill on this host, and how to rerun or
  refresh); the gates that are `off`.
