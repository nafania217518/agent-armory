---
name: audit
description: >
  Quality audit of a whole repo or package: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, what to delete or simplify, and the
  tech-debt ledger. Ranked, one-shot report, changes nothing. Use for "audit this
  codebase", "review the whole repo", "find bloat", "what can I delete", "list the tech
  debt", "/audit".
---

# audit

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

This is a report the user asked for: MUST give it in full.

MUST load the `review` skill first (`/review`, or `/armory:review` in the plugin
install). Its sections 3 and 4 apply here, to the whole tree; its section 5 sets the
language and the finding format. When the tree has tests, MUST load the `test` skill
too (`/test`, or `/armory:test`); its section 7 applies to the suite as a whole: pyramid
shape, duplication across levels.

## 1. Map first

- MUST compare the session model with the `Code review, audit` row of `AGENTS.md`
  `## Models`. When it differs: say so in one line and delegate to the `reviewer` agent.
- Scope: what the user names (a folder, a package). Nothing named: the whole repo.
- MUST read the README, the build and deploy config, the dependency list, the entry
  points (main, routes, handlers, jobs, CLI commands) and the tests.
- Find the expected load: one person running a script, or many users and processes.
  Judge scale against that and say which load you assumed.
- Trace the main flows end to end: input from users, money, auth, data writes,
  background jobs, anything shared between processes. Read those paths fully.
- Big repo: go deep where a mistake costs the most, not file by file. Say which parts
  you did not read.

## 2. Look for

The seven classes of the `review` skill, section 3: bug, risk, scale, missing test,
speed, lean, readability. Plus:

- When the `owasp` gate is `on`: run the `owasp` command on the whole tree, then the
  OWASP Top 10 reading (`review` section 2) on the entry points and data writes.
- Before calling code unused, MUST grep the whole tree for it: tests, fixtures, config,
  string and dynamic references.

## 3. Tech debt

Collect every deliberate shortcut, so a deferral cannot become permanent in silence.

```bash
git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?tech-debt:'
```

Add other comment prefixes when the stack uses them. One row per hit, grouped by file:

`<file>:<line>, <what was simplified>. limit: <the limit named>. upgrade: <the trigger>.`

A marker that names no upgrade trigger gets the tag `no-trigger`. Skip hits that are not
a deferral. End the section with `<N> items, <M> with no trigger.` or `No tech debt.`

## 4. Output

1. `What this repo does:` two or three sentences, and the load you assumed.
2. Findings in the three groups of the `review` skill, section 5, numbered across
   groups, each with the four parts. At most 20 findings; say how many smaller ones you
   left out.
3. `Tech debt:` the ledger from section 3.
4. End with `Verdict:` (healthy, or what to fix first); `Lean: -<N> lines, -<M>
   dependencies possible.` when lean findings exist; `Not checked:` the parts you did
   not read or could not run.

Nothing found: `What this repo does:`, then `Healthy. Nothing to fix.`, the tech-debt
ledger, and one line on what you checked.

MUST NOT change any file.
