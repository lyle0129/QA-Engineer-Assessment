import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage class handles interactions with the shopping cart page
 * Provides methods for viewing cart items, removing items, and navigation
 */
export class CartPage extends BasePage {
  // Selectors for cart page elements
  private readonly cartItems = '.cart_item';
  private readonly cartItemName = '.inventory_item_name';
  private readonly continueShoppingButton = '#continue-shopping';
  private readonly checkoutButton = '#checkout';
  private readonly cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get a dynamic selector for the remove button of a specific product
   * @param productName - The name of the product
   * @returns The selector string for the remove button
   */
  private getRemoveButtonSelector(productName: string): string {
    // Find the cart item containing the product name and get its remove button
    return `//div[@class='cart_item']//div[@class='inventory_item_name' and text()='${productName}']/ancestor::div[@class='cart_item']//button[contains(@id, 'remove')]`;
  }

  /**
   * Get a dynamic selector for a specific cart item by product name
   * @param productName - The name of the product
   * @returns The selector string for the cart item
   */
  private getCartItemSelector(productName: string): string {
    return `//div[@class='cart_item']//div[@class='inventory_item_name' and text()='${productName}']`;
  }

  /**
   * Get all product names currently in the cart
   * @returns Array of product names in the cart
   */
  async getCartItemNames(): Promise<string[]> {
    const itemElements = await this.page.locator(this.cartItemName).all();
    const names: string[] = [];
    
    for (const element of itemElements) {
      const text = await element.textContent();
      if (text) {
        names.push(text.trim());
      }
    }
    
    return names;
  }

  /**
   * Remove a specific item from the cart by product name
   * @param productName - The name of the product to remove
   */
  async removeItem(productName: string): Promise<void> {
    const removeButtonSelector = this.getRemoveButtonSelector(productName);
    await this.page.locator(removeButtonSelector).click();
  }

  /**
   * Click the "Continue Shopping" button to return to products page
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Click the "Checkout" button to proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  /**
   * Check if a specific product is in the cart
   * @param productName - The name of the product to check
   * @returns True if the product is in the cart, false otherwise
   */
  async isItemInCart(productName: string): Promise<boolean> {
    const itemSelector = this.getCartItemSelector(productName);
    return await this.isVisible(itemSelector);
  }

  /**
   * Get the count of items in the cart from the cart badge
   * @returns The number of items in the cart, or 0 if badge is not visible
   */
  async getCartItemCount(): Promise<number> {
    const isBadgeVisible = await this.isVisible(this.cartBadge);
    
    if (!isBadgeVisible) {
      return 0;
    }
    
    const badgeText = await this.getText(this.cartBadge);
    return parseInt(badgeText, 10) || 0;
  }

  /**
   * Navigate directly to the cart page
   */
  async navigateToCart(): Promise<void> {
    await this.goto('/cart.html');
  }

  /**
   * Get the total number of cart items displayed on the page
   * @returns The count of cart item elements
   */
  async getCartItemElementCount(): Promise<number> {
    return await this.page.locator(this.cartItems).count();
  }

  /**
   * Verify if the cart is empty
   * @returns True if the cart has no items, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemElementCount();
    return count === 0;
  }
}
