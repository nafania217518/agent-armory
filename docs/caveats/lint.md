# Caveats: lint

Format: the caveat line of the armory `core` skill, section Reports.

- A `SKILL.md` whose leading `---` line is not exactly `---`, as with CRLF line ends or trailing spaces, counts as missing `metadata.max-lines` : scripts/skill-sizes.mjs
- `lint` checks the width of the skill templates, not their size : scripts/doc-checks.mjs
- `lint` checks the `§` refs of the skill templates too : scripts/skill-graph.mjs
- A reworded end marker, or one split across two lines, makes `doc-checks.mjs` run the list region to the end of its text : scripts/doc-checks.mjs
- An unreadable list file reports `<list>: not found`, not `cannot read` : scripts/doc-checks.mjs
- The `doc-checks.mjs` width check skips `AGENTS.md` : scripts/doc-checks.mjs
- The `doc-checks.mjs` width check skips `docs/caveats/`; it covers only `skills/`, `.claude/agents/`, `docs/DESIGN.md` and `docs/milestones/` : scripts/doc-checks.mjs
- A tightening pass that drops "The" from `- The project agents MUST be these` in `skills/delegate/SKILL.md` fails lint with `delegate agents: not found`, because that line is a doc-checks start marker : scripts/doc-checks.mjs
- The `doc-checks.mjs` split RFC keyword check uses the width file set, so it skips `AGENTS.md`, `docs/caveats/` and `docs/tightening.md` : scripts/doc-checks.mjs
- The `doc-checks.mjs` width check skips any line that starts with `|`, so a table row over 90 columns passes `lint` : scripts/doc-checks.mjs
- `doc-checks.mjs` list checks flag only a missing agent name, so a list may name an agent before its template exists : scripts/doc-checks.mjs
- `doc-checks.mjs` skips a `.claude/agents/` copy that has no template, so a copy alone passes `lint` : scripts/doc-checks.mjs
- `doc-checks.mjs` reads the DESIGN.md skill list only between `- The skill set has` and `. The skills other`, so a skill named outside that span is not checked : scripts/doc-checks.mjs
- A new `skills/<name>/` fails `lint` until the plugin.json, marketplace.json, README.md, DESIGN.md and AGENTS.md lists all name it : scripts/doc-checks.mjs
- A new model-loaded skill fails `lint` until `evals/` holds 3 `<skill>-load-<n>` cases and 1 `<skill>-skip-<n>` case; a user-only or abstract skill needs none : scripts/doc-checks.mjs
- `doc-checks.mjs` exempts a skill from the load and skip eval check only for `disable-model-invocation: true` or `metadata.type: abstract`, so a `user-invocable: false` skill still needs evals : scripts/doc-checks.mjs
- `claude plugin validate .` passes a skill with broken frontmatter YAML; `claude plugin validate .claude-plugin/plugin.json` fails it : —
- `doc-checks.mjs` list checks flag only a missing skill name, so a list may name a skill before its `skills/<name>/` folder exists : scripts/doc-checks.mjs
- skill-graph summary lines group reports by bare node name, so a skill and a card with the same name share one line : scripts/skill-graph.mjs
- A `${` with a module-level name, added to the skill-graph `PAGE` literal breaks the `--html` page with no test failing; a backtick fails at module load : scripts/skill-graph.mjs
- `claude plugin validate .claude-plugin/plugin.json` 2.1.274 accepts a YAML list as a skill frontmatter `metadata` value, in flow or block form : .claude-plugin/plugin.json
- `frontmatter.mjs` reads `metadata.extends` only as a flow list `[a, b]`, for skill-graph and doc-checks alike, so a block list that `claude plugin validate` passes gets a skill-graph `extends` report : scripts/frontmatter.mjs
- Each skill's `metadata.max-lines`, except in `core` and `core-main`, which hold none, equals its line count, so any added line, frontmatter included, fails `lint` until the cap rises : scripts/skill-sizes.mjs
- `doc-checks.mjs` and `skill-graph.mjs` both call `main()` with no import guard, so importing either one runs its CLI : scripts/skill-graph.mjs
- skill-graph compares the payload files byte for byte, so a CRLF checkout of `hooks/` (git `autocrlf`) reports both payloads as stale and fails `lint` : scripts/skill-graph.mjs
- `scripts/bump-version.mjs` changes the `plugin.json` version but not the payloads, so after each bump `lint` fails on two `payload` reports and `unit` on two `scripts/hooks.test.mjs` cases until `--build` runs : scripts/bump-version.mjs
- skill-graph prints its report lines and summary on stderr, so a `| grep` without `2>&1` filters nothing : scripts/skill-graph.mjs
- skill-graph counts each code span whose text is a skill name as a cite, so a backticked common word that names a skill, such as `requirements`, `test` or `review`, gives a `cite` report in a skill without that ancestor : scripts/skill-graph.mjs
- The `doc-checks.mjs` width check covers skill frontmatter, so an `extends` list past 90 columns fails `lint` until it wraps onto a continuation line indented 3 or more spaces : scripts/doc-checks.mjs
- skill-graph prints its report lines, the `cycle: <members>` line included, only with `--verbose`; the default output gives only counts : scripts/skill-graph.mjs
- skill-graph sorts the reports of one line by message text, so two refs on one line come out in text order, not position order : scripts/skill-graph.mjs
- After a file-path ref, a chained ref such as "`docs/x.md` §A and §B" is checked as a bare ref of the citing file, since a file-owner ref carries no owner to §B : scripts/skill-graph.mjs
- When a skill is deleted, a card that still cites it as `<skill>` §1 gets a `section` report against the card, not a `cite` report : scripts/skill-graph.mjs
- `skill-sizes.mjs` finds `metadata.max-lines` with its own line scan, not with `frontmatter.mjs`, so a change to how one reads the `metadata` block does not reach the other : scripts/skill-sizes.mjs
