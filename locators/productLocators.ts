// Locator constants for Products pages — automationexercise.com

export const ProductLocators = {
  // Product listing
  searchInput: 'input#search_product',
  searchButton: 'button#submit_search',
  allProductsHeading: 'h2.title.text-center',
  productList: '.features_items',
  productCard: '.product-image-wrapper',
  productName: '.productinfo p',
  productPrice: '.productinfo h2',
  viewProductLink: 'a[href*="/product_details/"]',
  addToCartFromList: 'a[data-product-id]',

  // Product detail
  productDetailName: '.product-information h2',
  productDetailPrice: '.product-information span span',
  productDetailCategory: '.product-information p:has-text("Category:")',
  productDetailAvailability: '.product-information p:has-text("Availability:")',
  productDetailCondition: '.product-information p:has-text("Condition:")',
  productDetailBrand: '.product-information p:has-text("Brand:")',
  quantityInput: 'input#quantity',
  addToCartDetail: 'button:has-text("Add to cart")',

  // Modal after add to cart
  cartModal: '#cartModal',
  continueShoppingButton: 'button:has-text("Continue Shopping")',
  viewCartLink: 'a:has-text("View Cart")',

  // Reviews
  reviewName: 'input#name',
  reviewEmail: 'input#email',
  reviewText: 'textarea#review',
  reviewSubmit: 'button#button-review',
  reviewSuccess: 'span:has-text("Thank you for your review.")',
};
