export const CHARACTERS_RESULTS = Object.freeze({
  Дедушка: 'Я от дедушки ушёл',
  Заяц: 'Я от зайца ушёл',
  Лиса: 'Меня съели',
})

/**
 * Функция принимает на вход имя персонажа, возвращает, что сделал колобок после встречи с персонажем.
 * @param character
 *
 * @example
 * kolobok('Дедушка') // Я от дедушки ушёл
 * kolobok('Лиса') // Меня съели
 */
export function kolobok(character: string) {
  return CHARACTERS_RESULTS[character as keyof typeof CHARACTERS_RESULTS] ?? 'А от такого я ещё не убегал😨'
}

/**
 * Функция на вход принимает имя персонажа и возвращает троекратный призыв
 * Возвращает
 * @param name
 *
 * @example
 *
 * newYear('Дед Мороз') // Дед Мороз! Дед Мороз! Дед Мороз!
 * newYear('Снегурочка') // Снегурочка! Снегурочка! Снегурочка!
 */
export function newYear(name: string) {
  return `${name}! ${name}! ${name}!`
}
