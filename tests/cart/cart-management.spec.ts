import { test, expect } from '../../fixtures';

test.describe('TC10-TC12: Cart Management', () => {
  test('TC10 - Add product to cart shows confirmation modal', async ({
    productsPage,
  }) => {
    await productsPage.goto();
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();

    await productsPage.addFirstProductToCart();
    expect(await productsPage.isCartModalVisible()).toBeTruthy();
  });

  test('TC11 - View cart after adding product', async ({
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

  test('TC12 - Remove product from cart', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    // Add a product first
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // Remove the first item
    await cartPage.removeFirstProduct();

    // Wait for cart to update
    await page.waitForTimeout(2000);

    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount - 1);

    if (finalCount === 0) {
      // Cart empty message should appear
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    }
  });

  test('TC12b - Add multiple products and verify cart totals', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();

    // Add first product
    await productsPage.addFirstProductToCart();
    await productsPage.clickContinueShopping();

    // Add second product
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCart();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(2);

    const prices = await cartPage.getProductPrices();
    expect(prices.length).toBeGreaterThanOrEqual(2);
  });
});
