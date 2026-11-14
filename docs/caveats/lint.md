# Caveats: lint

Format: the caveat line of the armory `core` skill, section Reports.

- A `SKILL.md` whose leading `---` line is not exactly `---`, as with CRLF line ends or trailing spaces, counts as missing `max-lines` : scripts/skill-sizes.mjs
- `claude plugin validate` accepts the non-standard skill frontmatter key `max-lines` : skills/core/SKILL.md
- `lint` checks only the width of the skill templates, not their size : scripts/doc-checks.mjs
- A reworded end marker, or one split across two lines, makes `doc-checks.mjs` run the list region to the end of its text : scripts/doc-checks.mjs
- An unreadable list file reports `<list>: not found`, not `cannot read` : scripts/doc-checks.mjs
- The `doc-checks.mjs` width check skips `AGENTS.md` : scripts/doc-checks.mjs
- The `doc-checks.mjs` width check skips `docs/caveats/`; it covers only `skills/`, `.claude/agents/`, `docs/DESIGN.md` and `docs/milestones/` : scripts/doc-checks.mjs
- A tightening pass that drops "The" from `- The project agents MUST be these` in `skills/delegate/SKILL.md` fails lint with `delegate agents: not found`, because that line is a doc-checks start marker : scripts/doc-checks.mjs
- `lint` does not check that a `§<name>` reference resolves to a real heading : scripts/doc-checks.mjs
- The `doc-checks.mjs` split RFC keyword check uses the width file set, so it skips `AGENTS.md`, `docs/caveats/` and `docs/tightening.md` : scripts/doc-checks.mjs
