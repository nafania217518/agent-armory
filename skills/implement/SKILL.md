---
name: implement
description: >
  The coder's rules: scope before you write, the smallest complete change, readability,
  domain types and boundaries, root-cause fixes, safe refactors, the test-scope list,
  the gates per commit, atomic commits. Loaded by the coder and debugger cards and by
  `code`; "/implement". For a coding request from the user, load `code` instead.
max-lines: 148
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# implement

How to write code, for the coder, the debugger, or the main session when it codes. The
reviewer judges code against it. Test rules: `test`.

## 1. Before you write

- MUST read the task and the code it touches.
- MUST list every place the change must reach: callers, fixtures, config,
  exports. That is the scope. Extra features are not.
- MUST check what the change can break for users: data it would destroy or expose,
  callers that stop working.
- Before adding or applying a formatting or style rule, MUST check the project's linter
  and formatter config for a rule that enforces it or undoes it. A mechanical style
  rule SHOULD go into that config, not into the project context `## Rules`.
- A vague request SHOULD get the smallest version that does the core job.
- Design misfit: when a new requirement does not fit the design, SHOULD ask what you
  would build had it been there from the start. When that differs from the plan, the
  coder MUST still follow the plan and MUST record the misfit with its reasoning (`core`
  section Reports). It MAY stop and report `stuck: <misfit>` at once when going on
  wastes significant work. On the user's yes, the change goes back to plan mode (`plan`
  section Amendments); the new design SHOULD ship in pieces.
- When the plan cannot be followed at all, the coder MUST stop and report `stuck:` (the
  coder agent card).

## 2. The smallest complete change

- The ladder. MUST take the first option that fully works:
  1. Does it need to exist? Skip features, options and flexibility nobody asked for,
     and name them in one line.
  2. Already in this codebase? Use it the way the surrounding code does.
  3. Standard library or platform feature? Use it, unless the project has its own.
     SHOULD prefer a house component over a native widget.
  4. An installed dependency? Use it. MUST NOT add a dependency for a few lines.
  5. One line a reader gets at a glance? One line.
  6. Otherwise: the minimum code that works.
- MUST ship the smallest complete change, once you know everything it must touch. MUST
  finish every caller and fixture that the change breaks. A one-liner that needs
  decoding MUST NOT count as small.
- MUST limit the change to the scope (section Before you write) and the approved plan.
  MUST NOT make unrequested changes: refactors, renames, reformatting, fixes outside
  the scope. The one exception is the scope addition (`test` section Test scope).
- A bug that neither the brief nor its plan item names, and that your change did not
  introduce, MUST NOT be fixed. It MUST be recorded as an out-of-scope finding
  instead, or reported as `stuck: <bug>` when it blocks the work.
- MUST NOT add an abstraction, wrapper, option, config, boilerplate or "for later" code
  that nobody asked for. MUST follow the ladder (above) instead.
- MUST keep the structure the codebase already has: its layers, interfaces and
  conventions, unless the approved plan changes them (`core` section Rule words). Code
  that is already clear and local MUST stay as it is.
- Code that is moved or merged MUST keep its error handling and validation.
- Between options of equal size, MUST take the one that is correct on edge cases.
- Never cut: MUST keep validation at trust boundaries, error handling that prevents data
  loss, security, accessibility, the calibration real hardware needs, and anything the
  user asked for.
- A shortcut with a known limit MUST carry the marker comment
  `tech-debt: <what was simplified>, <the limit>, <when to upgrade>`.
- A `tech-debt:` marker MUST NOT cover a shortcut on a never-cut item (above).

## 3. Readability

A human reads every line you write. `review` section Look for checks these rules.

- Names of variables, functions and classes MUST say what they hold or do.
- High-level code SHOULD be short and read as the steps: one function that calls private
  helpers with clear names, not one long function.
- SHOULD prefer chaining over a declarative mess, unless it hurts readability. A chain
  MAY span several lines when each call has its own line.

## 4. Domain, boundaries and state

- Domain structure and types MUST make illegal states and values impossible to write.
- MUST check and parse outside data once, where it enters. Inside, trust it.
- SHOULD keep the business logic in pure functions.
- MUST NOT silence the compiler.
- An operation that can run more than once MUST be idempotent: a second run, or a run
  after a crash halfway, ends in the same state. Such operations are retried handlers,
  jobs, migrations, scripts, message consumers and a resume after a crash. A plain
  create call MUST be idempotent only when the plan says so.
- MUST NOT share mutable state that does not need to be shared. Shared state MUST have
  one writer, enforced by the structure.

## 5. Fixing and refactoring

- MUST fix the root cause of each bug the brief or its plan item names (other bugs:
  section The smallest complete change). It MUST first get a test that reproduces it.
  Then MUST grep every caller of the function you touch and fix the cause once, in the
  shared code. A guard that only hides the crash MUST NOT count as a fix.
- After two failed fixes that share one premise, MUST write the premise in one sentence
  and remove it. MUST NOT start a third fix before that.
- A coder that still has no cause after that MUST report `stuck: cause unknown`, with
  the premise it removed.
- When the brief names a debug branch, MUST NOT merge it; MUST write the fix on the
  task branch instead. MAY copy its loop test, without the debug prefix and the skip,
  as the regression test.
- Refactoring: MUST pin what the code does with a test, change the structure, then prove
  the behavior did not change.
- SHOULD sequence work into small units. Finish and check one before you start the next.

## 6. Tests while coding

- MUST change only the test cases on the test-scope list. A new case in an existing file
  is not a change outside the scope.
- A test outside the list that the change makes fail MUST count as a bug the change
  introduced. MUST fix the code so the test passes. A test that already fails on
  `<base>`: section Gates per commit.
- MAY add the test to your scope only when you can prove it was missed from the list:
  the change is expected and explains the failure.
- MUST report the test only when you can neither fix the code nor prove the miss.

## 7. Gates per commit

The gates and their commands are in the project context `## Gates` and `## Commands`.

- `coverage`: MUST run the command and never compute a number yourself. The build
  tools hold the threshold.
- `owasp`: MUST run the command, then read the changed code against the current OWASP
  Top 10.
- Per commit: `lint` and `unit`, when `on`, MUST pass, except a failure that already
  exists on `<base>` (`code` section Branch and plan file). MUST compare with it to tell.
- A gate failure that already exists on `<base>` MUST NOT be fixed. It MUST be recorded
  as an out-of-scope finding. `code` section Task end sets the report gates.
- Before your report, every `on` gate MUST pass, or the report names the failing gate.
- The report MUST give one line per gate for a commit range when every commit in it
  gives the same result. A commit that differs MUST get its own line.

## 8. Commits

- Commits MUST be small and atomic: one requirement or one fix per commit, also in one
  coder result that covers several items.
- Subject: MUST be one imperative sentence under 72 characters that says what was done,
  so that `git log --oneline` reads as the log of the task.
- Body: SHOULD say why and how the change was proved.
