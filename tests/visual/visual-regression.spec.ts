import { test, expect } from '../../fixtures';

test.describe('TC10: Visual Regression Testing', () => {
  test('TC10 - Home page visual snapshot', async ({ page, homePage }) => {
    // Block all font downloads so document.fonts.ready resolves instantly.
    // WebKit's font-loading can exceed Playwright's internal 5s screenshot-stability timeout
    // when external or self-hosted .woff2 files are slow to download.
    await page.route('**fonts.googleapis.com/**', route => route.abort().catch(() => {}));
    await page.route('**fonts.gstatic.com/**', route => route.abort().catch(() => {}));
    await page.route('**/*.{woff,woff2,ttf,eot,otf}', route => route.abort().catch(() => {}));

    await homePage.goto();

    await page.addStyleTag({
      content: `
        iframe { visibility: hidden !important; }
        #adDiv { visibility: hidden !important; }
        .carousel-inner { animation: none !important; transition: none !important; }
      `,
    });

    // Wait for main product grid (more reliable than #slider which can be slow on WebKit)
    await page.locator('.features_items').waitFor({ state: 'visible', timeout: 60000 });
    // Allow fonts and remaining resources to settle before capturing
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.15,
      animations: 'disabled',
      timeout: 60000,
    });
  });
});
