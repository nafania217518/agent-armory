# Adoption index

Candidates for the armory from the 8 repos named in `docs/research/skills-best-practices.md`,
plus the dev, devops, design, debugging and research skills that ComposioHQ/awesome-claude-skills
links to (21 linked repos cloned). Surveyed 2026-11-18 from shallow clones; every draft names its
sources with commit and licence. Drafts are in our own words; GPL-3.0 and "All Rights Reserved"
sources give ideas only. Status: the 57 improvement drafts for armory skills were adopted or dropped on
2026-11-20 and their files removed; their outcomes are in git history at commit d75cb91b.
Every other draft is not adopted. Added
2026-11-20 from shallow clones: multica-ai/andrej-karpathy-skills (MIT, @2c60614, one
draft), Leonxlnx/taste-skill (MIT, @f6b7657, two drafts), pbakaus/impeccable (Apache-2.0,
@b49177d, two drafts) and ChiefGyk3D/department-of-internal-arguments (Apache-2.0, @a9d4347,
three drafts and two source additions).

Where one idea appeared in several repos, it got one draft that credits every source. Where two
drafts propose the same change, one holds it and the other points to it.

## Before adopting

- Every proposed rule carries `Evidence needed:` unless a failure is already shown.
- Each skill but `core` and `core-main` sits at its `max-lines` cap, so each adopted line
  needs a cut or a higher cap.
- The main hook payload (`core` plus `core-main`) is 9,534 of the host's 10,000 characters, so
  a draft that touches `core` targets another skill when it can.
- `ai-evals` depends on `skill-eval`; `design-qa-taste-skill` and `design-qa-impeccable`
  depend on `design-qa`; `ui-design-impeccable` depends on `ui-design`;
  `writing-check-taste-skill` depends on `writing-check`; `threat-model-doia` depends on
  `threat-model`.
- Open item: wizard decision 3 needs a per-CLI check (reads value on stdin, overwrites on
  re-run).

## New skills

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [skill-authoring](skill-authoring.md) | Test-first rule writing: show failure, pick form by failure type, smallest rule, close loopholes | Steps to get an observed failure or measured gain for each new rule | Overlaps tightening.md and best-practices checklist; baseline runs cost tokens | high |
| [skill-eval](skill-eval.md) | Behavior evals of skills and prompts: failure buckets, two arms, script graders, trials, verdict | Measures behavior, not only load and skip; defines when a gain is real, not noise | Token cost per case, arm and trial; numeric defaults unmeasured | high |
| [release](release.md) | Version bump from impact, changelog, evidence go/no-go, staged rollout, hotfix | Covers versioning, changelog, go/no-go and rollback; armory stops at code §Finish today | Rollout only for deployed projects; overlaps code §Finish merge step | high |
| [design-qa](design-qa.md) | Checks built UI: inert controls, missing states, contract drift, rendered WCAG 2.2 AA | Reviewer gets a rendered-UI check; armory has none today | Needs headless browser; UI only; screen-reader pass stays manual | medium-high |
| [writing-check](writing-check.md) | Check pass over prose for machine-prose marks; fixes only cut or sharpen | Checkable pass after writing; backs writer's no-invented-facts rule | Source conflicts with STE (rhythm check dropped); overlaps core §Writing | medium |
| [handoff](handoff.md) | Pointer note to pause and resume, progress ledger, re-anchor of skill and plan after compaction | Resume path outside triage; files and git win over memory after compaction | Needs a core pointer line near core's size cap; SSOT risk if note copies | medium |
| [ui-design](ui-design.md) | UI contract before frontend code: direction, tokens, type, color, contrast, states, copy | Plan gets a checkable UI contract to write TRs from; design-qa gets its standard | Overlaps host frontend design skill; frontend only; new contract docs file | medium |
| [migrate](migrate.md) | Major dependency upgrades and schema migrations: one major per step, expand-contract, rollback | An upgrade and migration flow beyond implement's idempotence rule | Partial overlap with plan expand-contract; only for deps or databases | medium |
| [threat-model](threat-model.md) | STRIDE per trust-boundary element at plan time; threat Risks lines; review verdict | Design-time security; today armory checks security only after code exists | Heavy for small tasks; adds pointers to the longest skill | medium |
| [prototype](prototype.md) | Throwaway branch answers one design or feasibility question; verdict feeds plan | A sanctioned working basis for plan options before approval | Needs plan's no-code rule changed; YAGNI creep risk | medium |
| [incident](incident.md) | Live incident: severity, mitigate first, verify on user flow, timeline, postmortem | Stop-the-harm path debug lacks; incident becomes tracked actions | Ops-heavy; production projects only; rubric thresholds unmeasured | medium |
| [reflect](reflect.md) | User-started mid-run step back: drift, gaps, bias with turn evidence, one verdict | Direction check mid-run; retro only looks back at session end | No measured need; source's prose-only output clashes with core reply shape | medium-low |
| [wizard](wizard.md) | Coder-built bash script walks user through dashboard, secret and cutover steps | Path for setup steps only the user can do, with static checks | Niche; needs its own shell library (spec drafted, code not written) | low |
| [ai-evals](ai-evals.md) | Plans and audits evals for LLM features: failure modes, rubrics, dataset, coverage | Covers non-deterministic model output that test levels cannot | Only for LLM-feature projects; depends on skill-eval | low |

## Improvements to drafts

### design-qa

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [design-qa-taste-skill-improvement](design-qa-taste-skill-improvement.md) | Adds fake-send, invented-proof and checker-detection findings; reduced-motion, pause, overlap and error-text rendered checks | Catches UI faults that look done and pass the draft's checks today | Waits on design-qa; 8 more lines; source is marketing-site taste, most dropped | medium |
| [design-qa-impeccable-improvement](design-qa-impeccable-improvement.md) | Valid captures first; a clean scan passes only what it covers; drag and touch checks; fixed only on a new capture | No pass from a blank capture or an empty scan; adds WCAG 2.2 SC 2.5.7 to the AA list | Waits on design-qa; touch check needs a browser that synthesizes touch | medium |

### threat-model

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [threat-model-doia-improvement](threat-model-doia-improvement.md) | Ranks register threats by exploit prerequisite first | A moderate threat anyone can reach ranks above a severe one behind a credential | Waits on threat-model; orders lines, adds no control | low |

### ui-design

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [ui-design-impeccable-improvement](ui-design-impeccable-improvement.md) | Contract in the open DESIGN.md format with its linter; refinement or redesign; content ranges; one fix per hard-coded value | Tool-readable contract and one token source next to DESIGN.md tools; lint checks references and contrast | Format is alpha; name clash with `<docs>/DESIGN.md`; Node-only linter; waits on ui-design | medium |

### writing-check

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [writing-check-taste-skill-improvement](writing-check-taste-skill-improvement.md) | Adds invented specifics, contrast-frame substitutes, virtue words and a swap test to the marks | Catches second-generation marks that survive word lists | Waits on writing-check; web-copy source; marks change with each model | low-medium |
