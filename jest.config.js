/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  preset: 'jest-puppeteer',
  testTimeout: 30000,
  globals: {
    SITE_URL: 'http://localhost:3000',
    // TODO: Get an authToken from a registered account.
    AUTH_TOKEN: JSON.stringify('AUTH_TOKEN'),
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = config;
