import { beforeAll, test, afterAll } from '@jest/globals';
import { Browser, BrowserContext, Page } from 'puppeteer';
let chromium: any;
let puppeteer: any;
let browser: Browser;

if (!process.env.PRODUCTION) {
  puppeteer = require('puppeteer');
} else {
  chromium = require('chrome-aws-lambda');
  puppeteer = chromium.puppeteer;
}

async function launchPuppeteer() {
  if (!process.env.PRODUCTION) {
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
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }
}

const SITE_URL = 'https://sq-royale-test.vercel.app/';
const unregisteredDiscordToken = '1nVen6FYPzD6ZQo4Mh9krxp1jzLrLR';
const registeredDiscordToken = 'IffcOePJkKqsNRiw5ib3zYrgniNQps';

beforeAll(async () => {
  await launchPuppeteer();
});

afterAll(() => {
  browser.close();
});

describe('Logged out Pages', () => {
  let context: BrowserContext;

  beforeAll(async () => {
    context = await browser.createIncognitoBrowserContext();
  });

  afterAll(() => {
    context.close();
  });

  test('Renders Home Page', async () => {
    const page = await context.newPage();
    await page.goto(SITE_URL);
    const headerTitle = 'header>div>h1>span';
    await page.waitForSelector(headerTitle);

    const header = await page.$eval(headerTitle, (e) => e.innerHTML);
    expect(header).toBe(`Stellar Quest`);
    page.close();
  });

  test('Renders Sign Up Page', async () => {
    const page = await context.newPage();
    await page.goto(SITE_URL);
    const signupBtn = '[data-testid="signupBtn"]';

    await page.waitForSelector(signupBtn);

    await Promise.all([page.click(signupBtn), page.waitForNavigation()]);

    const header = await page.$eval('header>h1', (e) => e.innerHTML);
    expect(header).toBe(`Sign Up`);
    page.close();
  });

  test('Renders Rules Page', async () => {
    const page = await context.newPage();
    await page.goto(SITE_URL);
    const rulesBtn = '[data-testid="rulesBtn"]';
    const headerSelector = 'header>div>h1>span';

    await page.waitForSelector(rulesBtn);

    await Promise.all([page.click(rulesBtn), page.waitForNavigation()]);

    await page.waitForSelector(headerSelector);

    const header = await page.$eval(headerSelector, (e) => e.innerHTML);
    expect(header).toBe(`Stellar Quest`);
    page.close();
  });

  test('Renders Sign Up page when user attempts to logs in with an unregistered account', async () => {
    const page = await context.newPage();
    await page.goto(SITE_URL);
    const loginBtn = '[data-testid="loginBtn"]';
    const headerSelector = 'header>h1';

    await page.waitForSelector(loginBtn);

    const pageTarget = page.target();

    await page.click(loginBtn);

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );
    const newPage = await newTarget.page();

    if (!newPage) {
      throw 'Did not open discord auth page!';
    }

    await newPage.waitForNavigation();

    const discordTokenState = await page.evaluate(() => {
      return localStorage.getItem('discordTokenState');
    });

    await newPage.goto(
      `${SITE_URL}/login/auth#state=${discordTokenState}&access_token=${unregisteredDiscordToken}`
    );

    await page.waitForSelector(headerSelector);

    const header = await page.$eval(headerSelector, (e) => e.innerHTML);
    expect(header).toBe(`Sign Up`);
    page.close();
  });
});

describe('Authentication', () => {
  let context: BrowserContext;
  let page: Page;
  const loginBtn = '[data-testid="loginBtn"]';
  const logoutBtn = '[data-testid="logoutBtn"]';
  const dashboardNav = '[data-testid="dashboardNav"]';
  const practiceQuestLink = 'section>div:nth-child(2)>a';
  const playBtn = 'div[type="primary"]';

  beforeAll(async () => {
    context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(SITE_URL);
  });

  afterAll(() => {
    page.close();
    context.close();
  });

  test('Log in with Discord Token', async () => {
    await page.waitForSelector(loginBtn);

    const pageTarget = page.target();

    await page.click(loginBtn);

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );
    const newPage = await newTarget.page();

    if (!newPage) {
      throw 'Did not open discord auth page!';
    }

    await newPage.waitForNavigation();

    const discordTokenState = await page.evaluate(() => {
      return localStorage.getItem('discordTokenState');
    });

    await newPage.goto(
      `${SITE_URL}/login/auth#state=${discordTokenState}&access_token=${registeredDiscordToken}`
    );

    await page.waitForSelector(dashboardNav);
    const nav = await page.$eval(dashboardNav, (e) => e.hasChildNodes());

    expect(nav).toBeTruthy();
  });

  test('Start practice Quest', async () => {
    await page.waitForSelector(dashboardNav);

    await page.$eval(dashboardNav, (e) => {
      if (e instanceof HTMLElement) {
        const practiceElement = e.children[1];
        if (practiceElement instanceof HTMLElement) {
          practiceElement.click();
        } else {
          throw 'Practice link does not exist';
        }
      } else {
        throw 'Dashboard nav does not exist';
      }
    });

    await page.waitForSelector(practiceQuestLink);

    await page.$eval(practiceQuestLink, (e) => {
      if (e instanceof HTMLElement) {
        const questLinkElement = e.firstElementChild;
        if (questLinkElement instanceof HTMLElement) {
          questLinkElement.click();
        } else {
          throw 'Quest link does not exist';
        }
      } else {
        throw 'Quest link does not exist';
      }
    });

    await page.waitForSelector(playBtn);

    await page.$eval(playBtn, (e) => {
      if (e instanceof HTMLElement) {
        e.click();
      } else {
        throw 'Play button does not exist';
      }
    });

    await page.waitForTimeout(500);
    await page.waitForSelector(playBtn);

    const verifyBtnPage = await page.$eval(playBtn, (e) => {
      if (e instanceof HTMLElement) {
        return e.firstElementChild?.innerHTML;
      } else {
        throw 'Verify Solution Button does not exist';
      }
    });

    expect(verifyBtnPage).toBe(`Verify Solution`);
  });

  test('Logs user out', async () => {
    await page.$eval(dashboardNav, (e) => {
      if (e instanceof HTMLElement) {
        const settingsElement = e.lastElementChild;
        if (settingsElement instanceof HTMLElement) {
          settingsElement.click();
        } else {
          throw 'Settings link does not exist';
        }
      } else {
        throw 'Dashboard nav does not exist';
      }
    });

    await page.waitForSelector(logoutBtn);

    await Promise.all([page.click(logoutBtn), page.waitForNavigation()]);

    await page.waitForSelector(loginBtn);

    const renderedLoginBtn = await page.$eval(loginBtn, (e) =>
      e.hasChildNodes()
    );

    expect(renderedLoginBtn).toBeTruthy();
  });
});
