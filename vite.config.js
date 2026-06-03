/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

// Configure Vitest (https://vitest.dev/config/)
export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    tags: [
      {
        name: 'Задание-5',
        description: 'Unit-тесты обычных функций',
      },
      {
        name: 'Задание-6',
        description: 'Unit-тесты API',
      },
      {
        name: 'Задание-8',
        description: 'Unit-тесты API',
      },
    ],
  },
})
