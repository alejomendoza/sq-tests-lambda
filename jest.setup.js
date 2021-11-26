const expectPuppeteer = require('expect-puppeteer');
global.AUTH_TOKEN = JSON.stringify(process.env.AUTH_TOKEN);

expectPuppeteer.setDefaultOptions({ timeout: 10000 });
