# Plan: output-budget-into-core

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `output-budget-into-core`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-43): MUST insert the block below after line 47 of `skills/core/SKILL.md` (the `mktemp -d` bullet, last of §3), run `node scripts/skill-graph.mjs --build`, and commit `skills/core/SKILL.md`, `hooks/main-payload.md` and `hooks/agent-payload.json` in one commit. A `--build` that exits non-zero MUST stop the commit.

      - Gate, build and test output MUST reach your context only as its tail or a grep for FAIL
        or error, and a long file only by line range or a search. On a failing gate, MUST read
        only the failing part of its log.

  - tests: lint (skill-graph `payload 0` and no size warning; main payload 8,798 and agent payload 6,167 characters, at a606001 8,583 and 5,952; red case: the `core` edit without `--build` gives two `payload` reports), unit; `git grep -n 'tail or a grep for' -- skills hooks` finds `skills/core/SKILL.md` and both payload files (at a606001 only `skills/output-budget/SKILL.md`)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-43, skill-architecture-redesign/BR-42): MUST, in one commit after TR-1's commit: in `skills/code/SKILL.md` make line 9 read `  extends: [core-main, delegate, research, workflow]`, delete line 35, set line 10 to `max-lines: 125`; in `skills/implement/SKILL.md` make line 10 read `  extends: [core, craft]`, delete lines 16-17, set line 11 to `max-lines: 111`; in `skills/test/SKILL.md` make line 9 read `  extends: [core, craft]`, delete line 15, set line 10 to `max-lines: 99`; in `skills/plan-draft/SKILL.md` make line 10 read `  extends: [core, craft, requirements]`, delete lines 16-17, set line 11 to `max-lines: 61`; delete the line "- MUST keep command output and file reads small, as `output-budget` §1 says." from `coder.md` (line 22), `debugger.md` (line 24), `reviewer.md` (line 19) and `planner.md` (line 18), in `skills/setup/templates/agents/` and in `.claude/agents/`; delete `skills/output-budget/`.
  - tests: lint (skill-graph 0 reports, skill-sizes passes; red cases: an `implement` that keeps its `output-budget` extends entry and pointer gives `extends` and `pointer` reports, a card that keeps the line gives `section: §1 has no heading in coder`), unit; `git grep -n output-budget -- skills .claude` finds nothing (18 hits at a606001)
  - needs: none
- TR-3 (skill-architecture-redesign/BR-43): MUST replace "test, output-budget, craft" with "test, craft" in `.claude-plugin/plugin.json` line 4 and `.claude-plugin/marketplace.json` lines 4 and 11; delete `README.md` line 22; delete "`output-budget`, " at the start of `AGENTS.md` line 8.
  - tests: lint (doc-checks list checks pass), unit; `git grep -n output-budget -- .claude-plugin README.md AGENTS.md` finds nothing (5 hits at a606001)
  - needs: TR-2
- TR-4 (skill-architecture-redesign/BR-43): MUST amend `docs/DESIGN.md`: on line 40 replace "twenty-one" with "twenty"; on line 41 delete "`output-budget`, "; on line 152 replace "the one-line Fable MUST of 23 |" with "the one-line Fable MUST of 23; the output-size rule: none (new) |"; delete line 163; on lines 177, 179, 180, 181, 182, 183 and 185 delete ", `output-budget`"; insert the block below after line 459.

      - 2026-11-19: the output-size rule moves from the abstract skill `output-budget` into
        `core` §3, and `output-budget` goes. A rule that every actor needs lives in `core`,
        not in an abstract skill. Reason: every actor runs commands and reads files, so both
        payloads carry the rule in about 215 characters, in place of a skill, four pointers
        and four card lines.

  - tests: lint (doc-checks `DESIGN.md skills` list and width pass), unit; `git grep -n output-budget -- docs/DESIGN.md` finds only the new dated line (9 hits at a606001); `git grep -c 'output-size rule: none (new)' docs/DESIGN.md` and `git grep -c '2026-11-19: the output-size' docs/DESIGN.md` each give 1 (0 at a606001)
  - needs: TR-2

- 2026-11-19: TR-4 tests: `git grep -n output-budget -- docs/DESIGN.md` finds only lines of the new dated entry, which names `output-budget` on three lines.

- 2026-11-19: review fix (user's yes): TR-4's dated entry block ends "and four card lines. Dropped: keep `output-budget` as an abstract skill (the 2026-11-18 rule), and a new `core` section for the rule."
