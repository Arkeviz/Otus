import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Главная страница
 */
export function createHomePage(page: Page) {
  const heroHeading = page.getByRole('heading', {
    name: /Самые сочные премьеры кино/i,
  })
  const heroCtaButton = page.getByRole('button', {
    name: 'Смотреть бесплатно',
  })
  const searchLink = page.getByRole('link', { name: 'Поиск' })
  const seriesLink = page.getByRole('link', { name: 'Сериалы' })
  const viewAllLink = page.getByRole('link', { name: 'Посмотреть всё' })

  const genreHeading = (genre: string) => page.getByText(genre, { exact: true })

  return {
    heroHeading,
    heroCtaButton,
    searchLink,
    seriesLink,
    viewAllLink,
    genreHeading,

    goto: async () => {
      await page.goto('/')
    },

    url: () => page.url(),

    expectHeroVisible: async () => {
      await expect(heroHeading).toBeVisible()
      await expect(heroCtaButton).toBeVisible()
    },

    expectGenreVisible: async (genre: string) => {
      await expect(genreHeading(genre)).toBeVisible()
    },

    expectUrlChangedFrom: async (previousUrl: string) => {
      await expect(page).not.toHaveURL(previousUrl)
    },

    expectUrlMatches: async (pattern: RegExp) => {
      await expect(page).toHaveURL(pattern)
    },

    openSearch: async () => {
      await searchLink.click()
    },

    clickSeriesLink: async () => {
      await seriesLink.click()
    },

    clickViewAllLink: async () => {
      await viewAllLink.click()
    },
  }
}
