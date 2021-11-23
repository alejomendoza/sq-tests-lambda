/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  preset: 'jest-puppeteer',
  testTimeout: 30000,
  globals: { SITE_URL: 'http://localhost:3000' },
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = config;
