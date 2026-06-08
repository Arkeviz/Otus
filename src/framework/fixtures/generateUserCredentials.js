import { faker } from '@faker-js/faker'
import { config as bookstoreConfig } from '@/framework/config/bookstore.js'

/**
 * Генерирует логин и пароль пользователя.
 * Можно передать свой логин и пароль, если необходимо
 * @param username
 * @param password
 */
export function generateUserCredentials(username, password) {
  return {
    userName: username ?? faker.internet.username(),
    password: password ?? bookstoreConfig.passwordForTestUsers,
  }
}
