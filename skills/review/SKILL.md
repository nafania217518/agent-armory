---
name: review
description: >
  Review of a change: logic, safety, real load, tests for risky code, gates, lean and
  readable lines. Reads the connected code, not only the diff. Lists findings, changes
  no code. Use for "review this", "review the last commit", "review my PR", "is this
  over-engineered", "/review".
max-lines: 164
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# review

The reviewer, or a main session that reviews itself, judges code against `implement` and
tests against `test` (load both when not in context). "Reported" means listed as a
finding.

## 1. Understand first

- Review and audit are reports the user asked for: MUST give them in full. Both are
  read-only: MUST NOT change any tracked file. Gate output (a coverage folder) is exempt.
- MUST review what the user names: uncommitted or staged changes, a branch, a PR link,
  or files. Nothing named: the uncommitted changes, or else the last commit.
- Inside a task, the review MUST cover the commit range and the checks the brief names.
  With no brief, the range and checks of `code` section Review loop apply.
- MUST read the task the change serves: the `BR` and `TR` text in the brief, the user's
  request, the PR description, or the commit messages.
- MUST read the diff, then the code it touches: callers of every changed function, the
  functions it calls, the tests, the README.
- MUST trace the real flow: where data comes in, what is stored, what goes out.
- When a signature, return value or behavior changes, MUST grep every caller.
- MUST find the expected load in the repo (README, deploy config); judge scale against it.

## 2. The diff is the truth

- MUST check the commit messages against the diff. A wrong or missing change MUST be
  reported.
- Stray files in the diff (test inputs, outputs, scratch scripts) MUST be reported.
- MUST run every `on` gate at the range's last commit (a detached worktree when HEAD moved
  past it), or take the run the brief hands over; `owasp` reading included (`implement`
  section Gates per commit, also for a failure already on `<base>`). An `on` gate with no
  command MUST be reported.
- MUST confirm that an `on` gate's command covers each changed file, else report the file.
  A prose or docs file is exempt when no gate covers prose: the reviewer MUST read it.
- Each requirement the task names MUST be shown met by the diff or by a check.
- A `TR` that traces to no `BR` is scope creep and MUST be reported.
- MUST grep the `req:` markers (`test` section Markers). A `TR` with code and no marker
  MUST be reported, unless its plan item says `tests: none`.
- A marker whose task branch or id the task does not have MUST be reported. This check
  MUST scan only the lines the diff adds or changes.
- Test cases changed outside the test-scope list and its recorded scope additions MUST
  be reported. `test` section Test scope sets how to check a scope addition.
- When the diff touches tests, MUST apply `test` section Review checks.

## 3. Look for

- Findings MUST follow this order of importance: correct, safe, holds under load, tested,
  fast, lean, well shaped, readable.
- A review and an audit MUST cover each class:

1. Bug: wrong result, crash, missed edge case (empty, zero, last item, rounding, time
   zones), a caller the change breaks, a fix in one caller while the shared function
   stays broken, callers that disagree on a return value, one rule applied two ways.
2. Risk: security holes (injection, weak randomness, secrets, missing checks on input
   from users), data loss (errors swallowed, writes in the wrong order, no transaction).
3. Scale: fine for one user, wrong for many: check-then-write races, the same work done
   by every process, memory or lists that only grow, a query per item, O(n²) on big
   input, per-process state that must be shared.
4. Missing test: risky new logic (a branch, a parser, money, security, data writes, a
   bug fix) with no test that fails when it breaks. Judge by that, not by coverage.
5. Speed: big slowdowns are problems. Small wins (hot-loop repeats) are suggestions.
6. Lean: code that should not exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features
   - reuse: the repo already has this helper (name the path); two helpers do one job
   - stdlib / native: stdlib or platform does it; a dependency does what a few lines can
   - yagni: an abstraction with one implementation, a factory with one product, a
     wrapper that only passes calls through, config nobody sets. Deletion test: delete
     the module in thought; complexity that vanishes marks a pass-through, complexity
     that returns in every caller marks a module that earns its place. A seam with one
     adapter is hypothetical; a second adapter makes it real.
   - merge: near-copies that must change together
   - split: a unit with more than one job, hard to read or test (`implement` section
     Domain, boundaries and state). Split by job, not lines.
   - unrequested (review only): a change the task did not ask for: a refactor, a
     rename, reformatting, a fix outside the scope. Fix: revert it.
7. Shape: code in the wrong place or form. Each smell is a judgement call. A `## Rules`
   line in the project context that allows the pattern MUST remove the finding, unless
   the code also breaks an `implement` MUST.
   - Feature Envy: a function uses another unit's data more than its own. Fix: move it
     to that data.
   - Data Clumps: the same fields or parameters travel together. Fix: one type for them.
   - Primitive Obsession: a primitive or a string stands for a domain concept and lets
     an illegal value in (`implement` section Domain, boundaries and state). Fix: a
     small type of its own.
   - Shotgun Surgery: one change edits many scattered places. Fix: gather what changes
     together into one module.
   - Message Chains: a caller reaches through objects it does not own, as in
     `order.customer().address().city()`. Fix: one method on the first object hides the
     walk.
   - Repeated Switches: the same switch on one type in several places. Fix: one shared
     map, or polymorphism.
   - Fat Interface: a client depends on interface methods it does not use (`implement`
     section Domain, boundaries and state). Fix: a narrow interface per client.
8. Readability: code that breaks a rule of `implement` section Readability.

## 4. Check before you report

- Every finding MUST have a concrete case: "this input or situation leads to this wrong
  result".
- MUST re-read the lines and confirm: the caller exists, the value can be empty, the code
  is unused.
- MAY run one compile or one test that settles a claim before reporting it, also when
  the brief hands over the gate run. A claim it cannot settle takes the `Unverified:`
  part (section Output).
- A finding that rests on a library claim MUST follow `research` section When to
  research: the reviewer MUST look the claim up in the dependency cache or the docs
  before it reports.
- A `tech-debt:` marker (`implement` section The smallest complete change) that is a
  decision MUST NOT be reported, unless the expected load already crosses its limit. In
  a review, a marker is a decision only when the plan's Accepted tech debt section names
  it (`plan` section The plan); one the diff adds that is not a decision MUST be reported
  as Should fix. In an audit, a marker that names its limit is a decision.
- A finding on a design rule that the plan's Overrides section names MUST NOT be
  reported. MUST check the code against that override instead.
- MUST propose the smallest fix that works. SHOULD prefer fixes that delete code. MUST
  NOT add layers, frameworks or config the problem does not need.
- MUST NOT report style taste, "consider", or vague worries.

## 5. Output

- A reviewer subagent on a task's commit range MUST start with the load assumed only.
  Any other review MUST start with `What this change does:` in two or three sentences,
  and the load assumed. Then MUST give `Gates:`, one line per gate: `pass`; `fail <one
  line>`; `fail <one line>, exists on <base>`, no blocker; `(per <who> at <commit or
  range>)` after `pass` or `fail` for a run by another agent; `off <reason from the
  project context>`; `no command`; `not run (<cause>)`, neither pass nor fail, when an
  `on` gate's command cannot run (a file the range lacks: name the commit that adds it).
- On a re-review, MUST check each finding sent to fix, and MUST give after `Gates:` one
  `Re-review:` line per such finding: `fixed`, `open` or `not re-opened` (withdrawn).
- Findings MUST come in three groups, empty groups skipped:
  - Must fix: bug, security, data loss, breaks at the expected load, an `on` gate
    failure that the change introduced, a requirement not met.
  - Should fix: risky code without a test, real slowness, duplication, a function that
    mixes jobs, code that should not exist, a smell (class Shape), code that is hard to
    read; process findings, unless one hides a bug: a breach of a `test` rule (a missing
    or wrong `req:` marker, a test case changed outside the scope), a commit message not
    matching the diff, a stray file, an `on` gate with no command, a changed file no
    gate covers, a `TR` that traces to no `BR`.
  - Nice to have: small speed-ups, shorter forms.
- A wrong fact in prose or config MUST be graded by its effect, like code: Must fix when
  it misleads a reader into a wrong action, else Should fix.
- Each finding MUST have a number across all groups, a bold title with `file:lines` (or
  `commit <sha>`), then three parts of one or two short sentences each: Problem, Fix,
  If we skip it. A finding whose claim the reviewer could not check MUST add a fourth
  part: `Unverified: <the source or command that settles it>`. In a caveat line (`core`
  section Reports), the part MUST come last, after one more ` : `.
- Then MUST give `Answers:` when the brief asks a question or names a check for the
  reviewer to judge, one line per item; then the two slots of `core` section Reports.
- MUST end with `Verdict: Ship.` or `Verdict: fix 1 and 3 first.`, then `Not checked:`
  in one line when something that mattered was not checked; each `per` and `not run`
  gate counts.
- Nothing found: one line on what was checked MUST replace the groups; `Re-review:` stays.
