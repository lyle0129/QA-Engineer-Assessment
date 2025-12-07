import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import testData from '../fixtures/test-data.json';

/**
 * Product Filters Test Suite
 * Tests product sorting functionality and cart state preservation during filtering
 * Test Cases: TC-16, TC-17, TC-18, TC-19
 */
test.describe('Product Filters Functionality', () => {
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

    // Add a product to cart to verify cart state preservation
    await productsPage.addProductToCart(testData.products.backpack);
    
    // Verify cart badge shows 1
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);
  });

  /**
   * TC-16: Filter by Name A-Z
   * Verify that products are sorted alphabetically from A to Z and cart state is preserved
   */
  test('TC-16: Should sort products by name A-Z and preserve cart state', async () => {
    // Select Name (A - Z) sort option
    await productsPage.selectSortOption(testData.sortOptions.nameAZ);

    // Get product names after sorting
    const productNames = await productsPage.getProductNames();

    // Verify products are sorted alphabetically A-Z
    const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    expect(productNames).toEqual(sortedNames);

    // Verify cart badge still shows 1 (cart state preserved)
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the added product still shows as added
    const isProductAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isProductAdded).toBe(true);
  });

  /**
   * TC-17: Filter by Name Z-A
   * Verify that products are sorted alphabetically from Z to A and cart state is preserved
   */
  test('TC-17: Should sort products by name Z-A and preserve cart state', async () => {
    // Select Name (Z - A) sort option
    await productsPage.selectSortOption(testData.sortOptions.nameZA);

    // Get product names after sorting
    const productNames = await productsPage.getProductNames();

    // Verify products are sorted alphabetically Z-A (reverse order)
    const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
    expect(productNames).toEqual(sortedNames);

    // Verify cart badge still shows 1 (cart state preserved)
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the added product still shows as added
    const isProductAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isProductAdded).toBe(true);
  });

  /**
   * TC-18: Filter by Price Low to High
   * Verify that products are sorted by price from lowest to highest and cart state is preserved
   */
  test('TC-18: Should sort products by price low to high and preserve cart state', async () => {
    // Select Price (low to high) sort option
    await productsPage.selectSortOption(testData.sortOptions.priceLowHigh);

    // Get product prices after sorting
    const productPrices = await productsPage.getProductPrices();

    // Verify products are sorted by price low to high
    const sortedPrices = [...productPrices].sort((a, b) => a - b);
    expect(productPrices).toEqual(sortedPrices);

    // Verify cart badge still shows 1 (cart state preserved)
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the added product still shows as added
    const isProductAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isProductAdded).toBe(true);
  });

  /**
   * TC-19: Filter by Price High to Low
   * Verify that products are sorted by price from highest to lowest and cart state is preserved
   */
  test('TC-19: Should sort products by price high to low and preserve cart state', async () => {
    // Select Price (high to low) sort option
    await productsPage.selectSortOption(testData.sortOptions.priceHighLow);

    // Get product prices after sorting
    const productPrices = await productsPage.getProductPrices();

    // Verify products are sorted by price high to low (reverse order)
    const sortedPrices = [...productPrices].sort((a, b) => b - a);
    expect(productPrices).toEqual(sortedPrices);

    // Verify cart badge still shows 1 (cart state preserved)
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe(1);

    // Verify the added product still shows as added
    const isProductAdded = await productsPage.isProductAdded(testData.products.backpack);
    expect(isProductAdded).toBe(true);
  });
});
