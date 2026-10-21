import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AccountInfo {
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isAccountInfoPageVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("Enter Account Information")').isVisible();
  }

  async fillAccountInfo(data: AccountInfo) {
    // Title
    await this.page.locator('#id_gender1').check();

    // Password
    await this.page.locator('input[data-qa="password"]').fill(data.password);

    // Date of birth
    await this.page.locator('select[data-qa="days"]').selectOption(data.day);
    await this.page.locator('select[data-qa="months"]').selectOption(data.month);
    await this.page.locator('select[data-qa="years"]').selectOption(data.year);

    // Checkboxes
    if (!(await this.page.locator('#newsletter').isChecked())) {
      await this.page.locator('#newsletter').check();
    }
    if (!(await this.page.locator('#optin').isChecked())) {
      await this.page.locator('#optin').check();
    }

    // Address info
    await this.page.locator('input[data-qa="first_name"]').fill(data.firstName);
    await this.page.locator('input[data-qa="last_name"]').fill(data.lastName);
    if (data.company) {
      await this.page.locator('input[data-qa="company"]').fill(data.company);
    }
    await this.page.locator('input[data-qa="address"]').fill(data.address);
    if (data.address2) {
      await this.page.locator('input[data-qa="address2"]').fill(data.address2);
    }
    await this.page.locator('select[data-qa="country"]').selectOption(data.country);
    await this.page.locator('input[data-qa="state"]').fill(data.state);
    await this.page.locator('input[data-qa="city"]').fill(data.city);
    await this.page.locator('input[data-qa="zipcode"]').fill(data.zipcode);
    await this.page.locator('input[data-qa="mobile_number"]').fill(data.mobile);

    // Submit and wait for navigation to account-created page
    await this.clickAndWaitForNav(this.page.locator('button[data-qa="create-account"]'));
  }

  async isAccountCreatedVisible(): Promise<boolean> {
    await this.page.locator('h2[data-qa="account-created"]').waitFor({ state: 'visible', timeout: 30000 });
    return true;
  }

  async clickContinue() {
    await this.clickAndWaitForNav(this.page.locator('a[data-qa="continue-button"]'));
  }

  async isAccountDeletedVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("Account Deleted!")').isVisible();
  }
}
