import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactPage } from '../pages/ContactPage';

type PageObjects = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactPage: ContactPage;
};

// Block third-party ad networks that inject full-page overlays (e.g. iFOREX modal via DoubleClick).
const AD_BLOCK_PATTERNS = [
  '**/*doubleclick.net/**',
  '**/*googlesyndication.com/**',
  '**/*googleadservices.com/**',
  '**/*adservice.google.*/**',
  '**/*adnxs.com/**',
  '**/*taboola.com/**',
  '**/*outbrain.com/**',
];

export const test = base.extend<PageObjects>({
  page: async ({ page }, use) => {
    // Abort ad-network requests before each test so ad modals cannot appear
    await Promise.all(
      AD_BLOCK_PATTERNS.map(pattern => page.route(pattern, route => route.abort().catch(() => {})))
    );
    await use(page);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});
