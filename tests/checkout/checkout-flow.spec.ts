import { test, expect } from '../../fixtures';
import { RandomData } from '../../utils/randomDataGenerator';
import productsData from '../../testdata/products.json';

test.describe('TC13: End-to-End Checkout Flow', () => {
  test('TC13 - Register, add product, complete checkout, place order', async ({
    page,
    loginPage,
    registerPage,
    homePage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1: Register a new test user
    const name = RandomData.firstName();
    const email = RandomData.email();
    const password = 'Test@12345';

    await loginPage.goto();
    await loginPage.signupNewUser(name, email);

    await registerPage.fillAccountInfo({
      password,
      day: '15',
      month: '6',
      year: '1995',
      firstName: name,
      lastName: 'Capstone',
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

    // Stabilize before navigating — site can trigger redirects after registration
    await page.waitForTimeout(1500);

    // Step 2: Add product to cart
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    // Step 3: Verify cart has item
    expect(await cartPage.isCartPageVisible()).toBeTruthy();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page.locator('#address_delivery')).toBeVisible({ timeout: 15000 });

    // Step 5: Add comment and place order
    await checkoutPage.addOrderComment('Automated test order — please disregard.');
    await checkoutPage.placeOrder();

    // Step 6: Fill payment details (test card data)
    const payment = productsData.paymentInfo;
    await checkoutPage.fillPaymentInfo({
      cardName: payment.cardName,
      cardNumber: payment.cardNumber,
      cvc: payment.cvc,
      expiryMonth: payment.expiryMonth,
      expiryYear: payment.expiryYear,
    });

    await checkoutPage.confirmPayment();

    // Step 7: Verify order placed
    expect(await checkoutPage.isOrderPlacedVisible()).toBeTruthy();

    // Step 8: Continue then delete account (cleanup)
    await checkoutPage.clickContinueAfterOrder();
    await homePage.clickNavDeleteAccount();
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible({ timeout: 10000 });
    await page.locator('a[data-qa="continue-button"]').click();
  });
});
