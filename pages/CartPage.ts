import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/view_cart');
    await this.page.locator('#cart_items').waitFor({ state: 'visible', timeout: 15000 });
  }

  async isCartPageVisible(): Promise<boolean> {
    return this.page.locator('#cart_items').isVisible();
  }

  async getCartItemCount(): Promise<number> {
    // td.cart_product appears exactly once per cart row
    try {
      await this.page.locator('td.cart_product').first().waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      return 0;
    }
    return this.page.locator('td.cart_product').count();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('td.cart_description h4 a').allTextContents();
    return names.map(n => n.trim());
  }

  async getProductPrices(): Promise<string[]> {
    const prices = await this.page.locator('td.cart_price p').allTextContents();
    return prices.map(p => p.trim());
  }

  async getProductQuantities(): Promise<string[]> {
    const qtys = await this.page.locator('td.cart_quantity .cart_quantity_input').allTextContents();
    return qtys.map(q => q.trim());
  }

  async removeFirstProduct() {
    await this.page.locator('a.cart_quantity_delete').first().click();
    await this.page.waitForTimeout(2000);
  }

  async removeProductByIndex(index: number) {
    await this.page.locator('a.cart_quantity_delete').nth(index).click();
    await this.page.waitForTimeout(2000);
  }

  async isCartEmpty(): Promise<boolean> {
    const rows = await this.getCartItemCount();
    if (rows === 0) return true;
    const emptyEl = await this.page.locator('#empty_cart').isVisible();
    return emptyEl;
  }

  async proceedToCheckout() {
    const btn = this.page.locator('a.btn.btn-default.check_out');
    await btn.scrollIntoViewIfNeeded();
    await this.clickAndWaitForNav(btn, 180_000, true);
  }

  async clickRegisterLoginInModal() {
    await this.clickAndWaitForNav(this.page.locator('#checkoutModal a:has-text("Register / Login")'));
  }

  async isCheckoutModalVisible(): Promise<boolean> {
    return this.page.locator('#checkoutModal').isVisible();
  }
}
