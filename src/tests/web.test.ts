const unregisteredDiscordToken = 'pR9FlM39zGLfdwHgKZiCRxJ4nLQVGl';
const registeredDiscordToken = 'v5dgtiQi7BhcFwsg0Um6f7ZYKUoKwD';

const generateAuthUrl = (state: string, token: string) =>
  `${SITE_URL}/login/auth#state=${state}&access_token=${token}`;

describe('Logged out Pages', () => {
  test('Renders Home Page', async () => {
    await page.goto(SITE_URL);
    await expect(page).toMatch('Learn Stellar');
  });

  test('Renders Sign Up Page', async () => {
    await page.goto(SITE_URL);
    await expect(page).toClick('a', { text: 'Sign Up' });
    await expect(page).toMatch('Full Name');
  });

  test('Renders Rules Page', async () => {
    await page.goto(SITE_URL);
    await expect(page).toClick('a', { text: 'Rules' });
    await expect(page).toMatch('Stellar Quest');
  });

  test('Renders Sign Up page when user attempts to logs in with an unregistered account', async () => {
    await page.goto(SITE_URL);
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
});

describe.skip('Authentication', () => {
  test('Log in with Discord Token', async () => {
    await page.goto(SITE_URL);
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

    await expect(page).toMatch('Play');
  });

  test('Start practice Quest', async () => {
    await page.goto(`${SITE_URL}/play`);
    await expect(page).toClick('a', { text: 'Quest 1' });
    await expect(page).toClick('button', { text: 'Play' });

    await expect(page).toMatch('Verify');
  });

  test('Logs user out', async () => {
    await page.goto(`${SITE_URL}/profile`);

    await expect(page).toClick('button', {
      text: 'Log Out',
      visible: true,
    });

    await expect(page).toMatch('Learn Stellar');
  });
});
