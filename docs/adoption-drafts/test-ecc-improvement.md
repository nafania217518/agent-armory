# test ← everything-claude-code (improvement)

Sources: https://github.com/affaan-m/everything-claude-code `skills/module-regression/SKILL.md` @3f14a10 (MIT)
Status: draft, not adopted

## What it brings
A test-scope step for a change to a module that other modules use: list the consumers from a scan, and record each one that no gate test covers.

## Cons
- Not proposed: the source's ledger file of modules, consumers and commands. It is heavy, and the source itself says to create it only after a first "A broke B" incident.
- Dropped: "the verdict is the exit code" and "the auditor reports, does not fix". Armory gates and the reviewer already work that way.
- Dropped: "prefer checks against outside facts (golden sample, totals)". `test` §TDD already makes an expected value come from a source independent of the code.
- Low value while `unit` runs the whole suite each commit: a consumer that has a test already gets run.
- `test` is at its `max-lines` cap (137); each added line needs a raise.

## Proposed changes
### 1. Downstream consumers in the test-scope list
- Target: `test` §Test scope (add bullet after "When a change makes a response parse stricter")
- Text: `` - When a change alters behavior that other modules use, main session SHOULD list those modules from an import or call scan, not from memory, and name the test a gate runs on each. A consumer with no such test MUST be recorded (`core` §Reports) as a gap. ``
- Why: a consumer with no test passes every gate while the change breaks it.
- Evidence needed: a merged change that broke a module with no test of its own, found later by hand or in production.
