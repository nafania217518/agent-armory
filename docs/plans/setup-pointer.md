# Plan: setup-pointer

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `setup-pointer`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-29): MUST, in `skills/setup/SKILL.md`, replace lines 62-64 with block A.

      - Pointer MUST be one line in project context: "At session start, load the armory `core`
        skill, and in the main session also the armory `core-main` skill, each when its rules
        are not in your context." Line MUST sit at top of that context, before first section.

  - tests: lint (skill-sizes prints `setup: 167/167`, as at 52b50e6; `git grep -n -F 'armory `core-main` skill' -- skills/setup/SKILL.md` finds line 63, at 52b50e6 none), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-29): MUST, in `skills/setup/SKILL.md`, replace lines 34-38 with block B, insert block C after line 64, and set `max-lines` to its line count.

        skip §Self-report and §Install, except pointer, card render, consent question and rerun
        bullets of §Install. Its Questions round MUST show only items that project context
        lacks; the rest MUST keep their existing values. §Write sets how each changed file is
        shown and written. Update run MUST offer, in the consent question, to delete each card
        at host's agent location that no template names.

        An update run MUST write the pointer only over a project-context line that starts "At
        session start, load the armory `core` skill" and differs from it; the consent question
        MUST offer that write.

  - tests: lint (skill-sizes prints `setup: 170/170`, at 52b50e6 `setup: 167/167`; summary line `setup: section 16`, as at 52b50e6; `git grep -n -F 'except pointer,' -- skills/setup/SKILL.md` finds line 34 and `git grep -n -F 'differs from it' -- skills/setup/SKILL.md` finds line 66, at 52b50e6 neither), unit
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-29): MUST, in `README.md`, on line 12 replace "| the hook, in the main payload |" with "| the hook, in the main payload, or the pointer |".
  - tests: lint (doc-checks passes; `git grep -n -F 'main payload, or the pointer' -- README.md` finds line 12, at 52b50e6 none), unit
  - needs: none

- 2026-11-19: review fix (auto-fix): TR-2's block C ends at "differs from it."; the consent-question clause goes, since the consent bullet already covers each write, so `max-lines` is 169 and skill-sizes prints `setup: 169/169`.
