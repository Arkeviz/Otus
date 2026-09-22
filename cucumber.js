export default {
  import: ['./playwright/bdd/features/step_definitions/**/*.ts', './playwright/bdd/features/support/**/*.ts'],
  paths: ['./playwright/bdd/features/**/*.feature'],
  format: [
    'progress-bar',
    ['html', 'reports/cucumber-report.html'],
  ],
  formatOptions: { snippetInterface: 'async-await' },
}
