# debug ← claude-code-tips (improvement)

Sources: https://github.com/ykdojo/claude-code-tips `skills/gha/SKILL.md` @577ac89 (no open licence: LICENSE says "All Rights Reserved"; ideas only, no text taken)
Status: draft, not adopted

## What it brings
Steps for a bug that shows first as a failed CI job: find the line that really caused the failure, use the job's run history as a first loop, and check for an existing fix before writing one.

## Cons
- Licence: ideas only. Every line below is new wording.
- The source is tied to one CI host; the draft names no host tool, so the debugger picks its own commands.
- Merged: "fails only in CI means environment" is one class of the flaky classifier in `debug-rezvani-improvement` change 2.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.

## Proposed changes
### 1. CI failure: history before a local loop
- Target: `debug` §Feedback loop (add bullet after "MUST first try a failing test at the seam")
- Text: `- When the bug shows as a failed CI job, MUST first read its log for the step whose failure set the non-zero exit, and skip errors the job treats as non-fatal. SHOULD then read the last 10–20 runs of that same job, not of the whole workflow. Done when the report gives the failing step, its error line and the job's pass rate over those runs.`
- Why: a CI log holds many errors; a debugger that loops on the first one it sees can chase noise. The job's history also rates flakiness for free.
- Evidence needed: a debug run on a CI failure whose first hypothesis targeted a non-fatal error in the log.

### 2. Breaking commit from run history
- Target: `debug` §Feedback loop (add bullet after change 1)
- Text: `- When the job fails in a row, SHOULD find its last passing run and first failing run, and check that every run after the first failure fails and every run before it passes. Done when the report names the breaking commit, or names the run that broke the pattern.`
- Why: the job's own history often bisects the change for free, before a local `git bisect run` loop (already in §Feedback loop) is needed.
- Evidence needed: a CI debug run that built a local bisection harness when the run history already showed the breaking commit.

### 3. Check for an existing fix
- Target: `debug` §Diagnose only (add bullet before the done condition)
- Text: `- Before the fix outline, SHOULD search open pull requests and open tracker items for one that names the failing file or error. Done when the report names the matching item, or says none matched.`
- Why: a second fix of a bug that an open pull request already fixes wastes a full fix flow and makes a merge conflict.
- Evidence needed: a fix flow started for a bug that an open pull request already fixed.
