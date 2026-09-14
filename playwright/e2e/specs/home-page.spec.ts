import { expect, test } from '@playwright/test'

test.describe('Главная страница', () => {
  test('отображает hero-блок и каталог с жанрами', async ({ page }) => {
    await page.goto('/')

    // Заголовок главного промо-блока виден
    await expect(
      page.getByRole('heading', { name: /Самые сочные премьеры кино/i }),
    ).toBeVisible()

    // Кнопка "Смотреть бесплатно" присутствует и кликабельна
    await expect(
      page.getByRole('button', { name: 'Смотреть бесплатно' }),
    ).toBeVisible()

    // Каталог фильмов отрисован и содержит минимум один жанр
    await expect(page.getByText('детектив', { exact: true })).toBeVisible()
    await expect(page.getByText('драма', { exact: true })).toBeVisible()
  })
})
