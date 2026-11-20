# research ← rezvani (improvement)

Sources:
- https://github.com/alirezarezvani/claude-skills `research/meta-research/skills/meta-research/SKILL.md` @f8593c4 (MIT)
- https://github.com/Anjos2/recursive-research `plugins/recursive-research/skills/recursive-research/SKILL.md` @15ed326 (MIT; change 1 only, merged from `research-recursive-research-improvement`)

Status: draft, not adopted

## What it brings

An adversarial search on the Opus research row: for each claim it reports, the agent
looks for evidence against it. The further sources of §Sources must also differ in kind,
so three copies of one viewpoint do not count as three.

## Cons

- `research` is at its `max-lines` cap (80).
- Change 1 adds searches to each Opus research brief, so it costs tokens and time.
- Per-source files and a research folder are not proposed: they clash with "Agent MUST
  return only the result of §Result", and no armory rule writes `<docs>/research/`.
- Reframing the question and stating hypotheses are not proposed: a researcher brief
  already states each point and its options, and §Result already has `confirmed`,
  `likely` and `open`.

## Proposed changes

### 1. Search against each claim

- Target: `research` §Sources (add bullet, after the disagreement bullet)
- Text:
  ```
  - An agent on the Opus research row (`delegate` §Models row 8) MUST run at least one
    search for evidence against each claim it reports as `confirmed` or `likely`. Its
    source lines MUST name the counter-source it found, or say that none was found.
  ```
- Why: §Sources asks to report disagreement only when the agent meets it; nothing makes
  it look for one.
- Evidence needed: an Opus research result that was later contradicted by a source that
  one counter-search would have found.

### 2. Further sources differ in kind

- Target: `research` §Sources (replace bullet "When official source is unclear, old or
  disputed")
- Text:
  ```
  - When official source is unclear, old or disputed, SHOULD read at least 3 further
    independent sources, of at least two kinds: maintainer channel (issue, release note,
    talk), independent write-up, community answer. A copy of the same text MUST NOT count
    as independent.
  ```
- Why: three forum answers can repeat one claim; the rule today counts them as three
  sources.
- Evidence needed: a disputed claim settled on three same-kind sources that all proved
  wrong.
