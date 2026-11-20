# wizard (new skill)

Sources: https://github.com/mattpocock/skills `skills/engineering/wizard/SKILL.md`, `skills/engineering/wizard/template.sh` @5863806 (MIT; the shell library is not copied)
Status: draft, not adopted

## What it does

It builds a bash script that walks the user through manual steps only a person can do:
dashboard clicks, keys and CI secrets, a cutover. The script opens each page, asks for
each value, writes it to its place, and confirms before each step that cannot be undone.

## What it brings to armory

- Armory has no path for setup or devops steps that only the user can do. Today the main
  session explains them in chat, and the user repeats them by hand each time.
- The script is a coder deliverable with static checks, so it fits `code` and
  `implement`.
- Would point to it: `setup` (when a project needs secrets or accounts), `plan` (a task
  whose steps include user-only actions).
- Evidence needed: a session where the user had to do several dashboard or secret steps
  from chat text, or asked for them twice.

## Cons

- Niche; survey rates it low.
- Needs a shell helper library. The source ships one; the brief allows no copied text, so
  adoption must write its own; see §Helper library spec.
- The script cannot be run by an agent (it waits on a person), so its only gates are
  static.
- A wizard that writes secrets to a file adds a place where secrets live; the draft keeps
  the file mode private and the file out of git.

## Fit

- Invocation: user-only (`disable-model-invocation`). Rare, and a description in every
  session costs more than it gives.
- Hooks into: `setup` §Report MAY name `/wizard` when the project needs secrets or
  accounts; `plan` §The plan needs no edit (the wizard is a plan item like any script).
- Size: about 60 lines, plus the helper library (estimate: about 150 lines of bash for
  the functions of §Helper library spec).

## Helper library spec

Spec only; the implementation waits for review. Names use the prefix `wz_`.

### Purpose and place

- The library gives every wizard script the same prompts, writes, resume and summary, so
  the coder writes only the stages.
- File: `skills/wizard/lib.sh`. The coder puts its full text at the top of the script
  (see Open decisions, item 1), so the script runs without the plugin.
- The script calls `wz_init` first and `wz_summary` last; each stage sits between
  `wz_stage` and `wz_stage_done`.

### Functions

- `wz_init NAME TOTAL`: sets the script name and stage count, and the state file path
  `.wizard-<NAME>.state` in the current folder. Fails (exit 2) when bash is older than
  3.2, when `/dev/tty` cannot be opened, when `CI` is set, or when `xtrace` is on. Sets a
  trap on exit and interrupt that turns terminal echo back on.
- `wz_stage ID TITLE`: prints the header `Stage <n>/<TOTAL>: <TITLE>`; `n` counts calls.
  When ID is in the state file, asks "Done before. Skip? [Y/n]"; returns 1 to skip, 0 to
  run. A skipped stage counts as `skipped` in the summary.
- `wz_stage_done ID`: appends ID to the state file once (no duplicate line). The state
  file holds stage IDs only, never a value.
- `wz_say TEXT` and `wz_warn TEXT`: print one plain or one warning line. Colour only when
  stdout is a terminal and `NO_COLOR` is unset.
- `wz_open URL`: opens URL with `open` (macOS) or `xdg-open` (Linux). When neither runs,
  prints the URL. Then waits for Enter. Always returns 0.
- `wz_ask VAR PROMPT [DEFAULT]`: reads one line from `/dev/tty` into the variable named
  VAR. Shows DEFAULT in the prompt; empty input takes it. Empty input with no default
  asks again. Fails (exit 2) when VAR is not a valid shell name.
- `wz_ask_secret VAR PROMPT [CURRENT]`: as `wz_ask`, with echo off. When CURRENT is
  non-empty, says only "a value is stored; Enter keeps it", never the value or its
  length. Prints a newline after input.
- `wz_confirm PROMPT`: asks `[y/N]`; returns 0 only for `y` or `yes` (any case), else 1.
  The script calls it before each step that cannot be undone and stops on 1.
- `wz_env_get FILE KEY`: prints the value of the first `KEY=` line, or nothing. Parses
  lines as text; never sources or evaluates the file. Missing file prints nothing,
  returns 0.
- `wz_env_set FILE KEY VALUE`: replaces the `KEY=` line or appends one. Writes a temp
  file in the same folder with mode 0600, then moves it over FILE. Refuses a VALUE with a
  newline (exit 2). Adds no quotes, since env-file parsers differ. Inside a git repo,
  fails (exit 2) when `git check-ignore` does not match FILE. Records `KEY -> FILE` for
  the summary.
- `wz_pipe VAR LABEL CMD [ARG...]`: sends the value of the variable named VAR to CMD on
  stdin, never in its arguments. Checks CMD with `command -v` first. On failure prints
  LABEL and CMD with its arguments, never the value, and returns CMD's exit code.
  Records `LABEL -> CMD` for the summary.
- `wz_fail TEXT`: prints TEXT as an error and exits 1.
- `wz_summary`: prints each stage as `done`, `skipped` or `not reached`, then each
  recorded write as `<name> -> <target>`. Prints no value. Returns 0.

### Cross-cutting rules

- No secret in output, in the state file, in the summary, or in the arguments of an
  external command, since `ps` shows those. File writes use the builtin `printf`.
- Safe to re-run: env writes replace, not duplicate; `wz_env_get` gives the default; the
  state file offers a skip. A `wz_pipe` target MUST overwrite on re-run; §Map each stage
  checks that per CLI.
- Non-interactive run: `wz_init` refuses it with one clear line and exit 2. No answer file
  or env-var mode (YAGNI).
- Portability: bash 3.2, the macOS `/bin/bash`. So no associative arrays, `mapfile`,
  `read -i`, `${var,,}` or `declare -n`; `printf -v` is allowed. No `sed -i` (flags differ
  on BSD and GNU); writes use temp file and `mv`.
- Dependencies: bash and POSIX tools only, plus `open` or `xdg-open` when present, and
  `git` when the folder is a repo. Each CLI that `wz_pipe` calls is a dependency of the
  script, not of the library.

### Static checks

- `bash -n` and `shellcheck` run on the library in the skill repo, and again on each
  script, which holds the library text.
- A `shellcheck` disable needs a one-line why next to it.
- Secret-name match: the library holds no names. The trace reads each `wz_pipe` call in
  the script; the LABEL and the CMD arguments MUST name a secret that CI config
  references.

### Open decisions

1. Library in the script or loaded at run time. Options: (a) coder puts the library text
   at the top of the script; (b) the script sources it from the plugin path; (c) no
   library, the coder writes the functions each time. Recommended: (a). Basis: the
   script may be committed as a setup path (§4), and a plugin path is not stable on
   another machine; (c) repeats the same text in each script.
2. Where the file lives. Options: (a) `skills/wizard/lib.sh`; (b) a template under
   `skills/setup/templates/`. Recommended: (a). Basis: only the wizard uses it, and the
   draft SKILL.md already names that path.
3. Which secret stores. Options: (a) env file only; (b) env file plus one named CLI, such
   as `gh secret set`; (c) env file plus any CLI that reads the value on stdin, through
   `wz_pipe`. Recommended: (c). Basis: one function covers each store whose CLI reads
   stdin. TODO: confirm per CLI that it reads the value on stdin and overwrites on
   re-run.
4. Tests for the library. Options: (a) none, static checks only; (b) unit tests under
   `scripts/` for the non-interactive functions (`wz_env_get`, `wz_env_set`,
   `wz_summary`). Recommended: (b). Basis: `wz_env_set` writes secrets and file modes,
   and the project gate `unit` already runs `node --test scripts/`.
5. Confirm strength for steps that cannot be undone. Options: (a) `[y/N]`; (b) the user
   types the stage ID. No recommendation: no session shows a misfire of (a) yet.

## Draft SKILL.md

```markdown
---
name: wizard
description: >
  Build a bash script that walks the user through manual steps only a person can do:
  dashboard clicks, keys and CI secrets, a cutover. Use for "/wizard".
disable-model-invocation: true
max-lines: 60
---

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY follow RFC 2119.
Load `core` first when its rules are not in your context.

# wizard

Main session scopes the steps with user; a coder writes the script from
`skills/wizard/lib.sh`.

## 1. Scope

- An agent MUST read the repo for each needed value: env files and their examples, CI
  workflow secret and variable references, compose files, framework config, README.
- For a cutover, it MUST also report current state, target state and each step between
  them that cannot be undone.
- Main session MUST show user the ordered stages and ask, through question tool, to add,
  drop or reorder.
- Done when each stage is named in order and each value has: where user gets it, where
  it is written (env file, CI secret, both, none), and whether it is secret.

## 2. Map each stage

- Each stage MUST give the exact path a stranger follows: page link, what to click, where
  the value shows.
- A step whose current page or command is not known MUST NOT be guessed. MUST research it
  (`research` §When to research) or ask user instead.
- Done when each stage traces to concrete steps.

## 3. Build

- The coder brief MUST hold the stage list of §Scope and §Map each stage.
- Script MUST use one stage per step, in dependency order, one task per stage.
- Script MUST open the page before it asks for that page's value, hide input for secrets,
  and confirm before each step that cannot be undone.
- A value write MUST be idempotent: a re-run offers the stored value as default.
- An env file the script creates MUST get mode 0600 and MUST be in `.gitignore`.
- Done when each value of §Scope is captured and written where §Scope says.

## 4. Check and hand over

- Coder MUST check the script statically: `bash -n`, and `shellcheck` when installed.
- Coder MUST NOT run the script, since it waits on a person. It MUST trace it instead:
  each CI secret name the script sets MUST match a reference in CI config.
- Script MUST live in a temp folder unless user says yes to commit it as a repeatable
  setup path.
- Main session MUST give user the command to run it.
- Done when both checks pass, the trace matches, and user has the command.
```
