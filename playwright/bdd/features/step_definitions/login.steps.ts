import type { CustomWorld } from '../support/world.ts'
import { Given, Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('открыта страница входа', async function (this: CustomWorld) {
  await this.loginPage.open()
})

When(
  'пользователь входит с логином {string} и паролем {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password)
  },
)

Then('отображается каталог товаров', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/inventory\.html/)
})

Then('отображается ошибка входа {string}', async function (this: CustomWorld, message: string) {
  await expect(this.loginPage.getErrorMessage()).toContainText(message)
})
