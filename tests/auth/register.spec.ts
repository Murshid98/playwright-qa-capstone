import { test, expect } from '../../fixtures';
import { RandomData } from '../../utils/randomDataGenerator';
import { deleteAccount } from '../../utils/authHelper';

test.describe('TC01-TC02: User Registration', () => {
  test('TC01 - Register new user with valid data', async ({
    page,
    loginPage,
    registerPage,
    homePage,
  }) => {
    const name = RandomData.firstName();
    const email = RandomData.email();
    const password = 'Test@12345';

    await loginPage.goto();
    expect(await loginPage.isSignupPageVisible()).toBeTruthy();

    await loginPage.signupNewUser(name, email);
    expect(await registerPage.isAccountInfoPageVisible()).toBeTruthy();

    await registerPage.fillAccountInfo({
      password,
      day: '15',
      month: '6',
      year: '1995',
      firstName: name,
      lastName: 'AutoUser',
      address: '123 Automation Street',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobile: '5551234567',
    });

    expect(await registerPage.isAccountCreatedVisible()).toBeTruthy();
    await registerPage.clickContinue();

    expect(await homePage.isLoggedIn()).toBeTruthy();
    const loggedInName = await homePage.getLoggedInUsername();
    expect(loggedInName.length).toBeGreaterThan(0);

    await deleteAccount(page);
  });

  test('TC02 - Register with existing email shows error', async ({
    page,
    loginPage,
    registerPage,
  }) => {
    // Step 1: Register a fresh user
    const name = RandomData.firstName();
    const email = RandomData.email();

    await loginPage.goto();
    await loginPage.signupNewUser(name, email);
    await registerPage.fillAccountInfo({
      password: 'Test@12345',
      day: '10',
      month: '3',
      year: '1990',
      firstName: name,
      lastName: 'DupTest',
      address: '456 Duplicate Ave',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      zipcode: '10001',
      mobile: '5559876543',
    });
    await registerPage.clickContinue();
    await page.locator('li a:has-text("Logged in as")').waitFor({ state: 'visible', timeout: 15000 });
    expect(await page.locator('li a:has-text("Logged in as")').isVisible()).toBeTruthy();

    // Step 2: Logout
    await page.locator('a[href="/logout"]').click();
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Attempt signup with the SAME email — should show error
    await loginPage.goto();
    await loginPage.signupNewUser('AnotherName', email);

    const error = await loginPage.getSignupErrorMessage();
    expect(error).toContain('Email Address already exist!');

    // Cleanup: Login and delete the original account
    await loginPage.goto();
    await loginPage.login(email, 'Test@12345');
    // Wait for logged-in state before attempting account deletion
    await page.locator('li a:has-text("Logged in as")').waitFor({ state: 'visible', timeout: 15000 });
    await deleteAccount(page);
  });
});
