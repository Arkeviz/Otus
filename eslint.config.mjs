import antfu from '@antfu/eslint-config'

// TODO Заменить ESLint на Oxlint (https://oxc.rs/docs/guide/usage/linter.html),
//  когда выйдет интеграция
export default antfu({
  ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/reports/**', '**/build/**'],
})
