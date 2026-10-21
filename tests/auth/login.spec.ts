import { test, expect } from '../../fixtures';
import { RandomData } from '../../utils/randomDataGenerator';
import { registerNewUser, deleteAccount } from '../../utils/authHelper';

test.describe('TC02 & TC03: User Login and Logout', () => {
  test.describe.configure({ timeout: 300_000 });
  let testEmail: string;
  let testPassword: string;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(600_000);
    const context = await browser.newContext();
    const page = await context.newPage();

    testPassword = 'Test@12345';

    const { email } = await registerNewUser(page, {
      firstName: RandomData.firstName(),
      password: testPassword,
    });
    testEmail = email;

    // logout redirects back to / (same URL); waitForNavigation handles same-URL reloads
    const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 180_000 });
    await page.locator('a[href="/logout"]').click({ noWaitAfter: true });
    await navPromise;
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    test.setTimeout(300_000);
    if (!testEmail) return;
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      const { LoginPage } = await import('../../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
      await deleteAccount(page);
      await context.close();
    } catch (e) {
      console.warn('[afterAll] Account cleanup failed (site instability):', e instanceof Error ? e.message : e);
    }
  });

  test('TC02 - Login with valid credentials', async ({ loginPage, homePage }) => {
    await loginPage.goto();
    expect(await loginPage.isLoginPageVisible()).toBeTruthy();

    await loginPage.login(testEmail, testPassword);

    expect(await homePage.isLoggedIn()).toBeTruthy();
    const username = await homePage.getLoggedInUsername();
    expect(username.length).toBeGreaterThan(0);

    await homePage.clickNavLogout();
  });

  test('TC03 - Logout clears session and returns to unauthenticated state', async ({ loginPage, homePage, page }) => {
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    expect(await homePage.isLoggedIn()).toBeTruthy();

    await homePage.clickNavLogout();

    // automationexercise.com redirects to home page (/) after logout, not /login
    // "Signup / Login" nav link visible ⟹ user is logged out
    await expect(page.locator('a[href="/login"]:has-text("Signup / Login")')).toBeVisible({ timeout: 30000 });
  });
});
