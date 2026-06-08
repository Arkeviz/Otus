import { ofetch } from 'ofetch'
import { config as bookstoreConfig } from '@/framework/config/bookstore.js'

const instance = ofetch.create({
  baseURL: `${bookstoreConfig.baseURL}/Account/v1`,
  // Ставим флаг, чтобы при кодах 4ХХ и 5ХХ не вызывать ошибки и работать с ответами
  // https://github.com/unjs/ofetch/tree/v1#%EF%B8%8F-handling-errors
  ignoreResponseError: true,
})

export const booksStoreService = {
  userController: {
    createUser: params => instance.raw('/User', {
      method: 'POST',
      body: params,
    }),
    // FIXME сделано чуть менее неудобно, т.к. нужно тестировать запросы в т.ч. без токенов
    getUser: (userId, options = {}) => instance.raw(
      `/User/${userId}`,
      {
        ...options,
        method: 'GET',
      },
    ),
    deleteUser: (userId, options = {}) => instance.raw(
      `/User/${userId}`,
      {
        ...options,
        method: 'DELETE',
      },
    ),
    generateToken: params => instance.raw('/GenerateToken', {
      method: 'POST',
      body: { ...params },
    }),
    isUserAuthorized: params => instance.raw('/Authorized', {
      method: 'POST',
      body: { ...params },
    }),
  },

}
