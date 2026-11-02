# Plan: debug-skill

Parent: `docs/milestones/new-skills.md` section Tasks, line `debug-skill`.

## Goal

The `debug` skill, adapted from mattpocock `diagnosing-bugs` (commit 4ae2317, MIT), and
a sixth agent card, `debugger`, land. The main session sends each bug whose cause
neither the plan nor a diagnose-only report names to the debugger; the debugger
diagnoses it with `debug` and, in the fix flow, fixes it under the `implement` fix
rules. Quiz on 2026-11-02: the TR items name the rules and the coder writes the new
prose; edits to existing files stay word for word. `debug` is loaded by the debugger
card, and by `code` when the main session debugs itself; a user's bug report goes
through `code` and `plan`.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

All items: `tests: none, prose rule in a skill, card or doc; these surfaces have no test
level, so lint and the review check them`.

- TR-1 (item 4 replaced by TR-6, item 6 by TR-9, `code` bullet by TR-13)
  (new-skills/BR-1, new-skills/BR-2,
  new-skills/BR-3, new-skills/BR-4, new-skills/BR-5, new-skills/BR-11,
  new-skills/BR-12): a new
  `skills/debug/SKILL.md` MUST open like the other skills (frontmatter `name`,
  `description`, `max-lines` at the line count plus 5; the RFC 2119 line; the `core`
  load line), with the
  description `Diagnosis of a bug whose cause is not known: feedback loop, reproduce
  and minimise, ranked hypotheses, one-variable probes, tagged debug logs, cleanup,
  redaction. Loaded by the debugger card, and by \`code\` when the main session debugs
  itself; "/debug".` It MUST hold these numbered sections, in this order, each rule
  with one RFC 2119 word and each step with a done condition an agent can check:
  1. Redact: each command, output and artifact the actor shows MUST replace each
     secret with `<REDACTED>`; a loop reads credentials from the environment; a quote
     holds only the lines with the signal; when redacted output is not enough, the
     actor reports `stuck:`.
  2. Feedback loop: no hypothesis and no theory from reading code before the loop
     exists. The ways to build it, in order of preference: a failing test at the seam
     that reaches the bug; an HTTP script against a running dev server; a CLI run on a
     fixture, diffed against a known-good output; a headless browser script; a replay
     of a captured trace; a throwaway harness; a property or fuzz loop; a bisection
     harness for `git bisect run`; a differential run of two versions or configs.
     Tighten it: faster, an assertion on the exact symptom, deterministic (pinned time,
     seeded random, isolated files and network). A flaky bug: raise the reproduction
     rate. Done when one command, already run once with its output shown, goes red on
     the reported symptom, gives the same verdict each run (a flaky bug: a pinned high
     rate), runs in seconds and needs no human. With no such loop, the actor MUST stop
     and report `stuck:` with what it tried and what it needs: access to an environment
     that reproduces the bug, a redacted captured artifact, or a yes for temporary
     instrumentation.
  3. Reproduce and minimise: the loop shows the reported symptom, not a nearby
     failure, on several runs; the exact symptom is captured. Cut inputs, callers,
     config, data and steps one at a time, with a loop run after each cut. Done when
     removing any remaining element turns the loop green.
  4. Hypotheses: 3–5 ranked hypotheses before testing any, each with a falsifiable
     prediction in the form `If <X> is the cause, then <changing Y> makes the bug go
     away`; a hypothesis with no prediction is dropped or sharpened. The actor tests
     its own ranking and records a verdict for each: confirmed, refuted or untested.
  5. Probes: each probe tests one prediction and changes one variable. A debugger or
     REPL first, then targeted logs at the boundaries that tell hypotheses apart; MUST
     NOT log everything and grep, and MUST name the targeted log instead. Each debug
     log carries one unique prefix for the run, such as `[DEBUG-a4f2]`. A performance
     bug gets a baseline measurement first, then a bisection.
  6. Fix and cleanup: the fix follows `implement` section Fixing and refactoring, and
     the minimised repro becomes its regression test. Done when the original loop
     passes, a grep for the prefix shows no hit, each throwaway harness is deleted, and
     the commit message of the fix states the confirmed hypothesis.
  `code` (section head, the "codes itself" bullet) MUST read `- When the main session
  codes itself, it MUST load \`implement\` and \`test\`; for a bug whose cause the plan
  does not name, also \`debug\`.` In the same commit, every skill list MUST name
  `debug`: `docs/DESIGN.md` section 1 (the skill-set line, "eleven skills"), section 4
  (a Home row `` `debug` `` : `none (new)` : `debugger; main session when it debugs
  itself`), this repo's `AGENTS.md` section What this is, and the `README.md` Skills
  table (a row in the form of the others).
  tests: none (see above)
- TR-2 (card description, opening line and report replaced by TR-10) (new-skills/BR-6,
  new-skills/BR-10, new-skills/BR-12): a new
  `skills/setup/templates/agents/debugger.md` MUST take the form of `coder.md`: name
  `debugger`; description `Diagnoses and fixes one bug whose cause is not known: a
  feedback loop and ranked hypotheses first, then the regression test and the fix. Use
  for every delegated bug with no known cause.`; `model`, `effort` placeholders;
  `isolation: worktree`. Its body MUST say: you diagnose and fix one bug; load `core`
  when its rules are not in context, then `debug`, `implement` and `test`; reset and
  verify the worktree as the coder card does; follow the brief in full; the stuck rule
  of the coder card. Report, in this order: the worktree branch; the loop command and
  its last output, redacted; the hypotheses in rank order, each with its verdict; gate
  results, one line per gate; the final test-scope list; uncovered lines; what was
  skipped; any risk; the two `core` report slots. The rendered
  `.claude/agents/debugger.md` MUST be that card with `model: opus`, `effort: high`. In
  the same commit:
  - `delegate` section What each agent returns MUST read "these six: coder, debugger,
    reviewer, researcher, writer and planner", and "The coder and the debugger also
    return `stuck: <why>`" where it reads "The coder also returns `stuck: <why>`".
  - `delegate` section Models, the default rows line, MUST add `debugger "Debugging"
    (Opus high)`.
  - `setup` section Write MUST read "the six cards of `templates/agents/`".
  - `docs/DESIGN.md`: section 1 MUST say six agents and name `debugger`; section 4 the
    `setup` row MUST say "six agent cards", the actor table MUST hold a row `debugger`
    : `` `core`, `debug`, `implement`, `test` ``, and the `implement` and `test` Home
    rows MUST name `debugger` in Loaded by.
  - `README.md`: the Agents table MUST hold a `debugger` row (Opus, high); the
    `implement` and `test` rows MUST name `debugger` in Loaded by.
  tests: none (see above)
- TR-3 (routing bullet and Review loop text replaced by TR-13) (new-skills/BR-7,
  new-skills/BR-12): `delegate` section What each agent returns
  MUST hold, after the `stuck:` bullet: `- A bug whose cause the plan does not name MUST
  go to the debugger, not the coder. So MUST a coder's \`stuck: cause unknown\`; it
  MUST NOT get the retry of section Re-spawn and retry.` `implement` section Fixing and
  refactoring MUST hold, after "MUST NOT start a third fix before that.": `- A coder
  that still has no cause after that MUST report \`stuck: cause unknown\`, with the
  premise it removed.` `code` section Review loop MUST read "on each coder or debugger
  result" where it reads "on each coder result".
  tests: none (see above)
- TR-4 (new-skills/BR-11, new-skills/BR-12): `lint` and `unit` MUST pass on every
  commit. A commit that takes a skill over its `max-lines` MUST raise it in that same
  commit to the new line count plus 5. After TR-3, a grep for `five` and `ten skills`
  in `skills/`, `docs/DESIGN.md`, `README.md` and `AGENTS.md` MUST show no stale count.
  tests: none (see above)
- TR-5 (new-skills/BR-12): the top-level `description` of
  `.claude-plugin/marketplace.json` MUST read `Personal Claude Code skills: core, plan,
  delegate, code, implement, test, debug, review, audit, research and setup.` The
  `implement` description MUST read "Loaded by the coder and debugger cards and by
  \`code\`" where it reads "Loaded by the coder card and by \`code\`", and its intro
  "for the coder or the main session when it codes" MUST read `for the coder, the
  debugger, or the main session when it codes`. `code` section Review loop MUST read
  "when the agent ran in a worktree" where it reads "when the coder ran in a worktree".
  `delegate` section Briefs MUST read "from the coder or debugger report" where it
  reads "from the coder report". Review findings 1, 2, 3.
  tests: none (see above)
- TR-6 (new-skills/BR-3): in `debug` section 4, "MUST test your own ranking and record
  a verdict for each hypothesis: confirmed, refuted or untested. Done when one
  hypothesis is confirmed." MUST become `Done when the ranked hypotheses, each with its
  prediction, are written.`; section 5 MUST end with `- MUST test your own ranking and
  record a verdict for each hypothesis: confirmed, refuted or untested. Done when one
  hypothesis is confirmed. When all are refuted, MUST go back to section 4.` Review
  finding 4.
  tests: none (see above)
- TR-7 (new-skills/BR-12): the `delegate` default-rows bullet MUST wrap at about 88
  with `"restating" (Sonnet low). A spawn MAY override the default with another row.`
  as its last line. This repo's `AGENTS.md` section What this is MUST rewrap to lines
  of 88 characters or less, with the same words. `debug` MUST drop its intro line "The
  fix rules are in \`implement\` section Fixing and refactoring." Review findings 5, 6,
  7.
  tests: none (see above)
- TR-8 (new-skills/BR-12): the `delegate` section Briefs bullet that TR-5 changed MUST
  wrap at 88 characters or less, with the same words. Defect in built code: the TR-5
  edit left a 102-character line.
  tests: none (see above)
- TR-9 (section 6 replaced by TR-12) (new-skills/BR-13, new-skills/BR-14): `debug` MUST
  name the two flows in its
  intro: the brief, or the user's request when the main session debugs itself, names
  the flow. A new `## 6. Diagnose only` MUST come before Fix and cleanup, which becomes
  `## 7.`: the flow MUST NOT write the fix and MUST end with the report instead; it MAY
  commit debug code (the loop, a harness, tagged logs), each commit subject starting
  with `debug(<id>):`; done when the report names the confirmed hypothesis, the loop
  command with its last output, a proposed fix outline and each debug commit. Section
  7 MUST start with `In the fix flow:` and keep its rules. `max-lines` rises when the
  count passes it. User's choice at acceptance: two flows.
  tests: none (see above)
- TR-10 (report item 4 replaced by TR-14) (new-skills/BR-15, new-skills/BR-12): the
  debugger card (template and the
  rendered `.claude/agents/debugger.md`) MUST describe itself as `Diagnoses one bug
  whose cause is not known, and fixes it in the fix flow: a feedback loop and ranked
  hypotheses first, then the regression test and the fix. Use for every delegated bug
  with no known cause.`; its body MUST open `You diagnose one bug, and fix it when the
  brief names the fix flow.` and MUST take the flow from the brief; its report MUST
  add, after the hypotheses, `In the diagnose-only flow: the items of \`debug\` section
  6.` The `README.md` Agents row MUST read `Diagnoses one bug whose cause is not known,
  and fixes it in the fix flow, in its own worktree.`
  tests: none (see above)
- TR-11 (fix sentence and `implement` bullet replaced by TR-13) (new-skills/BR-16,
  new-skills/BR-12): `delegate` section
  What each agent
  returns, after the debugger bullet, MUST hold: `- The main session MUST name the
  debugger's flow in the brief: diagnose only when the user asks for the cause; the fix
  flow when the user asks for a fix, or for a coder's \`stuck: cause unknown\`. When
  the request is unclear, it MUST ask the user. A fix after a diagnose-only run MUST go
  to the coder, with the cause and the debug commits in the brief.` `implement` section
  Fixing and refactoring MUST hold, after the `stuck: cause unknown` bullet: `- When
  the brief names debug commits, MUST revert each one after the fix passes, with
  \`git revert\`.` `delegate` `max-lines` MUST rise to the new count plus 5.
  tests: none (see above)
- TR-12 (bullets 2 and 4 replaced by TR-15) (new-skills/BR-17): `debug` section 6 MUST
  hold, in this order: `- MUST NOT
  write the fix. MUST end with the report instead.`; `- MAY commit debug code (the loop,
  a harness, tagged logs), only on a branch \`debug-<id>\` cut from the task branch,
  where \`<id>\` is the id of the run's prefix. MUST NOT merge it into the task
  branch.`; `- Each debug commit subject MUST start with \`debug(<id>):\`. Each debug
  commit MUST keep the \`on\` gates green: a loop test goes in skipped, with the prefix
  in its name.`; `- Done when the report names the confirmed hypothesis, the loop
  command with its last output, a proposed fix outline, and the debug branch with its
  commits, and no debug code is left uncommitted.` Review finding 1 and the user's
  choice of a separate debug branch.
  tests: none (see above)
- TR-13 (`implement` bullet replaced by TR-16, `delegate` merge bullet by TR-17)
  (new-skills/BR-18, new-skills/BR-12): `delegate` section What each agent
  returns: "A bug whose cause the plan does not name" MUST read "A bug whose cause
  neither the plan nor a diagnose-only report names"; in the flow bullet, "with the
  cause and the debug commits in the brief" MUST read "with the cause, the loop command,
  the proposed fix outline and the debug branch in the brief". `delegate` section
  Delegation and worktrees, after the merge bullet: `- A diagnose-only debugger's
  \`debug-<id>\` branch MUST NOT be merged; the main session keeps it and removes the
  worktree.` `code`: "for a bug whose cause the plan does not name" MUST read "for a bug
  whose cause neither the plan nor a diagnose-only report names"; section Review loop
  "each coder or debugger result" MUST read "each coder or fix-flow debugger result";
  section Task end step 8 MUST end with `It MUST also ask, for each \`debug-<id>\`
  branch, whether to delete or keep it.` `implement`: the bullet "When the brief names
  debug commits, MUST revert each one after the fix passes, with \`git revert\`." MUST
  read `- When the brief names a debug branch, MUST NOT merge it. MAY copy its loop
  test, without the debug prefix, as the regression test.` `max-lines` rises where a
  count passes it. Review findings 2, 3, 4.
  tests: none (see above)
- TR-14 (new-skills/BR-17): the debugger card report item 4 (template and rendered) MUST
  read `In the diagnose-only flow: the proposed fix outline, and the debug branch with
  its commits (\`debug\` section 6).` Review finding 7.
  tests: none (see above)
- TR-15 (Done clause replaced by TR-18) (new-skills/BR-17): in `debug` section 6, "MUST
  NOT merge it into the task
  branch." MUST read `MUST NOT merge it into the task branch; MUST name it in the report
  instead.`, and the Done bullet MUST end with `, and the checkout is back on the task
  branch.` in place of its final period. Re-review findings 1 and 4.
  tests: none (see above)
- TR-16 (new-skills/BR-18): the `implement` bullet "When the brief names a debug branch,
  MUST NOT merge it. MAY copy its loop test, without the debug prefix, as the regression
  test." MUST read `- When the brief names a debug branch, MUST NOT merge it; MUST write
  the fix on the task branch instead. MAY copy its loop test, without the debug prefix
  and the skip, as the regression test.` Re-review findings 4 and 6.
  tests: none (see above)
- TR-17 (new-skills/BR-18, new-skills/BR-12): in the `delegate` Models table, "a fix
  whose cause the plan names included" MUST read "a fix whose cause the plan or a
  diagnose-only report names included", and "Debugging: a bug whose cause the plan does
  not name" MUST read "Debugging: a bug whose cause neither the plan nor a diagnose-only
  report names". The `delegate` bullet "A diagnose-only debugger's \`debug-<id>\` branch
  MUST NOT be merged; the main session keeps it and removes the worktree." MUST read `-
  A diagnose-only debugger result MUST NOT be merged: the main session keeps its
  \`debug-<id>\` branch and removes the worktree.` Re-review findings 2 and 5.
  tests: none (see above)
- TR-18 (new-skills/BR-17): the `debug` section 6 Done bullet, which now reads "... and
  the debug branch with its commits, no debug code is left uncommitted, and the checkout
  is back on the task branch.", MUST end with `and the checkout is back on the branch
  the run started on.` A debugger in a linked worktree cannot check out the task branch,
  which the main session holds. Round-3 re-review finding 1.
  tests: none (see above)

Backslashes before backticks are escapes only. Wrap at about 88 characters, two-space
continuation, as each file does. One commit per TR; TR-4 holds no commit of its own.
The new prose MUST follow the four writing rules of this repo's `AGENTS.md` `## Rules`
and `core` section Writing and questions.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

None: the tests under `scripts/` use temporary fixtures, not the real skill files.

## Risks

- A sixth card grows every project's agent set; a project set up before this task
  needs a `setup` rerun to get the debugger.
- `debug` and `implement` both speak about bugs; TR-1 section 6 points at `implement`
  for the fix rules, so each rule has one home.
- The reviewer does not load `debug`; the debug-log grep and the hypothesis line in the
  commit message are checked only through the debugger report.

## Stack choices

None.

## Out of scope

- `retro` (task `retro-skill`).
- The source's HITL script, its `agents/` and `scripts/` folders, its glossary and ADR
  reads, and its seam rule (milestone Scope).
- A check of the hypotheses with the user before testing (milestone BR-3).

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` four commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`1c74a1e`); not a design rule, recorded for the user's approval.

## Caveats

None.
