import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutOverviewPage class handles the checkout overview page
 * Displays order summary with items, pricing, and final confirmation options
 */
export class CheckoutOverviewPage extends BasePage {
  // Selectors for item details
  private itemNames = '.inventory_item_name';
  private itemPrices = '.inventory_item_price';
  
  // Selectors for pricing summary
  private subtotalLabel = '.summary_subtotal_label';
  private taxLabel = '.summary_tax_label';
  private totalLabel = '.summary_total_label';
  
  // Selectors for action buttons
  private finishButton = '[data-test="finish"]';
  private cancelButton = '[data-test="cancel"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the names of all items in the checkout overview
   * @returns Array of item names
   */
  async getItemNames(): Promise<string[]> {
    const items = await this.page.locator(this.itemNames).allTextContents();
    return items.map(item => item.trim());
  }

  /**
   * Get the prices of all items in the checkout overview
   * @returns Array of item prices as numbers
   */
  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator(this.itemPrices).allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '').trim()));
  }

  /**
   * Get the subtotal amount from the order summary
   * @returns Subtotal as a number
   */
  async getSubtotal(): Promise<number> {
    const subtotalText = await this.getText(this.subtotalLabel);
    // Extract number from "Item total: $XX.XX"
    const match = subtotalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the tax amount from the order summary
   * @returns Tax amount as a number
   */
  async getTax(): Promise<number> {
    const taxText = await this.getText(this.taxLabel);
    // Extract number from "Tax: $X.XX"
    const match = taxText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the total amount from the order summary
   * @returns Total amount as a number
   */
  async getTotal(): Promise<number> {
    const totalText = await this.getText(this.totalLabel);
    // Extract number from "Total: $XX.XX"
    const match = totalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Click the Finish button to complete the order
   */
  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }

  /**
   * Click the Cancel button to return to the products page
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }
}
