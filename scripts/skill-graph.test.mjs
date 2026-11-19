import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(new URL('./skill-graph.mjs', import.meta.url));
const USAGE = 'usage: node scripts/skill-graph.mjs [--verbose] [--build] [--mermaid | --html] [root]\n';

let tmpDir;

function writeFile(rel, text) {
  mkdirSync(dirname(join(tmpDir, rel)), { recursive: true });
  writeFileSync(join(tmpDir, rel), text);
}

// A valid skill: its type, its extends and one pointer line per parent, then the body lines.
function writeSkill(name, { type = 'regular', ext = [], front = [], body = [] } = {}) {
  writeFile(`skills/${name}/SKILL.md`, [
    '---', `name: ${name}`, `description: The ${name} skill.`,
    'metadata:', `  type: ${type}`, `  extends: [${ext.join(', ')}]`, ...front, '---', '',
    ...ext.map((parent) => `Load \`${parent}\` before your first step.`), ...body, '',
  ].join('\n'));
}

function run(args = ['--verbose'], env = process.env) {
  const r = spawnSync(process.execPath, [scriptPath, ...args], { cwd: tmpDir, encoding: 'utf8', env });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

// The report lines of a verbose run, without the summary.
function reportLines(r) {
  return r.stderr.split('\n').filter((line) => line && !line.startsWith('skill-graph: ')
    && !/^extends \d/.test(line) && !/^[a-z0-9-]+: [a-z-]+ \d+(, [a-z-]+ \d+)*$/.test(line));
}

// The payload sources: core and core-main with their marker lines, and plugin.json version 9.8.7.
function writePayloadSources({ core = [], coreMain = [], eol = '\n' } = {}) {
  writeFile('skills/core/SKILL.md', [
    '---', 'name: core', 'description: The core skill.', 'metadata:', '  type: regular', '  extends: []', '---',
    '', 'Rules.', '', '# core', '', 'armory-core <version>', '', '- Rule A.', ...core, '', '',
  ].join(eol));
  writeFile('skills/core-main/SKILL.md', [
    '---', 'name: core-main', 'description: The core-main skill.', 'metadata:', '  type: regular',
    '  extends: [core]', '---', '', 'Load `core` before your first step.', '', '# core-main', '',
    'armory-core-main <version>', '', 'A subagent MUST skip this skill: its rules are for the main session only.',
    '', '## 1. Replies (main session only)', '', '- Rule B.', ...coreMain, '',
  ].join(eol));
  writeFile('.claude-plugin/plugin.json', '{ "name": "x", "version": "9.8.7" }\n');
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'skill-graph-test-'));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('skill-graph', () => {
  // req: graph-tool/TR-2
  describe('extends and cycles', () => {
    // req: flip/TR-1
    test('mutual_extend_gives_one_cycle_report_and_exit_1', () => {
      writeSkill('a', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(reportLines(r), ['cycle: a, b']);
    });

    test('self_extend_gives_cycle_of_one', () => {
      writeSkill('a', { ext: ['a'] });
      assert.deepEqual(reportLines(run()), ['cycle: a']);
    });

    test('two_separate_groups_give_two_reports', () => {
      writeSkill('a', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      writeSkill('c', { ext: ['d'] });
      writeSkill('d', { ext: ['c'] });
      assert.deepEqual(reportLines(run()), ['cycle: a, b', 'cycle: c, d']);
    });

    test('acyclic_chain_of_three_gives_no_cycle', () => {
      writeSkill('a', { ext: ['b'] });
      writeSkill('b', { ext: ['c'] });
      writeSkill('c');
      assert.deepEqual(reportLines(run()), []);
    });

    test('wrapped_flow_list_reads_both_lines', () => {
      writeSkill('b', { ext: ['a'] });
      writeSkill('c');
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [b,',
        '    c]', '---', 'Load `b` before your first step.', 'Load `c` before your first step.', '',
      ].join('\n'));
      assert.deepEqual(reportLines(run()), ['cycle: a, b']);
    });

    test('crlf_frontmatter_reads_its_extends', () => {
      writeSkill('b', { ext: ['a'] });
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [b]', '---',
        'Load `b` before your first step.', '',
      ].join('\r\n'));
      assert.deepEqual(reportLines(run()), ['cycle: a, b']);
    });

    test('no_frontmatter_gives_no_extends_report', () => {
      writeSkill('b');
      writeFile('skills/a/SKILL.md', 'Just text.\n');
      assert.deepEqual(reportLines(run()).filter((line) => line.includes('extends')), []);
    });

    test('empty_list_gives_no_extends_report', () => {
      writeSkill('a');
      assert.deepEqual(reportLines(run()), []);
    });

    test('item_that_is_not_a_name_gives_extends_report', () => {
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [a, B]', '---', '',
      ].join('\n'));
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:6: extends: item `B` is not a skill name']);
    });

    test('missing_bracket_gives_extends_report', () => {
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [b', '---', '',
      ].join('\n'));
      writeSkill('b');
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:6: extends: list has no closing ]']);
    });

    test('item_naming_no_skill_gives_extends_report', () => {
      writeSkill('a', { ext: ['zz'] });
      assert.deepEqual(reportLines(run()).filter((line) => line.includes('extends:')),
        ['skills/a/SKILL.md:6: extends: `zz` names no skill']);
    });

    test('summary_gives_total_check_and_node_lines', () => {
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [b, zz]', '---',
        'Load `b` before your first step.', '',
      ].join('\n'));
      writeSkill('b', { ext: ['a'] });
      const r = run([]);
      assert.equal(r.stderr, [
        'skill-graph: 2 reports (exit 1)',
        'extends 1, cycle 1, cite 0, pointer 0, type 0, card-load 0, section 0, payload 0',
        'a: extends 1, cycle 1',
        'b: cycle 1',
        '',
      ].join('\n'));
    });

    test('verbose_adds_report_lines_before_summary', () => {
      writeSkill('a', { ext: ['a'] });
      const r = run();
      assert.equal(r.stderr.split('\n')[0], 'cycle: a');
      assert.equal(r.stderr.split('\n')[1], 'skill-graph: 1 reports (exit 1)');
    });

    test('unknown_flag_exits_2_with_usage', () => {
      writeSkill('a');
      const r = run(['--bogus']);
      assert.equal(r.status, 2);
      assert.equal(r.stderr, USAGE);
    });

    test('two_roots_exit_2_with_usage', () => {
      writeSkill('a');
      const r = run(['.', '.']);
      assert.equal(r.status, 2);
      assert.equal(r.stderr, USAGE);
    });

    test('both_draw_flags_exit_2_with_usage', () => {
      writeSkill('a');
      const r = run(['--mermaid', '--html']);
      assert.equal(r.status, 2);
      assert.equal(r.stderr, USAGE);
    });

    test('root_with_no_skills_exits_1', () => {
      const r = run([]);
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'no skills/*/SKILL.md in .\n');
    });

    test('skill_file_that_is_a_folder_exits_1', () => {
      mkdirSync(join(tmpDir, 'skills/a/SKILL.md'), { recursive: true });
      const r = run([]);
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'skills/a/SKILL.md: cannot read (EISDIR)\n');
    });
  });

  // req: graph-tool/TR-3
  describe('cite check', () => {
    test('non_ancestor_cite_is_reported_with_path_and_line', () => {
      writeSkill('a', { body: ['Text.', 'See `b` here.'] });
      writeSkill('b');
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:10: cite: `b` is not an ancestor of a']);
    });

    test('cite_in_folded_description_is_reported', () => {
      writeSkill('b');
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: >', '  First line,', '  then `b`.', 'metadata:',
        '  type: regular', '  extends: []', '---', '',
      ].join('\n'));
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:5: cite: `b` is not an ancestor of a']);
    });

    test('grandparent_cite_is_not_reported', () => {
      writeSkill('a', { ext: ['b'], body: ['See `c`.', 'See `d`.'] });
      writeSkill('b', { ext: ['c'] });
      writeSkill('c');
      writeSkill('d');
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:11: cite: `d` is not an ancestor of a']);
    });

    test('self_cite_is_not_reported', () => {
      writeSkill('a', { body: ['See `a`.', 'See `d`.'] });
      writeSkill('d');
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:10: cite: `d` is not an ancestor of a']);
    });

    test('only_exact_code_span_outside_fence_is_a_name', () => {
      writeSkill('plan');
      writeSkill('a', {
        body: ['`setup-armory`, `skills/plan/x` and `plan(<id>):`.', '```', '`plan`', '```', 'Use `plan`.'],
      });
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:13: cite: `plan` is not an ancestor of a']);
    });

    test('card_cite_of_a_skill_is_not_reported', () => {
      writeSkill('a');
      writeSkill('b', { body: ['See `a`.'] });
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\nSee `a`.\n');
      assert.deepEqual(reportLines(run()), ['skills/b/SKILL.md:9: cite: `a` is not an ancestor of b']);
    });
  });

  // req: graph-tool/TR-4
  describe('pointer check', () => {
    // Skill a extends b and c, with the given body and no pointer lines of its own.
    function writeA(body) {
      writeSkill('b');
      writeSkill('c');
      writeSkill('d');
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', 'description: A.', 'metadata:', '  type: regular', '  extends: [b, c]', '---',
        ...body, '',
      ].join('\n'));
    }

    test('equal_sets_give_no_report', () => {
      writeA(['Load `b` before your first step.', 'Load `c` before your first step.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('parent_with_no_pointer_gives_missing', () => {
      writeA(['Load `b` before your first step.']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:6: pointer: missing c']);
    });

    test('pointer_not_in_extends_gives_extra', () => {
      writeA(['Load `b` before x.', 'Load `c` before x.', 'Load `d` before x.']);
      assert.deepEqual(reportLines(run()).filter((line) => line.includes('pointer')),
        ['skills/a/SKILL.md:6: pointer: extra d']);
    });

    test('old_core_first_line_counts_as_no_pointer', () => {
      writeA(['Load `b` before x.', 'Load `c` first when its rules are not in your context.']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:6: pointer: missing c']);
    });

    test('fenced_pointer_counts_as_no_pointer', () => {
      writeA(['Load `b` before x.', '```', 'Load `c` before x.', '```']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:6: pointer: missing c']);
    });

    test('skill_with_no_extends_line_reports_on_line_1', () => {
      writeSkill('b');
      writeFile('skills/a/SKILL.md', 'Load `b` before x.\n');
      assert.deepEqual(reportLines(run()).filter((line) => line.includes('pointer')),
        ['skills/a/SKILL.md:1: pointer: extra b']);
    });
  });

  // req: graph-tool/TR-5
  describe('type check', () => {
    const ABSTRACT = ['user-invocable: false', 'description: >', '  Abstract: load only through a skill',
      '  that extends it. More.'];

    // Skill a with the given metadata.type and top-level frontmatter lines.
    function writeA(type, front) {
      writeFile('skills/a/SKILL.md', [
        '---', 'name: a', ...front, 'metadata:', ...(type === null ? [] : [`  type: ${type}`]),
        '  extends: []', '---', '',
      ].join('\n'));
    }

    test('no_type_gives_report', () => {
      writeA(null, ['description: A.']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:1: type: no metadata.type']);
    });

    test('misspelled_type_gives_report', () => {
      writeA('abstrct', ['description: A.']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:1: type: invalid metadata.type abstrct']);
    });

    test('regular_with_neither_flag_gives_no_report', () => {
      writeA('regular', ['description: A.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('regular_with_disable_model_invocation_gives_report', () => {
      writeA('regular', ['description: A.', 'disable-model-invocation: true  ']);
      assert.deepEqual(reportLines(run()),
        ['skills/a/SKILL.md:1: type: regular skill sets disable-model-invocation: true']);
    });

    test('regular_with_user_invocable_false_gives_report', () => {
      writeA('regular', ['description: A.', 'user-invocable: false']);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:1: type: regular skill sets user-invocable: false']);
    });

    test('user_only_with_disable_model_invocation_gives_no_report', () => {
      writeA('user-only', ['description: A.', 'disable-model-invocation: true']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('user_only_without_disable_model_invocation_gives_report', () => {
      writeA('user-only', ['description: A.']);
      assert.deepEqual(reportLines(run()),
        ['skills/a/SKILL.md:1: type: user-only skill lacks disable-model-invocation: true']);
    });

    test('abstract_with_flag_and_folded_description_gives_no_report', () => {
      writeA('abstract', ABSTRACT);
      assert.deepEqual(reportLines(run()), []);
    });

    test('abstract_with_no_user_invocable_line_gives_report', () => {
      writeA('abstract', ABSTRACT.slice(1));
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:1: type: abstract skill lacks user-invocable: false']);
    });

    test('abstract_with_user_invocable_true_gives_report', () => {
      writeA('abstract', ['user-invocable: true', ...ABSTRACT.slice(1)]);
      assert.deepEqual(reportLines(run()), ['skills/a/SKILL.md:1: type: abstract skill lacks user-invocable: false']);
    });

    test('abstract_with_wrong_description_start_gives_report', () => {
      writeA('abstract', ['user-invocable: false', 'description: Load only through a skill that extends it.']);
      assert.deepEqual(reportLines(run()), [
        'skills/a/SKILL.md:1: type: abstract description does not start "Abstract: load only through a skill that extends it"',
      ]);
    });

    test('abstract_with_no_description_gives_report', () => {
      writeA('abstract', ['user-invocable: false']);
      assert.deepEqual(reportLines(run()), [
        'skills/a/SKILL.md:1: type: abstract description does not start "Abstract: load only through a skill that extends it"',
      ]);
    });
  });

  // req: graph-tool/TR-6
  describe('card load check', () => {
    const CARD = 'skills/setup/templates/agents/coder.md';

    // Abstract skill base, concrete skill impl, and a coder card with the given lines.
    function writeCard(lines) {
      writeFile('skills/base/SKILL.md', [
        '---', 'name: base', 'user-invocable: false', 'description: Abstract: load only through a skill that extends it.',
        'metadata:', '  type: abstract', '  extends: []', '---', '',
      ].join('\n'));
      writeSkill('impl');
      writeSkill('setup');
      writeFile(CARD, [...lines, ''].join('\n'));
    }

    test('abstract_load_on_first_item_line_is_reported', () => {
      writeCard(['# coder', '', '- MUST load `base`.']);
      assert.deepEqual(reportLines(run()), [`${CARD}:3: card-load: coder loads abstract \`base\``]);
    });

    test('abstract_load_on_continuation_line_is_reported', () => {
      writeCard(['# coder', '', '- MUST load `impl` and', '  then `base`.']);
      assert.deepEqual(reportLines(run()), [`${CARD}:4: card-load: coder loads abstract \`base\``]);
    });

    test('abstract_load_in_second_load_item_is_reported', () => {
      writeCard(['# coder', '', '- MUST load `impl`.', '- Other.', '- MUST load `base` too.']);
      assert.deepEqual(reportLines(run()), [`${CARD}:5: card-load: coder loads abstract \`base\``]);
    });

    test('abstract_cite_in_other_item_is_not_reported', () => {
      writeCard(['# coder', '', '- MUST load `impl`.', '- See `base`.', '  More `base`.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('concrete_load_is_not_reported', () => {
      writeCard(['# coder', '', '- MUST load `impl`.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('card_path_that_is_a_folder_exits_1', () => {
      writeSkill('a');
      mkdirSync(join(tmpDir, CARD), { recursive: true });
      const r = run([]);
      assert.equal(r.status, 1);
      assert.equal(r.stderr, `${CARD}: cannot read (EISDIR)\n`);
    });
  });

  // req: core-split/TR-2
  describe('card main check', () => {
    const CARD = 'skills/setup/templates/agents/coder.md';
    const error = (line, skill) =>
      `${CARD}:${line}: card-main: coder loads \`${skill}\`, which is or extends \`core-main\``;
    const errorLines = (r) => r.stderr.split('\n').filter((line) => line.includes(': card-main: '));
    const writeCard = (lines) => writeFile(CARD, [...lines, ''].join('\n'));

    beforeEach(() => { writePayloadSources(); run(['--build']); });

    test('load_of_skill_that_extends_core_main_exits_1', () => {
      writeSkill('a', { ext: ['core-main'] });
      writeCard(['# coder', '', '- MUST load `a`.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(errorLines(r), [error(3, 'a')]);
    });

    test('load_of_skill_two_hops_below_core_main_exits_1', () => {
      writeSkill('a', { ext: ['core-main'] });
      writeSkill('b', { ext: ['a'] });
      writeCard(['# coder', '', '- MUST load `b`.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(errorLines(r), [error(3, 'b')]);
    });

    test('load_of_core_main_itself_exits_1', () => {
      writeCard(['# coder', '', '- MUST load `core-main`.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(errorLines(r), [error(3, 'core-main')]);
    });

    test('load_of_skill_in_cycle_with_core_main_parent_exits_1', () => {
      writeSkill('a', { ext: ['b'] });
      writeSkill('b', { ext: ['a', 'core-main'] });
      writeCard(['# coder', '', '- MUST load `a`.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(errorLines(r), [error(3, 'a')]);
    });

    test('only_load_lines_count', () => {
      writeSkill('a', { ext: ['core-main'] });
      writeSkill('b', { ext: ['core-main'] });
      writeSkill('ok', { ext: ['core'] });
      writeCard(['# coder', '', '- See `a`.', '- MUST load `ok` and', '  then `b`.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(errorLines(r), [error(5, 'b')]);
    });

    test('load_of_skill_that_extends_only_core_exits_0', () => {
      writeSkill('ok', { ext: ['core'] });
      writeCard(['# coder', '', '- MUST load `ok`.']);
      const r = run();
      assert.equal(r.status, 0);
      assert.deepEqual(errorLines(r), []);
    });

    test('error_prints_without_verbose_and_with_mermaid', () => {
      writeSkill('a', { ext: ['core-main'] });
      writeCard(['# coder', '', '- MUST load `a`.']);
      const r = run(['--mermaid']);
      assert.equal(r.status, 1);
      assert.ok(r.stdout.startsWith('flowchart'));
      assert.ok(r.stderr.endsWith(`${error(3, 'a')}\nskill-graph: 1 errors (exit 1)\n`));
    });
  });

  // req: core-split/TR-6
  describe('payload build', () => {
    const AGENT = 'Rules.\n\n# core\n\narmory-core 9.8.7\n\n- Rule A.\n';
    const MAIN = `${AGENT}\n# core-main\n\narmory-core-main 9.8.7\n\n## 1. Replies\n\n- Rule B.\n`;
    const read = (rel) => readFileSync(join(tmpDir, rel), 'utf8');
    const agentContext = () => JSON.parse(read('hooks/agent-payload.json')).hookSpecificOutput.additionalContext;
    const warnings = (r) => r.stderr.split('\n').filter((line) => line.startsWith('skill-graph: warning: '));
    const over9000 = (which, n) => `skill-graph: warning: ${which} payload is ${n} characters, over 9000`;
    const over10000 = (which, n) => `skill-graph: warning: ${which} payload is ${n} characters, over 10000; `
      + 'the host swaps it for a file path and a 2000-character preview';
    // One extra core line that makes the main payload `n` characters long.
    const mainPadding = (n) => 'x'.repeat(n - MAIN.length - 1);
    const failure = (r) => [r.status, r.stderr];

    test('build_writes_main_payload', () => {
      writePayloadSources();
      assert.equal(run(['--build']).status, 0);
      assert.equal(read('hooks/main-payload.md'), MAIN);
    });

    test('build_writes_agent_payload_json', () => {
      writePayloadSources();
      run(['--build']);
      const json = JSON.parse(read('hooks/agent-payload.json'));
      assert.equal(json.hookSpecificOutput.hookEventName, 'SubagentStart');
      assert.equal(json.hookSpecificOutput.additionalContext, AGENT);
      assert.ok(read('hooks/agent-payload.json').endsWith('}\n'));
    });

    test('crlf_source_gives_lf_payload_without_frontmatter', () => {
      writePayloadSources({ eol: '\r\n' });
      assert.equal(run(['--build']).status, 0);
      assert.equal(read('hooks/main-payload.md'), MAIN);
    });

    test('suffix_stays_on_a_non_heading_line', () => {
      writePayloadSources({ coreMain: ['- Rule C (main session only)'] });
      run(['--build']);
      assert.ok(read('hooks/main-payload.md').endsWith('- Rule B.\n- Rule C (main session only)\n'));
    });

    test('version_placeholder_outside_marker_line_stays', () => {
      writePayloadSources({ core: ['- See armory <version> here.'] });
      run(['--build']);
      assert.ok(agentContext().endsWith('- Rule A.\n- See armory <version> here.\n'));
    });

    test('default_run_warns_at_9001_and_writes_no_hooks_dir', () => {
      writePayloadSources({ core: [mainPadding(9001)] });
      const r = run([]);
      assert.deepEqual(warnings(r), [over9000('main', 9001)]);
      assert.equal(existsSync(join(tmpDir, 'hooks')), false);
    });

    test('no_warning_at_exactly_9000', () => {
      writePayloadSources({ core: [mainPadding(9000)] });
      assert.deepEqual(warnings(run([])), []);
    });

    test('only_the_10000_warning_at_10001', () => {
      writePayloadSources({ core: [mainPadding(10001)] });
      const r = run(['--build']);
      assert.equal(r.status, 0);
      const agentLength = 10001 - (MAIN.length - AGENT.length);
      assert.deepEqual(warnings(r), [over10000('main', 10001), over9000('agent', agentLength)]);
    });

    test('main_payload_warning_names_main', () => {
      writePayloadSources({ coreMain: ['y'.repeat(9001 - MAIN.length - 1)] });
      assert.deepEqual(warnings(run([])), [over9000('main', 9001)]);
    });

    test('build_without_core_exits_1', () => {
      writeSkill('a');
      assert.deepEqual(failure(run(['--build'])), [1, 'skills/core/SKILL.md: cannot read (ENOENT)\n']);
    });

    test('default_run_without_core_skips_the_build', () => {
      writeSkill('a');
      const r = run([]);
      assert.equal(r.status, 0);
      assert.equal(existsSync(join(tmpDir, 'hooks')), false);
    });

    test('core_without_marker_exits_1', () => {
      writePayloadSources();
      writeFile('skills/core/SKILL.md', read('skills/core/SKILL.md').replace('armory-core <version>\n', ''));
      assert.deepEqual(failure(run(['--build'])),
        [1, 'skills/core/SKILL.md: needs one marker line "armory-core <version>"\n']);
    });

    test('core_with_two_markers_exits_1', () => {
      writePayloadSources({ core: ['armory-core <version>'] });
      assert.deepEqual(failure(run([])),
        [1, 'skills/core/SKILL.md: needs one marker line "armory-core <version>"\n']);
    });

    test('core_main_without_marker_exits_1', () => {
      writePayloadSources();
      writeFile('skills/core-main/SKILL.md',
        read('skills/core-main/SKILL.md').replace('armory-core-main <version>\n', ''));
      assert.deepEqual(failure(run(['--build'])),
        [1, 'skills/core-main/SKILL.md: needs one marker line "armory-core-main <version>"\n']);
    });

    test('marker_line_in_other_skill_exits_1', () => {
      writePayloadSources();
      writeSkill('a', { body: ['Text.', 'armory-core <version>'] });
      assert.deepEqual(failure(run(['--build'])), [1, 'skills/a/SKILL.md:10: marker line outside its skill\n']);
    });

    test('core_main_marker_inside_core_exits_1', () => {
      writePayloadSources({ core: ['armory-core-main <version>'] });
      assert.deepEqual(failure(run(['--build'])), [1, 'skills/core/SKILL.md:16: marker line outside its skill\n']);
    });

    test('missing_core_main_exits_1', () => {
      writePayloadSources();
      rmSync(join(tmpDir, 'skills/core-main'), { recursive: true });
      assert.deepEqual(failure(run(['--build'])), [1, 'skills/core-main/SKILL.md: cannot read (ENOENT)\n']);
    });

    test('missing_plugin_json_exits_1', () => {
      writePayloadSources();
      rmSync(join(tmpDir, '.claude-plugin/plugin.json'));
      assert.deepEqual(failure(run(['--build'])), [1, '.claude-plugin/plugin.json: cannot read (ENOENT)\n']);
    });

    test('version_missing_empty_non_string_or_bad_json_exits_1', () => {
      writePayloadSources();
      for (const text of ['{ "name": "x" }', '{ "version": "" }', '{ "version": 9 }', '{ "version": ']) {
        writeFile('.claude-plugin/plugin.json', text);
        assert.deepEqual(failure(run(['--build'])), [1, '.claude-plugin/plugin.json: no version\n'], text);
      }
    });

    test('hooks_path_is_a_file_exits_1', () => {
      writePayloadSources();
      writeFile('hooks', 'a file\n');
      const r = run(['--build']);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /^hooks: cannot write \(E[A-Z]+\)\n$/);
    });

    test('second_build_rewrites_both_files', () => {
      writePayloadSources();
      writeFile('hooks/main-payload.md', 'stale\n');
      writeFile('hooks/agent-payload.json', 'stale\n');
      run(['--build']);
      assert.equal(read('hooks/main-payload.md'), MAIN);
      assert.equal(agentContext(), AGENT);
    });

    test('build_and_card_main_error_order', () => {
      writePayloadSources({ core: [mainPadding(9001)] });
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\n- MUST load `core-main`.\n');
      const r = run([]);
      assert.equal(r.status, 1);
      assert.ok(r.stderr.endsWith(`${over9000('main', 9001)}\n`
        + 'skills/setup/templates/agents/coder.md:3: card-main: coder loads `core-main`, which is or extends '
        + '`core-main`\nskill-graph: 1 errors (exit 1)\n'));
    });
  });

  // req: stale-payload-check/TR-1
  describe('stale payload', () => {
    const CHECKS0 = 'extends 0, cycle 0, cite 0, pointer 0, type 0, card-load 0, section 0';
    const AGENT_LINE = 'hooks/agent-payload.json:1: payload: differs from the build';
    const MAIN_LINE = 'hooks/main-payload.md:1: payload: differs from the build';
    const read = (rel) => readFileSync(join(tmpDir, rel), 'utf8');
    const built = () => {
      writePayloadSources();
      run(['--build']);
    };

    test('fresh_payloads_give_no_report', () => {
      built();
      assert.equal(run([]).stderr, `skill-graph: 0 reports\n${CHECKS0}, payload 0\n`);
    });

    test('edited_main_payload_gives_report', () => {
      built();
      writeFile('hooks/main-payload.md', 'stale\n');
      const r = run();
      assert.deepEqual(reportLines(r), [MAIN_LINE]);
      assert.equal(r.status, 1);
    });

    test('edited_agent_payload_gives_report', () => {
      built();
      writeFile('hooks/agent-payload.json', 'stale\n');
      const r = run();
      assert.deepEqual(reportLines(r), [AGENT_LINE]);
      assert.equal(r.status, 1);
    });

    test('extra_newline_gives_report', () => {
      built();
      writeFile('hooks/main-payload.md', `${read('hooks/main-payload.md')}\n`);
      assert.deepEqual(reportLines(run()), [MAIN_LINE]);
    });

    test('reformatted_agent_json_gives_report', () => {
      built();
      const parsed = JSON.parse(read('hooks/agent-payload.json'));
      writeFile('hooks/agent-payload.json', `${JSON.stringify(parsed, null, 2)}\n`);
      assert.deepEqual(reportLines(run()), [AGENT_LINE]);
    });

    test('core_edit_after_build_reports_agent_then_main', () => {
      built();
      writePayloadSources({ core: ['- Rule Z.'] });
      assert.deepEqual(reportLines(run()), [AGENT_LINE, MAIN_LINE]);
    });

    test('version_change_after_build_gives_two_reports', () => {
      built();
      writeFile('.claude-plugin/plugin.json', '{ "name": "x", "version": "9.8.8" }\n');
      assert.deepEqual(reportLines(run()), [AGENT_LINE, MAIN_LINE]);
    });

    test('missing_payloads_give_cannot_read_reports', () => {
      writePayloadSources();
      const r = run();
      assert.deepEqual(reportLines(r), ['hooks/agent-payload.json:1: payload: cannot read (ENOENT)',
        'hooks/main-payload.md:1: payload: cannot read (ENOENT)']);
      assert.equal(r.status, 1);
      assert.equal(existsSync(join(tmpDir, 'hooks')), false);
    });

    test('directory_at_payload_path_gives_cannot_read_report', () => {
      built();
      rmSync(join(tmpDir, 'hooks/main-payload.md'));
      mkdirSync(join(tmpDir, 'hooks/main-payload.md'));
      assert.deepEqual(reportLines(run()), ['hooks/main-payload.md:1: payload: cannot read (EISDIR)']);
    });

    test('summary_counts_payload_reports_without_node_line', () => {
      writePayloadSources();
      assert.equal(run([]).stderr, `skill-graph: 2 reports (exit 1)\n${CHECKS0}, payload 2\n`);
    });

    test('build_run_gives_no_payload_report', () => {
      writePayloadSources();
      writeFile('hooks/main-payload.md', 'stale\n');
      writeFile('hooks/agent-payload.json', 'stale\n');
      assert.equal(run(['--build']).stderr, `skill-graph: 0 reports\n${CHECKS0}, payload 0\n`);
    });

    test('default_run_without_core_gives_no_payload_report', () => {
      writeSkill('a');
      assert.equal(run([]).stderr, `skill-graph: 0 reports\n${CHECKS0}, payload 0\n`);
    });
  });

  // req: flip/TR-1
  describe('report exit', () => {
    test('mermaid_run_with_report_exits_1_and_draws', () => {
      writeSkill('a', { ext: ['a'] });
      const r = run(['--mermaid']);
      assert.equal(r.status, 1);
      assert.ok(r.stdout.startsWith('flowchart'));
    });

    test('build_run_with_report_writes_payloads_and_exits_1', () => {
      writePayloadSources();
      writeSkill('a', { ext: ['a'] });
      const r = run(['--build']);
      assert.equal(r.status, 1);
      assert.ok(existsSync(join(tmpDir, 'hooks/main-payload.md')));
    });
  });

  describe('repo graph', () => {
    const repoRoot = fileURLToPath(new URL('..', import.meta.url));
    const edgesFrom = (id) => run(['--mermaid', repoRoot]).stdout.split('\n')
      .filter((line) => line.startsWith(`  ${id} -->`));

    // req: core-split/TR-3
    test('core_main_cites_only_core', () => {
      const edges = edgesFrom('s_core_main');
      assert.ok(edges.length > 0);
      assert.ok(edges.every((line) => line.endsWith(' s_core')));
    });

    // req: core-split/TR-5
    test('core_cites_no_skill', () => {
      assert.deepEqual(edgesFrom('s_core'), []);
    });
  });

  // Skill b with the given heading lines, and skill a, which extends b, with the given body.
  function writeRefs(headingsOfB, bodyOfA) {
    writeSkill('b', { body: headingsOfB });
    writeSkill('a', { ext: ['b'], body: bodyOfA });
  }

  // req: graph-tool/TR-7
  describe('numbered section refs', () => {
    const A = 'skills/a/SKILL.md';

    test('ref_to_existing_heading_gives_no_report', () => {
      writeRefs(['## 2. Two'], ['See `b` §2.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('ref_to_missing_heading_gives_report', () => {
      writeRefs(['## 2. Two'], ['See `b` §3.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §3 has no heading in b`]);
    });

    test('subsection_ref_to_existing_heading_gives_no_report', () => {
      writeRefs(['### 1.2. Sub'], ['See `b` §1.2.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('subsection_ref_to_missing_heading_gives_report', () => {
      writeRefs(['## 1. One'], ['See `b` §1.2.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §1.2 has no heading in b`]);
    });

    test('bare_ref_checks_its_own_file', () => {
      writeRefs(['## 2. Two', '## 3. Three'], ['## 2. Own', 'See §2 and §3.']);
      assert.deepEqual(reportLines(run()), [`${A}:11: section: §3 has no heading in a`]);
    });

    test('ref_after_other_code_span_checks_its_own_file', () => {
      writeRefs(['## 3. Three'], ['See `BR` (§3).']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §3 has no heading in a`]);
    });

    test('chained_refs_check_against_the_same_skill', () => {
      writeRefs(['## 2. Two', '## 3. Three'], ['## 2. Own', 'See `b` §2, §3 and §4.']);
      assert.deepEqual(reportLines(run()), [`${A}:11: section: §4 has no heading in b`]);
    });

    test('range_checks_each_section_in_it', () => {
      writeRefs(['## 2. Two', '## 4. Four'], ['See `b` §2–§4.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §3 has no heading in b`]);
    });

    test('subsection_range_gives_report', () => {
      writeRefs(['### 1.2. Two', '### 1.3. Three', '### 1.4. Four'], ['See `b` §1.2–§1.4.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §1.2–§1.4 is not a valid range`]);
    });

    test('descending_range_gives_report', () => {
      writeRefs(['## 2. Two', '## 4. Four'], ['See `b` §4–§2.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §4–§2 is not a valid range`]);
    });

    test('ref_in_parentheses_attaches_to_skill', () => {
      writeRefs(['## 3. Three'], ['## 2. Own', 'See `b` (§2).']);
      assert.deepEqual(reportLines(run()), [`${A}:11: section: §2 has no heading in b`]);
    });

    test('ref_after_line_break_attaches_to_skill', () => {
      writeRefs(['## 3. Three'], ['## 2. Own', 'See `b`', '  §2.']);
      assert.deepEqual(reportLines(run()), [`${A}:12: section: §2 has no heading in b`]);
    });

    test('step_after_ref_is_not_a_section', () => {
      writeRefs(['## 2. Two'], ['See `b` §2, step 9.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('ref_after_file_path_is_not_checked', () => {
      writeRefs(['## 2. Two'], ['See `docs/x.md` §9.']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('ref_inside_code_span_or_fence_is_literal', () => {
      writeRefs(['## 2. Two'], ['See `§9` here.', '```', '§9', '```']);
      assert.deepEqual(reportLines(run()), []);
    });

    test('card_ref_to_missing_heading_gives_report', () => {
      writeRefs(['## 2. Two'], []);
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\nSee `b` §9.\n');
      assert.deepEqual(reportLines(run()),
        ['skills/setup/templates/agents/coder.md:3: section: §9 has no heading in b']);
    });
  });

  // req: graph-tool/TR-8
  describe('name section refs', () => {
    const A = 'skills/a/SKILL.md';

    test('exact_name_resolves_to_its_number', () => {
      writeRefs(['## 2. Alpha beta'], ['See `b` §Alpha beta.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alpha beta is a name reference, resolves to §2`]);
    });

    test('longest_exact_name_wins', () => {
      writeRefs(['## 2. Alpha', '## 3. Alpha beta'], ['See `b` §Alpha beta.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alpha beta is a name reference, resolves to §3`]);
    });

    test('exact_name_with_comma_resolves', () => {
      writeRefs(['## 4. Alpha, boundaries'], ['See `b` §Alpha, boundaries.']);
      assert.deepEqual(reportLines(run()),
        [`${A}:10: section: §Alpha, boundaries is a name reference, resolves to §4`]);
    });

    test('name_split_over_line_break_resolves', () => {
      writeRefs(['## 2. Alpha beta'], ['See `b` §Alpha', '  beta.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alpha beta is a name reference, resolves to §2`]);
    });

    test('longer_word_does_not_match_shorter_heading', () => {
      writeRefs(['## 2. Alpha'], ['See `b` §Alphabet.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alphabet is a name reference, matches no heading in b`]);
    });

    test('prefix_words_resolve_one_heading', () => {
      writeRefs(['## 5. Self and more'], ['See `b` §Self, then.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Self is a name reference, resolves to §5`]);
    });

    test('prefix_words_of_two_headings_are_ambiguous', () => {
      writeRefs(['## 5. Self and more', '## 6. Self or less'], ['See `b` §Self, then.']);
      assert.deepEqual(reportLines(run()),
        [`${A}:10: section: §Self is a name reference, ambiguous in b: §5, §6`]);
    });

    test('two_equal_headings_are_ambiguous', () => {
      writeRefs(['## 2. Alpha', '## 3. Alpha'], ['See `b` §Alpha.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alpha is a name reference, ambiguous in b: §2, §3`]);
    });

    test('space_after_section_sign_matches_no_heading', () => {
      writeRefs(['## 2. Alpha beta'], ['See `b` § Alpha.']);
      const r = run();
      assert.equal(r.status, 1);
      assert.deepEqual(reportLines(r), [`${A}:10: section: § Alpha is a name reference, matches no heading in b`]);
    });

    test('unknown_name_matches_no_heading', () => {
      writeRefs(['## 2. Alpha'], ['See `b` §Gamma.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Gamma is a name reference, matches no heading in b`]);
    });

    test('unnumbered_heading_match_is_named', () => {
      writeRefs(['### Flow'], ['See `b` §Flow.']);
      assert.deepEqual(reportLines(run()),
        [`${A}:10: section: §Flow is a name reference, matches an unnumbered heading in b`]);
    });

    test('own_file_name_resolves_in_own_file', () => {
      writeRefs(['## 2. Alpha'], ['## 7. Alpha', 'See §Alpha.']);
      assert.deepEqual(reportLines(run()), [`${A}:11: section: §Alpha is a name reference, resolves to §7`]);
    });

    // req: section-refs/TR-1
    test('file_path_name_ref_is_not_checked', () => {
      writeRefs(['## 2. Alpha'], ['See `docs/x.md` §Alpha and `b` §Alpha.']);
      assert.deepEqual(reportLines(run()), [`${A}:10: section: §Alpha is a name reference, resolves to §2`]);
    });

    test('chained_name_refs_resolve_in_same_skill', () => {
      writeRefs(['## 2. Alpha', '## 3. Beta'], ['## 8. Beta', 'See `b` §Alpha and §Beta.']);
      assert.deepEqual(reportLines(run()), [
        `${A}:11: section: §Alpha is a name reference, resolves to §2`,
        `${A}:11: section: §Beta is a name reference, resolves to §3`,
      ]);
    });

    test('card_name_ref_gives_report', () => {
      writeRefs(['## 2. Alpha'], []);
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\nSee `b` §Alpha.\n');
      assert.deepEqual(reportLines(run()),
        ['skills/setup/templates/agents/coder.md:3: section: §Alpha is a name reference, resolves to §2']);
    });
  });

  // req: section-refs/TR-2
  describe('template section refs', () => {
    const T = 'skills/b/templates/t.md';

    test('template_name_ref_gives_report', () => {
      writeSkill('b', { body: ['## 2. Alpha'] });
      writeFile(T, 'See `b` §Alpha.\n');
      assert.deepEqual(reportLines(run()), [`${T}:1: section: §Alpha is a name reference, resolves to §2`]);
    });

    test('template_bare_ref_resolves_in_its_skill', () => {
      writeSkill('b', { body: ['## 2. Alpha'] });
      writeFile(T, 'See §2 and §Alpha.\n');
      assert.deepEqual(reportLines(run()), [`${T}:1: section: §Alpha is a name reference, resolves to §2`]);
    });

    test('template_ref_to_missing_heading_gives_report', () => {
      writeSkill('b', { body: ['## 2. Alpha'] });
      writeFile(T, 'See `b` §9.\n');
      assert.deepEqual(reportLines(run()), [`${T}:1: section: §9 has no heading in b`]);
    });

    test('template_cite_of_non_ancestor_gives_only_section_report', () => {
      writeSkill('a', { body: ['## 2. Two'] });
      writeSkill('b');
      writeFile(T, 'See `a` §2 and §9.\n');
      assert.deepEqual(reportLines(run()), [`${T}:1: section: §9 has no heading in a`]);
    });

    test('templates_that_is_a_file_exits_1', () => {
      writeSkill('b');
      writeFile('skills/b/templates', 'not a folder\n');
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'skills/b/templates: cannot read (ENOTDIR)\n');
    });

    test('template_that_is_a_folder_exits_1', () => {
      writeSkill('b');
      mkdirSync(join(tmpDir, T), { recursive: true });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, `${T}: cannot read (EISDIR)\n`);
    });
  });

  // req: graph-tool/TR-9
  describe('mermaid output', () => {
    const lines = (r) => r.stdout.split('\n');

    test('two_number_refs_give_one_sorted_label', () => {
      writeRefs(['## 2. Two', '## 3. Three'], ['See `b` §3.', 'And `b` §2.']);
      assert.ok(lines(run(['--mermaid'])).includes('  s_a -->|"§2, §3"| s_b'));
    });

    test('resolved_name_ref_gives_its_number', () => {
      writeRefs(['## 2. Alpha'], ['See `b` §Alpha.']);
      assert.ok(lines(run(['--mermaid'])).includes('  s_a -->|"§2"| s_b'));
    });

    test('cite_with_no_ref_gives_plain_edge', () => {
      writeRefs([], ['See `b`.']);
      assert.ok(lines(run(['--mermaid'])).includes('  s_a --> s_b'));
    });

    test('unmatched_name_ref_gives_plain_edge', () => {
      writeRefs(['## 2. Alpha'], ['See `b` §Zeta.']);
      assert.ok(lines(run(['--mermaid'])).includes('  s_a --> s_b'));
    });

    test('step_number_stays_out_of_label', () => {
      writeRefs(['## 2. Two'], ['See `b` §2 step 6.']);
      assert.ok(lines(run(['--mermaid'])).includes('  s_a -->|"§2"| s_b'));
    });

    test('card_gives_stadium_node_with_dashes_turned', () => {
      writeSkill('a');
      writeFile('skills/setup/templates/agents/my-card.md', '# my-card\n');
      assert.ok(lines(run(['--mermaid'])).includes('  c_my_card(["my-card"])'));
    });

    test('problem_edges_get_link_styles_and_abstract_gets_class', () => {
      writeFile('skills/base/SKILL.md', [
        '---', 'name: base', 'user-invocable: false', 'description: Abstract: load only through a skill that extends it.',
        'metadata:', '  type: abstract', '  extends: []', '---', '',
      ].join('\n'));
      writeSkill('a', { ext: ['base'], body: ['See `c` §4.'] });
      writeSkill('c');
      writeSkill('p', { ext: ['q'] });
      writeSkill('q', { ext: ['p'] });
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\n- MUST load `base`.\n');
      assert.equal(run(['--mermaid']).stdout, [
        'flowchart TD',
        '  s_a["a"]', '  s_base["base"]', '  s_c["c"]', '  s_p["p"]', '  s_q["q"]', '  c_coder(["coder"])',
        '  s_a --> s_base', '  s_a -->|"§4"| s_c', '  c_coder --> s_base', '  s_p --> s_q', '  s_q --> s_p',
        '  linkStyle 1 stroke:#d33,stroke-width:2px', '  linkStyle 2 stroke:#d33,stroke-width:2px',
        '  linkStyle 3 stroke:#d33,stroke-width:2px', '  linkStyle 4 stroke:#d33,stroke-width:2px',
        '  class s_base abstract',
        '  classDef abstract stroke-dasharray: 5 5', '',
      ].join('\n'));
    });

    test('stdout_holds_only_mermaid_and_summary_goes_to_stderr', () => {
      writeRefs([], ['See `b`.']);
      const r = run(['--mermaid']);
      assert.equal(r.status, 0);
      assert.equal(r.stdout, 'flowchart TD\n  s_a["a"]\n  s_b["b"]\n  s_a --> s_b\n  classDef abstract stroke-dasharray: 5 5\n');
      assert.match(r.stderr, /^skill-graph: /);
    });
  });

  // req: graph-tool/TR-10
  describe('html output', () => {
    // Chain a extends b extends c, a cites d §2 out of its ancestors, and one card.
    function writeChain() {
      writeSkill('c');
      writeSkill('b', { ext: ['c'] });
      writeSkill('a', { ext: ['b'], body: ['See `d` §2.'] });
      writeSkill('d', { body: ['## 2. Two'] });
      writeFile('skills/setup/templates/agents/coder.md', '# coder\n\n- MUST load `a`.\n');
    }

    function runHtml() {
      mkdirSync(join(tmpDir, 'tmp'));
      return run(['--html'], { ...process.env, TMPDIR: join(tmpDir, 'tmp') });
    }

    function graphData(r) {
      const page = readFileSync(r.stdout.trim(), 'utf8');
      return JSON.parse(page.match(/<script type="application\/json" id="graph-data">([^<]*)<\/script>/)[1]);
    }

    const nodeOf = (data, name) => data.nodes.find((node) => node.name === name);

    test('stdout_is_one_file_path_under_tmpdir', () => {
      writeChain();
      const r = runHtml();
      assert.ok(r.stdout.startsWith(join(tmpDir, 'tmp', 'skill-graph-')));
      assert.match(r.stdout, /^[^\n]+\/graph\.html\n$/);
      assert.ok(existsSync(r.stdout.trim()));
    });

    test('data_edge_holds_sections_problem_and_kind', () => {
      writeChain();
      const edge = graphData(runHtml()).edges.find((e) => e.source === 'a' && e.target === 'd');
      assert.deepEqual(edge, { source: 'a', target: 'd', sections: ['2'], problem: 'cite', kind: 'cite' });
    });

    test('data_node_holds_kind_extends_ancestors_children_and_reports', () => {
      writeChain();
      const data = graphData(runHtml());
      const a = nodeOf(data, 'a');
      assert.equal(a.kind, 'regular');
      assert.deepEqual(a.extends, ['b']);
      assert.deepEqual(a.ancestors, ['b', 'c']);
      assert.deepEqual(a.reports.map((r) => r.check), ['cite']);
      assert.deepEqual(nodeOf(data, 'c').children, ['b']);
      assert.equal(nodeOf(data, 'coder').kind, 'card');
    });

    test('parents_sit_above_children_and_cards_below_skills', () => {
      writeChain();
      const data = graphData(runHtml());
      const y = (name) => nodeOf(data, name).y;
      assert.ok(y('c') < y('b') && y('b') < y('a'));
      assert.ok(['a', 'b', 'c', 'd'].every((name) => y('coder') > y(name)));
    });

    test('row_nodes_sit_by_name_at_equal_steps', () => {
      writeChain();
      writeSkill('e');
      const data = graphData(runHtml());
      const x = (name) => nodeOf(data, name).x;
      assert.equal(nodeOf(data, 'c').y, nodeOf(data, 'e').y);
      assert.ok(x('c') < x('d') && x('d') < x('e'));
      assert.equal(x('d') - x('c'), x('e') - x('d'));
    });

    test('page_loads_nothing_from_the_network', () => {
      writeChain();
      const page = readFileSync(runHtml().stdout.trim(), 'utf8');
      assert.doesNotMatch(page, /(src|href)=["']?http|url\(http/);
    });

    test('lt_in_data_is_escaped', () => {
      writeSkill('a', { body: ['See `b` §<x>.'] });
      writeSkill('b');
      const page = readFileSync(runHtml().stdout.trim(), 'utf8');
      const block = page.match(/id="graph-data">([^]*?)<\/script>/)[1];
      assert.doesNotMatch(block, /</);
      assert.match(block, /\\u003c/);
    });

    test('missing_tmpdir_exits_1_with_html_enoent', () => {
      writeChain();
      const r = run(['--html'], { ...process.env, TMPDIR: join(tmpDir, 'none') });
      assert.equal(r.status, 1);
      assert.equal(r.stdout, '');
      assert.match(r.stderr, /^html: ENOENT$/m);
    });

    const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);
    const centroid = (data, names) => ({
      x: names.reduce((sum, name) => sum + nodeOf(data, name).x, 0) / names.length,
      y: names.reduce((sum, name) => sum + nodeOf(data, name).y, 0) / names.length,
    });
    const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

    // req: graph-tool/TR-13
    test('four_member_group_sits_on_a_circle_clockwise_from_top', () => {
      writeSkill('a', { ext: ['d'] });
      writeSkill('d', { ext: ['c'] });
      writeSkill('c', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      const data = graphData(runHtml());
      const at = (name) => nodeOf(data, name);
      const centre = centroid(data, ['a', 'b', 'c', 'd']);
      const radius = distance(at('a'), centre);
      for (const name of ['b', 'c', 'd']) near(distance(at(name), centre), radius);
      near(at('a').x, centre.x);
      assert.ok(at('a').y < centre.y);
      near(at('b').y, centre.y);
      assert.ok(at('b').x > centre.x);
      near(at('c').x, centre.x);
      assert.ok(at('c').y > centre.y);
      near(at('d').y, centre.y);
      assert.ok(at('d').x < centre.x);
      near(distance(at('a'), at('b')), 180);
      near(distance(at('b'), at('c')), 180);
    });

    // req: graph-tool/TR-13
    test('group_sits_below_its_outside_parent_and_above_its_child', () => {
      writeSkill('p');
      writeSkill('a', { ext: ['c', 'p'] });
      writeSkill('c', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      writeSkill('x', { ext: ['c'] });
      const data = graphData(runHtml());
      const y = (name) => nodeOf(data, name).y;
      assert.ok(['a', 'b', 'c'].every((name) => y('p') < y(name) && y(name) < y('x')));
    });

    // req: graph-tool/TR-13
    test('self_extending_skill_sits_beside_group_at_its_centre_height', () => {
      writeSkill('a', { ext: ['c'] });
      writeSkill('c', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      writeSkill('s', { ext: ['s'] });
      const data = graphData(runHtml());
      const centre = centroid(data, ['a', 'b', 'c']);
      near(nodeOf(data, 's').y, centre.y);
      near(distance(nodeOf(data, 's'), centre), 180 / (2 * Math.sin(Math.PI / 3)) + 180);
    });

    // req: graph-tool/TR-13
    test('two_groups_in_one_row_do_not_overlap', () => {
      writeSkill('a', { ext: ['c'] });
      writeSkill('c', { ext: ['b'] });
      writeSkill('b', { ext: ['a'] });
      writeSkill('d', { ext: ['f'] });
      writeSkill('f', { ext: ['e'] });
      writeSkill('e', { ext: ['d'] });
      const data = graphData(runHtml());
      const spread = (names) => {
        const centre = centroid(data, names);
        return { centre, reach: Math.max(...names.map((name) => distance(nodeOf(data, name), centre))) };
      };
      const one = spread(['a', 'b', 'c']);
      const two = spread(['d', 'e', 'f']);
      assert.ok(distance(one.centre, two.centre) > one.reach + two.reach);
    });
  });
});
