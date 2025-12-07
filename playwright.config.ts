import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for SauceDemo automation
 * 
 * This configuration includes:
 * - HTML Reporter: Generates detailed test reports with execution time and status
 * - Screenshot Capture: Automatically captures screenshots on test failure
 * - Video Recording: Records video on test failure for debugging
 * - Error Handling: Descriptive error messages with stack traces
 * - Test Isolation: Each test runs in a fresh browser context
 * - Timeout Configuration: Appropriate timeouts for actions and assertions
 * 
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests sequentially for stability */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Single worker for sequential execution */
  workers: 1,
  
  /* Reporter to use - HTML for detailed reports, list for console output */
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report', 
      open: 'never' 
    }],
    ['list'],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL for the application under test */
    baseURL: 'https://www.saucedemo.com',

    /* Collect trace on first retry for debugging */
    trace: 'on-first-retry',

    /* Capture screenshot only on failure for error analysis */
    screenshot: 'only-on-failure',

    /* Record video only on failure to diagnose issues */
    video: 'retain-on-failure',

    /* Maximum time each action can take (10 seconds) */
    actionTimeout: 10000,

    /* Maximum time for navigation (30 seconds) */
    navigationTimeout: 30000,
  },

  /* Global timeout for each test (2 minutes) */
  timeout: 120000,

  /* Expect timeout for assertions (5 seconds) */
  expect: {
    timeout: 5000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
