import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage class handles login functionality and error messages
 * Extends BasePage to inherit common functionality
 */
export class LoginPage extends BasePage {
  // Selectors for login page elements
  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  private loginButton = '[data-test="login-button"]';
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Perform login with provided credentials
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Get the error message text displayed on the login page
   * @returns The error message text, or empty string if not present
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if an error message is displayed on the login page
   * @returns True if error message is visible, false otherwise
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
