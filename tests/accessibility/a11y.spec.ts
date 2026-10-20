import { test, expect } from '../../fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('TC15-TC16: Accessibility Testing with axe-core', () => {
  test('TC15 - Home page WCAG 2.1 AA accessibility scan', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    // Log all violations as detailed findings
    console.log(`\n=== HOME PAGE ACCESSIBILITY REPORT ===`);
    console.log(`Total Violations Found: ${results.violations.length}`);
    console.log(`Total Passes: ${results.passes.length}`);
    console.log(`Inapplicable: ${results.inapplicable.length}`);

    if (results.violations.length > 0) {
      console.log('\nViolations Detail:');
      results.violations.forEach((v, i) => {
        console.log(`\n[${i + 1}] Impact: ${v.impact?.toUpperCase()} | Rule: ${v.id}`);
        console.log(`    Description: ${v.description}`);
        console.log(`    Help: ${v.helpUrl}`);
        console.log(`    Affected Elements: ${v.nodes.length}`);
        v.nodes.slice(0, 2).forEach(node => {
          console.log(`    → ${node.html.substring(0, 120)}`);
        });
      });
    }

    // Categorize violations by impact
    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious  = results.violations.filter(v => v.impact === 'serious');
    const moderate = results.violations.filter(v => v.impact === 'moderate');
    const minor    = results.violations.filter(v => v.impact === 'minor');

    console.log(`\nSummary: Critical=${critical.length} Serious=${serious.length} Moderate=${moderate.length} Minor=${minor.length}`);

    // Known site violation: subscribe button uses icon-only (no text) - #button-name
    // We document this as a finding but do not fail the test since it is a pre-existing issue
    const unknownCritical = critical.filter(v => v.id !== 'button-name');
    expect(
      unknownCritical.length,
      `Unexpected critical violations: ${unknownCritical.map(v => `${v.id} (${v.nodes.length} elements)`).join(', ')}`
    ).toBe(0);
  });

  test('TC16 - Login page WCAG 2.1 AA accessibility scan', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    console.log(`\n=== LOGIN PAGE ACCESSIBILITY REPORT ===`);
    console.log(`Total Violations: ${results.violations.length}`);
    console.log(`Passes: ${results.passes.length}`);

    results.violations.forEach((v, i) => {
      console.log(`[${i + 1}] [${v.impact}] ${v.id}: ${v.description}`);
    });

    const critical = results.violations.filter(v => v.impact === 'critical');
    // Exclude known site-wide button-name violation
    const unknownCritical = critical.filter(v => v.id !== 'button-name');

    expect(
      unknownCritical.length,
      `Unexpected critical a11y violations on login page: ${unknownCritical.map(v => v.id).join(', ')}`
    ).toBe(0);
  });

  test('TC16b - Products page WCAG 2.1 A accessibility scan', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .exclude('iframe')
      .analyze();

    console.log(`\n=== PRODUCTS PAGE ACCESSIBILITY REPORT (WCAG 2.1 A) ===`);
    console.log(`Total Violations: ${results.violations.length}`);

    results.violations.forEach((v, i) => {
      console.log(`[${i + 1}] [${v.impact}] ${v.id}: ${v.description}`);
    });

    const critical = results.violations.filter(v => v.impact === 'critical');
    // Exclude known site-wide button-name violation (icon-only subscribe button)
    const unknownCritical = critical.filter(v => v.id !== 'button-name');
    expect(
      unknownCritical.length,
      `Unexpected critical a11y violations on products page: ${unknownCritical.map(v => v.id).join(', ')}`
    ).toBe(0);
  });
});
