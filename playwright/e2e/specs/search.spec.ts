import { expect, test } from '@playwright/test'

test.describe('Поиск', () => {
  test('открытие поиска без ввода текста показывает блок "Часто ищут"', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Поиск' }).click()

    const searchInput = page.locator('#search-widget')

    // Открывается модалка
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveValue('')
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      /Название/,
    )

    // Без ввода текста сразу показывается блок "Часто ищут"
    // с карточками фильмов, т.е. модалка не пустая и не требует запроса
    const suggestedSection = page.locator(
      '.search-widget__section-title--movies',
    )
    await expect(suggestedSection).toHaveText(/Часто ищут/)

    const suggestedMovies = page.locator('.search-widget-movie')
    await expect(suggestedMovies.first()).toBeVisible()
    await expect(suggestedMovies).not.toHaveCount(0)
  })

  test('ввод запроса и Enter возвращают карточки фильмов и людей с непустыми названиями', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Поиск' }).click()

    const searchInput = page.locator('#search-widget')
    await searchInput.fill('Человек')

    // Запускаем поиск и ждём ответ
    const searchResponse = page.waitForResponse(
      response =>
        response.url().toLowerCase().includes('search')
        && response.status() === 200,
    )
    await searchInput.press('Enter')
    await searchResponse

    const movieResults = page.locator('.search-widget-movie__title')
    const personResults = page.locator('.search-widget-person__name')

    // Найден минимум один фильм, у карточки не пустой заголовок
    await expect(movieResults.first()).toBeVisible()
    const firstMovieTitle = await movieResults.first().textContent()
    expect(firstMovieTitle?.trim().length).toBeGreaterThan(0)

    // Блок актёров/режиссёров также заполнен
    await expect(personResults.first()).toBeVisible()
    const firstPersonName = await personResults.first().textContent()
    expect(firstPersonName?.trim().length).toBeGreaterThan(0)
  })
})
