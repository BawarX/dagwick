import { describe, expect, it } from "vitest";

import { STYLES } from "./styles";

/** WCAG 2 contrast ratio between two #rrggbb colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The light theme's value of a token (the first definition in STYLES). */
function token(name: string): string {
  const m = STYLES.match(new RegExp(`--dagwick-${name}:\\s*(#[0-9a-f]{6})`));
  if (!m) throw new Error(`no --dagwick-${name}`);
  return m[1];
}

const AA = 4.5; // small text

describe("text contrast (WCAG AA, #59)", () => {
  it("keeps the white letter on every grade badge at 4.5:1", () => {
    for (const grade of ["A", "B", "C", "D", "F"]) {
      const m = STYLES.match(new RegExp(`\\.dagwick-badge--${grade} \\{ background: (#[0-9a-f]{6}); \\}`));
      expect(m, grade).not.toBeNull();
      expect(contrast("#ffffff", m![1]), grade).toBeGreaterThanOrEqual(AA);
    }
  });

  it("uses a darker amber for small text in the light theme", () => {
    expect(contrast(token("accent-text"), token("bg"))).toBeGreaterThanOrEqual(AA);
    expect(contrast(token("accent-text"), token("surface"))).toBeGreaterThanOrEqual(AA);
    for (const cls of ["brand", "goal-step", "fix-label", "more"]) {
      const rule = STYLES.match(new RegExp(`\\.dagwick-${cls} \\{[^}]*\\}`))![0];
      expect(rule, cls).toContain("var(--dagwick-accent-text)");
    }
  });

  it("keeps passed chips and tab counts readable", () => {
    expect(contrast(token("pass"), token("pass-bg"))).toBeGreaterThanOrEqual(AA);
    expect(contrast(token("text"), token("border"))).toBeGreaterThanOrEqual(AA);
    expect(STYLES.match(/\.dagwick-count \{[^}]*\}/)![0]).toContain("color: var(--dagwick-text)");
  });
});
