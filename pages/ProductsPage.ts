import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/products');
    await this.page.locator('.features_items').waitFor({ state: 'visible', timeout: 20000 });
  }

  async isProductsPageVisible(): Promise<boolean> {
    await this.page.locator('.features_items').waitFor({ state: 'visible' });
    return true;
  }

  async searchProduct(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductCount(): Promise<number> {
    return this.page.locator('.product-image-wrapper').count();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('.productinfo p').allTextContents();
    return names.map(n => n.trim());
  }

  async addFirstProductToCart() {
    const firstCard = this.page.locator('.product-image-wrapper').first();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    // Wait for modal to appear before returning
    await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 10000 });
  }

  async addProductToCartByIndex(index: number) {
    const card = this.page.locator('.product-image-wrapper').nth(index);
    await card.hover();
    await card.locator('a.add-to-cart').first().click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickContinueShopping() {
    await this.page.locator('button:has-text("Continue Shopping")').click();
    await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
  }

  async clickViewCart() {
    await this.page.locator('#cartModal a:has-text("View Cart")').click();
    await this.page.waitForURL('**/view_cart', { timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async viewFirstProduct() {
    await this.page.locator('.choose a').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async viewProductByIndex(index: number) {
    await this.page.locator('.choose a').nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSearchResultsHeading(): Promise<string> {
    return (await this.page.locator('h2.title:has-text("Searched Products")').textContent()) ?? '';
  }

  async isCartModalVisible(): Promise<boolean> {
    await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }
}
