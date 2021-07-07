const slsw = require('serverless-webpack');
import { beforeAll, test, afterAll } from '@jest/globals';
import { Browser, Page } from 'puppeteer';
let chromium: any;
let puppeteer: any;
let browser: Browser;
let page: Page;

if (slsw.lib.webpack.isLocal) {
  puppeteer = require('puppeteer');
} else {
  chromium = require('chrome-aws-lambda');
  puppeteer = chromium.puppeteer;
}

async function launchPuppeteer() {
  if (slsw.lib.webpack.isLocal) {
    if (!browser) {
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        headless: true,
      });
    }
  } else {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }
}

async function openIncognitoWindow() {
  page = await browser.newPage();
  await page.goto(SITE_URL);
}

const SITE_URL = 'https://sq-royale-test.vercel.app/';

beforeAll(async () => {
  await launchPuppeteer();
  await openIncognitoWindow();
});

test('Renders Home Page', async () => {
  await page.waitForSelector('#root');

  const header = await page.$eval(
    'header>div>h1>span',
    (e: any) => e.innerHTML
  );
  expect(header).toBe(`Stellar Quest`);
});

test('Renders Sign Up Page', async () => {
  await page.waitForSelector('#root');

  await Promise.all([
    page.click('[data-testid="signupBtn"]'),
    page.waitForNavigation(),
  ]);

  const header = await page.$eval('header>h1', (e: any) => e.innerHTML);
  expect(header).toBe(`Sign Up`);
});

// test('Renders Rules Page', async () => {
//   await page.waitForSelector('#root');

//   await Promise.all([
//     page.click('[data-testid="rulesBtn"]'),
//     page.waitForNavigation(),
//   ]);

//   const header = await page.$eval(
//     'header>div>h1>span',
//     (e: any) => e.innerHTML
//   );
//   expect(header).toBe(`Stellar Quest`);
// });

// test('Opens Discord Auth Page', async () => {
//   await page.waitForSelector('#root');

//   await Promise.all([
//     page.click('[data-testid="loginBtn"]'),
//     page.waitForNavigation(),
//   ]);

//   const [tabOne, tabTwo] = await browser.pages();

//   expect(tabTwo).toBeTruthy();
// });

afterAll(() => {
  browser.close();
});
