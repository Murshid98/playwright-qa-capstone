# QA Capstone — Playwright TypeScript Automation Framework

Automated test suite for [automationexercise.com](https://automationexercise.com) built with Playwright and TypeScript.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) v1.64 | Browser automation |
| TypeScript | Type-safe test code |
| @axe-core/playwright | WCAG 2.1 accessibility scanning |
| Faker.js | Random test data generation |
| GitHub Actions | CI/CD pipeline |
| @playwright/mcp | AI-assisted test authoring |

---

## Project Structure

```
qa_capstone/
├── pages/          # Page Object Model classes
├── fixtures/       # Custom Playwright fixtures (base.extend)
├── tests/          # Test specs (one folder per functional area)
│   ├── auth/          # TC01 Register · TC02 Login · TC03 Logout
│   ├── products/      # TC04 Product Search
│   ├── cart/          # TC05 Add to Cart · TC06 Remove from Cart
│   ├── checkout/      # TC07 E2E Checkout Flow
│   ├── contact/       # TC08 Contact Us Form
│   ├── accessibility/ # TC09 WCAG 2.1 AA with axe-core
│   ├── visual/        # TC10 Visual Regression Snapshots
│   └── network/       # TC11 Network Interception & Mocking
├── utils/          # Helpers: randomDataGenerator, authHelper
├── testdata/       # JSON data files (users, products)
├── config/         # Environment configuration
├── reports/        # HTML and JUnit reports (generated)
└── fixtures/       # Custom fixture definitions
```

---

## Test Cases

| ID | Description | Spec File | Technique |
|---|---|---|---|
| TC01 | Register new user with valid data | `tests/auth/register.spec.ts` | POM · Custom fixtures · Faker.js |
| TC02 | Login with valid credentials | `tests/auth/login.spec.ts` | POM · Custom fixtures |
| TC03 | Logout redirects to login page | `tests/auth/login.spec.ts` | POM · State verification |
| TC04 | Product search returns matching results | `tests/products/product-search.spec.ts` | POM · Locator assertions |
| TC05 | Add product to cart and verify contents | `tests/cart/cart-management.spec.ts` | POM · Cart assertions |
| TC06 | Remove product from cart | `tests/cart/cart-management.spec.ts` | POM · State management |
| TC07 | End-to-end checkout flow and order placement | `tests/checkout/checkout-flow.spec.ts` | POM · JSON test data |
| TC08 | Submit Contact Us form successfully | `tests/contact/contact-us.spec.ts` | POM · File-based test data |
| TC09 | Home page WCAG 2.1 AA accessibility scan | `tests/accessibility/a11y.spec.ts` | axe-core integration |
| TC10 | Home page visual regression snapshot | `tests/visual/visual-regression.spec.ts` | `toHaveScreenshot` |
| TC11 | Intercept requests and mock 404 responses | `tests/network/network-mock.spec.ts` | `page.route()` |

---

## Getting Started

**Prerequisites**: Node.js 18+

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install chromium

# Run all tests
npx playwright test --project=chromium

# Run a specific spec file
npx playwright test tests/checkout/checkout-flow.spec.ts --project=chromium

# Run with headed browser (visible)
npx playwright test --project=chromium --headed

# Update visual regression baselines
npx playwright test tests/visual --project=chromium --update-snapshots
```

---

## Key Design Decisions

### Page Object Model
Every page has a class in `pages/` that extends `BasePage`. Page methods encapsulate locators and interactions so tests stay readable and locator changes require edits in one place.

```ts
// tests use page methods, not locators
await loginPage.login(email, password);
expect(await homePage.isLoggedIn()).toBeTruthy();
```

### Custom Fixtures
`fixtures/index.ts` uses `base.extend<T>()` to inject page objects into every test. Tests declare what they need in the function signature — no manual `new LoginPage(page)` boilerplate.

```ts
test('TC03', async ({ loginPage, homePage }) => { ... });
```

### Data-Driven Testing
Test data lives in `testdata/users.json` and `testdata/products.json`. Faker.js generates unique emails and names at runtime so tests never clash on the live site.

### Network Mocking
TC19 uses `page.route()` to intercept all requests (spy mode) then fulfills a specific URL with a 404 (mock mode) — demonstrating both patterns in one test.

### Accessibility Testing
TC15 runs `@axe-core/playwright` against the home page with WCAG 2.1 AA tags. Known pre-existing site violations (icon-only subscribe button) are documented and excluded from the assertion so the test reports on regressions rather than fixed third-party issues.

### Visual Regression
TC17 uses `toHaveScreenshot()`. Iframes and animated carousels are hidden before capture so snapshots are stable. CI regenerates baselines on Linux to avoid cross-platform pixel differences.

### AI-Assisted Testing (MCP)
`.vscode/mcp.json` registers the `@playwright/mcp` server for GitHub Copilot Agent Mode. Copilot can navigate the browser, inspect the DOM, and generate locators directly in VS Code.

---

## CI/CD (GitHub Actions)

The workflow in `.github/workflows/playwright.yml`:
1. Installs Chromium
2. Runs all tests except visual (`--grep-invert "Visual Regression"`)
3. Regenerates visual baselines for Linux (`--update-snapshots`)
4. Uploads HTML and JUnit reports as workflow artifacts

---

## Reports

After a test run, open the HTML report:

```bash
npx playwright show-report reports/html
```

JUnit XML is written to `reports/junit/results.xml` for CI integration.
