/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  preset: 'jest-puppeteer',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = config;
