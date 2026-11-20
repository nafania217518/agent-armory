---
name: craft
description: >
  Abstract: load only through a skill that extends it. The shared coding and test rules:
  scope before you write, domain types and boundaries, TDD, the test-scope list and
  data-growth paths.
metadata:
  type: abstract
  extends: [core]
  max-lines: 141
user-invocable: false
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.

# craft

## 1. Before you write

- MUST list every place the change must reach: callers, fixtures, config, exports. That is
  scope. Extra features are not. The list is done when, for each file the change edits, it
  names the files that import it (from a search), the public names the change touches and
  the data format the file reads or writes, if any.
- Scope MUST also hold each caveat-base line that names a file the change touches. Line
  found false SHOULD be reported with its fix, its new file or `drop`; main session has it
  written.
- MUST check what change can break for users: data it would destroy or expose, callers
  that stop working.
- Vague request SHOULD get the smallest version that does the core job.
- Design misfit: when new requirement does not fit design, coder MUST still follow plan
  and MUST record misfit with its reason (`core` §6). It MAY report `stuck: <misfit>`.
- When plan cannot be followed at all, coder MUST stop and report `stuck:` (coder agent
  card).

## 2. Domain, boundaries and state

- This section is a design rule, so an approved plan MAY override it (`core` §1).
- Domain structure and types MUST make illegal states and values impossible to write.
- MUST check and parse outside data once, where it enters. Inside, trust it.
- SHOULD keep business logic in pure functions.
- MUST NOT silence the compiler.
- Code MUST catch an error only where it can act on it: retry, fall back, clean up or tell
  the user. Elsewhere it MUST let the error propagate. It MUST NOT log an error and then
  rethrow it; the handler that acts MUST log it once. An expected failure (bad input, not
  found) SHOULD be a return value; a project convention for expected failures MUST win
  over this. A bug SHOULD fail loudly.
- A shell script the change adds MUST start in strict mode (`set -Eeu` in bash), quote
  each variable expansion, and make temp files with `mktemp`, removed by an exit trap.
- Operation that can run more than once MUST be idempotent: a second run, or a run after a
  crash halfway, ends in same state. Such operations are retried handlers, jobs,
  migrations, scripts, message consumers and a resume after a crash. Plain create call
  MUST be idempotent only when plan says so.
- MUST NOT share mutable state that does not need sharing. Shared state MUST have one
  writer, enforced by the structure.
- Code that applies an async answer to state (UI, cache, store) MUST key it to the request
  or input it answers. It MUST drop an answer whose key is not the latest.
- Single responsibility: each new or changed unit (function, class or module) MUST have
  one job, so it has one reason to change. Unit with two jobs MUST be split by job.
- Interface segregation: an interface MUST hold only methods its clients use. Client that
  needs part of a wide interface MUST get its own narrow one instead.

## 3. TDD

- You MUST write the failing test for every requirement before code, except one with
  `tests: none` or `tests: characterization`. You MUST work one test at a time: write it,
  see it fail for expected reason, make smallest change that passes it, and only then
  write next test. Test that passes on first run MUST fail once you break code it covers;
  you MUST then undo the break. Break MUST remove what the rule in test name depends on,
  such as a branch, escape or filter, one rule at a time. For a regression test written
  after its fix, break MUST be a revert to the pre-fix code. A break in other code does
  not prove the test.
- A requirement where an honest test is impractical MUST NOT get a bad test. Plan MUST
  decide it: plan item carries line `tests: none, <why>`, or `tests: <kind>, <why>` with
  one kind: `extract` (move the logic to a unit a test can call, then test it),
  `structural` (scan the source and assert the invariant), `model` (mirror the real code
  and cite the `path:line` it mirrors) or `characterization` (pin current behavior). A
  characterization test MUST be named a characterization test, not a regression test.
- A coder that finds a planned test impractical MUST NOT drop it. That is a requirement
  change: coder MUST stop and report `stuck:` with the why.
- A test MUST call code through its public interface, as its user does, and check what
  that user sees.
- A test that still passes when every function returns nothing MUST be thrown out. One
  exception: a "finds nothing" or "not shown" test MUST have a positive twin, a sibling
  test on same data that finds or shows something; it is then kept.
- An expected value MUST come from a source independent of the code: a literal, a worked
  example, the spec. A test MUST NOT compute its expected value the way code does.
- A test MUST NOT assert a message's exact wording, unless the requirement fixes that
  text. It MUST assert the behavior instead, such as the error kind or the value the
  message names.
- You MUST NOT assert the order of internal calls, or test private methods or trivial code
  (a getter, a pass-through, code with no branch).
- Happy path, each edge case the requirement touches (empty, zero, last item, rounding,
  time zones) and each failure path (invalid input, missing dependency, error from a
  callee) MUST each have their own test.
- Edge cases SHOULD come from partitions and boundaries: split each input into classes the
  code treats alike, test one value per class, and for each range test its min and max
  and the values just outside them.
- Conditions that interact SHOULD get a decision table, one test per row after rows with
  the same outcome merge. A stateful unit SHOULD get a state-transition table: one test
  per valid transition and one per invalid transition the unit must reject.
- An input of three or more parameters whose full product is too large to test SHOULD get
  a pairwise set: each pair of values appears in at least one test, with constraints that
  drop invalid combinations. Done when the plan or test file names the parameters, values
  and constraints.
- A property-based test MAY be added only for a large or unbounded input domain with a
  stable invariant (round trip, idempotency, order kept). A small finite domain MUST get
  partition tests instead.

## 4. Test scope

- Main session MUST write the test-scope list into plan: only existing test cases the
  change will break, rework or remove, each with the reason.
- When a change makes a response parse stricter, changes a type that tests build or map,
  or adds a required parameter or field to a shared type, the list MUST name each test,
  mock, fixture and call site that builds or reads it, found by a grep for the type or
  function name, also one that would still pass through a failure path.
- When a change alters behavior that other modules use, main session SHOULD list those
  modules from an import or call scan, not from memory, and name the test a gate runs on
  each. A consumer with no such test MUST be recorded (`core` §6) as a gap.
- A scope addition MUST be a failing test proven missed from the list (§5). It MUST be
  recorded (`core` §6), with its reason.
- Reviewer MUST check reason and code of each scope addition, and decide whether rework is
  needed.

## 5. Tests while coding

- MUST change only test cases on the test-scope list. New case in an existing file is not
  a change outside the scope.
- Test outside list that the change makes fail MUST count as a bug the change introduced.
  MUST fix code so test passes.
- MAY add the test to your scope only when you can prove it was missed from the list: the
  change is expected and explains the failure.
- MUST report the test only when you can neither fix the code nor prove the miss.

## 6. Data-growth paths

- A data-growth path is a read or write path whose cost grows with stored data: a query, a
  loop over stored rows, an index build.
- A benchmark MUST assert each measured query returns the rows its name promises, at least
  a non-empty result, so a query that finds nothing fails the run.
