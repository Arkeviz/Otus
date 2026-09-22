import type { Locator, Page } from 'playwright'

export class CartPage {
  private readonly page: Page
  private readonly checkoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.checkoutButton = page.locator('[data-test="checkout"]')
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click()
  }
}

export class CheckoutPage {
  private readonly page: Page
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly postalCodeInput: Locator
  private readonly continueButton: Locator
  private readonly finishButton: Locator
  readonly completeHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.finishButton = page.locator('[data-test="finish"]')
    this.completeHeader = page.locator('.complete-header')
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.postalCodeInput.fill(postalCode)
    await this.continueButton.click()
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click()
  }
}
