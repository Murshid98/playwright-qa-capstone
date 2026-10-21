import { test, expect } from '../../fixtures';

test.describe('TC05 & TC06: Cart Management', () => {
  test.describe.configure({ timeout: 300_000 });
  test('TC05 - Add product to cart and verify cart contains item', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    expect(await cartPage.isCartPageVisible()).toBeTruthy();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);

    const names = await cartPage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names[0].length).toBeGreaterThan(0);
  });

  test('TC06 - Remove product from cart', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    await cartPage.removeFirstProduct();
    await page.waitForTimeout(2000);

    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount - 1);

    if (finalCount === 0) {
      expect(await cartPage.isCartEmpty()).toBeTruthy();
    }
  });
});
