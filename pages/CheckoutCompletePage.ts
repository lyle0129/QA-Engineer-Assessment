import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutCompletePage class represents the order confirmation page
 * Displayed after successfully completing a checkout
 */
export class CheckoutCompletePage extends BasePage {
  // Selectors
  private confirmationHeader: string = '.complete-header';
  private confirmationMessage: string = '.complete-text';
  private backHomeButton: string = '#back-to-products';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the confirmation header text
   * @returns The header text displayed on the confirmation page
   */
  async getConfirmationHeader(): Promise<string> {
    return await this.getText(this.confirmationHeader);
  }

  /**
   * Get the confirmation message text
   * @returns The message text displayed on the confirmation page
   */
  async getConfirmationMessage(): Promise<string> {
    return await this.getText(this.confirmationMessage);
  }

  /**
   * Verify that the order has been completed successfully
   * Checks if the confirmation header and message are visible
   * @returns True if order completion is confirmed, false otherwise
   */
  async isOrderComplete(): Promise<boolean> {
    const headerVisible = await this.isVisible(this.confirmationHeader);
    const messageVisible = await this.isVisible(this.confirmationMessage);
    return headerVisible && messageVisible;
  }

  /**
   * Navigate back to the products page (home)
   * Clicks the "Back Home" button
   */
  async goBackHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}
