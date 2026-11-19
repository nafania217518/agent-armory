# Plan: core-split

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `core-split`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-37): MUST exempt the skills `core` and `core-main` from the `max-lines` check of `scripts/skill-sizes.mjs`, and MUST drop the `max-lines` line from `skills/core/SKILL.md`.
  - tests: unit: `scripts/skill-sizes.test.mjs` case `core_and_core_main_without_max_lines_are_exempt_but_core_extra_is_not` (`core` and `core-main` have no field, `core-extra` has none: exit 1, stderr names only `core-extra`, stdout holds `core: <n>/exempt` and `core-main: <n>/exempt`); case `core_over_its_own_max_lines_still_passes` (`max-lines: 1`, 5 lines: exit 0, `core: 5/exempt`); lint
  - needs: none
- TR-2 (skill-architecture-redesign/BR-16): MUST make `scripts/skill-graph.mjs` print one `card-main` error line per load-line span in a card template that names `core-main` or a skill with `core-main` as an ancestor, then `skill-graph: <n> errors (exit 1)`, and exit 1, also without `--verbose` and with a draw flag. The line form:

      <card path>:<line>: card-main: <card> loads `<skill>`, which is or extends `core-main`

  - tests: unit: `scripts/skill-graph.test.mjs` group `card main check`: `load_of_skill_that_extends_core_main_exits_1`; `load_of_skill_two_hops_below_core_main_exits_1`; `load_of_core_main_itself_exits_1`; `load_of_skill_in_cycle_with_core_main_parent_exits_1`; `only_load_lines_count` (a card cites `a`, which extends `core-main`, in another bullet, loads `ok`, which extends only `core`, and loads `b`, which extends `core-main`, on a continuation line: exactly one error, for `b`); `error_prints_without_verbose_and_with_mermaid` (exit 1, the graph still on stdout); lint
  - needs: none
- TR-3 (skill-architecture-redesign/BR-14, skill-architecture-redesign/BR-15, skill-architecture-redesign/BR-17): MUST add `skills/core-main/SKILL.md` with exactly the first block below, wrapped at 90 columns with no RFC keyword split across lines. MUST delete from `core` `core:21-22` (the "only two exceptions" lead of `core:18` becomes the TR-5 text), `core:33-45`, the question-tool part of `core:53-55`, `core:67-77` and the main-session clauses of `core:125-127`. MUST add the line `armory-core <version>`, with an empty line above and below, under `# core`. MUST add the 4 eval cases of the second block. MUST insert `core-main` after `core` in the skill lists of `.claude-plugin/plugin.json` (`:4`, where "hooks that inject core" becomes "hooks that inject core and core-main"), `.claude-plugin/marketplace.json` (`:4` and `:11`, the same edit) and `AGENTS.md` What this is. MUST add the `README.md` Skills row of the third block after `core`, and change `README.md:94-95` to `An Opus run costs about $19 (126 runs at about $0.15).`. MUST re-point `code:64` and `code:115` to `` (`core-main` §3) ``, `plan:108` to `` `core-main` §2 sets the question format ``, `plan:123` to `` (`core-main` §3) `` and `setup:115` to `` (`core-main` §2) ``.

      ---
      name: core-main
      description: >
        Always-on rules for the main session only; the hook injects them at session
        start. Use for "/core-main" and "show the armory main-session rules".
      metadata:
        type: regular
        extends: [core]
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core` before your first step when its rules are not in your context.

      # core-main

      armory-core-main <version>

      A subagent MUST skip this skill: its rules are for the main session only.

      ## 1. Rule words (main session only)

      - Under a user-only skill that grants it, main session's own answer MAY replace a
        user question or yes, within the limits that skill sets. This is the one
        main-session exception to MUST and MUST NOT.

      ## 2. Replies and questions (main session only)

      - Each reply to user MUST follow the three rules below. A skill's fixed output
        format and this section's question bullet win over them.
        - Shape: <core:35-38 verbatim>
        - Lists: <core:39-41 verbatim>
        - Flow: <core:42-45 verbatim>
      - Main session MUST ask user through question tool; message text MUST hold only
        context. Free-text question MAY offer only "Other", or go as a plain message.

      ## 3. Reads and writes (main session only)

      - <core:67-70 verbatim: "Main session MUST read files only in these cases, ...">
      - <core:71-75 verbatim: "Main session MUST write files only in these cases, ...">
      - Every other read MUST go to an agent that returns a conclusion; every other
        write MUST go by intent to the writer (prose) or coder (code).
      - Main session MUST decide every write to the caveat base. Outside a plan or code
        run, it MUST ask user first.

      Each case evals/core-main-<kind>-<n>/case.yaml has the form of
      evals/core-load-1/case.yaml, with max_turns: 3, allowed_tools: [Skill, Read, Glob,
      Grep] and the grader input_match: '"skill"\s*:\s*"(?:[\w-]+:)?core-main"':
      core-main-load-1: "Show me the armory main-session rules."                    min: 1
      core-main-load-2: "Which files may the armory main session read itself?"      min: 1
      core-main-load-3: "How must the armory main session shape its replies?"       min: 1
      core-main-skip-1: "Which model and effort does armory pick for a coder spawn?" min: 0, max: 0

      | `core-main` | Always-on rules for the main session only: replies, questions, reads and writes. | the hook, in the main payload |

  - tests: unit: `scripts/skill-graph.test.mjs` group `repo graph`, case `core_main_cites_only_core` (the repo's `--mermaid` output holds at least one line that starts `  s_core_main -->`, and each such line ends ` s_core`); lint (the eval count and the lists in doc-checks)
  - needs: TR-1
- TR-4 (skill-architecture-redesign/BR-18): MUST add `skills/workflow/SKILL.md` with exactly the first block below, `max-lines` equal to its line count. MUST replace `core:142-149` and delete `core:152-157` and `core:160-164`; `core` keeps `core:150-151` and `core:158-159` (the TR-5 text). MUST insert `workflow` after `core-main` in the same five lists as TR-3, and add the `README.md` row of the second block after `core-main`. MUST re-point `plan:61` to "under the tracker write rules of `workflow` §1"; `plan:63`, `triage:20` and `triage:26` to `` (`workflow` §1) ``; `setup:105` to "each verb of `workflow` §1", without ", term `tracker`"; `skills/setup/templates/AGENTS.md:44-45` to "one line per bound verb of armory `workflow` §1, then"; `triage:36` and `triage:101` to "the AI marker line of `workflow` §1"; and `docs/DESIGN.md:99` to `` (`workflow` §1) ``.

      ---
      name: workflow
      description: >
        Abstract: load only through a skill that extends it. The tracker verbs, the
        docs fallback and the tracker write rules that the main-session skills share.
      metadata:
        type: abstract
        extends: [core-main]
      user-invocable: false
      max-lines: <its line count>
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
      Load `core-main` before your first step when its rules are not in your context.

      # workflow

      ## 1. Tracker

      - Tracker verbs: <core:142-148 verb list verbatim, from "read an item" to "create
        label.">. Project context `## Tracker` binds each verb.
      - Docs fallback: with no `## Tracker` in project context, milestones, tasks and
        their status live in docs files, not in a tracker.
      - <core:152-153 verbatim>
      - <core:154-155 verbatim>
      - <core:156-157 verbatim>
      - A run MUST NOT edit body of a parent item (an item above the one the run plans
        or codes), except to write an amendment user approved. It MUST comment on that
        item instead.
      - <core:163-164 verbatim>

      | `workflow` | Abstract: the run mechanics the main-session skills share: now the tracker verbs and write rules. | none yet; later the main-session skills, through their pointers |

  - tests: none, a prose move with no code; the reviewer greps `skills/` for `This was generated by AI` and `add a blocked-by edge` and finds them only in `workflow`; lint
  - needs: TR-3
- TR-5 (skill-architecture-redesign/BR-15): MUST make `skills/core/SKILL.md` read exactly as the block below, `extends: []` included, where each line marked "unchanged" keeps its text. MUST delete `code:60-61` and change `code:58` to "Caveat base, caveat slot, caveat format, subagent ban and recorded items are in `core` §6."

      ---
      name: core
      description: >
        Always-on base rules for the main session and every subagent; the hook injects them at
        session and subagent start. Use for "/core" and "show the armory base rules".
      metadata:
        type: regular
        extends: []
      ---

      The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.

      # core

      armory-core <version>

      ## 1. Rule words

      - MUST and MUST NOT have one exception for every actor: approved plan MAY override
        a design rule, a rule of §4 or one a skill names as a design rule.
      - <core:23-24 unchanged>
      - <core:25 unchanged>

      ## 2. Writing and questions

      - <core:29-32 unchanged>
      - <core:46 unchanged>
      - <core:47-49 unchanged>
      - Code comment MUST say only the why code cannot show, in one line. Exceptions: the
        `req:` marker and the `tech-debt:` marker.
      - Subagent MUST NOT ask user; it MUST report `stuck: <question>` instead.
      - Recommended option MUST name its basis, the ground it rests on, or be unmarked.

      ## 3. Tools and background tasks

      - <core:60-61 unchanged>
      - <core:62-64 unchanged>
      - <core:65 unchanged>

      ## 4. Design principles

      - <core:81 unchanged>
      - DRY + SSOT: each fact, rule, decision or piece of logic MUST live in exactly one
        place. Everywhere else MUST reference it.
      - <core:84-92 unchanged>

      ## 5. Models

      - <core:96 unchanged>

      ## 6. Reports

      - <core:100-118 unchanged, four bullets>
      - Caveat base: project context `## Caveats` plus topic files
        `<docs>/caveats/<topic>.md`.
      - Caveat line, in a report or the caveat base, MUST take the format
        <rest of core:119-122 unchanged>
      - Each SHOULD bypass made during work (§1) MUST be recorded during the task, and so
        MUST each item a skill names as recorded.
      - A subagent MUST NOT write to the caveat base; it MUST report the caveat in its
        caveat slot instead.

      ## 7. Host terms

      - <core:131-136 unchanged, six terms>
      - hook: host's command that injects the hook payloads at session and subagent
        start: core for every actor, plus core-main in the main session. Fallback: the
        pointer line in project context.
      - <core:139-141 unchanged>
      - tracker: system that holds milestones, tasks and their status; project context
        `## Tracker` binds it.
        - <core:150-151 unchanged>
        - A report or item text MUST name a tracker item by its title, with its link
          inside, not by a bare id. A PR closing line is exempt.

  - tests: unit: `scripts/skill-graph.test.mjs` group `repo graph`, case `core_cites_no_skill` (the repo's `--mermaid` output has no line that starts `  s_core -->`; `core_main_cites_only_core` is its positive twin); lint
  - needs: TR-3, TR-4
- TR-6 (skill-architecture-redesign/BR-11, skill-architecture-redesign/BR-12, skill-architecture-redesign/BR-14): MUST build both payloads as Design says. The default run MUST build in memory and write nothing; `--build` MUST also write `hooks/main-payload.md` and `hooks/agent-payload.json`, creating `hooks/`. With no `skills/core/SKILL.md`, the default run MUST skip the build, and `--build` MUST exit 1 with `skills/core/SKILL.md: cannot read (ENOENT)`. A payload over 9,000 or over 10,000 characters MUST print the warning below and keep the exit code. The usage line MUST become the third block, and the build errors (exit 1) MUST take the texts of the fourth block. A run that crashes between the two writes leaves a mixed pair, and the next `--build` rewrites both files.

      skill-graph: warning: <main|agent> payload is <n> characters, over 9000
      skill-graph: warning: <main|agent> payload is <n> characters, over 10000; the host swaps it for a file path and a 2000-character preview

      usage: node scripts/skill-graph.mjs [--verbose] [--build] [--mermaid | --html] [root]

      skills/core/SKILL.md: needs one marker line "armory-core <version>"
      skills/core-main/SKILL.md: needs one marker line "armory-core-main <version>"
      <skill path>:<line>: marker line outside its skill
      skills/core-main/SKILL.md: cannot read (<code>)
      .claude-plugin/plugin.json: cannot read (<code>)
      .claude-plugin/plugin.json: no version
      hooks/<file or dir>: cannot write (<code>)

  - tests: unit: `scripts/skill-graph.test.mjs` group `payload build`, with fixtures that hold `core`, `core-main` and `plugin.json` version `9.8.7`, each expected text a literal: `build_writes_main_payload` (equals the literal; disclaimer gone, suffix gone, version filled); `build_writes_agent_payload_json` (`hookEventName` is `SubagentStart`, `additionalContext` equals the literal); `crlf_source_gives_lf_payload_without_frontmatter`; `suffix_stays_on_a_non_heading_line`; `version_placeholder_outside_marker_line_stays`; `default_run_warns_at_9001_and_writes_no_hooks_dir` (exit 0; the padding length comes from the fixture's literal parts); `no_warning_at_exactly_9000`; `only_the_10000_warning_at_10001`; `main_payload_warning_names_main`; `build_without_core_exits_1`; `core_without_marker_exits_1`; `core_with_two_markers_exits_1`; `core_main_without_marker_exits_1`; `marker_line_in_other_skill_exits_1`; `core_main_marker_inside_core_exits_1`; `missing_core_main_exits_1`; `missing_plugin_json_exits_1`; `version_missing_empty_non_string_or_bad_json_exits_1`; `hooks_path_is_a_file_exits_1`; `build_and_card_main_error_order` (warnings before the `card-main` lines); the 3 usage cases are reworked (Test scope); lint
  - needs: TR-2, TR-3
- TR-7 (skill-architecture-redesign/BR-13): MUST set `hooks/hooks.json` to the block below, MUST delete `scripts/core-context.sh` and `scripts/core-context.test.mjs`, and MUST commit the output of `node scripts/skill-graph.mjs --build` as its own commit. MUST change `README.md:110-111` to "The global rules live in `core` and `core-main`; the plugin hooks inject them, or the pointer that `setup` writes when the hook probe fails." A missing payload file makes `cat` exit 1 with its message on stderr, and the host injects nothing.

      {
        "hooks": {
          "SessionStart": [
            { "hooks": [ { "type": "command", "command": "cat \"${CLAUDE_PLUGIN_ROOT}/hooks/main-payload.md\"" } ] }
          ],
          "SubagentStart": [
            { "hooks": [ { "type": "command", "command": "cat \"${CLAUDE_PLUGIN_ROOT}/hooks/agent-payload.json\"" } ] }
          ]
        }
      }

  - tests: unit: new `scripts/hooks.test.mjs`, which runs each `hooks.json` command through `sh -c` with `CLAUDE_PLUGIN_ROOT` set to the repo root and the working folder set to an empty temp folder, `v` being the `plugin.json` version: `session_start_prints_main_payload` (the output starts with the RFC line, holds a line `armory-core <v>` and a line `armory-core-main <v>`, and no disclaimer line); `subagent_start_prints_agent_json` (the output parses as JSON, `hookEventName` is `SubagentStart`, and `additionalContext` holds a line `armory-core <v>` and no line that starts `armory-core-main`); lint
  - needs: TR-4, TR-5, TR-6

- 2026-11-19: Design bullet on the `core-main` body: the build also drops the lines above `# core-main` and the empty line after the disclaimer (review finding 3, auto-fix); TR-6 `build_writes_main_payload` takes the new literal.

