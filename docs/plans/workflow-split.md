# Plan: workflow-split

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `workflow-split`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-32): MUST amend `docs/DESIGN.md`: replace lines 40-43 with block A; replace lines 63-72 with block B; on line 109 replace "(`workflow` §1)" with "(`tracking` §1)"; replace line 154 with block C; on line 155 replace "pointers of `workflow`, `plan`" with "pointers of `tracking`, `plan`"; on line 175 replace "`workflow`, `requirements`" with "`workflow`, `tracking`, `requirements`"; on line 176 replace "`workflow`, `triage`" with "`tracking`, `requirements`, `triage`"; on line 177 replace "`workflow`, `dnd`" with "`workflow`, `tracking`, `dnd`"; replace lines 200-201 with block D; in lines 461-462 replace "in `workflow`" with "in `tracking`" and "§5." with "§2.".

  Block A:

      - The skill set has twenty-one skills: `core`, `core-main`, `workflow`, `tracking`,
        `requirements`, `plan-draft`, `output-budget`, `craft`, `plan`, `delegate`, `code`,
        `implement`, `test`, `debug`, `review`, `audit`, `research`, `retro`, `triage`, `dnd`
        and `setup`. The skills other than `core` and `core-main` hold the workflows.

  Block B:

      - `workflow` and `tracking` are the abstract skills of the run mechanics that the
        main-session skills share. `tracking` holds the tracker verbs and write rules (the
        five main-only tracker sub-bullets of `core` included), the docs fallback, the docs
        and status homes, the `triage` roles and label lines, amendments and the business quiz
        topics. `workflow` extends `tracking` and holds the claim, branches, caveat-base
        writes, finish and the done write. `triage` extends `tracking`, not `workflow`, so a
        triage run loads no branch, caveat or finish rule. The plan templates, the `BR` and
        `TR` formats, the plan-doc section rules, the milestone check and the flow walk live
        in the abstract skill `requirements` instead, which `tracking`, `plan` and
        `plan-draft` extend: a skill that a card loads cannot have `tracking`, a child of
        `core-main`, as an ancestor.

  Block C:

      | `workflow` + template `pr.md` | parts of 7 (caveat writes) and 17 (branch, push and merge guard, finish); the claim and the done write: none (new) | main session, through the pointer of a child skill |
      | `tracking` | parts of 6 (docs and status homes, amendments, business quiz topics); the main-session tracker rules and the `triage` roles, label lines and notes form: none (new) | main session, through the pointer of `workflow` or `triage` |

  Block D:

      The rules: `plan` section Levels; the doc and status homes: `tracking`; the claim and
      the done write: `workflow`.

  - tests: lint (doc-checks width and `DESIGN.md skills` list pass; `git grep -c -F '| `tracking` |' docs/DESIGN.md` gives 1 and `git grep -n -F '`workflow` §' docs/DESIGN.md` finds nothing, at 839c5d3 0 and 1 hit), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-32): MUST add `skills/tracking/SKILL.md` as block E, where each `<a-b>` line stands for lines a-b of `skills/workflow/SKILL.md` at 839c5d3, verbatim, except that line 214 "owns the fact (§5)." becomes "owns the fact (§2).". MUST also name `tracking` in the lists: in `.claude-plugin/plugin.json:4` and `.claude-plugin/marketplace.json:4` and `:11` replace "core, core-main, workflow, requirements" with "core, core-main, workflow, tracking, requirements"; in `README.md` insert block F after line 13; in `AGENTS.md` replace lines 5-10 with block G.

  Block E:

      ---
      name: tracking
      description: >
        Abstract: load only through a skill that extends it. The tracker verbs, the docs
        fallback, the tracker write rules, the docs and status homes, the triage roles,
        amendments and the business quiz topics that the main-session skills share.
      metadata:
        type: abstract
        extends: [core-main, requirements]
      user-invocable: false
      max-lines: 147
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core-main` before your first step when its rules are not in your context.
      Load `requirements` before an amendment when its rules are not in your context.

      # tracking

      ## 1. Tracker

      <23-42>

      ## 2. Docs and status

      <121-148>

      ## 3. Triage roles

      <193-201>

      ## 4. Amendments

      <205-259>

      ## 5. Business quiz

      <263-264>

  Block F:

      | `tracking` | Abstract: the tracker verbs and write rules, the docs fallback, the docs and status homes, the triage roles and label lines, amendments and the business quiz topics. | `workflow` and `triage`, through their pointers |

  Block G:

      Personal agent skills, packaged as the `armory` plugin. The skills under `skills/` hold
      the rules for every armory actor: `core`, `core-main`, `workflow`, `tracking`,
      `requirements`, `plan`, `plan-draft`, `delegate`, `code`, `implement`, `test`,
      `output-budget`, `craft`, `debug`, `review`, `audit`, `research`, `retro`, `triage`,
      `dnd` and `setup`. The skills use host terms (`core` section Host terms) and run on
      Claude Code. The plugin also ships the templates and the hooks. The design is in
      `docs/DESIGN.md`.

  - tests: lint (red case: without block F, doc-checks reports `README.md Skills: missing tracking`; with it, skill-sizes gives `tracking: 147/147` and skill-graph gives 0 reports), unit
  - needs: TR-1 (the doc-checks `DESIGN.md skills` list must name `tracking` at this commit)
- TR-3 (skill-architecture-redesign/BR-32): MUST, after TR-2, make all of these edits in one commit:
  - replace `skills/workflow/SKILL.md` with block H, where each `<a-b>` line is verbatim from the old file, except that line 116 "(§7)" becomes "(§5)", lines 169-171 become block H1 and lines 188-189 become block H2;
  - in `skills/triage/SKILL.md`, on line 10 replace "[core-main, workflow]" with "[core-main, tracking]", and on line 16 replace "Load `workflow`" with "Load `tracking`";
  - re-point each cite of the list below;
  - in `README.md`, replace line 13 with block I, and on line 14 replace "`workflow`, `plan`, `plan-draft`" with "`tracking`, `plan`, `plan-draft`".

  Block H:

      ---
      name: workflow
      description: >
        Abstract: load only through a skill that extends it. The claim, branches, caveat-base
        writes, finish and the done write that the main-session skills share.
      metadata:
        type: abstract
        extends: [core-main, tracking]
      user-invocable: false
      max-lines: 133
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core-main` before your first step when its rules are not in your context.
      Load `tracking` before your first step when its rules are not in your context.

      # workflow

      ## 1. Claim

      <152-163>

      <44-117>

      ## 5. Done write

      <167-189>

  Block H1:

        milestone done in `<docs>/DESIGN.md` (`tracking` §2). It MUST then commit both marks
        in one commit, the last on task branch. That commit MUST change only status lines. It
        MUST NOT be committed directly on `<base>`. A task with no milestone MUST skip it.

  Block H2:

        tracker bound, a status write under the tracker write rules of `tracking` §1. That ask
        MUST NOT replace the done write of a code run.

  Block I:

      | `workflow` | Abstract: the run mechanics the main-session skills share: the claim, branches, caveat-base writes, finish and the done write. | `code`, `plan`, `delegate` and `setup`, through their pointers |

  Cite re-points, old to new, at `path:line` (skills paths relative to `skills/`):
  - `workflow` §1 to `tracking` §1: plan:49, setup:110, setup/templates/AGENTS.md:44, triage:21, triage:27 (first cite), triage:34, triage:100.
  - `workflow` §5 to `tracking` §2: plan:30, plan:143, requirements/templates/strategic.md:10, requirements/templates/milestone.md:21.
  - "the armory `workflow` skill, section 5" to "the armory `tracking` skill, section 2": `docs/milestones/adopt-mp-rules.md:85`, `lean-reports.md:65`, `new-skills.md:119`, `retro-fixes.md:66`, `small-rules.md:62`, `tracker.md:186`.
  - `workflow` §6 to `workflow` §1: code:25 (second cite).
  - `workflow` §7 to `workflow` §5: plan:135, code:119, code:125.
  - `workflow` §8 to `tracking` §3: dnd:72, setup:115, setup/templates/AGENTS.md:48, triage:27 (second cite), triage:81.
  - `workflow` §9 to `tracking` §4: plan:109, code:29, code:34, code:44, code:46, code:56, delegate:55, triage:63.
  - `workflow` §10 to `tracking` §5: plan:89, triage:59.
  - Each other `workflow` §2, §3 or §4 cite stays.

  - tests: lint (red cases: code:29 left at "`workflow` §9" gives `code: section 1`; triage:63 left gives `triage: cite 1, section 1`; with all edits, 0 reports; `git grep -nE '`workflow` §[15]([^0-9]|$)' -- skills` lists only plan:135, code:25, code:119 and code:125; `git grep -nE '`workflow` §([6-9]|10)' -- skills` and `git grep -n 'workflow` skill, section 5' -- docs/milestones` find nothing), unit
  - needs: TR-2
