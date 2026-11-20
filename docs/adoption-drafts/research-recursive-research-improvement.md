# research ← recursive-research (improvement)

Sources:
- https://github.com/Anjos2/recursive-research `plugins/recursive-research/skills/recursive-research/SKILL.md` @15ed326 (MIT)

Status: draft, not adopted

## What it brings

A reject list for web sources: no named author, marketing with no data, SEO aggregators,
tutorials that cite nothing. A source a researcher must not use cannot become proof.

## Cons

- The source is in Spanish; the ideas here are a free translation.
- Most of its loop is out of scope for claim research: checkpoint files, coverage per
  research thread, a stop rule from the share of new findings per cycle. None is proposed.
- Its three-tier ranking overlaps the primary-before-secondary rules of `research`
  §Sources; only the reject list is new.
- `research` is at its `max-lines` cap (80).
- Its "add at least one contrary source" rule is proposed once, in
  `research-rezvani-improvement` change 1.

## Proposed changes

### 1. Sources a researcher must not use

- Target: `research` §Sources (add bullet, after the independent-sources bullet)
- Text:
  ```
  - An agent MUST NOT use as proof a page with no named author or owner, marketing with
    no data, an SEO aggregator, or a tutorial that cites no source. It MUST take the next
    source of the proof order instead, and MAY use such a page only to find one.
  ```
- Why: §Sources ranks primary over secondary but rejects no kind of source.
- Evidence needed: a researcher result that cited such a page for a claim later shown
  wrong.
