describe('Logged Out Pages', () => {
  beforeEach(async () => {
    await page.goto(SITE_URL, { waitUntil: 'networkidle0' });
  });

  test('Renders Home Page', async () => {
    await expect(page).toMatch('Learn Stellar');
  });

  test('Renders Rules Page', async () => {
    await expect(page).toClick('a', { text: 'Rules' });
    await expect(page).toMatch('Last Updated');
  });

  test('Renders Sign Up Page', async () => {
    await expect(page).toClick('a', { text: 'Sign Up' });
    await expect(page).toMatch('Full Name');
  });
});

describe('Logged In Pages', () => {
  beforeAll(async () => {
    await page.goto(SITE_URL);

    await page.evaluate((authToken) => {
      localStorage.setItem('sq:auth_token', authToken);
    }, AUTH_TOKEN);

    await page.goto(SITE_URL + '/play', { waitUntil: 'networkidle0' });
  });

  beforeEach(async () => {
    await expect(page).toClick('a', { text: 'Play' });
    await expect(page).toMatch('Educational');
  });

  test('Renders Play', async () => {
    await expect(page).toClick('a', { text: 'Play' });
    await expect(page).toMatch('Educational');
  });

  test('Renders Practice Quest', async () => {
    await expect(page).toClick('a', { text: 'Quest 1' });
    await expect(page).toMatchElement('button', { text: 'Play' });
  });

  test('Renders Profile', async () => {
    await expect(page).toClick('a', { text: 'Profile' });
    await expect(page).toMatch('Your Profile Settings');
  });
});
