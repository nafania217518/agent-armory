# Plan: doc-checks

Parent: `docs/milestones/retro-fixes.md` section Tasks, line `doc-checks`.

## Goal

One new lint script, `scripts/doc-checks.mjs`, catches two mechanical misses of the
`debug-skill` session: a line wider than 90 characters, and a skill or agent missing
from a list that names them. Zero quiz rounds: the milestone doc settles the limit,
the files, the lists and the home. Each list is found by fixed marker text that bounds
a region, so a name elsewhere in the same text cannot hide a missing one, and a
reworded marker fails loudly as "not found". Both checks pass on the repo today.

## Requirements

Format: `TR-<n> (<milestone>/BR-<m>, ...): MUST <behavior>`, then an indented `tests:`
line that names the tests, or `tests: none, <why>`.

- TR-1 (exempt and pass tests replaced by TR-7, unreadable file by TR-8)
  (retro-fixes/BR-4, retro-fixes/BR-6): `node scripts/doc-checks.mjs [root]`
  (root defaults to the working directory) MUST check every `.md` file under
  `<root>/skills/` (any depth), `<root>/.claude/agents/*.md`, `<root>/docs/DESIGN.md`
  and `<root>/docs/milestones/*.md`; a missing path is skipped. A line longer than 90
  characters, counted in code points, fails, unless it starts with `|` or sits inside
  a fenced code block (a line that starts with three backticks opens or closes one).
  Each failure MUST print `<path relative to root>:<line>: <length> > 90` on stderr.
  The script MUST exit 1 when any check fails, 0 when none does, and 2 with a usage
  line on stderr when it gets more than one argument.
  tests: `scripts/doc-checks.test.mjs`, unit (sociable, temp fixture root):
  line_of_90_passes, line_of_91_fails_naming_path_line_length, table_row_is_exempt,
  fenced_code_is_exempt, lines_after_a_closed_fence_are_checked,
  nested_template_is_checked, file_outside_scope_is_skipped,
  counts_code_points_not_bytes, extra_argument_exits_2
- TR-2 (README, DESIGN, AGENTS.md and delegate markers replaced by TR-5,
  complete_lists_exit_0 by TR-6) (retro-fixes/BR-5, retro-fixes/BR-6): the same run MUST
  check the lists. The skill names are the folders under `<root>/skills/` that hold a
  `SKILL.md`; the agent names are the file names, without `.md`, in
  `<root>/skills/setup/templates/agents/`.
  Each list is a region of a text, from a start marker to an end marker:
  - `plugin.json skills`: `.description` of `.claude-plugin/plugin.json`, from its
    start to ` skills with`; skills; word match.
  - `plugin.json agents`: the same text, from `skills with ` to ` agent templates`;
    agents; word match.
  - `marketplace.json skills`: `.description` of `.claude-plugin/marketplace.json`,
    from `skills: ` to its end; skills; word match.
  - `marketplace.json plugin skills` and `marketplace.json plugin agents`:
    `.plugins[0].description`, with the markers of the two `plugin.json` lists.
  - `README.md Skills`: from `## Skills` to the next line that starts with `## `;
    skills; backtick match.
  - `README.md Agents`: from `## Agents` to the next `## ` line; agents; backtick.
  - `DESIGN.md skills`: `docs/DESIGN.md`, from `- The skill set has` to the next line
    that starts with `- `; skills; backtick.
  - `DESIGN.md agents`: from `- The project agents are` to the next `- ` line; agents;
    backtick.
  - `AGENTS.md What this is`: from `## What this is` to the next `## ` line; skills;
    backtick.
  - `delegate agents`: `skills/delegate/SKILL.md`, from `- The project agents MUST be
    these` to the next `- ` line; agents; word match.
  A word match is the name as a whole word; a backtick match is the name in backticks.
  A missing name MUST print `<list>: missing <name>`; a missing file, field or start
  marker MUST print `<list>: not found`; both on stderr, with exit 1. The width and
  list failures all print in one run.
  tests: `scripts/doc-checks.test.mjs`, unit (a helper writes a complete fixture
  repo): complete_lists_exit_0, skill_missing_from_readme_skills_fails,
  agent_missing_from_delegate_fails, skill_missing_from_plugin_json_fails,
  name_outside_the_region_does_not_count, missing_start_marker_reports_not_found,
  word_match_needs_the_whole_word (`plan` missing while `planner` is present),
  width_and_list_failures_print_together
- TR-3 (retro-fixes/BR-6, retro-fixes/BR-8): the `lint` line of this repo's
  `AGENTS.md` `## Commands` MUST read `- lint: claude plugin validate . && claude
  plugin validate .claude-plugin/plugin.json && node scripts/skill-sizes.mjs && node
  scripts/doc-checks.mjs` (one line), and `lint` MUST pass on the repo.
  tests: none, a project-context line; `lint` runs it on the real repo
- TR-4 (retro-fixes/BR-7, retro-fixes/BR-8): `lint` and `unit` MUST pass on every
  commit. The two caveat writes below come from the main session.
  tests: none, gate rule
- TR-5 (retro-fixes/BR-5): defect, review finding 1: a name outside the list counted as
  listed. `README.md Skills` and `README.md Agents` MUST use a row match: a name counts
  only as a table row that starts with `` | `name` | ``. `AGENTS.md What this is` MUST
  run from `armory actor: ` to `. The skills use`; `DESIGN.md skills` from `- The skill
  set has` to `. The skills other`; `DESIGN.md agents` from `- The project agents are`
  to `. The plugin ships`; `delegate agents` from `- The project agents MUST be these`
  to `. Each card`.
  tests: readme_row_match_ignores_a_name_in_another_row,
  agents_md_region_ends_at_the_list, design_skills_region_ends_at_the_list (each
  fixture keeps a decoy name outside the list and drops it from the list)
- TR-6 (removal of complete_lists_exit_0 replaced by TR-9) (retro-fixes/BR-4,
  retro-fixes/BR-5, retro-fixes/BR-6): review finding 2, the user chose to fix it now.
  The tests MUST prove each of the 11 lists, the `docs/DESIGN.md` and `.claude/agents`
  width paths, and the root argument. No script change is expected.
  tests: each_list_reports_a_missing_name (table-driven: remove one name from each
  list, expect exactly `<list>: missing <name>`; replaces complete_lists_exit_0),
  design_md_is_width_checked, claude_agents_is_width_checked,
  root_argument_is_used (run from another working directory)
- TR-7 (retro-fixes/BR-4): review finding 3, the user chose to fix it now.
  line_of_90_passes, table_row_is_exempt, fenced_code_is_exempt,
  file_outside_scope_is_skipped and counts_code_points_not_bytes MUST each hold a
  91-character control line in a checked file and assert that stderr is exactly that
  line's failure.
  tests: the five tests named, reworked
- TR-8 (retro-fixes/BR-4): a checked `.md` file that cannot be read (a dangling symlink,
  no read permission) MUST print `<path relative to root>: cannot read (<code>)` on
  stderr and count as a failure, and the other checks MUST still run. The user chose a
  named failure line over a caveat.
  tests: dangling_symlink_is_named
- TR-9 (retro-fixes/BR-4, retro-fixes/BR-5): re-review findings 1–3, the user chose to
  fix them now. A complete fixture repo MUST exit 0 with empty stderr, tested. The
  `DESIGN.md agents` and `delegate agents` rows of each_list_reports_a_missing_name MUST
  each hold a decoy name after the list's end marker. The five TR-7 tests MUST carry a
  `req: doc-checks/TR-7` marker.
  tests: complete_repo_exits_0, the two decoy rows; the markers need no test

Each TR is one commit, test first (`test` section TDD), with `req: doc-checks/TR-<n>`
markers as in `scripts/skill-sizes.test.mjs`. Match that file's style: `node:test`,
`execFileSync` on the script, a temp dir per test.

## Test scope

Format: `<test case> : <break | rework | remove> : <reason>`.

- complete_lists_exit_0 : remove : TR-6 replaces it with
  each_list_reports_a_missing_name; TR-9 adds complete_repo_exits_0 back for exit 0
- line_of_90_passes, table_row_is_exempt, fenced_code_is_exempt,
  file_outside_scope_is_skipped, counts_code_points_not_bytes : rework : TR-7, a
  91-character control line in each
- skill_missing_from_readme_skills_fails, name_outside_the_region_does_not_count :
  rework : the TR-5 row match needs one name per README row (scope addition, accepted)

## Risks

- A reworded list sentence makes `lint` fail with `not found` until the marker in the
  script follows it; that is the intended loud failure.
- Code-point counting can differ from an editor's column count for wide characters;
  the repo text is Latin with a few dashes.

## Stack choices

Node built-ins only (`node:fs`, `node:path`, `node:test`), as the other scripts.

## Out of scope

- A check for names a list holds but no skill or agent has.
- Old plan files, `docs/archive/` and `AGENTS.md` one-line formats (milestone Out).

## Accepted tech debt

None.

## Overrides

Format: `<design rule> : <reason>`.

- `code` section Branch and plan file, cut from `<base>` : the user keeps local
  `master` nine commits ahead of `origin/master` (no push), so the branch cuts from
  local `master` (`cf18dd9`); not a design rule, recorded for the user's approval.

## Caveats

- `doc-checks.mjs` finds each skill and agent list by fixed marker text; rewording a
  marker sentence makes `lint` report the list as not found : scripts/doc-checks.mjs
- The `plan` templates get only the width check from `lint`; `skill-sizes.mjs` counts
  only `SKILL.md` : scripts/skill-sizes.mjs (replaces the caveat "The `plan` templates
  are not checked by `lint`; ...")
