import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string = '') {
    try {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    } catch (e: unknown) {
      // Retry once on transient navigation abort (ERR_ABORTED)
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('ERR_ABORTED') || msg.includes('frame was detached')) {
        await this.page.waitForTimeout(2000);
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
      } else {
        throw e;
      }
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForVisible(locator: Locator, timeout = 10_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/manual/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}
