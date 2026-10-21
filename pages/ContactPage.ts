import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/contact_us');
  }

  async isContactPageVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("GET IN TOUCH")').isVisible();
  }

  async fillContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.page.locator('input[data-qa="name"]').fill(data.name);
    await this.page.locator('input[data-qa="email"]').fill(data.email);
    await this.page.locator('input[data-qa="subject"]').fill(data.subject);
    await this.page.locator('textarea[data-qa="message"]').fill(data.message);
  }

  async submitContactForm() {
    // Contact form stays on the same URL after submit; waitForLoadState handles the reload.
    this.page.once('dialog', dialog => dialog.accept());
    await this.page.locator('input[data-qa="submit-button"]').click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    await this.page.locator('.status.alert-success').waitFor({ state: 'visible', timeout: 20000 });
    return true;
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.page.locator('.status.alert-success').textContent()) ?? '';
  }

  async clickHomeButton() {
    await this.clickAndWaitForNav(this.page.locator('a.btn:has-text("Home")'));
  }
}
