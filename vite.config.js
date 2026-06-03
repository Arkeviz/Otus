/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

// Configure Vitest (https://vitest.dev/config/)
export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    tags: [
      {
        name: 'Task-5',
        description: 'Unit-тесты обычных функций',
      },
      {
        name: 'Task-6',
        description: 'Unit-тесты API',
      },
      {
        name: 'Task-8',
        description: 'Unit-тесты API',
      },
    ],
  },
})
