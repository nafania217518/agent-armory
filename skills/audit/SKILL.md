---
name: audit
description: >
  Quality audit of a whole repo or package: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, what to delete, and the tech-debt ledger.
  One-shot ranked report, changes nothing. Use for "audit this codebase", "review the
  whole repo", "find bloat", "what can I delete", "list the tech debt", "/audit".
max-lines: 74
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load the `core` skill first when its rules are not in your context.

# audit

The reviewer runs an audit on an audit brief; the main session runs it when the user
asks. Load `review`, `test` and `implement` first. The audit MUST apply these `review`
rules to a whole repo or package: the full-report and read-only rules (`review` section
Understand first, first bullet), the order of importance and the classes (`review`
section Look for), `review` section Check before you report, and the finding format of
`review` section Output. This skill holds only what differs from a review.

## 1. Map first

- MUST audit what the user names: a folder, a package, or the whole repo. Nothing
  named: the whole repo.
- MUST read the README, deploy and build config, dependency list, entry points (main,
  routes, handlers, jobs, CLI commands) and tests.
- MUST find the expected load.
- MUST trace the main flows end to end. MUST read these fully: input from users, money,
  auth, data writes, background jobs, anything shared between processes.
- Big repo: SHOULD go deep where a mistake costs the most, not file by file. SHOULD
  read first the files that `git log` shows changing most often.

## 2. Audit-only checks

- Before you call code unused, MUST grep the whole tree, including tests, fixtures,
  config, and string or dynamic references.
- When the tree has tests, MUST apply `test` sections Pyramid and Review checks to the
  whole suite: the pyramid shape, duplication across levels.
- When the `owasp` gate is `on`, MUST run the `owasp` command on the whole tree. Then
  MUST read the entry points and data writes against the OWASP Top 10.

## 3. Tech-debt ledger

- MUST grep the `tech-debt:` markers, skipping `.git` and ignored files. MAY add other
  comment prefixes for the stack.

```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:'
```

- MUST skip hits that are not a deferral.
- MUST give one row per marker, grouped by file:
  `<file>:<line>, <what was simplified>. ceiling: <limit>. upgrade: <trigger>.`
- A marker with no upgrade trigger MUST get a `no-trigger` tag.
- MUST end the ledger with `<N> markers, <M> with no trigger.` Nothing found: MUST give
  `No tech debt. Clean ledger.`

## 4. Output

- MUST start with `What this repo does:` in two or three sentences, and the load
  assumed. Then MUST give the `Gates:` block of `review` section Output.
- Then MUST give the findings, the tech-debt ledger, the recorded-items slot and the
  caveat slot (`core` section Reports).
- MUST end with these lines, in this order: `Verdict:` one line (`Verdict: healthy.`, or
  what to fix first); `Lean: -<N> lines, -<M> dependencies possible.` when lean findings
  exist; `Not checked:` the parts not read or not run.
- Nothing found: MUST give `What this repo does:`, `Gates:`, the ledger, one line on
  what was checked and the two slots. The end lines follow, with `Verdict: healthy.`
