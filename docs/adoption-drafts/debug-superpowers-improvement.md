# debug ← superpowers (improvement)

Sources: https://github.com/obra/superpowers `skills/systematic-debugging/SKILL.md`, `skills/systematic-debugging/root-cause-tracing.md`, `skills/systematic-debugging/find-polluter.sh` @22f0b46 (MIT)
Status: draft, not adopted

## What it brings
Two hypothesis sources that `debug` lacks: recent changes, and a diff against similar working code. Two probes: one boundary sweep for a bug that crosses several components, and a backward trace of a bad value to its origin.

## Cons
- Most of the source overlaps `debug` §Feedback loop to §Probes and `implement` §Fixing and refactoring (the two-failed-fixes rule).
- Dropped: defense-in-depth checks at every layer. They conflict with YAGNI and `implement` §The smallest complete change.
- Dropped: the "no root cause" outcome that adds retry and monitoring. It conflicts with `implement` §Fixing and refactoring ("Guard that only hides the crash MUST NOT count as a fix"); armory reports `stuck:` instead.
- Moved: the test-pollution search (`find-polluter.sh`) is now the isolation probe in `debug-rezvani-improvement` change 3.
- `debug` is at its `max-lines` cap (102); each added line needs a raise.

## Proposed changes
### 1. Recent changes and working code as hypothesis sources
- Target: `debug` §Hypotheses (add bullet after "MUST write 3–5 ranked hypotheses")
- Text: `- SHOULD draw hypotheses from two sources first: changes since the last known-good state (code diff, dependency and config changes), and similar code in the repo that works, with each difference from the broken path listed. Done when each hypothesis names its source.`
- Why: §Hypotheses gives no source for candidates; a diff and a working twin give the cheapest ones.
- Evidence needed: a debug run that ranked a theory from reading code above a recent change that turned out to be the cause.
- Note: the category scan in `debug-wshobson-improvement` change 1 is a third source; when both pass, adopt them as one bullet.

### 2. Boundary sweep for multi-component bugs
- Target: `debug` §Probes (add bullet after "SHOULD use a debugger or REPL first")
- Text: `- When the symptom crosses several components (build, package, sign; API, service, database), the first probe SHOULD log what enters and leaves each boundary in one run. Done when the log names the first boundary where the value goes wrong.`
- Why: "targeted logs at boundaries" exists, but not the one-run sweep that finds the failing layer before any per-layer hypothesis.
- Evidence needed: a debug run on a pipeline bug that probed the layers one at a time across several runs.

### 3. Trace a bad value to its origin
- Target: `debug` §Probes (add bullet)
- Text: `- When a bad value shows up deep in a call chain, MUST trace it back through each caller to where it is created. The confirmed hypothesis MUST name that origin, not the line where the symptom shows. Done when the report gives the origin as path:line.`
- Why: `implement` §Fixing and refactoring demands a root-cause fix, but `debug` does not make the diagnosis name the origin, so a fix outline can target the symptom site.
- Evidence needed: a fix that added a guard at the crash site while the bad value came from a caller.
