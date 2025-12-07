import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutInfoPage class handles the checkout information form page
 * Provides methods to fill customer information and handle form validation
 */
export class CheckoutInfoPage extends BasePage {
  // Selectors for form inputs
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  
  // Selectors for action buttons
  private continueButton = '[data-test="continue"]';
  private cancelButton = '[data-test="cancel"]';
  
  // Selector for error message
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill in the checkout information form with customer details
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param postalCode - Customer's postal/zip code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Click the Continue button to proceed to checkout overview
   */
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  /**
   * Click the Cancel button to return to the cart page
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Get the error message text displayed on the form
   * @returns The error message text, or empty string if no error
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if an error message is currently displayed
   * @returns True if error message is visible, false otherwise
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
