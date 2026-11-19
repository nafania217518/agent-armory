---
name: audit
description: >
  Quality audit of a whole repo or package: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, what to delete, and the tech-debt ledger.
  One-shot ranked report, changes nothing. Use for "audit this codebase", "review the
  whole repo", "what can I delete", "list the tech debt", "/audit".
metadata:
  type: regular
  extends: [core, review]
  max-lines: 80
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` before your first step when its rules are not in your context.
Load `review` before your first step when its rules are not in your context.

# audit

Reviewer runs an audit on an audit brief; main session sends one when user asks. Audit
MUST apply these `review` rules to a whole repo or package: full-report and read-only
rules (`review` §1, first bullet), order of importance and classes (`review` §3),
`review` §4, and finding groups and format of `review` §5. This skill holds only what
differs from a review.

## 1. Map first

- MUST audit what user names: a folder, package or whole repo. Nothing named: whole repo.
- SHOULD read, riskiest first: README, deploy and build config, dependency list, entry
  points (main, routes, handlers, jobs, CLI commands) and tests. `Not checked:` (§4)
  MUST name each skipped read.
- MUST find expected load.
- MUST trace main flows end to end. MUST read these fully: user input, money, auth, data
  writes, background jobs, anything shared between processes.
- Big repo: SHOULD go deep where a mistake costs most, not file by file. SHOULD read first
  files that `git log` shows changing most often.

## 2. Audit-only checks

- Before calling code unused, MUST grep whole tree, including tests, fixtures, config, and
  string or dynamic references.
- When tree has tests, MUST apply `test` §1 and §7 to whole suite.
- When `owasp` gate is `on`, MUST read entry points and data writes against OWASP Top 10.
- MUST check caveat base: each pointer names an existing topic file, and each entry's
  file exists. Each failure MUST be a finding.
- A drifted entry is one whose file has a commit newer than entry's line (`git blame` on
  the line, `git log -1` on the file).
- Up to 10 drifted entries: reviewer that runs audit MUST check each claim itself. 11 or
  more: it MUST report each drifted entry by `file:line`. Main session MUST then check
  their claims, one spawn per topic file, plus one for root list.
- Each claim check MUST give one verdict per entry: holds, false, path moved, or
  `Unverified: <what settles it>`. Each verdict other than holds MUST be an audit finding.
  For a spawn, main session MUST add it to audit findings.

## 3. Tech-debt ledger

- MUST grep `tech-debt:` markers, skipping `.git` and ignored files. MAY add other comment
  prefixes for the stack.

```
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:' -- <target>
```

- MUST skip hits that are not a deferral.
- MUST give one row per marker, grouped by file:
  `<file>:<line>, <what was simplified>. ceiling: <limit>. upgrade: <trigger>.`
- Marker with no upgrade trigger MUST get a `no-trigger` tag.
- MUST end ledger with `<N> markers, <M> with no trigger.` Nothing found: MUST give
  `No tech debt. Clean ledger.`

## 4. Output

- MUST start with `What this repo does:` in two or three sentences, and expected load, or
  `none stated`. Then MUST give `Gates:` block of `review` §5, each `on` gate run on
  whole tree. A gate failure in target MUST be a Must fix finding.
- Then MUST give findings, tech-debt ledger and two slots (`core` §6).
- MUST end with `Verdict:` in one line (`Verdict: healthy.`, or what to fix first), then
  `Not checked:` in one line when a part was not read or not run.
- Nothing found: MUST give `What this repo does:`, `Gates:`, ledger, one line on what was
  checked and two slots. End lines follow, with `Verdict: healthy.`
