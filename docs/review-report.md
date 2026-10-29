# Review of the built skills against their sources (2026-10-29)

Status: all 36 findings and D1–D3 applied on 2026-10-29. Line numbers below refer to the
files as first built, before the fixes.

## 1. Coverage summary

| Source | Rules | Covered | Partial | Missing | Dropped by design |
|---|---|---|---|---|---|
| `~/.claude/CLAUDE.md` | 9 | 5 | 3 | 0 | 1 (mcp-browser rule, as asked) |
| `local-rag/CLAUDE.md` | 13 | 11 | 1 | 0 | 1 (SOLID) |
| ponytail `SKILL.md` | 18 | 14 | 2 | 1 | 1 (levels) |
| ponytail-review | 6 | 5 | 1 | 0 | 0 |
| ponytail-audit | 6 | 4 | 2 | 0 | 0 |
| ponytail-debt | 10 | 5 | 1 | 0 | 4 (own skill, custom marker word, git blame owner, persist to file) |
| ub-mode | 31 | 18 | 4 | 7 | 2 (tool names, push to main) |
| maihem-cli ideas | 5 | 4 | 1 | 0 | 0 |
| User requirements | 10 | 7 | 3 | 0 | 0 |

### Partial or missing, by source

`~/.claude/CLAUDE.md`
- Base rules 6 and 7 (no premature optimization, Occam) carry no RFC 2119 word.
- "Skills point to the global file": only `init-project` reads it.

`local-rag/CLAUDE.md`
- Rule 7: "tests are the only proof" and the per-surface mapping (frontend: unit or
  browser; backend: unit or integration) are not in `code`.

ponytail `SKILL.md`
- "Check what the change could break for users: data destroyed or exposed, callers that
  stop working" is not in `code` §2.
- "Lazy about the solution, never about the change: finish every caller, test and
  fixture the change breaks" has no explicit line.
- "The shortest working diff wins, once you know everything it must touch" is missing.

ponytail-review
- Lean/split: "never into helpers that exist only to make a function shorter" dropped.

ponytail-audit
- Audit-only bug items: "callers that disagree with what a function returns", "the same
  rule applied differently in two places".
- Audit-only lean items: two helpers doing one job, factory with one product,
  pass-through wrapper, unused flags and config.

ponytail-debt
- Rows grouped by file.

ub-mode, missing
- "Do first whatever helps every later phase."
- "Attack the premise" (two failed fixes on one premise: write it down, remove it).
- "Outcome-oriented execution" (aim at a checkable end state; a planned, undoable break
  in the middle is allowed).
- "Build the lever" (work not obvious at a glance: do one unit by hand, then build the
  tool that does the rest).
- Glossary of domain terms.
- Refactoring: pin behavior with a test, change structure, prove behavior unchanged.
- Worktree cleanup.

ub-mode, partial
- Work → Right → Practice framing not kept (content is).
- "Leave clear local code alone": only as "keep the structure".
- CRAP and mutation ideas: dropped without a note in DESIGN.
- Commit message "how you proved it": dropped from the commit rule.

maihem-cli
- Requirement ids: no format, no place where they live.

User requirements
- RFC 2119 words: many rules lack one; one SHOULD has no gate.
- Lint and OWASP: lint becomes MUST per commit even when the gate is off.
- Model table: no agent per row.

## 2. Findings, triaged

Accept = will fix. Decide = your call. Reject = keep as is, with the reason.

| # | Finding | Triage |
|---|---|---|
| 1 | `code` §7 "Coding SHOULD go to the project agents" has no gate, so a project cannot turn it off as §0 promises | Accept: add `delegate` gate |
| 2 | Many rules carry no RFC 2119 word (code §2, §3, §8, §9, §12; review; coder.md; base rules 6, 7) | Accept for rules; descriptive steps stay plain |
| 3 | Lint and unit are MUST per commit but SHOULD gates | Accept: "when `on`, MUST pass" |
| 4 | Model table names no agent; "Routine lookup" row has none | Accept: add `Agent` column |
| 5 | `origin/master` hard-coded; fails on `main` | Accept: `origin/HEAD` |
| 6 | Fable session with no `.claude/agents/` gets "MUST delegate" and "do it yourself" | Accept: spawn a general agent with model and effort from the table |
| 7 | Requirement ids have no format and no home | Accept: `R<n>` prefix; the test name carries it; the report lists them |
| 8 | Gate names vs command names: `audit:` vs `owasp`; `run` is not a gate; `worktree-per-agent` has no command, so every review flags it | Accept: rename to `owasp:`; state the two exceptions once in the template |
| 9 | Coverage default stated three times; nothing checks the command has a fail-under | Accept: template only; init-project checks for a fail-under value |
| 10 | OWASP Top 10 text in `code` and `review` word for word | Accept: keep in `review`, reference from `code` |
| 11 | `none <why>` in Commands and `off <reason>` in Gates overlap | Accept: drop `none`; a missing command means the gate is `off <reason>` |
| 12 | Refactor has no failing test; TDD step cannot apply | Accept: one line, pin, change, prove |
| 13 | Review: untested change is MUST in §2 but Should fix in §3 | Accept: make §2 point at §3.4 |
| 14 | "Concurrent writer" rule stated twice in `code` | Accept: delete the §2 copy |
| 15 | "Two writers MUST NOT touch the same files" reads as the `writer` agent | Accept: "two agents that run at once" |
| 16 | Coder commits in its worktree; no step merges them into the task branch | Accept: add a merge step to §7 |
| 17 | Worktree cleanup missing | Accept: one line in §12 |
| 18 | Commit approval line is unclear and not in DESIGN | Accept: delete; "MUST NOT push" stays |
| 19 | "git log MUST read as history" cannot be checked | Accept: make it the reason for the subject rule |
| 20 | `audit` points at `review` sections that are not loaded when audit runs | Accept: load the `review` skill first; add the audit-only items |
| 21 | `review` and `audit` never check the model table | Accept: one line each |
| 22 | `audit` runs `owasp` even when the gate is off | Accept |
| 23 | Base-rule match is literal; global file has no RFC words, so all seven get copied | Accept: "same rule in any wording" |
| 24 | `{{NAME}}` never derived; `{{PROJECT_RULES}}` never asked for | Accept: folder name default; add question 5 |
| 25 | `reviewer` agent preloads `armory:review`; plain install names it `review` | Accept: drop the `skills:` field; the role card loads the skill by name |
| 26 | Declared RFC words differ from the words used | Accept: one fixed declaration line |
| 27 | Same text in several places with different wording: Fable rule, SHOULD meaning, STE in writer.md, web-search ban in researcher.md, tech-debt format | Accept, except the web-search ban: subagents load the global file, so researcher.md references rule 3 instead of repeating it |
| 28 | coder.md repeats the ladder and rules with gaps; the brief sends them again | Accept: coder.md keeps the report format only; the brief carries the rules |
| 29 | Lowercase "may" in a restriction | Accept |
| 30 | "never by line count" | Accept |
| 31 | Persona prose in review and audit | Accept: delete the clause |
| 32 | Three sentences over 25 words | Accept |
| 33 | No step runs `reviewer`; "commit bodies → writer" conflicts with coder committing | Accept: SHOULD run reviewer before the report; drop "commit bodies" from the writer row |
| 34 | Skills say five things DESIGN does not | Accept: sync DESIGN |
| 35 | DESIGN: stale status line, SHOULD/MUST conflict in 7.1 step 5, verification 2 expects outputs the skills do not have | Accept |
| 36 | README is a table, DESIGN said paragraphs; symlink example covers one skill | Accept: edit DESIGN; add a loop |

### Decide

- D1. Add the ub-mode items that are missing? Proposed: add refactoring (12), cleanup
  (17), "how proved" as an optional commit body line, and "build the lever" as one line
  in §2. Mark "attack the premise", "outcome-oriented execution", "do first what helps
  every phase" and the glossary as dropped in DESIGN. Or add all.
- D2. Add local-rag rule 7's per-surface test mapping (frontend unit or browser,
  backend unit or integration) to `code` §5, or leave it to each project's `## Commands`.
- D3. Ponytail "check what the change could break for users" and "shortest working
  diff wins": add both to `code` §2 and §3 (two lines).

### Reject

- None. Every finding has a concrete case.

## 3. Checks run

- `claude plugin validate .`: passed.
- Sizes: code 147, review 104, audit 76, init-project 53 lines; all within DESIGN §6.
- Not verified: the agent frontmatter fields `effort`, `isolation`, `skills` and the
  `fable` model alias on a real agent load. The sub-agents documentation lists all four.
