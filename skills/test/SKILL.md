---
name: test
description: >
  Test rules: pyramid, levels, unit style, TDD, test scope, structure, `req:` markers,
  determinism, review checks. Load before you write, plan or review a test. Use for
  "armory test rules", "TDD", "test levels", "req: marker", "/test".
metadata:
  type: regular
  extends: [core, craft]
  max-lines: 109
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `craft` before your first step when its rules are not in your context.

# test

What to test, at which level, and how.

## 1. Pyramid

- You SHOULD write fewer tests the higher the level: many `unit`, some `integration` and
  `functional`, very few `e2e`.
- You MUST put a test at the lowest level that can prove the behavior.
- A bug only a higher-level test finds MUST get the lower-level test.
- A higher-level test outside touched behavior that only repeats a lower-level one
  MUST NOT be touched. It MUST be recorded as an out-of-scope finding (`core` §6).

## 2. Levels

Each level MUST cover what its line says. Project context `## Test levels` MAY add to or
change these lines; that section MUST win.

- unit: one unit (function, class or small cluster), fast, runs on every change. Frontend
  unit tests with backend stubbed are `unit`.
- integration: narrow, one integration point at a time (real database, file system, one
  separate service or its double), at service boundary. Test MUST start real part or
  service double, trigger code that uses it, and check result there.
- contract: consumer-driven contract tests for each interface with a separate service.
  Consumer MUST write the contract; provider MUST verify it. It keeps `integration`
  doubles honest.
- functional: acceptance from user's view, black box, given/when/then, through API or UI,
  externals doubled.
- e2e: deployed stack through its UI or API, main user journeys only. Slow and flaky by
  nature: project SHOULD keep only the few that earn their place.
- Surface rule: each surface MUST have at least one test level. Frontend: `unit` or `e2e`
  (browser). Backend: `unit` or `integration`. CLI and library: `unit`.

## 3. Unit style

- Project MUST pick `sociable` (real collaborators; doubles only for remote,
  non-deterministic, slow or side-effecting ones) or `solitary` (every collaborator
  doubled). Default: `sociable`.
- A double SHOULD stub a query. A test SHOULD verify a call only when the call is the
  behavior.
- A double's data MUST hold every field the real source returns, not only the fields the
  test reads.

## 4. Structure and naming

- DAMP: test code MAY repeat itself when that reads easier; the one exception to DRY
  (`core` §4). You SHOULD extract a helper at the third repeat.
- A test SHOULD arrange, act, assert (given, when, then).
- A test SHOULD check one condition; there SHOULD be one test per condition.
- Test case name MUST state the behavior. A prefix the framework requires comes first. The
  requirement id MUST NOT be in the case name or the file name.
- A test file MUST be named after the unit under test, in the framework's convention.
- You SHOULD keep one test file per unit and level; a unit's requirements share it.
  Level's command sets what marks its files: directory, suffix, build tag or target.
- An assertion on an order MUST include at least one pair of items that removing the sort
  or rank step would swap.
- Test data MUST give each field of one type a distinct value, so a swapped, dropped or
  wrong-key mapping fails a test: length ≠ width ≠ height; id order ≠ name order ≠ insert
  order.
- An end-to-end step whose expected UI state equals previous step's MUST also assert on
  its own response body. DOM check alone can pass before that response arrives.
- A test that drives a UI MUST find each element by role and accessible name, then by
  label, then by visible text, then by a test id. It MUST NOT use a CSS class, a DOM path
  or a child index; when none of the four fits, it MUST add a test id to the element
  instead.
- Production code MUST NOT hold a method that only tests call, such as a reset or cleanup
  hook. It MUST go in a test helper instead.

## 5. Markers

- Test that proves a requirement MUST carry marker `req: <task-branch>/TR-n` in a comment
  on the line above the case, or above group holding its tests (`// req: add-login/TR-8`;
  several ids: `// req: add-login/TR-8, add-login/TR-13`). Scan:
```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?req: ' -- ':!*.md' ':!<docs>/'
```
- Scan MUST cover only code and test files: a marker in prose is an example.

## 6. Determinism

- A test MUST be deterministic: no sleep as a wait, no mutable state shared between tests,
  no dependence on test order, the clock or unseeded random data.
- A test against a real data store MUST create the records it needs and remove them
  after, or run in a store or transaction no other test sees.
- A real timer MAY run in an integration test when the timer is the behavior under test,
  with the shortest wait that proves it.

## 7. Review checks

- Each breach of a MUST or MUST NOT in this skill or in `craft` §3–§6 MUST be reported as
  a finding. Two more cases MUST be findings: in a `sociable` project, a double for a
  collaborator that is not remote, slow, non-deterministic or side-effecting; a separate
  service with no `contract` test while that gate is `on`.
