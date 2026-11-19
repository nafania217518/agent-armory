# Plan: doc-checks-abstract

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `doc-checks-abstract`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-9): MUST read a skill's frontmatter in `doc-checks.mjs` the way `skill-graph.mjs` reads it. A CRLF line end counts as LF. Only a line that is exactly `---` closes the frontmatter, and one with no such closing line counts as none. When a skill's `SKILL.md` cannot be read, the run MUST NOT throw. The run MUST print the width check's `skills/<skill>/SKILL.md: cannot read (<code>)` line once, along with the other failures, and exit 1. The run MUST give no eval report for that skill.
  - tests: unit: `crlf_user_only_skill_needs_no_evals`: `delegate` has a CRLF frontmatter with `disable-model-invocation: true`, `plan` a CRLF frontmatter without it, evals of both removed; exit 1, stderr `plan: fewer than 3 load evals\nplan: no skip eval\n`
  - tests: unit: `closing_line_with_trailing_space_does_not_close_frontmatter`: `delegate` sets the flag and closes its frontmatter with `--- `, evals removed; exit 1, stderr `delegate: fewer than 3 load evals\ndelegate: no skip eval\n`
  - tests: unit: `unreadable_skill_is_named_once_and_skips_its_eval_check`: `skills/code/SKILL.md` is an empty folder, `code` evals removed; exit 1, stderr `skills/code/SKILL.md: cannot read (EISDIR)\n`
  - tests: the existing `skill-graph.test.mjs` cases stay unchanged and pin the move; gates unit and lint
  - needs: none
  - load: none, one read per skill, as today
- TR-2 (skill-architecture-redesign/BR-9): MUST skip the load and skip eval check of `doc-checks.mjs` for a skill whose `metadata.type` is `abstract`, with no report for its eval cases. `user-invocable: false` alone MUST NOT exempt a skill. TR-2 reads `metadata.type` through the TR-1 reader in the same run.
  - tests: unit: `abstract_skill_needs_no_evals`: `plan` sets `user-invocable: false` and `metadata.type: abstract` and keeps only `plan-load-1`; `delegate` sets `user-invocable: false` and `metadata.type: regular` and has no evals; exit 1, stderr `delegate: fewer than 3 load evals\ndelegate: no skip eval\n`
  - tests: gates unit and lint
  - needs: TR-1
  - load: none, one filter step per skill, as today

