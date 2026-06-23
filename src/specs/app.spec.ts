import { describe, expect, it } from 'vitest'
import { fullTrim, getTotal, nameIsValid } from '@/app'

describe('app.ts', { tags: ['Task-5'] }, () => {
  describe('nameIsValid', () => {
    type TestCase = [
      title: string,
      name: string | number,
      expected: boolean,
    ]
    it.for(
      [
        ['имя кириллицей с большой буквы', 'Алексей', false],
        ['имя кириллицей с маленькой буквы', 'алексей', false],
        ['имя латиницей с большой буквы', 'Aleksei', false],
        ['имя латиницей с маленькой буквы', 'aleksei', true],
        ['цифры в имени', 'агент47', false],
        ['цифры вместо имени', 47 as never, false],
      ] satisfies TestCase[],
    )('%s', ([_, name, res]) => {
      expect(nameIsValid(name)).toBe(res)
    })
  })

  describe('fullTrim', () => {
    type TestCase = [
      title: string,
      name: string,
      expected: string,
    ]
    it.for(
      [
        ['слово с пробелом', 'до вод', 'довод'],
        ['слово с пробелами', 'д о в о д', 'довод'],
        ['текст с пробелами', ' Пробелы По Краям ', 'ПробелыПоКраям'],
        ['текст без пробелов с тире', 'чики-брики ', 'чики-брики'],
        ['undefined вместо текста', undefined as never, ''],
      ] satisfies TestCase[],
    )('%s', ([_, name, res]) => {
      expect(fullTrim(name)).toBe(res)
    })
  })

  describe('getTotal', () => {
    type TestCase = [
      title: string,
      items: { price: number, quantity: number }[],
      discount: number,
      expected: number,
    ]
    it.for(
      [
        ['цена: 10, кол-во: 10, итого: 100', [{ price: 10, quantity: 10 }], 0, 100],
        ['цена: 10, кол-во: 1, итого: 10', [{ price: 10, quantity: 1 }], 0, 10],
        ['2 товара, итого: 100', [{ price: 10, quantity: 1 }, { price: 10, quantity: 9 }], 0, 100],
        ['цена: 10, кол-во: 10, скидка: 10 итого: 90', [{ price: 10, quantity: 10 }], 10, 90],
      ] satisfies TestCase[],
    )('%s', ([_, items, discount, res]) => {
      expect(getTotal(items, discount)).toBe(res)
    })

    it('ошибка при скидке меньше нуля', () => {
      expect(() => getTotal([{ price: 10, quantity: 10 }], -5)).toThrow()
    })
    it('ошибка при скидке больше 99', () => {
      expect(() => getTotal([{ price: 10, quantity: 10 }], 100)).toThrow()
    })
    it('ошибка при передаче НЕ числа в скидку', () => {
      expect(() =>
        getTotal(
          [{ price: 10, quantity: 1 }],
          { price: 10, quantity: 10 } as never,
        )).toThrow()
    })
    // FIXME Ожидаемо, тест упадёт,
    //  т.к. NaN обойдёт проверки и никаких ошибок не вылетит
    it.skip('ошибка при передаче NaN в скидку', () => {
      expect(
        getTotal([{ price: 10, quantity: 1 }], Number.NaN),
      ).not.toBeNaN()
    })
  })
})
