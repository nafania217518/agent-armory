# Plan: graph-tool

Parent: `docs/milestones/skill-architecture-redesign.md` §Tasks, line `graph-tool`.

## Requirements

- TR-1 (skill-architecture-redesign/BR-1, skill-architecture-redesign/BR-3, skill-architecture-redesign/BR-36): MUST insert, in each `skills/*/SKILL.md` right above its `max-lines:` line, the lines `metadata:`, `  type: <type>` and `  extends: [<list>]`, from the block below. It MUST raise that `max-lines` by 3. In the 13 skills other than `core`, it MUST replace ``Load `core` first when its rules are not in your context.`` with the pointer line below.

      audit: regular [code, core, implement, review, test]
      code: regular [core, delegate, implement, plan, research, review, setup, test]
      core: regular [code, delegate, dnd, implement, plan, research, review, setup, test]
      debug: regular [core, implement, test]
      delegate: regular [audit, code, core, implement, plan, research, review]
      dnd: user-only [code, core, delegate, plan, research, triage]
      implement: regular [code, core, debug, delegate, review, test]
      plan: regular [code, core, delegate, implement, research, review, test, triage]
      research: regular [core, delegate, dnd, review]
      retro: user-only [core, review]
      review: regular [core, implement, plan, research, test]
      setup: user-only [code, core, delegate, plan, test, triage]
      test: regular [core, delegate, implement, plan, review]
      triage: user-only [core, plan, setup]

      Load `core` before your first step when its rules are not in your context.

  - tests: lint (`claude plugin validate .claude-plugin/plugin.json` parses each new frontmatter; skill-sizes checks each raised cap), unit
  - needs: none
- TR-2 (skill-architecture-redesign/BR-2, skill-architecture-redesign/BR-8): MUST read each skill's `metadata.extends`, report each cyclic group once as `cycle: <members>`, print the check output, and exit 0 when it reports. A list with no closing `]` or with an item that is not `[a-z0-9-]+` gives an `extends` report and counts as empty. An item that names no skill gives an `extends` report and is dropped. A root with no skill prints `no skills/*/SKILL.md in <root>` and exits 1. An unreadable SKILL.md or card prints `<path>: cannot read (<code>)` and exits 1.
  - tests: unit: two skills that extend each other give one `cycle: a, b` report and exit 0; a self-extend gives `cycle: a`; two separate groups give two reports; an acyclic chain of three gives no cycle report; a wrapped flow list reads both lines; a CRLF frontmatter reads its extends; a file with no frontmatter or with `[]` gives no `extends` report; a missing `]` gives an `extends` report; an item that names no skill gives an `extends` report; the summary gives its literal total, check and node lines; `--verbose` adds the report lines; an unknown flag exits 2 with the usage line, and so do two roots and `--mermaid --html`; a root with no skills exits 1; a SKILL.md that is a folder exits 1 with `cannot read`; gates lint and unit
  - needs: none
  - load: none, one pass over each skill file; Tarjan is linear in nodes plus edges
- TR-3 (skill-architecture-redesign/BR-1): MUST report each name token in a skill, frontmatter included, that names neither that skill nor one of its ancestors, as ``<path>:<line>: cite: `<name>` is not an ancestor of <skill>``.
  - tests: unit: a cite of a non-ancestor is reported with its path and line; a cite in a folded description is reported; a cite of a grandparent is not reported; a self-cite is not reported; in a file whose exact `plan` cite is reported, `setup-armory`, `skills/plan/x` and a fenced `plan` are not; a card template that cites a skill is not reported; gates lint and unit
  - needs: TR-2
  - load: none, one ancestor closure per skill over at most all skills
- TR-4 (skill-architecture-redesign/BR-3): MUST report each skill whose set of pointer lines differs from its `metadata.extends`, as `<path>:<line>: pointer: missing <names>; extra <names>`, leaving out an empty part.
  - tests: unit: equal sets give no report; a parent with no pointer gives `missing`; a pointer not in extends gives `extra`; the old ``Load `core` first when …`` line counts as no pointer; a fenced pointer counts as no pointer; gates lint and unit
  - needs: TR-2
  - load: none, one pass over each skill's lines
- TR-5 (skill-architecture-redesign/BR-36): MUST report as `type` each skill with no `metadata.type`, or with a value other than `abstract`, `regular` or `user-only`; each `abstract` skill with no `user-invocable: false`, or whose joined description does not start `Abstract: load only through a skill that extends it`; each `user-only` skill with no `disable-model-invocation: true`; and each `regular` skill that sets a flag.
  - tests: unit: a skill with no type gives a report; `type: abstrct` gives a report; a `regular` skill with neither flag gives no report; a `regular` skill with `disable-model-invocation: true` gives a report, and so does one with `user-invocable: false`; a `user-only` skill with `disable-model-invocation: true` gives no report, and one without it gives a report; an `abstract` skill with both, its description folded over two lines, gives no report; an `abstract` skill with no `user-invocable` line gives a report, and so do ones with `user-invocable: true`, a wrong description start, or no description; gates lint and unit
  - needs: TR-2
  - load: none, one frontmatter read per skill
- TR-6 (skill-architecture-redesign/BR-4): MUST read each card template as a card node, and report each card whose load list names an abstract skill as ``<path>:<line>: card-load: <card> loads abstract `<name>` ``. A cite outside the load list MUST NOT count.
  - tests: unit: a load of an abstract skill on the item's first line is reported; one on a continuation line is reported; one in a second `- MUST load` item is reported; the same abstract skill cited in another item is not reported; a load of a concrete skill is not reported; a card path that is a folder exits 1 with `cannot read`; the missing-folder case has no own test, since the TR-2 to TR-5 fixtures hold no agents folder and fail on a throw; gates lint and unit
  - needs: TR-5
  - load: none, one pass over each card file
- TR-7 (skill-architecture-redesign/BR-5): MUST report, in the skills and card templates, each `§n` or `§n.m` ref, by the owner and chain rules of Design, that has no such numbered heading in its owner, as `section: §<n> has no heading in <owner>`. A range whose start is not below its end, or that holds a `.m` part, MUST get a `section` report.
  - tests: unit: `` `b` §2`` with `## 2.` in b gives no report; `` `b` §3`` with no `## 3.` gives a report; `§1.2` with `### 1.2.` gives none, and without it gives a report; a bare `§2` checks its own file; `` `BR` (§2)`` checks its own file; `` `b` §2, §3 and §4`` checks all three against b; `` `b` §2–§4`` checks 2, 3 and 4; `§4–§2` gives a report; `` `b` (§2)`` and a `` `b` `` that ends a line followed by `§2` attach to b; `` `b` §2, step 9`` gives no report; `` `docs/x.md` §9`` gives no report; a `§9` inside a code span or fence gives no report; a card's `` `b` §9`` gives a report; gates lint and unit
  - needs: TR-6
  - load: none, one pass over each file's text
- TR-8 (skill-architecture-redesign/BR-5, skill-architecture-redesign/BR-7): MUST report each `§<name>` ref in the skills and card templates as `section: §<name> is a name reference`, resolved by the Design name match, ending with `, resolves to §<n>`; `, ambiguous in <owner>: §<a>, §<b>`; `, matches no heading in <owner>`; `, matches an unnumbered heading in <owner>`; or nothing more after a file-path code span. A resolved number MUST join its edge's section set, and a ref chained after a resolved name MUST belong to the same owner.
  - tests: unit: `` `b` §Alpha beta`` with `## 2. Alpha beta` gives `resolves to §2`; with `## 2. Alpha` and `## 3. Alpha beta` it gives `§3`; `` `b` §Alpha, boundaries`` with `## 4. Alpha, boundaries` gives `§4`; a name split over a line break resolves; `§Alphabet` does not match `## 2. Alpha`; `` `b` §Self, then`` with `## 5. Self and more` gives `§5`; with `## 5. Self and more` and `## 6. Self or less` it gives `ambiguous in b: §5, §6`; two `## Alpha` headings give an ambiguous report; `§Gamma` gives `matches no heading in b`; `§Flow` with `### Flow` gives `matches an unnumbered heading`; an own-file `§Alpha` resolves in its own file; `` `docs/x.md` §Alpha`` gives the bare report; `` `b` §Alpha and §Beta`` resolves both in b; a card's `§<name>` ref gives a report; gates lint and unit
  - needs: TR-7
  - load: none, one heading list per skill and one match per ref
- TR-9 (skill-architecture-redesign/BR-7): MUST print the Design mermaid text to stdout with `--mermaid`, from the model and reports of TR-2 to TR-8. The check output stays on stderr.
  - tests: unit: two cites of b from a, with `§3` and `§2`, give one line `s_a -->|"§2, §3"| s_b`; a `` `b` §Alpha`` that resolves to `§2` gives `|"§2"|`; a cite with no `§`, and one with only an unmatched name, give `s_a --> s_b`; `step 6` stays out of the label; a card gives `c_x(["x"])`; an abstract skill gives `class s_x abstract`, and the text ends with the `classDef` line; a non-ancestor cite, a cycle edge and a card load of an abstract skill each get a `linkStyle` with their 0-based link index; stdout holds only the mermaid text while the summary is on stderr; gates lint and unit
  - needs: TR-3, TR-8
  - load: none, one pass over the edge list
- TR-10 (skill-architecture-redesign/BR-7): MUST, with `--html`, write the Design page with its data block and layout to a new `skill-graph-` temp folder, and print the file path as the only stdout line. A temp-folder or write failure MUST print `html: <code>` on stderr and nothing on stdout, then exit 1.
  - tests: unit: stdout is one path under `TMPDIR`, and the file exists; the data block holds an edge with its section set and problem; a node holds its kind, reports, extends, ancestors and children; in an acyclic chain each parent's y is below its child's y, and each card's y is above every skill's; the page holds no `src=` or `href=` with `http`, and no `url(http`; a `TMPDIR` that does not exist exits 1 with `html: ENOENT` and an empty stdout; gates lint and unit
  - needs: TR-9
  - load: none, one pass over nodes and edges
- TR-11 (skill-architecture-redesign/BR-7): MUST render the page from its data block in vanilla JS and inline SVG, with the Design ideas taken: a click on a node pins the details panel (kind, extends, edges in and out with section sets, reports); hover highlights parents, children and the ancestor chain; `cycle`, `cite` and `card-load` edges and their nodes show in the warning color; filters for cards, abstract skills and problems only; a name search; pan, zoom and fit to view.
  - tests: none, the gates run no browser or DOM and the project takes no dependency; TR-10 proves the data that the page shows; gates lint and unit
  - needs: TR-10
- TR-12 (skill-architecture-redesign/BR-8): MUST set the `lint` line of `AGENTS.md` `## Commands` to the line below.

      - lint: claude plugin validate . && claude plugin validate .claude-plugin/plugin.json && node scripts/skill-sizes.mjs && node scripts/doc-checks.mjs && node scripts/skill-graph.mjs

  - tests: lint (the chain runs the script at the tip and exits 0 with its reports), unit
  - needs: TR-2
- TR-13 (skill-architecture-redesign/BR-7): MUST, with `--html`, give each node the x and y of the Design Layout rule. The units MUST come from the TR-2 cyclic groups.
  - tests: unit (all coordinate checks within 1e-6): the four members of the group `a`→`d`→`c`→`b`→`a` lie at equal distance from their centroid, with `a` top, `b` right, `c` bottom and `d` left, 180 between neighbours; in the group `a`→`c`→`b`→`a`, where `a` also extends `p` and `x` extends `c`, `p` sits above every member and every member sits above `x`; a self-extending `s` beside the group `a`→`c`→`b`→`a` sits at the y of the group's centroid, at a distance of R + 180 from it (R = 180 / (2 sin 60°) ≈ 103.92); for the groups `a`→`c`→`b`→`a` and `d`→`f`→`e`→`d`, the distance between their centroids exceeds the sum of each group's largest member distance from its centroid; gates lint and unit
  - needs: TR-10
  - load: none, one pass over the units and their members

