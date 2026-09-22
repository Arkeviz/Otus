import type { CustomWorld } from '../support/world.ts'
import { Given } from '@cucumber/cucumber'

Given(
  'выполнен вход пользователем {string} с паролем {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.open()
    await this.loginPage.login(username, password)
  },
)
