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
    await this.page.locator('a[href="/products"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavCart() {
    await this.page.locator('a[href="/view_cart"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavLoginSignup() {
    await this.page.locator('a[href="/login"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavContactUs() {
    await this.page.locator('a[href="/contact_us"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavLogout() {
    await this.page.locator('a[href="/logout"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavDeleteAccount() {
    await this.page.locator('a[href="/delete_account"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.locator('li a:has-text("Logged in as")').isVisible();
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
