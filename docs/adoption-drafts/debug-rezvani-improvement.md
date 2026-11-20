# debug ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering-team/skills/red-green-proof/SKILL.md`, `engineering/skills/focused-fix/SKILL.md`, `engineering-team/playwright-pro/skills/fix/SKILL.md` @f8593c4 (MIT)
Status: draft, not adopted

## What it brings
A check that a "bug" was not intended before a fix inverts it. A classifier that sorts a flaky failure into one of four kinds, each with its own next probe. A stability check for a flaky fix.

## Cons
- Merged: "config and env vars are hypothesis sources" is in the integration and environment categories of `debug-wshobson-improvement` change 1.
- Change 4 overlaps `implement` §Fixing and refactoring (two failed fixes that share one premise); it adds only the cascade case.
- The classifier comes from a Playwright skill; the kinds are general, but the source's fixes per kind are browser-specific and are not proposed.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.
- The red-again proof from the same source is in `test-rezvani-improvement`.

## Proposed changes
### 1. Check that the behavior was not intended
- Target: `debug` §Probes (add bullet at the end)
- Text: `` - Before a fix outline inverts current behavior, MUST search history for the commit that added the line (a pickaxe search on its exact text) and grep for a test that asserts that behavior. When a commit message or test shows intent, MUST report `stuck:` with that commit or test instead of a fix outline. Done when the report names the commit and test checked. ``
- Why: a debugger that confirms "X causes the symptom" can still be wrong that X is a bug; nothing in `debug` checks for a deliberate decision.
- Evidence needed: a fix that broke an existing test or reverted a deliberate commit.

### 2. Classify a flaky failure
- Target: `debug` §Feedback loop (replace bullet "Flaky bug: SHOULD raise reproduction rate")
- Text: `- Flaky bug: MUST first classify it by where it fails. Fails on repeat runs of one test alone: timing. Passes alone, fails in the suite: isolation (§Probes, pollution search). Fails only in CI: environment. No pattern: infrastructure. SHOULD then raise reproduction rate in that setting (repeat trigger, run in parallel, add stress) until rate is high enough to debug against. Done when the loop names its class and its pinned rate.`
- Why: "raise the rate" does not say in which setting; a suite-order bug never shows on repeat runs of one test.
- Evidence needed: a flaky-bug run that spent its loop budget repeating one test alone while the failure needed the full suite.

### 3. Pollution search for the isolation class
- Target: `debug` §Probes (add bullet)
- Sources for this change also: https://github.com/obra/superpowers `skills/systematic-debugging/find-polluter.sh` @22f0b46 (MIT)
- Text: `- Isolation failure: SHOULD find the polluting test by running the suite's test files one at a time, or in halves, and checking the leaked state or file after each. Done when one test file alone, run before the victim, turns the loop red.`
- Why: knowing the class is isolation does not name the test that leaks state.
- Evidence needed: same as change 2.

### 4. Flaky fix needs repeat runs
- Target: `debug` §Fix and cleanup (add to the done condition)
- Text: `- Flaky bug: done also needs the loop run green as many times in a row as its pinned rate needs to show at least 3 failures.`
- Why: one green run of a flaky loop proves nothing; today's done condition says only "original loop passes".
- Evidence needed: a flaky fix reported done that failed again in CI.
- Note: the count rule (at least 3 expected failures) is this draft's choice, not the source's. The source uses a fixed 10 runs.

### 5. Cascading fixes go to the user
- Target: `implement` §Fixing and refactoring (add bullet after "Coder that still has no cause after that")
- Text: `` - When each of two fixes makes a new, different test fail, MUST stop and report `stuck: design` with the failures; MUST NOT start a third fix instead. ``
- Why: the two-failed-fixes rule covers fixes that miss one premise, not fixes that each break something new, which points at a design problem.
- Evidence needed: a coder or debugger run with three or more fix commits, each breaking a different test.
