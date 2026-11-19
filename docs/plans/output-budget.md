# Plan: output-budget

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `output-budget`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-10): MUST amend `docs/DESIGN.md`. Replace the skill-set bullet with the first block below. Add the home-table row of the second block right after the `test` row. Append ``, `output-budget`` before the closing ` |` of the actor rows main session full task, main session dnd, coder, debugger, reviewer, reviewer audit brief and planner.

      - The skill set has eighteen skills: `core`, `core-main`, `workflow`, `plan-draft`,
        `output-budget`, `plan`, `delegate`, `code`, `implement`, `test`, `debug`, `review`,
        `audit`, `research`, `retro`, `triage`, `dnd` and `setup`. The skills other than
        `core` and `core-main` hold the workflows.

      | `output-budget` | none (new) | coder, debugger, reviewer, planner and main session, through the pointers of `implement`, `test` and `code` |

  - tests: lint (the doc-checks DESIGN.md skill-list check runs on this name once TR-2 adds the folder; no gate reads the §4 rows)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-10): MUST add `skills/output-budget/SKILL.md` with the first block below. MUST insert `output-budget, ` after `test, ` in the description span of `.claude-plugin/plugin.json` and in both description spans of `.claude-plugin/marketplace.json`. MUST insert `` `output-budget`, `` after `` `test`, `` in the `AGENTS.md` span (`armory actor: ` .. `. The skills use`). MUST add the `README.md` `## Skills` row of the second block right after the `test` row.

      ---
      name: output-budget
      description: >
        Abstract: load only through a skill that extends it. The output-size rule for gate,
        build and test output and for long file reads.
      metadata:
        type: abstract
        extends: [core]
      user-invocable: false
      max-lines: 22
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core` before your first step when its rules are not in your context.

      # output-budget

      ## 1. Output size

      - Gate, build and test output MUST reach your context only as its tail or a grep for
        FAIL or error, and a long file only by line range or a search. On a failing gate, MUST
        read only the failing part of its log.

      | `output-budget` | Abstract: the output-size rule for gate, build and test output and long file reads. | `implement`, `test`, `code`, through their pointers |

  - tests: lint (with the folder alone, doc-checks reports `missing output-budget` for plugin.json skills, marketplace.json skills, marketplace.json plugin skills, README.md Skills and AGENTS.md What this is; after the list edits it reports none; skill-graph gives no `type` report for `output-budget`)
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-10): MUST delete the bullet "Gate, build and test output MUST reach your context …" (3 lines) from `implement` §Gates per commit, and MUST make these edits to the three parent skills, with the three pointer lines below in that order, each wrapped at 90 columns where it is longer:
  - `implement`: extends `[code, core, debug, delegate, output-budget, review, test]`, `max-lines` equal to its line count; the pointer line right after the ``Load `core` `` line.
  - `test`: extends `[core, delegate, implement, output-budget, plan, review]`, `max-lines` equal to its line count; the pointer line and one blank line under `## 4. TDD`, before its first bullet.
  - `code`: extends `[core, delegate, implement, output-budget, plan, research, review, setup, test]`, `max-lines` equal to its line count; the pointer line right after the §Running the plan intro line that ends "`plan` §Amendments.", in the same paragraph.

      Load `output-budget` before your first command or file read when its rules are not in your context.
      Load `output-budget` before you run the first test when its rules are not in your context.
      Load `output-budget` before the first gate run when its rules are not in your context.

  - tests: lint (`node scripts/skill-graph.mjs --verbose` holds no `pointer`, `cite` or `extends` report that names `output-budget`; red case: an extends entry with no pointer line reports `pointer: missing output-budget`; `git grep -n 'tail or a grep for' -- skills .claude` finds only `skills/output-budget/SKILL.md`)
  - needs: TR-2
- TR-4 (skill-architecture-redesign/BR-10): MUST replace "as `implement` §Gates per commit says." with "as `output-budget` §1 says." in the "keep command output" bullet of `coder.md`, `debugger.md`, `reviewer.md` and `planner.md`, in `skills/setup/templates/agents/` and in `.claude/agents/`, in one commit, so the bullet reads as below.

      - MUST keep command output and file reads small, as `output-budget` §1 says.

  - tests: lint (a template changed without its copy gives `<card>: rendered copy differs from template`; skill-graph gives no `section` or `card-load` report on the new cites)
  - needs: TR-2

- 2026-11-19: TR-3 pointer lines gain "when its rules are not in your context", and its `max-lines` values follow the line counts (review finding 1, auto-fix).

