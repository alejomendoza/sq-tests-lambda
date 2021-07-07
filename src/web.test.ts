const slsw = require('serverless-webpack');
let chromium: any;
let puppeteer: any;
let browser: any;
let page: any;

if (slsw.lib.webpack.isLocal) {
  puppeteer = require('puppeteer');
} else {
  chromium = require('chrome-aws-lambda');
  puppeteer = chromium.puppeteer;
}

async function launchPuppeteer() {
  if (slsw.lib.webpack.isLocal) {
    browser = await puppeteer.launch();
  } else {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }
  page = await browser.newPage();
  await page.goto(SITE_URL);
}

const SITE_URL = 'https://sq-royale-test.vercel.app/';

// export async function runTests() {
beforeAll(async () => {
  await launchPuppeteer();
});

test('Renders Stellar Quest Logo', async () => {
  await page.waitForSelector('#root');

  const header = await page.$eval(
    'header>div>h1>span',
    (e: any) => e.innerHTML
  );
  expect(header).toBe(`Stellar Quest`);
});

afterAll(() => {
  browser.close();
});
// }
