---
name: setup
description: >
  User-only: the model MUST NOT load this skill on its own; it MUST ask the user to
  start it instead. Sets up armory on the host you run in, in one scope: global,
  project or session. Asks the host what it can do, the user what to install, then
  writes and reports. Use for "/setup", "set up armory", "add the project agents".
disable-model-invocation: true
max-lines: 226
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# setup

The main session sets up armory on its host. The host states what it can do and where
its context lives. The user decides every write.

## 1. Invocation and scope

- The invocation MUST be `setup [global|project|session]`. One run MUST cover one scope.
- With no scope given, the first question MUST ask it through the question tool (`core`
  section Host terms). The recommended option MUST be `project` in a repo, else `global`.
- Each scope MUST touch only its own items:
  - global: the global hooks and skill location, the pointer in the global context, the
    host profile.
  - project: the project hooks and skill location, the pointer in the project context,
    the project context sections, the agent cards, and the host profile.
  - session: nothing on disk (section Install).
- A run MUST follow the sections in order. Project-scope writes MUST run at the Flow step
  "the files" of section Project context.

## 2. Self-report

- Before any other step, the host MUST state, item by item: (1) its name and version;
  (2) hook events (session start, subagent or task start), config file, output format;
  (3) skill locations, project and global; (4) the global context and the project
  context: the files it loads on its own, per scope, and whether it can edit them;
  (5) agent format and location, or none; (6) its models and their ids; (7) tools: the
  question tool, shell, file write, spawn, worktree isolation, plan mode.
- Each claim MUST name a probe the host runs: a path that exists, a command that runs,
  or a config file read. A claim whose probe fails, or that has no probe, MUST count as
  unsupported. Its term MUST take its fallback.
- Item 2 is the capability claim; its own probe is a config file read or a command.
  The hook term MUST count as bound only when a probe shows the `core` hook installed
  and active; a config entry alone MUST NOT count. This activation probe MUST check
  each start event that item 2 claims, a session for session start and a spawned agent
  for subagent start, and find the `core` text in the starting context of each.
- The user MUST see the self-report and confirm or correct it. The run MUST NOT go on
  before that answer.
- Other hosts found on the machine (config dirs, CLIs) MUST go to the report, each with
  "run `setup` from that host". `setup` MUST NOT write for them.

## 3. Model mapping

- `setup` MUST propose a mapping from the four tiers to the self-report's model ids:
  fable, the strongest reasoning; opus, the strong default; sonnet, fast and cheap;
  haiku, the smallest. One question MUST ask the user to confirm or edit it.
- On Claude Code the mapping MUST be the identity: each tier maps to its own name.
- The skills and the templates MUST keep the tier names.

## 4. Host profile

- The host profile MUST be one block between its two markers, in this format:

```
<!-- armory profile -->
terms: one line per core host term except tracker, "<term>: <binding, or fallback>"
capabilities: one line per tool of the self-report, "<tool>: supported, or <fallback>"
tiers: fable=<id>, opus=<id>, sonnet=<id>, haiku=<id>
<!-- /armory profile -->
```

- The block MUST sit in the context of the scope: the global context in global scope,
  the project context in project scope. The host MUST report the path. When both
  blocks exist, the project block wins.
- A rerun MUST refresh the block between its markers, never add a second one.
- With no editable context in the scope, the block MUST take that context's fallback,
  and the report MUST print it for the user to store. In session scope the block MUST
  stay in context only.

## 5. Install

- The parts MUST be these, each only in the scopes of section Invocation and scope:
  (a) core injection; (b) the skills, reachable by the host; (c) the agent cards, in the
  host's format; (d) the host profile; (e) project scope only, the project context
  sections (section Project context).
- Before any write, `setup` MUST ask the install question per part through the question
  tool. Part (a) MUST offer "hook plus pointer" (recommended, only when item 2 of the
  self-report probes true), "pointer only" and "stop". Parts (b) to (e) MUST offer
  "install" (recommended) and "stop". "stop" MUST leave the part out; the run MUST go
  on to the next part. `setup` MUST install only the chosen parts, in the chosen scope.
- The pointer MUST be one line in the context of the scope: "At session start, load
  the armory `core` skill and the host profile at <path>." The part after "skill" MUST
  go when the profile sits in the same context. The line MUST sit at the top of that
  context, before the first section.
- When skill load takes its fallback, the pointer MUST name the path of `core` in the
  clone. With no editable context, the report MUST print the pointer as a manual step.
- `setup` MUST name `scripts/core-context.sh` of the armory clone as the hook command
  candidate. It prints `core` as plain stdout when its input names no hook event.
- An embedded copy of `core` MAY go into the context only when the user asks for it,
  between `<!-- armory core -->` and `<!-- /armory core -->`, so a rerun can refresh it.
- Skills MUST reach the host by symlink from the armory clone into its skill location.
  When the host cannot follow links, `setup` MUST copy them.
- The host MUST render the six cards of `templates/agents/` (next to this file), one
  per project agent (`delegate` section What each agent returns), into its agent format
  at the agent location of self-report item 5. With no agent format, the cards MUST take
  the agent-card fallback. The fields are name, description, model, effort and
  isolation. `{{MODEL}}` MUST be the id that section Model mapping gives for the tier
  of the card's default row (`delegate` section Models), the tier name on Claude Code.
  `{{EFFORT}}` MUST be that row's effort. Drop a placeholder line left empty.
- In project scope, when it installs the hook or the skills in the repo, one question
  per run MUST ask whether the host files that `setup` writes inside the repo (hook
  config, skill links) are local and ignored by git, or committed with relative paths.
- In session scope, `setup` MUST NOT write any file or ask the install question. It
  MUST load `core` and the host profile into context. It MUST print the manual steps
  per part of the project scope inside a repo, else of the global scope.
- After the writes, `setup` MUST list every write back, with its part and path.
- A rerun MUST be idempotent. Each item already present MUST be reported as present,
  with a refresh offered. A marker block, the pointer line, a hook entry or a skill
  link MAY be refreshed after the user's yes. The project context and the agent cards
  follow section Project context.
- An item that a host plugin already provides MUST count as present; for the hook,
  present MUST mean probed active.
- A profile written in the same run as the hook install MUST list the hook as fallback
  until a rerun probes it active.

## 6. Project context

Project scope only. `setup` hands these sections to the host, which writes them.

### Flow

- MUST load `code` for the branch, `delegate` for the default rows and `test` for the
  levels, each by skill load.
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

- The host MUST write the sections into its project context and MUST report the path.
- Documentation MUST live in the docs folder, `<docs>`. Only the README stays at the root.
- The project context `## Rules` MUST hold the line `Documentation lives in <folder>`
  (default `docs/`).
- The project context MUST have these sections: `## What this is` (first, one paragraph
  on what the project is), `## Commands`, `## Gates`, `## Test levels`, `## Glossary`,
  `## Caveats`, `## Rules` (project-only rules).
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

## 7. Report

- The report MUST hold: the scope; the host name and version; what was installed per
  part, with paths, the host profile and project context paths included; the fallbacks
  in force; the model mapping; the other hosts found, each with "run `setup` from that
  host"; usage notes (how to load each skill on this host, and how to rerun or
  refresh); the Claude-specific items the host could not bind; in project scope, also
  the gates that are `off`.
