import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigate('/checkout');
  }

  async isCheckoutPageVisible(): Promise<boolean> {
    return this.page.locator('h2:has-text("Checkout")').isVisible();
  }

  async getDeliveryAddressFullName(): Promise<string> {
    const el = this.page.locator('#address_delivery .address_firstname.address_lastname');
    return (await el.textContent()) ?? '';
  }

  async addOrderComment(comment: string) {
    await this.page.locator('textarea.form-control').fill(comment);
  }

  async placeOrder() {
    await this.page.locator('a.btn.btn-default.check_out').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillPaymentInfo(info: PaymentInfo) {
    await this.page.locator('input[data-qa="name-on-card"]').fill(info.cardName);
    await this.page.locator('input[data-qa="card-number"]').fill(info.cardNumber);
    await this.page.locator('input[data-qa="cvc"]').fill(info.cvc);
    await this.page.locator('input[data-qa="expiry-month"]').fill(info.expiryMonth);
    await this.page.locator('input[data-qa="expiry-year"]').fill(info.expiryYear);
  }

  async confirmPayment() {
    await this.page.locator('button[data-qa="pay-button"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isOrderPlacedVisible(): Promise<boolean> {
    await this.page.locator('h2.title.text-center:has-text("Order Placed!")').waitFor({
      state: 'visible',
      timeout: 15000,
    });
    return true;
  }

  async downloadInvoice() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.locator('a.btn.btn-default:has-text("Download Invoice")').click(),
    ]);
    return download;
  }

  async clickContinueAfterOrder() {
    await this.page.locator('a[data-qa="continue-button"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
