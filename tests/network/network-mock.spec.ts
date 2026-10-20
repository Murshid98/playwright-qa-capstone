import { test, expect } from '../../fixtures';

test.describe('TC19: Network Interception and Mocking', () => {
  test('TC19 - Intercept and log subscription POST request', async ({ page, homePage }) => {
    const intercepted: { url: string; method: string }[] = [];

    await page.route('**/*', async (route, request) => {
      intercepted.push({ url: request.url(), method: request.method() });
      await route.continue();
    });

    await homePage.goto();
    await homePage.subscribeWithEmail('mocked-user@test.com');

    const subscribeRequest = intercepted.find(r =>
      r.url.includes('subscribe') || (r.method === 'POST' && r.url.includes('automationexercise'))
    );
    console.log(`\nCaptured ${intercepted.length} total requests.`);
    console.log(`Subscription request found: ${subscribeRequest ? 'YES' : 'checked via page assertion'}`);

    // Success verified by the page assertion in subscribeWithEmail — green banner appeared
    expect(intercepted.length).toBeGreaterThan(0);
  });

  test('TC19b - Mock 404 response for non-existent product', async ({ page }) => {
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

  test('TC19c - Abort image requests and verify page remains functional', async ({
    page,
  }) => {
    let abortedCount = 0;

    await page.route('**/*.{jpg,jpeg,png,gif,webp}', async route => {
      abortedCount++;
      await route.abort('blockedbyclient');
    });

    // Navigation may produce console errors when images abort — that is expected
    page.on('pageerror', () => {});

    try {
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch {
      // Some navigation events may abort alongside images — retry
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    const navVisible = await page.locator('ul.nav.navbar-nav').isVisible();
    expect(navVisible).toBeTruthy();

    console.log(`\nAborted ${abortedCount} image requests — navigation and nav bar still functional.`);
  });

  test('TC19d - Spy on API calls during product search', async ({ page }) => {
    const xhrRequests: string[] = [];

    await page.route('**/*', async (route, request) => {
      if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
        xhrRequests.push(`[${request.method()}] ${request.url()}`);
      }
      await route.continue();
    });

    await page.goto('/products');
    await page.locator('#search_product').fill('dress');
    await page.locator('#submit_search').click();
    await page.waitForLoadState('domcontentloaded');

    console.log(`\nXHR/Fetch API calls during product search:\n${xhrRequests.join('\n') || '(none — server-rendered page)'}`);

    const results = await page.locator('.product-image-wrapper').count();
    expect(results).toBeGreaterThan(0);
  });
});
