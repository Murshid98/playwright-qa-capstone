import { test, expect } from '../../fixtures';

test.describe('TC04: Product Search', () => {
  test('TC04 - Search for product returns matching results', async ({
    productsPage,
  }) => {
    await productsPage.goto();
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();

    await productsPage.searchProduct('dress');

    const heading = await productsPage.getSearchResultsHeading();
    expect(heading.toLowerCase()).toContain('searched products');

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
