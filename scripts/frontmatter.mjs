const NAME = /^[a-z0-9-]+$/;

export function splitLines(text) {
  return text.split('\n').map((line) => line.replace(/\r$/, ''));
}

// Index of the closing `---`, or 0 when the file has no frontmatter.
export function frontEnd(lines) {
  if (lines[0] !== '---') return 0;
  const end = lines.indexOf('---', 1);
  return end < 0 ? 0 : end;
}

function parseExtends(front, start) {
  let text = front[start].replace(/^ {2}extends:/, '');
  let i = start;
  while (!text.includes(']') && /^ {3,}/.test(front[i + 1] ?? '')) text += ` ${front[++i]}`;
  const list = /^\s*\[(.*)\]\s*$/.exec(text);
  if (!list) return { items: [], problem: 'list has no closing ]' };
  const items = list[1].split(',').map((item) => item.trim()).filter(Boolean);
  const bad = items.find((item) => !NAME.test(item));
  if (bad !== undefined) return { items: [], problem: `item \`${bad}\` is not a skill name` };
  return { items, problem: null };
}

export function parseFront(lines) {
  const front = lines.slice(1, frontEnd(lines));
  const meta = { type: null, extends: [], extendsLine: null, extendsProblem: null, flags: [], description: null };
  let inMetadata = false;
  let inDescription = false;
  front.forEach((line, i) => {
    if (inDescription && line.startsWith(' ')) meta.description = `${meta.description} ${line.trim()}`.trim();
    if (!line.startsWith(' ')) {
      inMetadata = line === 'metadata:';
      inDescription = /^description:\s*>-?\s*$/.test(line);
      if (inDescription) meta.description = '';
      else if (line.startsWith('description:')) meta.description = line.replace(/^description:/, '').trim();
      if (/^disable-model-invocation:\s*true\s*$/.test(line)) meta.flags.push('disable-model-invocation: true');
      if (/^user-invocable:\s*false\s*$/.test(line)) meta.flags.push('user-invocable: false');
    }
    if (inMetadata && /^ {2}type:/.test(line)) meta.type = line.replace(/^ {2}type:/, '').trim();
    if (inMetadata && /^ {2}extends:/.test(line)) {
      const parsed = parseExtends(front, i);
      meta.extends = parsed.items;
      meta.extendsProblem = parsed.problem;
      meta.extendsLine = i + 2;
    }
  });
  return meta;
}
