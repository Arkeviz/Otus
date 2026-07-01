import type { FetchOptions } from 'ofetch'
import type {
  TAddBooks,
  TCheckUserAuthorization,
  TCreateUser,
  TDeleteBooks,
  TDeleteUser,
  TGenerateToken,
  TGetBooks,
  TGetUser,
  TReplaceBook,
} from '@/framework/services/bookStoreService.types'
import { ofetch } from 'ofetch'
import { config as bookstoreConfig } from '@/framework/config/bookstore'

const instance = ofetch.create({
  baseURL: bookstoreConfig.baseURL,
  // Ставим флаг, чтобы при кодах 4ХХ и 5ХХ не вызывать ошибки и работать с ответами
  // https://github.com/unjs/ofetch/tree/v1#%EF%B8%8F-handling-errors
  ignoreResponseError: true,
})

export const bookStoreService = {
  userController: {
    /**
     * Создание пользователя
     * @param {{ userName: string, password: string }} params
     * @param options
     */
    createUser: (params: TCreateUser['params'], options: FetchOptions<'json'> = {}) =>
      instance.raw<TCreateUser['response']>('/Account/v1/User', {
        method: 'POST',
        body: params,
        ...options,
      }),

    /**
     * Получение пользователя
     * @param {number} userId
     * @param options
     */
    getUser: (userId: string, options: FetchOptions<'json'> = {}) =>
      instance.raw<TGetUser['response']>(
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
    deleteUser: (userId: string, options: FetchOptions<'json'> = {}) =>
      instance.raw<TDeleteUser['response']>(
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
    generateToken: (params: TGenerateToken['params'], options: FetchOptions<'json'> = {}) =>
      instance.raw<TGenerateToken['response']>(
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
    isUserAuthorized: (params?: TCheckUserAuthorization['params'], options: FetchOptions<'json'> = {}) =>
      instance.raw<TCheckUserAuthorization['response']>(
        '/Account/v1/Authorized',
        {
          method: 'POST',
          body: params,
          ...options,
        },
      ),
  },

  booksController: {
    /**
     * Получает все книги
     * @param options
     */
    getBooks: (options: FetchOptions<'json'> = {}) =>
      instance.raw<TGetBooks['response']>('/BookStore/v1/Books', options),

    /**
     * Добавляет книгу пользователю
     * @param {{ userId: string, collectionOfIsbns: Array<{ isbn: string }> }} books
     * @param options
     */
    addBooks: (books: TAddBooks['params'], options: FetchOptions<'json'> = {}) =>
      instance.raw<TAddBooks['response']>(
        '/BookStore/v1/Books',
        {
          method: 'POST',
          body: books,
          ...options,
        },
      ),

    /**
     * Заменяет книгу у пользователя
     * @param {string} oldisbn
     * @param {{ userId: string, isbn: string }} params
     * @param options
     */
    replaceBook: (oldisbn: string, params: TReplaceBook['params'], options: FetchOptions<'json'> = {}) =>
      instance.raw<TReplaceBook['response']>(
        `/BookStore/v1/Books/${oldisbn}`,
        {
          method: 'PUT',
          body: params,
          ...options,
        },
      ),

    /**
     * Удаление книг у пользователя
     * @param {number} userId
     * @param options
     */
    deleteBooks: (userId: string, options: FetchOptions<'json'> = {}) =>
      instance.raw<TDeleteBooks['response']>(
        '/BookStore/v1/Books',
        {
          method: 'DELETE',
          query: { UserId: userId },
          ...options,
        },
      ),
  },
}
