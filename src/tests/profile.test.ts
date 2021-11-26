describe('Profile Page', () => {
  beforeAll(async () => {
    await page.goto(SITE_URL);

    await page.evaluate((authToken) => {
      localStorage.setItem('sq:auth_token', authToken);
    }, AUTH_TOKEN);

    await page.goto(SITE_URL);
    await expect(page).toMatchElement('a', { text: 'Play' });
  });

  beforeEach(async () => {
    await page.goto(SITE_URL + '/profile', { waitUntil: 'networkidle0' });
  });

  test('Render Profile Page', async () => {
    await expect(page).toMatch('Your Profile Settings');
  });

  test('View badges', async () => {
    await expect(page).toClick('button', { text: 'View Your Badges' });

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === page.target()
    );

    const newPage = await newTarget.page();

    if (!newPage) throw 'Albedo badge view did not open!';

    await newPage.close();
  });

  test('Change wallet - Continue', async () => {
    await expect(page).toClick('button', { text: 'Wallet' });
    await expect(page).toClick('button', { text: 'Continue' });

    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === page.target()
    );

    const newPage = await newTarget.page();

    if (!newPage) throw 'Albedo change wallet did not open!';

    await newPage.close();
  });

  test('Change wallet - Cancel', async () => {
    await expect(page).toClick('button', { text: 'Wallet' });
    await expect(page).toClick('button', { text: 'Cancel' });
  });

  test('Complete KYC', async () => {
    await expect(page).toClick('button', { text: 'Complete KYC' });
    const iframe = await expect(page).toMatchElement('iframe');
    const content = await iframe.contentFrame();

    await expect(content).toClick({
      type: 'xpath',
      value: '//button[@data-test-leave-session-button]',
    } as any);
    await expect(content).toClick('button', { text: 'Exit' });
    await expect(page).not.toMatchElement('iframe');
  });

  test('Tax Forms - Alerts', async () => {
    const w9Alert = await expect(page).toDisplayDialog(
      async () => await expect(page).toClick('button', { text: 'W-9 Form' })
    );

    await w9Alert.dismiss();

    const w8Alert = await expect(page).toDisplayDialog(
      async () => await expect(page).toClick('button', { text: 'W-8BEN Form' })
    );

    await w8Alert.dismiss();

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      expect(page).toClick('button', { text: 'Tax Form' }),
    ]);

    if (!fileChooser) throw 'Upload window did not open!';

    await fileChooser.cancel();
  });

  test('Log user out', async () => {
    await expect(page).toClick('button', { text: 'Log Out' });
    await expect(page).toMatch('Learn Stellar');
  });
});
