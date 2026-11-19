# Plan: requirements

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `requirements`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-22): MUST amend `docs/DESIGN.md`: replace the skill-set bullet with the first block, its end marker `. The skills other` on one line; replace the `workflow` bullet with the second block and the `plan-draft` bullet with the third; replace the consecutive `plan`, `workflow` and `plan-draft` home rows with the fourth block; insert `` `requirements`, `` right before `` `plan`, `` in the actor rows "main session, full task" and "main session, dnd", and right after `` `plan-draft`, `` in the planner row; in §5, replace "`workflow` holds one template per doc" with "`requirements` holds one template per doc".

      - The skill set has twenty skills: `core`, `core-main`, `workflow`, `requirements`,
        `plan-draft`, `output-budget`, `craft`, `plan`, `delegate`, `code`, `implement`,
        `test`, `debug`, `review`, `audit`, `research`, `retro`, `triage`, `dnd` and
        `setup`. The skills other than `core` and `core-main` hold the workflows.

      - `workflow` is the abstract skill of the run mechanics that the main-session skills
        share: the docs and status homes, the tracker writes (the five main-only tracker
        sub-bullets of `core`, the claim rules and the done write included), the `triage` roles
        and label lines, branches and finish, the caveat-base writes, amendments and the
        business quiz topics. The last task of `skill-architecture-redesign` splits it in two
        and amends this file with the two names. The plan templates, the `BR` and `TR`
        formats, the plan-doc section rules, the milestone check and the flow walk live in the
        abstract skill `requirements` instead, which `plan` and `plan-draft` extend: a skill
        that a card loads cannot have `workflow`, a child of `core-main`, as an ancestor.

      - `plan-draft` is a concrete skill of the planner's drafting rules: the task check, the
        `tests:` case walk and the drafting rule, now in `plan` §6 and §9, on top of
        `requirements`. The `planner` card loads it, not `plan`. The parts it shares with
        `plan`, `implement` and `test` move to abstract skills; the definitions only the
        planner reads stay in it as plain text.

      | `plan` | 5 (push back); 6: the levels, the quiz rounds, the strategic check, the approval | main session |
      | `workflow` | parts of 6 (amendments, business quiz topics), 7 (caveat writes) and 17 (branch, plan-file commit, finish); the main-session tracker rules, the claim, the done write and the `triage` roles: none (new) | main session, through the pointer of a child skill |
      | `requirements` + templates `strategic.md`, `milestone.md`, `task.md` | parts of 6 (`BR` and `TR` formats, plan-doc section rules, milestone check, flow walk, plan templates) | main session and planner, through the pointers of `plan` and `plan-draft` |
      | `plan-draft` | 6 (drafting part: task check) | `planner` |

  - tests: lint (red case: at the TR-2 tip with this edit undone, doc-checks reports `DESIGN.md skills: missing requirements`; no gate reads the §4 rows or the `workflow` and `plan-draft` bullets)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-22): MUST add `skills/requirements/SKILL.md` as the first block, where each `<path:lines>` line stands for those lines, verbatim, except that line 165 becomes the second block, lines 167-173 become the third block, and lines 197-202 become the fourth block; `max-lines` MUST equal the file's line count. MUST `git mv skills/plan/templates skills/requirements/templates`, and in `templates/task.md` replace "armory `plan`'s `templates/milestone.md`" with "armory `requirements` `templates/milestone.md`". MUST insert `requirements, ` after `workflow, ` in the description span of `.claude-plugin/plugin.json` and in both description spans of `.claude-plugin/marketplace.json`; MUST insert `` `requirements`, `` after `` `workflow`, `` in the `AGENTS.md` span (`armory actor: ` .. `. The skills use`), rewrapped at 90 columns with `. The skills use` on one line; MUST add the fifth block as the `README.md` `## Skills` row right after the `workflow` row.

      ---
      name: requirements
      description: >
        Abstract: load only through a skill that extends it. The `BR` and `TR` formats, the
        plan-doc section rules, the milestone check, the flow walk and the plan templates.
      metadata:
        type: abstract
        extends: [core, craft]
      user-invocable: false
      max-lines: <its line count>
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core` before your first step when its rules are not in your context.
      Load `craft` before you write or check a `TR` when its rules are not in your context.

      # requirements

      ## 1. Requirement items

      <skills/plan/SKILL.md:135-141>
      <skills/plan/SKILL.md:146-151>

      ## 2. Plan docs

      <skills/plan/SKILL.md:155-194>
      <skills/plan/SKILL.md:197-210>
      <skills/plan/SKILL.md:215-216>

      ## 3. Checks

      - Milestone check: each `BR` MUST be testable and sit in exactly one task's `BR` list. A
        gate-type `BR`, one that applies to every task, such as one for `lint`, MUST sit in
        every open task's list.
      - Flow walk: at milestone and task level, review MUST walk each new or changed flow path
        by path, from the command the user runs (gate, CLI, page) to where each output lands,
        against the branch, worktree and gate rules. It MUST also check that each need is real
        and each interface two items build has its contract item (§2).

        stay when empty; a milestone item body also keeps its opening one-line goal.

      - Requirements MUST hold only `TR` items and dated amendment notes, beside the `BR` list:
        no order line, summary, API table or key that restates them, and no `TR` that only says
        the `on` gates pass; a gate-type `BR` needs no `TR`; each `tests:` line names the gate
        instead. A `TR` MUST state only its behavior and its indented lines, and MAY hold the
        exact text it prescribes as an indented block under it; its reason MUST go to Design.
        An item of another section MUST NOT go into a `BR` or `TR`; it MUST stay in its own
        section.

      - Each `TR` that adds or changes a data-growth path (`craft` §6) MUST carry its `load:`
        line: its load `TR` id, or `load: none, <why>`. A load `TR` MUST state data size,
        operations measured, each measured query as text or as the rule that draws it from seed
        data, and a latency target, such as p95. Figures MUST come from the expected load that
        the repo states. Its benchmark MUST meet the row check of `craft` §6.

      | `requirements` | Abstract: the `BR` and `TR` formats, the plan-doc section rules, the milestone check, the flow walk and the plan templates. | `plan`, through its pointer |

  - tests: lint (red case for the lists: with the folder alone, doc-checks reports `<list>: missing requirements` for plugin.json skills, marketplace.json skills, marketplace.json plugin skills, README.md Skills and AGENTS.md What this is, and none after the list edits; red case for the refs: with lines 165, 167-168 and 258 verbatim, skill-graph gives `§Amendments`, `§Requirements` and `§The plan` "matches no heading in requirements" plus `§Plan` "resolves to §2", and after the edits the only reports for `requirements` are the `section` name references `§Rule words` and `§Design principles`; skill-sizes passes; `git ls-files skills/plan/templates` prints nothing)
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-22): MUST delete the moved text from `plan` and wire `plan` and `triage` to `requirements`, in one commit. In `skills/plan/SKILL.md`: set `extends: [code, core, delegate, implement, requirements, research, review, test, triage]`; put the first block right after the `core` pointer; replace lines 28-29 with the second block; on line 72 replace "(§The plan)" with "(`requirements` §2)"; delete lines 135-141, 146-151, 155-194, 197-210 and 215-216; replace lines 230-232 with the third block, lines 234-236 with the fourth and lines 255-258 with the fifth; on line 326 replace "(§Self-review and approval)" with "(`requirements` §3)"; on line 373 replace "§Requirements and §The plan" with "`requirements` §1 and §2"; set `max-lines` to its line count. In `skills/triage/SKILL.md`, replace lines 76-80 with the sixth block.

      Load `requirements` before you write or check a `BR`, a `TR` or a plan doc when its rules
      are not in your context.

      - Each level MUST use the doc, template and branch of this table. Template paths in this
        skill are relative to the `requirements` skill.

        - milestone: the milestone check of `requirements` §3.

          - Every `BR` of the task, except a gate-type `BR`, has a `TR`. Every `TR` meets
            `requirements` §1 and §2 and has a `tests:` case for each edge case and each failure
            path it names, or a `tests: none` line.

      - At milestone and task level, review MUST also run the flow walk of `requirements` §3.

      - `accepted`: state and category labels, and a `## Requirements` section below the item's
        text, with `BR` lines in the format of `requirements` `templates/milestone.md`
        §Requirements, without its `Format:` line. The `BR` lines MUST hold only what no open
        item with `BR` lines already fixes; the section MUST link each such item and name each
        conflict user settled. A later `plan` milestone or task run starts from the item.

  - tests: lint (red case for the pointer: with `requirements` in `extends` and no pointer line, plan's `pointer` report reads "missing code, delegate, implement, requirements, research, review, test, triage", and after the edit it reads as at 704ea03; red case for the cites: with the cite edits and no `requirements` in plan's `extends`, `cite` reports name `requirements` for `plan` and `triage`, and after the edit none does; `git grep -l -F` over `skills .claude` finds only `skills/requirements/SKILL.md` for each of "An answer MUST become a `BR` or `TR` only when testable", "Plan file MUST hold only the sections of `templates/task.md`", "Requirements MUST hold only `TR` items", "Each `TR` and each milestone task MUST name its needs", "A `TR` that sets a bar on a measured value" and "each measured query as text or as the rule", and nothing for "is testable and sits in exactly one task" or "review MUST also walk each new or changed flow path"; `git grep -c -F '`requirements` §' -- skills/plan/SKILL.md` gives 6; `git grep -F '`plan` `templates/' -- skills` finds nothing; skill-sizes passes)
  - needs: TR-2

- 2026-11-19: review fix (auto-fix): TR-2's `requirements` §3 flow-walk bullet drops "at milestone and task level,", so `plan` §6 alone sets when the walk runs.
