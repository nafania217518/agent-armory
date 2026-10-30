import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: node scripts/bump-version.mjs <major|minor|patch>';
const PARTS = ['major', 'minor', 'patch'];
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function bump(version, part) {
  const [major, minor, patch] = version.match(VERSION).slice(1).map(Number);
  if (part === 'major') return `${major + 1}.0.0`;
  if (part === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function main() {
  const part = process.argv[2];
  if (!PARTS.includes(part)) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const file = path.join(process.cwd(), '.claude-plugin', 'plugin.json');
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    fail(`cannot read ${file}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(text);
  } catch {
    fail(`invalid JSON in ${file}`);
  }
  if (typeof manifest?.version !== 'string' || !VERSION.test(manifest.version)) {
    fail(`version is not major.minor.patch in ${file}`);
  }
  manifest.version = bump(manifest.version, part);
  writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
  process.stdout.write(`${manifest.version}\n`);
}

main();
