import { test, expect } from '../../fixtures';
import productsData from '../../testdata/products.json';

test.describe('TC07-TC09: Product Search and Navigation', () => {
  test('TC07 - Search for existing product returns results', async ({
    productsPage,
    page,
  }) => {
    await productsPage.goto();
    expect(await productsPage.isProductsPageVisible()).toBeTruthy();

    await productsPage.searchProduct('dress');

    const heading = await productsPage.getSearchResultsHeading();
    expect(heading.toLowerCase()).toContain('searched products');

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC08 - Search for non-existent product returns no results', async ({
    productsPage,
    page,
  }) => {
    await productsPage.goto();

    const noResultTerm = productsData.searchTerms.find(t => !t.expectResults)!.term;
    await productsPage.searchProduct(noResultTerm);

    const count = await productsPage.getProductCount();
    expect(count).toBe(0);
  });

  test('TC09 - View product details page', async ({ productsPage, page }) => {
    await productsPage.goto();

    const initialCount = await productsPage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    await productsPage.viewFirstProduct();

    // Verify product detail page elements
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information span span')).toBeVisible();
    await expect(page.locator('input#quantity')).toBeVisible();
    await expect(page.locator('button.cart')).toBeVisible();

    const productName = await page.locator('.product-information h2').textContent();
    expect(productName?.length).toBeGreaterThan(0);
  });

  test('TC09b - Data-driven search across multiple terms', async ({ productsPage }) => {
    const searchableTerms = productsData.searchTerms.filter(t => t.expectResults);

    for (const termData of searchableTerms) {
      await productsPage.goto();
      await productsPage.searchProduct(termData.term);

      const count = await productsPage.getProductCount();
      expect(count, `Expected results for search: "${termData.term}"`).toBeGreaterThan(0);
    }
  });
});
