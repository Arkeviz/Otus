/**
 * Проверка имени пользователя
 * @param {string} name
 * @returns {boolean}
 */
export const nameIsValid = name => typeof name === 'string' && name.length >= 2 && /^[a-z]+$/.test(name)

/**
 * Удаление пробелов из строки
 *
 * @param {string} text
 * @returns {string}
 */
export const fullTrim = text => (text ?? '').replace(/\s+/g, '')

/**
 * Подсчёт суммы заказа
 *
 * @param {[{quantity: number, name?: string, price: number}]} items
 * @param {number} discount
 * @returns {number}
 * @throws Вернёт ошибку, если скидка не число и больше 99 или меньше 0
 * @example getTotal([{ price: 10, quantity: 10 }]) // 100
 * @example getTotal([{ price: 10, quantity: 1 }]) // 10
 * @example getTotal([{ price: 10, quantity: 1 }, { price: 10, quantity: 9 }]) // 100
 * @example getTotal([{ price: 10, quantity: 0 }], { price: 10, quantity: 9 }) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 10) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 100) // 0
 */
export function getTotal(items = [], discount = 0) {
  if (typeof discount !== 'number') {
    throw new TypeError('Скидка должна быть числом')
  }
  if (discount < 0 || discount >= 100) {
    throw new Error('Процент скидки должен быть от 0 до 99')
  }

  const total = items.reduce((acc, { price, quantity }) => acc + price * quantity, 0)
  return total * (1 - discount / 100)
}

/**
 * Подсчёт общей успеваемости
 * @param obj
 *
 * @example
 * const scores = {
 *   Anna: 10,
 *   Olga: 1,
 *   Ivan: 5,
 * }
 * getScore(scores) // 16
 */
export function getScore(obj) {
  let score = 0
  for (const key in obj) {
    score += +obj[key]
  }
  return score
}
