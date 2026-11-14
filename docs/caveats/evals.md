# Caveats: evals

Format: the caveat line of the armory `core` skill, section Reports.

- A worktree-isolated subagent cannot run `claude plugin eval`, because the guard refuses a command with the word `eval` : skills/setup/templates/agents/coder.md
- A `prompt.md`-only eval case is valid for `claude plugin eval`, but the `lint` eval-coverage check does not count it : scripts/doc-checks.mjs
- A `tool_order` grader passes only when both tools are called, so it cannot assert that a skill is not loaded : evals/
