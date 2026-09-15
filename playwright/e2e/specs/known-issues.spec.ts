import { expect, test } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

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
      const homePage = new HomePage(page)

      await homePage.goto()
      const homeUrl = page.url()

      await homePage.clickSeriesLink()

      await expect(page).not.toHaveURL(homeUrl)
      await expect(page).toHaveURL(/serials|series/i)
    },
  )

  test.fail(
    'кнопка "Посмотреть всё" должна вести на полный каталог (Баг: не реализовано)',
    async ({ page }) => {
      const homePage = new HomePage(page)

      await homePage.goto()
      const initialUrl = page.url()

      await homePage.clickViewAllLink()

      await expect(page).not.toHaveURL(initialUrl)
    },
  )
})
