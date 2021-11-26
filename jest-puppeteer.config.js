require('dotenv/config');

const isLocal = process.env.ENVIRONMENT === 'DEVELOPMENT';

module.exports = {
  ...(!isLocal && {
    server: {
      command: 'cd ../app && yarn preview',
      port: 3000,
    },
  }),
  launch: {
    args: [
      '--no-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
    ],
  },
  browserContext: 'incognito',
};
