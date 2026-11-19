# Plan: section-refs

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `section-refs`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-30): MUST, in `scripts/skill-graph.mjs` `sectionReports` (`:305-317`), give no `section` report for a `§` ref whose owner is a file path, a name ref included.
  - tests: unit (`file_path_name_ref_is_not_checked`: `writeRefs(['## 2. Alpha'], ['See `docs/x.md` §Alpha and `b` §Alpha.'])` gives only `skills/a/SKILL.md:10: section: §Alpha is a name reference, resolves to §2`), lint (`--verbose` gives no report on `skills/plan/SKILL.md:39` or `skills/triage/SKILL.md:77`; summary `section 119`, at 9dc60b6 `section 121`)
  - needs: none
- TR-2 (skill-architecture-redesign/BR-30): MUST read each `.md` file directly in `skills/<skill>/templates/` of each skill (beside `readCards`, `:184-191`; joined in `buildGraph`, `:327-350`) and run only the section check on it, with the template path in its reports and its skill's name as node name; it MUST get no cite, edge, pointer or other check. A `templates` path that cannot be listed MUST exit 1 with `<path>: cannot read (<code>)`; a template that cannot be read MUST exit 1 through `readLines`.
  - tests: unit (`template_name_ref_gives_report`: skill `b` with `## 2. Alpha`, `skills/b/templates/t.md` = "See `b` §Alpha." gives `skills/b/templates/t.md:1: section: §Alpha is a name reference, resolves to §2`; `template_ref_to_missing_heading_gives_report`: "See `b` §9." gives `skills/b/templates/t.md:1: section: §9 has no heading in b`; `template_cite_of_non_ancestor_gives_only_section_report`: skill `a` with `## 2. Two`, `b` not extending `a`, `skills/b/templates/t.md` = "See `a` §2 and §9." gives only `skills/b/templates/t.md:1: section: §9 has no heading in a`; `templates_that_is_a_file_exits_1`: status 1, stderr `skills/b/templates: cannot read (ENOTDIR)\n`; `template_that_is_a_folder_exits_1`: status 1, stderr `skills/b/templates/t.md: cannot read (EISDIR)\n`), lint (after TR-1, `--verbose` gives four reports on `skills/setup/templates/AGENTS.md` lines 9, 36, 55, 68, resolving to §4, §2, §3, §6; summary `setup: section 20` and `section 123`, at 9dc60b6 `setup: section 16`)
  - needs: TR-1
- TR-3 (skill-architecture-redesign/BR-30): MUST, in `skills/setup/SKILL.md`, make lines 81, 94, 124 and 135 read `### 4.1. Flow`, `### 4.2. Questions`, `### 4.3. Answer checks` and `### 4.4. Write`.
  - tests: lint (`--verbose` reports on `skills/setup/SKILL.md` lines 33, 36, 83, 121 end "resolves to §4.4", "§4.4", "§4.2", "§4.3"; at 9dc60b6 "matches an unnumbered heading in setup"), unit
  - needs: none
- TR-4 (skill-architecture-redesign/BR-30): MUST, after TR-2 and TR-3, replace each `§<name>` that `node scripts/skill-graph.mjs --verbose` reports (on stderr) as resolving, by the rules below; then copy each changed card template over its `.claude/agents/` copy, keeping the copy's `model:` and `effort:` lines, and run `node scripts/skill-graph.mjs --build`, all in one commit.

      1. Each line `<path>:<line>: section: §<name> is a name reference, resolves to §<n>`
         gives one edit in <path>.
      2. The edit takes the first match on <line>, not yet edited, of `§` plus the words
         of <name> joined by any whitespace and not followed by a letter, digit or `-`,
         and makes it `§<n>`.
      3. A match that spans a line break keeps the break and the indent after `§<n>`,
         moves any `.`, `,`, `;`, `:` or `)` right after the match up to the first line,
         and drops one space after it. No file's line count changes.
      4. A line with two refs of one name and two numbers is edited by hand, by owner:
         at 9dc60b6 only `skills/setup/templates/agents/reviewer.md:21`, which reads
         "(`review` §5 or `audit` §4)".

  - tests: lint (summary `section 0` and `payload 0`, at 9dc60b6 `section 121`; doc-checks passes the six card copies; `git grep -nE '§[A-Za-z]' -- skills .claude/agents hooks` finds only `skills/plan/SKILL.md:39`, `skills/triage/SKILL.md:77`, `skills/requirements/templates/task.md:3` and `:28`, and `skills/requirements/templates/milestone.md:3`), unit
  - needs: TR-2, TR-3
- TR-5 (skill-architecture-redesign/BR-30): MUST, in `docs/DESIGN.md`, replace lines 95-98 with this block.

      - The graph check reports a skill whose pointers and `metadata.extends` differ, a cycle,
        a cite of a skill that is not an ancestor, a card that loads an abstract skill, and a
        rule reference by name or with no such heading. It reads the rule references of the
        skill templates too, with no other check. A `§` after a file path names a doc section
        and is not checked. During the migration it reports without failing; the flip task of
        `skill-architecture-redesign` makes these fail.

  - tests: lint (doc-checks width passes; `git grep -n -F 'names a doc section' -- docs/DESIGN.md` finds one line, at 9dc60b6 none), unit
  - needs: none
