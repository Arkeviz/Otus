import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

// Configure Vitest (https://vitest.dev/config/)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.warn('ENVENVENV', env)

  return {
    test: {
      /* for example, use global to avoid globals imports (describe, test, expect): */
      globals: false,
      testTimeout: 10_000,
      env,

      reporter: env.GITHUB_ACTIONS === 'true'
        ? ['default', 'html', 'github-actions']
        : ['default', 'html'],
      outputFile: './reports/index.html',

      tags: [
        {
          name: 'Task-5',
          description: 'Unit-тесты обычных функций',
        },
        {
          name: 'Task-6',
          description: 'Unit-тесты API работы с пользователем',
        },
        {
          name: 'Task-8',
          description: 'Unit-тесты API работы с пользователем',
        },
        {
          name: 'Task-9',
          description: 'Unit-тесты API работы с книгами',
        },
      ],
    },

    // https://vitejs.dev/config/shared-options.html#resolve-alias
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
