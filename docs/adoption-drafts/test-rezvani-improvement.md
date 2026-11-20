# test ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering-team/skills/red-green-proof/SKILL.md` @f8593c4 (MIT; the skill credits RooAGI, also MIT)
Status: draft, not adopted

## What it brings
Proof that a regression test can fail when the test came after the fix: put the old code back and watch the test go red. Honest kinds for a test that can never go red, so a plan can name one instead of `tests: none`.

## Cons
- `test` §TDD already makes a test written first fail for the expected reason, and makes a test that passes on first run fail on a break. Only the after-the-fix case and the test kinds are new.
- Dropped: "name the test after the defect" and "assert what the user sees". `test` §Structure and naming (name states the behavior) and §TDD (public interface, what the user sees) cover both.
- The source puts the test kind in a file-header comment. That conflicts with `core` §Writing and questions (comments hold only the why); the draft puts the kind on the plan item line instead.
- Change 2 also edits `plan` text that reads `tests: none`.
- `test` is at its `max-lines` cap (137); each added line needs a raise.

## Proposed changes
### 1. Red again after the fix
- Target: `test` §TDD (add bullet after the first bullet)
- Text: `- A regression test written or changed after its fix MUST be proven: put the pre-fix code back, run the same command, see the test fail on the reported symptom, then restore the fix and see it pass. A test that stays green on the pre-fix code MUST be rewritten. Done when the report shows the red line from the pre-fix run.`
- Why: a test written after the fix may exercise a path next to the bug and pass with or without the fix.
- Evidence needed: a regression test that passed on the pre-fix commit, found by review or by a later bug of the same kind.

### 2. Honest kinds for a test that cannot go red
- Target: `test` §TDD (replace bullet "A requirement where an honest test is impractical MUST NOT get a bad test")
- Text: ``- A requirement where an honest test is impractical MUST NOT get a bad test. Plan MUST decide it: plan item carries line `tests: none, <why>`, or `tests: <kind>, <why>` with one kind: `extract` (move the logic to a unit a test can call, then test it), `structural` (scan the source and assert the invariant), `model` (mirror the real code and cite the path:line it mirrors) or `characterization` (pin current behavior). A characterization test MUST NOT be called a regression test.``
- Why: today the only honest option short of a real test is no test, so code that cannot be called gets none, or a fake one.
- Evidence needed: a plan item with `tests: none` where one of these kinds would have caught a later regression, or a review finding on a fake behavioral test of unreachable code.
