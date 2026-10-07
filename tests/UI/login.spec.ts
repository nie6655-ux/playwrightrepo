import { test, expect } from '../../fixtures/pageFixtures';
import { ENV } from '../../utils/env';

test.describe('Login Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigateToLogin();
    });

    test('Verify login is successful for valid credentials', async ({ loginPage, page }) => {

    // console.log('Fixture page URL:', page.url());
    // console.log('LoginPage URL:', loginPage.page.url());

       await test.step('Login with valid credentials', async () => {
            await loginPage.login( ENV.USERNAME, ENV.PASSWORD);
        });

    // console.log('After login - Fixture page:', page.url());
    // console.log('After login - LoginPage:', loginPage.page.url());

        await test.step('Verify user is redirected to inventory page', async () => {
            await page.waitForURL('**/inventory.html');
            await expect(page).toHaveURL(/inventory\.html/);
        });

    });

    test('Verify login fails for locked out user', async ({loginPage}) => {

        await test.step('Login with locked out user', async () => {
            await loginPage.login('locked_out_user', ENV.PASSWORD);
        });

        await test.step('Verify error message is displayed', async () => {
            await loginPage.errorMessage.waitFor({ state: 'visible' });
            await expect(loginPage.errorMessage).toBeVisible();
        });
    });
});