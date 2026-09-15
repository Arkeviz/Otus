import { test } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { SearchWidget } from '../pages/SearchWidget'

test.describe('Поиск', () => {
  test('открытие поиска без ввода текста показывает блок "Часто ищут"', async ({
    page,
  }) => {
    const homePage = new HomePage(page)
    const searchWidget = new SearchWidget(page)

    await homePage.goto()
    await homePage.openSearch()

    await searchWidget.expectOpenWithEmptyState()
  })

  test('ввод запроса и Enter возвращают карточки фильмов и людей с непустыми названиями', async ({
    page,
  }) => {
    const homePage = new HomePage(page)
    const searchWidget = new SearchWidget(page)

    await homePage.goto()
    await homePage.openSearch()
    await searchWidget.searchFor('человек')

    // Найден минимум один фильм, у карточки не пустой заголовок
    await searchWidget.expectHasMovieResults()
    // Блок актёров/режиссёров также заполнен
    await searchWidget.expectHasPersonResults()
  })
})
