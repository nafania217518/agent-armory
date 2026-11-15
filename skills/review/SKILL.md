---
name: review
description: >
  Review of a change: logic, safety, real load, tests for risky code, gates, lean and
  readable lines. Reads the connected code, not only the diff. Lists findings, changes
  no code. Use for "review this", "review the last commit", "review my PR", "is this
  over-engineered", "/review".
max-lines: 168
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# review

Reviewer judges code against `implement` and tests against `test` (load both when not
in context). "Reported" means listed as a finding.

## 1. Understand first

- Review and audit are reports user asked for: MUST give them in full. Both are read-only:
  MUST NOT change any tracked file. Gate output (a coverage folder) is exempt.
- Main session MUST spawn a reviewer for every review, also one user asks for, and
  MUST NOT review in its own context.
- MUST review what user names: uncommitted or staged changes, a branch, a PR link, or
  files. Nothing named: uncommitted changes, or else last commit.
- Inside a task, review MUST cover the commit range and checks the brief names. With no
  brief, range and checks of `code` §Review loop apply.
- MUST read the task the change serves: `BR` text in the brief and the plan sections it
  names, user's request, PR description, or commit messages.
- MUST read the diff, then the code it touches: callers of every changed function,
  functions it calls, tests, README.
- MUST trace the real flow: where data comes in, what is stored, what goes out.
- When a signature, return value or behavior changes, MUST grep every caller.
- With a plan, MUST take expected load from the plan's load `TR`s (`plan` §The plan).
  With no plan, MUST find it: a figure in `<docs>/DESIGN.md`, else in README or deploy
  config. MUST judge scale against it.
- When no expected load is stated, MUST NOT assume one. MUST report it missing instead, as
  Should fix, when the change touches a data-growth path (`plan` §The plan).

## 2. The diff is the truth

- MUST check commit messages against the diff. A wrong or missing change MUST be reported.
- Stray files in the diff (test inputs, outputs, scratch scripts) MUST be reported.
- MUST run every `on` gate at the range's last commit (a detached worktree when HEAD moved
  past it), `owasp` reading included (`implement` §Gates per commit, also for a failure
  already on `<base>`). MAY take a gate run the brief hands over only when it ran at that
  same commit. A final review MUST run every `on` gate itself. An `on` gate with no
  command MUST be reported.
- MUST confirm an `on` gate's command covers each changed file, else report the file. A
  prose or docs file is exempt when no gate covers prose: reviewer MUST read it.
- Each requirement the task names MUST be shown met by the diff or by a check.
- A `TR` that traces to no `BR` is scope creep and MUST be reported.
- MUST grep `req:` markers (`test` §Markers). A `TR` with code and no marker MUST be
  reported, unless its plan item says `tests: none`.
- A marker whose task branch or id the task does not have MUST be reported. This check
  MUST scan only lines the diff adds or changes.
- Test cases changed outside the test-scope list and its recorded scope additions MUST be
  reported. `test` §Test scope sets how to check a scope addition.
- When the diff touches tests, MUST apply `test` §Review checks.

## 3. Look for

- Findings MUST follow this order of importance: correct, safe, holds under load, tested,
  fast, lean, well shaped, readable.
- A review and an audit MUST cover each class:

1. Bug: wrong result, crash, missed edge case (empty, zero, last item, rounding, time
   zones), a caller the change breaks, a fix in one caller while the shared function stays
   broken, callers that disagree on a return value, one rule applied two ways, a stale
   async answer applied over a newer one (`implement` §Domain, boundaries and state).
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
   - reuse: repo already has this helper (name the path); two helpers do one job
   - stdlib / native: stdlib or platform does it; a dependency does what a few lines can
   - yagni: an abstraction with one implementation, a factory with one product, a
     wrapper that only passes calls through, config nobody sets. Deletion test: delete
     the module in thought; complexity that vanishes marks a pass-through, complexity
     that returns in every caller marks a module that earns its place. A seam with one
     adapter is hypothetical; a second adapter makes it real.
   - merge: near-copies that must change together
   - split: a unit with more than one job, hard to read or test (`implement` §Domain,
     boundaries and state). Split by job, not lines.
   - unrequested (review only): a change the task did not ask for: a refactor, a
     rename, reformatting, a fix outside the scope. Fix: revert it.
7. Shape: code in the wrong place or form. Each smell is a judgement call. A `## Rules`
   line in project context that allows the pattern MUST remove the finding, unless the
   code also breaks an `implement` MUST.
   - Feature Envy: a function uses another unit's data more than its own. Fix: move it
     to that data.
   - Data Clumps: the same fields or parameters travel together. Fix: one type for them.
   - Primitive Obsession: a primitive or a string stands for a domain concept and lets
     an illegal value in (`implement` §Domain, boundaries and state). Fix: a small type
     of its own.
   - Shotgun Surgery: one change edits many scattered places. Fix: gather what changes
     together into one module.
   - Message Chains: a caller reaches through objects it does not own, as in
     `order.customer().address().city()`. Fix: one method on the first object hides the
     walk.
   - Repeated Switches: the same switch on one type in several places. Fix: one shared
     map, or polymorphism.
   - Fat Interface: a client depends on interface methods it does not use (`implement`
     §Domain, boundaries and state). Fix: a narrow interface per client.
8. Readability: code that breaks a rule of `implement` §Readability.

## 4. Check before you report

- Every finding MUST have a concrete case: "this input or situation leads to this wrong
  result".
- MUST re-read the lines and confirm: the caller exists, the value can be empty, the code
  is unused.
- MAY run one compile or one test that settles a claim before reporting it, also when the
  brief hands over the gate run. A claim it cannot settle takes the `Unverified:` part
  (§Output).
- A finding that rests on a library claim MUST follow `research` §When to research:
  reviewer MUST look the claim up in dependency cache or docs before it reports.
- A `tech-debt:` marker (`implement` §The smallest complete change) MUST be reported only
  when expected load is past its limit, or when it covers a never-cut item.
- A finding on a design rule the plan's Overrides section names MUST NOT be reported. MUST
  check the code against that override instead.
- MUST propose the smallest fix that works. SHOULD prefer fixes that delete code.
  MUST NOT add layers, frameworks or config the problem does not need.
- MUST NOT report style taste, "consider", or vague worries.

## 5. Output

- A reviewer MUST start with `Gates:`, and MUST leave out `off` gate lines. `Gates:` MUST
  give one line per gate: `pass`; `fail <one line>`;
  `fail <one line>, exists on <base>`, no blocker; `(per <who> at <commit or range>)`
  after `pass` or `fail` for a run by another agent; `no command`; `not run (<cause>)`,
  neither pass nor fail, when an `on` gate's command cannot run (a file the range lacks:
  name the commit that adds it).
- On a re-review, MUST check each finding sent to fix, and MUST give after `Gates:` one
  `Re-review:` line per such finding: `fixed`, `open` or `not re-opened` (withdrawn).
- Findings MUST come in three groups, empty groups skipped:
  - Must fix: a bug, a risk, a break at the expected load, an `on` gate failure the
    change adds, a requirement not met.
  - Should fix: a big slowdown, a Lean, Shape or Readability finding, or a process
    finding (§The diff is the truth, a `test` rule breach other than a missing test
    case) that hides no bug.
  - Nice to have: a small speed-up or a shorter form.
- A missing test case MUST be graded Must fix on risky code (class Missing test), else
  Nice to have.
- A wrong fact in prose or config MUST be graded by its effect, like code: Must fix when
  it misleads a reader into a wrong action, else Should fix.
- Each finding MUST have a number across all groups, a bold title with `file:lines` (or
  `commit <sha>`), then Problem and Fix, of one or two short sentences each; a Nice to
  have finding adds If we skip it. A finding whose claim reviewer could not check MUST
  add one more part:
  `Unverified: <the source or command that settles it>`. In a caveat line (`core`
  §Reports), the part MUST come last, after one more ` : `.
- Each Should fix and Nice to have finding MUST be recorded (`core` §Reports). The
  recorded-items slot MUST name a finding by its number, not repeat it.
- Then MUST give `Answers:` when the brief asks a question or names a check for reviewer
  to judge, one line per item: short plain-fact sentences, up to 10, no prose; then the
  two slots of `core` §Reports.
- MUST end with `Verdict: Ship.` or `Verdict: fix 1 and 3 first.`, then `Not checked:` in
  one line when something that mattered was not checked; each `per` and `not run` gate
  counts.
- Nothing found: one line on what was checked MUST replace the groups; `Re-review:` stays.
