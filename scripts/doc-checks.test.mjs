import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(new URL('./doc-checks.mjs', import.meta.url));

let tmpDir;

function writeFile(rel, text) {
  mkdirSync(dirname(join(tmpDir, rel)), { recursive: true });
  writeFileSync(join(tmpDir, rel), text);
}

// Each list text of a fixture repo with skills plan, code, delegate and agents coder, planner.
function listTexts() {
  const pluginDescription = 'plan, code and delegate skills with coder and planner agent templates.';
  return {
    '.claude-plugin/plugin.json': JSON.stringify({ description: pluginDescription }),
    '.claude-plugin/marketplace.json': JSON.stringify({
      description: 'Test skills: plan, code and delegate.',
      plugins: [{ description: pluginDescription }],
    }),
    'README.md': [
      '# x', '', '## Skills', '', '| `plan` | Plans. |', '| `code` | Codes. |',
      '| `delegate` | Hands work to `coder`. |', '',
      '## Agents', '', '| `coder` | Codes. |', '| `planner` | Plans. |', '', '## Install', '',
    ].join('\n'),
    'docs/DESIGN.md': [
      '- The skill set has three skills: `plan`, `code`', '  and `delegate`. The skills other',
      '  than `plan` hold the workflows.',
      '- The project agents are two: `coder` and `planner`. The plugin ships their templates.',
      '- Other.', '',
    ].join('\n'),
    'AGENTS.md': [
      '## What this is', '', 'Rules for every armory actor: `plan`, `code`',
      'and `delegate`. The skills use host terms.', '', '## Commands', '',
    ].join('\n'),
    'skills/delegate/SKILL.md': [
      '- The project agents MUST be these two: coder and planner. Each card holds rules.',
      '- Next.', '',
    ].join('\n'),
  };
}

// Writes the fixture repo; `changes` replaces whole list texts by path.
function writeRepo(changes = {}) {
  writeFile('skills/plan/SKILL.md', 'plan\n');
  writeFile('skills/code/SKILL.md', 'code\n');
  writeFile('skills/setup/templates/agents/coder.md', 'coder\n');
  writeFile('skills/setup/templates/agents/planner.md', 'planner\n');
  for (const [rel, text] of Object.entries({ ...listTexts(), ...changes })) {
    writeFile(rel, text);
  }
  for (const skill of ['plan', 'code', 'delegate']) writeEvals(skill);
}

// The 3 load cases and 1 skip case that the eval-coverage check asks of a skill.
function writeEvals(skill) {
  for (const name of ['load-1', 'load-2', 'load-3', 'skip-1']) {
    writeFile(`evals/${skill}-${name}/case.yaml`, 'name: x\n');
  }
}

function run(args = [], cwd = tmpDir) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    return { status: e.status, stdout: e.stdout, stderr: e.stderr };
  }
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'doc-checks-'));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('doc-checks', () => {
  // req: doc-checks/TR-1
  describe('line width', () => {
    // Complete lists, so only the width check can fail.
    beforeEach(() => writeRepo());

    // req: doc-checks/TR-7
    test('line_of_90_passes', () => {
      writeFile('docs/milestones/m.md', `${'a'.repeat(90)}\n${'b'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:2: 91 > 90\n');
    });

    test('line_of_91_fails_naming_path_line_length', () => {
      writeFile('docs/milestones/m.md', `ok\n${'a'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:2: 91 > 90\n');
    });

    // req: doc-checks/TR-7
    test('table_row_is_exempt', () => {
      writeFile('docs/milestones/m.md', `|${'a'.repeat(100)}|\n${'b'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:2: 91 > 90\n');
    });

    // req: doc-checks/TR-7
    test('fenced_code_is_exempt', () => {
      writeFile('docs/milestones/m.md', `${'b'.repeat(91)}\n\`\`\`bash\n${'a'.repeat(100)}\n\`\`\`\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:1: 91 > 90\n');
    });

    test('lines_after_a_closed_fence_are_checked', () => {
      writeFile('docs/milestones/m.md', `\`\`\`\ncode\n\`\`\`\n${'a'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:4: 91 > 90\n');
    });

    test('nested_template_is_checked', () => {
      writeFile('skills/plan/templates/task.md', `${'a'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'skills/plan/templates/task.md:1: 91 > 90\n');
    });

    // req: doc-checks/TR-7
    test('file_outside_scope_is_skipped', () => {
      writeFile('docs/plans/x.md', `${'a'.repeat(91)}\n`);
      writeFile('CHANGELOG.md', `${'a'.repeat(91)}\n`);
      writeFile('docs/milestones/old/x.md', `${'a'.repeat(91)}\n`);
      writeFile('docs/milestones/m.md', `${'b'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:1: 91 > 90\n');
    });

    // req: doc-checks/TR-7
    test('counts_code_points_not_bytes', () => {
      // 90 code points: 89 letters and one emoji of 4 bytes and 2 UTF-16 units.
      writeFile('docs/milestones/m.md', `${'a'.repeat(89)}\u{1F600}\n${'b'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:2: 91 > 90\n');
    });

    test('extra_argument_exits_2', () => {
      const r = run(['.', 'more']);
      assert.equal(r.status, 2);
      assert.equal(r.stderr, 'usage: node scripts/doc-checks.mjs [root]\n');
    });
  });

  describe('split RFC keyword', () => {
    beforeEach(() => writeRepo());
    const f = 'skills/plan/templates/task.md';

    test('must_at_line_end_and_not_at_next_start_fails', () => {
      writeFile(f, 'ok\nAn agent MUST  \n  NOT do it.\n');
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, `${f}:2: split RFC keyword\n`);
    });

    test('should_at_line_end_and_not_at_next_start_fails', () => {
      writeFile(f, 'An agent SHOULD\nNOT do it.\n');
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, `${f}:1: split RFC keyword\n`);
    });

    test('must_not_on_one_line_passes', () => {
      writeFile(f, 'An agent MUST NOT\ndo it.\n');
      assert.equal(run().status, 0);
    });

    test('split_inside_fence_passes', () => {
      writeFile(f, '```\nAn agent MUST\nNOT do it.\n```\n');
      assert.equal(run().status, 0);
    });

    test('partial_words_pass', () => {
      writeFile(f, 'Pass the MUSTARD\nNOT now. And MUST\nNOTE this. A xMUST\nNOT here.\n');
      assert.equal(run().status, 0);
    });
  });

  // req: best-practices-fixes/TR-8
  describe('rendered cards', () => {
    const template =
      '---\nname: coder\nmodel: {{MODEL}}\neffort: {{EFFORT}}\n---\nBody line.\n';
    const render = (model, effort) =>
      template.replace('{{MODEL}}', model).replace('{{EFFORT}}', effort);

    beforeEach(() => {
      writeRepo();
      writeFile('skills/setup/templates/agents/coder.md', template);
    });

    test('equal_copy_passes', () => {
      writeFile('.claude/agents/coder.md', render('opus', 'high'));
      assert.equal(run().status, 0);
    });

    test('changed_body_line_fails_naming_the_card', () => {
      writeFile('.claude/agents/coder.md', template.replace('Body line.', 'Other line.'));
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'coder: rendered copy differs from template\n');
    });

    test('only_model_and_effort_differ_passes', () => {
      writeFile('.claude/agents/coder.md', render('haiku', 'low'));
      assert.equal(run().status, 0);
    });

    test('no_agents_dir_means_no_check', () => {
      assert.equal(run().status, 0);
    });
  });

  // req: doc-checks/TR-2
  describe('name lists', () => {
    test('skill_missing_from_readme_skills_fails', () => {
      writeRepo({
        'README.md': '## Skills\n\n| `plan` | x |\n| `delegate` | x |\n\n'
          + '## Agents\n\n| `coder` | x |\n| `planner` | x |\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'README.md Skills: missing code\n');
    });

    test('agent_missing_from_delegate_fails', () => {
      writeRepo({
        'skills/delegate/SKILL.md': '- The project agents MUST be these: planner.\n- Next.\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'delegate agents: missing coder\n');
    });

    test('skill_missing_from_plugin_json_fails', () => {
      writeRepo({
        '.claude-plugin/plugin.json': JSON.stringify({
          description: 'plan and delegate skills with coder and planner agent templates.',
        }),
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'plugin.json skills: missing code\n');
    });

    test('name_outside_the_region_does_not_count', () => {
      writeRepo({
        'README.md': '## Skills\n\n| `plan` | x |\n| `delegate` | x |\n\n'
          + '## Agents\n\n| `coder` | x |\n| `planner` | x |\n| `code` | x |\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'README.md Skills: missing code\n');
    });

    test('missing_start_marker_reports_not_found', () => {
      writeRepo({
        'docs/DESIGN.md': '- The skills are `plan`, `code` and `delegate`.\n'
          + '- The project agents are two: `coder` and `planner`.\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'DESIGN.md skills: not found\n');
    });

    test('word_match_needs_the_whole_word', () => {
      writeRepo({
        '.claude-plugin/plugin.json': JSON.stringify({
          description: 'planner, code and delegate skills with coder and planner agent templates.',
        }),
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'plugin.json skills: missing plan\n');
    });

    test('width_and_list_failures_print_together', () => {
      writeRepo({
        'skills/delegate/SKILL.md': `- The project agents MUST be these: planner.\n${'a'.repeat(91)}\n`,
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(
        r.stderr,
        'skills/delegate/SKILL.md:2: 91 > 90\ndelegate agents: missing coder\n',
      );
    });
  });

  // req: doc-checks/TR-5
  describe('list regions', () => {
    test('readme_row_match_ignores_a_name_in_another_row', () => {
      writeRepo({
        'README.md': '## Skills\n\n| `plan` | Uses `code`. |\n| `delegate` | x |\n\n'
          + '## Agents\n\n| `coder` | x |\n| `planner` | x |\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'README.md Skills: missing code\n');
    });

    test('agents_md_region_ends_at_the_list', () => {
      writeRepo({
        'AGENTS.md': '## What this is\n\nRules for every armory actor: `plan` and\n'
          + '`delegate`. The skills use host terms, as `code` does.\n\n## Commands\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'AGENTS.md What this is: missing code\n');
    });

    test('design_skills_region_ends_at_the_list', () => {
      writeRepo({
        'docs/DESIGN.md': '- The skill set has two skills: `plan` and `delegate`. The skills other\n'
          + '  than `code` hold the workflows.\n'
          + '- The project agents are two: `coder` and `planner`. The plugin ships them.\n',
      });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'DESIGN.md skills: missing code\n');
    });
  });

  // req: doc-checks/TR-6
  describe('coverage of lists, paths and root', () => {
    const plugin = 'plan, code and delegate skills with coder and planner agent templates.';
    const noCode = 'plan and delegate skills with coder and planner agent templates.';
    const noCoder = 'plan, code and delegate skills with planner agent templates.';
    const market = (description, pluginDescription) => JSON.stringify({
      description,
      plugins: [{ description: pluginDescription }],
    });
    // Each row drops one name from one list text of listTexts().
    const cases = [
      ['plugin.json skills', 'code', '.claude-plugin/plugin.json', JSON.stringify({ description: noCode })],
      ['plugin.json agents', 'coder', '.claude-plugin/plugin.json', JSON.stringify({ description: noCoder })],
      ['marketplace.json skills', 'code', '.claude-plugin/marketplace.json',
        market('Test skills: plan and delegate.', plugin)],
      ['marketplace.json plugin skills', 'code', '.claude-plugin/marketplace.json',
        market('Test skills: plan, code and delegate.', noCode)],
      ['marketplace.json plugin agents', 'coder', '.claude-plugin/marketplace.json',
        market('Test skills: plan, code and delegate.', noCoder)],
      ['README.md Skills', 'plan', 'README.md',
        '## Skills\n\n| `code` | x |\n| `delegate` | x |\n\n## Agents\n\n| `coder` | x |\n| `planner` | x |\n'],
      ['README.md Agents', 'planner', 'README.md',
        '## Skills\n\n| `plan` | x |\n| `code` | x |\n| `delegate` | x |\n\n## Agents\n\n| `coder` | x |\n'],
      ['DESIGN.md skills', 'delegate', 'docs/DESIGN.md',
        '- The skill set has two: `plan` and `code`. The skills other than these.\n'
          + '- The project agents are two: `coder` and `planner`. The plugin ships them.\n'],
      // req: doc-checks/TR-9
      ['DESIGN.md agents', 'coder', 'docs/DESIGN.md',
        '- The skill set has three: `plan`, `code` and `delegate`. The skills other than these.\n'
          + '- The project agents are one: `planner`. The plugin ships `coder` too.\n'],
      ['AGENTS.md What this is', 'delegate', 'AGENTS.md',
        '## What this is\n\nRules for every armory actor: `plan` and `code`. The skills use terms.\n'],
      // req: doc-checks/TR-9
      ['delegate agents', 'planner', 'skills/delegate/SKILL.md',
        '- The project agents MUST be these: coder. Each card holds rules, as planner does.\n'],
    ];

    for (const [list, name, rel, text] of cases) {
      test(`each_list_reports_a_missing_name: ${list}`, () => {
        writeRepo({ [rel]: text });
        const r = run();
        assert.equal(r.status, 1);
        assert.equal(r.stderr, `${list}: missing ${name}\n`);
      });
    }

    // req: doc-checks/TR-9
    test('complete_repo_exits_0', () => {
      writeRepo();
      const r = run();
      assert.equal(r.status, 0);
      assert.equal(r.stderr, '');
    });

    test('design_md_is_width_checked', () => {
      writeRepo({ 'docs/DESIGN.md': `${listTexts()['docs/DESIGN.md']}${'a'.repeat(91)}\n` });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/DESIGN.md:6: 91 > 90\n');
    });

    test('claude_agents_is_width_checked', () => {
      writeRepo();
      writeFile('skills/setup/templates/agents/coder.md', 'model: x\n');
      writeFile('.claude/agents/coder.md', `model: ${'a'.repeat(84)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, '.claude/agents/coder.md:1: 91 > 90\n');
    });

    test('root_argument_is_used', () => {
      writeRepo();
      writeFile('docs/milestones/m.md', `${'a'.repeat(91)}\n`);
      const r = run([tmpDir], tmpdir());
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'docs/milestones/m.md:1: 91 > 90\n');
    });
  });

  // req: skill-evals/TR-1
  describe('eval coverage', () => {
    beforeEach(() => writeRepo());

    test('full_coverage_passes', () => {
      const r = run();
      assert.equal(r.status, 0);
      assert.equal(r.stderr, '');
    });

    test('two_load_dirs_fail', () => {
      rmSync(join(tmpDir, 'evals/code-load-3'), { recursive: true });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'code: fewer than 3 load evals\n');
    });

    test('no_skip_dir_fails', () => {
      rmSync(join(tmpDir, 'evals/plan-skip-1'), { recursive: true });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'plan: no skip eval\n');
    });

    test('user_only_skill_needs_no_evals', () => {
      writeFile('skills/delegate/SKILL.md', '---\nname: delegate\n'
        + 'disable-model-invocation: true\n---\n'
        + listTexts()['skills/delegate/SKILL.md']);
      for (const name of ['load-1', 'load-2', 'load-3', 'skip-1']) {
        rmSync(join(tmpDir, `evals/delegate-${name}`), { recursive: true });
      }
      const r = run();
      assert.equal(r.status, 0);
      assert.equal(r.stderr, '');
    });

    test('dir_without_case_yaml_does_not_count', () => {
      rmSync(join(tmpDir, 'evals/code-load-3/case.yaml'));
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'code: fewer than 3 load evals\n');
    });

    // req: skill-evals/TR-11
    test('core_with_one_load_and_one_skip_passes', () => {
      const t = listTexts();
      const addCore = (text) => text.replaceAll('plan, code and delegate', 'core, plan, code and delegate');
      writeRepo({
        '.claude-plugin/plugin.json': addCore(t['.claude-plugin/plugin.json']),
        '.claude-plugin/marketplace.json': addCore(t['.claude-plugin/marketplace.json']),
        'docs/DESIGN.md': t['docs/DESIGN.md'].replace('three skills: `plan`', 'four skills: `core`, `plan`'),
        'AGENTS.md': t['AGENTS.md'].replace('actor: `plan`', 'actor: `core`, `plan`'),
        'README.md': t['README.md'].replace('| `plan`', '| `core` | Rules. |\n| `plan`'),
      });
      writeFile('skills/core/SKILL.md', '---\nname: core\n---\nbody\n');
      writeFile('evals/core-load-1/case.yaml', 'name: x\n');
      writeFile('evals/core-skip-1/case.yaml', 'name: x\n');
      const r = run();
      assert.equal(r.status, 0);
      assert.equal(r.stderr, '');
    });

    // req: skill-evals/TR-11
    test('other_skill_with_one_load_still_fails', () => {
      rmSync(join(tmpDir, 'evals/code-load-3'), { recursive: true });
      rmSync(join(tmpDir, 'evals/code-load-2'), { recursive: true });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, 'code: fewer than 3 load evals\n');
    });

    test('no_evals_dir_reports_every_skill', () => {
      rmSync(join(tmpDir, 'evals'), { recursive: true });
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stderr, [
        'code: fewer than 3 load evals', 'code: no skip eval',
        'delegate: fewer than 3 load evals', 'delegate: no skip eval',
        'plan: fewer than 3 load evals', 'plan: no skip eval', '',
      ].join('\n'));
    });
  });

  // req: doc-checks/TR-8
  describe('unreadable file', () => {
    test('dangling_symlink_is_named', () => {
      writeRepo();
      mkdirSync(join(tmpDir, 'docs/milestones'), { recursive: true });
      symlinkSync(join(tmpDir, 'gone.md'), join(tmpDir, 'docs/milestones/bad.md'));
      writeFile('docs/milestones/m.md', `${'b'.repeat(91)}\n`);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(
        r.stderr,
        'docs/milestones/bad.md: cannot read (ENOENT)\ndocs/milestones/m.md:1: 91 > 90\n',
      );
    });
  });
});
