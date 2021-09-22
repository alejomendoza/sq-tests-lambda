import { beforeAll, test, afterAll } from '@jest/globals';
import { Browser, BrowserContext, Page } from 'puppeteer';

let chromium: any;
let puppeteer: any;
let browser: Browser;

if (process.env.PRODUCTION) {
  chromium = require('chrome-aws-lambda');
  puppeteer = chromium.puppeteer;
} else {
  puppeteer = require('puppeteer');
}

const setupBrowser = async () => {
  if (!browser) {
    if (process.env.PRODUCTION) {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteer.launch({
        args: [
          '--allow-running-insecure-content',
          '--autoplay-policy=user-gesture-required',
          '--disable-component-update',
          '--disable-domain-reliability',
          '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
          '--disable-print-preview',
          '--disable-setuid-sandbox',
          '--disable-site-isolation-trials',
          '--disable-speech-api',
          '--disable-web-security',
          '--disk-cache-size=33554432',
          '--enable-features=SharedArrayBuffer',
          '--hide-scrollbars',
          '--ignore-gpu-blocklist',
          '--in-process-gpu',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-pings',
          '--no-sandbox',
          '--no-zygote',
          '--use-gl=swiftshader',
        ],
        headless: true,
      });
    }
  }
};

const SITE_URL = 'https://sq-royale-test.vercel.app';
const unregisteredDiscordToken = 'pR9FlM39zGLfdwHgKZiCRxJ4nLQVGl';
const registeredDiscordToken = 'GKeRE0ZgaGFeShZYy4o9Wj3Zm2i1hN';

const generateAuthUrl = (state: string, token: string) =>
  `${SITE_URL}/login/auth#state=${state}&access_token=${token}`;

beforeAll(async () => {
  await setupBrowser();
});

afterAll(async () => {
  await browser.close();
});

describe('Logged out Pages', () => {
  let page: Page;

  beforeAll(async () => {
    page = await browser.pages().then((pages) => pages[0]);
  });

  afterAll(async () => {
    await page.close();
  });

  test('Renders Home Page', async () => {
    const headerTitle = 'header>div>h1>span';

    await page.goto(SITE_URL);
    await page.waitForSelector(headerTitle);

    const header = await page.$eval(headerTitle, (e) => e.innerHTML);
    expect(header).toBe(`Stellar Quest`);
  });

  test('Renders Sign Up Page', async () => {
    const signupBtn = '[data-testid="signupBtn"]';

    await page.goto(SITE_URL);
    await page.waitForSelector(signupBtn);

    await Promise.all([page.click(signupBtn), page.waitForNavigation()]);

    const header = await page.$eval('header>h1', (e) => e.innerHTML);
    expect(header).toBe(`Sign Up`);
  });

  test('Renders Rules Page', async () => {
    const rulesBtn = '[data-testid="rulesBtn"]';
    const headerSelector = 'header>div>h1>span';

    await page.goto(SITE_URL);
    await page.waitForSelector(rulesBtn);

    await Promise.all([page.click(rulesBtn), page.waitForNavigation()]);

    await page.waitForSelector(headerSelector);

    const header = await page.$eval(headerSelector, (e) => e.innerHTML);
    expect(header).toBe(`Stellar Quest`);
  });

  test('Renders Sign Up page when user attempts to logs in with an unregistered account', async () => {
    const loginBtn = '[data-testid="loginBtn"]';
    const headerSelector = 'header>h1';

    await page.goto(SITE_URL);
    await page.waitForSelector(loginBtn);

    const pageTarget = page.target();

    await page.click(loginBtn);

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );

    const newPage = await newTarget.page();

    if (!newPage) throw 'Did not open discord auth page!';

    const discordTokenState = await page.evaluate(() => {
      return localStorage.getItem('discordTokenState');
    });

    if (!discordTokenState) throw 'Did not set discordTokenState!';

    await newPage.goto(
      generateAuthUrl(discordTokenState, unregisteredDiscordToken)
    );

    await page.waitForSelector(headerSelector);
    const header = await page.$eval(headerSelector, (e) => e.innerHTML);
    expect(header).toBe(`Sign Up`);
  });
});

describe('Authentication', () => {
  let context: BrowserContext;
  let page: Page;
  const loginBtn = '[data-testid="loginBtn"]';
  const logoutBtn = '[data-testid="logoutBtn"]';
  const dashboardNav = '[data-testid="dashboardNav"]';
  const practiceQuestLink = '[data-testid="questCard"]';
  const playBtn = '[data-testid="playBtn"]';
  const verifyBtn = '[data-testid="verifyBtn"]';

  beforeAll(async () => {
    context = await browser.createIncognitoBrowserContext();
  });

  beforeEach(async () => {
    page = await context.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await context.close();
  });

  test('Log in with Discord Token', async () => {
    await page.goto(SITE_URL);
    await page.waitForSelector(loginBtn);

    const pageTarget = page.target();

    await page.click(loginBtn);

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );
    const newPage = await newTarget.page();

    if (!newPage) throw 'Did not open discord auth page!';

    const discordTokenState = await page.evaluate(() => {
      return localStorage.getItem('discordTokenState');
    });

    if (!discordTokenState) throw 'Did not set discordTokenState!';

    await newPage.goto(
      generateAuthUrl(discordTokenState, registeredDiscordToken)
    );

    await page.waitForSelector(dashboardNav);

    const nav = await page.$eval(dashboardNav, (e) => e.hasChildNodes());
    expect(nav).toBeTruthy();
  });

  test('Start practice Quest', async () => {
    await page.goto(`${SITE_URL}/play`);
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

    await page.waitForSelector(verifyBtn);

    const verifyBtnPage = await page.$eval(verifyBtn, (e) => {
      if (e instanceof HTMLElement) {
        return e.innerHTML;
      } else {
        throw 'Verify Solution Button does not exist';
      }
    });

    expect(verifyBtnPage).toBe(`Verify`);
  });

  test('Logs user out', async () => {
    await page.goto(`${SITE_URL}/play`);
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
