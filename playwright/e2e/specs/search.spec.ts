import { test } from '@playwright/test'
import { createHomePage } from '../pages/HomePage'
import { createSearchWidget } from '../pages/SearchWidget'

test.describe('Поиск', () => {
  test('открытие поиска без ввода текста показывает блок "Часто ищут"', async ({
    page,
  }) => {
    const homePage = createHomePage(page)
    const searchWidget = createSearchWidget(page)

    await homePage.goto()
    await homePage.openSearch()

    // Ожидаемый результат: модалка открыта, поле пустое, показан placeholder,
    // и без ввода текста сразу видна секция "Часто ищут" с карточками фильмов
    await searchWidget.expectOpenWithEmptyState()
  })

  test('ввод запроса и Enter возвращают карточки фильмов и людей с непустыми названиями', async ({
    page,
  }) => {
    const homePage = createHomePage(page)
    const searchWidget = createSearchWidget(page)

    await homePage.goto()
    await homePage.openSearch()
    await searchWidget.searchFor('человек')

    // Найден минимум один фильм, у карточки не пустой заголовок
    await searchWidget.expectHasMovieResults()
    // Блок актёров/режиссёров также заполнен
    await searchWidget.expectHasPersonResults()
  })

  test('крестик закрывает модалку поиска', async ({ page }) => {
    const homePage = createHomePage(page)
    const searchWidget = createSearchWidget(page)

    await homePage.goto()
    await homePage.openSearch()
    await searchWidget.expectOpenWithEmptyState()

    await searchWidget.close()
    await searchWidget.expectClosed()
  })
})
