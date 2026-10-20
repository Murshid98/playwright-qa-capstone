import { Page, Locator } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeout = 10_000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForUrl(page: Page, urlPattern: string | RegExp, timeout = 15_000) {
  await page.waitForURL(urlPattern, { timeout });
}

export async function waitForElementCount(locator: Locator, count: number, timeout = 10_000) {
  await locator.nth(count - 1).waitFor({ state: 'visible', timeout });
}

export async function retryClick(locator: Locator, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.click({ timeout: 5_000 });
      return;
    } catch {
      if (i === maxRetries - 1) throw new Error(`Failed to click after ${maxRetries} attempts`);
    }
  }
}
