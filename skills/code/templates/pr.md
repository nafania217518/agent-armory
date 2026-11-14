## Summary

Format: the smallest visual that makes the change clear: pseudocode, a call tree, a
file tree, a diff sketch or a Mermaid diagram, each next to one or two lines of text.

## Evidence

Format: `Before: <a failing test run, an output or a screenshot>`, then
`After: <the same check after the change>`.

## Merge danger

Format: `Door: <one-way | two-way>` and one line on why, then
`Blast radius: <what the merge can affect>`.

Optional last lines: one closing line per item: the closing reference form of
`closes by PR merge:`, with the item's id filled in (armory `code` §Finish).
