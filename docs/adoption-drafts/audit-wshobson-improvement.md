# audit ← wshobson (improvement)

Sources: https://github.com/wshobson/agents `plugins/documentation-standards/skills/grounded-vault/SKILL.md` @9c61ab2 (MIT)
Status: draft, not adopted

## What it brings

A one-command drift test for caveat-base entries: the commit that last wrote the entry's line
acts as its fingerprint, and any later commit on the entry's file means drift. It replaces a
date comparison with a history check, and a script could run it with no model tokens.

## Cons

- Overlaps the existing drift rule; the change swaps the method, not the idea.
- Dropped: the source's page header (`Fingerprint:`, `Monitored:` fields). A caveat line
  already names its one file, and `git blame` already gives the commit, so a header adds
  upkeep for no gain.
- Dropped: the grounding check (each figure or quote found verbatim in its source). It fits
  research results, not the caveat base; it belongs in a `research` draft, if any.
- Dropped: archive instead of delete. Git history already keeps a deleted caveat line.
- Running the check in `scripts/doc-checks.mjs` is a code change; this draft only names it
  as a follow-up for a coder.
- Size: `audit` is at its `max-lines` (77 of 77); change 1 adds about 1 line.

## Proposed changes

### 1. Drift by history, not by date

- Target: `audit` §Audit-only checks (replace bullet "A drifted entry is one whose file has a
  commit newer than entry's line (`git blame` on the line, `git log -1` on the file).")
- Text: A drifted entry is one whose file has a commit after the commit that last wrote the
  entry's line. Reviewer MUST test it with `git log --oneline <blame-sha>..HEAD -- <file>`,
  where `<blame-sha>` comes from `git blame` on the line; any output means drift.
- Why: "newer" invites a date comparison, and a rebase or cherry-pick can give an older date
  to a later commit; the history range has no such gap. It is also one command per entry.
- Evidence needed: an audit that misjudged drift by date, or a measured cut in audit time or
  tokens from the one-command check.

### 2. Follow-up: drift in `lint` (code, not skill text)

- Target: `scripts/doc-checks.mjs` (coder task, not a skill edit)
- Text: none; a coder would add a check that runs change 1's command per caveat line and
  prints each drifted entry. It would report, not fail `lint`, since drift needs a claim
  check, not a fix.
- Why: moves the mechanical part of `audit` drift detection out of the model's context.
- Evidence needed: an audit run where the drift step cost a measured share of tokens.
