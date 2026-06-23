/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Ссылка на АПИ книжного магазина */
  readonly VITE_TEST_BOOKSTORE_API_URL?: string
  /** Постоянный тестовый пользователь - ID */
  readonly VITE_TEST_BOOKSTORE_USER_ID?: string
  /** Постоянный тестовый пользователь - юзернейм */
  readonly VITE_TEST_BOOKSTORE_USERNAME?: string
  /** Постоянный тестовый пользователь - пароль */
  readonly VITE_TEST_BOOKSTORE_PASSWORD?: string
  /** Переменная гитхаба, используемая в actions */
  readonly GITHUB_ACTIONS?: string

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
