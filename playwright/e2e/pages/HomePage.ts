import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class HomePage {
  readonly page: Page

  readonly heroHeading: Locator
  readonly heroCtaButton: Locator
  readonly searchLink: Locator
  readonly seriesLink: Locator
  readonly viewAllLink: Locator

  constructor(page: Page) {
    this.page = page

    this.heroHeading = page.getByRole('heading', {
      name: /Самые сочные премьеры кино/i,
    })
    this.heroCtaButton = page.getByRole('button', {
      name: 'Смотреть бесплатно',
    })
    this.searchLink = page.getByRole('link', { name: 'Поиск' })
    this.seriesLink = page.getByRole('link', { name: 'Сериалы' })
    this.viewAllLink = page.getByRole('link', { name: 'Посмотреть всё' })
  }

  async goto() {
    await this.page.goto('/')
  }

  genreHeading(genre: string): Locator {
    return this.page.getByText(genre, { exact: true })
  }

  async expectHeroVisible() {
    await expect(this.heroHeading).toBeVisible()
    await expect(this.heroCtaButton).toBeVisible()
  }

  async expectGenreVisible(genre: string) {
    await expect(this.genreHeading(genre)).toBeVisible()
  }

  async openSearch() {
    await this.searchLink.click()
  }

  async clickSeriesLink() {
    await this.seriesLink.click()
  }

  async clickViewAllLink() {
    await this.viewAllLink.click()
  }
}
