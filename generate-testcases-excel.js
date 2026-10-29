const ExcelJS = require('exceljs');
const path = require('path');

const TC = [
  {
    id: 'TC01',
    name: 'Register New User',
    description: 'Registers a brand-new user account with dynamically generated email and name, verifies the account-created confirmation page, then deletes the account.',
    category: 'Authentication',
    file: 'tests/auth/register.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'High',
    command: 'npx playwright test --grep "TC01" --project=chromium --headed',
    precondition: 'No existing session. Internet connection to automationexercise.com.',
    steps: [
      '1. Navigate to home page',
      '2. Click Signup/Login → enter name & email',
      '3. Fill full registration form (DOB, address, password)',
      '4. Submit and verify "Account Created!" heading',
      '5. Continue → verify logged-in username in nav',
      '6. Delete account and verify "Account Deleted!"',
    ].join('\n'),
    expected: '"Account Created!" and "Account Deleted!" pages visible. Username shown in nav during session.',
    framework_notes: 'Uses faker.js for unique email/name per run. authHelper.registerNewUser() handles Cloudflare retry.',
  },
  {
    id: 'TC02',
    name: 'Login with Valid Credentials',
    description: 'Logs in with a pre-registered test user account and verifies that the username appears in the navigation bar post-login.',
    category: 'Authentication',
    file: 'tests/auth/login.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'High',
    command: 'npx playwright test --grep "TC02" --project=chromium --headed',
    precondition: 'Test user account exists (credentials from .env).',
    steps: [
      '1. Navigate to Login page',
      '2. Enter valid email and password',
      '3. Click Login button',
      '4. Assert logged-in username visible in nav bar',
    ].join('\n'),
    expected: 'User is logged in. Nav bar shows "Logged in as <username>".',
    framework_notes: 'Credentials loaded from testUserEmail / testUserPassword in config/testConfig.ts via .env file.',
  },
  {
    id: 'TC03',
    name: 'Logout Clears Session',
    description: 'Logs in a user, then logs out and confirms the session is fully cleared — the Login/Signup link returns to the nav bar.',
    category: 'Authentication',
    file: 'tests/auth/login.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC03" --project=chromium --headed',
    precondition: 'Test user account exists.',
    steps: [
      '1. Navigate to Login page and log in',
      '2. Verify username appears in nav bar',
      '3. Click Logout',
      '4. Assert "Login" link is visible in nav bar again',
      '5. Assert username is no longer visible',
    ].join('\n'),
    expected: '"Login" link visible after logout. Username removed from nav.',
    framework_notes: 'Uses homePage.logout() and homePage.isLoggedIn() assertions.',
  },
  {
    id: 'TC04',
    name: 'Product Search Returns Results',
    description: 'Searches for a product keyword on the Products page and verifies the "Searched Products" heading appears with at least one result.',
    category: 'Functional',
    file: 'tests/products/product-search.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'High',
    command: 'npx playwright test --grep "TC04" --project=chromium --headed',
    precondition: 'None.',
    steps: [
      '1. Navigate to Products page',
      '2. Enter search term (from testdata/products.json)',
      '3. Click Search button',
      '4. Assert "Searched Products" heading is visible',
      '5. Assert at least one product card is displayed',
    ].join('\n'),
    expected: '"Searched Products" heading displayed. ≥1 product result shown.',
    framework_notes: 'Search term loaded from testdata/products.json searchTerms[0]. clickAndWaitForNav() prevents race condition.',
  },
  {
    id: 'TC05',
    name: 'Add Product to Cart',
    description: 'Adds the first product on the Products page to the cart and verifies the cart item count increases to 1.',
    category: 'Functional',
    file: 'tests/cart/cart-management.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'High',
    command: 'npx playwright test --grep "TC05" --project=chromium --headed',
    precondition: 'None.',
    steps: [
      '1. Navigate to Products page',
      '2. Hover over first product card',
      '3. Click "Add to cart"',
      '4. Click "View Cart" in the modal',
      '5. Assert cart item count equals 1',
    ].join('\n'),
    expected: 'Cart contains exactly 1 item.',
    framework_notes: 'Ad modal dismissed before hover via dismissAdModal() in BasePage.',
  },
  {
    id: 'TC06',
    name: 'Remove Product from Cart',
    description: 'Adds a product to the cart, then removes it using the delete (×) button and verifies the cart is empty.',
    category: 'Functional',
    file: 'tests/cart/cart-management.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC06" --project=chromium --headed',
    precondition: 'None.',
    steps: [
      '1. Navigate to Products page and add first product',
      '2. Go to Cart page',
      '3. Click the × (delete) button on the product row',
      '4. Assert cart item count equals 0',
    ].join('\n'),
    expected: 'Cart is empty after deletion.',
    framework_notes: 'cartPage.removeFirstProduct() clicks the delete cell. Waits for count to reach 0 with waitForElementCount().',
  },
  {
    id: 'TC07',
    name: 'End-to-End Checkout Flow',
    description: 'Full happy-path order placement: register user → add product → proceed to checkout → fill address & payment → confirm order → delete account.',
    category: 'End-to-End',
    file: 'tests/checkout/checkout-flow.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Critical',
    command: 'npx playwright test --grep "TC07" --project=chromium --headed',
    precondition: 'Internet connection. Payment card data in testdata/products.json.',
    steps: [
      '1. Register a new user (faker.js data)',
      '2. Navigate to Products and add first item to cart',
      '3. View cart → Proceed to Checkout',
      '4. Verify address details on checkout page',
      '5. Place Order → fill payment form (card 4111111111111111)',
      '6. Confirm payment → assert "Order Placed!" message',
      '7. Delete account',
    ].join('\n'),
    expected: '"Order Placed!" message visible. Account deleted successfully afterward.',
    framework_notes: 'Most complex test. dismissAdModal() called before Place Order. Uses fake card 4111111111111111 (test card). Cloudflare retry on every navigate.',
  },
  {
    id: 'TC08',
    name: 'Contact Us Form Submission',
    description: 'Fills the Contact Us form with name, email, subject, message, and attaches a file. Submits and verifies the success message.',
    category: 'Functional',
    file: 'tests/contact/contact-us.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC08" --project=chromium --headed',
    precondition: 'None.',
    steps: [
      '1. Navigate to Contact Us page',
      '2. Fill name, email, subject, message (from testdata/users.json)',
      '3. Attach a file using the file input',
      '4. Click Submit',
      '5. Accept browser confirmation dialog',
      '6. Assert "Success! Your details have been submitted..." message',
    ].join('\n'),
    expected: 'Success alert message visible after form submission.',
    framework_notes: 'Contact data loaded from testdata/users.json contactForm object. File attachment uses page.setInputFiles().',
  },
  {
    id: 'TC09',
    name: 'WCAG 2.1 AA Accessibility Scan',
    description: 'Runs an automated axe-core accessibility audit on the logged-in home page and asserts zero WCAG 2.1 AA violations.',
    category: 'Accessibility',
    file: 'tests/accessibility/a11y.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC09" --project=chromium --headed',
    precondition: 'Test user account exists.',
    steps: [
      '1. Log in with test credentials',
      '2. Navigate to home page',
      '3. Inject axe-core via AxeBuilder',
      '4. Run accessibility scan targeting WCAG 2.1 AA rules',
      '5. Assert violations array is empty',
    ].join('\n'),
    expected: 'Zero accessibility violations reported by axe-core.',
    framework_notes: 'Uses @axe-core/playwright AxeBuilder. Scanned with .withTags(["wcag2a","wcag2aa"]). Any violation fails the test.',
  },
  {
    id: 'TC10',
    name: 'Visual Regression — Home Page Snapshot',
    description: 'Takes a full-page screenshot of the home page and compares it pixel-by-pixel to a stored baseline image. Fails on unexpected visual changes.',
    category: 'Visual Regression',
    file: 'tests/visual/visual-regression.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC10" --project=chromium --headed',
    precondition: 'Baseline snapshots must exist in tests/visual/*.png (per OS per browser).',
    steps: [
      '1. Navigate to home page',
      '2. Wait for network idle and fonts loaded',
      '3. Dismiss any ad modals',
      '4. Take full-page screenshot',
      '5. Compare to stored baseline with toMatchSnapshot()',
    ].join('\n'),
    expected: 'Screenshot matches baseline within 0% pixel difference threshold.',
    framework_notes: 'Baselines stored per-OS per-browser. CI regenerates baselines with --update-snapshots. Font requests are blocked to stabilise the snapshot.',
  },
  {
    id: 'TC11',
    name: 'Network Intercept / API Mock',
    description: 'Intercepts a product API request, replaces the response with a mocked 404, and verifies the page handles the error gracefully without crashing.',
    category: 'Network / API',
    file: 'tests/network/network-mock.spec.ts',
    browsers: 'Chromium, Firefox, WebKit',
    status: 'Pass',
    priority: 'Medium',
    command: 'npx playwright test --grep "TC11" --project=chromium --headed',
    precondition: 'None.',
    steps: [
      '1. Register a route intercept on /api/productsList',
      '2. Return a mocked 404 JSON response',
      '3. Navigate to Products page',
      '4. Assert page does not crash (no unhandled error)',
      '5. Assert Products heading is still visible',
    ].join('\n'),
    expected: 'Page renders without crash. Products heading visible even with mocked API error.',
    framework_notes: 'Uses page.route() with a fulfill() returning status 404. Tests graceful degradation behaviour.',
  },
];

// ── Color palette ──────────────────────────────────────────────────
const COLORS = {
  headerBg:   '0F172A',  // dark navy
  headerFg:   '00D68F',  // green
  altRow:     'F0FDF4',  // very light green tint
  oddRow:     'FFFFFF',
  catAuth:    'DBEAFE',  // blue-100
  catFunc:    'DCFCE7',  // green-100
  catE2E:     'FEF9C3',  // yellow-100
  catA11y:    'FCE7F3',  // pink-100
  catVis:     'EDE9FE',  // purple-100
  catNet:     'CCFBF1',  // teal-100
  statusPass: 'BBF7D0',
  prioHigh:   'FEE2E2',
  prioCrit:   'FECACA',
  prioMed:    'FEF9C3',
};

const CAT_COLOR = {
  'Authentication':    COLORS.catAuth,
  'Functional':        COLORS.catFunc,
  'End-to-End':        COLORS.catE2E,
  'Accessibility':     COLORS.catA11y,
  'Visual Regression': COLORS.catVis,
  'Network / API':     COLORS.catNet,
};

const PRIO_COLOR = {
  'Critical': COLORS.prioCrit,
  'High':     COLORS.prioHigh,
  'Medium':   COLORS.prioMed,
};

(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator  = 'Abdulla Murshid KV';
  wb.created  = new Date();
  wb.modified = new Date();
  wb.properties.date1904 = false;

  // ══════════════════════════════════════════════
  //  SHEET 1 — Test Cases Summary
  // ══════════════════════════════════════════════
  const summary = wb.addWorksheet('Test Cases', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
    properties: { tabColor: { argb: 'FF00D68F' } },
  });

  const COLS = [
    { header: 'TC ID',        key: 'id',         width: 8  },
    { header: 'Test Name',    key: 'name',        width: 30 },
    { header: 'Category',     key: 'category',    width: 18 },
    { header: 'Priority',     key: 'priority',    width: 10 },
    { header: 'Description',  key: 'description', width: 55 },
    { header: 'Precondition', key: 'precondition',width: 35 },
    { header: 'Test Steps',   key: 'steps',       width: 55 },
    { header: 'Expected Result', key: 'expected', width: 50 },
    { header: 'Test File',    key: 'file',        width: 38 },
    { header: 'Browsers',     key: 'browsers',    width: 30 },
    { header: 'Status',       key: 'status',      width: 10 },
    { header: 'Run Command',  key: 'command',     width: 62 },
    { header: 'Framework Notes', key: 'framework_notes', width: 55 },
  ];

  summary.columns = COLS;

  // Title row
  summary.insertRow(1, []);
  const titleRow = summary.getRow(1);
  const titleCell = titleRow.getCell(1);
  titleCell.value = 'QA Capstone — Playwright Test Cases';
  titleCell.font  = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FF' + COLORS.headerFg } };
  titleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.headerBg } };
  summary.mergeCells(1, 1, 1, COLS.length);
  titleRow.height = 30;
  titleRow.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  // Header row (row 2)
  const headerRow = summary.getRow(2);
  COLS.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    cell.font  = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FF' + COLORS.headerFg } };
    cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.headerBg } };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF00D68F' } },
    };
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  headerRow.height = 22;

  // Data rows
  TC.forEach((tc, idx) => {
    const row = summary.addRow({
      id:          tc.id,
      name:        tc.name,
      category:    tc.category,
      priority:    tc.priority,
      description: tc.description,
      precondition:tc.precondition,
      steps:       tc.steps,
      expected:    tc.expected,
      file:        tc.file,
      browsers:    tc.browsers,
      status:      tc.status,
      command:     tc.command,
      framework_notes: tc.framework_notes,
    });

    row.height = 90;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font      = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border    = {
        top:    { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left:   { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right:  { style: 'thin', color: { argb: 'FFD1D5DB' } },
      };
      // Alternating row bg
      const bg = idx % 2 === 0 ? COLORS.oddRow : COLORS.altRow;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + bg } };
    });

    // TC ID — bold green
    const idCell = row.getCell('id');
    idCell.font = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FF00857A' } };
    idCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Name — bold
    row.getCell('name').font = { name: 'Calibri', bold: true, size: 10 };

    // Category — colour chip
    const catCell = row.getCell('category');
    const catBg   = CAT_COLOR[tc.category] || 'FFFFFF';
    catCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + catBg.replace('#','') } };
    catCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    // Priority — colour chip
    const prioCell = row.getCell('priority');
    const prioBg   = PRIO_COLOR[tc.priority] || 'FFFFFF';
    prioCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + prioBg.replace('#','') } };
    prioCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Status — green chip
    const statusCell = row.getCell('status');
    statusCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.statusPass } };
    statusCell.font  = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF065F46' } };
    statusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Command — monospace
    const cmdCell = row.getCell('command');
    cmdCell.font  = { name: 'Courier New', size: 9, color: { argb: 'FF1D4ED8' } };
    cmdCell.alignment = { vertical: 'top', wrapText: true };

    // File — italic
    const fileCell = row.getCell('file');
    fileCell.font  = { name: 'Courier New', italic: true, size: 9, color: { argb: 'FF64748B' } };
  });

  // Auto-filter on header row
  summary.autoFilter = {
    from: { row: 2, column: 1 },
    to:   { row: 2, column: COLS.length },
  };

  // ══════════════════════════════════════════════
  //  SHEET 2 — Commands Reference
  // ══════════════════════════════════════════════
  const cmds = wb.addWorksheet('Commands', {
    properties: { tabColor: { argb: 'FF0099FF' } },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
  });

  cmds.columns = [
    { key: 'group',   width: 25 },
    { key: 'desc',    width: 40 },
    { key: 'command', width: 80 },
  ];

  // Title
  cmds.insertRow(1, []);
  const cmdTitle = cmds.getRow(1);
  const cmdTitleCell = cmdTitle.getCell(1);
  cmdTitleCell.value = 'Playwright Command Reference';
  cmdTitleCell.font  = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FF0099FF' } };
  cmdTitleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.headerBg } };
  cmds.mergeCells(1, 1, 1, 3);
  cmdTitle.height = 30;
  cmdTitle.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  // Header
  const cmdHeader = cmds.getRow(2);
  ['Group', 'Description', 'Command'].forEach((h, i) => {
    const c = cmdHeader.getCell(i + 1);
    c.value = h;
    c.font  = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FF0099FF' } };
    c.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.headerBg } };
    c.border = { bottom: { style: 'medium', color: { argb: 'FF0099FF' } } };
    c.alignment = { vertical: 'middle' };
  });
  cmdHeader.height = 22;

  const COMMANDS = [
    ['All Tests',          'All browsers, headless (CI)',              'npx playwright test'],
    ['All Tests',          'All browsers, headed (visible)',           'npx playwright test --headed'],
    ['All Tests',          'Interactive UI mode',                      'npx playwright test --ui'],
    ['All Tests',          'Chromium only, headless',                  'npx playwright test --project=chromium'],
    ['All Tests',          'Chromium only, headed',                    'npx playwright test --project=chromium --headed'],
    ['All Tests',          'Firefox only, headed',                     'npx playwright test --project=firefox --headed'],
    ['All Tests',          'WebKit only, headed',                      'npx playwright test --project=webkit --headed'],
    ['All Tests',          'Exclude visual regression',                'npx playwright test --grep-invert "Visual Regression" --headed'],
    ['Specific File',      'Auth tests only, Chromium',                'npx playwright test tests/auth/ --project=chromium --headed'],
    ['Specific File',      'Checkout test, Firefox',                   'npx playwright test tests/checkout/checkout-flow.spec.ts --project=firefox --headed'],
    ['Specific File',      'Visual tests only, Chromium',              'npx playwright test tests/visual/ --project=chromium --headed --update-snapshots'],
    ['Specific TC',        'TC01 – Registration, Chromium',            'npx playwright test --grep "TC01" --project=chromium --headed'],
    ['Specific TC',        'TC02 – Login, Chromium',                   'npx playwright test --grep "TC02" --project=chromium --headed'],
    ['Specific TC',        'TC03 – Logout, Firefox',                   'npx playwright test --grep "TC03" --project=firefox --headed'],
    ['Specific TC',        'TC04 – Product Search, Chromium',          'npx playwright test --grep "TC04" --project=chromium --headed'],
    ['Specific TC',        'TC05 – Add to Cart, Chromium',             'npx playwright test --grep "TC05" --project=chromium --headed'],
    ['Specific TC',        'TC06 – Remove from Cart, WebKit',          'npx playwright test --grep "TC06" --project=webkit --headed'],
    ['Specific TC',        'TC07 – E2E Checkout, Chromium',            'npx playwright test --grep "TC07" --project=chromium --headed'],
    ['Specific TC',        'TC08 – Contact Form, Chromium',            'npx playwright test --grep "TC08" --project=chromium --headed'],
    ['Specific TC',        'TC09 – Accessibility, Chromium',           'npx playwright test --grep "TC09" --project=chromium --headed'],
    ['Specific TC',        'TC10 – Visual Regression, Chromium',       'npx playwright test --grep "TC10" --project=chromium --headed --update-snapshots'],
    ['Specific TC',        'TC11 – Network Mock, Chromium',            'npx playwright test --grep "TC11" --project=chromium --headed'],
    ['Debug & Reports',    'Step-through debug on TC07',               'npx playwright test --grep "TC07" --project=chromium --debug'],
    ['Debug & Reports',    'Open last HTML report',                    'npx playwright show-report reports/html'],
  ];

  const GROUP_COLORS = {
    'All Tests':           'EFF6FF',
    'Specific File':       'F0FDF4',
    'Specific TC':         'FFF7ED',
    'Debug & Reports':     'FDF4FF',
  };

  COMMANDS.forEach(([group, desc, command], idx) => {
    const row = cmds.addRow({ group, desc, command });
    row.height = 22;
    const bg = GROUP_COLORS[group] || 'FFFFFF';
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font      = { name: 'Calibri', size: 10 };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + bg } };
      cell.border    = {
        top:    { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left:   { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right:  { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    // Group cell bold
    const gc = row.getCell('group');
    gc.font = { name: 'Calibri', bold: true, size: 10 };
    // Command cell mono
    const cc = row.getCell('command');
    cc.font = { name: 'Courier New', size: 9, color: { argb: 'FF1D4ED8' } };
  });

  cmds.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: 3 } };

  // ══════════════════════════════════════════════
  //  SHEET 3 — Summary Stats
  // ══════════════════════════════════════════════
  const stats = wb.addWorksheet('Summary', {
    properties: { tabColor: { argb: 'FFFBBF24' } },
  });

  stats.columns = [
    { key: 'metric', width: 30 },
    { key: 'value',  width: 20 },
  ];

  // Title
  stats.insertRow(1, []);
  const stTitle = stats.getRow(1);
  stTitle.getCell(1).value = 'Capstone Summary';
  stTitle.getCell(1).font  = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FFFBBF24' } };
  stTitle.getCell(1).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.headerBg } };
  stats.mergeCells(1, 1, 1, 2);
  stTitle.height = 30;
  stTitle.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  const STATS = [
    ['Project',              'Playwright QA Automation Capstone'],
    ['Target Application',   'automationexercise.com'],
    ['Framework',            'Playwright v1.64.1'],
    ['Language',             'TypeScript'],
    ['Total Test Cases',     '11'],
    ['Browsers Tested',      'Chromium, Firefox, WebKit'],
    ['Total Executions',     '33  (11 TC × 3 browsers)'],
    ['Pass Count',           '33'],
    ['Fail Count',           '0'],
    ['Pass Rate',            '100%'],
    ['CI Platform',          'GitHub Actions (ubuntu-latest)'],
    ['CI Browser',           'Chromium'],
    ['Design Pattern',       'Page Object Model (POM)'],
    ['Page Object Classes',  '7  (BasePage + 6 pages)'],
    ['Test Data Strategy',   'JSON static + Faker.js dynamic'],
    ['Ad Blocking',          '7 patterns blocked via page.route()'],
    ['Report Formats',       'HTML + JUnit XML'],
    ['GitHub Repository',    'github.com/Murshid98/playwright-qa-capstone'],
    ['Author',               'Abdulla Murshid KV'],
    ['Designation',          'Associate Technical Consultant'],
  ];

  const ST_HIGHLIGHT = new Set([
    'Total Test Cases', 'Pass Rate', 'Total Executions', 'GitHub Repository'
  ]);

  STATS.forEach(([metric, value], idx) => {
    const row = stats.addRow({ metric, value });
    row.height = 20;
    const bg = idx % 2 === 0 ? 'FFFFFF' : 'FFFBEB';
    const isHL = ST_HIGHLIGHT.has(metric);

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font  = { name: 'Calibri', size: 11, bold: isHL };
      cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (isHL ? 'FEF9C3' : bg) } };
      cell.border = {
        top:    { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left:   { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right:  { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
      cell.alignment = { vertical: 'middle' };
    });

    // Metric label — grey
    const mc = row.getCell('metric');
    mc.font = { name: 'Calibri', size: 11, bold: isHL, color: { argb: 'FF374151' } };

    // Special value colours
    if (metric === 'Pass Rate') {
      row.getCell('value').font  = { name: 'Calibri', bold: true, size: 13, color: { argb: 'FF065F46' } };
      row.getCell('value').fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBBF7D0' } };
    }
    if (metric === 'GitHub Repository') {
      row.getCell('value').font = { name: 'Courier New', size: 10, color: { argb: 'FF1D4ED8' }, underline: true };
    }
  });

  // ── Save ──────────────────────────────────────
  const outPath = path.resolve(__dirname, 'testcases.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log(`Excel saved: ${outPath}`);
})();
