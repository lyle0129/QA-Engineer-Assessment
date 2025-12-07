import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import testData from '../fixtures/test-data.json';

/**
 * Checkout Test Suite
 * Tests checkout flow including form validation, order completion, and access control
 * Test Cases: TC-24, TC-25, TC-26, TC-27, TC-28, TC-29, TC-31, TC-32, TC-33
 */
test.describe('Checkout Functionality', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutInfoPage: CheckoutInfoPage;
    let checkoutOverviewPage: CheckoutOverviewPage;
    let checkoutCompletePage: CheckoutCompletePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutInfoPage = new CheckoutInfoPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);
    });

    /**
     * TC-24: Proceed to Checkout
     * Verify that clicking checkout from cart page with items navigates to checkout info page
     */
    test('TC-24: Should proceed to checkout from cart with items', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Verify we're on the products page
        await expect(page).toHaveURL(/.*inventory\.html/);

        // Add product to cart
        await productsPage.addProductToCart(testData.products.backpack);

        // Navigate to cart page
        await productsPage.goToCart();
        await expect(page).toHaveURL(/.*cart\.html/);

        // Verify item is in cart
        const cartItems = await cartPage.getCartItemNames();
        expect(cartItems.length).toBe(1);
        expect(cartItems).toContain(testData.products.backpack);

        // Click checkout button
        await cartPage.proceedToCheckout();

        // Verify we're on the checkout info page
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Verify checkout form is visible
        await expect(page.locator('[data-test="firstName"]')).toBeVisible();
        await expect(page.locator('[data-test="lastName"]')).toBeVisible();
        await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    });

    /**
     * TC-25: Empty Cart Checkout
     * Verify system behavior when attempting to checkout with an empty cart
     */
    test('TC-25: Should prevent checkout with empty cart', async ({ page }) => {
        // BUG: This test will fail - known bug where system allows checkout with empty cart

        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Navigate to cart page without adding items
        await productsPage.goToCart();
        await expect(page).toHaveURL(/.*cart\.html/);

        // Verify cart is empty
        const isCartEmpty = await cartPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);

        // Attempt to proceed to checkout with empty cart
        await cartPage.proceedToCheckout();

        // BUG DISCOVERED: System allows proceeding to checkout with empty cart
        // Expected: Should remain on cart page or show error
        // Actual: Navigates to checkout-step-one.html
        // This assertion will fail, documenting the bug
        await expect(page).toHaveURL(/.*cart\.html/);
    });

    /**
     * TC-26: Complete Checkout Flow
     * Verify that user can complete the full checkout process successfully
     */
    test('TC-26: Should complete full checkout flow successfully', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add products to cart
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.addProductToCart(testData.products.bikeLight);

        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Fill in checkout information
        await checkoutInfoPage.fillCheckoutInfo(
            testData.customerInfo.valid.firstName,
            testData.customerInfo.valid.lastName,
            testData.customerInfo.valid.postalCode
        );
        await checkoutInfoPage.clickContinue();

        // Verify we're on checkout overview page
        await expect(page).toHaveURL(/.*checkout-step-two\.html/);

        // Verify items are displayed in overview
        const overviewItems = await checkoutOverviewPage.getItemNames();
        expect(overviewItems).toContain(testData.products.backpack);
        expect(overviewItems).toContain(testData.products.bikeLight);
        expect(overviewItems.length).toBe(2);

        // Verify pricing information is displayed
        const subtotal = await checkoutOverviewPage.getSubtotal();
        const total = await checkoutOverviewPage.getTotal();
        expect(subtotal).toBeGreaterThan(0);
        expect(total).toBeGreaterThan(subtotal);

        // Click finish to complete order
        await checkoutOverviewPage.clickFinish();

        // Verify we're on the checkout complete page
        await expect(page).toHaveURL(/.*checkout-complete\.html/);

        // Verify order confirmation is displayed
        const isComplete = await checkoutCompletePage.isOrderComplete();
        expect(isComplete).toBe(true);

        const confirmationHeader = await checkoutCompletePage.getConfirmationHeader();
        expect(confirmationHeader).toContain('Thank you for your order');

        const confirmationMessage = await checkoutCompletePage.getConfirmationMessage();
        expect(confirmationMessage.length).toBeGreaterThan(0);
    });

    /**
     * TC-27: Checkout with Missing Information
     * Verify that form validation works for all required fields
     */
    test('TC-27: Should show error when first name is missing', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add product and proceed to checkout
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Leave first name empty, fill other fields
        await checkoutInfoPage.fillCheckoutInfo(
            '',
            testData.customerInfo.valid.lastName,
            testData.customerInfo.valid.postalCode
        );
        await checkoutInfoPage.clickContinue();

        // Verify error message is displayed
        const isErrorDisplayed = await checkoutInfoPage.isErrorDisplayed();
        expect(isErrorDisplayed).toBe(true);

        const errorMessage = await checkoutInfoPage.getErrorMessage();
        expect(errorMessage).toContain('First Name is required');
    });

    test('TC-27: Should show error when last name is missing', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add product and proceed to checkout
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Leave last name empty, fill other fields
        await checkoutInfoPage.fillCheckoutInfo(
            testData.customerInfo.valid.firstName,
            '',
            testData.customerInfo.valid.postalCode
        );
        await checkoutInfoPage.clickContinue();

        // Verify error message is displayed
        const isErrorDisplayed = await checkoutInfoPage.isErrorDisplayed();
        expect(isErrorDisplayed).toBe(true);

        const errorMessage = await checkoutInfoPage.getErrorMessage();
        expect(errorMessage).toContain('Last Name is required');
    });

    test('TC-27: Should show error when postal code is missing', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add product and proceed to checkout
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Leave postal code empty, fill other fields
        await checkoutInfoPage.fillCheckoutInfo(
            testData.customerInfo.valid.firstName,
            testData.customerInfo.valid.lastName,
            ''
        );
        await checkoutInfoPage.clickContinue();

        // Verify error message is displayed
        const isErrorDisplayed = await checkoutInfoPage.isErrorDisplayed();
        expect(isErrorDisplayed).toBe(true);

        const errorMessage = await checkoutInfoPage.getErrorMessage();
        expect(errorMessage).toContain('Postal Code is required');
    });

    /**
     * TC-28: Checkout with Special Characters
     * Verify system validates special characters in name fields
     */
    test('TC-28: Should validate special characters in name fields', async ({ page }) => {
        // BUG: This test will fail - known bug where system accepts special characters without validation

        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add product and proceed to checkout
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Fill form with special characters in name fields
        await checkoutInfoPage.fillCheckoutInfo(
            testData.customerInfo.invalid.specialChars.firstName,
            testData.customerInfo.invalid.specialChars.lastName,
            testData.customerInfo.valid.postalCode
        );
        await checkoutInfoPage.clickContinue();

        // BUG DISCOVERED: System accepts special characters without validation
        // Expected: Should show validation error and remain on checkout-step-one
        // Actual: Proceeds to checkout overview page
        // This assertion will fail, documenting the bug
        const isErrorDisplayed = await checkoutInfoPage.isErrorDisplayed();
        expect(isErrorDisplayed).toBe(true);
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    });

    /**
     * TC-29: Cancel Checkout
     * Verify that canceling checkout returns to products page with cart preserved
     */
    test('TC-29: Should cancel checkout and preserve cart contents', async ({ page }) => {
        // Navigate to login page and authenticate
        await loginPage.navigate();
        await loginPage.login(testData.credentials.valid.username, testData.credentials.valid.password);

        // Add products to cart
        await productsPage.addProductToCart(testData.products.backpack);
        await productsPage.addProductToCart(testData.products.bikeLight);

        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

        // Fill in checkout information
        await checkoutInfoPage.fillCheckoutInfo(
            testData.customerInfo.valid.firstName,
            testData.customerInfo.valid.lastName,
            testData.customerInfo.valid.postalCode
        );
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(/.*checkout-step-two\.html/);

        // Cancel checkout from overview page
        await checkoutOverviewPage.clickCancel();

        // Verify we're back on the products page
        await expect(page).toHaveURL(/.*inventory\.html/);

        // Verify cart contents are preserved
        const cartCount = await productsPage.getCartBadgeCount();
        expect(cartCount).toBe(2);

        // Verify products still show as added
        const isBackpackAdded = await productsPage.isProductAdded(testData.products.backpack);
        const isBikeLightAdded = await productsPage.isProductAdded(testData.products.bikeLight);
        expect(isBackpackAdded).toBe(true);
        expect(isBikeLightAdded).toBe(true);
    });

    /**
     * TC-31: Access Checkout Step One Without Login
     * Verify that accessing checkout-step-one without authentication redirects to login
     */
    test('TC-31: Should redirect to login when accessing checkout step one without authentication', async ({ page }) => {
        // Attempt to navigate directly to checkout step one without logging in
        await page.goto('/checkout-step-one.html');

        // Verify we're redirected to the login page
        await expect(page).toHaveURL(/.*\//);
        await expect(page).toHaveURL(/^(?!.*checkout-step-one\.html).*$/);

        // Verify error message is displayed
        const errorVisible = await loginPage.isErrorDisplayed();
        expect(errorVisible).toBe(true);

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: You can only access');
    });

    /**
     * TC-32: Access Checkout Step Two Without Login
     * Verify that accessing checkout-step-two without authentication redirects to login
     */
    test('TC-32: Should redirect to login when accessing checkout step two without authentication', async ({ page }) => {
        // Attempt to navigate directly to checkout step two without logging in
        await page.goto('/checkout-step-two.html');

        // Verify we're redirected to the login page
        await expect(page).toHaveURL(/.*\//);
        await expect(page).toHaveURL(/^(?!.*checkout-step-two\.html).*$/);

        // Verify error message is displayed
        const errorVisible = await loginPage.isErrorDisplayed();
        expect(errorVisible).toBe(true);

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: You can only access');
    });

    /**
     * TC-33: Access Checkout Complete Without Login
     * Verify that accessing checkout-complete without authentication redirects to login
     */
    test('TC-33: Should redirect to login when accessing checkout complete without authentication', async ({ page }) => {
        // Attempt to navigate directly to checkout complete page without logging in
        await page.goto('/checkout-complete.html');

        // Verify we're redirected to the login page
        await expect(page).toHaveURL(/.*\//);
        await expect(page).toHaveURL(/^(?!.*checkout-complete\.html).*$/);

        // Verify error message is displayed
        const errorVisible = await loginPage.isErrorDisplayed();
        expect(errorVisible).toBe(true);

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: You can only access');
    });
});
