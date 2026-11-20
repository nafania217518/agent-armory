---
name: implement
description: >
  The coder's rules: scope before you write, the smallest complete change, readability,
  domain types and boundaries, root-cause fixes, safe refactors, the test-scope list,
  the gates, atomic commits. Loaded by the coder and debugger cards;
  "/implement". Not for a coding request from the user.
metadata:
  type: regular
  extends: [core, craft]
  max-lines: 119
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `craft` before your first step when its rules are not in your context.

# implement

How to write code, for coder and debugger. Reviewer judges code against it.

## 1. The smallest complete change

- This section is a design rule, so an approved plan MAY override it (`core` §1).
- The ladder. MUST take the first option that fully works:
  1. Does it need to exist? Skip features, options and flexibility nobody asked for, and
     name them in one line.
  2. Already in this codebase? Use it as surrounding code does.
  3. Standard library or platform feature? Use it, unless project has its own. SHOULD
     prefer a house component over a native widget.
  4. Installed dependency? Use it. MUST NOT add a dependency for a few lines.
  5. One line a reader gets at a glance? One line.
  6. Otherwise: the minimum code that works.
- MUST ship the smallest complete change, once you know everything it must touch. MUST
  finish every caller and fixture the change breaks. One-liner that needs decoding
  MUST NOT count as small.
- MUST limit change to scope (`craft` §1) and approved plan. MUST NOT make unrequested
  changes: refactors, renames, reformatting, fixes outside scope. The one exception is
  scope addition (`craft` §4).
- Bug that neither brief nor its plan item names, and that your change did not introduce,
  MUST NOT be fixed. It MUST be recorded as an out-of-scope finding instead, or reported
  as `stuck: <bug>` when it blocks the work.
- MUST keep the codebase's existing structure: its layers, interfaces and conventions,
  unless approved plan changes them (`core` §1). Code already clear and local MUST stay as
  it is.
- Moved or merged code MUST keep its error handling and validation.
- Between options of equal size, MUST take the one correct on edge cases.
- Never cut: MUST keep validation at trust boundaries, error handling that prevents data
  loss, security, accessibility, the calibration real hardware needs, and anything user
  asked for.
- Shortcut with a known limit MUST carry the marker comment
  `tech-debt: <what was simplified>, <the limit>, <when to upgrade>`.
- `tech-debt:` marker MUST NOT cover a shortcut on a never-cut item (above).
- Shortcut that plan's Accepted tech debt section does not name MUST be recorded as a
  design misfit (`craft` §1).

## 2. Readability

A human reads every line you write.

- Names of variables, functions and classes MUST say what they hold or do.
- High-level code SHOULD be short and read as steps: one function calling private helpers
  with clear names, not one long function.
- SHOULD prefer chaining over a declarative mess, unless it hurts readability. Chain MAY
  span several lines when each call has its own line.

## 3. Fixing and refactoring

- MUST fix the root cause of each bug the brief or its plan item names (other bugs: §1).
  It MUST first get a test that reproduces it. Then MUST grep every caller of the function
  you touch and fix the cause once, in shared code. Guard that only hides the crash
  MUST NOT count as a fix.
- Fix inside a loop MUST re-check every exit and `continue` path of that loop against each
  earlier finding on it, and SHOULD add a test for the path it adds.
- After two failed fixes that share one premise, MUST write the premise in one sentence
  and remove it. MUST NOT start a third fix before that.
- Coder that still has no cause after that MUST report `stuck: cause unknown`, with the
  premise it removed.
- When the brief or a follow-up message names a diagnose-only branch or commit, MUST NOT
  merge it or build on it. MUST write the fix on the commit the brief names to reset to.
  MAY copy its loop test, without the debug prefix, as regression test.
- Refactoring: MUST pin what code does with a test, change structure, then prove behavior
  did not change.
- A change to what a parameter means, with the same type, MUST rename the function or
  change the parameter's type. Renamed parameter alone misses a positional caller.
- SHOULD sequence work into small units. Finish and check one before starting the next.

## 4. Gates

Gates are in project context `## Gates`. A gate is `on` when its line or a part holds a
command; any other gate is off. A part's command runs inside its folder.

- Of each `on` gate, a change SHOULD run only a gate with no parts, its `.` parts, and
  each part whose folder holds a changed file. A changed file in no part folder of any
  gate, `.` aside, selects every part of each gate. A gate with none of these MUST NOT
  run; its report line MUST say `not run (no part touched)`.
- `coverage`: MUST run the command and never compute a number yourself. Build tools hold
  threshold.
- `owasp`: MUST run the command, then read changed code against current OWASP Top 10.
- `lint` and `unit`, when `on`, MUST pass at result tip in the parts the bullet above
  selects. Exceptions: a failure that already exists on `<base>`, and the debugger's
  diagnose-only exemption. MUST compare with `<base>` to tell. Between commits, SHOULD run
  only the checks that cover the changed files: the filtered tests of the TDD loop and the
  linter on those files. MUST run each selected gate once at result tip, and again only
  when a later commit changes a file that selects one of its parts (bullet above).
- Gate failure that already exists on `<base>` MUST NOT be fixed. It MUST be recorded as
  an out-of-scope finding.
- Before your report, every `on` gate the brief does not leave to main session MUST pass,
  except a gate not run for no part touched, or the report names the failing gate.
- Report MUST give one line per gate: the result and commit of its last run, or
  `not run (no part touched)`.

## 5. Commits

- Commits MUST be small and atomic: one requirement or one fix per commit, also in one
  coder result that covers several items.
- Subject: MUST be one imperative sentence under 72 characters that says what was done, so
  `git log --oneline` reads as the task's log.
- Body: SHOULD say why and how the change was proved.
