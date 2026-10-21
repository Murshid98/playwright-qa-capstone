import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/products');
    try {
      await this.page.locator('.features_items').waitFor({ state: 'visible', timeout: 30000 });
    } catch {
      // Retry if Cloudflare 524 served despite navigate() completing
      await this.navigate('/products');
      await this.page.locator('.features_items').waitFor({ state: 'visible', timeout: 60000 });
    }
  }

  async isProductsPageVisible(): Promise<boolean> {
    await this.page.locator('.features_items').waitFor({ state: 'visible' });
    return true;
  }

  async searchProduct(term: string) {
    await this.page.locator('#search_product').fill(term);
    // Use clickAndWaitForNav so the URL change is tracked (waitForLoadState races with the navigation)
    await this.clickAndWaitForNav(this.page.locator('#submit_search'), 180_000, true);
  }

  async getProductCount(): Promise<number> {
    return this.page.locator('.product-image-wrapper').count();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('.productinfo p').allTextContents();
    return names.map(n => n.trim());
  }

  async addFirstProductToCart() {
    // Click "Add to cart" from the listing page (.productinfo button, always visible — no hover needed).
    // This avoids navigating to the product detail page, reducing Cloudflare 524 exposure.
    const addBtn = this.page.locator('.productinfo .add-to-cart').first();
    await addBtn.click({ force: true });
    try {
      await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 90000 });
    } catch {
      // Retry: AJAX may be slow on the live site
      await addBtn.click({ force: true });
      await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 90000 });
    }
  }

  async addProductToCartByIndex(index: number) {
    const addBtn = this.page.locator('.productinfo .add-to-cart').nth(index);
    await addBtn.click({ force: true });
    try {
      await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 90000 });
    } catch {
      await addBtn.click({ force: true });
      await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 90000 });
    }
  }

  async clickContinueShopping() {
    await this.page.locator('button:has-text("Continue Shopping")').click();
    await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
  }

  async clickViewCart() {
    await this.clickAndWaitForNav(this.page.locator('#cartModal a:has-text("View Cart")'));
  }

  async viewFirstProduct() {
    await this.clickAndWaitForNav(this.page.locator('.choose a').first());
  }

  async viewProductByIndex(index: number) {
    await this.clickAndWaitForNav(this.page.locator('.choose a').nth(index));
  }

  async getSearchResultsHeading(): Promise<string> {
    const heading = this.page.locator('h2.title:has-text("Searched Products")');
    await heading.waitFor({ state: 'visible', timeout: 60000 });
    return (await heading.textContent()) ?? '';
  }

  async isCartModalVisible(): Promise<boolean> {
    await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }
}
