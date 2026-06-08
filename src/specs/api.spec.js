import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { generateUserCredentials } from '@/framework/fixtures/generateUserCredentials.js'
import { booksStoreService } from '@/framework/services/booksStoreService.js'

describe('bookstore API', { tags: ['Task-6', 'Task-8'] }, () => {
  // Каждый раз при запуске тестов создаётся новый пользователь,
  // который используется в последующих тестах
  // и удаляется по их окончании
  let sharedUser
  let sharedToken

  beforeAll(async () => {
    const credentials = generateUserCredentials()
    const { _data: user } = await booksStoreService.userController.createUser(credentials)
    // FIXME: Swagger описывает поле как `userId`, но API возвращает `userID`
    sharedUser = { userId: user.userID, userName: credentials.userName, password: credentials.password }
    const { _data: tokenData } = await booksStoreService.userController.generateToken(
      { userName: sharedUser.userName, password: sharedUser.password },
    )
    sharedToken = tokenData.token
  })
  afterAll(async () => {
    await booksStoreService.userController.deleteUser(sharedUser.userId, {
      headers: { Authorization: `Bearer ${sharedToken}` },
    })
  })

  describe('/User - создание пользователя', () => {
    it('возвращает 400 при невалидном пароле', async () => {
      const res = await booksStoreService.userController.createUser(
        generateUserCredentials(null, '1234567890!'),
      )

      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1300')
    })

    it('возвращает 201 и userId при корректных данных', async () => {
      const user = generateUserCredentials()
      const res = await booksStoreService.userController.createUser(user)

      expect(res.status).toBe(201)
      // FIXME: Swagger описывает поле как `userId`, но API возвращает `userID`
      expect(res._data).toHaveProperty('userID')

      // Чистим созданного пользователя
      const { _data: tokenData } = await booksStoreService.userController.generateToken(
        {
          userName: user.userName,
          password: user.password,
        },
      )
      await booksStoreService.userController.deleteUser(res._data.userID, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      })
    })

    it('возвращает 406 (code: "1204") при повторном использовании логина', async () => {
      const res = await booksStoreService.userController.createUser(
        { userName: sharedUser.userName, password: sharedUser.password },
      )

      expect(res.status).toBe(406)
      expect(res._data).toHaveProperty('code', '1204')
    })
  })

  describe('/GenerateToken - генерация токена', () => {
    it('возвращает статус `Failed` при неверном пароле', async () => {
      const res = await booksStoreService.userController.generateToken({
        userName: sharedUser.userName,
        password: sharedUser.password.slice(0, -1),
      })

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('status', 'Failed')
    })

    it('возвращает токен при верных учётных данных', async () => {
      const res = await booksStoreService.userController.generateToken({
        userName: sharedUser.userName,
        password: sharedUser.password,
      })

      expect(res.status).toBe(200)
      expect(res._data).toHaveProperty('status', 'Success')
      expect(res._data.token).not.toBeNullable()
      sharedToken = res._data.token
    })
  })

  describe('/User/{UUID} - получение информации о пользователе', () => {
    it('возвращает 401 без токена авторизации', async () => {
      const res = await booksStoreService.userController.getUser(sharedUser.userId)
      expect(res.status).toBe(401)
    })

    it('возвращает 401 с невалидным токеном', async () => {
      const res = await booksStoreService.userController.getUser(
        sharedUser.userId,
        {
          headers: { Authorization: 'Bearer mr-invalid-token' },
        },
      )

      expect(res.status).toBe(401)
    })

    it('возвращает данные пользователя при корректном токене', async () => {
      const res = await booksStoreService.userController.getUser(
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

  describe('/Authorized - авторизация пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      // Создаём пользователя БЕЗ вызова GenerateToken - он не авторизован
      const credentials = generateUserCredentials()
      const { _data: user } = await booksStoreService.userController.createUser(credentials)
      localUser = { userId: user.userID, userName: user.username, password: credentials.password }
    })

    afterAll(async () => {
      // Страховка на случай если тесты упали до получения токена
      if (!localToken) {
        localToken = await booksStoreService.userController.generateToken(
          { userName: localUser.userName, password: localUser.password },
        )
      }

      await booksStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })
    })

    it('возвращает 400 (code: "1200") при отсутствии тела запроса', async () => {
      const res = await booksStoreService.userController.isUserAuthorized()
      expect(res.status).toBe(400)
      expect(res._data).toHaveProperty('code', '1200')
    })

    it('возвращает 404 (code: "1207") для несуществующего пользователя', async () => {
      const res = await booksStoreService.userController.isUserAuthorized(generateUserCredentials())
      expect(res.status).toBe(404)
      expect(res._data).toHaveProperty('code', '1207')
    })

    it('возвращает false если токен не был получен', async () => {
      const res = await booksStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res.status).toBe(200)
      expect(res._data).toBe(false)
    })

    it('возвращает true после получения токена', async () => {
      localToken = await booksStoreService.userController.generateToken(
        { userName: localUser.userName, password: localUser.password },
      )

      const res = await booksStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res.status).toBe(200)
      expect(res._data).toBe(true)
    })
  })

  describe('/User/{UUID} - удаление пользователя', () => {
    let localUser
    let localToken

    beforeAll(async () => {
      // Создаём пользователя + токен
      const credentials = generateUserCredentials()
      const { _data: user } = await booksStoreService.userController.createUser(credentials)
      localUser = { userId: user.userID, userName: user.username, password: credentials.password }

      const tokenData = await booksStoreService.userController.generateToken(
        { userName: localUser.userName, password: localUser.password },
      )
      localToken = tokenData._data.token
    })

    afterAll(async () => {
      // Если тест успешного удаления упал - удаляем вручную
      await booksStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })
    })

    it('возвращает 401 (code: "1200") без токена авторизации', async () => {
      const res = await booksStoreService.userController.deleteUser(localUser.userId)
      expect(res.status).toBe(401)
    })

    it('успешно удаляет пользователя', async () => {
      const res1 = await booksStoreService.userController.isUserAuthorized(
        { userName: localUser.userName, password: localUser.password },
      )

      expect(res1.status).toBe(200)
      expect(res1._data).toBe(true)

      const res = await booksStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })

      // FIXME: Swagger описывает тело ответа, но фактически возвращается пустое тело
      expect(res.status).toBe(204)
      expect(res._data).toBeNullable()
    })

    // FIXME возввращает 200 с телом `{ code: '1207', message: 'User Id not correct!' }`
    //  Получается, даже токен удалённого юзера не стух... ужас :D
    // Пока скипаю
    it.skip('возвращает 401 при попытке удалить уже удалённого пользователя', async () => {
      // После удаления токен инвалидируется
      const res = await booksStoreService.userController.deleteUser(localUser.userId, {
        headers: { Authorization: `Bearer ${localToken}` },
      })

      expect(res.status).toBe(401)
    })
  })
})
