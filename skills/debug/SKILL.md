---
name: debug
description: >
  Diagnosis of a bug whose cause is not known: feedback loop, reproduce and minimise,
  ranked hypotheses, one-variable probes, tagged debug logs, cleanup, redaction. Loaded
  by the debugger card; "/debug".
metadata:
  type: regular
  extends: [core, implement, test]
  max-lines: 166
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `implement` before your first code edit or commit when its rules are not in your
context.
Load `test` before you write a test when its rules are not in your context.

# debug

How to find a bug's cause, for debugger. It runs in one of two flows: diagnose only
(§6), or diagnose and fix, the fix flow (§7). Brief, or a later follow-up message, names
the flow.

On "/debug", main session MUST NOT run loop itself. It MUST spawn debugger instead.

## 1. Redact

- Each command, output and artifact you show MUST replace each secret with `<REDACTED>`.
- Loop MUST read credentials from environment, so no secret appears in its command.
- Quote from a captured artifact MUST hold only lines with the signal.
- When redacted output is not enough to diagnose the bug, MUST report `stuck:` with what
  is missing.

## 2. Feedback loop

- MUST NOT write a hypothesis, or build a theory from reading code, before loop exists.
  MUST build loop first.
- When the bug shows as a failed CI job whose log you can read, MUST read that log before
  the seam test below: the step whose failure set the non-zero exit, with errors the job
  treats as non-fatal skipped. SHOULD then read the last 10–20 runs of that job, not of
  the whole workflow, for its pass rate.
- When that job fails in a row, SHOULD find its last passing run and its first failing
  run, and check that each run before the first failure passes and each run after it
  fails. The first failing run's commit is then the breaking commit; a run that breaks
  that pattern MUST be named instead.
- MUST try a failing test at the seam that reaches the bug before any other loop.
- When that test does not work, SHOULD take first of these that works, in cost order:
  throwaway harness that calls the code path with one function call; CLI run on a fixture,
  diffed against known-good output; replay of a captured trace; HTTP script against a
  running dev server; property or fuzz loop; differential run of two versions or two
  configs on same input; bisection harness for `git bisect run` between two known states;
  headless browser script.
- An HTTP or browser loop against a local dev server MUST first list the servers that
  run and use the one the brief names. With no name and several running, MUST report
  `stuck:` with the list instead of a guess.
- SHOULD tighten loop: make it faster, assert on exact symptom, and make it deterministic
  (pinned time, seeded random, isolated files and network).
- Flaky bug: MUST first classify it by where it fails. Fails on repeat runs of one test
  alone: timing. Passes alone, fails in the suite: isolation (§5). Fails only in CI:
  environment. No pattern: infrastructure. SHOULD then raise reproduction rate in that
  setting (repeat trigger, run in parallel, add stress) until rate is high enough to
  debug against.
- Done when one command, already run once with its output shown, goes red on reported
  symptom, gives same verdict each run (flaky bug: a pinned high rate in its class's
  setting), runs in seconds and needs no human. Report then also names a flaky bug's
  class and rate, and what the CI read found: failing step, error line, pass rate, and,
  for a job that fails in a row, the breaking commit or the run that broke the pattern.
- With no such loop, MUST stop and report `stuck:` with what you tried and what you need:
  access to an environment that reproduces the bug, a redacted captured artifact, or a yes
  for temporary instrumentation.

## 3. Reproduce and minimise

- MUST run loop several times and check it shows reported symptom, not a nearby failure.
  MUST capture exact symptom: error message, wrong output or slow timing.
- MUST cut inputs, callers, config, data and steps one at a time, with a loop run after
  each cut. A cut that turns loop green MUST be undone.
- Done when removing any remaining element turns loop green.

## 4. Hypotheses

- MUST write 3–5 ranked hypotheses before you test any.
- SHOULD draw them first from changes since the last known-good state (code, dependency
  and config diffs) and from similar code in the repo that works, with each difference
  from the broken path listed. Before ranking, SHOULD also check each failure category
  for a candidate: logic (wrong condition, off-by-one, missed case), data (null, wrong
  type or shape, encoding, overflow), state (race, stale cache, shared mutation, bad
  initial value), integration (contract mismatch, version skew, config or env var),
  resource (leak, exhausted pool or quota) and environment (missing dependency,
  platform, permission, time zone or locale).
- A hypothesis that the brief lists as refuted by an earlier debugger MUST NOT be ranked
  again on the same evidence. MUST leave it out, or rank it beside new evidence that
  contradicts its named disproof.
- Each hypothesis MUST carry a falsifiable prediction in form
  `If <X> is the cause, then <changing Y> makes the bug go away`. Hypothesis with no
  prediction MUST be dropped or sharpened.
- Done when ranked hypotheses are written, each with its prediction and its source (a
  diff, a working twin or a category), the list names the categories it checked, and
  each re-ranked one names its new evidence.

## 5. Probes

- Each probe MUST test one prediction and change one variable.
- SHOULD use a debugger or REPL first, then targeted logs at boundaries that tell
  hypotheses apart. When the symptom crosses several components (build, package, sign;
  API, service, database), the first probe SHOULD log what enters and leaves each
  boundary in one run, until the log names the first boundary where the value goes wrong.
- A probe of UI state SHOULD read the accessibility tree (role, name, state of each
  element). A screenshot SHOULD serve only a visual property: layout, color or a rendered
  image.
- MUST NOT log everything and grep. MUST name targeted log and the hypothesis it tests
  instead.
- Each debug log MUST carry debug prefix, unique for the run, such as `[DEBUG-a4f2]`.
- Performance bug MUST get a baseline measurement first.
- Isolation failure (§2): SHOULD find the polluting test. Run the suite's test files one
  at a time, or in halves, before the victim, and check the leaked state or file after
  each, until one file alone, run before the victim, turns the loop red.
- When a bad value shows up deep in a call chain, MUST trace it back through each caller
  to where it is created. The confirmed hypothesis MUST name that origin as `path:line`,
  not the line where the symptom shows.
- MUST test your own ranking and record a verdict for each hypothesis: confirmed,
  refuted, inconclusive or untested. A refuted one MUST name the probe and the result
  that refuted it. Inconclusive means a probe ran but did not tell the prediction apart:
  MUST sharpen that probe and run it once more before you move to a lower hypothesis; a
  second inconclusive run keeps that verdict.
- When two hypotheses are confirmed and each changes the symptom alone, MUST report both
  as one compound cause; the fix MUST cover both.
- Before a fix outline or a fix inverts current behavior, MUST search history for the
  commit that added the line (a pickaxe search on its exact text) and grep for a test
  that asserts that behavior. When a commit message or test shows intent, MUST report
  `stuck:` with that commit or test instead of a fix outline or a fix.
- When each hypothesis is refuted or inconclusive, MUST go back to §4 and draw new ones
  from what the probes showed. After a second round with each one refuted or
  inconclusive, MUST report `stuck: cause unknown` with those hypotheses.
- Done when the confirmed hypotheses, changed together, turn the loop green, and the
  report names each one with the probe that confirmed it, and the commit and test the
  intent check found, or `none`.

## 6. Diagnose only

- MUST NOT write the fix. MUST end with report instead.
- MUST commit loop when it is a file. MAY commit other debug code (a harness, tagged
  logs). Each debug commit MUST go on debugger's worktree branch. MUST NOT merge that
  branch into task branch; MUST name it in report instead.
- Each debug commit subject MUST start with `debug(<id>):`, where `<id>` is debug prefix's
  id.
- Diagnose-only exemption: tip of a diagnose-only result MAY fail `unit` because of its
  loop test.
- Before the fix outline, SHOULD search open pull requests and, with a tracker bound,
  open tracker items for one that names the failing file or error.
- Done when report names the confirmed hypotheses, loop command with its last output, a
  proposed fix outline, the matching open item or `none matched`, and the debug commits
  on the diagnose-only branch, and no debug code is left uncommitted.

## 7. Fix and cleanup

In the fix flow:

- Fix MUST follow `implement` §3. Its regression test MUST follow `test` §1. Minimised
  repro MAY become that test.
- Done when original loop passes, diff against the commit the run, or its last follow-up
  message, reset to (untracked files included) holds only the fix and its regression
  tests, and the fix's commit message states the confirmed hypotheses. A flaky bug's
  loop also passed as many times in a row as its pinned rate needs to show at least 3
  failures.
