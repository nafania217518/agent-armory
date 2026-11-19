# Plan: craft

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `craft`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-20): MUST amend `docs/DESIGN.md`: replace the skill-set bullet with the first block; replace the `implement` and `test` home rows with the second and third blocks; insert the fourth block right after the `output-budget` row; append ``, `craft`` before the closing ` |` of the actor rows coder, debugger, reviewer, "reviewer, audit brief" and planner.

      - The skill set has nineteen skills: `core`, `core-main`, `workflow`, `plan-draft`,
        `output-budget`, `craft`, `plan`, `delegate`, `code`, `implement`, `test`, `debug`,
        `review`, `audit`, `research`, `retro`, `triage`, `dnd` and `setup`. The skills other
        than `core` and `core-main` hold the workflows.

      | `implement` | 9, 10, 12, 14 (per-commit gates), 17 (commit message) | coder, debugger |

      | `test` | 13, except the parts in `craft` | coder, debugger, reviewer, planner |

      | `craft` | 5 (before you write), 11, parts of 13 (TDD, test scope, the benchmark row check); the data-growth path definition: none (new) | coder, debugger, reviewer, planner, through the pointers of `implement` and `test` |

  - tests: lint (the end marker `. The skills other` stays on one line, so the doc-checks DESIGN.md list check reads the span; no gate reads the §4 rows)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-20): MUST add `skills/craft/SKILL.md` as the first block, where each `<path:lines>` line stands for those lines, verbatim, except that in the `skills/test/SKILL.md:87-96` part lines 93-94 become the second block, and in the `skills/implement/SKILL.md:126-132` part line 129 becomes the third block; `max-lines` MUST equal the file's line count. MUST insert `craft, ` after `output-budget, ` in the description span of `.claude-plugin/plugin.json` and in both description spans of `.claude-plugin/marketplace.json`; MUST insert `` `craft`, `` after `` `output-budget`, `` in the `AGENTS.md` span (`armory actor: ` .. `. The skills use`), rewrapped at 90 columns with `. The skills use` on one line; MUST add the fourth block as the `README.md` `## Skills` row right after the `output-budget` row.

      ---
      name: craft
      description: >
        Abstract: load only through a skill that extends it. The shared coding and test rules:
        scope before you write, domain types and boundaries, TDD, the test-scope list and
        data-growth paths.
      metadata:
        type: abstract
        extends: [core]
      user-invocable: false
      max-lines: <its line count>
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core` before your first step when its rules are not in your context.

      # craft

      ## 1. Before you write

      <skills/implement/SKILL.md:26-38>

      ## 2. Domain, boundaries and state

      <skills/implement/SKILL.md:86-101>

      ## 3. TDD

      <skills/test/SKILL.md:61-83>

      ## 4. Test scope

      <skills/test/SKILL.md:87-96>

      ## 5. Tests while coding

      <skills/implement/SKILL.md:126-132>

      ## 6. Data-growth paths

      <skills/plan/SKILL.md:197-198>
      <skills/test/SKILL.md:133-134>

      - A scope addition MUST be a failing test proven missed from the list (§5). It MUST be
        recorded (`core` §Reports), with its reason.

        MUST fix code so test passes. Test that already fails on `<base>`: `implement` §4.

      | `craft` | Abstract: the coding and test rules that `implement` and `test` share: scope, domain types, TDD, test scope, data-growth paths. | `implement`, `test`, through their pointers |

  - tests: lint (red case: with the folder alone, doc-checks reports `<list>: missing craft` for plugin.json skills, marketplace.json skills, marketplace.json plugin skills, README.md Skills and AGENTS.md What this is, and none after the list edits; skill-sizes passes; `node scripts/skill-graph.mjs --verbose` gives no `type`, `extends` or `pointer` report for `craft` and no `section` report with "has no heading", and its `cite` reports for `craft` name only `code`, `delegate`, `implement`, `plan` and `review`)
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-20): MUST delete the moved text from its sources and wire `implement` and `test` to `craft`, in one commit. In `skills/implement/SKILL.md`: delete lines 24-39, 84-102 and 124-133; renumber the kept `##` headings 1-5 in order; set `extends: [code, core, craft, debug, delegate, output-budget, review, test]`; put the first block right after the `output-budget` pointer; replace both "(§Before you write)" with "(`craft` §1)" and "(`test` §Test scope)" with "(`craft` §4)"; set `max-lines` to its line count. In `skills/test/SKILL.md`: delete lines 57-97 and 133-134; renumber the kept `##` headings 1-7 in order; set `extends: [core, craft, delegate, implement, output-budget, plan, review]`; put the second block, then the first block, right after the `core` pointer; make the §Review checks bullet read as the third block; set `max-lines` to its line count. In `skills/plan/SKILL.md`: delete lines 197-198 and set `max-lines` to its line count. The renumber makes the `` `implement` §4 `` cite in `craft` §5 (TR-2) name Gates per commit.

      Load `craft` before your first step when its rules are not in your context.

      Load `output-budget` before you run the first test when its rules are not in your context.

      - Each breach of a MUST or MUST NOT in this skill or in `craft` §3–§6 MUST be reported as
        a finding, in the group `review` §Output sets. Two more cases MUST be findings: in a
        `sociable` project, a double for a collaborator that is not remote, slow,
        non-deterministic or side-effecting; a separate service with no `contract` test while
        that gate is `on`.

  - tests: lint (red case: with `craft` in `implement`'s `extends` and no pointer line, `implement`'s `pointer` report lists `craft` as missing, and after the edit no `pointer` report lists `craft`; `git grep -n -F` over `skills .claude` finds only `skills/craft/SKILL.md` for each of "Scope MUST also hold each caveat-base line", "Domain structure and types MUST make", "MUST write the failing test for every requirement", "MUST write the test-scope list into plan", "MUST change only test cases on the test-scope list", "A data-growth path is a read or write path" and "A benchmark MUST assert each measured query"; no `section` report says "has no heading in" `implement`, `test` or `craft`; skill-sizes passes)
  - needs: TR-2
- TR-4 (skill-architecture-redesign/BR-20): MUST re-point each remaining cite of moved text to `craft`. In `skills/plan/SKILL.md`: "`test` §TDD" becomes "`craft` §3"; "(`test` §Test scope)" becomes "(`craft` §4)"; the `load:` bullet becomes the first block; the design-issues sub-bullet becomes the second block. In `skills/review/SKILL.md`: "(`plan` §The plan)" in the data-growth bullet becomes "(`craft` §6)"; "`test` §Test scope sets" becomes "`craft` §4 sets"; each of the four "`implement` §Domain, boundaries and state" becomes "`craft` §2". In `skills/delegate/SKILL.md`: "(`implement` §Before you write)" becomes "(`craft` §1)". A changed line over 90 columns MUST be rewrapped; each changed skill's `max-lines` MUST equal its line count.

      - Each `TR` that adds or changes a data-growth path (`craft` §6) MUST carry its `load:`
        line: its load `TR` id, or `load: none, <why>`. A load `TR` MUST state data size,
        operations measured, each measured query as text or as the rule that draws it from seed
        data, and a latency target, such as p95. Figures MUST come from the expected load
        (`review` §Understand first, the no-plan case). Its benchmark MUST meet the row check of
        `craft` §6.

          - The design issues under `core` §Design principles and `craft` §1 and §2 are fixed.

  - tests: lint (red case at the TR-3 tip: skill-graph gives `section` reports "matches no heading in implement" from `delegate`, `plan` and `review`, and "matches no heading in test" from `plan` and `review`, and none after the edit; `git grep -n -E '§(Before you write|Domain,|TDD|Test scope|Tests while coding|Determinism)' -- skills .claude/agents` finds none; `git grep -n -F 'data-growth path (`craft` §6)' -- skills` finds `plan` and `review`; the `cite` reports outside `craft` match those at 42d8f5b)
  - needs: TR-3
- TR-5 (skill-architecture-redesign/BR-15, skill-architecture-redesign/BR-20): MUST add the line below as the first bullet of `implement` §The smallest complete change and of `craft` §2 Domain, boundaries and state, and set each `max-lines` to its line count.

      - This section is a design rule, so an approved plan MAY override it (`core` §1).

  - tests: lint (`git grep -c -F 'This section is a design rule' -- skills` gives 1 for `skills/implement/SKILL.md`, 1 for `skills/craft/SKILL.md` and no other file)
  - needs: TR-3

