# Plan: the `setup` skill and host-neutral skills

Branch: `setup-skill`, cut from `extract-agent-browser`. Plan file after approval:
`docs/plans/setup-skill.md`. Markers: `req: setup-skill/TR-n`.

## Context

`init-project` sets up one project for Claude Code only. The user wants one interactive
`setup` skill that works on Claude Code, Codex CLI, Cursor and GitHub Copilot (and any
host that reads a SKILL.md), with three scopes, a self-report by the host instead of a
host table, an install question before any write, a fallback always on offer, and a
report with usage notes. Armory owns no file of its own on the host: the host decides
where its global context and its project context live and writes there. The skills
still speak Claude Code (about 150 invocation parentheses, `AskUserQuestion`, plan mode,
worktrees, and `AGENTS.md` as a fixed file name), so the same task makes them
host-neutral. Decisions come from six quiz rounds on 2026-10-31.

## Goal

One `setup [global|project|session]` skill replaces `init-project` and installs armory on
the host it runs in, by asking the host what it can do and where it keeps its context,
and the user what to install. Every skill and card uses host terms that `core` defines
once and the host profile binds, so a rule reads the same on every host and points to
its fallback where a capability is missing.

## Design, as decided

1. **Shape.** `setup` replaces `init-project` (`git mv`, templates stay under it). With no
   scope argument, the first question asks the scope.
2. **Self-report by the host, claim plus probe.** Items: host name and version; hook
   events (session start, subagent or task start), their config file and output format;
   skill locations (project, global); its global context and its project context (the
   files it loads on its own, per scope) and whether it can edit them; agent format and
   location, or none; available models and ids; tools (question tool, shell, file
   write, spawn, worktree isolation, plan mode). Each claim names a path or command and
   the host checks it. A failed probe means unsupported. The user confirms or corrects.
3. **Other hosts** found on the machine: listed in the report with "run `setup` from that
   host". Nothing is written for them.
4. **Model mapping.** `setup` proposes tiers to host ids (fable: strongest reasoning;
   opus: strong default; sonnet: fast and cheap; haiku: smallest); the user confirms or
   edits. On Claude Code the mapping is the identity.
5. **Host profile, host-placed.** `setup` defines the profile block: host name and
   version, term bindings, capabilities with the fallback in force, tier mapping, date,
   between the markers `<!-- armory profile -->` and `<!-- /armory profile -->`. The host
   picks where it keeps it (its global context by default) and reports the path; a rerun
   refreshes the block in place. A host with no editable place keeps it in context for
   the run and the report prints it for the user to store. Session scope keeps it in
   context only.
6. **Project context, host-placed.** The project sections (`## What this is`,
   `## Commands`, `## Gates`, `## Test levels`, `## Glossary`, `## Caveats`, `## Rules`,
   with today's questions, checks and formats) are content `setup` hands to the host; the
   host writes them into its project context (AGENTS.md, CLAUDE.md, a rules file, as it
   loads them) and reports the path. The skills say "the project context" and name the
   sections; every actor reads the path from the profile. In this repo the project
   context is `AGENTS.md`.
7. **Install parts and question.** Parts: (a) core injection, (b) skills reachable by
   the host, (c) agents in the host's format, (d) the profile, (e) project scope only:
   the project context sections. Per part: "hook plus pointer (recommended, only when the
   host has the hook)", "pointer only", "stop". The pointer is one line in the host's
   context: load `core` at session start (and the profile when it sits elsewhere). An
   embedded copy of `core` (marker block, refreshable) only on request. Skills: symlink
   by default, copy when the host cannot follow links. Agents: the host renders the five
   templates (name, description, model tier, effort, isolation) into its agent format,
   or into a section of its project context. Every write is listed back. Reruns are
   idempotent: present items are reported, a refresh is offered.
8. **Scopes.** Global: global hooks, global skill location, global pointer, the profile.
   Project: project hooks, project skill location, project pointer, the project context
   sections and the agent files, the profile when missing; `setup` asks per run whether
   the host files it writes inside the repo (hook config, skill links) are local and
   ignored or committed with relative paths. Session: nothing on disk; `core` and the
   profile in context, the mapping asked, the manual steps printed.
9. **Host terms.** `core` section Host terms defines once: question tool, skill load,
   spawn, agent card, worktree, plan mode, hook, global context, project context, each
   with its fallback (plain-text questions one round at a time with numbered options and
   a marked default; the main session does the work itself under the card's rules;
   coders one at a time; an explicit approval question; the pointer; a context the host
   has no editable place for stays in the run and in the report). Rules in other skills
   use the terms and point to the fallback there. Fable, Opus, Sonnet, Haiku stay as
   tier names; the profile maps them. Invocation parentheses go everywhere; frontmatter
   trigger phrases stay; the browse skill is named "the `browse` skill of the
   agent-browser plugin".
10. **Hook script.** Unchanged: `hooks/hooks.json` and `scripts/core-context.sh` inject
    `core` only; the profile reaches sessions and custom subagents through the host's
    context. A non-Claude host with a plain-stdout hook may call the same script from
    the clone; `setup` names it as the hook command candidate.
11. **README.** Install story: clone, then run `setup` from your host; on Claude Code
    install the plugin first and run `/armory:setup`. The Claude plugin commands stay.
12. **Size gate.** A commit that pushes a skill past `max-lines` raises the value to the
    new size plus 5 in the same commit. Slimming is a recorded follow-up.
13. **Report.** Scope; host and version; what was installed per part with paths (the
    profile path, the project context path included); the fallbacks in force; the model
    mapping; other hosts found; usage notes (how to load each skill on this host, how to
    rerun or refresh); the Claude-specific items the host could not bind.

## Requirements

- BR-1: MUST offer one skill `setup`, invoked as `setup [global|project|session]`, that
  replaces `init-project`; with no scope its first question MUST ask the scope.
- BR-2: MUST get the host's self-report, item by item, each claim with a probe, before
  any other step; the user MUST confirm or correct it; a failed probe is unsupported.
- BR-3: MUST list each other host found with "run `setup` from that host" and write
  nothing for it.
- BR-4: MUST propose the tier mapping and get it confirmed or edited; identity on Claude
  Code.
- BR-5: MUST hand the profile block to the host, which places it and reports the path;
  session scope keeps it in context only; a rerun refreshes the block.
- BR-6: MUST ask the install question per part before any write, install only the
  chosen parts in the chosen scope, list each write back, and be idempotent on rerun.
- BR-7: Project scope MUST hand the project context sections to the host with the
  current questions, checks and formats; the host writes them where it loads project
  context and reports the path.
- BR-8: MUST end each run with the report of design point 13.
- BR-9: Every skill and card MUST use only host terms, section names and skill names;
  each rule that needs a capability MUST point to its fallback.
- BR-10: The README MUST tell the install story of design point 11.

## Plan items, in execution order

- TR-1 (BR-1), Sonnet row: `git mv skills/init-project skills/setup`; frontmatter
  `name: setup`, new description; every live `init-project` reference becomes `setup`
  (skills, `templates/AGENTS.md`, `AGENTS.md`, `README.md`, `docs/DESIGN.md`, both
  manifests). `docs/plans/` and `docs/archive/` stay.
  tests: none, a rename; `lint` passes and `git grep -n init-project -- ':!docs/plans'
  ':!docs/archive' ':!docs/DESIGN.md'` prints nothing (the DESIGN history bullet is
  exempt)
- TR-2 (BR-9), every writer for its own files: a commit that makes a skill longer than
  its `max-lines` MUST raise the value to the new size plus 5 in the same commit;
  `setup` gets its own value the same way.
  tests: none, the size check inside `lint` passes on every commit
- TR-3 (BR-9): `core` gets section Host terms (appended as section 7): the nine terms,
  one fallback each, "the profile binds each term and names the context paths". In
  section Writing and questions `AskUserQuestion` becomes "the question tool"; "A plugin
  hook injects them" becomes "the hook, or the pointer"; `AGENTS.md` mentions become
  "the project context"; the `/core` parenthesis goes.
  tests: none, prose
- TR-4 (BR-9, BR-4): `delegate` uses the host terms, points per rule to the fallback in
  `core` section Host terms (worktree, spawn, hook in Briefs), uses "the question tool"
  in the Fable question, says once that the four model names are tiers the profile maps,
  and says "the project context" for `AGENTS.md`; its parentheses go.
  tests: none, prose
- TR-5 (BR-9): `plan` uses the host terms; plan mode and "exiting plan mode is the
  approval" point to the approval-question fallback; `AskUserQuestion` in Amendments
  becomes "the question tool"; "the project context" for `AGENTS.md`; its parentheses go.
  tests: none, prose
- TR-6 (BR-9), Sonnet row: in `audit`, `code`, `implement`, `research`, `review`, `test`,
  the five `skills/setup/templates/agents/*.md` and `.claude/agents/*.md`: every
  invocation parenthesis goes; `AGENTS.md` becomes "the project context" (sections keep
  their names); `code` uses the worktree and spawn terms; the browse skill loses its
  slash form in `core`, `research`, the researcher cards and this repo's `AGENTS.md`
  caveat.
  tests: none, prose; `git grep -nE '\(`/' -- skills .claude | grep -v '// req:'` prints
  nothing (the marker example in `test` section Markers is exempt) and
  `git grep -n 'AGENTS.md' -- skills .claude` prints only `templates/AGENTS.md` paths and
  the example in `core` section Host terms
- TR-7 (BR-1): `setup` states the invocation and asks the scope first when none is given.
  tests: none, prose
- TR-8 (BR-2, BR-3): `setup` lists the self-report items with their probe kinds, the
  unsupported rule, the confirmation step, and the other-hosts rerun hint.
  tests: none, prose
- TR-9 (BR-4): `setup` proposes the tier mapping, asks to confirm or edit, identity on
  Claude Code.
  tests: none, prose
- TR-10 (BR-5): `setup` defines the profile block (markers, fields), the host-placed
  rule with the reported path, the refresh on rerun, the no-editable-place fallback, and
  the per-scope rule.
  tests: none, prose
- TR-11 (BR-6): `setup` holds parts (a) to (e), the install question per part, the
  pointer line, the embedded copy on request, symlink-then-copy for skills, the agent
  rendering rule, the per-run question on local versus committed repo writes, the list
  back, the session manual steps, and the idempotent rerun.
  tests: none, prose
- TR-12 (BR-7): `setup` keeps the current Questions, Answer checks and section formats
  for project scope as content handed to the host; the host writes them into its project
  context and reports the path; agent files go to the host's agent location; repo writes
  keep the current flow (task branch, commit, finish question).
  tests: none, prose
- TR-13 (BR-8): `setup` ends with the report items of design point 13.
  tests: none, prose
- TR-14 (BR-10, BR-1), Sonnet row: README install story; the plain-symlink loop and the
  pointer note go; the skills table and Agents section name `setup`; this repo's
  `AGENTS.md` What this is and the `docs/DESIGN.md` injection bullets say "hook or
  pointer" and "the project context".
  tests: none, prose

TR-7 to TR-13 go to one writer in one brief; one commit per TR.

## Test scope

No existing test case changes. No new test: the task changes skill text and docs only.
`max-lines` rises by TR-2: `core` to about 120, `delegate` to about 146, `setup` to its
size plus 5, `plan` only if it passes 130, any other skill that grows past its limit.

## Execution

- Branch and plan-file commit; the plan's caveats into this repo's `AGENTS.md`.
- Wave 0: TR-1 (Sonnet writer, this checkout). Then in parallel, each agent in its own
  worktree reset to the task branch: B writer (Opus) TR-3 `core`; C writer (Opus) TR-4,
  TR-5 `delegate`, `plan`; D writer (Sonnet) TR-6 six skills and cards; E writer (Opus)
  TR-7 to TR-13 `setup`. Cherry-pick each onto the task branch, `lint` and `unit` after
  each, reviewer per result.
- Wave 2: TR-14 (Sonnet writer). Final review with whole-task checks; task end per
  `code` section Task end; acceptance: `/setup session` and `/setup project` run on this
  repo in Claude Code (the self-report, the questions, the report), nothing written by
  the session run.

## Risks

- A host can report a capability it lacks; probes catch most, unprobed claims count as
  unsupported.
- No gate runs on Codex, Cursor or Copilot; only manual acceptance there proves BR-1 to
  BR-8 on those hosts.
- Two hosts on one project may write two project contexts with the same sections; the
  report names the path so the user sees it.
- A symlinked skill breaks when the clone moves.
- The skills grow past their earlier limits until the slimming follow-up.

## Stack choices

Skill text only; no script change; no dependency.

## Out of scope

A host table; writes for other hosts; armory-owned files on the host; changes to
`hooks/hooks.json` and `scripts/core-context.sh`; slimming the skills (follow-up);
`docs/plans/` and `docs/archive/`; an uninstall command.

## Accepted tech debt

- Skills exceed their earlier size limits until the slimming follow-up.
- The host renders the agent cards and places the project context from prose; output
  can differ between hosts and runs.

## Overrides

None.

## Caveats

- The profile and the project context live where the host put them; every actor reads
  their paths from the profile block, not from a fixed file name : skills/setup/SKILL.md
- Skills symlinked into a host's skill location point at the clone path; moving the
  clone breaks them : skills/setup/SKILL.md

## Gates

lint, unit: on (the only gates of this repo).

## Verification

- `lint` and `node --test scripts/` pass at every commit; the TR-1 and TR-6 grep checks
  print what their lines say.
- `/setup session` in Claude Code on this repo: the self-report names the hooks, the
  skills path, the agents dir, the context files and the identity mapping; the report
  prints; no file changes. `/setup project` on a scratch directory: the host writes the
  project context sections, the agents and the profile, and reports their paths.
- Reviewer per `code` section Review loop; final review with whole-task checks.

## Amendment 1 (2026-10-31, after the wave-1 and wave-2 reviews)

Approved by the user through the question tool. The reviews of 19858c4, d0e9a28..5c9f9f9,
a571086 and 94f16ca..2f7d912 found one Must fix and three out-of-scope findings.

- TR-15 (BR-9): the TR-6 `tests:` grep MUST exclude the `req:` marker example (edited
  above); `code` section Caveats MUST point to `core` section Reports as the
  home of the caveat format, not to `setup` section Write; `core` section Tools and
  background tasks MUST say "a tracked background task of the host" in place of the
  Claude Code parameter.
  tests: none, prose
- TR-16 (BR-6), defect in built code: in project scope, every write of `setup` section
  Install (the project context sections included) MUST run at the Flow step "the files",
  before the commit and the finish question.
  tests: none, prose

Writer choices accepted as design (point 7 and point 8 refined):

- No scope given: the recommended option is `project` inside a repo, else `global`.
- The embedded copy of `core` sits between `<!-- armory core -->` and
  `<!-- /armory core -->`.
- The pointer text: "At session start, load the armory `core` skill and the host profile
  at <path>."; the profile part is dropped when the profile sits in the same context;
  when skill load has no skill location, the pointer names the path of `core` in the
  clone; when no context is editable, the report prints the pointer as a manual step.
- Parts (b) to (e) offer "install" and "stop"; "stop" leaves the part out and the run
  goes on. Only part (a) offers "hook plus pointer", "pointer only" and "stop".
- The templates keep the tier names; a rendered card carries the mapped model id.
- A rerun may refresh a marker block, the pointer line, a hook entry or a skill link
  after the user's yes; the project context and the agent cards are never overwritten.
- An item that a host plugin already provides counts as present.
- The Should fix and Nice to have findings of the four reviews are fixed in this
  amendment's round; the scope additions ("host terms" in the `core` description, the
  question-tool pointers in `delegate` and `plan`) stay.

## Amendment 2 (2026-10-31, after the final review and the acceptance runs)

Approved by the user through the question tool. The final review (verdict Ship) left
three Should fix and two Nice to have findings, fixed in this round. The acceptance runs
(`setup session` on this repo, `setup project` on a scratch directory, both on Claude
Code 2.1.274) passed and left three gaps:

- TR-17 (BR-2, BR-6): item 2 of the self-report stays the capability claim; the hook
  term MUST bind only when a probe (a session or spawned agent whose starting context
  holds the `core` text) shows the `core` hook installed and active; part (a) of
  section Install MUST key on item 2, not on the bound term; a hook that a host plugin
  provides MUST count as present only when probed active; a profile written in the
  install run MUST list the hook as fallback until a rerun probes it active; section
  Install MUST say that session scope asks no install question, because it writes
  nothing, and prints the manual steps instead; the pointer line MUST sit at the top of
  the context it goes into, before the first section.
  tests: none, prose

Recorded, not changed: the project question set took four question-tool rounds for an
empty project (follow-up, with the slimming pass). The TR-1 and TR-6 check lines above
now exempt the DESIGN history bullet and the `core` example; TR-15 names `code` section
Caveats.

Recorded after the last review (482f2ed, verdict Ship), open: the activation probe
accepts either a session or a spawned agent, so a session-start-only hook binds the
term; "The probe" can be read as item 2's own probe. Both are wording items in `setup`
section Self-report.
