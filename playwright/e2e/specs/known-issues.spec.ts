import { expect, test } from '@playwright/test'

/**
 * Эти два теста фиксируют известные баги:
 * - переход на страницу "Сериалы" не работает
 * - кнопка "Посмотреть всё" также не работает.
 * Помечены через `test.fail()`, чтобы отчёт остаётся зелёным,
 * но если баги пофиксят - будет ошибка и можно будет убрать `.fail()`.
 */

test.describe('Известные проблемы', () => {
  test.fail(
    'переход по ссылке "Сериалы" должен вести на страницу с сериалами (Баг: раздел не реализован)',
    async ({ page }) => {
      await page.goto('/')

      await page.getByRole('link', { name: 'Сериалы' }).click()

      // Ожидаемый результат: URL меняется на раздел сериалов, а не остаётся на главной
      const homeUrl = page.url()
      await expect(page).not.toHaveURL(homeUrl)
      await expect(page).toHaveURL(/serials|series/i)
    },
  )

  test.fail(
    'кнопка "Посмотреть всё" должна вести на полный каталог (Баг: не реализовано)',
    async ({ page }) => {
      await page.goto('/')

      const initialUrl = page.url()
      await page.getByRole('link', { name: 'Посмотреть всё' }).click()

      // Ожидаемый результат: происходит переход на страницу каталога
      // (сейчас клик ни на что не влияет, URL остаётся прежним - баг)
      await expect(page).not.toHaveURL(initialUrl)
    },
  )
})
