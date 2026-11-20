# ui-design ← impeccable (improvement)

Sources:
- https://github.com/pbakaus/impeccable `skill/reference/document.md` (token schema, eight sections) @b49177d (Apache-2.0)
- https://github.com/pbakaus/impeccable `skill/SKILL.src.md` ("Refinement preserves; redesign replaces") @b49177d (Apache-2.0)
- https://github.com/pbakaus/impeccable `skill/reference/shape.md` (Round 2), `skill/reference/polish.md` (§1 drift classes) @b49177d (Apache-2.0)
- https://github.com/google-labs-code/design.md `docs/spec.md` (version alpha) and README (lint rules), commits to 2026-11-18 (Apache-2.0)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it brings

The `ui-design` contract takes an open file format in place of an armory-only one: the
DESIGN.md format by google-labs-code. Its linter checks token references and contrast
pairs, so part of §Contract check becomes a gate. A project that already has a DESIGN.md
keeps one token source. The quiz also asks for content ranges and the parts that must stay
untouched, and each hard-coded value gets one named fix.

## Cons

- Changes a draft, so it applies only once `ui-design` is adopted.
- The format is at version `alpha`; its schema can change.
- The linter is an npm package (`@google/design.md`); a project without Node gets no lint
  part.
- The name DESIGN.md clashes with armory's design doc `<docs>/DESIGN.md`. Change 1 keeps
  armory's file name unless the repo already has a root DESIGN.md in this format.
- The format has no field for states or copy; they become extra sections, which the format
  keeps but its linter does not check.
- Dropped: the source's visitor modes (Persuade, Operate, Read, Experience) and its
  visual-world workshop. They steer taste; `ui-design` keeps taste out.
- Dropped: PRODUCT.md (`init`). Purpose and audience already sit in the business quiz and
  the plan docs; a second product file breaks SSOT.

## Proposed changes

### 1. Contract in the DESIGN.md format

- Target: `ui-design` §Contract (replace the first bullet)
- Text:
  ```
  - Contract MUST follow the DESIGN.md format (github.com/google-labs-code/design.md):
    tokens in YAML front matter, which win over prose, then sections in the format's
    order. States, ranges and copy MUST be extra sections. A field with no value MUST go
    in the `omitted` list with its reason.
  - Contract MUST be the repo's root `DESIGN.md` when one in this format exists, else
    `<docs>/ui-contract.md`. One contract per project. A plan MUST name its fields by
    section, never copy values.
  ```
- Target: `ui-design` §Contract check (add bullet first)
- Text:
  ```
  - With Node in the project, `setup` SHOULD bind `npx @google/design.md lint <contract>`
    as a `lint` gate part. A lint error MUST be a BLOCK; a `contrast-ratio` warning MUST be
    at least a FLAG.
  ```
- Why: an armory-only format has no tool support. It also duplicates tokens in a project
  that a DESIGN.md-aware tool already serves. The linter checks references and contrast
  with no agent turn.
- Evidence needed: a UI project where `<docs>/ui-contract.md` and a root DESIGN.md held
  different values for one token; or a contract check that missed a broken reference or a
  low-contrast pair that the linter finds.

### 2. Refinement or redesign

- Target: `ui-design` §Direction (add bullet first)
- Text:
  ```
  - Main session MUST name the task a refinement or a redesign. A refinement MUST keep
    contract values, copy and behavior outside its scope, and MUST ask user before it
    changes a factual claim in copy. A redesign MUST write a new contract through this
    section and replace the old one whole. Done when the plan names the kind.
  ```
- Why: with no named kind, a redesign ends as small edits on the old look, or a polish task
  drifts into new tokens.
- Evidence needed: a UI task that mixed old and new tokens, or changed copy or tokens
  outside its scope.

### 3. Content ranges and untouched parts

- Target: `ui-design` §Direction (add bullet after the business quiz bullet)
- Text:
  ```
  - For each surface, the business quiz MUST also ask its content ranges (smallest,
    typical and largest item count and text length) and what MUST stay untouched.
  ```
- Target: `ui-design` §Contract (add field after states)
- Text:
  ```
    - ranges: per surface, smallest, typical and largest content;
  ```
- Why: `design-qa` §Rendered checks captures a long-content state, but nothing sets how
  long. The untouched list bounds a refinement (change 2).
- Evidence needed: a UI that broke on real data longer or larger than its test data.

### 4. One fix per hard-coded value

- Target: `ui-design` §Contract (replace the hard-coded value bullet)
- Text:
  ```
  - A hard-coded value outside the contract MUST get one fix: the shared component the
    repo has for it; else a contract token when a second place uses the value; else a
    `tech-debt:` marker (`implement` §The smallest complete change).
  ```
- Why: today a marker or a contract change are both allowed. So a one-off value can grow
  the contract, and a value that a shared component covers stays duplicated.
- Evidence needed: a contract that gained a token used in one place, or a UI diff that
  re-styled what a shared component already does.
