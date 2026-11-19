# Skill best practices: research

Date: 2026-11-17

Scope: Anthropic official guidance and 7 community libraries, for the armory plugin's
skill design.

Limits: ECC complaints are unverified (issue search failed). ComposioHQ was inspected by
file tree only. Anthropic docs pages are undated (read 2026-11-17).

## 1. Anthropic official guidance

All facts in this section are confirmed. Source tags are in section 6.

### Authoring rules

- `name`: 64 characters max. Lowercase letters, digits and hyphens. No XML tags. No
  reserved words ("anthropic", "claude"). [S1]
- `description`: required, 1,024 characters max, no XML tags. [S1]
- Claude Code truncates `description` plus `when_to_use` at 1,536 characters in the skill
  listing. Put the key use case first. [S2]
- Angle brackets in descriptions render as `&lt;` and `&gt;`. Use `[x]` for placeholders.
  [S2]
- Claude Code frontmatter extras: `when_to_use`, `disable-model-invocation`,
  `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`,
  `context: fork`, `agent`, `paths`, `argument-hint`, `metadata`, `compatibility`. [S2]
- The portable Agent Skills spec allows only `name`, `description`, `license`,
  `compatibility`, `metadata`, `allowed-tools`. Other keys fail with "Unexpected key"
  outside Claude Code. [S2]
- A `model` or `allowed-tools` override lasts only for the current turn. [S2]
- A description says what the skill does and when to use it. It is in third person and
  has specific trigger terms. A vague one ("Helps with documents") is an anti-pattern.
  [S1]
- The SKILL.md body stays under 500 lines (about 5k tokens). Detail goes to reference
  files, linked one level deep. A reference file over 100 lines gets a table of
  contents. [S1][S3]
- Three loading levels: [S3]
  1. Metadata (about 100 tokens per skill) is always in context.
  2. The body loads when the skill triggers.
  3. Resources load only when read. Scripts run without their code entering context.
- Default assumption: "Claude is already very smart". Add only what Claude lacks.
  Challenge the token cost of each paragraph. [S1]
- Match degrees of freedom to fragility: exact scripts for fragile operations, text for
  open tasks. Use consistent terminology. Give no time-sensitive information. Use
  forward-slash paths. [S1]
- Use numbered workflows with copyable checklists. For quality-critical steps, use
  validate, fix, repeat feedback loops. [S1]
- Build evaluation first: [S1]
  - Build at least 3 evals before the docs.
  - Take a baseline without the skill.
  - Test on Haiku, Sonnet and Opus.
  - Iterate with one Claude that writes the skill and another that uses it.
- Lifecycle: [S2]
  - An invoked skill's content stays in context for the session. It is not re-read.
    Write standing instructions.
  - After compaction, each skill is re-attached up to its first 5,000 tokens, within a
    25,000-token total, most recent first. Older skills can be dropped.
- The skill listing budget is 1% of the context window. On overflow, the descriptions of
  the least-used skills are dropped first. [S2]

### Anthropic skill repos

- `anthropics/skills` has top-level `skills/`, `spec/` and `template/`. Each skill folder
  holds SKILL.md and optional `scripts/`, `references/`, `assets/`. The docx skill ships
  Python scripts and XSD schemas. [S4][S5]
- Sampled SKILL.md lengths: frontend-design 71, docx 92, webapp-testing 95, mcp-builder
  252, pdf 314, skill-creator 485 lines. All are under 500. [S5]
- skill-creator: [S4]
  - The description is the primary trigger. "When to use" belongs in it, not in the
    body.
  - It recommends slightly "pushy" descriptions, because Claude under-triggers.
  - It explains the why "in lieu of heavy-handed musty MUSTs".
  - Keep the prompt lean. Generalize, do not overfit to test cases. Bundle repeated work
    as scripts.
- Cross-skill references: open. No sampled skill references another.

### Claude Code mechanics

Hooks: [S6]

- `SessionStart` and `SubagentStart` can return `hookSpecificOutput.additionalContext`.
  It is added as a system reminder at conversation start, before the first prompt. For
  `SubagentStart` it lands in the subagent's own context. `SessionStart` plain stdout is
  also context.
- The `SubagentStart` matcher filters by agent type: the frontmatter name, or
  `plugin:agent` for plugin agents. So context can be injected per card. [S6][S7]
- A repeated `SubagentStart` for the same subagent does not re-inject while the earlier
  copy is still present. The prompt cache stays intact. After auto-compaction drops the
  copy, it is injected again.
- `additionalContext` over 10,000 characters is not injected. Claude gets a file path and
  a preview of up to 2,000 characters. Claude is not told to read the file.
- For static instructions, the hooks docs prefer CLAUDE.md, phrased as facts and not as
  imperative system commands. Text framed as an out-of-band system command can trigger
  prompt-injection defenses. Claude then shows it to the user instead of acting.

Subagents: [S7]

- A subagent starts fresh. It has its own system prompt (not Claude Code's), the task
  message, all CLAUDE.md and AGENTS.md levels, a git status snapshot and preloaded
  skills. It has no conversation history, no earlier invoked skills and no auto memory.
  `omitClaudeMd: true` drops CLAUDE.md.
- Subagent frontmatter: `name`, `description`, `tools`, `disallowedTools`, `model`,
  `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`,
  `omitClaudeMd`, `effort`, `isolation`, `color`, `initialPrompt`.
- Plugin agents ignore `hooks`, `mcpServers`, `permissionMode` and `initialPrompt`.
- Custom subagent descriptions cost context. Keep them short. The threshold for all
  combined is 15,000 tokens.

Skills preload: [S7]

- The `skills` field preloads the full text of each listed skill into the subagent at
  startup (up to 32). Other skills can still load later. It is a built-in alternative to
  hook injection.

Listing budgets: [S2]

- Description plus `when_to_use` is cut at 1,536 characters. The listing budget is 1% of
  the context window.

Memory file: [S8]

- Target CLAUDE.md under 200 lines. Longer costs context and lowers adherence.
- Keep only facts needed every session.
- Multi-step procedures and path-specific rules go to skills or to path-scoped rules
  (`.claude/rules/` with `paths:`).
- Contradicting instructions resolve arbitrarily.

Compaction: [S2][S6]

- Skills are re-attached after compaction within the limits under "Authoring rules"
  ([S2]).
- A `SubagentStart` injection is repeated after compaction drops it ([S6]).

### Multi-agent guidance

- Each subagent brief needs an objective, an output format, tool and source guidance, and
  clear task boundaries. Without them, agents duplicate work or leave gaps. [S9]
- Scale effort: one agent with 3 to 10 tool calls for simple fact-finding; 2 to 4
  subagents for comparisons. Multi-agent uses about 15 times the tokens of chat. [S9]
- Subagents can write output to the filesystem and return lightweight references. This
  avoids a "game of telephone". [S9]
- For Opus 4.5 and 4.6, Anthropic says to soften aggressive wording ("CRITICAL: You
  MUST...") to "Use X when...". These models follow system prompts closely and can
  over-trigger. [S10]

## 2. Community libraries

Stars were read on 2026-11-17 with `gh api` (confirmed). Six libraries were read from
shallow clones.

### obra/superpowers

- Stars: 318,964. Commit 2026-11-03.
- Structure: 15 skills, 65 to 399 lines, median about 205. A skill folder holds SKILL.md
  and prompt files (`implementer-prompt.md`, `code-reviewer.md`), `references/`,
  `scripts/`. No `agents/` or `commands/`. Subagent prompts live inside skills.
- Frontmatter: only `name` and `description`. Descriptions are "Use when..." trigger
  lists. `writing-skills` forbids a workflow summary in a description. An agent that
  reads a summary follows it instead of reading the skill.
- Hook: `SessionStart` only (matcher `startup|clear|compact`). No `SubagentStart`. It
  injects the whole router skill `using-superpowers` (3,192 bytes) inside
  `<EXTREMELY_IMPORTANT>`.
- Router: it opens with `<SUBAGENT-STOP>` ("If you were dispatched as a subagent...
  ignore this skill"). Rule: "1% chance a skill applies, MUST invoke". Process skills
  come before implementation skills.
- Subagent return: the implementer prompt writes the full report to a file and returns 15
  lines or fewer: Status (`DONE`, `DONE_WITH_CONCERNS`, `BLOCKED` or `NEEDS_CONTEXT`),
  SHAs, a one-line test summary, concerns and the report path. The controller does the
  review. The implementer must not.
- Approach: `writing-skills` is TDD for skills. Run a baseline pressure scenario with a
  subagent before writing, then close loopholes. Failure-type table:
  - discipline failure: prohibition plus rationalization table;
  - wrong output shape: positive recipe ("prohibitions backfire" in their wording
    tests);
  - missing element: required template slot.
  - Also: "no nuance clauses", "exemption clauses don't scope".
- Testing: `tests/` has per-harness shell tests and `analyze-token-usage.py`.
- Complaints (likely): #743 slowness, #2530 annoying brainstorm questions, #1120 review
  overhead on easy tasks, #895 plans over-specify.

### mattpocock/skills

- Stars: 326,396. Commit 2026-11-12.
- Structure: 39 SKILL.md in buckets (`engineering/`, `productivity/`, `misc/` frozen,
  `in-progress/`). Length 7 to 170 lines. `grill-with-docs` is 7 lines and only composes
  two skills.
- Invocation: 16 of 27 promoted skills set `disable-model-invocation: true`. For Codex:
  `agents/openai.yaml` with `allow_implicit_invocation: false`.
- Approach: no hooks, no session injection. The human is the router. The per-skill docs
  pages "are collectively a distributed router".
- `SCOPE.md` keeps an issue only with an "observed failure" from a real session. New
  skills are closed. `.out-of-scope/*.md` records each rejected idea. Example:
  `subagent-recursion.md` says no recursion guards in skill prose; the harness owns it.
- `writing-for-agents`: "one trigger per branch" (collapse synonyms); context load versus
  cognitive load; every step gets a clear completion criterion; split skills by sequence
  so later steps do not cause premature completion.
- Testing: no `evals/` or `tests/`.
- Complaints: none recorded in the research.

### affaan-m/everything-claude-code (ECC)

- Stars: 305,014. Commit 2026-11-17.
- Structure: 327 top-level skills (median about 190, max 950), 72 agents, commands,
  `rules/common` (10 files, 571 lines) and about 20 language rule sets. Install picks
  common plus the chosen languages.
- Frontmatter adds `argument-hint` and `metadata.origin`.
- Hooks: 28 hooks over 8 events, including `SessionStart` x2 and `Stop` x8.
  `SessionStart` loads prior context. It is capped by `ECC_SESSION_START_MAX_CHARS`
  (default 8,000) and has an off switch.
- Complaints: weak spot (likely) is that it is broad, heavy and overlapping. Complaints
  are unverified (issue search failed).

### gsd-build/get-shit-done (GSD)

- Stars: 64,129. Last push 2026-05-31.
- Structure: commands, not SKILL.md. 67 thin `commands/gsd/*.md` (median 41 lines), each
  pointing to `get-shit-done/workflows/*.md` (88 files, median 278 lines, max 1,802).
  33 agents (up to 1,452 lines).
- Frontmatter: `allowed-tools`, `argument-hint`, custom `requires:`.
- Hooks: 13 (context monitor, read guard, workflow guard, prompt-injection scanner).
- Complaint (confirmed): #2790 consolidate 86 `gsd-*` skills to about 58 (sprawl).

### wshobson/agents

- Stars: 42,604. Commit 2026-11-08.
- Structure: 92 plugins, each with `agents/`, `commands/`, `skills/`. 185 skills (median
  151, max 810). 202 agent files with `model:`.
- Descriptions: "...Use when..."; agent descriptions "Use PROACTIVELY".
- `docs/authoring.md`: AGENTS.md or CLAUDE.md under about 150 lines (about 500 tokens).
  SKILL.md is navigation plus quick-start, with deep material in `references/`. "Enforce
  invariants, not implementation" via plugin-eval.
- Testing: `evals/` holds a static score snapshot keyed by the sha256 of each skill.
  LLM-judge evals are marked unvalidated. Trace-based error analysis is in progress.

### alirezarezvani/claude-skills

- Stars: 29,950. Commit 2026-11-17.
- Structure: 495 skills (median 154, max 683). `SKILL-AUTHORING-STANDARD.md` lists 10
  patterns, including context-first, multi-mode, a "Related Skills" disambiguation
  section, reference separation, proactive triggers and output artifacts.
- Hook: `UserPromptSubmit` `skill_router.py` matches the prompt against
  `skill_routes.json`. On a match it adds one hint line, at most once per skill per
  session. It fails open and has an env off switch.

### ComposioHQ/awesome-claude-skills

- Stars: 79,696. Inspected 2026-11-17 by file tree only.
- It is an awesome-list that ships SKILL.md files. Most are generated
  `composio-skills/*-automation`.

## 3. Cross-library comparison

### Common patterns (3 or more libraries)

- "Use when..." descriptions: superpowers, wshobson, alirezarezvani, ECC.
- SKILL.md entry plus `references/` or sibling files: superpowers, wshobson,
  alirezarezvani, ECC, GSD.
- Median length about 150 to 200 lines: superpowers, ECC, wshobson, alirezarezvani.
  mattpocock is smaller.
- `SessionStart` injection in 3 of 6: superpowers (about 3 KB router), ECC (capped at
  8,000 chars), GSD (session state, content unverified). None inject at `SubagentStart`.
- Subagent prompts as template files beside the dispatching skill: superpowers, GSD
  agents, mattpocock `agents/`.

### Unique ideas

- superpowers: `<SUBAGENT-STOP>` guard; 15-line status-code return with the report in a
  file; pressure-test TDD for skills; failure-type to guidance-form table.
- mattpocock: user-only invocation for most skills; observed-failure bar;
  `.out-of-scope/` log; limits owned by the harness.
- ECC: configurable cap and off switch on `SessionStart` context.
- alirezarezvani: prompt-time router hints instead of an always-on router.
- wshobson: hash-keyed static score snapshot as a regression gate.

### Anti-patterns

- Catalogue sprawl: ECC, alirezarezvani, wshobson, Composio. GSD #2790 is a
  consolidation.
- Workflow files over 1,000 lines (GSD).
- All-caps coercion ("EXTREMELY_IMPORTANT", "1% chance"), with reported slowness and
  over-triggering (superpowers #743, #2530).
- Unvalidated LLM-judge evals (wshobson flags it).

## 4. Where sources disagree

- RFC 2119 MUST wording: S4 and S10 advise against heavy MUSTs and recommend explaining
  why. S1 is silent. The researcher trusts S10 (newest, model-specific). The armory rule
  "every rule MUST carry one RFC 2119 word" runs against it.
- Description style: S1 is neutral third person. S4 is "pushy". The over-trigger note in
  S10 favors S1 for current models.
- Hook-injected rules: S6 prefers CLAUDE.md for static rules written as facts. The armory
  injects static imperative rules by hook. This is not forbidden, but S6 names a
  prompt-injection risk.

## 5. Checklist for the armory

1. SKILL.md body under 500 lines (about 5k tokens). [S1][S3]
2. `name` and `description` within spec limits; `description` plus `when_to_use` under
   1,536 characters. [S1][S2]
3. No `<placeholder>` in descriptions; use `[x]`. [S2]
4. Non-spec frontmatter keys (armory `max-lines`) are a portability risk; `metadata` is
   the spec place. [S2]
5. Injected core stays under 10,000 characters per hook output; each half under option C
   too. Core SKILL.md is 9,850 bytes now, near the cap. [S6]
6. Option C could use `SubagentStart` matchers per agent type, or the card `skills:`
   field. [S6][S7]
7. Hook-injected rules are phrased as facts. [S6]
8. Always-on text holds only rules needed every session. [S8]
9. Always-on injection is measured and small (superpowers about 3 KB, ECC cap 8,000).
   [superpowers][ECC]
10. Each rule earns its tokens. [S1]
11. Heavy MUST wording is reviewed against the Opus 4.5 and 4.6 over-trigger guidance.
    [S10][S4]
12. Each brief names objective, output format, tools or sources, and boundaries. [S9]
13. Skills hold standing instructions; key rules sit in a skill's first 5,000 tokens for
    compaction. [S2]
14. Reference files are one level deep, with a table of contents over 100 lines. [S1]
15. At least 3 evals per skill, with a no-skill baseline, on Haiku, Sonnet and Opus. [S1]
16. Card templates use only fields that plugin agents honor. [S7]
17. Subagents skip main-session-only rules (superpowers `SUBAGENT-STOP`; supports option
    C). [superpowers]
18. Descriptions hold triggers only, no workflow summary. [superpowers]
19. One trigger per distinct case (the armory already has it). [mattpocock]
20. A wrong-output-shape failure gets a positive recipe or a template slot, not a MUST
    NOT list. [superpowers]
21. No nuance or exemption clauses inside rules. [superpowers]
22. A subagent returns a short status code plus a pointer, with detail in a file. [S9]
    [superpowers]
23. Each skill edit is backed by a baseline pressure test or an observed real failure.
    [superpowers][mattpocock]
24. A skill is user-only where auto-invocation adds no value (mattpocock 16 of 27).
    [mattpocock]
25. Composition-only skills are tiny or dropped. [mattpocock]
26. Recursion and tool limits go to the harness or card, not prose. [mattpocock]
27. Rejected ideas are logged (mattpocock `.out-of-scope/`). [mattpocock]
28. The project context file stays under about 150 lines (about 500 tokens). [wshobson]
29. The skill count stays low; overlaps are merged. [GSD][ECC][alirezarezvani]
30. Structural invariants are enforced mechanically: lint or a hash snapshot. [wshobson]

## 6. Sources

Anthropic (read 2026-11-17; docs pages undated):

- [S1] https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices
- [S2] https://code.claude.com/docs/en/skills
- [S3] https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview
- [S4] https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md (main)
- [S5] https://github.com/anthropics/skills (main, 64 commits)
- [S6] https://code.claude.com/docs/en/hooks
- [S7] https://code.claude.com/docs/en/sub-agents
- [S8] https://code.claude.com/docs/en/memory
- [S9] https://www.anthropic.com/engineering/multi-agent-research-system (2025-06-13)
- [S10] https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices

Libraries (stars read 2026-11-17):

- superpowers: https://github.com/obra/superpowers (commit 2026-11-03). Files:
  `hooks/hooks.json`, `hooks/session-start`, `skills/using-superpowers/SKILL.md`,
  `skills/writing-skills/SKILL.md:95-98,250-265`,
  `skills/subagent-driven-development/implementer-prompt.md:128-150`. Issues #743, #895,
  #1120, #2530.
- mattpocock: https://github.com/mattpocock/skills (commit 2026-11-12). Files:
  `SCOPE.md`, `.out-of-scope/subagent-recursion.md`,
  `.out-of-scope/lazy-load-writing-for-agents.md`, `.agents/writing-docs.md`,
  `skills/productivity/writing-for-agents/SKILL.md`.
- ECC: https://github.com/affaan-m/everything-claude-code (commit 2026-11-17). Files:
  `hooks/hooks.json`, `hooks/README.md:140-147`, `rules/README.md`.
- GSD: https://github.com/gsd-build/get-shit-done (push 2026-05-31). Files:
  `commands/gsd/plan-phase.md`, `hooks/`. Issue #2790.
- wshobson: https://github.com/wshobson/agents (commit 2026-11-08). Files:
  `docs/authoring.md:10-20,191-200`, `evals/README.md`.
- alirezarezvani: https://github.com/alirezarezvani/claude-skills (commit 2026-11-17).
  Files: `SKILL-AUTHORING-STANDARD.md`, `engineering/hooks/hooks.json`.
- ComposioHQ: https://github.com/ComposioHQ/awesome-claude-skills (2026-11-17; file tree
  only).
