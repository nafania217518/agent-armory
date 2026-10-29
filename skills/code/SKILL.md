---
name: code
description: >
  Coding workflow for any task that writes, adds, fixes or refactors code or picks a
  dependency: branch per task, requirements as tests (TDD), the smallest complete
  change, test gates from the project AGENTS.md, delegation to project agents, atomic
  commits. Use on every coding task and when the user says "/code", "implement",
  "fix", "refactor", "add a feature".
---

# code

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119. The project
`AGENTS.md` defines the gates, the commands and the model table; its `## Gates` section
says which SHOULD rules are off.

## 1. Start

- MUST run `git fetch origin`. The base branch is `git symbolic-ref --short
  refs/remotes/origin/HEAD`. MUST run `git switch -c <task-branch> <base>`. MUST NOT
  commit to the base branch.
- MUST read `AGENTS.md`: `## Commands`, `## Gates`, `## Models`, `## Rules`,
  `## Glossary`, `## Caveats`.
- MUST read the plan: `<docs>/plans/<task-branch>.md` when it exists, else the plan
  approved in plan mode in this conversation (`min`). Its tagged items are the task. No
  plan: MUST run the `plan` skill first (`/plan`, or `/armory:plan` in the plugin
  install); it asks the mode. In mode `none`, MUST write the requirements here as
  `TR-n [opus]: MUST <behavior>`, every item tagged. Each requirement gets its tests;
  every test name starts with its id (`test_tr3_...`). The report lists the
  requirements. A vague request gets the smallest version that does the core job.
- Implementation runs on Opus: the session (`/model opus`) or the `coder` agent. When
  the session model is not Opus: say so in one line and delegate (section 7). MUST NOT
  write code on Fable.

## 2. Understand first

- MUST read the code the task touches and list every place the change reaches: callers,
  tests, fixtures, config, exports. That list is the scope. Every item in it is part of
  the change; extra features are not.
- MUST check what the change could break for users: data it would destroy or expose,
  callers that stop working.
- Get the data shape right before the logic. Do first whatever helps every later phase.
- Aim at an end state you can check. A break in the middle is allowed only when you
  planned it and can undo it.
- Bug fix: MUST grep every caller of the function you touch, then fix the root cause once
  in the shared code. A guard that only hides the crash is not a fix.
- MUST NOT bolt a requirement onto the old design. Ask what you would have built if it had
  been there from the start, then deliver that in pieces.
- When two fixes that share one premise fail the same check: MUST write that premise in
  one sentence and remove it. MUST NOT start a third fix before that.
- Work that is not obvious at a glance or repeats: do one unit by hand, then build the
  tool that does the rest.
- SHOULD keep the domain terms in `AGENTS.md` `## Glossary`; add a term when the change
  introduces one.

## 3. The ladder

Take the first rung that fully works:

1. Does it need to exist? Skip features, options and flexibility nobody asked for; name
   them in one line.
2. Already in this codebase (a helper, component, service, pattern)? Use it the way the
   surrounding code does.
3. Standard library or platform feature? Use it, unless the project has its own.
4. An installed dependency? Use it. MUST NOT add a dependency for a few lines.
5. Can it be one line a reader gets at a glance? One line.
6. Otherwise: the minimum code that works.

Subtract before you add: take complexity out first.

## 4. TDD

- MUST load the `test` skill (`/test`, or `/armory:test` in the plugin install) before
  writing or changing a test. Its rules apply: levels, unit style, what to test,
  structure, speed.
- Tests are the only proof that code works.
- Requirement → test → code. Write the failing test first. See it fail for the reason you
  expect. Make the smallest change that makes it pass.
- Each requirement `TR-n` and each bug finding MUST have at least one test. Each edge
  case the requirement touches (the list in the `review` skill, section 3, item 1) and
  each failure path (invalid input, missing dependency, an error from a callee) MUST
  have its own test.
- Tests MUST call the code the way its user does and check the result that user sees.
  A test that still passes when every function returns nothing MUST be deleted.
- If an honest test is impractical, MUST NOT write a bad one. Say so in the report.
- Bug report or own finding: at least one test that reproduces it MUST come before the
  fix.
- Refactor: MUST pin the current behavior with a passing test, change the structure, then
  show the same test still passes.
- A defect in built code, or a requirement that changes during work, gets a new `BR-n`
  or `TR-n`. An old id MUST NOT be rewritten or renumbered; mark it
  `(replaced by TR-m)`. The plan amendment goes through the `plan` skill, section 10,
  before the work continues.
- Every feature MUST ship with its tests, unless the user says otherwise for that feature.

## 5. Gates

A gate has a command of the same name in `## Commands`: `lint`, `owasp`, `unit`,
`integration`, `contract`, `functional`, `e2e`, `coverage`. `## Gates` says which are `on`.

- Per commit: `lint` and `unit`, when `on`, MUST pass.
- Before handover: every `on` gate MUST pass, or the report names the failing gate.
- `owasp`: as in the `review` skill, section 2.
- `coverage`: run the command. The threshold lives in the build tools (`AGENTS.md`
  `## Commands`); do not compute a number yourself.
- An `on` gate with no command is a finding. Say so; do not skip it in silence.

## 6. Test scope

- Before a change, MUST list the existing tests it will break, rework or remove, with the
  reason (a removed module removes its tests; a renamed label changes its checks).
- MUST change only the listed tests.
- A failing test outside the list most likely points to a new bug: stop, find the root
  cause, report the test with proof. Then: expected change and the test was only missing
  from the list → add it to the scope; not expected → escalate to the user before any
  test changes.

## 7. Delegation

- `delegate` gate: the main session SHOULD NOT write production or test code itself.
  Coding goes to the agent that the `## Models` `Agent` column names for the task kind
  (`coder`, `reviewer`, `researcher`, `writer`; `init-project` creates them). No agent
  file in the project: a general agent with the row's model and effort.
- The item's tag picks the model of the spawn and overrides the agent file: `[opus]` by
  default; `[sonnet]` or `[haiku]` for mechanics; `[fable]` only for the items the plan
  tagged so, or for an item where the coder reports `stuck: <why>`. Such an item goes to
  the `researcher` agent on Fable; then the work returns to Opus. MUST NOT send an item
  to Fable "just in case".
- The brief MUST hold:
  - the requirements with their ids (section 1);
  - the test-scope list (section 6);
  - the `## Commands`, `## Gates`, `## Rules` and `## Caveats` lines that apply;
  - sections 2–6, 8, 9 and 11 of this skill, in short.
- `worktree-per-agent` gate: two or more coders at once SHOULD each run in their own
  worktree (the `coder` agent carries `isolation: worktree`). Two agents that run at
  once MUST NOT edit the same file.
- When a coder finishes: MUST merge its worktree branch into the task branch, then run
  `lint` and `unit`. MUST remove the merged worktree (`git worktree remove`). A worktree
  with uncommitted work waits for the user's decision.
- Keep the main thread small: send bulk reading and writing out, keep the summary.

## 8. Make it right

- MUST check data where it enters. Inside, trust it. Keep business logic in pure functions.
- MUST make the illegal value impossible to write. Parse outside data once, where it
  comes in. MUST NOT silence the compiler or the type checker.
- Operations MUST be idempotent: running twice, or again after a crash halfway, ends in
  the same state.
- Shared mutable state MUST have one writer, enforced by the structure. If two parts do
  not need the same mutable thing, give each its own.
- Code you move or merge MUST keep its error handling and validation.

## 9. Rules

- MUST NOT add an abstraction, wrapper, type conversion, option, config, boilerplate or
  "for later" code nobody asked for. Keep values in the form the platform gives you.
- MUST keep the structure the codebase has: its layers, interfaces and conventions. Code
  that is already clear and local: leave it.
- Readability: a human reads this code. The rules of the `review` skill, section 3,
  item 7 (names, line length, short high-level functions, chaining) apply to every line
  you write.
- Comment only the why the code cannot show, in one line.
- A shortcut with a known limit MUST carry the comment
  `tech-debt: <the limit>, <when to upgrade>`.
- Between options of equal size, MUST take the one that is correct on edge cases. A
  one-liner that needs decoding is not short.
- MUST NOT cut: validation at trust boundaries, error handling that prevents data loss,
  security, accessibility, the calibration real hardware needs, anything the user asked for.

## 10. Research

- You may have outdated information. MUST check at least 4 independent sources with
  `agent-browser` (the `browse` skill) for each claim about a library, API, model or tool. Prefer official
  documentation, changelogs and source code. Note the date of each source. Say when
  sources disagree and which one you trust and why.
- Anything worth noticing goes under `## Caveats` in `AGENTS.md`:
  `SHORT_DESCRIPTION : file_reference.md`.

## 11. Commits

- One requirement or one fix per commit. `lint` and `unit`, when `on`, green at each.
- Subject: one imperative sentence under 72 characters that says what was done, so that
  `git log --oneline` reads as the history of the task. Body MAY hold one line on why
  and the test that proves it.
- MUST NOT push.

## 12. Finish

- Finish one small unit and check it. Then start the next.
- Before the report, SHOULD run the `reviewer` agent on `<base>..HEAD` (`delegate` off:
  run the `review` skill yourself) and fix the Must fix findings. The review MUST show
  every `BR-n` and `TR-n` of the requirements document met by the diff or a test.
- A requirement that needs the user's answer: quiz, adjust the requirements and the plan
  through the `plan` skill, section 10, then continue.
- Acceptance: a quiz asks which items the user wants to try by hand, with the exact
  commands or clicks for each.
- Report, in this order: the requirements with ids and their status; the log of actions
  and the reason for each; gate results, one line per gate; what you skipped and when to
  add it; what you did not check; any risk the user must know.
