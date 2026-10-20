import { Page, Route, Request } from '@playwright/test';

export async function mockSubscriptionSuccess(page: Page) {
  await page.route('**/subscribe*', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Subscription successful!' }),
    });
  });
}

export async function mockSubscriptionFailure(page: Page) {
  await page.route('**/subscribe*', async (route: Route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Server error' }),
    });
  });
}

export async function interceptAndLogApiRequests(page: Page, urlPattern: string | RegExp) {
  const captured: { url: string; method: string; body?: string }[] = [];

  await page.route(urlPattern, async (route: Route, request: Request) => {
    captured.push({
      url: request.url(),
      method: request.method(),
      body: request.postData() ?? undefined,
    });
    await route.continue();
  });

  return captured;
}
