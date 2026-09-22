import type { Browser } from 'playwright'
import type { CustomWorld } from './world'
import process from 'node:process'
import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber'
import { chromium } from 'playwright'

const BASE_URL = process.env.SAUCEDEMO_URL ?? 'https://www.saucedemo.com'

let browser: Browser

BeforeAll(async () => {
  browser = await chromium.launch({ headless: !process.env.HEADED })
})

Before(async function (this: CustomWorld) {
  // Новый BrowserContext на каждый сценарий = чистые cookies и localStorage = изоляция.
  this.browser = browser
  this.context = await browser.newContext({ baseURL: BASE_URL })
  const page = await this.context.newPage()
  this.initPageObjects(page)
})

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot()
    this.attach(screenshot, 'image/png')
  }
  await this.context.close()
})

AfterAll(async () => {
  await browser.close()
})
