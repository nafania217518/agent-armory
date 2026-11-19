# Caveats: evals

Format: the caveat line of the armory `core` skill, section Reports.

- A worktree-isolated subagent cannot run `claude plugin eval`, because the guard refuses a command with the word `eval` : skills/setup/templates/agents/coder.md
- A `prompt.md`-only eval case is valid for `claude plugin eval`, but the `lint` eval-coverage check does not count it : scripts/doc-checks.mjs
- A `tool_order` grader passes only when both tools are called, so it cannot assert that a skill is not loaded : evals/
- Eval child sessions ignore `.claude/agents/`, even one a scaffold writes; agent cards must ship in the plugin under test : evals/
- An agent dispatched in the no-plugin baseline arm fails with "Agent type not found"; use `--ablation none` for agent cases : evals/
- `claude plugin eval --eval-dir <dir>` writes results to `<plugin>/<dir>/results/`, and only the default `evals/results/` is ignored : .gitignore
- An eval `llm` grader is judged by Haiku unless `--judge-model` sets another model : evals/
