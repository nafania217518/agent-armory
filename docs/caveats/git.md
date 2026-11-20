# Caveats: git

Format: the caveat line of the armory `core` skill, section Reports.

- `git revert A B` that conflicts on B, then `git revert --abort`, also drops the finished revert of A, so `code` §2 reverts one commit per command : skills/code/SKILL.md
  checked: git@2.55.0
- `git log -E --grep` and `git grep -E` match nothing with `\b` or `\>` on macOS git, so `code` §2 uses `([^0-9]|$)`; `-P` works only when git has PCRE : skills/code/SKILL.md
  checked: git@2.55.0, apple-git@2.54.0
- `git merge --squash` indents each squashed commit body by 4 spaces, so `--grep='^Refs:'` misses the squash commit; `code` §2 still finds the original commits by `<base>..<task branch>` while that branch exists : skills/code/SKILL.md
  checked: git@2.55.0
