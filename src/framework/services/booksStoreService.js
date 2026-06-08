import { ofetch } from 'ofetch'
import { config as bookstoreConfig } from '@/framework/config/bookstore.js'

const instance = ofetch.create({
  baseURL: bookstoreConfig.baseURL,
  // Ставим флаг, чтобы при кодах 4ХХ и 5ХХ не вызывать ошибки и работать с ответами
  // https://github.com/unjs/ofetch/tree/v1#%EF%B8%8F-handling-errors
  ignoreResponseError: true,
})

export const booksStoreService = {
  userController: {
    /**
     * Создание пользователя
     * @param {{ userName: string, password: string }} params
     * @param options
     */
    createUser: (params, options = {}) => instance.raw('/Account/v1/User', {
      method: 'POST',
      body: params,
      ...options,
    }),

    /**
     * Получение пользователя
     * @param {number} userId
     * @param options
     */
    getUser: (userId, options = {}) => instance.raw(
      `/Account/v1/User/${userId}`,
      {
        method: 'GET',
        ...options,
      },
    ),

    /**
     * Удаление пользователя
     * @param {number} userId
     * @param options
     */
    deleteUser: (userId, options = {}) => instance.raw(
      `/Account/v1/User/${userId}`,
      {
        method: 'DELETE',
        ...options,
      },
    ),

    /**
     * Генерация токена для пользователя.
     * Также, неявно, авторизует пользователя.
     * @param {{ userName: string, password: string }} params
     * @param options
     */
    generateToken: (params, options = {}) => instance.raw(
      '/Account/v1/GenerateToken',
      {
        method: 'POST',
        body: params,
        ...options,
      },
    ),

    /**
     * Проверяет авторизован ли пользователь
     * @param {{ userName: string, password: string }} params
     * @param options
     */
    isUserAuthorized: (params, options = {}) => instance.raw(
      '/Account/v1/Authorized',
      {
        method: 'POST',
        body: params,
        ...options,
      },
    ),
  },
}
