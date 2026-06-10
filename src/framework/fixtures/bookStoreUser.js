import { faker } from '@faker-js/faker'
import { config as bookstoreConfig } from '@/framework/config/bookstore.js'
import { bookStoreService } from '@/framework/services/bookStoreService.js'

/**
 * Для отдельных кейсов иногда нужно создавать отдельных пользователей.
 * Для этого повторяемая логика была вынесена сюда
 */

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

/**
 * Создаёт тестового пользователя, без токена.
 * С возможностью настройки логина/пароля
 */
export async function createTestUser(credentials = {}) {
  const generatedCredentials = generateUserCredentials(credentials.username, credentials.password)
  const { _data: user } = await bookStoreService.userController.createUser(generatedCredentials)

  return {
    userId: user.userID,
    userName: generatedCredentials.userName,
    password: generatedCredentials.password,
  }
}

/**
 * Создаёт тестового пользователя, с токеном (т.е. уже авторизированного).
 * С возможностью настройки логина/пароля
 */
export async function createAuthenticatedUser(credentials = {}) {
  const user = await createTestUser(credentials)
  const { _data: tokenData } = await bookStoreService.userController.generateToken({
    userName: user.userName,
    password: user.password,
  })

  return { user, token: tokenData.token }
}

/**
 * Удаляет тестового авторизованного пользователя (т.е. с токеном)
 */
export function deleteTestUser(userId, token) {
  return bookStoreService.userController.deleteUser(userId, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
