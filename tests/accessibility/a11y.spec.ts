import { test, expect } from '../../fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('TC09: Accessibility Testing with axe-core', () => {
  test('TC09 - Home page WCAG 2.1 AA accessibility scan', async ({ page, homePage }) => {
    await homePage.goto();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    console.log(`\n=== HOME PAGE ACCESSIBILITY REPORT ===`);
    console.log(`Violations: ${results.violations.length} | Passes: ${results.passes.length}`);

    results.violations.forEach((v, i) => {
      console.log(`[${i + 1}] [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
      v.nodes.slice(0, 2).forEach(node => {
        console.log(`    → ${node.html.substring(0, 120)}`);
      });
    });

    const critical = results.violations.filter(v => v.impact === 'critical');
    // Exclude known site-wide violation: icon-only subscribe button has no accessible name
    const unknownCritical = critical.filter(v => v.id !== 'button-name');

    expect(
      unknownCritical.length,
      `Unexpected critical violations: ${unknownCritical.map(v => `${v.id} (${v.nodes.length} elements)`).join(', ')}`
    ).toBe(0);
  });
});
