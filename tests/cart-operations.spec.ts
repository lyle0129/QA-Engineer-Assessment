import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import testData from '../fixtures/test-data.json';

/**
 * Cart Operations Test Suite
 * Tests cart page functionality including viewing, removing items, and navigation
 * Test Cases: TC-20, TC-21, TC-22, TC-23, TC-30
 */
test.describe('Cart Operations', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  /**
   * TC-20: Proceed to Cart
   * Verify that clicking the cart icon opens the cart page with added products displayed
   */
  test('TC-20: Should open cart page and display added products', async ({ page }) => {
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Verify we're on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Add two products to cart
    await productsPage.addProductToCart(testData.products.backpack);
    await productsPage.addProductToCart(testData.products.bikeLight);

    // Verify cart badge shows 2 items
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(2);

    // Navigate to cart page
    await productsPage.goToCart();

    // Verify we're on the cart page
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify both products are displayed in the cart
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(testData.products.backpack);
    expect(cartItems).toContain(testData.products.bikeLight);
    expect(cartItems.length).toBe(2);

    // Verify cart badge still shows 2
    const cartBadgeCount = await cartPage.getCartItemCount();
    expect(cartBadgeCount).toBe(2);
  });

  /**
   * TC-21: Remove Item from Cart Page
   * Verify that removing an item from the cart page updates the cart correctly
   */
  test('TC-21: Should remove item from cart page and update badge', async ({ page }) => {
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Add two products to cart
    await productsPage.addProductToCart(testData.products.backpack);
    await productsPage.addProductToCart(testData.products.bikeLight);

    // Navigate to cart page
    await productsPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify both items are in cart
    let cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBe(2);

    // Remove one item from cart
    await cartPage.removeItem(testData.products.backpack);

    // Verify only one item remains in cart
    cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBe(1);
    expect(cartItems).toContain(testData.products.bikeLight);
    expect(cartItems).not.toContain(testData.products.backpack);

    // Verify cart badge updates to 1
    const cartBadgeCount = await cartPage.getCartItemCount();
    expect(cartBadgeCount).toBe(1);
  });

  /**
   * TC-22: Continue Shopping with Items
   * Verify that clicking "Continue Shopping" returns to products page with cart contents preserved
   */
  test('TC-22: Should continue shopping and preserve cart contents', async ({ page }) => {
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Add products to cart
    await productsPage.addProductToCart(testData.products.backpack);
    await productsPage.addProductToCart(testData.products.bikeLight);

    // Navigate to cart page
    await productsPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify items are in cart
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBe(2);

    // Click "Continue Shopping"
    await cartPage.continueShopping();

    // Verify we're back on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart badge still shows 2 items
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(2);

    // Verify products still show as added (Remove button visible)
    const isBackpackAdded = await productsPage.isProductAdded(testData.products.backpack);
    const isBikeLightAdded = await productsPage.isProductAdded(testData.products.bikeLight);
    expect(isBackpackAdded).toBe(true);
    expect(isBikeLightAdded).toBe(true);
  });

  /**
   * TC-23: Continue Shopping After Removal
   * Verify that after removing all items and clicking "Continue Shopping", 
   * the products page shows no items in cart
   */
  test('TC-23: Should continue shopping after removing all items', async ({ page }) => {
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Add one product to cart
    await productsPage.addProductToCart(testData.products.backpack);

    // Navigate to cart page
    await productsPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify item is in cart
    let cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBe(1);

    // Remove the item from cart
    await cartPage.removeItem(testData.products.backpack);

    // Verify cart is empty
    cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBe(0);

    // Verify cart badge is not visible (count is 0)
    const cartBadgeCount = await cartPage.getCartItemCount();
    expect(cartBadgeCount).toBe(0);

    // Click "Continue Shopping"
    await cartPage.continueShopping();

    // Verify we're back on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart badge is still not visible
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(0);

    // Verify product shows as not added (Add to Cart button visible)
    const isAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isAdded).toBe(false);
  });

  /**
   * TC-30: Access Cart Without Login
   * Verify that attempting to access the cart page without authentication redirects to login
   */
  test('TC-30: Should redirect to login when accessing cart without authentication', async ({ page }) => {
    // Attempt to navigate directly to cart page without logging in
    await cartPage.navigateToCart();

    // Verify we're redirected to the login page
    await expect(page).toHaveURL(/.*\//);
    await expect(page).toHaveURL(/^(?!.*cart\.html).*$/);

    // Verify error message is displayed
    const errorVisible = await loginPage.isErrorDisplayed();
    expect(errorVisible).toBe(true);

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: You can only access');
  });
});
