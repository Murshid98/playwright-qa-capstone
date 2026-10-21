import { test, expect } from '../../fixtures';

test.describe('TC11: Network Interception and Mocking', () => {
  test('TC11 - Intercept requests and mock a 404 response', async ({ page, homePage }) => {
    // Part A: Spy on all requests during home page load
    const intercepted: { url: string; method: string }[] = [];

    await page.route('**/*', async (route, request) => {
      intercepted.push({ url: request.url(), method: request.method() });
      await route.continue();
    });

    await homePage.goto();
    await homePage.subscribeWithEmail('mocked-user@test.com');

    console.log(`\nCaptured ${intercepted.length} total requests during home page load.`);
    expect(intercepted.length).toBeGreaterThan(0);

    // Part B: Mock a 404 response for a non-existent product
    await page.unrouteAll();

    await page.route('**/product_details/99999', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'text/html',
        body: '<h1>Product not found</h1>',
      });
    });

    const response = await page.goto('/product_details/99999');
    expect(response?.status()).toBe(404);
  });
});
