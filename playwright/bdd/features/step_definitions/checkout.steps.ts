import type { CustomWorld } from '../support/world.ts'
import { Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

When('пользователь переходит в корзину и начинает оформление заказа', async function (this: CustomWorld) {
  await this.inventoryPage.goToCart()
  await this.cartPage.proceedToCheckout()
})

When(
  'пользователь заполняет данные покупателя {string} {string} {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutPage.fillCustomerInfo(firstName, lastName, postalCode)
  },
)

When('завершает оформление заказа', async function (this: CustomWorld) {
  await this.checkoutPage.finishOrder()
})

Then('отображается сообщение {string}', async function (this: CustomWorld, message: string) {
  await expect(this.checkoutPage.completeHeader).toHaveText(message)
})
