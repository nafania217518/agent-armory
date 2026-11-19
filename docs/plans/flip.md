# Plan: flip

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `flip`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-31): MUST, in `scripts/skill-graph.mjs`, make every run that gives one or more reports exit 1, in every mode. `main` `:1050` becomes the first line below and `summary` `:420` the second.

      if (graph.errors.length > 0 || graph.reports.length > 0) process.exitCode = 1;
      const total = `skill-graph: ${reports.length} reports${reports.length > 0 ? ' (exit 1)' : ''}`;

  - tests: unit, new group `report exit` in `scripts/skill-graph.test.mjs` before `describe('repo graph'` (`:752`): `mermaid_run_with_report_exits_1_and_draws` (`writeSkill('a', { ext: ['a'] })`, `run(['--mermaid'])`: status 1, stdout starts with `flowchart`; at 6e62d76 status 0); `build_run_with_report_writes_payloads_and_exits_1` (`writePayloadSources()`, `writeSkill('a', { ext: ['a'] })`, `run(['--build'])`: status 1, `hooks/main-payload.md` exists; at 6e62d76 status 0)
  - tests: unit, existing case `only_the_10000_warning_at_10001` (`:556-562`) keeps status 0, so a warning alone does not fail
  - tests: lint (summary at the tip reads `skill-graph: 0 reports` and exits 0)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-31): MUST, in `docs/DESIGN.md`, replace lines 95-100 with this block.

      - The graph check reports a skill whose pointers and `metadata.extends` differ, a cycle,
        a cite of a skill that is not an ancestor, a card that loads an abstract skill, and a
        rule reference by name or with no such heading. It reads the rule references of the
        skill templates too, with no other check. A `§` after a file path names a doc section
        and is not checked. A run with any report exits 1, so `lint` fails.

  - tests: lint (doc-checks width passes; `git grep -n 'During the migration' -- docs/DESIGN.md` finds nothing, at 6e62d76 `:99`), unit
  - needs: none
