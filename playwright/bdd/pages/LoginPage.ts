import type { Locator, Page } from 'playwright'

export class LoginPage {
  private readonly page: Page
  private readonly usernameInput: Locator
  private readonly passwordInput: Locator
  private readonly loginButton: Locator
  private readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('#user-name')
    this.passwordInput = page.locator('#password')
    this.loginButton = page.locator('#login-button')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async open(): Promise<void> {
    await this.page.goto('/')
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  getErrorMessage(): Locator {
    return this.errorMessage
  }
}
