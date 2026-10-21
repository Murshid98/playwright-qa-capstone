import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/login');
  }

  async login(email: string, password: string) {
    await this.page.locator('input[data-qa="login-email"]').fill(email);
    await this.page.locator('input[data-qa="login-password"]').fill(password);
    await this.clickAndWaitForNav(this.page.locator('button[data-qa="login-button"]'));
  }

  async signupNewUser(name: string, email: string) {
    await this.page.locator('input[data-qa="signup-name"]').fill(name);
    await this.page.locator('input[data-qa="signup-email"]').fill(email);
    await this.clickAndWaitForNav(this.page.locator('button[data-qa="signup-button"]'));
  }

  async getLoginErrorMessage(): Promise<string> {
    const el = this.page.locator('p:has-text("Your email or password is incorrect!")');
    await el.waitFor({ state: 'visible', timeout: 5000 });
    return (await el.textContent()) ?? '';
  }

  async getSignupErrorMessage(): Promise<string> {
    const el = this.page.locator('p:has-text("Email Address already exist!")');
    await el.waitFor({ state: 'visible', timeout: 5000 });
    return (await el.textContent()) ?? '';
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("Login to your account")').isVisible();
  }

  async isSignupPageVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("New User Signup!")').isVisible();
  }
}
