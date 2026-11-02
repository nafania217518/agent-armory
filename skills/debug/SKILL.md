---
name: debug
description: >
  Diagnosis of a bug whose cause is not known: feedback loop, reproduce and minimise,
  ranked hypotheses, one-variable probes, tagged debug logs, cleanup, redaction. Loaded
  by the debugger card, and by `code` when the main session debugs itself; "/debug".
max-lines: 107
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# debug

How to find the cause of a bug, for the debugger or the main session when it debugs.
It runs in one of two flows: diagnose only (section 6), or diagnose and fix, the fix
flow (section 7). The brief names the flow, or the user's request when the main session
debugs itself.

## 1. Redact

- Each command, output and artifact you show MUST replace each secret with
  `<REDACTED>`.
- A loop MUST read credentials from the environment, so no secret appears in the
  command.
- A quote from a captured artifact MUST hold only the lines with the signal.
- When the redacted output is not enough to diagnose the bug, MUST report `stuck:` with
  what is missing.

## 2. Feedback loop

- MUST NOT write a hypothesis, or build a theory from reading code, before the loop
  exists. MUST build the loop first.
- MUST take the first way to build the loop that works, in this order:
  1. A failing test at the seam that reaches the bug.
  2. An HTTP script against a running dev server.
  3. A CLI run on a fixture, diffed against a known-good output.
  4. A headless browser script.
  5. A replay of a captured trace through the code path.
  6. A throwaway harness that calls the code path with one function call.
  7. A property or fuzz loop over many random inputs.
  8. A bisection harness for `git bisect run`, when the bug appeared between two known
     states.
  9. A differential run of two versions or two configs on the same input.
- SHOULD tighten the loop: make it faster, assert on the exact symptom, and make it
  deterministic (pinned time, seeded random, isolated files and network).
- A flaky bug: SHOULD raise the reproduction rate (repeat the trigger, run in parallel,
  add stress) until the rate is high enough to debug against.
- Done when one command, already run once with its output shown, goes red on the
  reported symptom, gives the same verdict each run (a flaky bug: a pinned high rate),
  runs in seconds and needs no human.
- With no such loop, MUST stop and report `stuck:` with what you tried and what you
  need: access to an environment that reproduces the bug, a redacted captured artifact,
  or a yes for temporary instrumentation.

## 3. Reproduce and minimise

- MUST run the loop several times and check that it shows the reported symptom, not a
  nearby failure. MUST capture the exact symptom: the error message, the wrong output
  or the slow timing.
- MUST cut inputs, callers, config, data and steps one at a time, with a loop run after
  each cut. A cut that turns the loop green MUST be undone.
- Done when removing any remaining element turns the loop green.

## 4. Hypotheses

- MUST write 3–5 ranked hypotheses before you test any.
- Each hypothesis MUST carry a falsifiable prediction in the form `If <X> is the cause,
  then <changing Y> makes the bug go away`. A hypothesis with no prediction MUST be
  dropped or sharpened.
- Done when the ranked hypotheses, each with its prediction, are written.

## 5. Probes

- Each probe MUST test one prediction and change one variable.
- SHOULD use a debugger or a REPL first, then targeted logs at the boundaries that tell
  the hypotheses apart.
- MUST NOT log everything and grep. MUST name the targeted log and the hypothesis it
  tests instead.
- Each debug log MUST carry one unique prefix for the run, such as `[DEBUG-a4f2]`.
- A performance bug MUST get a baseline measurement first, then a bisection.
- MUST test your own ranking and record a verdict for each hypothesis: confirmed,
  refuted or untested. Done when one hypothesis is confirmed. When all are refuted,
  MUST go back to section 4.

## 6. Diagnose only

- MUST NOT write the fix. MUST end with the report instead.
- MAY commit debug code (the loop, a harness, tagged logs), only on a branch
  `debug-<id>` cut from the task branch, where `<id>` is the id of the run's prefix.
  MUST NOT merge it into the task branch; MUST name it in the report instead.
- Each debug commit subject MUST start with `debug(<id>):`. Each debug commit MUST keep
  the `on` gates green: a loop test goes in skipped, with the prefix in its name.
- Done when the report names the confirmed hypothesis, the loop command with its last
  output, a proposed fix outline, and the debug branch with its commits, no debug code
  is left uncommitted, and the checkout is back on the branch the run started on.

## 7. Fix and cleanup

In the fix flow:

- The fix MUST follow `implement` section Fixing and refactoring. The minimised repro
  MUST become its regression test.
- Done when the original loop passes, a grep for the prefix shows no hit, each
  throwaway harness is deleted, and the commit message of the fix states the confirmed
  hypothesis.
