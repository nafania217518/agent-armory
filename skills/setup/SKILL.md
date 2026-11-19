---
name: setup
description: >
  Sets up armory in the current project: probes the hook, asks the user what to install,
  then writes the project context and the agent cards. When armory is already set up, it
  only updates the project context and the agent cards. Use for "/setup", "set up
  armory", "add the project agents".
disable-model-invocation: true
metadata:
  type: user-only
  extends: [code, core-main, delegate, test, workflow]
  max-lines: 172
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core-main` before your first step when its rules are not in your context.
Load `workflow` before your first step when its rules are not in your context.
Load `test` before the questions when its rules are not in your context.
Load `code` before the questions when its rules are not in your context.
Load `delegate` before you render the agent cards when its rules are not in your context.

# setup

Main session sets up armory on its host. User decides every write.

## 1. Invocation

- Invocation MUST be `setup`. One run MUST set up armory in current project: pointer in
  project context when probe fails, project context sections, agent cards.
- Run MUST follow sections in order. Writes MUST run at Flow step "the files" of
  §4.
- Run in a project that already has armory MUST be an update run: project context holds
  the sections of §4.4, and host's agent location holds the six cards. Update run MUST
  skip §2 and §3, except pointer, card render, consent question and rerun
  bullets of §3. Its Questions round MUST show only items that project context
  lacks; the rest MUST keep their existing values. §4.4 sets how each changed file is
  shown and written. Update run MUST offer, in the consent question, to delete each card
  at host's agent location that no template names. Update run MUST merge an old
  `## Commands` into `## Gates`: each `on` gate takes its command, each `off` line stays,
  and `## Commands` goes. An `on` gate with no command MUST be offered
  as off, and the command of an `off` gate for drop, in the consent question. A command
  with `(cd <folder> && …)` pieces MUST become parts, each other piece a `.` part. Any
  other line MUST be offered for drop in the consent question.
- Main session MAY do every file read and write of a run itself.

## 2. Self-report

- Before any other step, main session MUST probe the `core` hook. Hook term MUST count as
  bound only when probe finds `core` text in starting context of a session and of a
  spawned agent; a config entry alone MUST NOT count.

## 3. Install

- Skills and `core` hook MUST come from armory plugin. `setup` MUST NOT write hook config
  or skill files into project; when probe fails, it MUST write the pointer instead.
- Parts MUST be these: (a) pointer, only when probe fails; (b) agent cards, in host's
  format; (c) project context sections (§4).
- Before any write, `setup` MUST ask one consent question. Its message text MUST hold
  probe result, or each present item in an update run, and full write set: each write with
  its part, path and diff. Options MUST be:
  - "write on the setup branch" (recommended);
  - "write uncommitted": skips task branch, commit and finish question;
  - "pick parts": opens one follow-up call with two questions, which parts to write and
    "setup branch" or "uncommitted";
  - "stop": ends the run with no write.
- `setup` MUST write only chosen parts.
- Pointer MUST be one line in project context: "At session start, load the armory `core`
  skill, and in the main session also the armory `core-main` skill, each when its rules
  are not in your context." Line MUST sit at top of that context, before first section.
  An update run MUST write the pointer only over a project-context line that starts "At
  session start, load the armory `core` skill" and differs from it.
- Main session MUST render the six card templates of `templates/agents/` (next to this
  file), one per project agent (`delegate` §3), into host's agent
  format at its agent location. Keys: name, description, model, effort, tools, isolation.
  `{{MODEL}}` MUST be the model value of card's default row (`delegate` §4).
  `{{EFFORT}}` MUST be that row's effort. Drop a placeholder line left empty.
- After writes, `setup` MUST list every write back, with its part and path.
- Rerun MUST be idempotent. Each item already present MUST be reported as present, with a
  refresh offered in the consent question. Project context and agent cards follow
  §4.
- Hook MUST count as present when probed active. In an update run, it MUST count as
  present when armory plugin is enabled.

## 4. Project context

### 4.1. Flow

- In a repo the order MUST be: questions (§4.2); consent question (§3); task
  branch `setup-armory` (`workflow` §2); the files (every write of
  §3, project context sections included); a commit of the files; report; finish
  question (`workflow` §4).
- When `setup-armory` exists, `setup` MUST delete and cut it again if it is merged into
  `<base>`, else cut `setup-armory-<n>` with next free `<n>`.
- No repo: MUST run `git init` and `git commit --allow-empty -m "Start the repository"` on
  default branch before task branch.
- Run MUST skip plan mode and the plan file.
- Done when finish question is answered, or, with an uncommitted write, report is given.

### 4.2. Questions

- Before questions, `setup` MUST read repo and prefill each item: name from folder;
  paragraph from README; docs folder when one exists; surfaces from layout; commands from
  build tool's script list. Other items take their defaults. Each default is in brackets:
  1. Name [folder name], one paragraph on what the project is, docs folder [`docs/`].
  2. Surfaces: frontend, backend, CLI, library, other.
  3. One command per gate: `lint`, `owasp`, `unit`, `integration`, `coverage`,
     `contract`, `functional`, `e2e`; with several packages, one per folder that has the
     check, as parts. A level the project does not have: no line.
  4. Gates with no command: each is off, with an optional reason [no reason].
  5. Project-only rules, as MUST or SHOULD lines [none], and the `auto-fix:` classes
     [`none`] (`code` §3).
  6. Tracker [docs fallback].
- Before round, `setup` MUST probe host's connections (MCP servers and CLIs) for a
  tracker. It MUST propose a binding for each verb of `tracking` §1,
  its target, and the `closes by PR merge:` line of `templates/AGENTS.md` (the closing
  reference form the probe finds, else `no`). It MUST bind an optional verb only when
  tracker has it; a tracker that can only create a branch MUST leave the branch name verb
  unbound. Only when it binds every label verb, it MUST propose the five
  label lines of `tracking` §3. Each MUST default to an existing label of the
  same name first, then one of the same meaning, else role name. Probe MUST prove binding
  with one live read (list or read) against target, with no write. Failed read MUST count
  as no fit.
- One round MUST show prefilled set, item by item, and ask user to confirm or edit it.
  As a free-text question, it goes as a plain message (`core-main` §2). A
  further round MUST come only from §4.3.
- Missing answer MUST take prefilled value (detected value or default). MUST say so.

### 4.3. Answer checks

- Each surface of question 2 MUST meet the `test` surface rule with a command and its gate
  `on`. Else MUST ask for the command, or leave the gate off.
- `coverage` command MUST fail below threshold set in build tools (default 90% per core
  module), through a fail-under setting. Else MUST ask for it, or leave the gate off.
- With no tracker fit, a required verb unbound, or no `closes by PR merge:` value, `setup`
  MUST ask user how to reach tracker, that verb or that value, or keep docs fallback.

### 4.4. Write

- Main session MUST write the sections into project context.
- Project context `## Rules` MUST hold the line `Documentation lives in <folder>` (default
  `docs/`).
- `auto-fix:` answer to question 5 MUST replace template line `- auto-fix: none`.
- Project context MUST have these sections, in this order: `## What this is` (one
  paragraph on what the project is), `## Gates`, `## Test levels`,
  `## Tracker`, `## Rules` (project-only rules), `## Glossary`, `## Caveats`.
- `## Tracker` is the one optional section. It MUST be written only for a bound tracker.
  With docs fallback, the section and its format line MUST be dropped.
- `## Gates`, `## Glossary` and `## Caveats` MUST take format lines of
  `templates/AGENTS.md`. `## Glossary` MUST start empty, with its format line. Run MUST
  place each caveat it found under `workflow` §3, after the `Unverified:` check of `code`
  §3.
- Only when root `## Caveats` holds no topic pointer, update run MUST offer to sort it
  under `workflow` §3. Its report MUST give entry count before and after, and each drop.
- Gate line MUST carry the gate's name. Gates MUST be: `lint`, `owasp`, `unit`,
  `integration`, `coverage`, `contract`, `functional`, `e2e`. A gate is `on` only when
  its line or a part holds a command.
- Project context MUST NOT copy global rules or armory rules, `test` level lines included.
  `## Test levels` MUST hold only what the project adds to or changes in those lines, and
  its unit style.
- A new `## Test levels` MUST take the defaults: no change to the `test` level lines, and
  unit style `sociable`. An existing one MUST keep its lines.
- MUST NOT overwrite an existing project context or agent card outside the consent
  question. MUST put its diff into that question instead.
- Fill `templates/AGENTS.md` from answers. Drop a gate line that is off with no reason,
  and any placeholder line left empty. A gate with parts keeps its
  line, with its parts under it.

## 5. Report

- Report MUST hold: what was installed per part, with paths, project context path
  included; usage notes (how to load each skill on this host, and how to rerun or
  refresh); gates that are `off`; the `## Test levels` defaults.
