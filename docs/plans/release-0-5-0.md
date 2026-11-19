# Plan: release-0-5-0

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `release-0-5-0`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-33): MUST set `version` in `.claude-plugin/plugin.json` from `0.4.14` to `0.5.0` by one run of `node scripts/bump-version.mjs minor` from the repo root, then rebuild `hooks/main-payload.md` and `hooks/agent-payload.json` with `node scripts/skill-graph.mjs --build`, and commit the three files in one commit. A bump that exits 1 or 2, or prints a value other than `0.5.0`, MUST stop the task. After a `--build` failure or a crash after the bump, only `--build` MUST run again, never the bump; a second failure MUST stop the task.
  - tests: unit (`scripts/hooks.test.mjs` `session_start_prints_main_payload` and `subagent_start_prints_agent_json`), lint
  - needs: none
