import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Модалка поиска
 */
export function createSearchWidget(page: Page) {
  const root = page.locator('.search-widget__content')
  const input = page.locator('#search-widget')
  const closeIcon = page.locator('.search-widget__close-icon')
  const suggestedSectionTitle = page.locator(
    '.search-widget__section-title--movies',
  )
  const actorsSectionTitle = page.locator(
    '.search-widget__section-title--actors',
  )
  const movieCards = page.locator('.search-widget-movie')
  const movieTitles = page.locator('.search-widget-movie__title')
  const personNames = page.locator('.search-widget-person__name')
  const personPositions = page.locator('.search-widget-person__position')

  return {
    root,
    input,
    closeIcon,
    suggestedSectionTitle,
    actorsSectionTitle,
    movieCards,
    movieTitles,
    personNames,
    personPositions,

    expectOpenWithEmptyState: async () => {
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('')
      await expect(input).toHaveAttribute('placeholder', /Название фильма/)
      await expect(suggestedSectionTitle).toHaveText(/Часто ищут/)
      await expect(movieCards.first()).toBeVisible()
      await expect(movieCards).not.toHaveCount(0)
    },

    searchFor: async (query: string) => {
      await input.fill(query)

      const searchResponse = page.waitForResponse(
        response =>
          response.url().toLowerCase().includes('search')
          && response.status() === 200,
      )
      await input.press('Enter')
      await searchResponse
    },

    close: async () => {
      await closeIcon.click()
    },

    expectClosed: async () => {
      await expect(root).toBeHidden()
    },

    expectHasMovieResults: async () => {
      await expect(movieTitles.first()).toBeVisible()
      const firstMovieTitle = await movieTitles.first().textContent()
      expect(firstMovieTitle?.trim().length).toBeGreaterThan(0)
    },

    expectHasPersonResults: async () => {
      await expect(personNames.first()).toBeVisible()
      const firstPersonName = await personNames.first().textContent()
      expect(firstPersonName?.trim().length).toBeGreaterThan(0)
    },

    openMovieCard: async (index = 0) => {
      await movieCards.nth(index).click()
    },
  }
}
