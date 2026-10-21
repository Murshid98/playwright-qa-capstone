import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/');
  }

  async clickNavProducts() {
    await this.clickAndWaitForNav(this.page.locator('a[href="/products"]'));
  }

  async clickNavCart() {
    await this.clickAndWaitForNav(this.page.locator('a[href="/view_cart"]'));
  }

  async clickNavLoginSignup() {
    await this.clickAndWaitForNav(this.page.locator('a[href="/login"]'));
  }

  async clickNavContactUs() {
    await this.clickAndWaitForNav(this.page.locator('a[href="/contact_us"]'));
  }

  async clickNavLogout() {
    // logout redirects back to / (same URL); waitForNavigation handles same-URL reloads
    const navPromise = this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 180_000 });
    await this.page.locator('a[href="/logout"]').click({ noWaitAfter: true });
    await navPromise;
    // Recover if logout redirected to a Cloudflare error page instead of home
    const isCfError = await this.page.locator('h1:has-text("timeout occurred")').isVisible({ timeout: 500 }).catch(() => false);
    if (isCfError) {
      await this.page.waitForTimeout(5000);
      await this.navigate('/');
    }
  }

  async clickNavDeleteAccount() {
    await this.clickAndWaitForNav(this.page.locator('a[href="/delete_account"]'));
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.locator('li a:has-text("Logged in as")').waitFor({ state: 'visible', timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  }

  async getLoggedInUsername(): Promise<string> {
    const el = this.page.locator('li a:has-text("Logged in as") b');
    return (await el.textContent()) ?? '';
  }

  async subscribeWithEmail(email: string) {
    await this.page.locator('#susbscribe_email').scrollIntoViewIfNeeded();
    await this.page.locator('#susbscribe_email').fill(email);
    await this.page.locator('#subscribe').click();
    await this.page.locator('#success-subscribe').waitFor({ state: 'visible' });
  }

  async isHomePageVisible(): Promise<boolean> {
    return this.page.locator('#slider').isVisible();
  }
}
