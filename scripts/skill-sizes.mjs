import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: node scripts/skill-sizes.mjs [skills-dir]';
const MAX = /^max-lines:\s*(\S*)\s*$/;
const POSITIVE = /^[1-9]\d*$/;

// The max-lines value from the leading --- block, or undefined.
function maxLines(text) {
  const lines = text.split('\n');
  if (lines[0] !== '---') return undefined;
  for (const line of lines.slice(1)) {
    if (line === '---') return undefined;
    const match = line.match(MAX);
    if (match) return match[1];
  }
  return undefined;
}

// lstat keeps a dangling or unreadable SKILL.md, so the read below names it.
function hasSkillFile(file) {
  try {
    return Boolean(lstatSync(file));
  } catch (err) {
    return err.code !== 'ENOENT' && err.code !== 'ENOTDIR';
  }
}

function skillNames(dir) {
  try {
    return readdirSync(dir)
      .filter((name) => hasSkillFile(path.join(dir, name, 'SKILL.md')))
      .sort();
  } catch {
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const dir = path.resolve(args[0] ?? 'skills');
  const names = skillNames(dir);
  if (names.length === 0) {
    process.stderr.write(`no */SKILL.md in ${dir}\n`);
    process.exit(1);
  }
  let failed = false;
  for (const name of names) {
    const file = path.join(dir, name, 'SKILL.md');
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch (err) {
      process.stderr.write(`${file}: cannot read (${err.code ?? err.message})\n`);
      failed = true;
      continue;
    }
    const lines = text.split('\n').length - 1;
    const max = maxLines(text);
    process.stdout.write(`${name}: ${lines}/${max ?? '?'}\n`);
    if (max === undefined || !POSITIVE.test(max)) {
      process.stderr.write(`${name}: max-lines is missing or not a positive integer\n`);
      failed = true;
    } else if (lines > Number(max)) {
      process.stderr.write(`${name}: ${lines} lines, over max-lines ${max}\n`);
      failed = true;
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
