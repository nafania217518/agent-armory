---
name: test
description: >
  Test rules: pyramid, levels, unit style, TDD, test scope, structure, `req:` markers,
  determinism, review checks. Load before you write, plan or review a test. Use for
  "armory test rules", "TDD", "test levels", "req: marker", "/test".
max-lines: 136
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# test

What to test, at which level, and how.

## 1. Pyramid

- You SHOULD write fewer tests the higher the level: many `unit`, some `integration`
  and `functional`, very few `e2e`.
- You MUST put a test at the lowest level that can prove the behavior.
- A bug that only a higher-level test finds MUST get the lower-level test.
- The coder MAY delete a higher-level test on the touched behavior that only repeats a
  lower-level one. The deletion is a scope addition (section Test scope). A duplicate
  outside the touched behavior MUST NOT be touched. It MUST be recorded as an
  out-of-scope finding (`core` section Reports).

## 2. Levels

Each level MUST cover what its line says. The project context `## Test levels` MAY add to
or change these lines; that section MUST win.

- unit: one unit (a function, a class, or a small cluster), fast, runs on every change.
  Frontend unit tests with the backend stubbed are `unit`.
- integration: narrow, one integration point at a time (a real database, the file
  system, one separate service or its double), at the boundary of the service. The test
  MUST start the real part or the service double, trigger the code that uses it, and
  check the result there.
- contract: consumer-driven contract tests for each interface with a separate service.
  The consumer MUST write the contract; the provider MUST verify it. It keeps the
  doubles of `integration` honest.
- functional: acceptance from the user's view, black box, given/when/then, through the
  API or the UI, externals doubled.
- e2e: the deployed stack through its UI or API, the main user journeys only. Slow and
  flaky by nature: the project SHOULD keep only the few that earn their place.
- Surface rule: each surface MUST have at least one test level. Frontend: `unit` or
  `e2e` (browser). Backend: `unit` or `integration`. CLI and library: `unit`.

## 3. Unit style

- The project MUST pick `sociable` (real collaborators; doubles only for remote,
  non-deterministic, slow or side-effecting ones) or `solitary` (every collaborator
  doubled). Default: `sociable`.
- A double SHOULD stub a query. A test SHOULD verify a call only when the call is the
  behavior.

## 4. TDD

- You MUST write the failing test for every requirement before the code, except one with
  `tests: none`. You MUST work one test at a time: write it, see it fail for the
  expected reason, make the smallest change that passes it, and only then write the
  next test. A test that passes on its first run MUST fail once you break the code it
  covers; you MUST then undo the break. The break MUST remove what the rule in the test
  name depends on, such as a branch, an escape or a filter, one rule at a time. A break
  in other code does not prove the test.
- A requirement where an honest test is impractical MUST NOT get a bad test. The plan
  MUST decide it: the plan item carries the line `tests: none, <why>`.
- A coder that finds a planned test impractical MUST NOT drop it. That is a requirement
  change (`plan` section Amendments): the coder MUST stop and report `stuck:` with the
  why. `delegate` section Re-spawn and retry handles the rest.
- A test MUST call the code through its public interface, as its user does, and check
  what that user sees.
- A test that still passes when every function returns nothing MUST be thrown out. One
  exception: a "finds nothing" or "not shown" test MUST have a positive twin, a sibling
  test on the same data that finds or shows something; it is then kept.
- An expected value MUST come from a source independent of the code: a literal, a worked
  example, the spec. A test MUST NOT compute its expected value the way the code does.
- You MUST NOT assert the order of internal calls, or test private methods or trivial
  code (a getter, a pass-through, code with no branch).
- The happy path, each edge case the requirement touches (`review` section Look for,
  class Bug) and each failure path (invalid input, a missing dependency, an error from a
  callee) MUST each have their own test.

## 5. Test scope

- The main session MUST write the test-scope list into the plan: the existing test
  cases the change will break, rework or remove, each with the reason.
- When a change makes a response parse stricter (a new required field included), the
  list MUST name every test, mock and fixture of that response, also one that would
  still pass through a failure path.
- A scope addition is the one exception to the ban on unrequested changes (`implement`
  section The smallest complete change). It MUST be a failing test proven missed from
  the list (`implement` section Tests while coding), or a duplicate higher-level test on
  the touched behavior (section Pyramid). Its recorded item MUST carry its reason.
- The reviewer MUST check the reason and the code of each scope addition, and decide
  whether a rework is needed.

## 6. Structure and naming

- A test SHOULD arrange, act, assert (given, when, then).
- A test SHOULD check one condition; there SHOULD be one test per condition.
- A test case name MUST state the behavior. A prefix the framework requires comes first.
  The requirement id MUST NOT be in the case name or the file name.
- A test file MUST be named after the unit under test, in the framework's convention.
- You SHOULD keep one test file per unit and level; a unit's requirements share it.
  The level's command sets what marks its files: directory, suffix, build tag or target.
- An assertion on an order MUST include at least one pair of items that removing the
  sort or rank step would swap.
- An end-to-end step whose expected UI state equals the previous step's MUST also assert
  on its own response body. A DOM check alone can pass before that response arrives.

## 7. Markers

- The test that proves a requirement MUST carry the marker `req: <task-branch>/TR-n` in a
  comment on the line above the case, or above the group that holds its tests
  (`// req: add-login/TR-8`; several ids: `// req: add-login/TR-8, add-login/TR-13`).
  Scan:
```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?req: ' -- ':!*.md' ':!<docs>/'
```
- The scan MUST cover only code and test files: a marker in prose is an example.

## 8. Determinism

- A test MUST be deterministic: no sleep as a wait, no mutable state shared between
  tests, no dependence on test order or the clock.
- A real timer MAY run in an integration test when the timer is the behavior under test,
  with the shortest wait that proves it.

## 9. Review checks

- Each breach of a MUST or MUST NOT in this skill or in `implement` section Tests while
  coding MUST be reported as a finding, in the group `review` section Output sets. Two
  more cases MUST be findings: in a `sociable` project, a double for a collaborator that
  is not remote, slow, non-deterministic or side-effecting; a separate service with no
  `contract` test while that gate is `on`.
