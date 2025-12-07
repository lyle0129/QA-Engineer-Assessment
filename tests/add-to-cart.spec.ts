import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import testData from '../fixtures/test-data.json';

/**
 * Add to Cart Test Suite
 * Tests adding and removing products from cart on the products page
 * Test Cases: TC-05, TC-06, TC-07
 */
test.describe('Add to Cart Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Verify we're on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  /**
   * TC-05: Add Single Product to Cart
   * Verify that adding one product updates the cart badge to 1
   */
  test('TC-05: Should add single product to cart and update badge to 1', async () => {
    // Verify cart badge is not visible initially (no items in cart)
    const initialCount = await productsPage.getCartBadgeCount();
    expect(initialCount).toBe(0);

    // Add one product to cart
    await productsPage.addProductToCart(testData.products.backpack);

    // Verify cart badge updates to 1
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the product shows as added (Remove button visible)
    const isAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isAdded).toBe(true);
  });

  /**
   * TC-06: Add Multiple Products to Cart
   * Verify that adding two products updates the cart badge to 2
   */
  test('TC-06: Should add multiple products to cart and update badge to 2', async () => {
    // Verify cart badge is not visible initially
    const initialCount = await productsPage.getCartBadgeCount();
    expect(initialCount).toBe(0);

    // Add first product to cart
    await productsPage.addProductToCart(testData.products.backpack);

    // Verify cart badge updates to 1
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Add second product to cart
    await productsPage.addProductToCart(testData.products.bikeLight);

    // Verify cart badge updates to 2
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(2);

    // Verify both products show as added
    const isBackpackAdded = await productsPage.isProductAdded(testData.products.backpack);
    const isBikeLightAdded = await productsPage.isProductAdded(testData.products.bikeLight);
    expect(isBackpackAdded).toBe(true);
    expect(isBikeLightAdded).toBe(true);
  });

  /**
   * TC-07: Remove Product from Cart
   * Verify that removing a product updates the cart badge accordingly
   */
  test('TC-07: Should remove product from cart and update badge', async () => {
    // Add a product to cart first
    await productsPage.addProductToCart(testData.products.backpack);

    // Verify cart badge shows 1
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Remove the product from cart
    await productsPage.removeProductFromCart(testData.products.backpack);

    // Verify cart badge is no longer visible (count is 0)
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(0);

    // Verify the product shows as not added (Add to Cart button visible)
    const isAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isAdded).toBe(false);
  });
});
