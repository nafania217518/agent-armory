# implement ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/developer-essentials/skills/error-handling-patterns/SKILL.md` @9c61ab2 (MIT); https://github.com/wshobson/agents `plugins/shell-scripting/skills/bash-defensive-patterns/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

Error handling at the right level: catch only where code can act, and split expected
failures from bugs. A strict-mode floor for shell scripts the coder writes.

## Cons

- The model follows part of this by default; AGENTS.md says to delete such lines. Each change
  below needs evidence that the model breaks it, or it must go.
- Change 1 overlaps `implement` §The smallest complete change ("Never cut: ... error handling
  that prevents data loss") and the `review-ecc-improvement` draft, change 2 (silent
  failures). The draft adds only where to catch, not what to catch.
- Dropped: idempotent scripts. `implement` §Domain, boundaries and state already lists
  scripts as operations that MUST be idempotent.
- Dropped: the source's other shell tips (`[[ ]]`, `printf`, `command -v`, dry-run mode, a
  logging format); model defaults or taste.
- Change 2 is not the agent temp-file rule of `core` §Tools and background tasks; that rule
  is for an agent's own files, this one is for script code the coder ships.
- Size: `implement` is at its `max-lines` (155 of 155); adopting adds about 7 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. Catch where you can act

- Target: `implement` §Domain, boundaries and state (add bullet after "MUST NOT silence the
  compiler.")
- Text: Code MUST catch an error only where it can act on it: retry, fall back, clean up, or
  tell the user. Elsewhere it MUST let the error propagate. It MUST NOT log an error and then
  rethrow it; the handler that acts logs it once. An expected failure (bad input, not found)
  SHOULD be a return value. A bug SHOULD fail loudly.
- Why: a catch far from any action hides the cause, and log-then-rethrow writes each error
  twice.
- Evidence needed: an armory review finding of a catch with no action, or of a double-logged
  error, in coder output.

### 2. Shell script floor

- Target: `implement` §Domain, boundaries and state (add bullet after change 1)
- Text: A shell script the change adds MUST start in strict mode (`set -Eeuo pipefail` in
  bash), quote each variable expansion, and make temp files with `mktemp`, removed by an exit
  trap.
- Why: without strict mode a failed step goes on silently; an unquoted path with a space
  splits.
- Evidence needed: an armory coder script that ran on past a failed step, or broke on a path
  with a space.
