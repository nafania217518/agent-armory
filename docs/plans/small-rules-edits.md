# Plan: small-rules-edits

Parent: `docs/milestones/small-rules.md` section Tasks, line `small-rules-edits`.

## Goal

Four small rules from mattpocock/skills land, and `setup` becomes user-only. The facts
first move out of `setup`, then the key flips. A grep found four pointers that send a
working actor to `setup` for a fact: `implement` section Gates per commit (the gate
list, the coverage threshold), `plan` section Plan file (`<docs>`), `test` section
Levels (the level lines), and the `## Commands` format line of the `AGENTS.md` template
and its copy here. The pointers that only name who writes a thing (`core` and
`delegate` on the profile) stay. Quiz on 2026-11-02: `<docs>` moves to `core` section
Host terms.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill, template or project context; these
surfaces have no test level, so lint and the review check them`.

- TR-1 (small-rules/BR-5, small-rules/BR-7): one commit moves `<docs>`. `core` section
  Host terms, the project context term, MUST end with the sentence `Its \`## Rules\`
  line \`Documentation lives in <folder>\` sets \`<docs>\` for every actor.` `setup`
  section Write MUST drop the sentence "Every actor resolves `<docs>` from that line.".
  `plan` section Plan file MUST read "`core` section Host terms sets `<docs>`." where
  it reads "`setup` section Write sets `<docs>`.".
  tests: none (see above)
- TR-2 (small-rules/BR-5, small-rules/BR-7): `implement` section Gates per commit: the
  line "The gate list and the project context's lines are in `setup` section Write."
  MUST read `The gates and their commands are in the project context \`## Gates\` and
  \`## Commands\`.`; in the `coverage` bullet, "The threshold is in `setup` section
  Answer checks." MUST read `The build tools hold the threshold.`
  tests: none (see above)
- TR-3 (small-rules/BR-5, small-rules/BR-7): `test` section Levels: "A project adds to
  these lines in its project context (`setup` section Write)." MUST read `A project
  adds to these lines in its project context \`## Test levels\`.`
  tests: none (see above)
- TR-4 (small-rules/BR-5, small-rules/BR-7): the `## Commands` format line in
  `skills/setup/templates/AGENTS.md` and in this repo's `AGENTS.md` MUST read
  `Format: \`<check>: <command>\`; \`implement\` section Gates per commit says how to
  run them.`
  tests: none (see above)
- TR-5 (small-rules/BR-1): a new file `skills/code/templates/pr.md` MUST hold:
  `## Summary` / `Format: the smallest visual that makes the change clear: pseudocode,
  a call tree, a file tree, a diff sketch or a Mermaid diagram, each next to one or two
  lines of text.` / `## Evidence` / `Format: \`Before: <a failing test run, an output
  or a screenshot>\`, then \`After: <the same check after the change>\`.` /
  `## Merge danger` / `Format: \`Door: <one-way | two-way>\` and one line on why, then
  \`Blast radius: <what the merge can affect>\`.` (a blank line between a heading and
  its format line, and between sections). `code` section Finish MUST hold a second
  bullet: `- A PR body MUST take the sections, order and format lines of
  \`templates/pr.md\`, relative to this skill.`
  tests: none (see above)
- TR-6 (small-rules/BR-2): `audit` section Map first, the "Big repo" bullet MUST read
  `- Big repo: SHOULD go deep where a mistake costs the most, not file by file. SHOULD
  read first the files that \`git log\` shows changing most often.`
  tests: none (see above)
- TR-7 (small-rules/BR-3): this repo's `AGENTS.md` `## Rules` MUST hold, after
  "Documentation lives in docs/", four bullets:
  `- A skill description MUST name each distinct case once; synonyms of one case MUST
  become one trigger.`
  `- A skill line that the model already follows by default MUST be deleted, as a whole
  sentence.`
  `- Each step in a skill MUST name a done condition that an agent can check.`
  `- A new or edited \`MUST NOT\` rule MUST also name the behavior to do instead.`
  tests: none (see above)
- TR-8 (replaced by TR-11) (small-rules/BR-4, small-rules/BR-7): `setup` frontmatter
  MUST hold
  `disable-model-invocation: true`, and its description MUST read: `User-only: the
  model MUST NOT load this skill on its own; only the user starts it. Sets up armory on
  the host you run in, in one scope: global, project or session. Asks the host what it
  can do, the user what to install, then writes and reports. Use for "/setup", "set up
  armory", "add the project agents".` `docs/DESIGN.md` section 4, the `setup` row,
  column Loaded by, MUST read `main session, when the user starts it (user-only)`.
  tests: none (see above)
- TR-9 (small-rules/BR-6, small-rules/BR-7): `lint` and `unit` MUST pass on every
  commit. A commit that takes a skill over its `max-lines` MUST raise it in that same
  commit to the new line count plus 5. After TR-8, a grep for `` `setup` `` outside
  `skills/setup/` MUST show no pointer that sends a working actor to a `setup` section
  for a fact.
  tests: none (see above)
- TR-10 (small-rules/BR-5, small-rules/BR-7): the sentence "Every actor MUST read the
  global context and project context paths from the block, not from a fixed file
  name." MUST leave `setup` section Host profile. `core` section Host terms MUST hold,
  after "...; `setup` writes it.": `Every actor MUST read the global context and project
  context paths from the profile, not from a fixed file name.` The `AGENTS.md` caveat
  on profile paths MUST point at `skills/core/SKILL.md`. Review finding 1.
  tests: none (see above)
- TR-11 (small-rules/BR-3, small-rules/BR-4): the TR-8 description MUST read, in its
  first sentence, `User-only: the model MUST NOT load this skill on its own; it MUST ask
  the user to start it instead.`; the rest of TR-8 stays. Review finding 2: the
  `MUST NOT` named no behavior to do instead.
  tests: none (see above)
- TR-12 (small-rules/BR-7): `docs/DESIGN.md` section 4, the `code` row, column Home,
  MUST read `` `code` + template `pr.md` ``. Review finding 3.
  tests: none (see above)
- TR-13 (small-rules/BR-5, small-rules/BR-7): the sentence "In project setup, the task
  branch takes the place of that commit (`setup` section Flow)." MUST leave `code`
  section Caveats. In `setup` section Flow, "Caveat writes: `code` section Caveats."
  MUST read `Caveat writes: \`code\` section Caveats, with the task branch in the place
  of the plan-file commit.` Recorded-items quiz: the user chose to fix the pointer.
  tests: none (see above)

Backslashes before backticks are escapes only. Wrap at about 88 characters, two-space
continuation, as each file does. One commit per TR; TR-9 holds no commit of its own.
TR-7 binds TR-11: its description names each case once and its `MUST NOT` names the
behavior instead.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: the tests under `scripts/` use temporary fixtures, not the real skill files.

## Risks

- `core` reaches every actor through the hook; TR-1 adds one sentence to every load.
- If `claude plugin validate` rejects `disable-model-invocation`, TR-8 fails `lint`; the
  coder then reports `stuck:`.
- A missed pointer leaves an actor without a fact; TR-9 greps for it.

## Stack choices

None.

## Out of scope

- The pointers that only name who writes a thing: `core` section Host terms (the
  profile), `delegate` section Models, `README.md`.
- The coverage default (90% per core module): a setup-time fact, it stays in `setup`
  section Answer checks.

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` two commits ahead of `origin/master` (no push), so the branch cuts from local
  `master` (`8a3cfc7`); not a design rule, recorded for the user's approval.

## Caveats

None.
