import { describe, expect, it } from 'vitest';
import { buildRedirectLines } from '../generateGoRedirects.js';

describe('buildRedirectLines', () => {
  it('emits legacy /tools rules plus one 302 per linked entry', () => {
    const lines = buildRedirectLines([
      { slug: 'acme-tools-us', admitad: { gotolink: 'https://tatrck.com/h/abc' } },
      { slug: 'no-link', admitad: { gotolink: null } },
      {
        slug: 'vevor-us',
        admitad: { gotolink: 'https://tatrck.com/h/def', cpcGotolink: 'https://tatrck.com/h/ghi' },
      },
    ]);
    expect(lines[0]).toBe('/tools / 301');
    expect(lines[1]).toBe('/tools/* / 301');
    expect(lines).toContain('/go/acme-tools-us https://tatrck.com/h/abc 302');
    expect(lines).toContain('/go/vevor-us~cpc https://tatrck.com/h/ghi 302');
    expect(lines.join('\n')).not.toContain('no-link');
  });

  it('throws past the Cloudflare 2000-static-rule limit', () => {
    const entries = Array.from({ length: 2001 }, (_, i) => ({
      slug: `s${i}`,
      admitad: { gotolink: 'https://tatrck.com/h/x' },
    }));
    expect(() => buildRedirectLines(entries)).toThrow(/2000/);
  });
});
