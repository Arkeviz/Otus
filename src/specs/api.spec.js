import { faker } from '@faker-js/faker'
import { ofetch } from 'ofetch'
import { describe, expect, it } from 'vitest'
import { config as bookstoreConfig } from '@/framework/config/bookstore.js'

const instance = ofetch.create({
  baseURL: `${bookstoreConfig.baseURL}/Account/v1`,
  // Ставим флаг, чтобы при кодах 4ХХ и 5ХХ не вызывать ошибки и работать с ответами
  // https://github.com/unjs/ofetch/tree/v1#%EF%B8%8F-handling-errors
  ignoreResponseError: true,
})

describe('api.spec.js', { tags: ['Task-6'] }, () => {
  // Каждый раз при запуске теста создаётся новый пользователь,
  // который используется в последующих тестах
  // и удаляется по их окончании
  const userName = faker.internet.username()
  // faker иногда генерирует неподходящие пароли, так что пусть будет статичным
  const password = 't3St-p@ssWor6!'
  let userId = null
  let token = null

  it('создание пользователя с ошибкой "Пароль не подходит"', async () => {
    const res = await instance.raw('/User', {
      method: 'POST',
      body: {
        userName,
        password: '1234567890!',
      },
    })
    expect(res.status).toBe(400)
    expect(res._data).toHaveProperty('code', '1300')
  })
  it('создание пользователя', async () => {
    const res = await instance.raw('/User', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    expect(res.status).toBe(201)
    // FIXME не совпадает со схемой в сваггере, должен быть `userId`
    expect(res._data).toHaveProperty('userID')
    userId = res._data.userID
  })
  it('создание пользователя с ошибкой "Логин уже используется"', async () => {
    const res = await instance.raw('/User', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    expect(res.status).toBe(406)
    expect(res._data).toHaveProperty('code', '1204')
  })

  it('генерация токена c ошибкой', async () => {
    const res = await instance.raw('/GenerateToken', {
      method: 'POST',
      body: {
        userName,
        password: password.slice(0, -1),
      },
    })
    expect(res.status).toBe(200)
    expect(res._data).toHaveProperty('status', 'Failed')
  })
  it('генерация токена', async () => {
    const res = await instance.raw('/GenerateToken', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    expect(res.status).toBe(200)
    expect(res._data).toHaveProperty('status', 'Success')
    expect(res._data).toHaveProperty('token')
    token = res._data.token
  })

  it('удаление тестового пользователя', async () => {
    if (!userId)
      throw new Error('Пользователь не был создан в процессе тестов')

    const isAuthResponse = await instance.raw(`/Authorized`, {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })

    expect(isAuthResponse.status).toBe(200)
    expect(isAuthResponse._data).toBeTruthy()

    const res = await instance.raw(`/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    })
    // FIXME Схема сваггера не совпадает с фактической,
    //  т.к. я получаю undefined при успешном удалении юзера
    expect(res.status).toBe(204)
    expect(res._data).toBeNullable()
  })
})
