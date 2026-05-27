import { ofetch } from 'ofetch'
import { describe, expect, it } from 'vitest'

const instance = ofetch.create({
  baseURL: 'https://bookstore.demoqa.com/Account/v1',
  // Ставим флаг, чтобы при кодах 4ХХ и 5ХХ не вызывать ошибки и работать с ответами
  // https://github.com/unjs/ofetch/tree/v1#%EF%B8%8F-handling-errors
  ignoreResponseError: true,
})

describe('api.spec.js', () => {
  // Каждый раз при запуске теста создаётся новый пользователь,
  // который используется в последующих тестах
  // и удаляется по их окончании
  const userName = `MrTestUser-${Math.round(Math.random() * 10000)}`
  const password = `aAlekse1!`
  let userId = null
  let token = null

  it('создание пользователя с ошибкой "Пароль не подходит"', async () => {
    const res = await instance('/User', {
      method: 'POST',
      body: {
        userName,
        password: '1234567890!',
      },
    })
    expect(res).toHaveProperty('code', '1300')
  })
  it('создание пользователя', async () => {
    const res = await instance('/User', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    // FIXME не совпадает со схемой в сваггере, должен быть `userId`
    expect(res).toHaveProperty('userID')
    userId = res.userID
  })
  it('создание пользователя с ошибкой "Логин уже используется"', async () => {
    const res = await instance('/User', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    expect(res).toHaveProperty('code', '1204')
  })

  it('генерация токена c ошибкой', async () => {
    const res = await instance('/GenerateToken', {
      method: 'POST',
      body: {
        userName,
        password: password.slice(0, -1),
      },
    })
    expect(res).toHaveProperty('status', 'Failed')
  })
  it('генерация токена', async () => {
    const res = await instance('/GenerateToken', {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })
    expect(res).toHaveProperty('status', 'Success')
    expect(res).toHaveProperty('token')
    token = res.token
  })

  it('удаление тестового пользователя', async () => {
    if (!userId)
      throw new Error('Пользователь не был создан в процессе тестов')

    const isAuthorised = await instance(`/User/${userId}`, {
      method: 'POST',
      body: {
        userName,
        password,
      },
    })

    expect(isAuthorised).toBeTruthy()

    const res = await instance(`/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    })
    // FIXME Схема сваггера не совпадает с фактической,
    //  т.к. я получаю undefined при успешном удалении юзера
    expect(res).toBeNullable()
  })
})
