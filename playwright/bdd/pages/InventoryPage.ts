import type { Locator, Page } from 'playwright'

export class InventoryPage {
  private readonly page: Page
  readonly cartBadge: Locator
  readonly cartLink: Locator

  constructor(page: Page) {
    this.page = page
    this.cartBadge = page.locator('.shopping_cart_badge')
    this.cartLink = page.locator('.shopping_cart_link')
  }

  /** Кнопка "Add to cart" привязана к product id, а не к тексту — так надёжнее. */
  private addToCartButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`)
  }

  async addProductToCart(productSlug: string): Promise<void> {
    await this.addToCartButton(productSlug).click()
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click()
  }
}
