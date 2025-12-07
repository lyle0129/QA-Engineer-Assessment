import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import testData from '../fixtures/test-data.json';

/**
 * Product Details Test Suite
 * Tests product detail page functionality including viewing details and cart operations
 * Test Cases: TC-08, TC-09, TC-10, TC-11, TC-12, TC-13
 */
test.describe('Product Details Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    
    // Navigate to login page and authenticate
    await loginPage.navigate();
    await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);
    
    // Verify we're on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  /**
   * TC-08: View Details of Added Item
   * Verify that clicking on a product already in cart shows Remove button on details page
   */
  test('TC-08: Should display Remove button when viewing details of added item', async ({ page }) => {
    // Add product to cart from products page
    await productsPage.addProductToCart(testData.products.backpack);

    // Verify cart badge shows 1
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Click on the product title to view details
    await productsPage.clickProductTitle(testData.products.backpack);

    // Verify we're on the product details page
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Verify the product name is displayed
    const productName = await productDetailsPage.getProductName();
    expect(productName).toBe(testData.products.backpack);

    // Verify Remove button is visible (product is already in cart)
    const isRemoveVisible = await productDetailsPage.isRemoveButtonVisible();
    expect(isRemoveVisible).toBe(true);

    // Verify Add to Cart button is not visible
    const isAddToCartVisible = await productDetailsPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBe(false);

    // Verify cart badge still shows 1
    const finalCartCount = await productsPage.getCartBadgeCount();
    expect(finalCartCount).toBe(1);
  });

  /**
   * TC-09: View Details of Non-Added Item
   * Verify that clicking on a product not in cart shows Add to Cart button on details page
   */
  test('TC-09: Should display Add to Cart button when viewing details of non-added item', async ({ page }) => {
    // Verify cart is empty initially
    const initialCartCount = await productsPage.getCartBadgeCount();
    expect(initialCartCount).toBe(0);

    // Click on a product title to view details (without adding to cart first)
    await productsPage.clickProductTitle(testData.products.bikeLight);

    // Verify we're on the product details page
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Verify the product name is displayed
    const productName = await productDetailsPage.getProductName();
    expect(productName).toBe(testData.products.bikeLight);

    // Verify Add to Cart button is visible (product is not in cart)
    const isAddToCartVisible = await productDetailsPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBe(true);

    // Verify Remove button is not visible
    const isRemoveVisible = await productDetailsPage.isRemoveButtonVisible();
    expect(isRemoveVisible).toBe(false);

    // Verify cart badge is still 0
    const finalCartCount = await productsPage.getCartBadgeCount();
    expect(finalCartCount).toBe(0);
  });

  /**
   * TC-10: Add Product from Details Page
   * Verify that adding a product from the details page updates the cart badge
   */
  test('TC-10: Should add product to cart from details page and update badge', async ({ page }) => {
    // Verify cart is empty initially
    const initialCartCount = await productsPage.getCartBadgeCount();
    expect(initialCartCount).toBe(0);

    // Navigate to product details page
    await productsPage.clickProductTitle(testData.products.boltTShirt);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Verify Add to Cart button is visible
    const isAddToCartVisible = await productDetailsPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBe(true);

    // Add product to cart from details page
    await productDetailsPage.addToCart();

    // Verify cart badge updates to 1
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify button changes to Remove
    const isRemoveVisible = await productDetailsPage.isRemoveButtonVisible();
    expect(isRemoveVisible).toBe(true);

    // Verify Add to Cart button is no longer visible
    const isAddToCartStillVisible = await productDetailsPage.isAddToCartButtonVisible();
    expect(isAddToCartStillVisible).toBe(false);
  });

  /**
   * TC-11: Navigate Back After Adding
   * Verify that after adding from details page and going back, the product shows as added
   */
  test('TC-11: Should retain cart state when navigating back after adding from details page', async ({ page }) => {
    // Navigate to product details page
    await productsPage.clickProductTitle(testData.products.fleeceJacket);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Add product to cart from details page
    await productDetailsPage.addToCart();

    // Verify cart badge shows 1
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Navigate back to products page
    await productDetailsPage.goBackToProducts();

    // Verify we're back on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart badge still shows 1
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the product shows as added (Remove button visible on products page)
    const isProductAdded = await productsPage.isProductAdded(testData.products.fleeceJacket);
    expect(isProductAdded).toBe(true);
  });

  /**
   * TC-12: Remove from Details Page
   * Verify that removing a product from the details page updates the cart badge
   */
  test('TC-12: Should remove product from cart on details page and update badge', async ({ page }) => {
    // Add product to cart from products page first
    await productsPage.addProductToCart(testData.products.onesie);

    // Verify cart badge shows 1
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Navigate to product details page
    await productsPage.clickProductTitle(testData.products.onesie);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Verify Remove button is visible
    const isRemoveVisible = await productDetailsPage.isRemoveButtonVisible();
    expect(isRemoveVisible).toBe(true);

    // Remove product from cart
    await productDetailsPage.removeFromCart();

    // Verify cart badge updates to 0
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(0);

    // Verify button changes to Add to Cart
    const isAddToCartVisible = await productDetailsPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible).toBe(true);

    // Verify Remove button is no longer visible
    const isRemoveStillVisible = await productDetailsPage.isRemoveButtonVisible();
    expect(isRemoveStillVisible).toBe(false);
  });

  /**
   * TC-13: Navigate Back After Removing
   * Verify that after removing from details page and going back, the product shows as not added
   */
  test('TC-13: Should retain cart state when navigating back after removing from details page', async ({ page }) => {
    // Add product to cart from products page first
    await productsPage.addProductToCart(testData.products.backpack);

    // Verify cart badge shows 1
    let cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Navigate to product details page
    await productsPage.clickProductTitle(testData.products.backpack);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Remove product from cart
    await productDetailsPage.removeFromCart();

    // Verify cart badge shows 0
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(0);

    // Navigate back to products page
    await productDetailsPage.goBackToProducts();

    // Verify we're back on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart badge still shows 0
    cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(0);

    // Verify the product shows as not added (Add to Cart button visible on products page)
    const isProductAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isProductAdded).toBe(false);
  });
});
