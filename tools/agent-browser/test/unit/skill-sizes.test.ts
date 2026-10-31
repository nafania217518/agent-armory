import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// The repo has one unit suite; the plugin script is tested from it.
const scriptPath = fileURLToPath(new URL('../../../../scripts/skill-sizes.mjs', import.meta.url));

type Run = { status: number; stdout: string; stderr: string };

let tmpDir: string;

function writeSkill(name: string, text: string, dir = 'skills'): void {
  mkdirSync(join(tmpDir, dir, name), { recursive: true });
  writeFileSync(join(tmpDir, dir, name, 'SKILL.md'), text);
}

// A skill file of `lines` newline-terminated lines with the given max.
function skillText(max: string, lines: number): string {
  const head = ['---', 'name: x', `max-lines: ${max}`, '---'];
  const body = Array.from({ length: Math.max(0, lines - head.length) }, (_, i) => `line ${i}`);
  return [...head, ...body].join('\n') + '\n';
}

function run(args: string[] = []): Run {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      cwd: tmpDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    const e = err as Run;
    return { status: e.status, stdout: e.stdout, stderr: e.stderr };
  }
}

function stderrLines(r: Run): string[] {
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
    it('all_under_max_exits_0', () => {
      writeSkill('a', skillText('10', 5));
      writeSkill('b', skillText('20', 6));
      expect(run().status).toBe(0);
    });

    it('prints_one_line_per_skill_sorted', () => {
      writeSkill('code', skillText('10', 5));
      writeSkill('audit', skillText('20', 6));
      expect(run().stdout).toBe('audit: 6/20\ncode: 5/10\n');
    });

    it('skill_at_exact_max_passes', () => {
      writeSkill('a', skillText('7', 7));
      const r = run();
      expect(r.status).toBe(0);
      expect(r.stdout).toBe('a: 7/7\n');
    });

    it('counts_lines_like_wc_without_trailing_newline', () => {
      writeSkill('a', '---\nmax-lines: 9\n---\nlast');
      expect(run().stdout).toBe('a: 3/9\n');
    });
  });

  // req: rebuild-skills/TR-2
  describe('over max', () => {
    it('one_over_by_one_exits_1_and_names_it', () => {
      writeSkill('a', skillText('5', 5));
      writeSkill('big', skillText('5', 6));
      const r = run();
      expect(r.status).toBe(1);
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('big');
    });

    it('two_over_names_both', () => {
      writeSkill('one', skillText('5', 6));
      writeSkill('two', skillText('5', 9));
      const r = run();
      expect(r.status).toBe(1);
      const lines = stderrLines(r);
      expect(lines).toHaveLength(2);
      expect(lines[0]).toContain('one');
      expect(lines[1]).toContain('two');
    });

    it('over_skill_still_prints_stdout_line', () => {
      writeSkill('big', skillText('5', 6));
      expect(run().stdout).toBe('big: 6/5\n');
    });
  });

  // req: rebuild-skills/TR-3
  describe('bad max-lines', () => {
    function expectNamed(text: string): void {
      writeSkill('ok', skillText('10', 5));
      writeSkill('bad', text);
      const r = run();
      expect(r.status).toBe(1);
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('bad');
    }

    it('missing_field_exits_1_named', () => {
      expectNamed('---\nname: bad\n---\nbody\n');
    });

    it('value_abc_exits_1_named', () => {
      expectNamed(skillText('abc', 5));
    });

    it('value_1_5_exits_1_named', () => {
      expectNamed(skillText('1.5', 5));
    });

    it('value_0_exits_1_named', () => {
      expectNamed(skillText('0', 5));
    });

    it('value_negative_exits_1_named', () => {
      expectNamed(skillText('-3', 5));
    });

    it('field_only_in_body_counts_as_missing', () => {
      expectNamed('---\nname: bad\n---\nmax-lines: 50\n');
    });

    it('no_frontmatter_exits_1_named', () => {
      expectNamed('max-lines: 50\nbody\n');
    });
  });

  // req: rebuild-skills/TR-4
  describe('skills dir', () => {
    it('default_dir_from_cwd', () => {
      writeSkill('a', skillText('10', 5));
      expect(run().stdout).toBe('a: 5/10\n');
    });

    it('first_argument_dir_used', () => {
      writeSkill('other', skillText('10', 4), 'elsewhere');
      const r = run([join(tmpDir, 'elsewhere')]);
      expect(r.status).toBe(0);
      expect(r.stdout).toBe('other: 4/10\n');
    });
  });

  // req: rebuild-skills/TR-5
  describe('bad command line or dir', () => {
    it('two_args_exits_2_prints_usage', () => {
      writeSkill('a', skillText('10', 5));
      const r = run(['skills', 'more']);
      expect(r.status).toBe(2);
      expect(r.stderr).toBe('usage: node scripts/skill-sizes.mjs [skills-dir]\n');
    });

    it('missing_dir_exits_1_names_it', () => {
      const r = run(['nope']);
      expect(r.status).toBe(1);
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('nope');
    });

    it('empty_dir_exits_1', () => {
      mkdirSync(join(tmpDir, 'skills'));
      const r = run();
      expect(r.status).toBe(1);
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('skills');
    });
  });

  // req: rebuild-skills/TR-9
  describe('symlinks and unreadable files', () => {
    it('symlinked_skill_dir_is_checked', () => {
      writeSkill('real', skillText('5', 6), 'outside');
      mkdirSync(join(tmpDir, 'skills'));
      symlinkSync(join(tmpDir, 'outside', 'real'), join(tmpDir, 'skills', 'linked'), 'dir');
      const r = run();
      expect(r.status).toBe(1);
      expect(r.stdout).toBe('linked: 6/5\n');
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('linked');
    });

    // req: rebuild-skills/TR-9
    it('dangling_skill_md_link_exits_1_named', () => {
      writeSkill('good', skillText('10', 5));
      mkdirSync(join(tmpDir, 'skills', 'gone'));
      symlinkSync('nowhere.md', join(tmpDir, 'skills', 'gone', 'SKILL.md'));
      const r = run();
      expect(r.status).toBe(1);
      expect(stderrLines(r)).toHaveLength(1);
      expect(r.stderr).toContain('gone');
    });

    it('unreadable_skill_md_exits_1_named', (ctx) => {
      if (process.getuid?.() === 0) ctx.skip('root reads any file, so chmod 000 proves nothing');
      writeSkill('locked', skillText('10', 5));
      const file = join(tmpDir, 'skills', 'locked', 'SKILL.md');
      chmodSync(file, 0o000);
      try {
        const r = run();
        expect(r.status).toBe(1);
        expect(stderrLines(r)).toHaveLength(1);
        expect(r.stderr).toContain(join('skills', 'locked', 'SKILL.md'));
      } finally {
        chmodSync(file, 0o644);
      }
    });
  });
});
