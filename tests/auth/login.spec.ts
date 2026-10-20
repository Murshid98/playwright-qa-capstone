import { test, expect } from '../../fixtures';
import { RandomData } from '../../utils/randomDataGenerator';
import { registerNewUser, deleteAccount } from '../../utils/authHelper';

test.describe('TC03-TC06: User Login and Logout', () => {
  let testEmail: string;
  let testPassword: string;
  let testName: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    testName = RandomData.firstName();
    testEmail = RandomData.email();
    testPassword = 'Test@12345';

    const { email } = await registerNewUser(page, {
      firstName: testName,
      password: testPassword,
    });
    testEmail = email;

    // Save logged-out state by logging out
    await page.locator('a[href="/logout"]').click();
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/login');
    await page.locator('input[data-qa="login-email"]').fill(testEmail);
    await page.locator('input[data-qa="login-password"]').fill(testPassword);
    await page.locator('button[data-qa="login-button"]').click();
    await deleteAccount(page);
    await context.close();
  });

  test('TC03 - Login with valid credentials', async ({ loginPage, homePage }) => {
    await loginPage.goto();
    expect(await loginPage.isLoginPageVisible()).toBeTruthy();

    await loginPage.login(testEmail, testPassword);

    expect(await homePage.isLoggedIn()).toBeTruthy();
    const username = await homePage.getLoggedInUsername();
    expect(username.length).toBeGreaterThan(0);

    await homePage.clickNavLogout();
  });

  test('TC04 - Login with invalid credentials shows error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid@notexist.com', 'wrongpassword');

    const error = await loginPage.getLoginErrorMessage();
    expect(error).toContain('Your email or password is incorrect!');
  });

  test('TC05 - Login with empty fields stays on login page', async ({ loginPage, page }) => {
    await loginPage.goto();
    await page.locator('button[data-qa="login-button"]').click();

    // HTML5 validation kicks in — page stays on /login
    expect(page.url()).toContain('/login');
  });

  test('TC06 - Logout successfully redirects to login page', async ({ loginPage, homePage, page }) => {
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    await homePage.clickNavLogout();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
    expect(await loginPage.isLoginPageVisible()).toBeTruthy();
  });
});
