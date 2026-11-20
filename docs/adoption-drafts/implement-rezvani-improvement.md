# implement ← rezvani (improvement)

Sources: https://github.com/alirezarezvani/claude-skills `engineering/agent-harness/skills/agent-harness/SKILL.md` @f8593c4 (MIT); https://github.com/alirezarezvani/claude-skills `engineering/skills/agent-run-forensics/SKILL.md` @f8593c4 (MIT); https://github.com/alirezarezvani/claude-skills `engineering/skills/commit-craft/SKILL.md` @f8593c4 (MIT); https://github.com/ChiefGyk3D/department-of-internal-arguments `policies/quality-gates.md` line 3 @a9d4347 (Apache-2.0, with NOTICE; change 1 only)
Status: draft, not adopted

## What it brings

A fix for a real trap in `implement` §Gates per commit: trimmed gate output can hide a
failing exit code. Also a rule that a gate run counts only for the tree it ran on, and a
staging rule for atomic commits.

## Cons

- Gate integrity ("never change a gate you are judged by") lives in
  `implement-ecc-improvement`, change 1; this draft does not repeat it (SSOT).
- Dropped: "a commit that moves code carries its callers' import edits". `implement` §The
  smallest complete change already makes a coder finish every caller the change breaks.
- Dropped: "each commit builds" checked with `git rebase -x`. §Gates per commit already says
  `lint` and `unit` SHOULD pass on each commit, and a rebase in a shared worktree adds risk.
- `review` §The diff is the truth runs gates by `implement` §Gates per commit, so change 1
  also covers the reviewer; no `review` edit is needed.
- Size: `implement` is at its `max-lines` (155 of 155); adopting adds about 4 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Pass or fail comes from the gate's own exit code

- Target: `implement` §Gates per commit (replace bullet "Gate, build and test output MUST
  reach your context only as its tail or a grep for FAIL or error, and a long file only by
  line range or a search.")
- Text: Gate, build and test output MUST reach your context only as its tail or a grep for
  FAIL or error, and a long file only by line range or a search. Pass or fail MUST come from
  the gate command's own exit code, never from the trim's: run with `set -o pipefail`, or
  save the exit code before trimming the output.
- Why: verified on 2026-11-18 against `skills/implement/SKILL.md:141` at 200eb7f. The bullet
  says to read output only as its tail or a grep, and a shell pipe returns the last
  command's code. Local bash run: `false | tail -n 1` exits 0, so a failing gate reads as
  pass; with `set -o pipefail` it exits 1. `false | grep -E "FAIL|error"` exits 1 when no
  line matches, so a pipe through grep can also turn a pass into a fail.
- Second source: DoIA `policies/quality-gates.md:3` also bans piping a gate into `tail`
  or `grep` and chaining on the result; it saves the exit code first. It records no
  observed failure.
- Evidence: the bash runs above (measured), plus the rezvani survey's own `false | tail`
  check. No armory session is yet known where a coder reported a false pass.

### 2. A gate run counts only for its tree

- Target: `implement` §Gates per commit (replace bullet "Before your report, every `on` gate
  the brief does not leave to main session (`delegate` §Briefs) MUST pass, or the report
  names the failing gate.")
- Text: Before your report, every `on` gate the brief does not leave to main session
  (`delegate` §Briefs) MUST pass at the reported commit with a clean tree, or the report
  names the failing gate. A run before a later edit MUST NOT count; rerun the gate instead.
- Why: a coder may run gates, make one more edit, and report the old pass.
- Evidence needed: an armory coder report whose gate pass predated its last commit.

### 3. Stage by name

- Target: `implement` §Commits (add bullet after "Commits MUST be small and atomic")
- Text: MUST NOT stage all changes at once while the tree holds changes that belong to another
  commit. MUST stage that commit's files by name or by hunk instead.
- Why: staging all changes at once on a mixed tree turns two atomic commits into one, or
  sweeps in a scratch file.
- Evidence needed: an armory commit that held a stray file or two requirements; `review`
  §The diff is the truth reports stray files, so a review finding of that kind is the
  evidence.
