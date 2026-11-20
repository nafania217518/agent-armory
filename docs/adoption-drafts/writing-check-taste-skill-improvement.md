# writing-check ← taste-skill (improvement)

Sources:
- https://github.com/Leonxlnx/taste-skill `skills/taste-skill/references/copy-tells.md` @f6b7657 (MIT)
- https://github.com/Leonxlnx/taste-skill `skills/taste-skill/references/copy-voice.md` (§5 device budget, §6 Check) @f6b7657 (MIT)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it brings

The source splits the marks of model prose into a first generation (word lists, stock
lines) and a second that looks like good prose and survives review. Four marks of the
second kind carry over from web copy to docs, PR text and reports. The `writing-check`
draft lacks them.

## Cons

- `writing-check` is itself a draft, not adopted; this draft waits on it.
- The source is about marketing copy. Its voice card, registers and humour budget do
  not carry over and are dropped.
- Dropped: the "perfect evenness" mark and "one sentence may run long". They conflict
  with `core` §2 (80% STE); `writing-check` §2 already drops the rhythm check.
- Dropped: the 90-word ban list and `copy-lint.mjs`. `writing-check` keeps marks by
  class, and the source says the tells change with each model generation.
- Adds about 4 lines; the `writing-check` cap goes from 50 to 54.

## Proposed changes

### 1. Invented specifics

- Target: `writing-check` §2 Marks, P0 (append to the item)
- Text:
  ```
    a precise detail (a number, time, id, name or measured result) that no source gives.
  ```
- Why: detail persuades, so a model invents it. `writing-check` §3 bans adding facts
  in a fix, but no class finds them in the text under check.
- Evidence needed: a writer output, PR body or report that held an unsourced number or
  result.

### 2. Contrast frames and virtue words

- Target: `writing-check` §2 Marks, P1 (replace the first item, add one)
- Text:
  ```
    contrast framing ("not X but Y", "rather than", "instead of", "without the") where a
    direct claim works, its forms counted together; virtue words about the author's own
    work ("carefully", "robust", "simply", "thoughtful");
  ```
- Target: `writing-check` §3 Fix (extend the re-read bullet)
- Text:
  ```
  - MUST re-read the fixed text once for marks the fix brought in, such as a substitute
    form of a cut contrast frame.
  ```
- Why: the source found that a ban on one contrast form moves the writer to the next
  form. Virtue words claim a quality that a fact should show.
- Evidence needed: an armory text that held two or more contrast frames, or a fix pass
  that swapped one form for another.

### 3. Swap test

- Target: `writing-check` §2 Marks, P1 (add item)
- Text:
  ```
    a sentence that stays true with another project, PR or tool named in it; it states
    no fact of this one.
  ```
- Why: a checkable test for generic text. A check by feel cannot find it.
- Evidence needed: a PR body or doc summary whose opening lines fit any change.
