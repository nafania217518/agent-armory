---
name: debug
description: >
  Diagnosis of a bug whose cause is not known: feedback loop, reproduce and minimise,
  ranked hypotheses, one-variable probes, tagged debug logs, cleanup, redaction. Loaded
  by the debugger card, and by `code` when the main session debugs itself; "/debug".
max-lines: 102
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# debug

How to find a bug's cause, for debugger or main session when it debugs. It runs in one
of two flows: diagnose only (§6), or diagnose and fix, the fix flow (§7). Brief names
the flow, or user's request when main session debugs itself.

## 1. Redact

- Each command, output and artifact you show MUST replace each secret with `<REDACTED>`.
- Loop MUST read credentials from environment, so no secret appears in its command.
- Quote from a captured artifact MUST hold only lines with the signal.
- When redacted output is not enough to diagnose the bug, MUST report `stuck:` with what
  is missing.

## 2. Feedback loop

- MUST NOT write a hypothesis, or build a theory from reading code, before loop exists.
  MUST build loop first.
- MUST build loop the first way that works, in this order:
  1. Failing test at the seam that reaches the bug.
  2. HTTP script against a running dev server.
  3. CLI run on a fixture, diffed against known-good output.
  4. Headless browser script.
  5. Replay of a captured trace through the code path.
  6. Throwaway harness that calls the code path with one function call.
  7. Property or fuzz loop over many random inputs.
  8. Bisection harness for `git bisect run`, when bug appeared between two known states.
  9. Differential run of two versions or two configs on same input.
- SHOULD tighten loop: make it faster, assert on exact symptom, and make it deterministic
  (pinned time, seeded random, isolated files and network).
- Flaky bug: SHOULD raise reproduction rate (repeat trigger, run in parallel, add stress)
  until rate is high enough to debug against.
- Done when one command, already run once with its output shown, goes red on reported
  symptom, gives same verdict each run (flaky bug: a pinned high rate), runs in seconds
  and needs no human.
- With no such loop, MUST stop and report `stuck:` with what you tried and what you
  need: access to an environment that reproduces the bug, a redacted captured artifact,
  or a yes for temporary instrumentation.

## 3. Reproduce and minimise

- MUST run loop several times and check it shows reported symptom, not a nearby failure.
  MUST capture exact symptom: error message, wrong output or slow timing.
- MUST cut inputs, callers, config, data and steps one at a time, with a loop run after
  each cut. A cut that turns loop green MUST be undone.
- Done when removing any remaining element turns loop green.

## 4. Hypotheses

- MUST write 3–5 ranked hypotheses before you test any.
- Each hypothesis MUST carry a falsifiable prediction in form
  `If <X> is the cause, then <changing Y> makes the bug go away`. Hypothesis with no
  prediction MUST be dropped or sharpened.
- Done when ranked hypotheses, each with its prediction, are written.

## 5. Probes

- Each probe MUST test one prediction and change one variable.
- SHOULD use a debugger or REPL first, then targeted logs at boundaries that tell
  hypotheses apart.
- MUST NOT log everything and grep. MUST name targeted log and the hypothesis it tests
  instead.
- Each debug log MUST carry debug prefix, unique for the run, such as `[DEBUG-a4f2]`.
- Performance bug MUST get a baseline measurement first.
- MUST test your own ranking and record a verdict for each hypothesis: confirmed,
  refuted or untested. Done when one hypothesis is confirmed. When all are refuted, MUST
  go back to §4.

## 6. Diagnose only

- MUST NOT write the fix. MUST end with report instead.
- MUST commit loop when it is a file. MAY commit other debug code (a harness, tagged
  logs). Each debug commit MUST go only on a branch `debug-<id>` cut from task branch,
  where `<id>` is the debug prefix's id. MUST NOT merge that branch into task branch;
  MUST name it in report instead.
- Each debug commit subject MUST start with `debug(<id>):`. Each debug commit MUST keep
  `on` gates green: a loop test goes in skipped, with debug prefix in its name.
- Done when report names the confirmed hypothesis, loop command with its last output, a
  proposed fix outline, and debug branch with its commits, no debug code is left
  uncommitted, and checkout is back on the branch the run started on.

## 7. Fix and cleanup

In the fix flow:

- Fix MUST follow `implement` §Fixing and refactoring. Minimised repro MUST become its
  regression test.
- Done when original loop passes, diff against the commit the run started from
  (untracked files included) holds only the fix and its regression test, and the fix's
  commit message states the confirmed hypothesis.
