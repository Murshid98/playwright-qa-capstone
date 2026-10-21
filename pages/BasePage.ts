import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string = '') {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (attempt === 0 && (msg.includes('ERR_ABORTED') || msg.includes('frame was detached') || msg.includes('Timeout'))) {
          await this.page.waitForTimeout(3000);
          continue;
        }
        throw e;
      }
      // Detect Cloudflare 5xx error pages (served as valid HTTP, not thrown as errors)
      if (attempt === 0) {
        const isCfError = await this.page.locator('h1:has-text("timeout occurred")').isVisible({ timeout: 500 }).catch(() => false);
        if (isCfError) {
          await this.page.waitForTimeout(5000);
          continue;
        }
      }
      break;
    }
  }

  // Starts the navigation listener BEFORE clicking to avoid the waitForLoadState race
  // condition where the page is already at domcontentloaded and the call returns immediately.
  // force=true (default) bypasses Cloudflare <ins> ad overlays that intercept clicks on links/buttons.
  protected async clickAndWaitForNav(locator: Locator, timeout = 180_000, force = true): Promise<void> {
    const currentUrl = this.page.url();
    await Promise.all([
      this.page.waitForURL(url => url.href !== currentUrl, { timeout, waitUntil: 'domcontentloaded' }),
      locator.click({ noWaitAfter: true, force }),
    ]);
    // Detect Cloudflare 5xx error pages served as valid HTTP after navigation
    const isCfError = await this.page.locator('h1:has-text("timeout occurred")').isVisible({ timeout: 500 }).catch(() => false);
    if (isCfError) {
      await this.page.waitForTimeout(5000);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
  }

  // Dismiss any ad modal overlays that may appear over page content (belt-and-suspenders beyond ad blocking).
  protected async dismissAdModal(): Promise<void> {
    const closeSelectors = [
      'a:visible:has-text("Close")',
      'button:visible:has-text("Close")',
      '[aria-label="Close"]:visible',
      '[aria-label="close"]:visible',
      'div:visible:has-text("Close") > a',
    ];
    for (const sel of closeSelectors) {
      try {
        const el = this.page.locator(sel).first();
        const visible = await el.isVisible({ timeout: 1500 }).catch(() => false);
        if (visible) {
          await el.click({ force: true });
          await this.page.waitForTimeout(500);
          return;
        }
      } catch { /* no modal */ }
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForVisible(locator: Locator, timeout = 10_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}
