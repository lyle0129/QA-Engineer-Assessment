# SauceDemo Playwright Automation Framework

This project contains automated test cases for the SauceDemo e-commerce application using Playwright and TypeScript.

## Project Overview

This automation framework implements 33 (multiple tc-27 as stated in the google sheets) test cases covering:
- Login functionality
- Add to cart operations
- Product details and navigation
- Product filtering and sorting
- Cart management
- Checkout process
- Cart persistence
- Security and access control

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Project Structure

```
playwright-saucedemo/
├── tests/                      # Test specification files
│   ├── login.spec.ts
│   ├── add-to-cart.spec.ts
│   ├── product-details.spec.ts
│   ├── product-filters.spec.ts
│   ├── cart-operations.spec.ts
│   ├── checkout.spec.ts
│   └── cart-persistence.spec.ts
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── ProductDetailsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInfoPage.ts
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
├── fixtures/                   # Test data
│   └── test-data.json
│ 
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Installation

1. Clone or download this project

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (first time only):
```bash
npx playwright install
```

## Running Tests

### Quick Start
```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# View the HTML report
npm run test:report
```

### All Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:chromium` | Run tests in Chromium only |
| `npm run test:firefox` | Run tests in Firefox only |
| `npm run test:webkit` | Run tests in WebKit only |
| `npm run test:debug` | Run tests in debug mode with Playwright Inspector |
| `npm run test:report` | Open the HTML test report |
| `npx playwright test tests/login.spec.ts` | Run a specific test file |
| `npx playwright test --grep "TC-01"` | Run a specific test by name |
| `npx playwright test --project=chromium` | Run tests in specific browser |

## Test Execution

Tests run sequentially by default to ensure stability. Each test:
1. Starts with a fresh browser context
2. Performs setup (login if needed)
3. Executes test steps
4. Verifies expected results
5. Cleans up automatically

## Test Reports

After running tests, an HTML report is generated in the `playwright-report` folder. The report includes:
- Test execution summary
- Pass/fail status for each test
- Execution time
- Screenshots for failed tests
- Video recordings for failed tests
- Error messages and stack traces

To view the report:
```bash
npm run test:report
```

## Test Data

Test data is stored in `fixtures/test-data.json` and includes:
- Valid and invalid credentials
- Customer information
- Product names
- Sort options

You can modify this file to use different test data without changing the test code.

## Configuration

The `playwright.config.ts` file contains:
- **Base URL**: https://www.saucedemo.com
- **Browser configurations**: Chromium, Firefox, WebKit
- **Timeout settings**: 10s action timeout, 30s navigation timeout
- **Reporter configuration**: HTML reporter with screenshots and videos on failure
- **Test execution**: Sequential execution for stability

### Key Configuration Options

```typescript
use: {
  baseURL: 'https://www.saucedemo.com',
  trace: 'on-first-retry',           // Trace on retry
  screenshot: 'only-on-failure',     // Screenshot on failure
  video: 'retain-on-failure',        // Video on failure
  actionTimeout: 10000,              // 10 second timeout
  navigationTimeout: 30000,          // 30 second timeout
}
```

## Test Coverage

This framework implements all 33 test cases from the QA Technical Assessment:

| Test Suite | Test Cases | Description |
|------------|------------|-------------|
| Login | TC-01 to TC-04, TC-14 | Valid/invalid login, access control |
| Add to Cart | TC-05 to TC-07 | Add/remove products, cart badge updates |
| Product Details | TC-08 to TC-13 | Product detail navigation, cart operations |
| Cart Persistence | TC-15 | Cart state across logout/login |
| Product Filters | TC-16 to TC-19 | Sorting by name and price |
| Cart Operations | TC-20 to TC-23, TC-30 | Cart management, navigation, access control |
| Checkout | TC-24 to TC-29, TC-31 to TC-33 | Checkout flow, validation, access control |

**Total: 33 test cases covering all requirements**

## Known Issues and Bugs

The framework documents known bugs discovered during testing:

### TC-25: Empty Cart Checkout Bug
- **Issue**: System allows proceeding to checkout with an empty cart
- **Expected**: Should remain on cart page or display an error message
- **Actual**: Navigates to checkout-step-one.html
- **Status**: Test marked as expected failure with bug documentation
- **Location**: `tests/checkout.spec.ts`
- **Impact**: Users can proceed through checkout without any items, leading to invalid orders

### TC-28: Special Character Validation Bug
- **Issue**: System accepts special characters (@@@, ###) in First Name and Last Name fields without validation
- **Expected**: Should display validation error and remain on checkout form
- **Actual**: Proceeds to checkout overview page
- **Status**: Test marked as expected failure with bug documentation
- **Location**: `tests/checkout.spec.ts`
- **Impact**: Invalid customer data can be submitted, potentially causing issues with order processing

These tests are documented with detailed comments explaining the expected vs actual behavior. When running the full test suite, you will see these tests fail as expected, documenting the bugs for the development team to fix.

## Troubleshooting

### Tests fail with timeout errors
- Increase timeout values in `playwright.config.ts`
- Check your internet connection
- Verify the SauceDemo site is accessible

### Browser installation fails
```bash
npx playwright install --force
```

### Cannot find module errors
```bash
npm install
```

## Design Patterns and Best Practices

### Page Object Model (POM)
- All page interactions are encapsulated in page object classes
- Selectors are defined once in page objects, not in tests
- Tests focus on business logic, not implementation details
- Changes to UI only require updates to page objects

### Test Independence
- Each test runs in a fresh browser context
- No shared state between tests
- Tests can run in any order
- Proper cleanup after each test

### Test Data Management
- Test data externalized in `fixtures/test-data.json`
- Easy to modify without changing test code
- Supports data-driven testing approach
- Credentials, customer info, and product names centralized

### Error Handling
- Automatic screenshots on test failure
- Video recordings for failed tests
- Detailed error messages and stack traces
- Proper timeout handling for all interactions

### Code Quality
- TypeScript for type safety
- Clear test descriptions matching test case IDs
- Comprehensive comments for complex logic
- Consistent naming conventions

## Contributing

When adding new tests:
1. Create page objects for new pages in `pages/` directory
2. Add test data to `fixtures/test-data.json`
3. Follow the existing naming conventions (TC-XX format) -- correlate it with the linked [google sheets](https://docs.google.com/spreadsheets/d/1eypUKQ5uSOi2aFvkXSWPkRdE5tnbmQbeDmNmSYM5L5I/edit?usp=sharing) ; ask permission to access first.
4. Ensure tests are independent and isolated
5. Add appropriate assertions and comments
6. Update this README with new test coverage

## Support and Resources

For issues or questions, refer to:
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## Project Completion

This automation framework successfully implements all 33 test cases from the QA Technical Assessment Part 1. The framework is production-ready with:
- Complete test coverage
- Comprehensive documentation
- Known bugs documented
- Cross-browser support
- Detailed HTML reports
- Easy setup and execution
