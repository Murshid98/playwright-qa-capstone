import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage, AccountInfo } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { RandomData } from './randomDataGenerator';

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

const DEFAULT_ACCOUNT: Omit<AccountInfo, 'password'> = {
  day: '15',
  month: '6',
  year: '1995',
  firstName: 'Test',
  lastName: 'User',
  address: '123 Automation Street',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90001',
  mobile: '5551234567',
};

export async function registerNewUser(page: Page, overrides: Partial<AccountInfo> = {}): Promise<TestUser> {
  const user: TestUser = {
    name: RandomData.firstName(),
    email: RandomData.email(),
    password: 'Test@12345',
  };

  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  await loginPage.goto();
  await loginPage.signupNewUser(user.name, user.email);
  await registerPage.fillAccountInfo({
    ...DEFAULT_ACCOUNT,
    firstName: user.name,
    password: user.password,
    ...overrides,
  });
  await registerPage.clickContinue();
  // Wait for home page with logged-in indicator before returning
  await page.locator('li a:has-text("Logged in as")').waitFor({ state: 'visible', timeout: 20000 });

  return user;
}

export async function loginUser(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
}

export async function deleteAccount(page: Page) {
  const homePage = new HomePage(page);
  await homePage.clickNavDeleteAccount();
  const registerPage = new RegisterPage(page);
  // Wait for account deleted confirmation
  await page.locator('h2[data-qa="account-deleted"]').waitFor({ state: 'visible', timeout: 10000 });
  await registerPage.clickContinue();
}
