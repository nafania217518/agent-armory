# Caveats: skill references

Format: the caveat line of the armory `core` skill, section Reports.

- `dnd` cites `code` §4 steps by number, so a step renumber breaks it with no lint error : skills/code/SKILL.md
- `audit` cites `review` §1 by bullet position ("first bullet"), so a new bullet above it changes what audit inherits : skills/audit/SKILL.md
- `delegate` §4 cites its own rows 7 and 8 for a researcher brief with an open point, by number, so a row renumber breaks them with no lint error : skills/delegate/SKILL.md
- `dnd` §2 cites basis 1 of the 3-step `research` §1 ladder and adds its own basis 3 and 4 on top of it, so a change to that ladder breaks the `dnd` basis numbers with no lint error : skills/research/SKILL.md
- `plan` and `triage` name `tracking` rules by rule name ("AI marker line"), some with no section, so a § search misses them : skills/plan/SKILL.md
- `review` §3 Shape ("an `implement` or `craft` MUST") and §5 ("a `test` or `craft` rule breach") name a skill's rules in general, so a rule move out of those skills changes them with no `lint` report : skills/review/SKILL.md
- Every rule reference in a skill, card or skill template names its section by number, and skill-graph checks only that the heading exists, so an inserted, removed or moved section retargets each cite of a later section with no `lint` report : scripts/skill-graph.mjs
- `docs/DESIGN.md` and the milestone docs' Tasks format lines cite `tracking` sections by number, and skill-graph does not read them, so a `tracking` renumber leaves them stale with no `lint` report : skills/tracking/SKILL.md
- `tracking` §4 (the behind-`<base>` check) uses `<base>`, which `workflow` §2 defines, but `tracking` does not extend `workflow` : skills/tracking/SKILL.md
- Root `AGENTS.md` cites `core` section Host terms and `test` section Levels by name, and skill-graph does not read it, so a rename of either section breaks the cite with no `lint` report : AGENTS.md
- `workflow` §4 and `delegate` §1 name `code` §4 step 8 by rule name only ("task-end cleanup"), so a rename of that step breaks them with no `lint` report : skills/workflow/SKILL.md
- `delegate` §4 cites its own row 2 by number in the fix-round bullet, so renumbering the rows breaks it with no `lint` error : skills/delegate/SKILL.md
- skill-graph checks a `§n` that does not follow a backticked skill name against the citing skill's own sections, so a plain-text cite such as "the research skill §2" passes `lint` with a wrong number, and a bare `§Name` gets a `section` report : scripts/skill-graph.mjs
- setup §4.2 (row 7) and plan §5 (row 6) and §6 (row 7) cite delegate §4 rows by number, so a row renumber leaves them stale with no lint report : skills/delegate/SKILL.md
- `delegate` §2 cites its own first bullet by position ("first bullet"), so a new bullet above it retargets the cite : skills/delegate/SKILL.md
- `plan-draft` §1 names the four-Risks-lines bullet of `requirements` §2 by rule name only, so a § search misses it : skills/plan-draft/SKILL.md
- `dnd` §2 names the skip option, the "Other" option, the item questions (first ask and re-ask), the loop-bound tie of an item's tries and the addendum of `code` §4 step 7 in words, so a rename of any of them in step 7 breaks `dnd` with no lint report : skills/code/SKILL.md
