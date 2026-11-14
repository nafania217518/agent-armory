# Tightening pass

Rules for a pass that shrinks skill text with no change of meaning.

- MUST drop a phrase that repeats what a name already says: "the `dnd`
  skill" becomes "`dnd`".
- MAY drop a, an and the where meaning stays (`core` section Writing and questions).
- MUST delete filler words ("just", "really", "basically", "in fact").
- MUST shorten a stock phrase: "in order to" becomes "to".
- SHOULD use the shorter synonym ("use", not "utilize"), except for a
  `## Glossary` term or an RFC 2119 word.
- MUST write `§<name>` in place of `section <name>`.
- MAY merge two bullets only when they share one RFC word, subject and condition.
- MUST keep exact: code, paths, commands, numbers, headings, section names, terms,
  and every not, never, no, only, except, unless and however.
- MUST write a full rule with its subject, not a fragment, an invented abbreviation
  or an arrow.
- A line wrap MUST keep each RFC 2119 keyword on one line: `MUST NOT` and `SHOULD NOT`
  never split across two lines.
- Each rule MUST keep exactly one RFC 2119 word, its subject and its condition.
- Done when a reviewer has checked the diff for these points and each change of
  meaning is reverted.
