# Plan: Conflict fixes across the armory skills

Parent: none (no milestone)

## Goal

Apply the 49 user-approved fixes for rule and flow conflicts that 13 per-skill reviews
and one cross-skill review found (2026-11-06). Branch `conflict-fixes`, cut from
`origin/HEAD` (master c1d028a). Plugin version 0.2.2 → 0.2.3. Plan file:
`docs/plans/conflict-fixes.md`. Finding ids `<skill>-<n>` refer to the review findings.

## Requirements

Format: `BR-<n>: MUST <behavior>`.

- BR-1 (code-1): The finish answer "merge into `<base>`" MUST merge into the local
  default branch. With a remote, a separate push question MUST follow. With a tracker
  bound, the items MUST be set done only after that push, or after the merge when there
  is no remote.
- BR-2 (code-5, code-7): The stray-task check MUST run after the quiz loop and before
  the report. Its caveat commit and a cleanup commit MUST each get `lint` and `unit`
  and no re-review. The tracker done comment MUST name the plan file path only when the
  plan file is kept. Every Task-end step reference MUST point to the step it means.
- BR-3 (code-3): A follow-up MUST be a new open tracker item, and the quiz answer MUST
  count as the yes to that create. With no tracker bound, it MUST be a line in the task
  report.
- BR-4 (code-2, code-4, code-6): The claim MUST be the run's first write on its own
  item. Plan items MUST start in plan order; an item that needs an earlier one MUST wait
  for its merge. The main session MUST write each caveat it receives or finds.
- BR-5 (implement-3): A coder MUST NOT fix a bug that its brief or plan item does not
  name and that its own change did not introduce. It MUST report `stuck:` when the bug
  blocks the work, else record an out-of-scope finding. Such a finding on code the task
  built MUST get its `TR` before the next brief.
- BR-6 (core-1): Outside a plan or code run, the main session MUST ask the user before a
  caveat write.
- BR-7 (core-2, core-3): A skill MUST NOT record or quiz an override made during the
  work. A tracker task item body MUST hold its Tasks-format line, not be only that line.
- BR-8 (plan-1, plan-2, plan-3): A milestone or task run MUST read its parent doc on
  `<base>`, and ask the user to merge the parent branch when `<base>` lacks it. The
  tracker amendment lines plan:229-231 MUST be deleted. A task that its milestone doc
  does not list MUST get its Tasks line as an amendment.
- BR-9 (implement-1): The `implement` scope and finish lists MUST NOT name tests; the
  test-scope list alone MUST scope test changes.
- BR-10 (implement-2, implement-4, implement-5, implement-6): `implement` MUST NOT ban
  type conversion or keep the platform-form SHOULD. A design-misfit stop MUST be
  `stuck: <misfit>`. A new case in an existing file MUST NOT be called an addition. The
  domain-term report rule MUST be deleted.
- BR-11 (test-1, test-4, test-5): The project context `## Test levels` MAY add to or
  change the level lines, and MUST win. The stub rule MUST name a double and a test as
  two actors. An integration test MUST start the real part or the service double.
- BR-12 (debug-1, debug-2, debug-3): In diagnose-only, the loop MUST be committed when
  it is a file. The fix-flow done check MUST be: the diff against the task branch holds
  only the fix and its regression test. A performance bug MUST get a baseline and no
  bisection order.
- BR-13 (review-1): A requirement not met MUST be Must fix. A gate with no command, a
  changed file no gate covers and a `TR` with no `BR` MUST be Should fix process
  findings.
- BR-14 (review-2, review-3, review-4, review-5): The test-scope check MUST accept
  recorded scope additions. `Answers:` and `Not checked:` MUST have no empty-value form.
  `review` and `code` MUST NOT check agent reports against the diff. `Re-review:` lines
  MUST be per finding sent to fix.
- BR-15 (cross-2): A finding on a design rule that the plan's Overrides name MUST NOT be
  reported; the reviewer MUST check the code against the override instead.
- BR-16 (audit-1..4): An audit MUST run each `on` gate on the whole tree, and a gate
  failure MUST be Must fix. It MUST reuse the review finding groups and format. The
  suite check MUST have no narrowing list. The tech-debt grep MUST take the target.
- BR-17 (delegate-1): Only a spawn that does not fail MUST get the worktree merge and
  removal.
- BR-18 (delegate-2, delegate-3): The `BR` quote source MUST point to `plan` section
  Requirements. The Fable question MUST be asked once per task.
- BR-19 (research-1, research-2): The Sonnet stop MUST anchor to the unclear source.
  `research` MUST hold no caveat-write section; its Result item 3 MUST point to `core`
  section Reports.
- BR-20 (retro-1): Class Checks and review rules MUST also apply to a mistake that was
  made. A judgement miss MUST get a rule where it happened, or in `review`.
- BR-21 (retro-2, retro-3): A retro finding MUST have no target field; its file field
  MUST name the section for a skill. Retro MUST NOT create a tracker item.
- BR-22 (triage-1, triage-2): The start done check MUST name label verbs only. The
  duplicate, cover and `BR` checks MUST include open items outside bucket 1, and MUST
  compare an item with `BR` lines by those lines.
- BR-23 (setup-1): `setup` MUST NOT overwrite an existing project context or card
  without the user's yes on the shown diff, and MUST NOT end the run there.
- BR-24 (setup-2, setup-3, setup-4): `## Glossary` MUST start empty and `## Caveats`
  MUST hold the caveats the run found; the `code` Caveats pointer in setup MUST be
  deleted. The docs-location line in Write MUST be deleted. The pointer line MUST be
  conditional.
- BR-25: `lint` and `unit` MUST pass on every commit. Each changed `SKILL.md` MUST stay
  within its `max-lines`, raised in the same commit where it grows past. The `core` hook
  output MUST stay at or under 10,000 characters. Each changed line MUST stay at or
  under 90 characters.
- BR-26: The plugin version MUST be 0.2.3 in `.claude-plugin/plugin.json`.
- BR-27 (amendment, out-of-scope finding of the fix-5 re-review): `audit` `Not checked:`
  MUST have no empty-value form.

`TR-<n> (BR-<m>, ...): MUST <behavior>`, then an indented `tests:` line. Each TR is one
commit. Edits use master c1d028a line numbers; "→" separates old from new text; a block
replaces the cited lines in full.

### Group A (one coder; owns core, code, plan)

- TR-1 (BR-6, BR-7, BR-25): MUST apply these edits to `skills/core/SKILL.md`.
  tests: none, skill text; `lint` checks it, `unit` (`core-context.test.mjs`) the cap.
  - A1 (core-2), lines 100-101:
    ```
    - These items MUST be recorded during the task: each SHOULD bypass made during the work
      (section Rule words), scope addition (`test` section Test scope), design
    ```
  - A2 (core-1), line 107: `  writes.` →
    `  writes. Outside a plan or code run, the main session MUST ask the user first.`
- TR-2 (BR-1..BR-5, BR-7, BR-14, BR-25): MUST apply these edits to
  `skills/code/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - A3: line 7 → `max-lines: 149`.
  - A4 (code-2), lines 35-38:
    ```
    - With a tracker bound (`plan` section Levels, tracker variant), the run MUST claim its
      task item as its first write on that item, before it cuts the task branch. When the
      item is assigned to another person, the run MUST stop and ask the user: take it over,
      pick another ready task, or stop.
    ```
  - A5 (code-6), lines 55-56:
    ```
    - The main session MUST write each caveat it receives or finds after the plan-file
      commit into the project context `## Caveats` immediately.
    ```
  - A6 (code-4, implement-3): replace line 63, and add the third bullet after line 65:
    ```
    - MUST start the plan items in the plan's order, also across agents and the main
      session. An item that needs an earlier item MUST wait for its merge.
    - A finding that blocks the task MUST NOT wait for the recorded-items quiz. It is
      `stuck:` (`delegate` section Re-spawn and retry).
    - An out-of-scope finding on code this task built is a defect in built code. It MUST
      get its `TR` before the next brief (`plan` section Amendments), not at the quiz.
    ```
  - A7 (review-4), line 77: `  met, the `req:` markers, stray files, the gates.`
  - A8 (core-2), line 86:
    `  - other SHOULD bypass made during the work: accept, or undo if possible;`
  - A9 (code-3): add after line 89:
    ```
    - A follow-up MUST be a new open tracker item; the quiz answer is the yes to that
      create. With no tracker bound, it MUST be a line in the task report.
    ```
  - A10 (code-5), lines 90-99:
    ```
    - The main session MUST take these steps in this order:
      1. MUST run the final review and its fix loop (section Review loop).
      2. MUST run the recorded-items quiz, then apply the answers.
      3. After any commit since the last review: MUST run `lint` and `unit` again, and the
         reviewer on each such commit that is not a pure revert.
      4. Quiz loop: MUST repeat steps 2 and 3 while a re-review in step 3 adds a new
         recorded item. The loop bound (section Review loop) applies.
      5. Stray-task check: MUST check each task in the scope of `core` section Tools and
         background tasks. One that still runs with no valid reason is a stray task: MUST
         stop it, report it as a finding, and write a caveat on its cause (section Caveats).
         After that caveat commit, MUST run `lint` and `unit`; it gets no re-review.
    ```
  - A11 (code-7), lines 106-108:
    ```
      8. Cleanup: MUST ask the user whether to keep the plan file and the design docs the
         task added to the repository. Default: keep them. It MUST also ask, for each
         `debug-<id>` branch, whether to delete or keep it. After a cleanup commit, MUST
         run `lint` and `unit`; it gets no re-review.
    ```
  - A12 (code-5), line 113: `re-review of step 4` → `re-review of step 3`.
  - A13 (code-7), lines 118-121:
    ```
          on the task item with the branch and, when they exist, the kept plan file path,
          the PR link and the merge commit (the merged HEAD commit on a fast-forward). It
          MUST make no repo commit for status. "The items" MUST mean the task item, and the
          milestone item too when the task was its last open one. Per finish answer:
    ```
  - A14 (code-1), line 122:
    ```
          - merge into `<base>`: MUST set the items done after the push of section Finish,
            or after the merge with no remote; on a no to that push, MUST leave the items
            open and tell the user;
    ```
  - A15 (code-1): add after line 133:
    ```
    - A merge into `<base>` MUST merge into the local default branch. With a remote, the
      main session MUST then ask a separate question whether to push that branch.
    ```
- TR-3 (BR-7, BR-8, BR-25): MUST apply these edits to `skills/plan/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - A16 (plan-1), lines 38-39:
    ```
    - A milestone run MUST read `<docs>/DESIGN.md` first. A task run MUST read its milestone
      doc first. Each reads it on `<base>`; when `<base>` lacks it, the run MUST ask the user
      to merge the parent branch first.
    ```
  - A17 (core-3), line 67: `Its body MUST be the` → `Its body MUST hold the`.
  - A18 (plan-3): add after line 219:
    `- A task that its milestone doc does not list MUST get its Tasks line as an amendment.`
  - A19 (plan-2): delete lines 229-231 ("- With a tracker bound (section Levels, tracker
    variant), the owning doc is the owning item. …before the next brief.").

### Group B (one coder; owns implement, test, debug)

- TR-4 (BR-5, BR-9, BR-10, BR-25): MUST apply these edits to
  `skills/implement/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - B1 (implement-1), line 22:
    `- MUST list every place the change must reach: callers, fixtures, config,`
  - B2 (implement-1), lines 47-48:
    ```
    - MUST ship the smallest complete change, once you know everything it must touch. MUST
      finish every caller and fixture that the change breaks. A one-liner that needs
    ```
  - B3 (implement-3), lines 53-54:
    ```
    - A bug that neither the brief nor its plan item names, and that your change did not
      introduce, MUST NOT be fixed. It MUST be recorded as an out-of-scope finding
      instead, or reported as `stuck: <bug>` when it blocks the work.
    ```
  - B4 (implement-2), lines 55-57 (line 57 is deleted):
    ```
    - MUST NOT add an abstraction, wrapper, option, config, boilerplate or "for later" code
      that nobody asked for. MUST follow the ladder (above) instead.
    ```
  - B5 (implement-4), lines 30-32:
    ```
      section Reports). It MAY stop and report `stuck: <misfit>` at once when going on
      wastes significant work. On the user's yes, the change goes back to plan mode (`plan`
      section Amendments); the new design SHOULD ship in pieces.
    ```
  - B6 (implement-6): delete lines 85-86 ("- SHOULD report each new domain term. … at
    once.").
  - B7 (implement-3), lines 99-102:
    ```
    - MUST fix the root cause of each bug the brief or its plan item names (other bugs:
      section The smallest complete change). It MUST first get a test that reproduces it.
      Then MUST grep every caller of the function you touch and fix the cause once, in the
      shared code. A guard that only hides the crash MUST NOT count as a fix.
    ```
  - B8 (implement-5), lines 116-117:
    ```
    - MUST change only the test cases on the test-scope list. A new case in an existing file
      is not a change outside the scope.
    ```
- TR-5 (BR-11, BR-25): MUST apply these edits to `skills/test/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - B9: line 7 → `max-lines: 125`.
  - B10 (test-1), lines 30-31:
    ```
    Each level MUST cover what its line says. The project context `## Test levels` MAY add to
    or change these lines; that section wins.
    ```
  - B11 (test-5), lines 35-37:
    ```
    - integration: narrow, one integration point at a time (a real database, the file
      system, one separate service or its double), at the boundary of the service. The test
      MUST start the real part or the service double, trigger the code that uses it, and
      check the result there.
    ```
  - B12 (test-4), line 53:
    ```
    - A double SHOULD stub a query. A test SHOULD verify a call only when the call is the
      behavior.
    ```
- TR-6 (BR-12, BR-25): MUST apply these edits to `skills/debug/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - B13 (debug-3), line 81: `- A performance bug MUST get a baseline measurement first.`
  - B14 (debug-1), lines 89-91:
    ```
    - MUST commit the loop when it is a file. MAY commit other debug code (a harness, tagged
      logs). Each debug commit MUST go only on a branch `debug-<id>` cut from the task
      branch, where `<id>` is the id of the debug prefix. MUST NOT merge that branch into
      the task branch; MUST name it in the report instead.
    ```
  - B15 (debug-2), lines 104-106:
    ```
    - Done when the original loop passes, the diff against the task branch holds only the
      fix and its regression test, and the commit message of the fix states the confirmed
      hypothesis.
    ```

### Group C (one coder; owns review, audit, delegate, research)

- TR-7 (BR-13..BR-15, BR-25): MUST apply these edits to `skills/review/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - C1 (review-4), lines 38-39:
    ```
    - MUST check the commit messages against the diff. A wrong or missing change MUST be
      reported.
    ```
  - C2 (review-2), lines 53-54:
    ```
    - Test cases changed outside the test-scope list and its recorded scope additions MUST
      be reported. `test` section Test scope sets how to check a scope addition.
    ```
  - C3 (cross-2): add after line 115:
    ```
    - A finding on a design rule that the plan's Overrides section names MUST NOT be
      reported. MUST check the code against that override instead.
    ```
  - C4 (review-5), lines 129-130:
    ```
    - On a re-review, MUST check each finding sent to fix, and MUST give after `Gates:` one
      `Re-review:` line per such finding: `fixed`, `open` or `not re-opened` (withdrawn).
    ```
  - C5 (review-1), lines 132-138:
    ```
      - Must fix: bug, security, data loss, breaks at the expected load, an `on` gate
        failure that the change introduced, a requirement not met.
      - Should fix: risky code without a test, real slowness, duplication, a function that
        mixes jobs, code that should not exist, a smell (class Shape), code that is hard to
        read; process findings, unless one hides a bug: a breach of a `test` rule (a missing
        or wrong `req:` marker, a test case changed outside the scope), a commit message not
        matching the diff, a stray file, an `on` gate with no command, a changed file no
        gate covers, a `TR` that traces to no `BR`.
    ```
  - C6 (review-3): line 146 → `  reviewer to judge; then the two slots of `core` section
    Reports.`; line 149 → `  not be checked, each `per` and `not run` gate included.`
  - C7: line 8 → `max-lines: 153`.
- TR-8 (BR-16, BR-25): MUST apply these edits to `skills/audit/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - C8 (audit-2), lines 20-21:
    ```
    section Look for), `review` section Check before you report, and the finding groups and
    format of `review` section Output. This skill holds only what differs from a review.
    ```
  - C9 (audit-3), lines 39-40:
    ```
    - When the tree has tests, MUST apply `test` sections Pyramid and Review checks to the
      whole suite.
    ```
  - C10 (audit-1), lines 41-42:
    ```
    - When the `owasp` gate is `on`, MUST read the entry points and data writes against the
      OWASP Top 10.
    ```
  - C11 (audit-4), line 50:
    `git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:' -- <target>`
  - C12 (audit-1), lines 62-63:
    ```
    - MUST start with `What this repo does:` in two or three sentences, and the load
      assumed. Then MUST give the `Gates:` block of `review` section Output, each `on` gate
      run on the whole tree. A gate failure MUST be a Must fix finding.
    ```
- TR-9 (BR-17, BR-18, BR-25): MUST apply these edits to `skills/delegate/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - C13 (delegate-1), lines 35-37:
    ```
    - When a spawn in a worktree does not fail (section Re-spawn and retry), the main
      session MUST merge its branch into the task branch, run `lint` and `unit`, then remove
      the worktree. `code` section Review loop sets the review that follows.
    ```
  - C14 (delegate-2), lines 46-57:
    ```
    - A coding or review brief MUST hold: the full text of each `TR` it covers, quoted from
      the plan file, and of each `BR` it covers, quoted from the doc or item that holds it
      (`plan` section Requirements), read at brief time; the test-scope list (`test` section
      Test scope), from the plan; for a review brief, also each scope addition with its
      reason, from the coder or debugger recorded-items slot; the project context lines of
      `## Commands`, `## Gates`, `## Test levels` (the unit style included), `## Rules` and
      `## Caveats` that apply; which skills or skill sections the agent loads; the task
      branch and `<base>` (`code` section Branch and plan file); the plan's Overrides and
      Accepted tech debt sections (`plan` section The plan).
    ```
  - C15 (delegate-3), lines 132-135:
    ```
    - A frontier task, or a user request for Fable, MUST go through the Fable question once
      per task (its answer covers each later spawn): a question through the question tool,
      with the options Opus high (default, first), Opus max, Fable high, Fable max. `core`
      section Models requires the user's yes for any run on Fable.
    ```
- TR-10 (BR-19, BR-25): MUST apply these edits to `skills/research/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - C16 (research-1), lines 32-35:
    ```
    - When the official source is unclear, old or disputed, SHOULD read at least 3 further
      independent sources. A copy of the same text MUST NOT count as independent. An agent
      on the Sonnet research row MUST stop there instead and report `sources disagree`. The
      main session MUST then re-spawn it on the Opus research row.
    ```
  - C17 (research-2): line 46 → `3. The recorded-items slot and the caveat slot (`core`
    section Reports).`; delete lines 47-51 (the blank line and section `## 4. Caveats`).

### Group D (one coder; owns setup, triage, retro)

- TR-11 (BR-23, BR-24, BR-25): MUST apply these edits to `skills/setup/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - D1 (setup-4), lines 44-46:
    ```
    - The pointer MUST be one line in the project context: "At session start, load the
      armory `core` skill when its rules are not in your context." The line MUST sit at
      the top of that context, before the first section.
    ```
  - D2 (setup-2), lines 86-87: `- `plan` does not apply: no plan mode, no plan file.`
  - D3 (setup-3): delete line 138 ("- Documentation MUST live in the docs folder, …").
  - D4 (setup-2), lines 146-147:
    ```
    - `## Commands`, `## Gates`, `## Glossary` and `## Caveats` MUST take the format lines
      of `templates/AGENTS.md`. `## Glossary` MUST start empty, with its format line.
      `## Caveats` MUST hold its format line and the caveats the run found.
    ```
  - D5 (setup-1), lines 154-155:
    ```
    - MUST NOT overwrite an existing project context or agent card without the user's yes
      on the shown diff. MUST show that diff instead; on a no, MUST add only the missing
      parts the user approves.
    ```
- TR-12 (BR-22, BR-25): MUST apply these edits to `skills/triage/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - D7 (triage-1), line 29:
    `- Done when every label verb and label line is bound, and every role label exists.`
  - D8 (triage-2), lines 48-49:
    ```
    1. Duplicate check: MUST compare the item with the `dropped` items and the open items
       outside bucket 1, an item with `BR` lines by those lines only. On a match, MUST ask
    ```
  - D9 (triage-2), lines 65-66:
    ```
       Rejected MUST be recommended when the project already gives the item or open items
       with `BR` lines cover it. With a point left to the reporter, MUST NOT offer
    ```
  - D10 (triage-2), lines 74-75:
    ```
      Requirements, without its `Format:` line. The `BR` lines MUST hold only what no open
      item with `BR` lines already fixes; the section MUST link each such item and name each
    ```
- TR-13 (BR-20, BR-21, BR-25): MUST apply these edits to `skills/retro/SKILL.md`.
  tests: none, skill text; checked by `lint` and by reading.
  - D12 (retro-1), lines 35-38:
    ```
      - Checks and review rules. Use when a mistake was made, or got past a gate or the
        reviewer. A mechanical miss (a fixed pattern, a banned call, a file place) MUST get
        a check: a lint rule, a gate or a hook. A judgement miss MUST get a rule where it
        happened (a skill, an agent card or the project context `## Rules`), or in `review`.
    ```
  - D13 (retro-2), lines 53-54: `  - file: the file to change, and its section for a
    skill;`
  - D14 (retro-3), line 70:
    ```
    - MUST NOT start the task or create its item. MUST name each chosen finding as a task to
      plan instead.
    ```

### Main session, after the four merges

- TR-14 (BR-26): MUST run `node scripts/bump-version.mjs patch` so that
  `.claude-plugin/plugin.json` reads `0.2.3`.
  tests: none; `bump-version.test.mjs` covers the script, `lint` validates the manifest.
- TR-15 (BR-27, BR-25), amendment: MUST replace `skills/audit/SKILL.md` lines 67-68
  (line numbers at f7ba74e, not c1d028a) with:
  ```
  - MUST end with `Verdict:` in one line (`Verdict: healthy.`, or what to fix first), then
    `Not checked:` in one line when a part was not read or not run.
  ```
  tests: none, skill text; checked by `lint` and by reading.

### Run order

1. Commit this plan file on `conflict-fixes`.
2. Spawn 4 coders at once (groups A–D), each in its own worktree, Sonnet low ("Coding,
   trivial change": every edit is given in full). No two groups share a file. Each coder
   matches the old text, and applies the edits of one file from the bottom up so that the
   cited line numbers stay valid.
3. Merge each group branch into `conflict-fixes`; run `lint` and `unit` after each merge.
4. TR-14 on `conflict-fixes`.
5. Final review (reviewer, Opus high) of `c1d028a..HEAD`, then the `code` Task end.

Sizes after the edits (lines / `max-lines`): code 149/149 (raised), core 149/149,
plan 238/239, implement 145/147, test 125/125 (raised), review 153/153 (raised),
audit 70/74, delegate 147/150, debug 107/107, research 46/58, retro 71/71,
triage 97/97, setup 163/163. `core` hook output ≈8,720 of 10,000 characters.

## Test scope

None. No test in `scripts/` reads the skill text except `core-context.test.mjs`, which
checks only the first line and the length of `core`; both stay valid.

## Risks

- A15 merges into the local default branch as it is; a local branch that diverged from
  `origin` gets a merge commit, not a fast-forward.
- Group A changes the flow that runs this task; this task runs under the master text.

## Stack choices

## Out of scope

- cross-1 (triage → plan handoff): follow-up after this batch, to look closer at how
  `plan` and `triage` interact.
- test-3: line 69 stays as is.
- The `browse` rule in `~/.claude/CLAUDE.md` (outside the repo).
- A dry run of the changed flows.
- The dropped findings core-4, debug-4 and test-2.

## Accepted tech debt

## Overrides

Format: `<design rule> : <reason>`.

## Caveats

Format: the caveat line of the armory `core` skill, section Reports.

- A merge into `<base>` merges into the local default branch with no fast-forward to `origin` first : skills/code/SKILL.md
