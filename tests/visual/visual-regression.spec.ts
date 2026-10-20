import { test, expect } from '../../fixtures';

test.describe('TC17-TC18: Visual Regression Testing', () => {
  test('TC17 - Home page visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Hide ads and dynamic elements before snapshot
    await page.addStyleTag({
      content: `
        iframe { visibility: hidden !important; }
        #adDiv { visibility: hidden !important; }
        .carousel-inner { animation: none !important; transition: none !important; }
      `,
    });

    // Wait for hero image to be visible
    await page.locator('#slider').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('TC18 - Login page visual snapshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.addStyleTag({
      content: `iframe { visibility: hidden !important; }`,
    });

    await page.locator('.login-form').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('TC18b - Products page visual snapshot', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');

    await page.addStyleTag({
      content: `iframe { visibility: hidden !important; }`,
    });

    await page.locator('.features_items').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('products-page.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
});
