import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: node scripts/doc-checks.mjs [root]';
const WIDTH = 90;

// Paths relative to root of the .md files in dir, or [] when dir is missing.
function mdFiles(root, dir, recursive) {
  if (!existsSync(path.join(root, dir))) return [];
  return readdirSync(path.join(root, dir), { recursive })
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(dir, name))
    .sort();
}

function widthFiles(root) {
  const design = existsSync(path.join(root, 'docs/DESIGN.md')) ? ['docs/DESIGN.md'] : [];
  return [
    ...mdFiles(root, 'skills', true),
    ...mdFiles(root, '.claude/agents', false),
    ...design,
    ...mdFiles(root, 'docs/milestones', false),
  ];
}

function widthFailures(root, rel) {
  let text;
  try {
    text = readFileSync(path.join(root, rel), 'utf8');
  } catch (err) {
    return [`${rel}: cannot read (${err.code ?? err.message})`];
  }
  const lines = text.split('\n');
  const failures = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (line.startsWith('```')) inFence = !inFence;
    const length = [...line].length;
    if (length > WIDTH && !inFence && !line.startsWith('|')) {
      failures.push(`${rel}:${i + 1}: ${length} > ${WIDTH}`);
    }
  });
  return failures;
}

// Each list: where its text is, the region markers ('' = text start or end), and what it names.
const LISTS = [
  {
    list: 'plugin.json skills',
    file: '.claude-plugin/plugin.json',
    field: (json) => json.description,
    start: '',
    end: ' skills with',
    names: 'skills',
    match: 'word',
  },
  {
    list: 'plugin.json agents',
    file: '.claude-plugin/plugin.json',
    field: (json) => json.description,
    start: 'skills with ',
    end: ' agent templates',
    names: 'agents',
    match: 'word',
  },
  {
    list: 'marketplace.json skills',
    file: '.claude-plugin/marketplace.json',
    field: (json) => json.description,
    start: 'skills: ',
    end: '',
    names: 'skills',
    match: 'word',
  },
  {
    list: 'marketplace.json plugin skills',
    file: '.claude-plugin/marketplace.json',
    field: (json) => json.plugins[0].description,
    start: '',
    end: ' skills with',
    names: 'skills',
    match: 'word',
  },
  {
    list: 'marketplace.json plugin agents',
    file: '.claude-plugin/marketplace.json',
    field: (json) => json.plugins[0].description,
    start: 'skills with ',
    end: ' agent templates',
    names: 'agents',
    match: 'word',
  },
  {
    list: 'README.md Skills',
    file: 'README.md',
    start: '## Skills',
    end: '\n## ',
    names: 'skills',
    match: 'row',
  },
  {
    list: 'README.md Agents',
    file: 'README.md',
    start: '## Agents',
    end: '\n## ',
    names: 'agents',
    match: 'row',
  },
  {
    list: 'DESIGN.md skills',
    file: 'docs/DESIGN.md',
    start: '- The skill set has',
    end: '. The skills other',
    names: 'skills',
    match: 'backtick',
  },
  {
    list: 'DESIGN.md agents',
    file: 'docs/DESIGN.md',
    start: '- The project agents are',
    end: '. The plugin ships',
    names: 'agents',
    match: 'backtick',
  },
  {
    list: 'AGENTS.md What this is',
    file: 'AGENTS.md',
    start: 'armory actor: ',
    end: '. The skills use',
    names: 'skills',
    match: 'backtick',
  },
  {
    list: 'delegate agents',
    file: 'skills/delegate/SKILL.md',
    start: '- The project agents MUST be these',
    end: '. Each card',
    names: 'agents',
    match: 'word',
  },
];

function skillNames(root) {
  const dir = path.join(root, 'skills');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => existsSync(path.join(dir, name, 'SKILL.md')));
}

function agentNames(root) {
  const dir = path.join(root, 'skills/setup/templates/agents');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -'.md'.length));
}

function listText(root, { file, field }) {
  try {
    const text = readFileSync(path.join(root, file), 'utf8');
    return field ? field(JSON.parse(text)) : text;
  } catch {
    return undefined;
  }
}

// The text from start up to end, or undefined when the start marker is missing.
function region(text, start, end) {
  const from = text.indexOf(start);
  if (from === -1) return undefined;
  const to = end === '' ? -1 : text.indexOf(end, from + start.length);
  return text.slice(from, to === -1 ? undefined : to);
}

function isNamed(text, name, match) {
  if (match === 'row') return text.split('\n').some((line) => line.startsWith(`| \`${name}\` |`));
  if (match === 'backtick') return text.includes(`\`${name}\``);
  return new RegExp(`\\b${name}\\b`).test(text);
}

function listFailures(root) {
  const names = { skills: skillNames(root).sort(), agents: agentNames(root).sort() };
  return LISTS.flatMap((spec) => {
    const text = listText(root, spec);
    const part = typeof text === 'string' ? region(text, spec.start, spec.end) : undefined;
    if (part === undefined) return [`${spec.list}: not found`];
    return names[spec.names]
      .filter((name) => !isNamed(part, name, spec.match))
      .map((name) => `${spec.list}: missing ${name}`);
  });
}

function cardBody(file) {
  return readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('model:') && !line.startsWith('effort:'))
    .join('\n');
}

function cardFailures(root) {
  const dir = path.join(root, '.claude', 'agents');
  if (!existsSync(dir)) return [];
  const failures = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const template = path.join(root, 'skills', 'setup', 'templates', 'agents', file);
    if (!existsSync(template)) continue;
    if (cardBody(path.join(dir, file)) !== cardBody(template)) {
      failures.push(`${file.slice(0, -3)}: rendered copy differs from template`);
    }
  }
  return failures;
}

function isModelLoaded(root, skill) {
  const text = readFileSync(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8');
  const front = text.startsWith('---\n') ? text.slice(4, text.indexOf('\n---', 4)) : '';
  return !/^disable-model-invocation:\s*true\s*$/m.test(front);
}

function evalCount(root, skill, kind) {
  const dir = path.join(root, 'evals');
  if (!existsSync(dir)) return 0;
  const pattern = new RegExp(`^${skill}-${kind}-\\d+$`);
  return readdirSync(dir)
    .filter((name) => pattern.test(name) && existsSync(path.join(dir, name, 'case.yaml')))
    .length;
}

// The hook injects `core`, so one load case is enough for it.
const LOAD_CASES = (skill) => (skill === 'core' ? 1 : 3);

function evalFailures(root) {
  return skillNames(root)
    .sort()
    .filter((skill) => isModelLoaded(root, skill))
    .flatMap((skill) => [
      ...(evalCount(root, skill, 'load') < LOAD_CASES(skill)
        ? [`${skill}: fewer than ${LOAD_CASES(skill)} load evals`] : []),
      ...(evalCount(root, skill, 'skip') < 1 ? [`${skill}: no skip eval`] : []),
    ]);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const root = path.resolve(args[0] ?? '.');
  const failures = [
    ...widthFiles(root).flatMap((rel) => widthFailures(root, rel)),
    ...listFailures(root),
    ...cardFailures(root),
    ...evalFailures(root),
  ];
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main();
