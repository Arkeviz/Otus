import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class SearchWidget {
  readonly page: Page

  readonly input: Locator
  readonly suggestedSectionTitle: Locator
  readonly movieCards: Locator
  readonly movieTitles: Locator
  readonly personNames: Locator

  constructor(page: Page) {
    this.page = page

    this.input = page.locator('#search-widget')
    this.suggestedSectionTitle = page.locator(
      '.search-widget__section-title--movies',
    )
    this.movieCards = page.locator('.search-widget-movie')
    this.movieTitles = page.locator('.search-widget-movie__title')
    this.personNames = page.locator('.search-widget-person__name')
  }

  async expectOpenWithEmptyState() {
    await expect(this.input).toBeVisible()
    await expect(this.input).toHaveValue('')
    await expect(this.input).toHaveAttribute(
      'placeholder',
      /Название/,
    )
    await expect(this.suggestedSectionTitle).toHaveText(/Часто ищут/)
    await expect(this.movieCards.first()).toBeVisible()
    await expect(this.movieCards).not.toHaveCount(0)
  }

  async searchFor(query: string) {
    await this.input.fill(query)

    // Запускаем поиск и ждём ответ
    const searchResponse = this.page.waitForResponse(
      response =>
        response.url().toLowerCase().includes('search')
        && response.status() === 200,
    )
    await this.input.press('Enter')
    await searchResponse
  }

  async expectHasMovieResults() {
    await expect(this.movieTitles.first()).toBeVisible()
    const firstMovieTitle = await this.movieTitles.first().textContent()
    expect(firstMovieTitle?.trim().length).toBeGreaterThan(0)
  }

  async expectHasPersonResults() {
    await expect(this.personNames.first()).toBeVisible()
    const firstPersonName = await this.personNames.first().textContent()
    expect(firstPersonName?.trim().length).toBeGreaterThan(0)
  }
}
