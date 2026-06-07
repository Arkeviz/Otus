import { fileURLToPath, URL } from 'node:url'
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

// Configure Vitest (https://vitest.dev/config/)
export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: false,
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

  // https://vitejs.dev/config/shared-options.html#resolve-alias
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
