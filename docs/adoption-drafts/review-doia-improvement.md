# review ← department-of-internal-arguments (improvement)

Sources:
- https://github.com/ChiefGyk3D/department-of-internal-arguments `roles/reviewer.md` (Method), `policies/quality-gates.md` lines 6–7, `scripts/mutation_check.py` (docstring) @a9d4347 (Apache-2.0, with NOTICE; release 0.4.0)
- https://github.com/ChiefGyk3D/department-of-internal-arguments `roles/adversarial-reviewer.md` lines 26–34 (attack classes 1, 5, 8, 9) @a9d4347 (Apache-2.0, with NOTICE)
- https://github.com/ChiefGyk3D/department-of-internal-arguments `evals/pilot-2026-10.md` lines 29, 34 @a9d4347 (Apache-2.0, with NOTICE)

Status: draft, not adopted

All text is paraphrase; no source text or script is copied.

## What it brings

The reviewer proves that a fix's test bites: it reverts the fix in a scratch worktree and
sees the test go red. A test that stays green is a Must fix. A re-review reads the fix
commits as new code, not only as answers to old findings. Three Bug and Risk cases name
fail-open checks, replays after an unknown outcome and a fix that misses a sibling form.

## Cons

- `review` is at its `max-lines` cap (165 of 165). The changes add about 8 lines; each
  added line needs a cut or a cap raise. This draft found no cut candidate it can justify,
  so a cap raise is the likely path.
- Each revert check costs a worktree, a test run and its time per fix. A slow test suite
  makes it expensive on a task with many fixes.
- Change 1 overlaps the coder-side check in `craft` §3 (a test that passes on first run
  must fail once the code breaks) and the red-again check in the
  `test-rezvani-improvement` draft §1. Those make the coder prove it; this change makes
  the reviewer check it. Both stay: in the source's pilot, the reviewer's check made
  the catch.
- Evidence is thin: one pilot, n=12 tasks on one day, with a Sonnet reviewer. The source
  says itself that its sample shows direction, not proof.
- Dropped: the adversarial reviewer as a seventh agent. Armory has six fixed agent cards;
  the `code-ecc-improvement` draft already proposes a second reviewer, and
  security-critical work goes through the Fable question (`delegate` §4–5).
- Dropped: the SPECULATIVE label for a finding with no reproduction. `review` §4 (concrete
  case, re-read, one settling run) and the `Unverified:` part cover it.
- Dropped: the two-verdict split (spec compliance, task quality). `review` §2 already
  checks each requirement, and §5 gives one verdict that names the findings to fix.
- Dropped: `mutation_check.py` with its PID and network namespaces. It is too heavy for a
  rule that a detached worktree already makes safe.

## Proposed changes

### 1. Fix bites

- Target: `review` §2 The diff is the truth (add bullet after "When diff touches tests,
  MUST apply `test` §7.")
- Text:
  ```
  - For each fix of a Must fix finding, and each new test on risky code (§3 class 4),
    MUST revert the fix's non-test lines in a detached worktree in your own temp folder,
    run the test there and see it fail, then MUST remove that worktree. A test that stays
    green MUST be reported as Must fix, class Missing test. Done when each such test has
    a red run or a finding.
  ```
- Why: a test can pass with or without its fix when it never reaches the fixed path. In
  the source's pilot, a reviewer's revert check found such a test. A detached worktree
  keeps the revert off the reviewed branch: the pilot's one rule slip was a reviewer's
  mutation that was not fully restored and reached a commit.
- Evidence needed: an armory review that passed a test which stays green with its fix
  reverted. Evidence so far: only the DoIA pilot catch (n=12, Sonnet reviewer). Its 3-of-3
  misses by the ordinary reviewer do not transfer to an Opus-high reviewer.

### 2. Re-review reads the fix as new code

- Target: `review` §5 Output (replace "On a re-review, MUST check each finding sent to
  fix, and MUST give after `Gates:` one `Re-review:` line per such finding: `fixed`,
  `open` or `not re-opened` (withdrawn).")
- Text:
  ```
  - On a re-review, MUST check each finding sent to fix, and MUST review the fix commits
    as new code by every §3 class. MUST give after `Gates:` one `Re-review:` line per such
    finding: `fixed`, `open` or `not re-opened` (withdrawn).
  ```
- Why: a fix is new code with no earlier review, and the source names the fix of round N
  as the likeliest place for the bug of round N+1. Today a re-review line can say `fixed`
  while the fix adds a fault.
- Evidence needed: an armory fix commit, marked `fixed` on re-review, that held a bug a
  later review or run found.

### 3. Fail-open, replay and sibling cases

- Target: `review` §3 Look for, class 1 Bug (replace "a fix in one caller while shared
  function stays broken,")
- Text:
  ```
  a fix in one caller while shared function stays broken, a fix that closes one call form
  or alias and leaves its sibling open,
  ```
- Target: `review` §3 Look for, class 2 Risk (replace the whole item)
- Text:
  ```
  2. Risk: security holes (injection, weak randomness, secrets, missing checks on input
     from users, a security check that passes on error or timeout), data loss (errors
     swallowed, writes in wrong order, no transaction, a non-idempotent call sent again
     after a timeout or 5xx, whose outcome is unknown, not failed).
  ```
- Why: "missing checks" does not name a check that exists but fails open, and "data loss"
  does not name a duplicate write after a retry. The pilot's reviewer found two fail-open
  exits that an earlier automated scan had missed.
- Evidence needed: an armory review that missed a fail-open check, a retried
  non-idempotent call or an unfixed sibling form that a later review or run found.
