# Plan: user-only

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `user-only`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-39): MUST, in `skills/workflow/SKILL.md`, insert block A after line 199 and set `max-lines` to its line count.

      - The comment a run adds when it sets `needs-info` MUST take the form `## Triage notes`:
        what is established, and what reporter still needs to give.

  - tests: lint (skill-sizes prints `workflow: 264/264`, at ac21b1b `workflow: 262/262`; `git grep -n -F 'Triage notes' -- skills/workflow/SKILL.md` finds line 200, at ac21b1b none), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-39): MUST, in `skills/dnd/SKILL.md`: make line 10 read `  extends: [code, core, plan]`; insert block B after line 15; on line 70 replace "`triage` §Outcomes" with "`workflow` §8"; set `max-lines` to its line count.

      Load `plan` before your first task when its rules are not in your context.
      Load `code` before your first task when its rules are not in your context.

  - tests: lint (summary line `dnd: section 10`, no `cite`, `pointer` or `cycle` report on `dnd`; at ac21b1b `dnd: pointer 1, section 11`; `git grep -n -F '`triage`' -- skills/dnd/SKILL.md` finds none), unit
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-39): MUST, in `skills/triage/SKILL.md`: make line 10 read `  extends: [core-main, workflow]`; on line 15 replace "`core`" with "`core-main`"; on line 20 replace "a `plan` run" with "a plan run"; replace lines 26-27 with block C; replace line 63 with block D; on line 78 delete " A later `plan` milestone or task run starts from the item."; replace lines 79-80 with block E; set `max-lines` to its line count.

      - MUST stop and name the setup skill when project context has no `## Tracker`, or a
        label verb (`workflow` §1) or one of the five label lines (`workflow` §8) is unbound.

         its change to an amendment (`workflow` §9). Done when each point is answered or left
         to reporter.

      - `needs-info`: state and category labels, and a `## Triage notes` comment
        (`workflow` §8).

  - tests: lint (summary line `triage: section 5` and `cycle 0`, no `cycle: setup, triage` line with `--verbose`, no `cite` or `pointer` report on `triage`; at ac21b1b `triage: cycle 1, pointer 1, section 5`; `git grep -n -F -e '`plan`' -e '`setup`' -- skills/triage/SKILL.md` finds none), unit
  - needs: TR-1
- TR-4 (skill-architecture-redesign/BR-39): MUST, in `skills/setup/SKILL.md`: make line 11 read `  extends: [code, core-main, delegate, test, workflow]`; on line 16 replace "`core`" with "`core-main`"; insert block F after line 17; delete line 78; make line 87 read `- Run MUST skip plan mode and the plan file.`; set `max-lines` to its line count.

      Load `test` before the questions when its rules are not in your context.
      Load `code` before the questions when its rules are not in your context.
      Load `delegate` before you render the agent cards when its rules are not in your context.

  - tests: lint (summary line `setup: section 16`, no `cite`, `pointer` or `cycle` report on `setup`; at ac21b1b `setup: cycle 1, pointer 1, section 16`; `git grep -n -F -e '`plan`' -e '`triage`' -- skills/setup/SKILL.md` finds none), unit
  - needs: none
- TR-5 (skill-architecture-redesign/BR-39): MUST, in `skills/retro/SKILL.md`: make line 10 read `  extends: [core]`; on line 40 replace "or in `review`." with "or in the review skill."
  - tests: lint (summary line `retro: section 2`; at ac21b1b `retro: pointer 1, section 2`; `git grep -n -F '`review`' -- skills/retro/SKILL.md` finds none), unit
  - needs: none
- TR-6 (skill-architecture-redesign/BR-39): MUST, in `docs/DESIGN.md`: insert block G after line 81; in the `workflow` row (line 149) replace "the `triage` roles and label lines: none (new)" with "the `triage` roles, label lines and notes form: none (new)".

        A skill that needs none of another skill's rules and names it only as a command for the
        user or a home for a rule names it in plain text, as `core-main` §4 does. A user-only
        skill MUST NOT be a parent, since the host does not let the model load it; a skill
        names it in plain text instead.

  - tests: lint (doc-checks width passes; `git grep -n -F 'MUST NOT be a parent' -- docs/DESIGN.md` finds one line, at ac21b1b none), unit
  - needs: TR-1
