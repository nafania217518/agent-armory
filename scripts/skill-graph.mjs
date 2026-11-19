import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { frontEnd, parseFront, splitLines } from './frontmatter.mjs';

const USAGE = 'usage: node scripts/skill-graph.mjs [--verbose] [--build] [--mermaid | --html] [root]';
const CHECKS = ['extends', 'cycle', 'cite', 'pointer', 'type', 'card-load', 'section', 'payload'];
const TYPES = ['abstract', 'regular', 'user-only'];

// A read or usage failure that ends the run with its exit code.
class Exit extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function readLines(root, rel) {
  try {
    return splitLines(readFileSync(path.join(root, rel), 'utf8'));
  } catch (err) {
    throw new Exit(1, `${rel}: cannot read (${err.code ?? err.message})`);
  }
}

function skillNames(root) {
  const dir = path.join(root, 'skills');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => existsSync(path.join(dir, name, 'SKILL.md'))).sort();
}

// The text with fenced lines blanked, so offsets keep their line numbers, and its code spans.
function scanText(lines) {
  let inFence = false;
  const text = lines.map((line) => {
    const fence = line.trimStart().startsWith('```');
    if (fence) inFence = !inFence;
    return fence || inFence ? '' : line;
  }).join('\n');
  const spans = [...text.matchAll(/`([^`\n]+)`/g)]
    .map((m) => ({ content: m[1], start: m.index, end: m.index + m[0].length }));
  return { text, spans };
}

function lineAt(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function readSkill(root, name) {
  const rel = `skills/${name}/SKILL.md`;
  const lines = readLines(root, rel);
  const front = parseFront(lines);
  const kind = TYPES.includes(front.type) ? front.type : 'untyped';
  return { name, kind, path: rel, lines, ...scanText(lines), ...front };
}

const ABSTRACT_START = 'Abstract: load only through a skill that extends it';

function typeProblems(skill) {
  if (skill.type === null) return ['no metadata.type'];
  if (skill.kind === 'untyped') return [`invalid metadata.type ${skill.type}`];
  if (skill.kind === 'regular') return skill.flags.map((flag) => `regular skill sets ${flag}`);
  if (skill.kind === 'user-only') {
    return skill.flags.includes('disable-model-invocation: true')
      ? [] : ['user-only skill lacks disable-model-invocation: true'];
  }
  return [
    ...(skill.flags.includes('user-invocable: false') ? [] : ['abstract skill lacks user-invocable: false']),
    ...((skill.description ?? '').startsWith(ABSTRACT_START)
      ? [] : [`abstract description does not start "${ABSTRACT_START}"`]),
  ];
}

function typeReports(skills) {
  return skills.flatMap((skill) => typeProblems(skill).map((message) => report('type', skill, 1, message)));
}

function setAncestors(skills) {
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  for (const skill of skills) {
    const seen = new Set();
    const queue = [...skill.extends];
    while (queue.length > 0) {
      const next = queue.shift();
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(...byName.get(next).extends);
    }
    skill.ancestors = [...seen].sort();
  }
}

function pointerReports(skills) {
  return skills.flatMap((skill) => {
    const end = frontEnd(skill.lines);
    const body = skill.text.split('\n').slice(end > 0 ? end + 1 : 0);
    const pointers = new Set(body.map((line) => /^Load `([a-z0-9-]+)` before /.exec(line)?.[1]).filter(Boolean));
    const missing = skill.extends.filter((name) => !pointers.has(name)).sort();
    const extra = [...pointers].filter((name) => !skill.extends.includes(name)).sort();
    const parts = [
      ...(missing.length > 0 ? [`missing ${missing.join(', ')}`] : []),
      ...(extra.length > 0 ? [`extra ${extra.join(', ')}`] : []),
    ];
    return parts.length > 0 ? [report('pointer', skill, skill.extendsLine ?? 1, parts.join('; '))] : [];
  });
}

function nameTokens(node, names) {
  return node.spans.filter((span) => names.has(span.content));
}

function citeReports(skills, names) {
  return skills.flatMap((skill) => nameTokens(skill, names)
    .filter((token) => token.content !== skill.name && !skill.ancestors.includes(token.content))
    .map((token) => report('cite', skill, lineAt(skill.text, token.start),
      `\`${token.content}\` is not an ancestor of ${skill.name}`)));
}

function report(check, node, line, message, nodes = [node.name]) {
  return { check, path: node.path, line, nodes, message };
}

// Drops each extends item that names no skill, with an `extends` report for it.
function extendsReports(skills) {
  return skills.flatMap((skill) => {
    if (skill.extendsProblem) return [report('extends', skill, skill.extendsLine, skill.extendsProblem)];
    const unknown = skill.extends.filter((item) => !skills.some((other) => other.name === item));
    skill.extends = skill.extends.filter((item) => !unknown.includes(item));
    return unknown.map((item) => report('extends', skill, skill.extendsLine, `\`${item}\` names no skill`));
  });
}

// Tarjan's strongly connected components over extends.
function cyclicGroups(skills) {
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  const index = new Map();
  const low = new Map();
  const stack = [];
  const groups = [];
  const visit = (name) => {
    index.set(name, index.size);
    low.set(name, index.get(name));
    stack.push(name);
    for (const next of byName.get(name).extends) {
      if (!index.has(next)) {
        visit(next);
        low.set(name, Math.min(low.get(name), low.get(next)));
      } else if (stack.includes(next)) {
        low.set(name, Math.min(low.get(name), index.get(next)));
      }
    }
    if (low.get(name) !== index.get(name)) return;
    const group = stack.splice(stack.indexOf(name));
    if (group.length > 1 || byName.get(name).extends.includes(name)) groups.push(group.sort());
  };
  for (const skill of skills) if (!index.has(skill.name)) visit(skill.name);
  return groups;
}

function cycleReports(groups) {
  return groups.map((group) => ({ check: 'cycle', path: '', line: 0, nodes: group, message: group.join(', ') }));
}

function sortReports(reports) {
  const rank = (r) => CHECKS.indexOf(r.check);
  return reports.sort((a, b) => rank(a) - rank(b) || a.path.localeCompare(b.path) || a.line - b.line
    || a.message.localeCompare(b.message));
}

const CARDS = 'skills/setup/templates/agents';

// Line numbers of each `- MUST load` item and its indented continuation lines.
function loadLines(text) {
  const lines = new Set();
  let inLoad = false;
  text.split('\n').forEach((line, i) => {
    if (line.startsWith('- ')) inLoad = line.startsWith('- MUST load');
    else if (!/^\s+\S/.test(line) || line.trimStart().startsWith('- ')) inLoad = false;
    if (inLoad) lines.add(i + 1);
  });
  return lines;
}

function readCards(root) {
  if (!existsSync(path.join(root, CARDS))) return [];
  return readdirSync(path.join(root, CARDS)).filter((file) => file.endsWith('.md')).sort().map((file) => {
    const rel = `${CARDS}/${file}`;
    const scan = scanText(readLines(root, rel));
    return { name: file.replace(/\.md$/, ''), kind: 'card', path: rel, ...scan, loadLines: loadLines(scan.text) };
  });
}

// The `.md` files directly in each skill's `templates/`, as nodes for the section check only.
function readTemplates(root, names) {
  return names.flatMap((name) => {
    const dir = `skills/${name}/templates`;
    if (!existsSync(path.join(root, dir))) return [];
    let files;
    try {
      files = readdirSync(path.join(root, dir));
    } catch (err) {
      throw new Exit(1, `${dir}: cannot read (${err.code ?? err.message})`);
    }
    return files.filter((file) => file.endsWith('.md')).sort().map((file) => {
      const rel = `${dir}/${file}`;
      return { name, kind: 'template', path: rel, ...scanText(readLines(root, rel)) };
    });
  });
}

function cardLoadReports(cards, skills) {
  const abstract = new Set(skills.filter((skill) => skill.kind === 'abstract').map((skill) => skill.name));
  return cards.flatMap((card) => card.spans
    .filter((span) => abstract.has(span.content) && card.loadLines.has(lineAt(card.text, span.start)))
    .map((span) => report('card-load', card, lineAt(card.text, span.start),
      `${card.name} loads abstract \`${span.content}\``)));
}

function headings(text) {
  return text.split('\n').flatMap((line) => {
    const numbered = /^## (\d+)\. (.+)$/.exec(line) ?? /^### (\d+\.\d+)\. (.+)$/.exec(line);
    if (numbered) return [{ number: numbered[1], name: numbered[2].trim() }];
    const plain = /^#{2,3} (.+)$/.exec(line);
    return plain ? [{ number: null, name: plain[1].trim() }] : [];
  });
}

const CHAIN = [', ', ' and ', ', and '];
const NEXT_TO_SPAN = /^[ \t(]*(\n[ \t(]*)?$/;

// The owner of the `§` at offset: a skill, the node's own file, or a file path that is not resolved.
// A template's own refs go to its skill, as a template has no sections of its own.
function refOwner(node, names, offset, previous) {
  if (previous?.end != null && CHAIN.includes(node.text.slice(previous.end, offset).replace(/\s+/g, ' '))) {
    return previous.owner;
  }
  const own = node.kind === 'template' ? { name: node.name } : { name: node.name, node };
  const span = node.spans.findLast((s) => s.end <= offset);
  if (!span || !NEXT_TO_SPAN.test(node.text.slice(span.end, offset))) return own;
  if (span.content.includes('/') || span.content.endsWith('.md')) return { file: span.content };
  return names.has(span.content) ? { name: span.content } : own;
}

function insideSpan(node, offset) {
  return node.spans.some((span) => span.start < offset && offset < span.end);
}

// Each `§` ref of a node, with its owner and, for a numbered ref or range, its section numbers.
function parseRefs(node, byName) {
  const refs = [];
  for (const m of node.text.matchAll(/§/g)) {
    if (insideSpan(node, m.index) || m.index < (refs.at(-1)?.end ?? 0)) continue;
    const owner = refOwner(node, byName, m.index, refs.at(-1));
    const line = lineAt(node.text, m.index);
    const numbered = /^(\d+(?:\.\d+)?)(?:–§(\d+(?:\.\d+)?))?/.exec(node.text.slice(m.index + 1));
    if (!numbered) {
      refs.push({ owner, line, ...nameRef(node.text, m.index + 1, owner, byName) });
      continue;
    }
    const end = m.index + 1 + numbered[0].length;
    const [, start, last] = numbered;
    refs.push({ owner, line, end, numbers: last === undefined ? [start] : rangeNumbers(start, last), text: numbered[0] });
  }
  return refs;
}

// The sections of `§start–§last`, or null for a range that is not valid.
function rangeNumbers(start, last) {
  if (start.includes('.') || last.includes('.') || Number(start) >= Number(last)) return null;
  return Array.from({ length: Number(last) - Number(start) + 1 }, (_, i) => String(Number(start) + i));
}

function ownerHeadings(owner, byName) {
  return (owner.node ?? byName.get(owner.name)).headings;
}

// A regex for words at the start of a text, where any run of whitespace stands for one space.
function wordsRegex(words) {
  return new RegExp(`^${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+')}`);
}

// Headings of an exact match: the longest heading name the text starts with, ending at a word end.
function exactMatch(text, list) {
  const found = list.map((h) => ({ h, m: wordsRegex(h.name.split(' ')).exec(text) }))
    .filter(({ m }) => m && !/[A-Za-z0-9-]/.test(text[m[0].length] ?? ''));
  const longest = Math.max(...found.map(({ h }) => h.name.length));
  const best = found.filter(({ h }) => h.name.length === longest);
  return best.length === 0 ? null : { hits: best.map(({ h }) => h), shown: best[0].h.name, length: best[0].m[0].length };
}

// Headings of a prefix match: the longest leading run of the ref's words that starts a heading.
function prefixMatch(text, list) {
  const words = text.split(/[,.;:)§`]/)[0].replace(/\s+/g, ' ').trimEnd().split(' ');
  for (let k = words.length; k > 0; k--) {
    const lead = words.slice(0, k);
    const hits = list.filter((h) => lead.every((word, i) => h.name.split(' ')[i] === word));
    if (hits.length > 0) return { hits, shown: lead.join(' '), length: wordsRegex(lead).exec(text)[0].length };
  }
  return { hits: [], shown: words.join(' '), length: null };
}

function sectionName(h) {
  return h.number === null ? `§${h.name}` : `§${h.number}`;
}

// A `§<name>` ref at offset: its shown name, its report suffix, its end and its resolved number.
function nameRef(text, offset, owner, byName) {
  const rest = text.slice(offset);
  if (owner.file !== undefined) return { end: null, numbers: [] };
  const list = ownerHeadings(owner, byName);
  const match = exactMatch(rest, list) ?? prefixMatch(rest, list);
  const end = match.length === null ? null : offset + match.length;
  const [hit] = match.hits;
  if (match.hits.length > 1) {
    return { name: match.shown, end, numbers: [],
      suffix: `, ambiguous in ${owner.name}: ${match.hits.map(sectionName).join(', ')}` };
  }
  if (!hit) return { name: match.shown, end, numbers: [], suffix: `, matches no heading in ${owner.name}` };
  if (hit.number === null) {
    return { name: match.shown, end, numbers: [], suffix: `, matches an unnumbered heading in ${owner.name}` };
  }
  return { name: match.shown, end, numbers: [hit.number], suffix: `, resolves to §${hit.number}` };
}

function sectionReports(nodes, byName) {
  return nodes.flatMap((node) => node.refs.flatMap((ref) => {
    if (ref.owner.file !== undefined) return [];
    if (ref.name !== undefined) {
      return [report('section', node, ref.line, `§${ref.name} is a name reference${ref.suffix}`)];
    }
    if (ref.numbers === null) return [report('section', node, ref.line, `§${ref.text} is not a valid range`)];
    const numbers = new Set(ownerHeadings(ref.owner, byName).map((h) => h.number));
    return ref.numbers.filter((n) => !numbers.has(n))
      .map((n) => report('section', node, ref.line, `§${n} has no heading in ${ref.owner.name}`));
  }));
}

// Error lines, outside CHECKS: a card must not load a main-session skill.
function cardMainErrors(cards, skills) {
  const main = new Set(skills.filter((skill) => skill.name === 'core-main' || skill.ancestors.includes('core-main'))
    .map((skill) => skill.name));
  return cards.flatMap((card) => card.spans
    .filter((span) => main.has(span.content) && card.loadLines.has(lineAt(card.text, span.start)))
    .map((span) => `${card.path}:${lineAt(card.text, span.start)}: card-main: ${card.name} loads \`${span.content}\`, `
      + 'which is or extends `core-main`'));
}

// The graph model: nodes, cyclic groups and reports.
function buildGraph(root) {
  const names = skillNames(root);
  if (names.length === 0) throw new Exit(1, `no skills/*/SKILL.md in ${root}`);
  const skills = names.map((name) => readSkill(root, name));
  const cards = readCards(root);
  const templates = readTemplates(root, names);
  const reports = extendsReports(skills);
  const groups = cyclicGroups(skills);
  reports.push(...cycleReports(groups));
  setAncestors(skills);
  reports.push(...citeReports(skills, new Set(names)), ...pointerReports(skills), ...typeReports(skills),
    ...cardLoadReports(cards, skills));
  const nodes = [...skills, ...cards];
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  for (const node of [...nodes, ...templates]) node.headings = headings(node.text);
  for (const node of [...nodes, ...templates]) node.refs = parseRefs(node, byName);
  reports.push(...sectionReports([...nodes, ...templates], byName));
  sortReports(reports);
  for (const node of nodes) node.reports = reports.filter((r) => r.nodes.includes(node.name));
  const errors = cardMainErrors(cards, skills);
  return { nodes, edges: buildEdges(nodes, byName, groups), groups, reports, errors };
}

function compareSections(a, b) {
  const [a1, a2 = 0] = a.split('.').map(Number);
  const [b1, b2 = 0] = b.split('.').map(Number);
  return a1 - b1 || a2 - b2;
}

// One edge per source node and target skill, with its section set, kind and problem mark.
function buildEdges(nodes, byName, groups) {
  const edges = new Map();
  const edge = (source, target) => {
    const key = `${source.name}\n${target}`;
    if (!edges.has(key)) edges.set(key, { source: source.name, target, sections: new Set(), kind: 'cite' });
    return edges.get(key);
  };
  for (const node of nodes) {
    const targets = [...(node.extends ?? []), ...node.spans.map((s) => s.content).filter((c) => byName.has(c))];
    for (const target of targets.filter((t) => t !== node.name)) edge(node, target);
    for (const ref of node.refs.filter((r) => r.owner.name !== node.name && byName.has(r.owner.name))) {
      for (const n of ref.numbers ?? []) edge(node, ref.owner.name).sections.add(n);
    }
    for (const span of node.spans.filter((s) => node.loadLines?.has(lineAt(node.text, s.start)))) {
      if (byName.has(span.content)) edge(node, span.content).kind = 'load';
    }
  }
  const nodeByName = new Map(nodes.map((node) => [node.name, node]));
  const sameGroup = (a, b) => groups.some((group) => group.includes(a) && group.includes(b));
  return [...edges.values()].map((e) => {
    const source = nodeByName.get(e.source);
    const problem = source.kind !== 'card' && source.extends.includes(e.target) && sameGroup(e.source, e.target)
      ? 'cycle'
      : source.kind !== 'card' && !source.ancestors.includes(e.target) ? 'cite'
        : e.kind === 'load' && byName.get(e.target).kind === 'abstract' ? 'card-load' : null;
    return { ...e, sections: [...e.sections].sort(compareSections), problem };
  }).sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
}

function reportLine(r) {
  return r.check === 'cycle' ? `cycle: ${r.message}` : `${r.path}:${r.line}: ${r.check}: ${r.message}`;
}

function countLine(reports) {
  return CHECKS.map((check) => [check, reports.filter((r) => r.check === check).length])
    .filter(([, n]) => n > 0)
    .map(([check, n]) => `${check} ${n}`)
    .join(', ');
}

function summary(reports) {
  const total = `skill-graph: ${reports.length} reports${reports.length > 0 ? ' (exit 1)' : ''}`;
  const checks = CHECKS.map((check) => `${check} ${reports.filter((r) => r.check === check).length}`).join(', ');
  const nodes = [...new Set(reports.flatMap((r) => r.nodes))].sort()
    .map((node) => `${node}: ${countLine(reports.filter((r) => r.nodes.includes(node)))}`);
  return [total, checks, ...nodes];
}

const DRAWS = ['--mermaid', '--html'];

function mermaidId(node) {
  return `${node.kind === 'card' ? 'c' : 's'}_${node.name.replaceAll('-', '_')}`;
}

function mermaid({ nodes, edges }) {
  const byName = new Map(nodes.map((node) => [node.name, node]));
  const id = (name) => mermaidId(byName.get(name));
  const shape = (node) => (node.kind === 'card' ? `(["${node.name}"])` : `["${node.name}"]`);
  return [
    'flowchart TD',
    ...nodes.map((node) => `  ${mermaidId(node)}${shape(node)}`),
    ...edges.map((e) => `  ${id(e.source)} -->${e.sections.length ? `|"${e.sections.map((n) => `§${n}`).join(', ')}"|` : ''} ${id(e.target)}`),
    ...edges.flatMap((e, i) => (e.problem ? [`  linkStyle ${i} stroke:#d33,stroke-width:2px`] : [])),
    ...nodes.filter((node) => node.kind === 'abstract').map((node) => `  class ${mermaidId(node)} abstract`),
    '  classDef abstract stroke-dasharray: 5 5',
  ].join('\n') + '\n';
}

const STEP_X = 180;
const STEP_Y = 110;

// Layout units: each cyclic group of two or more members, and each other skill alone.
function layoutUnits(skills, groups) {
  const unitOf = new Map();
  const units = [];
  for (const group of groups.filter((g) => g.length > 1)) {
    units.push(group);
    for (const name of group) unitOf.set(name, group);
  }
  for (const skill of skills.filter((s) => !unitOf.has(s.name))) {
    units.push([skill.name]);
    unitOf.set(skill.name, units.at(-1));
  }
  return { units, unitOf };
}

// A group's circle radius, so neighbours sit one step apart; 0 for one skill.
function unitRadius(unit) {
  return unit.length > 1 ? STEP_X / (2 * Math.sin(Math.PI / unit.length)) : 0;
}

// x and y per node: units in rank rows, parents above, cards one row below the last skill row.
function layout(nodes, groups) {
  const skills = nodes.filter((node) => node.kind !== 'card');
  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  const { units, unitOf } = layoutUnits(skills, groups);
  const ranks = new Map();
  const rank = (unit) => {
    if (!ranks.has(unit)) {
      const parents = new Set(unit.flatMap((name) => byName.get(name).extends).map((name) => unitOf.get(name))
        .filter((parent) => parent && parent !== unit));
      ranks.set(unit, Math.max(-1, ...[...parents].map(rank)) + 1);
    }
    return ranks.get(unit);
  };
  const rows = [];
  for (const unit of units) (rows[rank(unit)] ??= []).push(unit);
  const places = new Map();
  let top = 0;
  for (const row of rows.filter(Boolean)) {
    row.sort((a, b) => a[0].localeCompare(b[0]));
    const height = Math.max(...row.map((unit) => 2 * unitRadius(unit) + STEP_Y));
    let left = 0;
    for (const unit of row) {
      const radius = unitRadius(unit);
      const centre = { x: left + radius + STEP_X / 2, y: top + height / 2 };
      [...unit].sort().forEach((name, k) => {
        const angle = -Math.PI / 2 + (k * 2 * Math.PI) / unit.length;
        places.set(name, { x: centre.x + radius * Math.cos(angle), y: centre.y + radius * Math.sin(angle) });
      });
      left += 2 * radius + STEP_X;
    }
    top += height;
  }
  nodes.filter((node) => node.kind === 'card')
    .forEach((card, i) => places.set(card.name, { x: STEP_X / 2 + i * STEP_X, y: top + STEP_Y / 2 }));
  return places;
}

function graphData({ nodes, edges, groups }) {
  const places = layout(nodes, groups);
  return {
    nodes: nodes.map((node) => ({
      name: node.name,
      kind: node.kind,
      extends: node.extends ?? [],
      ancestors: node.ancestors ?? [],
      children: nodes.filter((child) => child.extends?.includes(node.name)).map((child) => child.name),
      ...places.get(node.name),
      reports: node.reports,
    })),
    edges: edges.map(({ source, target, sections, problem, kind }) => ({ source, target, sections, problem, kind })),
  };
}

function htmlPage(graph) {
  const data = JSON.stringify(graphData(graph)).replaceAll('<', '\\u003c');
  return PAGE.replace('/*GRAPH-DATA*/', () => data);
}

// Writes the page to a new temp folder and returns its path.
function writeHtml(graph) {
  const page = htmlPage(graph);
  try {
    const file = path.join(mkdtempSync(path.join(tmpdir(), 'skill-graph-')), 'graph.html');
    writeFileSync(file, page);
    return file;
  } catch (err) {
    throw new Exit(1, `html: ${err.code}`);
  }
}

const PAGE = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skill graph</title>
<style>
:root {
  color-scheme: light dark;
  --bg: #f6f6f4; --fg: #1c1e22; --muted: #646870; --panel: #fff; --border: #d8d9dc;
  --node: #fff; --node-stroke: #6f747d; --card: #eef3fb; --card-stroke: #4f6fa8;
  --edge: #9a9ea6; --hl: #2b5fd9; --warn: #d33; --label-bg: #f6f6f4;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #16181c; --fg: #e5e6e9; --muted: #a0a4ac; --panel: #1e2127; --border: #363a43;
    --node: #23272e; --node-stroke: #8d929c; --card: #1f2a3b; --card-stroke: #7e9fd8;
    --edge: #6b7079; --hl: #7ea6ff; --warn: #ff6b6b; --label-bg: #16181c;
  }
}
* { box-sizing: border-box; }
body { margin: 0; font: 14px/1.4 system-ui, sans-serif; background: var(--bg); color: var(--fg); }
.layout { display: grid; grid-template-columns: 220px 1fr 300px; height: 100vh; }
aside { background: var(--panel); border-color: var(--border); border-style: solid; border-width: 0 1px;
  padding: 12px; overflow: auto; }
h1 { font-size: 16px; margin: 0 0 10px; }
h2 { font-size: 14px; margin: 12px 0 4px; }
label { display: block; margin: 4px 0; }
input[type=search] { width: 100%; margin: 8px 0; padding: 4px 6px; }
ul { list-style: none; margin: 0; padding: 0; }
#list button { width: 100%; text-align: left; background: none; border: 0; color: inherit; padding: 2px 4px;
  font: inherit; cursor: pointer; }
#list button.warn { color: var(--warn); }
#list button:hover, #list button:focus { background: var(--bg); }
main { position: relative; overflow: hidden; }
svg { width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
svg.panning { cursor: grabbing; }
.bar { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; }
.bar button { min-width: 32px; padding: 4px 8px; font: inherit; }
.node { cursor: pointer; }
.node rect { fill: var(--node); stroke: var(--node-stroke); stroke-width: 1.5; }
.node.abstract rect { stroke-dasharray: 5 4; }
.node.card rect { fill: var(--card); stroke: var(--card-stroke); }
.node text { fill: var(--fg); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
.node.warn rect { stroke: var(--warn); stroke-width: 2.5; }
.node:focus { outline: none; }
.node:focus rect, .node.on rect { stroke: var(--hl); stroke-width: 3; }
.edge path.line { fill: none; stroke: var(--edge); stroke-width: 1.3; }
.edge.load path.line { stroke-width: 2; }
.edge.warn path.line { stroke: var(--warn); stroke-width: 2; }
.edge.on path.line { stroke: var(--hl); stroke-width: 2.5; }
.edge path.hit { fill: none; stroke: transparent; stroke-width: 12; }
.edge rect { fill: var(--label-bg); }
.edge text { fill: var(--muted); font-size: 11px; text-anchor: middle; dominant-baseline: central; }
.hidden { display: none; }
.focus .node:not(.on), .focus .edge:not(.on) { opacity: 0.15; }
.edge.label { pointer-events: none; }
.muted { color: var(--muted); }
.warn-text { color: var(--warn); }
.swatch { display: inline-block; width: 22px; height: 12px; margin-right: 6px; vertical-align: middle;
  border: 1.5px solid var(--node-stroke); background: var(--node); }
.swatch.abstract { border-style: dashed; }
.swatch.card { background: var(--card); border-color: var(--card-stroke); border-radius: 6px; }
.swatch.warn { border-color: var(--warn); }
.swatch.hl { border-color: var(--hl); }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; grid-template-rows: auto 60vh auto; height: auto; }
  aside { border-width: 1px 0; }
}
</style>
</head>
<body>
<div class="layout">
<aside>
  <h1>Skill graph</h1>
  <label><input type="checkbox" id="show-cards" checked> Cards</label>
  <label><input type="checkbox" id="show-abstract" checked> Abstract skills</label>
  <label><input type="checkbox" id="problems-only"> Problems only</label>
  <input type="search" id="search" placeholder="Search by name" aria-label="Search by name">
  <ul id="list"></ul>
</aside>
<main>
  <svg id="chart" aria-label="Skill graph">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--edge)"></path>
      </marker>
      <marker id="arrow-warn" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--warn)"></path>
      </marker>
      <marker id="arrow-on" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--hl)"></path>
      </marker>
    </defs>
    <g id="viewport"><g id="edges"></g><g id="nodes"></g><g id="labels"></g></g>
  </svg>
  <div class="bar">
    <button type="button" id="zoom-out" aria-label="Zoom out">&minus;</button>
    <button type="button" id="zoom-in" aria-label="Zoom in">+</button>
    <button type="button" id="fit">Fit</button>
  </div>
</main>
<aside id="details" aria-live="polite"></aside>
</div>
<script type="application/json" id="graph-data">/*GRAPH-DATA*/</script>
<script>
(function () {
  var data = JSON.parse(document.getElementById('graph-data').textContent);
  var NS = 'http' + '://www.w3.org/2000/svg';
  var W = 130, H = 34;
  var byName = {};
  data.nodes.forEach(function (n) { byName[n.name] = n; n.warn = false; });
  data.edges.forEach(function (e) {
    if (e.problem) { byName[e.source].warn = true; byName[e.target].warn = true; }
  });
  var svg = document.getElementById('chart');
  var viewport = document.getElementById('viewport');
  var details = document.getElementById('details');
  var view = { x: 0, y: 0, k: 1 };
  var pinned = null;
  var hovered = null;

  function el(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function sectionLabel(e) {
    return e.sections.map(function (n) { return '§' + n; }).join(', ');
  }

  var BEND = 0.25;

  // Point where the line from the box centre toward b leaves the box.
  function clip(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y;
    var t = Math.min(dx ? (W / 2) / Math.abs(dx) : Infinity, dy ? (H / 2) / Math.abs(dy) : Infinity);
    return { x: a.x + dx * t, y: a.y + dy * t };
  }

  data.edges.forEach(function (e) {
    var a = byName[e.source], b = byName[e.target];
    // Bow left of the direction, so mutual pairs split and collinear edges of other lengths part.
    var dx = b.x - a.x, dy = b.y - a.y;
    var c = { x: (a.x + b.x) / 2 + dy * BEND, y: (a.y + b.y) / 2 - dx * BEND };
    var p = clip(a, c), q = clip(b, c);
    var d = 'M' + p.x + ',' + p.y + ' Q' + c.x + ',' + c.y + ' ' + q.x + ',' + q.y;
    var g = el('g', { 'class': 'edge ' + e.kind + (e.problem ? ' warn' : '') }, document.getElementById('edges'));
    el('path', { 'class': 'hit', d: d }, g);
    e.line = el('path', { 'class': 'line', d: d, 'marker-end': e.problem ? 'url(#arrow-warn)' : 'url(#arrow)' }, g);
    var title = el('title', {}, g);
    title.textContent = e.source + ' → ' + e.target + (e.problem ? ' (' + e.problem + ')' : '');
    if (e.sections.length) {
      var label = sectionLabel(e);
      var mx = (p.x + 2 * c.x + q.x) / 4, my = (p.y + 2 * c.y + q.y) / 4, w = label.length * 6.5 + 8;
      e.label = el('g', { 'class': 'edge label' }, document.getElementById('labels'));
      el('rect', { x: mx - w / 2, y: my - 8, width: w, height: 16, rx: 3 }, e.label);
      el('text', { x: mx, y: my }, e.label).textContent = label;
    }
    e.el = g;
  });

  data.nodes.forEach(function (n) {
    var g = el('g', { 'class': 'node ' + n.kind + (n.warn ? ' warn' : ''), tabindex: 0, role: 'button',
      'aria-label': n.name + ', ' + n.kind, transform: 'translate(' + n.x + ',' + n.y + ')' },
      document.getElementById('nodes'));
    el('rect', { x: -W / 2, y: -H / 2, width: W, height: H, rx: n.kind === 'card' ? H / 2 : 4 }, g);
    el('text', {}, g).textContent = n.name;
    g.addEventListener('mouseenter', function () { hovered = n.name; render(); });
    g.addEventListener('mouseleave', function () { hovered = null; render(); });
    g.addEventListener('click', function (ev) { ev.stopPropagation(); if (!moved) pin(n.name); });
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pin(n.name); }
    });
    n.el = g;
  });

  var list = document.getElementById('list');
  data.nodes.forEach(function (n) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = n.name + (n.kind === 'card' ? ' (card)' : '');
    if (n.warn) b.className = 'warn';
    b.addEventListener('click', function () { pin(n.name); });
    li.appendChild(b);
    list.appendChild(li);
    n.item = li;
  });

  function pin(name) { pinned = pinned === name ? null : name; render(); }

  // The selected node, its parents, its children and its whole ancestor chain.
  function marked(name) {
    var n = byName[name];
    var on = {};
    [name].concat(n.extends, n.children, n.ancestors).forEach(function (m) { on[m] = true; });
    return on;
  }

  function visible(n, query) {
    if (n.kind === 'card' && !document.getElementById('show-cards').checked) return false;
    if (n.kind === 'abstract' && !document.getElementById('show-abstract').checked) return false;
    if (document.getElementById('problems-only').checked && !n.warn) return false;
    return n.name.toLowerCase().indexOf(query) !== -1;
  }

  function render() {
    var query = document.getElementById('search').value.trim().toLowerCase();
    var selected = hovered || pinned;
    var on = selected ? marked(selected) : {};
    var chain = selected ? [selected].concat(byName[selected].ancestors) : [];
    document.body.classList.toggle('focus', !!selected);
    data.edges.forEach(function (e) {
      e.lit = !!selected && (e.source === selected || e.target === selected
        || (chain.indexOf(e.source) !== -1 && byName[e.source].extends.indexOf(e.target) !== -1));
      if (e.lit) { on[e.source] = true; on[e.target] = true; }
    });
    data.nodes.forEach(function (n) {
      var show = visible(n, query);
      n.shown = show;
      n.el.classList.toggle('hidden', !show);
      n.item.classList.toggle('hidden', !show);
      n.el.classList.toggle('on', !!on[n.name]);
    });
    data.edges.forEach(function (e) {
      var show = byName[e.source].shown && byName[e.target].shown;
      var lit = e.lit;
      [e.el, e.label].filter(Boolean).forEach(function (g) { g.classList.toggle('hidden', !show); g.classList.toggle('on', lit); });
      e.line.setAttribute('marker-end', lit ? 'url(#arrow-on)' : e.problem ? 'url(#arrow-warn)' : 'url(#arrow)');
    });
    showDetails(selected);
  }

  function add(parent, tag, text, cls) {
    var node = document.createElement(tag);
    node.textContent = text;
    if (cls) node.className = cls;
    parent.appendChild(node);
    return node;
  }

  function edgeList(title, edges, other) {
    add(details, 'h2', title + ' (' + edges.length + ')');
    var ul = add(details, 'ul', '');
    edges.forEach(function (e) {
      var text = other(e) + ' ' + e.kind + (e.sections.length ? ' ' + sectionLabel(e) : '')
        + (e.problem ? ' [' + e.problem + ']' : '');
      add(ul, 'li', text, e.problem ? 'warn-text' : '');
    });
  }

  function legend() {
    add(details, 'h1', 'Legend');
    [['', 'Skill'], ['abstract', 'Abstract skill (dashed)'], ['card', 'Agent card'],
      ['warn', 'Problem: cycle, cite or card-load'], ['hl', 'Selected, parents, children, ancestors']]
      .forEach(function (row) {
        var p = add(details, 'p', '');
        add(p, 'span', '', 'swatch ' + row[0]);
        p.appendChild(document.createTextNode(row[1]));
      });
    add(details, 'p', 'Hover a node to inspect it; click to pin. Escape or a click on the background clears. '
      + 'Drag pans, the wheel zooms.', 'muted');
  }

  function showDetails(name) {
    details.textContent = '';
    if (!name) { legend(); return; }
    var n = byName[name];
    add(details, 'h1', n.name);
    add(details, 'p', 'kind: ' + n.kind);
    add(details, 'p', 'extends: ' + (n.extends.join(', ') || 'none'));
    if (n.kind !== 'card') add(details, 'p', 'ancestors: ' + (n.ancestors.join(', ') || 'none'), 'muted');
    edgeList('Edges out', data.edges.filter(function (e) { return e.source === name; }),
      function (e) { return '→ ' + e.target; });
    edgeList('Edges in', data.edges.filter(function (e) { return e.target === name; }),
      function (e) { return '← ' + e.source; });
    add(details, 'h2', 'Reports (' + n.reports.length + ')');
    var ul = add(details, 'ul', '');
    n.reports.forEach(function (r) {
      add(ul, 'li', r.check === 'cycle' ? 'cycle: ' + r.message
        : r.path + ':' + r.line + ': ' + r.check + ': ' + r.message, 'warn-text');
    });
  }

  function apply() {
    viewport.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.k + ')');
  }

  function fit() {
    var xs = data.nodes.map(function (n) { return n.x; }), ys = data.nodes.map(function (n) { return n.y; });
    var minX = Math.min.apply(null, xs) - W, maxX = Math.max.apply(null, xs) + W;
    var minY = Math.min.apply(null, ys) - H * 2, maxY = Math.max.apply(null, ys) + H * 2;
    var box = svg.getBoundingClientRect();
    view.k = Math.min(box.width / (maxX - minX), box.height / (maxY - minY), 2);
    view.x = (box.width - (maxX - minX) * view.k) / 2 - minX * view.k;
    view.y = (box.height - (maxY - minY) * view.k) / 2 - minY * view.k;
    apply();
  }

  // Zoom by factor around the screen point (px, py).
  function zoom(factor, px, py) {
    var k = Math.max(0.1, Math.min(5, view.k * factor));
    view.x = px - (px - view.x) * (k / view.k);
    view.y = py - (py - view.y) * (k / view.k);
    view.k = k;
    apply();
  }

  var drag = null, moved = false;
  svg.addEventListener('pointerdown', function (ev) {
    drag = { x: ev.clientX, y: ev.clientY, vx: view.x, vy: view.y };
    moved = false;
  });
  window.addEventListener('pointermove', function (ev) {
    if (!drag) return;
    var dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
    if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    moved = true;
    svg.classList.add('panning');
    view.x = drag.vx + dx;
    view.y = drag.vy + dy;
    apply();
  });
  window.addEventListener('pointerup', function () { drag = null; svg.classList.remove('panning'); });
  svg.addEventListener('click', function () { if (!moved) { pinned = null; render(); } });
  svg.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    var box = svg.getBoundingClientRect();
    zoom(Math.exp(-ev.deltaY * 0.002),ev.clientX - box.left, ev.clientY - box.top);
  }, { passive: false });
  function zoomCenter(factor) {
    var box = svg.getBoundingClientRect();
    zoom(factor, box.width / 2, box.height / 2);
  }
  document.getElementById('zoom-in').addEventListener('click', function () { zoomCenter(1.25); });
  document.getElementById('zoom-out').addEventListener('click', function () { zoomCenter(0.8); });
  document.getElementById('fit').addEventListener('click', fit);
  window.addEventListener('resize', fit);
  window.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { pinned = null; hovered = null; render(); }
  });
  ['show-cards', 'show-abstract', 'problems-only', 'search'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', render);
  });

  render();
  fit();
})();
</script>
</body>
</html>
`;

const MARKERS = { core: 'armory-core <version>', 'core-main': 'armory-core-main <version>' };
const DISCLAIMER = 'A subagent MUST skip this skill: its rules are for the main session only.';
const MAIN_ONLY = ' (main session only)';
const WARN_AT = 9000;
// The host swaps a hook output over this size for a file path and a preview.
const HOST_LIMIT = 10000;

function checkMarkers(skills) {
  for (const name of Object.keys(MARKERS)) {
    const skill = skills.get(name);
    if (skill.lines.filter((line) => line === MARKERS[name]).length !== 1) {
      throw new Exit(1, `${skill.path}: needs one marker line "${MARKERS[name]}"`);
    }
  }
  for (const skill of skills.values()) {
    const i = skill.lines.findIndex((line) => line.startsWith('armory-core') && line !== MARKERS[skill.name]);
    if (i >= 0) throw new Exit(1, `${skill.path}:${i + 1}: marker line outside its skill`);
  }
}

function readVersion(root) {
  const rel = '.claude-plugin/plugin.json';
  let text;
  try {
    text = readFileSync(path.join(root, rel), 'utf8');
  } catch (err) {
    throw new Exit(1, `${rel}: cannot read (${err.code ?? err.message})`);
  }
  let version;
  try {
    version = JSON.parse(text)?.version;
  } catch {
    version = undefined;
  }
  if (typeof version !== 'string' || version === '') throw new Exit(1, `${rel}: no version`);
  return version;
}

// The lines after the frontmatter, without leading and trailing empty lines, as text ending in one newline.
function payloadBody(lines) {
  const end = frontEnd(lines);
  const body = lines.slice(end > 0 ? end + 1 : 0);
  while (body.length > 0 && body[0] === '') body.shift();
  while (body.length > 0 && body.at(-1) === '') body.pop();
  return `${body.join('\n')}\n`;
}

function fillMarker(lines, name, version) {
  return lines.map((line) => (line === MARKERS[name] ? MARKERS[name].replace('<version>', version) : line));
}

// Drops the head that the core body covers, and the disclaimer with its empty line.
function mainOnlyLines(lines) {
  const heading = lines.indexOf('# core-main');
  return lines.slice(Math.max(heading, 0))
    .filter((line, i, kept) => line !== DISCLAIMER && !(line === '' && kept[i - 1] === DISCLAIMER))
    .map((line) => (line.startsWith('## ') && line.endsWith(MAIN_ONLY) ? line.slice(0, -MAIN_ONLY.length) : line));
}

// Reads core and core-main afresh, so a missing file names itself even when the graph skipped it.
function buildPayloads(root, graphSkills) {
  const skills = new Map(graphSkills.map((skill) => [skill.name, skill]));
  for (const name of Object.keys(MARKERS)) {
    const rel = `skills/${name}/SKILL.md`;
    skills.set(name, { ...skills.get(name), name, path: rel, lines: readLines(root, rel) });
  }
  checkMarkers(skills);
  const version = readVersion(root);
  const agent = payloadBody(fillMarker(skills.get('core').lines, 'core', version));
  const main = `${agent}\n${payloadBody(mainOnlyLines(fillMarker(skills.get('core-main').lines, 'core-main', version)))}`;
  return { main, agent };
}

function sizeWarnings(payloads) {
  return ['main', 'agent'].flatMap((which) => {
    const n = payloads[which].length;
    if (n > HOST_LIMIT) {
      return [`skill-graph: warning: ${which} payload is ${n} characters, over ${HOST_LIMIT}; `
        + 'the host swaps it for a file path and a 2000-character preview'];
    }
    return n > WARN_AT ? [`skill-graph: warning: ${which} payload is ${n} characters, over ${WARN_AT}`] : [];
  });
}

function writeFileOrExit(root, rel, text) {
  try {
    writeFileSync(path.join(root, rel), text);
  } catch (err) {
    throw new Exit(1, `${rel}: cannot write (${err.code ?? err.message})`);
  }
}

function payloadFiles({ main, agent }) {
  const json = { hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext: agent } };
  return [['hooks/agent-payload.json', `${JSON.stringify(json)}\n`], ['hooks/main-payload.md', main]];
}

function writePayloads(root, { main, agent }) {
  try {
    mkdirSync(path.join(root, 'hooks'), { recursive: true });
  } catch (err) {
    throw new Exit(1, `hooks: cannot write (${err.code ?? err.message})`);
  }
  for (const [rel, text] of payloadFiles({ main, agent })) writeFileOrExit(root, rel, text);
}

// One report per payload file whose bytes differ from the build, or that cannot be read.
function staleReports(root, payloads) {
  return payloadFiles(payloads).flatMap(([rel, text]) => {
    const report = (message) => [{ check: 'payload', path: rel, line: 1, nodes: [], message }];
    let bytes;
    try {
      bytes = readFileSync(path.join(root, rel));
    } catch (err) {
      return report(`cannot read (${err.code ?? err.message})`);
    }
    return bytes.equals(Buffer.from(text)) ? [] : report('differs from the build');
  });
}

function errorLines(errors) {
  return errors.length > 0 ? [...errors, `skill-graph: ${errors.length} errors (exit 1)`] : [];
}

function parseArgs(args) {
  const options = { verbose: false, build: false, draw: null, root: null };
  for (const arg of args) {
    if (arg === '--verbose') options.verbose = true;
    else if (arg === '--build') options.build = true;
    else if (DRAWS.includes(arg) && options.draw === null) options.draw = arg;
    else if (arg.startsWith('-') || options.root !== null) throw new Exit(2, USAGE);
    else options.root = arg;
  }
  return { ...options, root: options.root ?? '.' };
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const graph = buildGraph(options.root);
    const hasCore = existsSync(path.join(options.root, 'skills/core/SKILL.md'));
    const skills = graph.nodes.filter((node) => node.kind !== 'card');
    const payloads = options.build || hasCore ? buildPayloads(options.root, skills) : null;
    if (options.build) writePayloads(options.root, payloads);
    if (payloads && !options.build) {
      graph.reports.push(...staleReports(options.root, payloads));
      sortReports(graph.reports);
    }
    const lines = [...(options.verbose ? graph.reports.map(reportLine) : []), ...summary(graph.reports),
      ...(payloads ? sizeWarnings(payloads) : []), ...errorLines(graph.errors)];
    process.stderr.write(`${lines.join('\n')}\n`);
    if (options.draw === '--mermaid') process.stdout.write(mermaid(graph));
    if (options.draw === '--html') process.stdout.write(`${writeHtml(graph)}\n`);
    if (graph.errors.length > 0 || graph.reports.length > 0) process.exitCode = 1;
  } catch (err) {
    if (!(err instanceof Exit)) throw err;
    process.stderr.write(`${err.message}\n`);
    process.exit(err.code);
  }
}

main();
