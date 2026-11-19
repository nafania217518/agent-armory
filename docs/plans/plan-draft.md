# Plan: plan-draft

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `plan-draft`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-23): MUST, in `docs/DESIGN.md`, replace lines 71-72 with the block.

      - `plan-draft` is a concrete skill of the planner's drafting rules: the task check, the
        `tests:` case walk, the task-level flow walk and the drafting rules, on top of

  - tests: none, bullet text that no check reads; the lint width check covers its lines
  - needs: none
- TR-2 (skill-architecture-redesign/BR-23): MUST add `skills/plan-draft/SKILL.md` as block A, with `max-lines` equal to its line count. Its §1 is `skills/plan/SKILL.md:164-190`, re-led and dedented by two spaces, with `core` §Design principles as `core` §4. Its §2 is lines 301-302, 152-153 and 264-265, reworded for the draft. MUST insert `plan-draft, ` after `requirements, plan, ` in the description span of `.claude-plugin/plugin.json` and in both description spans of `.claude-plugin/marketplace.json`. MUST replace `AGENTS.md` lines 6-10 with block B. MUST add block C as the README `## Skills` row right after the `plan` row, and make the `requirements` row end `| `plan`, `plan-draft`, through their pointers |`. MUST add the four eval cases of block D.

      A:
      ---
      name: plan-draft
      description: >
        The planner's drafting rules: the `TR` items, their `tests:` lines and the test scope
        of a task plan draft, and the task check and walks it runs on the draft before its
        report. Loaded by the planner card; "/plan-draft". Not for a planning request from the
        user.
      metadata:
        type: regular
        extends: [core, craft, output-budget, requirements]
      max-lines: <its line count>
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core` before your first step when its rules are not in your context.
      Load `output-budget` before your first command or file read when its rules are not in your
      context.
      Load `requirements` before you write or check a `TR` when its rules are not in your
      context.
      Load `craft` before you write or check a `TR` when its rules are not in your context.

      # plan-draft

      How the planner drafts the task part of a plan and checks its draft.

      ## 1. Task check

      - Before its report, planner MUST check its draft: each line below holds; else the draft
        is fixed first.
        - Every `BR` of the task, except a gate-type `BR`, has a `TR`. Every `TR` meets
          `requirements` §1 and §2 and has a `tests:` case for each edge case and each failure
          path it names, or a `tests: none` line.
        - The design issues under `core` §4 and `craft` §1 and §2 are fixed.
        - Each claim in any section with "every", "each", "all", "always", "never" or "only",
          and each claim on the form of existing data a `TR` reads, holds on each path and
          file the `TR` touches, queue and retry paths included, by a search; else it is
          narrowed or dropped. Each file, symbol or step a `TR` prescribes exists and has an
          effect in the code it names.
        - Each claim on how a tool, library or platform behaves (a wait, a return value, a
          call used as a check) rests on a probe run during planning or a cited source; else
          it goes to a probe or research before the proposal.
        - Each `TR` that calls an outside part (fs, process, git, network, an engine API)
          names each failure of that call and its outcome. One that waits, locks or retries
          names each loop exit: success, timeout, a step that always fails, a half-written
          state after a crash.
        - Each bound a `TR` sets (count, length, range) is walked, largest value included,
          against the domain rules of its data. Each input it reads is walked for missing,
          empty and malformed values.
        - Each pair of `TR` items that act in one run states their order or shared state in
          the later `TR`.
      - The check MUST also run the flow walk of `requirements` §3 on the draft.
      - The check MUST also walk each new `tests:` case, with its expected value, through its
        `TR` and the existing rules of its component, in the plan and code. A case one of them
        makes impossible MUST be dropped or rewritten. A case whose expected value still holds
        without its `TR`'s code, a swappable test value included, MUST be rewritten.

      ## 2. Drafting

      - A draft MUST take the formats of `requirements` §1 and §2, checked against §1.
      - A draft SHOULD look for complexity to remove before adding; deletion SHOULD beat
        addition. It MAY include that simplification.
      - A `TR` for a defect in built code MUST name its fault class and each call site of that
        class, found by a grep.

      B:
      the rules for every armory actor: `core`, `core-main`, `workflow`, `requirements`, `plan`,
      `plan-draft`, `delegate`, `code`, `implement`, `test`, `output-budget`, `craft`, `debug`,
      `review`, `audit`, `research`, `retro`, `triage`, `dnd` and `setup`. The skills use host
      terms (`core` section Host terms) and run on Claude Code. The plugin also ships the
      templates and the hooks. The design is in `docs/DESIGN.md`.

      C:
      | `plan-draft` | The planner's drafting rules: `TR` items, `tests:` lines and test scope, and the task check on the draft. | `planner` |

      D: each case evals/plan-draft-<kind>-<n>/case.yaml has the form of
      evals/core-main-load-1/case.yaml, with grader name plan-draft-loaded or
      plan-draft-not-loaded and input_match: '"skill"\s*:\s*"(?:[\w-]+:)?plan-draft"':
      plan-draft-load-1: "Which checks must the armory planner run on its draft before it reports?"   min: 1
      plan-draft-load-2: "Check this draft of TR items against the armory task check."                min: 1
      plan-draft-load-3: "As the armory planner, walk each tests: case of my TR draft through its TR." min: 1
      plan-draft-skip-1: "Plan a milestone for the billing export feature."                           min: 0, max: 0

  - tests: lint (red case: with the folder alone, doc-checks reports `<list>: missing plan-draft` for plugin.json skills, marketplace.json skills, marketplace.json plugin skills, README.md Skills and AGENTS.md What this is, plus `plan-draft: fewer than 3 load evals` and `plan-draft: no skip eval`, and none after the edits; skill-graph `--verbose` gives no report on `skills/plan-draft/SKILL.md` and no `plan-draft:` summary line; `--mermaid` holds `s_plan_draft -->|"§1, §2, §3"| s_requirements`; skill-sizes passes)
  - needs: none
- TR-3 (skill-architecture-redesign/BR-23): MUST make these edits in one commit. In `skills/plan/SKILL.md`:
  - lines 22-24 become "Pre-work before any edit, at three levels.";
  - lines 144-145 become "- Items, their `tests:` lines and the test-scope list MUST come as a draft from planner.";
  - delete lines 152-154;
  - replace lines 164-185 with block E;
  - on line 186, "At milestone and task level" becomes "At milestone level";
  - delete lines 187-193;
  - on line 245, delete " (§Drafting)";
  - replace lines 262-266 with block F;
  - delete lines 298-303;
  - set `max-lines` to its line count.

  In `skills/delegate/SKILL.md`, line 64 becomes "  agent, except the planner's own task check on its draft.". In `skills/setup/templates/agents/planner.md` and `.claude/agents/planner.md`, lines 16-17 become block G and lines 24-25 become block H. In `README.md`, the `plan` row's last cell becomes `| main session |`.

      E:
        - task: the planner's report holds a passed task check on the draft, each fix applied;
          else the draft goes back to the planner.

      F:
      - A defect in built code is a bug in code this task already merged, outside the commit
        range under review. It MUST get a new `TR-n` and its test (`implement` §Fixing and
        refactoring). A finding on the range under review MUST go to the fix round of `code`
        §Review loop instead.

      G:
      - MUST load `core` when its rules are not in your context, then `plan-draft`, `test`
        and `implement`.

      H:
      2. When the draft holds `TR` items: each task-check result (`plan-draft` §1), with its
         fix applied.

  - tests: lint (skill-graph `--verbose` summary lines `plan: cycle 1, cite 4, pointer 1, section 28` (at a47146c: section 35), `planner: section 2` (4) and `delegate: cycle 1, pointer 1, section 29` (30); `--mermaid` holds `c_planner -->|"§1"| s_plan_draft` and no `c_planner` line that ends ` s_plan`; red case: with the new template and the copy at a47146c, doc-checks reports `planner: rendered copy differs from template`; a search over `skills .claude` finds only `skills/plan-draft/SKILL.md` for each of "Each pair of `TR` items that act in one run", "walk each new `tests:` case", "a swappable test value included", "look for complexity to remove" and "MUST name its fault class", and nothing for "§Drafting" or "drafter's own task check"; skill-sizes passes), unit
  - needs: TR-2

- 2026-11-19: review fixes (auto-fix): TR-2's block A §2 formats line ends at "`requirements` §1 and §2."; the definition "A defect in built code is a bug in code this task already merged, outside the commit range under review." moves to the end of `requirements` §1, and TR-3's block F and the block A §2 defect line cite it as "A defect in built code (`requirements` §1)"; each Target line in `docs/adoption-drafts/` that names `plan` §Drafting or the `plan` task check names `plan-draft` instead.
