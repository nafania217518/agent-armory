---
name: test
description: >
  Test guide: the test pyramid, the test levels (unit, integration, contract,
  functional, e2e), sociable unit tests, what to test and what not, test structure, speed,
  and the review checks for tests. Load before writing or reviewing any test. Use for
  "how should we test this", "write tests for", "test strategy", "test plan", "/test".
---

# test

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119. The project
`AGENTS.md` `## Test levels` section is the truth for level names and the unit style;
this skill holds the rules.

## 1. The pyramid

- Write tests at different granularity. The higher the level, the fewer the tests: many
  `unit`, some `integration` and `functional`, very few `e2e`.
- MUST put a test at the lowest level that can prove the behavior.
- When a higher-level test finds a bug and no lower-level test fails, MUST write the
  lower-level test.
- A higher-level test that only repeats a lower-level one MUST be deleted.

## 2. Levels

The template prefills these definitions in `## Test levels`; the project edits them. The
names are the project's choice. Do not argue terms; test.

- `unit`: one unit (a function, a class, or a small cluster the team treats as one).
  Fast. Runs on every change. Frontend unit tests with the backend stubbed are `unit`.
- `integration`: narrow. One integration point at a time: a real database, the file
  system, one separate service or its double. Lives at the boundary of the service.
  Start the real part, trigger the code that uses it, check the result through that part.
- `contract`: consumer-driven contract tests for each interface with a separate service.
  The consumer writes the contract; the provider verifies it. Keeps the doubles used in
  `integration` honest.
- `functional`: acceptance from the user's view. Black box, given/when/then, through the
  API or the UI, externals doubled.
- `e2e`: the deployed stack through its user interface or API. The main user journeys
  only. Slow and flaky by nature: keep the few that earn their place.

## 3. Unit style

- Sociable by default: real collaborators. Test doubles only for awkward collaborators:
  remote services, non-determinism, slow or side-effecting resources.
- Stub queries. Verify a call only when the call is the behavior.
- A project switches to `solitary` (every collaborator doubled) in `## Test levels`.

## 4. What to test

- The public interface and observable behavior: given `x` and `y`, the result is `z`.
  MUST NOT assert the order of internal calls.
- MUST NOT test private methods. MUST NOT test trivial code: a getter, a pass-through,
  code with no branch.
- Happy path, every edge case the requirement touches, every failure path (`code` skill,
  section 4).
- One test module per production module, as the rule of thumb.

## 5. Structure

- Arrange, act, assert (given, when, then). One condition per test; as many tests as
  there are conditions.
- Every test name starts with the requirement id and states the behavior. A requirement
  has as many tests as it needs: happy path, edge cases, failure paths. One is the floor,
  not the target.
- Test code gets the same care as production code.
- DAMP: duplication in test code is allowed when it improves readability. Extract a
  helper at the third repeat (Rule of Three). This is the one exception to base rule 4
  (DRY), for test code only.

## 6. Speed

- The `unit` suite runs after every change (the compile suite). `lint` and `unit` run
  per commit (the commit suite; `code` skill, section 11). Slower levels run before
  handover.
- A test MUST be deterministic: no sleep-and-hope, no shared mutable state between
  tests, no dependence on test order or on the clock.

## 7. Review checks

Each is a finding (Should fix, unless it hides a bug):

- a test at a higher level than the lowest that can prove the behavior;
- the same behavior tested at two levels;
- a test of trivial code or of a private method;
- a test coupled to structure: mock verification of call order, assertions on internals;
- a missing edge case or failure path for a changed requirement;
- a non-deterministic test;
- in a sociable project, a double for a collaborator that is neither remote, slow,
  non-deterministic nor side-effecting;
- a contract with a separate service that has no `contract` test while the gate is `on`.
