# Adoption index

Candidates for the armory from the 8 repos named in `docs/research/skills-best-practices.md`,
plus the dev, devops, design, debugging and research skills that ComposioHQ/awesome-claude-skills
links to (21 linked repos cloned). Surveyed 2026-11-18 from shallow clones; every draft names its
sources with commit and licence. Drafts are in our own words; GPL-3.0 and "All Rights Reserved"
sources give ideas only. Status of every draft: not adopted. Added 2026-11-20 from shallow
clones: multica-ai/andrej-karpathy-skills (MIT, @2c60614, one draft), Leonxlnx/taste-skill
(MIT, @f6b7657, two drafts), pbakaus/impeccable (Apache-2.0, @b49177d, two drafts) and
ChiefGyk3D/department-of-internal-arguments (Apache-2.0, @a9d4347, three drafts and two
source additions).

Where one idea appeared in several repos, it got one draft that credits every source. Where two
drafts propose the same change, one holds it and the other points to it.

## Before adopting

- Every proposed rule carries `Evidence needed:` unless a failure is already shown. AGENTS.md
  asks an observed failure or measured gain for each new or tightened rule.
- Most target skills sit at their `max-lines` cap (code, delegate, debug, test, review, audit,
  implement, plan, research, triage, retro). Each adopted line needs a cut or a higher cap.
- `core` is at about 9,850 characters, near the host's 10,000-character hook context limit, so
  drafts that touch `core` target other skills instead.
- `docs/DESIGN.md` decisions of 2026-11-02 dropped a push guard hook; both setup guard drafts
  must answer that first.
- `ai-evals` depends on `skill-eval`; `code-superpowers` depends on `code-cek` §Outside review;
  `design-qa-taste-skill` and `design-qa-impeccable` depend on `design-qa`;
  `ui-design-impeccable` depends on `ui-design`; `writing-check-taste-skill` depends on
  `writing-check`; `threat-model-doia` depends on `threat-model`.
- Verified trap: `implement` §Gates per commit trims gate output with `tail` or `grep`, which
  can hide a failing exit code or fake one (`implement-rezvani-improvement`).
- Open items: SessionStart (compact) output survival in context (`handoff`, `core-wshobson`;
  manual probe in both drafts); wizard decision 3 needs a per-CLI check (reads value on stdin,
  overwrites on re-run).

## New skills

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [skill-authoring](skill-authoring.md) | Test-first rule writing: show failure, pick form by failure type, smallest rule, close loopholes | Steps to get the observed failure or measured gain that AGENTS.md asks for each new rule | Overlaps tightening.md and best-practices checklist; baseline runs cost tokens | high |
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

## Improvements to armory skills

### audit

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [audit-gsd-improvement](audit-gsd-improvement.md) | Checks README and docs claims (paths, commands, endpoints, functions, dependencies) against the tree. | Finds dead paths and removed scripts in docs that no check covers today. | Heuristic detection needs a skip list; more reads per audit. | medium |
| [audit-rezvani-improvement](audit-rezvani-improvement.md) | New audit target: static scan of an untrusted skill or plugin before install. | Install verdict for agent instructions and scripts from outside the repo. | Pattern lists go stale; static only; about 16 more lines. | medium |
| [audit-wshobson-improvement](audit-wshobson-improvement.md) | Tests caveat drift by history range from the blame commit, not by date. | One command per entry, immune to rebase dates; a script could run it. | Swaps method only; header, grounding and archive parts dropped. | low |
| [audit-mattpocock-improvement](audit-mattpocock-improvement.md) | Adds Shallow Module smell; audit skips findings a recorded design decision rules out. | Catches thin-module clusters Lean misses; stops re-proposing rejected designs. | Judgment call; can clash with Lean split; also hits every review. | low |

### code

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [code-cek-improvement](code-cek-improvement.md) | Outside PR feedback flow: load, check, fix, resolve; caveat freshness | Loop for PR comments after Finish; resolves only met threads; re-checks stale caveats | New forge host-term verbs and setup binding; GitHub only checked | high |
| [code-wshobson-improvement](code-wshobson-improvement.md) | Undoes a merged plan item or task by listed revert commits | Safe "drop task 3" path: user sees the list, no history rewrite, stop on conflict | code at max-lines; trailer touches implement | medium |
| [code-superpowers-improvement](code-superpowers-improvement.md) | Caller search and in-thread replies for PR feedback; finish safety rules | Gates on merged result, no forced worktree removal, no force push after rejected push | Depends on code-cek §Outside review; code at max-lines | medium |
| [core-wshobson-improvement](core-wshobson-improvement.md) | After a compaction, re-load `code` and re-read plan file before next step | Keeps a code run on its plan and rules after context loss | core near 10,000-char hook limit, so targets code; hook restores core, context survival unconfirmed | low-medium |
| [code-ecc-improvement](code-ecc-improvement.md) | Opt-in second independent reviewer for high-risk TRs | Breaks one reviewer's blind spot on auth, data, secrets; report counts disagreement | Doubles review cost; gain over Fable question unmeasured | low |
| [code-gsd-improvement](code-gsd-improvement.md) | Guided acceptance: one by-hand item per question, plus cold-start item | Catches fresh-start bugs; user failure reports flow into the fix loop | More question turns; code at max-lines | low |

### debug

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [debug-wshobson-improvement](debug-wshobson-improvement.md) | Seeds hypotheses from six failure categories; adds inconclusive and compound-cause outcomes | Wider hypothesis list, no anchoring; honest probe verdicts; two-part causes fixed fully | Parallel-debugger option costs spawns; debug at max-lines cap | medium-high |
| [debug-gsd-improvement](debug-gsd-improvement.md) | Refuted hypotheses carry their disproof; a re-spawned debugger skips them | No re-test of dead ends after a re-spawn | Edits debugger card; needs a delegate re-spawn bullet too | medium |
| [debug-rezvani-improvement](debug-rezvani-improvement.md) | Checks intent before inverting behavior; classifies flaky failures; repeat-run done check | Stops fixes of deliberate behavior; flaky loops run in the right setting | Cascade rule overlaps implement two-failed-fixes rule | medium |
| [debug-claude-code-tips-improvement](debug-claude-code-tips-improvement.md) | CI failure steps: real failing step, job history, breaking commit, existing fix | CI history as a free first loop and bisection; no duplicate fixes | All Rights Reserved: ideas only; CI-centric | medium |
| [debug-superpowers-improvement](debug-superpowers-improvement.md) | Recent changes and working twin as hypothesis sources; boundary sweep; backward value trace | Cheapest hypothesis sources; diagnosis names the origin, not the symptom site | Mostly overlaps debug §2–5; defense-in-depth and no-root-cause dropped | low |
| [test-playwright-skill-improvement](test-playwright-skill-improvement.md) | Dev-server pick and accessibility-tree reads for UI loops and probes | Right server in UI loops; cheaper exact UI probes | Tool installs; token figures are unverified source claims | low |

### delegate

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [delegate-wshobson-improvement](delegate-wshobson-improvement.md) | One owner per shared index file; contract files read-only downstream | Keeps parallel items parallel and protects the shared interface | Most of the source already in plan and delegate | low-medium |
| [delegate-rezvani-improvement](delegate-rezvani-improvement.md) | Ports for parallel worktrees; env files via a setup `.worktreeinclude`; opt-in best-of-N by metric | Server gates work in parallel worktrees; independent attempts for tuning TRs | Best-of-N multiplies cost; same-file exception | medium-low |
| [delegate-cek-improvement](delegate-cek-improvement.md) | Fixed checks for non-TR work, misread retry, competing design drafts | Stable criteria across rounds; misreads get the Opus-high retry | Competing drafts cost 3–4 spawns; GPL ideas only | low-medium |
| [delegate-superpowers-improvement](delegate-superpowers-improvement.md) | Bans steering a reviewer; batches final-review findings to one fixer | Unbiased reviews and fewer fixer spawns at task end | delegate at max-lines; gain unmeasured in armory | low |
| [delegate-ecc-improvement](delegate-ecc-improvement.md) | Names what an agent must not change beside a check-based done condition | Blocks passing a check by editing the check, its config or inputs | Overlaps implement-rezvani gate rule; most source already covered | low |

### implement

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [implement-ecc-improvement](implement-ecc-improvement.md) | Bans weakening a gate's config, threshold or command; scope-list done condition; search by behavior. | Single home of gate integrity; checkable scope list. | Rule only, no hook; ECC gain is author's own weak test. | high |
| [implement-wshobson-improvement](implement-wshobson-improvement.md) | Catch errors only where code can act; strict-mode floor for shell scripts. | Fewer hidden causes and double logs; scripts stop on a failed step. | Partly model default; needs evidence or deletion per AGENTS.md. | low |
| [implement-rezvani-improvement](implement-rezvani-improvement.md) | Gate pass comes from the command's own exit code; gate runs go stale; stage by name. | Fixes verified trap: `false \| tail` exits 0, so trimmed gates can pass falsely. | Gate-integrity rule points to implement-ecc; no armory false pass yet seen. | TODO: strength |
| [implement-karpathy-improvement](implement-karpathy-improvement.md) | Coder deletes imports, variables, functions and files its own change leaves unused. | Orphans go into the coder's commit, not a review fix round. | Partly model and linter default; rest of source already covered; implement at max-lines. | low |

### plan

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [plan-ecc-improvement](plan-ecc-improvement.md) | Release Risks lines for risky tasks; optional dissent lenses; superseded decision lines | Rollback, compat window and deploy order block the proposal when missing | Three spawns for dissent; plan at its line cap | high |
| [plan-gsd-improvement](plan-gsd-improvement.md) | Task-check lines for quiet scope cuts and unwired parts; SPIDR split axes | Catches a TR that delivers less than its BR, before code | Word list is only a hint; plan at its line cap | high |
| [plan-superpowers-improvement](plan-superpowers-improvement.md) | Cold-reader agent questions the draft; two self-review lines on names and undecided lines | Tests the plan on a reader without quiz context, before the proposal | One more spawn per plan; plan at its line cap | medium |
| [plan-wshobson-improvement](plan-wshobson-improvement.md) | Strategic pre-mortem: riskiest assumption, smallest evidence, what to delay | Evidence milestone first for new user-facing work | Product focus; overlaps push-back rule and YAGNI | low |
| [plan-mattpocock-improvement](plan-mattpocock-improvement.md) | Three parallel interface designs; strategic Open section for not-yet-sharp questions | Real alternative designs for a new module interface | Three spawns; fits only new shared interfaces | low |

### research

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [research-wshobson-improvement](research-wshobson-improvement.md) | Claims rest on read passages; one secondary source gives likely; empty search is a gap | Stops snippet-only proof and absence claims from failed searches | research at 80-line cap; new open reason value | high |
| [research-rezvani-improvement](research-rezvani-improvement.md) | Counter-search per claim on the Opus row; further sources of two kinds | Looks for disagreement instead of only reporting it when met | Costs searches per brief; research at its line cap | medium |
| [research-recursive-research-improvement](research-recursive-research-improvement.md) | Reject list: no author, marketing, SEO aggregator, uncited tutorial | Low-quality pages cannot become proof | Spanish source; small gain; research at its line cap | low |
| [research-doia-improvement](research-doia-improvement.md) | Fetched text that asks the agent to act is reported, never followed; decision numbers come from the page | Single home of the data-not-instruction rule; no price or quota from a tool's extract | No observed failure; overlaps wshobson §1; research at its line cap | low-medium |

### retro

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [retro-rezvani-improvement](retro-rezvani-improvement.md) | Labels evidence recorded or inferred; checks agent claims; filing bar for rule findings | Stops findings that rest on an agent's own account; blocks rules for one-off slips | Claim check needs exit codes in the record; skill grading not taken | medium-high |
| [retro-superpowers-improvement](retro-superpowers-improvement.md) | Past-session mode: readers read named transcripts; findings cite `path:line`; repeated-work and stumble detectors | Retros of earlier sessions, checkable evidence, and mechanical signals in place of a read by feel | Raises retro max-lines; reader cost; transcript privacy; source thresholds unmeasured | medium |
| [retro-claude-code-tips-improvement](retro-claude-code-tips-improvement.md) | Last-N-sessions batch read; repeated manual task and unused context line findings | Shows misses that recur across sessions and context lines that cost tokens unused | Read cost grows with N; unused-line evidence is weak; one source ideas only | medium |
| [retro-ecc-improvement](retro-ecc-improvement.md) | Hand-fix, revert, repeat and excuse-phrase signals; duplicate-rule finding class | Catches corrections that leave no error, and SSOT breaches seen in a session | Phrase matches give false hits; overlaps the superpowers stumble list | medium |
| [retro-wshobson-improvement](retro-wshobson-improvement.md) | Adds a cause field; clarification-request and abandoned-task signals | Countable causes across sessions; catches misses that show no error | Overlaps finding classes; pays off mainly with past-session mode | medium-low |
| [retro-gsd-improvement](retro-gsd-improvement.md) | Reads git log for stuck fix loops, test churn and scope drift | Checkable branch evidence that does not depend on session text | Thresholds are guesses; scope drift needs TR judgment | low |
| [retro-mattpocock-improvement](retro-mattpocock-improvement.md) | Treats a repo with no pre-commit hook or CI job as a finding | Flags checks that exist nowhere, not only ones off or broken | Duplicates per-commit gates on agent commits | low |

### review

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [review-gsd-improvement](review-gsd-improvement.md) | Makes "shown met" four levels: exists, real, wired, fed; coder claims are not proof. | Catches stubs and unwired units that pass "shown met by diff" today. | Overlaps `req:` markers; about 10 more lines in a full skill. | high |
| [review-rezvani-improvement](review-rezvani-improvement.md) | Empty review names three checked classes; contract before body; consumers outside the repo. | Stops shallow clean verdicts; finds breaks in deployed clients, live database, environment. | Personas, finding quota and severity promotion dropped; overlaps `migrate` draft. | medium-high |
| [review-wshobson-improvement](review-wshobson-improvement.md) | Adds Bug case for imports or APIs missing in the installed version, Risk case for leaks. | Catches made-up APIs and resources not closed on failure paths. | Partial overlap with class Scale; needs lockfile or installed source. | medium |
| [review-ecc-improvement](review-ecc-improvement.md) | Adds sequential-undo Bug case, named silent-failure forms, stale comments as Readability finding. | Concrete cases where "errors swallowed" and stale async answers fall short. | Mostly front-end case; overlaps class Risk and `core` comment rule. | medium |
| [review-cek-improvement](review-cek-improvement.md) | On a diff over 20 files, adds a ranked read-first list for the user. | Tells the user where to spend their own review time on large PRs. | GPL source, ideas only; threshold is a guess; one reviewer, less depth. | medium-low |
| [review-doia-improvement](review-doia-improvement.md) | Reviewer reverts each fix in a scratch worktree and expects its test to go red; re-review reads fixes as new code; fail-open, replay and sibling-form cases. | Catches tests that pass with or without their fix, and bugs a fix adds. | Evidence is one Sonnet pilot (n=12); a test run per fix; review at max-lines. | medium |

### setup

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [setup-wshobson-improvement](setup-wshobson-improvement.md) | Plugin guard hook denies git-hook bypass flags; setup probes it | Gates in git hooks cannot be skipped by habit | 2026-11-02 dropped a guard hook; text match evadable | medium |
| [setup-ecc-improvement](setup-ecc-improvement.md) | Convention scan prefills project rule lines with exemplar files | Unwritten repo conventions become recorded project rules | Scan cost; thresholds unmeasured; extra question rounds | medium |
| [setup-mattpocock-improvement](setup-mattpocock-improvement.md) | Guard hook asks user before push, clean, checkout or restore of all | Structural second check behind the no-push-without-yes rule | Double prompt per push; 2026-11-02 dropped push guard | low |

### test

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [test-rezvani-improvement](test-rezvani-improvement.md) | Red-again proof for after-the-fix regression tests; honest kinds for untestable code | Proves late regression tests; middle ground between real test and none | Edits plan's tests: none line too | high |
| [test-cek-improvement](test-cek-improvement.md) | Case-design techniques: partitions, boundaries, tables, pairwise, property gate, mutation check | Systematic edge cases instead of writer's pick; coverage target with teeth | GPL-3.0 ideas only; ~8 lines over test cap | high |
| [test-superpowers-improvement](test-superpowers-improvement.md) | Bans change detectors, partial doubles, test-only methods, assertions on doubles | Four honest-test checks test lacks | Most of the source already in test §3, §4, §8 | low |
| [test-wshobson-improvement](test-wshobson-improvement.md) | Role-first UI selectors; each test owns its data in a real store | Style changes stop breaking UI tests; no order-dependent data tests | Sources disagree on selector order; small gain | low |
| [test-ecc-improvement](test-ecc-improvement.md) | Test scope lists downstream consumer modules from a scan; untested ones recorded | Catches consumers that no gate test covers | Ledger dropped; low value while unit runs whole suite | low |

### triage

| draft | what it does | what it brings to armory | cons | strength |
|---|---|---|---|---|
| [triage-ecc-improvement](triage-ecc-improvement.md) | Already-fixed history check; bug report fields; item text treated as data | Catches bugs fixed since the report and missing repro facts | Overlaps step 2 and step 3; triage at its line cap | medium |
| [triage-solo-skills-improvement](triage-solo-skills-improvement.md) | Confidence level on a bug, with each assumption named | User sees how much of the bug reading is assumed | Small gain; triage at its line cap | low |

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
