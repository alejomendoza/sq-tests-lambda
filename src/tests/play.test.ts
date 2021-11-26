describe('Practice Play Page', () => {
  beforeAll(async () => {
    await page.goto(SITE_URL);

    await page.evaluate((authToken) => {
      localStorage.setItem('sq:auth_token', authToken);
    }, AUTH_TOKEN);

    await page.goto(SITE_URL, { waitUntil: 'networkidle0' });
    await page.goto(SITE_URL + '/play', { waitUntil: 'networkidle0' });
  });

  beforeEach(async () => {
    await expect(page).toClick('a', { text: 'Play' });
    await expect(page).toMatch('Educational');
  });

  test('Render Play Page', async () => {
    await expect(page).toMatch('Educational');
  });

  test('Start Educational Quest', async () => {
    await expect(page).toClick('a', { text: 'Quest 1' });
    await expect(page).toClick('button', { text: 'Play' });
    await expect(page).toMatchElement('button', { text: 'Verify' });
  });

  test('Start Playground Quest', async () => {
    await expect(page).toClick({
      type: 'xpath',
      value: '//img[@src[contains(., "v=4")]]',
    } as any);

    await expect(page).toClick('button', { text: 'Register' });
    await expect(page).toMatchElement('button', { text: 'Registered!' });

    const user = await page
      .evaluate(() => {
        return localStorage.getItem('sq:current_user');
      })
      .then((user) => (user ? JSON.parse(user) : null));

    if (!user) 'No user found while starting playground quest!';

    const username = user.discord.username;

    await expect(page).toMatchElement({
      type: 'xpath',
      value: `//img[@title="${username}"]`,
    } as any);
  });
});
