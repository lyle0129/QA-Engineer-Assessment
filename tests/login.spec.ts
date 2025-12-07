import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import testData from '../fixtures/test-data.json';

/**
 * Login Test Suite
 * Tests login functionality including valid/invalid credentials and access control
 * Test Cases: TC-01, TC-02, TC-03, TC-04, TC-14
 */
test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  /**
   * TC-01: Valid Login
   * Verify that user can successfully login with valid credentials
   */
  test('TC-01: Should successfully login with valid credentials', async ({ page }) => {
    // Perform login with valid credentials
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

    // Verify user is redirected to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify products page is loaded by checking for product elements
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  /**
   * TC-02: Invalid Username
   * Verify that login fails with invalid username and valid password
   */
  test('TC-02: Should display error message with invalid username', async () => {
    // Attempt login with invalid username and valid password
    await loginPage.login(testData.credentials.invalid.username, testData.credentials.valid.password);

    // Verify error message is displayed
    await expect(await loginPage.isErrorDisplayed()).toBe(true);
    
    // Verify error message contains appropriate text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  /**
   * TC-03: Invalid Password
   * Verify that login fails with valid username and invalid password
   */
  test('TC-03: Should display error message with invalid password', async () => {
    // Attempt login with valid username and invalid password
    await loginPage.login(testData.credentials.valid.username, testData.credentials.invalid.password);

    // Verify error message is displayed
    await expect(await loginPage.isErrorDisplayed()).toBe(true);
    
    // Verify error message contains appropriate text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  /**
   * TC-04: Invalid Credentials
   * Verify that login fails with both invalid username and password
   */
  test('TC-04: Should display error message with invalid credentials', async () => {
    // Attempt login with invalid username and invalid password
    await loginPage.login(testData.credentials.invalid.username, testData.credentials.invalid.password);

    // Verify error message is displayed
    await expect(await loginPage.isErrorDisplayed()).toBe(true);
    
    // Verify error message contains appropriate text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  /**
   * TC-14: Access Inventory Without Login
   * Verify that accessing inventory page without login redirects to login page
   */
  test('TC-14: Should redirect to login page when accessing inventory without authentication', async ({ page }) => {
    // Attempt to directly access the inventory page without logging in
    await page.goto('/inventory.html');

    // Verify user is redirected back to login page
    await expect(page).toHaveURL(/.*\//);
    
    // Verify error message about restricted access is displayed
    await expect(await loginPage.isErrorDisplayed()).toBe(true);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface');
  });
});
