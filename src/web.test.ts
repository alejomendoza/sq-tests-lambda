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

async function openSite() {
  const [emptyPage] = await browser.pages();
  if (!emptyPage) {
    page = await browser.newPage();
  } else {
    page = emptyPage;
  }

  await page.goto(SITE_URL);
}

const SITE_URL = 'https://sq-royale-test.vercel.app/';

beforeAll(async () => {
  await launchPuppeteer();
});

beforeEach(async () => {
  await openSite();
});

afterEach(async () => {
  const pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
});

afterAll(() => {
  browser.close();
});

test('Renders Home Page', async () => {
  const headerTitle = 'header>div>h1>span';
  await page.waitForSelector(headerTitle);

  const header = await page.$eval(headerTitle, (e: any) => e.innerHTML);
  expect(header).toBe(`Stellar Quest`);
});

test('Renders Sign Up Page', async () => {
  const signupBtn = '[data-testid="signupBtn"]';

  await page.waitForSelector(signupBtn);

  await Promise.all([page.click(signupBtn), page.waitForNavigation()]);

  const header = await page.$eval('header>h1', (e: any) => e.innerHTML);
  expect(header).toBe(`Sign Up`);
});

test('Opens Discord Auth Page', async () => {
  const loginBtn = '[data-testid="loginBtn"]';

  await page.waitForSelector(loginBtn);

  const pageTarget = page.target();

  await page.click(loginBtn);

  const newTarget = await browser.waitForTarget(
    (target) => target.opener() === pageTarget
  );
  const newPage = await newTarget.page();

  expect(newPage).toBeTruthy();
});

test('Renders Rules Page', async () => {
  const rulesBtn = '[data-testid="rulesBtn"]';

  await page.waitForSelector(rulesBtn);

  await Promise.all([page.click(rulesBtn), page.waitForNavigation()]);

  const header = await page.$eval(
    'header>div>h1>span',
    (e: any) => e.innerHTML
  );
  expect(header).toBe(`Stellar Quest`);
});
