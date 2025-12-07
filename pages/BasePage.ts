import { Page, expect } from '@playwright/test';

/**
 * BasePage class provides common functionality for all page objects
 * Implements navigation, element interactions, assertions, and screenshot capture
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = 'https://www.saucedemo.com';
  }

  /**
   * Navigate to a specific path relative to the base URL
   * @param path - The path to navigate to (e.g., '/inventory.html')
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for the page to be fully loaded
   * Waits for network to be idle and DOM to be loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on an element identified by selector
   * @param selector - The CSS selector or locator string
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill a form field with text
   * @param selector - The CSS selector or locator string
   * @param text - The text to fill in the field
   */
  async fill(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get the text content of an element
   * @param selector - The CSS selector or locator string
   * @returns The text content of the element
   */
  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    const text = await element.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if an element is visible on the page
   * @param selector - The CSS selector or locator string
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Assert that an element is visible on the page
   * @param selector - The CSS selector or locator string
   */
  async expectVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert that an element contains specific text
   * @param selector - The CSS selector or locator string
   * @param text - The expected text content
   */
  async expectText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Capture a screenshot of the current page
   * @param name - The name for the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: true 
    });
  }
}
