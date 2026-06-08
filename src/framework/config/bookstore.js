export const config = Object.freeze({
  baseURL: import.meta.env.TEST_BOOKSTORE_API_URL ?? 'https://bookstore.demoqa.com',
  userId: import.meta.env.TEST_BOOKSTORE_USER_ID,
  username: import.meta.env.TEST_BOOKSTORE_USERNAME,
  password: import.meta.env.TEST_BOOKSTORE_PASSWORD,
  passwordForTestUsers: 't3St-p@ssWor6!',
})
