---
name: review
description: >
  Review of a change: is the logic right, is it safe, does it hold under real load, is
  risky code tested, do the project gates pass, is every line needed and readable. Reads the connected
  code, not only the diff. Lists findings, changes no code. Use for "review this", "code
  review", "review the last commit", "review my PR", "is this over-engineered", "/review".
---

# review

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

Order of importance: correct, safe, holds under load, tested, fast, lean, readable. This
is a report the user asked for: MUST give it in full.

## 1. Understand first

- MUST compare the session model with the `Code review, audit` row of `AGENTS.md`
  `## Models`. When it differs: say so in one line and delegate to the `reviewer` agent.
- Target: what the user names (uncommitted or staged changes, a branch, a PR, files).
  Nothing named: the uncommitted changes, or the last commit if there are none.
- MUST read the diff, then the code it touches: callers of every changed function, the
  functions it calls, the tests.
- Trace the real flow: where data comes in, what is stored, what goes out.
- A change can break code it does not touch. When a signature, return value or behavior
  changes, MUST grep every caller.
- Find the expected load (README, deploy config): one person running a script, or many
  users and processes. Judge scale against that and say which load you assumed.

## 2. The diff is the truth

- MUST check the commit messages or work summary against the diff. A wrong or missing
  change is a finding.
- MUST run every gate that `## Gates` marks `on`, with its `## Commands` line. An `on`
  gate with no command is a finding.
- `owasp` gate: run the `owasp` command, then read the changed code against the current
  OWASP Top 10.
- Stray files in the diff (test inputs, outputs, scratch scripts) are a finding.
- Each requirement `BR-n` and `TR-n` in `<docs>/requirements/<task-branch>.md`, or each
  `TR-n` the task names (task report, PR body, test names): the diff or a check MUST
  show it is met. A `TR` that traces to no `BR` is a finding (scope creep).
- A changed behavior with no test that fails without the change is a finding (section 3,
  item 4). So is a requirement, a bug fix, an edge case or a failure path with no test
  of its own.
- Tests changed outside the declared test scope are a finding.
- When the diff touches tests, MUST load the `test` skill (`/test`, or `/armory:test` in
  the plugin install) and apply its section 7, Review checks.
- On a re-review, MUST check that each earlier finding is fixed.

## 3. Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item, rounding, time
   zones), a caller broken by the change, a fix in one caller while the shared function
   stays broken, callers that disagree with what a function returns, the same rule
   applied differently in two places.
2. **Risk:** security holes (injection, weak randomness, secrets, missing checks on input
   from users), data loss (errors swallowed, writes in the wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the same work
   done by every process, memory or lists that only grow, a query per item, O(n^2) on big
   input, per-process state that must be shared.
4. **Missing test:** risky new logic (a branch, a parser, money, security, data writes, a
   bug fix) with no test that fails when it breaks. Judge by tests that fail when the
   logic breaks, not by the coverage number.
5. **Speed:** big slowdowns are problems. Small wins are suggestions.
6. **Lean:** code that should not exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features;
   - reuse: the repo already has this helper (name the path); two helpers doing one job;
   - stdlib or native: the platform already does it; a dependency for a few lines;
   - yagni: interface with one implementation, factory with one product, wrapper that
     only passes calls through, config nobody sets;
   - merge: near-copies that must change together;
   - split: one function doing several unrelated jobs. Split by job. MUST NOT split by
     line count or into helpers that exist only to make a function shorter.
7. **Readability:** a human reads this code.
   - Names of variables, functions and classes MUST say what they hold or do.
   - Lines SHOULD stay under 120–140 characters, with spacing. A long signature or call
     goes on several lines, one argument per line, unless that hurts readability.
   - High-level code SHOULD be short and descriptive: one function that reads as the
     steps, with private helpers with clear names, rather than one long function:
     `fun processOrder(id: UUID) = fetchOrder(id)?.let { fulfill(it) }?.also { notify(it) } ?: throw OrderNotFound(id)`
   - SHOULD prefer chaining over a declarative mess, unless it hurts readability. A
     chain over several lines is fine when each call has its own line.

## 4. Check before you report

- Every finding MUST have a concrete case: "this input or situation leads to this wrong
  result". No case, no finding.
- MUST re-read the lines and confirm: the caller exists, the value can really be empty,
  the code really is unused.
- A `tech-debt:` comment that names its limit is a decision, not a finding, unless the
  expected load already crosses it.
- Propose the smallest fix that works. Prefer fixes that delete code. MUST NOT propose
  layers, frameworks or config the problem does not need.
- No style taste, no "consider", no vague worries.

## 5. Output

Plain English, short sentences. Explain a technical term the first time you use it.

1. `What this change does:` two or three sentences.
2. `Gates:` one line per gate: `pass`, `fail <one line>`, `off <reason from AGENTS.md>`
   or `no command`.
3. Findings in three groups; skip empty groups:
   - **Must fix:** bug, security, data loss, breaks at the expected load, a failed `on` gate.
   - **Should fix:** risky code without a test, real slowness, duplication, a function
     that mixes jobs, code that should not exist, code that is hard to read.
   - **Nice to have:** small speed-ups, shorter forms.

   Number findings across all groups, so the user can say "fix 2 and 5". Every finding
   has four parts, each one or two short sentences:

   2. **Orders land on the wrong day** (`billing/close_day.py:L40-52`)
      - **What this is:** At midnight this job closes the day and bills its orders.
      - **Problem:** It takes "today" from the server clock in UTC. An order at 00:30
        in Berlin is billed on the day before.
      - **Fix:** `datetime.now(ZoneInfo("Europe/Berlin")).date()`. One line.
      - **If we skip it:** Late orders show the wrong date; accounting fixes them by hand.

4. End with `Verdict: Ship.` or `Verdict: fix 1 and 3 first.`; `Lean: -<N> lines
   possible.` when lean findings exist; `Not checked:` one line, if something mattered
   and you could not check it.

Nothing found: `What this change does:`, `Gates:`, then `Looks good. Ship.` and one line
on what you checked.

MUST NOT change any file.
