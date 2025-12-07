import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailsPage class handles interactions with the product details page
 * Provides methods to view product information and manage cart operations from the detail view
 */
export class ProductDetailsPage extends BasePage {
  // Selectors for product details page elements
  private readonly productNameSelector = '[data-test="inventory-item-name"]';
  private readonly productDescriptionSelector = '[data-test="inventory-item-desc"]';
  private readonly productPriceSelector = '[data-test="inventory-item-price"]';
  private readonly addToCartButtonSelector = '[data-test="add-to-cart"]';
  private readonly removeButtonSelector = '[data-test="remove"]';
  private readonly backButtonSelector = '[data-test="back-to-products"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the product name displayed on the details page
   * @returns The product name as a string
   */
  async getProductName(): Promise<string> {
    return await this.getText(this.productNameSelector);
  }

  /**
   * Get the product description displayed on the details page
   * @returns The product description as a string
   */
  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescriptionSelector);
  }

  /**
   * Get the product price displayed on the details page
   * @returns The product price as a string (e.g., "$29.99")
   */
  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPriceSelector);
  }

  /**
   * Add the product to cart from the details page
   * Clicks the "Add to Cart" button
   */
  async addToCart(): Promise<void> {
    await this.click(this.addToCartButtonSelector);
  }

  /**
   * Remove the product from cart from the details page
   * Clicks the "Remove" button
   */
  async removeFromCart(): Promise<void> {
    await this.click(this.removeButtonSelector);
  }

  /**
   * Check if the "Add to Cart" button is visible
   * @returns True if the button is visible, false otherwise
   */
  async isAddToCartButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.addToCartButtonSelector);
  }

  /**
   * Check if the "Remove" button is visible
   * @returns True if the button is visible, false otherwise
   */
  async isRemoveButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.removeButtonSelector);
  }

  /**
   * Navigate back to the products page
   * Clicks the "Back to Products" button
   */
  async goBackToProducts(): Promise<void> {
    await this.click(this.backButtonSelector);
  }
}
