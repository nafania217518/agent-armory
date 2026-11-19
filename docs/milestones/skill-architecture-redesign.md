# Milestone: skill-architecture-redesign

Parent: `docs/DESIGN.md` §Milestones, line `skill-architecture-redesign`.

## Goal

The always-on rules split into `core`, for every actor, and `core-main`, for the main
session. Two hook payloads inject them under the 10,000-character cap. The skills form
an acyclic `metadata.extends` hierarchy in which each skill cites only its ancestors.
Shared parts live in abstract skills, and the `planner` card loads `plan-draft`. A
graph tool builds the payloads and checks the hierarchy in `lint`. Release 0.5.0 ships
it, and a probe shows whether the SessionStart `compact` output survives the summary.

## Out of scope

- Load evals for the special skills.
- Section names: sections keep their numbers, and references take the `§n` form.
- The `skill-adoption` milestone.
- A build that writes the pointers from `metadata.extends`.
- Payload size errors: both size levels only warn.

## Requirements

- BR-1: MUST report each backticked skill name in a skill, its description included,
  that names neither that skill nor one of its ancestors.
- BR-2: MUST report each cycle in the `metadata.extends` graph.
- BR-3: MUST report each skill whose `Load` pointers differ from its
  `metadata.extends`.
- BR-4: MUST report each agent card whose load list names an abstract skill; a cite
  outside the load list MUST NOT count as a load.
- BR-5: MUST report each `§n` or `§n.m` reference with no such heading, and each
  `§<name>` reference.
- BR-6: MUST report each `metadata.type: abstract` skill that lacks
  `user-invocable: false` or a description that starts "Abstract: load only through a
  skill that extends it". (replaced by BR-36)
- BR-7: MUST draw the graph with `--mermaid` and with `--html`: skills and cards as
  nodes, one edge per skill pair, labelled with its section set.
- BR-8: MUST exit 0 on every graph-check report until the `flip` task.
- BR-9: MUST skip the load and skip eval check of `doc-checks.mjs` for a skill with
  `metadata.type: abstract`.
- BR-10: MUST hold the output-size rule only in the abstract skill `output-budget`,
  which extends `core` and which `implement`, `test` and `code` extend. The `coder`,
  `debugger`, `reviewer` and `planner` card templates MUST cite it, and
  `docs/DESIGN.md` MUST name it in its skill list and §4 rows. (replaced by BR-41)
- BR-11: MUST build a main payload, `core` plus `core-main` without its disclaimer and
  section tags, and an agent payload, `core` alone.
- BR-12: MUST warn, without failing, on a payload over 9,000 characters and on one over
  10,000, marker lines included.
- BR-13: MUST inject the main payload at session start and the agent payload at
  subagent start.
- BR-14: MUST hold the marker line `armory-core <version>` only in `core` and
  `armory-core-main <version>` only in `core-main`.
- BR-15: MUST leave `core` citing no skill and `core-main` citing only `core`.
- BR-16: MUST fail `lint` when a skill that an agent card loads has `core-main` as an
  ancestor.
- BR-17: MUST give `core-main` 3 load eval cases and 1 skip eval case.
- BR-18: MUST hold the tracker verbs, the docs fallback and the five main-only tracker
  rules only in the abstract skill `workflow`.
- BR-19: MUST build both payloads in memory and report each committed payload that
  differs from that build.
- BR-20: MUST hold `implement` §1 and §4, the test-scope rules of `implement` §6 and
  `test` §5, `test` §4, the benchmark bullet of `test` §8 and the data-growth path
  definition only in the abstract skill `craft`, which `implement` and `test` extend.
  `docs/DESIGN.md` MUST name it in its skill list and §4 rows.
- BR-21: MUST leave `implement`, `test`, `craft`, `research`, `review`, `audit` and
  `debug` citing only their ancestors.
- BR-22: MUST hold the `BR` and `TR` formats, the plan-doc section rules, the
  milestone check, the flow walk and the three plan templates only in the abstract
  skill `requirements`, which `plan` extends. `docs/DESIGN.md` MUST name it in its
  skill list, its `workflow` bullet and its §4 rows.
- BR-23: MUST make the `planner` card template load `plan-draft`, not `plan`.
  `plan-draft` MUST extend `requirements`, `craft` and `output-budget`, and have 3 load
  eval cases and 1 skip eval case. (replaced by BR-42)
- BR-24 (replaced by BR-40): MUST hold the branch, finish and caveat-base write rules
  only in `workflow`.
- BR-25: MUST hold the docs and status homes, the claim rules, the done write, the
  `triage` roles and the label lines only in `workflow`.
- BR-26: MUST hold the amendment rules and the business quiz topics only in
  `workflow`.
- BR-27: MUST leave `delegate`, `code` and `plan` with no cite among them except
  `code` to `delegate` and `plan` to `delegate`.
- BR-28: MUST hold the `dnd` overlays of `research` in `dnd`, and leave `dnd`,
  `triage`, `setup` and `retro` citing only their ancestors. (replaced by BR-38 and
  BR-39)
- BR-29: MUST make the `setup` fallback pointer load `core` and `core-main`.
- BR-30: MUST hold no `§<name>` reference in any skill or card template.
- BR-31: MUST fail `lint` on any graph-check report, with no report at the tip.
- BR-32: MUST split `workflow` into two abstract skills, and `docs/DESIGN.md` MUST
  name both in its skill list and §4 rows.
- BR-33: MUST set the plugin version to 0.5.0.
- BR-34: MUST record the result of the compaction probe as one caveat line for
  `hooks/hooks.json`.
- BR-35: MUST pass `lint` and `unit` at the tip of each task.
- BR-36: MUST report each skill with no `metadata.type` or a value other than
  `abstract`, `regular` or `user-only`; each `abstract` skill that lacks
  `user-invocable: false` or a description that starts "Abstract: load only through a
  skill that extends it"; each `user-only` skill that lacks
  `disable-model-invocation: true`; and each `regular` skill that sets either flag.
- BR-37: MUST exempt `core` and `core-main` from the `max-lines` check of
  `scripts/skill-sizes.mjs`, so neither fails for a missing `max-lines` or for its
  line count.
- BR-38: MUST hold the `dnd` overlays of `research` in `dnd`.
- BR-39: MUST leave `dnd`, `triage`, `setup` and `retro` citing only their ancestors.
- BR-40: MUST hold the branch, finish and caveat-base write rules only in `workflow`;
  only the subagent caveat-base ban stays in `core` and the main-session caveat-base
  decision rule in `core-main`.
- BR-41: MUST hold the output-size rule only in `core` §3 and the payloads built from
  it. (replaced by BR-43)
- BR-42: MUST make the `planner` card template load `plan-draft`, not `plan`.
  `plan-draft` MUST extend `requirements` and `craft`, and have 3 load eval cases and 1
  skip eval case.
- BR-43: MUST hold the output-size rule only in `core` §3 and the payloads built from
  it, and name `output-budget` in no skill, card template, card copy, plugin or
  marketplace manifest, `README.md`, `AGENTS.md`, or `docs/DESIGN.md` skill list or §4
  row.

## Tasks

- graph-tool : the graph check in report mode, `--mermaid` and `--html`, and
  `metadata.extends` and `metadata.type` in each skill : BR-1..BR-5, BR-7, BR-8,
  BR-36, BR-35 : none : done
- doc-checks-abstract : the eval-check skip for abstract skills : BR-9, BR-35 : none :
  done
- output-budget : the abstract skill `output-budget`, its parents and the four card
  cites : BR-10, BR-35 : graph-tool, doc-checks-abstract : done
- core-split : `core-main`, the marker lines, the payload build, the two hooks, the
  `core` references resolved, the `core-main` evals and list entries, the card lint,
  the `workflow` skeleton that holds the tracker rules, and the size exemption of
  `core` and `core-main` : BR-11..BR-18, BR-37, BR-35 : graph-tool,
  doc-checks-abstract : done
- stale-payload-check : the in-memory build and the stale report : BR-19, BR-35 :
  core-split : done
- craft : the abstract skill `craft` and its parents : BR-20, BR-35 : graph-tool,
  doc-checks-abstract : done
- agent-cites : the cuts and moves in `implement`, `test`, `craft`, `research`,
  `review`, `audit` and `debug`, with the `dnd` overlays of `research` moved to `dnd` :
  BR-21, BR-38, BR-35 : craft, output-budget : done
- requirements : the abstract skill `requirements` with the three plan templates :
  BR-22, BR-35 : graph-tool, doc-checks-abstract : done
- plan-draft : the concrete skill `plan-draft`, its evals and the `planner` card :
  BR-23, BR-35 : requirements, craft, output-budget : done
- workflow-branches : branches, finish and caveat-base writes in `workflow` : BR-40,
  BR-35 : core-split : done
- workflow-docs : docs and status homes, the claim rules, the done write and the
  `triage` roles in `workflow` : BR-25, BR-35 : core-split, requirements : done
- workflow-amendments : amendments and the business quiz topics in `workflow` : BR-26,
  BR-35 : core-split, requirements : done
- orchestrators : the cuts between `delegate`, `code` and `plan`, the hand-off rule in
  `core-main` and the descriptions : BR-27, BR-35 : workflow-branches, workflow-docs,
  workflow-amendments : done
- user-only : the `dnd` parents, and the cuts in `triage`, `setup` and `retro` :
  BR-39, BR-35 : workflow-docs : done
- setup-pointer : the fallback pointer text : BR-29, BR-35 : core-split : done
- section-refs : each `§<name>` reference converted to `§n` or `§n.m`, in the skills,
  the card templates and their copies : BR-30, BR-35 : agent-cites, plan-draft,
  orchestrators, user-only, setup-pointer : done
- flip : the graph-check reports fail `lint` : BR-31, BR-35 : section-refs,
  stale-payload-check : done
- workflow-split : the two abstract skills from `workflow` : BR-32, BR-35 :
  section-refs : done
- release-0-5-0 : the version bump : BR-33, BR-35 : flip, workflow-split : done
- output-budget-into-core : the output-size rule moved into `core` §3, with the
  `output-budget` skill, its pointers, card lines and list entries removed : BR-43,
  BR-42, BR-35 : output-budget, plan-draft, core-split : done
- compaction-probe : the user's probe after 0.5.0, with its caveat line : BR-34,
  BR-35 : release-0-5-0 : done

## Risks

- A main payload over 10,000 characters reaches the model only as a file path and a
  2,000-character preview, and the size check only warns, so an interim `core-main`
  that holds the tracker rules can drop the main-session rules while `lint` stays
  green : BR-18, BR-12
- A skill edit without a rebuild leaves a stale committed payload : BR-19
- The fallback pointer sits in project context, so a subagent that misreads its
  main-session clause loads `core-main` : quiz answer F
- `dnd` cites `code` §4 steps by number, and no check resolves a step number :
  quiz answer (accepted in section-refs)
- No probe yet shows that the model loads a `user-invocable: false` skill through a
  pointer : core-split
- The hook runs the installed plugin, not this repo, so a payload change shows only
  after the release : compaction-probe
- Each task that adds a skill stops for the user's yes to its `docs/DESIGN.md`
  amendment : quiz answer G
