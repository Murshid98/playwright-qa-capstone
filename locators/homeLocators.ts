// Locator constants for the Home page — automationexercise.com

export const HomeLocators = {
  // Navigation
  navHome: 'a[href="/"]',
  navProducts: 'a[href="/products"]',
  navCart: 'a[href="/view_cart"]',
  navLogin: 'a[href="/login"]',
  navTestCases: 'a[href="/test_cases"]',
  navApiTesting: 'a[href="/api_list"]',
  navVideoTutorials: 'a[href="https://www.youtube.com/c/AutomationExercise"]',
  navContactUs: 'a[href="/contact_us"]',

  // Carousel / Hero
  heroSlider: '#slider',
  heroNextButton: 'a.right.carousel-control',

  // Featured items
  featuredItemsSection: '.features_items',
  productCard: '.product-image-wrapper',
  productName: '.productinfo p',
  productPrice: '.productinfo h2',
  addToCartButton: 'a[data-product-id]',
  viewProductButton: 'a[href*="/product_details/"]',

  // Categories sidebar
  categorySidebar: '.left-sidebar',
  categoryWomen: 'a[href="#Women"]',
  categoryMen: 'a[href="#Men"]',
  categoryKids: 'a[href="#Kids"]',

  // Subscription
  subscriptionHeading: 'h2:has-text("Subscription")',
  subscriptionEmail: '#susbscribe_email',
  subscriptionButton: '#subscribe',
  subscriptionSuccess: '#success-subscribe',

  // Footer
  footer: '#footer',
};
