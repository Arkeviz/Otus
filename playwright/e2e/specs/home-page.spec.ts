import { test } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('Главная страница', () => {
  test('отображает hero-блок и каталог с жанрами', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()

    // Заголовок главного промо-блока виден
    // Кнопка "Смотреть бесплатно" присутствует и кликабельна
    await homePage.expectHeroVisible()

    // Каталог фильмов отрисован и содержит минимум один жанр
    await homePage.expectGenreVisible('детектив')
    await homePage.expectGenreVisible('драма')
  })
})
