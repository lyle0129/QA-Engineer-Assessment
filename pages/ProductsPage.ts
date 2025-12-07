import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage class handles interactions with the products listing page
 * Manages product selection, cart operations, filtering, and sorting
 */
export class ProductsPage extends BasePage {
  // Selectors
  private readonly productItems = '.inventory_item';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly sortDropdown = '.product_sort_container';
  private readonly cartLink = '.shopping_cart_link';
  private readonly productName = '.inventory_item_name';
  private readonly productPrice = '.inventory_item_price';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Generate dynamic selector for add to cart button by product name
   * @param productName - The name of the product
   * @returns The selector string for the add to cart button
   */
  private getAddToCartButtonSelector(productName: string): string {
    const productId = this.getProductId(productName);
    return `[data-test="add-to-cart-${productId}"]`;
  }

  /**
   * Generate dynamic selector for remove button by product name
   * @param productName - The name of the product
   * @returns The selector string for the remove button
   */
  private getRemoveButtonSelector(productName: string): string {
    const productId = this.getProductId(productName);
    return `[data-test="remove-${productId}"]`;
  }

  /**
   * Convert product name to product ID used in data-test attributes
   * @param productName - The full product name
   * @returns The product ID string
   */
  private getProductId(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\./g, '');
  }

  /**
   * Add a product to the cart by product name
   * @param productName - The name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    const selector = this.getAddToCartButtonSelector(productName);
    await this.click(selector);
  }

  /**
   * Remove a product from the cart by product name
   * @param productName - The name of the product to remove
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const selector = this.getRemoveButtonSelector(productName);
    await this.click(selector);
  }

  /**
   * Get the current cart badge count
   * @returns The number of items in the cart, or 0 if badge is not visible
   */
  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge);
    if (!isVisible) {
      return 0;
    }
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }

  /**
   * Click on a product title to view its details
   * @param productName - The name of the product to click
   */
  async clickProductTitle(productName: string): Promise<void> {
    const productTitles = this.page.locator(this.productName);
    const count = await productTitles.count();
    
    for (let i = 0; i < count; i++) {
      const title = await productTitles.nth(i).textContent();
      if (title?.trim() === productName) {
        await productTitles.nth(i).click();
        return;
      }
    }
    
    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Select a sort option from the dropdown
   * @param option - The sort option value (az, za, lohi, hilo)
   */
  async selectSortOption(option: string): Promise<void> {
    await this.page.locator(this.sortDropdown).selectOption(option);
  }

  /**
   * Get all product names currently displayed on the page
   * @returns Array of product names in display order
   */
  async getProductNames(): Promise<string[]> {
    const productTitles = this.page.locator(this.productName);
    const count = await productTitles.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await productTitles.nth(i).textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Get all product prices currently displayed on the page
   * @returns Array of product prices as numbers in display order
   */
  async getProductPrices(): Promise<number[]> {
    const priceElements = this.page.locator(this.productPrice);
    const count = await priceElements.count();
    const prices: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) {
        // Remove $ sign and convert to number
        const price = parseFloat(priceText.replace('$', ''));
        prices.push(price);
      }
    }
    
    return prices;
  }

  /**
   * Check if a product is currently added to the cart
   * @param productName - The name of the product to check
   * @returns True if the product is in the cart (Remove button visible), false otherwise
   */
  async isProductAdded(productName: string): Promise<boolean> {
    const removeSelector = this.getRemoveButtonSelector(productName);
    return await this.isVisible(removeSelector);
  }

  /**
   * Navigate to the cart page
   */
  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }
}
