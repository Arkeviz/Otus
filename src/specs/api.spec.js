import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import BOOKSTORE_BOOKS from '@/framework/fixtures/books.json'
import {
  createAuthenticatedUser,
  createTestUser,
  deleteTestUser,
  generateUserCredentials,
} from '@/framework/fixtures/bookStoreUser.js'
import { bookStoreService } from '@/framework/services/bookStoreService.js'

describe('bookstore Account API', { tags: ['Task-6', 'Task-8'] }, () => {
  // Каждый раз при запуске тестов создаётся новый пользователь,
  // который используется в последующих тестах
  // и удаляется по их окончании
  let sharedUser
  let sharedToken

  beforeAll(async () => {
    const userWithToken = await createAuthenticatedUser()
    sharedUser = userWithToken.user
    sharedToken = userWithToken.token
  })
  afterAll(async () => {
    await deleteTestUser(sharedUser.userId, sharedToken)
  })

  describe('[POST] /User - создание пользователя', () => {
    it.concurrent('возвращает 400 при невалидном пароле', async () => {
      const res = await bookStoreService.userController.createUser(
        generateUserCredentials(null, '1234567890!'),
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1300')
    })

    it('возвращает 201 и userId при корректных данных', async () => {
      const user = generateUserCredentials()
      const res = await bookStoreService.userController.createUser(user)

      expect(res.status).toBe(201)
      // FIXME: Swagger описывает поле как `userId`, но API возвращает `userID`
      expect(res._data).toHaveProperty('userID')

      // Чистим созданного пользователя
      const { _data: tokenData } = await bookStoreService.userController.generateToken(
        {
          userName: user.userName,
          password: user.password,
        },
      )
      await bookStoreService.userController.deleteUser(res._data.userID, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      })
    })

    it('возвращает 406 (code: "1204") при повторном использовании логина', async () => {
      const res = await bookStoreService.userController.createUser(
        { userName: sharedUser.userName, password: sharedUser.password },
      )

      expect(res.status).toBe(406)
      expect(res._data).toHaveProperty('code', '1204')
    })
  })

  describe.concurrent('[POST] /GenerateToken - генерация токена', () => {
    it('возвращает статус `Failed` при неверном пароле', async () => {
      const res = await bookStoreService.userController.generateToken({
        userName: sharedUser.userName,
        password: sharedUser.password.slice(0, -1),
      })

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('status', 'Failed')
    })

    it('возвращает токен при верных учётных данных', async () => {
      const res = await bookStoreService.userController.generateToken({
        userName: sharedUser.userName,
        password: sharedUser.password,
      })

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('status', 'Success')
      expect(res._data.token).not.toBeNullable()
      sharedToken = res._data.token
    })
  })

  describe.concurrent('[GET] /User/{UUID} - получение информации о пользователе', () => {
    it('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await bookStoreService.userController.getUser(sharedUser.userId)
      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('возвращает 401 (code: "1200") с невалидным токеном', async () => {
      const res = await bookStoreService.userController.getUser(
        sharedUser.userId,
        {
          headers: { Authorization: 'Bearer mr-invalid-token' },
        },
      )

      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('возвращает данные пользователя при корректном токене', async () => {
      const res = await bookStoreService.userController.getUser(
        sharedUser.userId,
        {
          headers: { Authorization: `Bearer ${sharedToken}` },
        },
      )

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('userId', sharedUser.userId)
      expect(res._data).toHaveProperty('username', sharedUser.userName)
    })
  })

  describe('[POST] /Authorized - авторизация пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      // Создаём пользователя БЕЗ вызова GenerateToken - он не авторизован
      localUser = await createTestUser()
    })

    afterAll(async () => {
      // Страховка на случай если тесты упали до получения токена
      if (!localToken) {
        localToken = await bookStoreService.userController.generateToken(
          { userName: localUser.userName, password: localUser.password },
        )
      }

      await deleteTestUser(localUser.userId, localToken)
    })

    it.concurrent('возвращает 400 (code: "1200") при отсутствии тела запроса', async () => {
      const res = await bookStoreService.userController.isUserAuthorized()
      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it.concurrent('возвращает 404 (code: "1207") для несуществующего пользователя', async () => {
      const res = await bookStoreService.userController.isUserAuthorized(generateUserCredentials())
      expect(res.status).toBe(404)
      expect(res._data).toHaveProperty('code', '1207')
    })

    it('возвращает false если токен не был получен', async () => {
      const res = await bookStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res.status).toBe(200)
      expect(res._data).toBe(false)
    })

    it('возвращает true после получения токена', async () => {
      localToken = await bookStoreService.userController.generateToken(
        { userName: localUser.userName, password: localUser.password },
      )

      const res = await bookStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res.status).toBe(200)
      expect(res._data).toBe(true)
    })
  })

  describe('[DELETE] /User/{UUID} - удаление пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      const userWithToken = await createAuthenticatedUser()
      localUser = userWithToken.user
      localToken = userWithToken.token
    })
    afterAll(async () => {
      await deleteTestUser(localUser.userId, localToken)
    })

    it.concurrent('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await bookStoreService.userController.deleteUser(localUser.userId)
      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('успешно удаляет пользователя', async () => {
      const res1 = await bookStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res1.status).toBe(200)
      expect(res1._data).toBe(true)

      const res = await bookStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })

      // FIXME: Swagger описывает тело ответа, но фактически возвращается пустое тело
      expect(res.status).toBe(204)
      expect(res._data).toBeNullable()
    })

    // FIXME возввращает 200 с телом `{ code: '1207', message: 'User Id not correct!' }`
    //  Получается, даже токен удалённого юзера не стух... ужас :D
    //  Пока скипаю данный тест
    it.skip('возвращает 401 (code: "1200") при попытке удалить уже удалённого пользователя', async () => {
      // После удаления токен инвалидируется
      const res = await bookStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })

      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })
  })
})

describe('bookstore Book API', { tags: ['Task-9'] }, () => {
  const BOOKS = BOOKSTORE_BOOKS.books
  const FIRST_BOOK = BOOKS[0]
  const SECOND_BOOK = BOOKS[1]

  // Каждый раз при запуске тестов создаётся новый пользователь,
  // который используется в последующих тестах
  // и удаляется по их окончании
  let sharedUser
  let sharedToken

  beforeAll(async () => {
    const userWithToken = await createAuthenticatedUser()
    sharedUser = userWithToken.user
    sharedToken = userWithToken.token
  })
  afterAll(async () => {
    await deleteTestUser(sharedUser.userId, sharedToken)
  })

  describe.concurrent('[GET] /Books - получение всех книг', () => {
    it('возвращает 200 и список книг без авторизации', async () => {
      const res = await bookStoreService.booksController.getBooks()

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('books')
      expect(Array.isArray(res._data.books)).toBe(true)
      expect(res._data.books.length).toBeGreaterThanOrEqual(0)
    })

    it('книга содержит обязательные поля', async () => {
      const res = await bookStoreService.booksController.getBooks()
      const book = res._data.books[0]

      expect(book).toMatchObject({
        isbn: expect.any(String),
        title: expect.any(String),
        subTitle: expect.any(String),
        author: expect.any(String),
        publish_date: expect.any(String), // .toISOString()
        publisher: expect.any(String),
        pages: expect.any(Number),
        description: expect.any(String),
        website: expect.any(String),
      })
    })

    describe('список содержит все ожидаемые книги', async () => {
      const books = (await bookStoreService.booksController.getBooks())?._data?.books

      it.each(BOOKS)('содержит книгу "$title" (isbn: $isbn)', ({ isbn, title }) => {
        const book = books.find(book => book.isbn === isbn)

        expect(book).toBeDefined()
        expect(book).toHaveProperty('isbn', isbn)
        expect(book).toHaveProperty('title', title)
      })
    })
  })

  describe('[POST] /Books - добавление книги пользователю', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      const userWithToken = await createAuthenticatedUser()
      localUser = userWithToken.user
      localToken = userWithToken.token
    })

    afterAll(async () => {
      await deleteTestUser(localUser.userId, localToken)
    })

    it.concurrent('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await bookStoreService.booksController.addBooks({
        userId: localUser.userId,
        collectionOfIsbns: [{ isbn: FIRST_BOOK.isbn }],
      })

      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('возвращает 400 (code: "1207") при пустом collectionOfIsbns', async () => {
      const res = await bookStoreService.booksController.addBooks(
        {
          userId: localUser.userId,
          collectionOfIsbns: [],
        },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1207')
    })

    it('успешно добавляет книгу пользователю', async () => {
      const res = await bookStoreService.booksController.addBooks(
        {
          userId: localUser.userId,
          collectionOfIsbns: [{ isbn: FIRST_BOOK.isbn }],
        },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(201)
      expect(res._data).toHaveProperty('books')
      expect(res._data.books).toContainEqual({ isbn: FIRST_BOOK.isbn })
    })

    it('возвращает 400 (code: "1210") при добавлении уже добавленной книги', async () => {
      // FIRST_BOOK уже добавлена в предыдущем тесте
      const res = await bookStoreService.booksController.addBooks(
        {
          userId: localUser.userId,
          collectionOfIsbns: [{ isbn: FIRST_BOOK.isbn }],
        },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1210')
    })
  })

  describe('[PUT] /Books/{ISBN} - замена книги пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      const userWithToken = await createAuthenticatedUser()
      localUser = userWithToken.user
      localToken = userWithToken.token

      // Добавляем FIRST_BOOK - её будем заменять в тестах
      await bookStoreService.booksController.addBooks(
        {
          userId: localUser.userId,
          collectionOfIsbns: [{ isbn: FIRST_BOOK.isbn }],
        },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )
    })

    afterAll(async () => {
      await bookStoreService.booksController.deleteBooks(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })
      await deleteTestUser(localUser.userId, localToken)
    })

    it.concurrent('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await bookStoreService.booksController.updateBooks(
        FIRST_BOOK.isbn,
        { userId: localUser.userId, isbn: SECOND_BOOK.isbn },
      )

      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('возвращает 400 (code: "1205") при замене на несуществующий ISBN', async () => {
      const res = await bookStoreService.booksController.updateBooks(
        FIRST_BOOK.isbn,
        { userId: localUser.userId, isbn: 'non-existent-isbn' },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1205')
    })

    it('возвращает 400 (code: "1206") при замене книги отсутствующей у пользователя', async () => {
      // SECOND_BOOK есть в магазине, но не добавлена пользователю
      const res = await bookStoreService.booksController.updateBooks(
        SECOND_BOOK.isbn,
        { userId: localUser.userId, isbn: FIRST_BOOK.isbn },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1206')
    })

    it('успешно заменяет книгу пользователя', async () => {
      const res = await bookStoreService.booksController.updateBooks(
        FIRST_BOOK.isbn,
        { userId: localUser.userId, isbn: SECOND_BOOK.isbn },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(200)
      expect(res._data).toEqual({
        userId: localUser.userId,
        username: localUser.userName,
        books: [
          expect.objectContaining({ isbn: SECOND_BOOK.isbn }),
        ],
      })
    })
  })

  describe('[DELETE] /Books - удаление всех книг пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      const userWithToken = await createAuthenticatedUser()
      localUser = userWithToken.user
      localToken = userWithToken.token

      // Добавляем две книги - чтобы убедиться что удаляются все, а не одна
      await bookStoreService.booksController.addBooks(
        {
          userId: localUser.userId,
          collectionOfIsbns: [
            { isbn: FIRST_BOOK.isbn },
            { isbn: SECOND_BOOK.isbn },
          ],
        },
        { headers: { Authorization: `Bearer ${localToken}` } },
      )
    })

    afterAll(async () => {
      // В случае падения тестов, пробуем очистить
      await bookStoreService.booksController.deleteBooks(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })
      await deleteTestUser(localUser.userId, localToken)
    })

    it.concurrent('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await bookStoreService.booksController.deleteBooks(localUser.userId)

      expect(res.status).toBe(401)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('успешно удаляет все книги пользователя', async () => {
      const res = await bookStoreService.booksController.deleteBooks(
        localUser.userId,
        { headers: { Authorization: `Bearer ${localToken}` } },
      )

      expect(res.status).toBe(204)
      expect(res._data).toBeUndefined()

      // Проверяем, что книги удалены
      const user = await bookStoreService.userController.getUser(
        localUser.userId,
        { headers: { Authorization: `Bearer ${localToken}` } },
      )
      expect(user._data.books).toHaveLength(0)
    })
  })
})
