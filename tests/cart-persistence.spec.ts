import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import testData from '../fixtures/test-data.json';

/**
 * Cart Persistence Test Suite
 * Tests that cart contents persist across logout/login sessions
 * Test Cases: TC-15
 */
test.describe('Cart Persistence', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  /**
   * TC-15: Cart Persistence After Logout
   * Verify that cart contents persist after logging out and logging back in
   */
  test('TC-15: Should persist cart contents after logout and login', async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    // Step 1: Login with valid credentials
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Step 2: Add products to cart
    await productsPage.addProductToCart(testData.products.backpack);
    await productsPage.addProductToCart(testData.products.bikeLight);

    // Step 3: Verify cart badge shows 2 items
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(2);

    // Step 4: Verify both products show as added
    let isBackpackAdded = await productsPage.isProductAdded(testData.products.backpack);
    let isBikeLightAdded = await productsPage.isProductAdded(testData.products.bikeLight);
    expect(isBackpackAdded).toBe(true);
    expect(isBikeLightAdded).toBe(true);

    // Step 5: Logout - Open burger menu and click logout
    // Note: Using direct locators here as logout is not part of any page object
    // This is intentional to test the full user flow including navigation menu
    await page.locator('#react-burger-menu-btn').click();
    // Wait for menu animation to complete before clicking logout (especially needed in WebKit)
    await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await page.locator('#logout_sidebar_link').click();

    // Step 6: Verify user is redirected to login page
    await expect(page).toHaveURL(/.*\//);

    // Step 7: Login again with the same credentials
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Step 8: Verify cart badge still shows 2 items (cart persisted)
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(2);

    // Step 9: Verify both products still show as added
    isBackpackAdded = await productsPage.isProductAdded(testData.products.backpack);
    isBikeLightAdded = await productsPage.isProductAdded(testData.products.bikeLight);
    expect(isBackpackAdded).toBe(true);
    expect(isBikeLightAdded).toBe(true);
  });
});
