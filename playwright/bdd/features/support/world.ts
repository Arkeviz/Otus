import type { IWorldOptions } from '@cucumber/cucumber'
import type { Browser, BrowserContext, Page } from 'playwright'
import { setWorldConstructor, World } from '@cucumber/cucumber'
import { CartPage, CheckoutPage } from '../../pages/CartPage'
import { InventoryPage } from '../../pages/InventoryPage'
import { LoginPage } from '../../pages/LoginPage'

/**
 * Контекст одного сценария.
 * Пересоздаётся заново для каждого сценария в хуке Before —
 * никаких глобальных переменных для browser/page.
 */
export class CustomWorld extends World {
  // управляются хуками (BeforeAll/Before/After/AfterAll), не самим сценарием
  browser!: Browser
  context!: BrowserContext
  page!: Page

  // Page Object'ы, собранные для конкретного page
  loginPage!: LoginPage
  inventoryPage!: InventoryPage
  cartPage!: CartPage
  checkoutPage!: CheckoutPage

  constructor(options: IWorldOptions) {
    super(options)
  }

  /** Вызывается в хуке Before после создания page. */
  initPageObjects(page: Page): void {
    this.page = page
    this.loginPage = new LoginPage(page)
    this.inventoryPage = new InventoryPage(page)
    this.cartPage = new CartPage(page)
    this.checkoutPage = new CheckoutPage(page)
  }
}

setWorldConstructor(CustomWorld)
