import type { CustomWorld } from '../support/world.ts'
import { Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

When(
  'пользователь добавляет товар {string} в корзину',
  async function (this: CustomWorld, productSlug: string) {
    await this.inventoryPage.addProductToCart(productSlug)
  },
)

Then('счётчик корзины показывает {string}', async function (this: CustomWorld, count: string) {
  await expect(this.inventoryPage.cartBadge).toHaveText(count)
})
