import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

const scriptPath = fileURLToPath(new URL('./skill-sizes.mjs', import.meta.url));

let tmpDir;

function writeSkill(name, text, dir = 'skills') {
  mkdirSync(join(tmpDir, dir, name), { recursive: true });
  writeFileSync(join(tmpDir, dir, name, 'SKILL.md'), text);
}

// A skill file of `lines` newline-terminated lines with the given max.
function skillText(max, lines) {
  const head = ['---', 'name: x', `max-lines: ${max}`, '---'];
  const body = Array.from({ length: Math.max(0, lines - head.length) }, (_, i) => `line ${i}`);
  return [...head, ...body].join('\n') + '\n';
}

function run(args = []) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      cwd: tmpDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    return { status: e.status, stdout: e.stdout, stderr: e.stderr };
  }
}

function stderrLines(r) {
  return r.stderr.trimEnd().split('\n');
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'skill-sizes-'));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('skill-sizes', () => {
  // req: rebuild-skills/TR-1
  describe('within max', () => {
    test('all_under_max_exits_0', () => {
      writeSkill('a', skillText('10', 5));
      writeSkill('b', skillText('20', 6));
      assert.equal(run().status, 0);
    });

    test('prints_one_line_per_skill_sorted', () => {
      writeSkill('code', skillText('10', 5));
      writeSkill('audit', skillText('20', 6));
      assert.equal(run().stdout, 'audit: 6/20\ncode: 5/10\n');
    });

    test('skill_at_exact_max_passes', () => {
      writeSkill('a', skillText('7', 7));
      const r = run();
      assert.equal(r.status, 0);
      assert.equal(r.stdout, 'a: 7/7\n');
    });

    test('counts_lines_like_wc_without_trailing_newline', () => {
      writeSkill('a', '---\nmax-lines: 9\n---\nlast');
      assert.equal(run().stdout, 'a: 3/9\n');
    });
  });

  // req: rebuild-skills/TR-2
  describe('over max', () => {
    test('one_over_by_one_exits_1_and_names_it', () => {
      writeSkill('a', skillText('5', 5));
      writeSkill('big', skillText('5', 6));
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('big'));
    });

    test('two_over_names_both', () => {
      writeSkill('one', skillText('5', 6));
      writeSkill('two', skillText('5', 9));
      const r = run();
      assert.equal(r.status, 1);
      const lines = stderrLines(r);
      assert.equal(lines.length, 2);
      assert.ok(lines[0].includes('one'));
      assert.ok(lines[1].includes('two'));
    });

    test('over_skill_still_prints_stdout_line', () => {
      writeSkill('big', skillText('5', 6));
      assert.equal(run().stdout, 'big: 6/5\n');
    });
  });

  // req: rebuild-skills/TR-3
  describe('bad max-lines', () => {
    function expectNamed(text) {
      writeSkill('ok', skillText('10', 5));
      writeSkill('bad', text);
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('bad'));
    }

    test('missing_field_exits_1_named', () => {
      expectNamed('---\nname: bad\n---\nbody\n');
    });

    test('value_abc_exits_1_named', () => {
      expectNamed(skillText('abc', 5));
    });

    test('value_1_5_exits_1_named', () => {
      expectNamed(skillText('1.5', 5));
    });

    test('value_0_exits_1_named', () => {
      expectNamed(skillText('0', 5));
    });

    test('value_negative_exits_1_named', () => {
      expectNamed(skillText('-3', 5));
    });

    test('field_only_in_body_counts_as_missing', () => {
      expectNamed('---\nname: bad\n---\nmax-lines: 50\n');
    });

    test('no_frontmatter_exits_1_named', () => {
      expectNamed('max-lines: 50\nbody\n');
    });
  });

  // req: rebuild-skills/TR-4
  describe('skills dir', () => {
    test('default_dir_from_cwd', () => {
      writeSkill('a', skillText('10', 5));
      assert.equal(run().stdout, 'a: 5/10\n');
    });

    test('first_argument_dir_used', () => {
      writeSkill('other', skillText('10', 4), 'elsewhere');
      const r = run([join(tmpDir, 'elsewhere')]);
      assert.equal(r.status, 0);
      assert.equal(r.stdout, 'other: 4/10\n');
    });
  });

  // req: rebuild-skills/TR-5
  describe('bad command line or dir', () => {
    test('two_args_exits_2_prints_usage', () => {
      writeSkill('a', skillText('10', 5));
      const r = run(['skills', 'more']);
      assert.equal(r.status, 2);
      assert.equal(r.stderr, 'usage: node scripts/skill-sizes.mjs [skills-dir]\n');
    });

    test('missing_dir_exits_1_names_it', () => {
      const r = run(['nope']);
      assert.equal(r.status, 1);
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('nope'));
    });

    test('empty_dir_exits_1', () => {
      mkdirSync(join(tmpDir, 'skills'));
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('skills'));
    });
  });

  // req: rebuild-skills/TR-9
  describe('symlinks and unreadable files', () => {
    test('symlinked_skill_dir_is_checked', () => {
      writeSkill('real', skillText('5', 6), 'outside');
      mkdirSync(join(tmpDir, 'skills'));
      symlinkSync(join(tmpDir, 'outside', 'real'), join(tmpDir, 'skills', 'linked'), 'dir');
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(r.stdout, 'linked: 6/5\n');
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('linked'));
    });

    // req: rebuild-skills/TR-9
    test('dangling_skill_md_link_exits_1_named', () => {
      writeSkill('good', skillText('10', 5));
      mkdirSync(join(tmpDir, 'skills', 'gone'));
      symlinkSync('nowhere.md', join(tmpDir, 'skills', 'gone', 'SKILL.md'));
      const r = run();
      assert.equal(r.status, 1);
      assert.equal(stderrLines(r).length, 1);
      assert.ok(r.stderr.includes('gone'));
    });

    test('unreadable_skill_md_exits_1_named', (t) => {
      if (process.getuid?.() === 0) {
        t.skip('root reads any file, so chmod 000 proves nothing');
        return;
      }
      writeSkill('locked', skillText('10', 5));
      const file = join(tmpDir, 'skills', 'locked', 'SKILL.md');
      chmodSync(file, 0o000);
      try {
        const r = run();
        assert.equal(r.status, 1);
        assert.equal(stderrLines(r).length, 1);
        assert.ok(r.stderr.includes(join('skills', 'locked', 'SKILL.md')));
      } finally {
        chmodSync(file, 0o644);
      }
    });
  });
});
