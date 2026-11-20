# review ← ecc (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `skills/click-path-audit/SKILL.md` @3f14a10 (MIT); https://github.com/affaan-m/everything-claude-code `agents/silent-failure-hunter.md` @3f14a10 (MIT); https://github.com/affaan-m/everything-claude-code `agents/comment-analyzer.md` @3f14a10 (MIT)
Status: draft, not adopted

## What it brings

A Bug case for one action that silently undoes another through shared state. Concrete
silent-failure cases in place of the vague "errors swallowed". A finding for a comment the
change made false.

## Cons

- The state-path case is mostly front-end (stores, effects); the source's full per-button
  audit of a whole app is costly, so only the case goes in, not the procedure.
- Large overlap with class Risk and the `core` comment rule; each change only adds cases.
- Dropped: "after a store change, audit every caller". `review` §Understand first already
  greps every caller when behavior changes.
- Dropped: the source's async-race and stale-closure patterns. Class Bug already holds the
  stale async answer (`implement` §Domain, boundaries and state).
- Size: `review` is at its `max-lines` (161 of 161); adopting adds about 4 lines, so
  `max-lines` must rise or other lines go.

## Proposed changes

### 1. One call undoes another

- Target: `review` §Look for, class 1 Bug (add case at end of item 1)
- Text: `, a call whose side effect on shared state resets what an earlier call in the same
  action set, so the final state is not what the action promises`
- Why: armory covers stale async answers only; a sequential reset passes every unit test of
  each call alone.
- Evidence needed: an armory review that passed a handler whose second call cleared the
  first call's state, or an eval case that seeds one. The source cites one such bug missed by
  a 54-bug debug pass (author's own report, not measured here).

### 2. Silent failures, named

- Target: `review` §Look for, class 2 Risk (replace "data loss (errors swallowed, writes in
  wrong order, no transaction)")
- Text: `data loss and hidden failure (a catch-all that returns empty or null with no
  context, a default value that hides a failed call, a rethrow that drops the cause, a
  network, file or database call with no timeout, writes in wrong order, no transaction)`
- Why: "errors swallowed" names the class but not the forms that pass a quick read.
- Evidence needed: an armory review that passed one of these forms, or an eval case per form.

### 3. Comments the change made false

- Target: `review` §Look for, class 8 Readability (append sentence)
- Text: `Also a comment that contradicts the code or names behavior the change removed.`
- Why: `review` §Output grades a wrong fact in prose, but §Look for never sends the reviewer
  to check comments next to changed code.
- Evidence needed: an armory review that left a stale comment beside a changed line.
