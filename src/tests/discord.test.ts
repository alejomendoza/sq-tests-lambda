const unregisteredDiscordToken = 'pR9FlM39zGLfdwHgKZiCRxJ4nLQVGl';
const registeredDiscordToken = 'v5dgtiQi7BhcFwsg0Um6f7ZYKUoKwD';

const generateAuthUrl = (state: string, token: string) =>
  `${SITE_URL}/login/auth#state=${state}&access_token=${token}`;

describe('Discord Login', () => {
  beforeEach(async () => {
    await page.goto(SITE_URL, { waitUntil: 'networkidle0' });
  });

  test('Redirect to Sign Up when logging in with an unregistered account', async () => {
    await expect(page).toClick('button', { text: 'Log In' });

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === page.target()
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

    await expect(page).toMatch('Full Name');
  });

  test('Log in with Discord Token', async () => {
    await expect(page).toClick('button', { text: 'Log In' });

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === page.target()
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

    await expect(page).toMatch('Educational');
  });
});
