# writing-check (new skill)

Sources: https://github.com/wshobson/agents `plugins/avoid-ai-writing/skills/avoid-ai-writing/SKILL.md`, `references/pattern-catalog.md`, `references/word-tiers.md`, `references/profiles.md` @9c61ab2 (MIT; plugin author Conor Bronsdon, `plugin.json` says MIT)
Status: draft, not adopted

## What it does

A check pass over prose that the writer or main session produces: docs, PR text,
commit bodies, tracker comments. It finds marks of machine prose by severity and fixes
them by cutting or sharpening only.

## What it brings to armory

- `core` §Writing and questions sets the style, but nothing gives a checkable pass after
  writing. This skill lists the marks to find and the edits allowed.
- Its "a rewrite adds no fact" rule backs the writer card's "MUST NOT invent facts".
- Would point to it: writer card (`skills/setup/templates/agents/writer.md`), `code`
  §Finish (PR text), `review` for doc diffs.
- Evidence needed: a writer output, PR body or doc in an armory session that held a P0
  or P1 mark below and that a reader flagged.

## Cons

- Conflicts with `core` §Writing (80% ASD-STE100): the source weights uniform sentence
  length as the strongest mark and asks for varied rhythm and added voice. STE asks for
  short, even sentences. The draft drops the rhythm check, the "convert bullets to
  prose" rule and the "put voice back" step.
- Overlaps `core` §Writing: filler, hedges, idioms and one meaning per word are there
  already. The draft points to it and does not list them again.
- The source word lists (220 lines) are too large to ship; the draft keeps marks by class.
- Low strength alone; it may fit better as five lines in the writer card.

## Fit

- Invocation: model-loaded, so the writer card and a brief can load it by name.
- Hooks into: writer card gains "Before you report, run `writing-check` in detect mode on
  each file you wrote"; `code` §Finish PR text follows it; `review` §Look for MAY name
  it for a docs diff.
- Size: about 50 lines.

## Draft SKILL.md

```markdown
---
name: writing-check
description: >
  Check pass over written prose (docs, PR text, commit bodies, tracker comments) for
  marks of machine prose, with fixes that only cut or sharpen. Use for "check this text
  for AI tells", "/writing-check".
max-lines: 50
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# writing-check

Actor checks prose after writing it. `core` §Writing and questions sets the style; this
skill finds what slipped past it.

## 1. Scope

- MUST check only the author's own prose. Quotes, code, paths, commands and text marked
  as an example MUST stay as written.
- MUST NOT check code, config or generated data. MUST say the file is out of scope
  instead.
- Done when the protected spans are known.

## 2. Marks

- MUST check each class below, P0 first. A mark that is the right word in its context
  MUST stay.
  - P0: chatbot lines ("I hope this helps", "Great question"), knowledge-cutoff lines,
    vague attribution ("experts say", "studies show") with no source, unfilled
    placeholders, praise or weight a routine change does not have.
  - P1: "not X but Y" framing where a direct claim works; stacked hedges ("could
    potentially"); stock intensifiers ("truly", "it is worth noting"); stock openers and
    closers that state no fact; "serves as" or "boasts" where "is" or "has" works; bold
    on more than one phrase per section.
  - P2: a closing line that repeats the text; a list of three where the facts are two
    or four.
- MUST NOT flag sentence length or even rhythm; `core` §Writing and questions asks for
  short, even sentences.
- Done when each class is checked and each hit is quoted with its place.

## 3. Fix

- A fix MUST only cut or sharpen. It MUST NOT add a fact, number, name, date, first
  person, stakes or a dash the source lacks. A gap MUST become `TODO: <what is missing>`
  instead.
- MUST re-read the fixed text once for marks the fix brought in.
- Done when each hit is fixed or kept with its reason, and the re-read found no new hit.

## 4. Modes and output

- Detect mode MUST list hits by class and mark each as a clear problem or a judgment
  call, and MUST change no file.
- Fix mode MUST give, per hit, its place, the old text and the new text.
- Default MUST be detect mode on text another actor owns, and fix mode on text the
  actor wrote in this task.
- Done when the output holds each hit in the mode's form.
```
