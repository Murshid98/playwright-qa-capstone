// Locator constants for Cart and Checkout pages — automationexercise.com

export const CheckoutLocators = {
  // Cart page
  cartTable: '#cart_items',
  cartProductName: 'td.cart_description h4 a',
  cartProductPrice: 'td.cart_price p',
  cartProductQty: 'td.cart_quantity button',
  cartProductTotal: 'td.cart_total p',
  deleteCartItem: 'a.cart_quantity_delete',
  proceedToCheckout: 'a:has-text("Proceed To Checkout")',

  // Register/Login modal from cart
  checkoutModal: '#checkoutModal',
  registerLoginLink: 'a:has-text("Register / Login")',

  // Checkout - address details
  deliveryAddress: '#address_delivery',
  billingAddress: '#address_invoice',

  // Checkout - review order
  orderComment: 'textarea.form-control',
  placeOrderButton: 'a:has-text("Place Order")',

  // Payment
  cardName: 'input[data-qa="name-on-card"]',
  cardNumber: 'input[data-qa="card-number"]',
  cardCvc: 'input[data-qa="cvc"]',
  cardExpMonth: 'input[data-qa="expiry-month"]',
  cardExpYear: 'input[data-qa="expiry-year"]',
  payButton: 'button[data-qa="pay-button"]',

  // Order confirmation
  orderPlacedHeading: 'h2[data-qa="order-placed"]',
  orderSuccess: 'p:has-text("Congratulations")',
  downloadInvoice: 'a:has-text("Download Invoice")',
  continueButton: 'a[data-qa="continue-button"]',
};
