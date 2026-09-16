import { test } from '@playwright/test'
import { createHomePage } from '../pages/homePage'

/**
 * Эти два теста фиксируют известные баги:
 * - переход на страницу "Сериалы" не работает
 * - кнопка "Посмотреть всё" также не работает.
 * Помечены через `test.fail()`, чтобы отчёт остаётся зелёным,
 * но если баги пофиксят - будет ошибка и можно будет убрать `.fail()`.
 */

test.describe('Известные проблемы', () => {
  test.fail(
    'переход по ссылке "Сериалы" должен вести на страницу с сериалами (BUG: раздел не реализован)',
    async ({ page }) => {
      const homePage = createHomePage(page)

      await homePage.goto()
      const homeUrl = homePage.url()

      await homePage.clickSeriesLink()

      await homePage.expectUrlChangedFrom(homeUrl)
      await homePage.expectUrlMatches(/serials|series/i)
    },
  )

  test.fail(
    'кнопка "Посмотреть всё" должна вести на полный каталог (BUG: не реализовано)',
    async ({ page }) => {
      const homePage = createHomePage(page)

      await homePage.goto()
      const initialUrl = homePage.url()

      await homePage.clickViewAllLink()

      await homePage.expectUrlChangedFrom(initialUrl)
    },
  )
})
