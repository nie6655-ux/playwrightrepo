import { test, expect } from '../../fixtures/pageFixtures';
import { ENV } from '../../utils/env';

test('Verify valid login', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();

    console.log('Fixture page URL:', page.url());
    console.log('LoginPage URL:', loginPage.page.url());

    await loginPage.login( ENV.USERNAME, ENV.PASSWORD);

    console.log('After login - Fixture page:', page.url());
    console.log('After login - LoginPage:', loginPage.page.url());

    await page.waitForURL('**/inventory.html');
    await expect(page).toHaveURL(/inventory\.html/);
});