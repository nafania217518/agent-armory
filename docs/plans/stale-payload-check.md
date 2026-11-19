# Plan: stale-payload-check

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `stale-payload-check`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-19): MUST make `scripts/skill-graph.mjs` add the check `payload` as the last item of `CHECKS`. A run without `--build` that builds the payloads MUST read `hooks/agent-payload.json` and `hooks/main-payload.md` under the root. For each file whose bytes differ from the text `--build` writes there, or that cannot be read, it MUST give one `payload` report at line 1, with the matching message below and no summary node line. It MUST keep its exit code and write nothing. A `--build` run MUST give no `payload` report. Payload reports MUST sort after all other reports, the agent file before the main file.

      differs from the build
      cannot read (<code>)

  - tests: unit: `scripts/skill-graph.test.mjs`, new group `stale payload` with fixture `writePayloadSources`, each expected value a literal, `<checks>` standing for `extends 0, cycle 0, cite 0, pointer 0, type 0, card-load 0, section 0`: `fresh_payloads_give_no_report` (after `--build`, `run([])` stderr equals `skill-graph: 0 reports, report mode (exit 0)\n<checks>, payload 0\n`); `edited_main_payload_gives_report` (after `--build`, main set to `stale\n`; `reportLines(run())` equals `['hooks/main-payload.md:1: payload: differs from the build']`, status 0); `edited_agent_payload_gives_report` (the same for `hooks/agent-payload.json`); `extra_newline_gives_report` (`\n` appended to main gives the main line); `reformatted_agent_json_gives_report` (the agent file rewritten as `JSON.stringify(parsed, null, 2)` plus `\n` gives the agent line); `core_edit_after_build_reports_agent_then_main` (a rule added to `core` after `--build` gives the agent line, then the main line); `version_change_after_build_gives_two_reports` (`plugin.json` version `9.8.8` after `--build` gives both lines); `missing_payloads_give_cannot_read_reports` (with no build: `hooks/agent-payload.json:1: payload: cannot read (ENOENT)`, then the same for main, status 0, no `hooks` dir); `directory_at_payload_path_gives_cannot_read_report` (after `--build`, the main file replaced by a directory gives only `hooks/main-payload.md:1: payload: cannot read (EISDIR)`); `summary_counts_payload_reports_without_node_line` (with no build, `run([])` stderr equals `skill-graph: 2 reports, report mode (exit 0)\n<checks>, payload 2\n`); `build_run_gives_no_payload_report` (both files set to `stale\n`, then `run(['--build'])` stderr equals `skill-graph: 0 reports, report mode (exit 0)\n<checks>, payload 0\n`); `default_run_without_core_gives_no_payload_report` (`writeSkill('a')` only, then `run([])` stderr equals `skill-graph: 0 reports, report mode (exit 0)\n<checks>, payload 0\n`); the rework of `summary_gives_total_check_and_node_lines` (Test scope); gates unit and lint
  - needs: none
  - load: none, two file reads per run

