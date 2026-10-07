import { test, expect } from '../../fixtures/pageFixtures';
import { ENV } from '../../utils/env';

test.describe('Login Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigateToLogin();
    });

    test('Verify login is successful for valid credentials', async ({ loginPage, page }) => {
        
        await test.step('Login with valid credentials', async () => {
            await loginPage.login( ENV.USERNAME, ENV.PASSWORD);
        });
        
        await test.step('Verify user is redirected to inventory page', async () => {
            await expect(page).toHaveURL(/inventory\.html/);
        });

    });

    test('Verify login fails for locked out user', async ({loginPage}) => {

        await test.step('Login with locked out user', async () => {
            await loginPage.login(ENV.LOCKED_OUT_USERNAME, ENV.PASSWORD);
        });

        await test.step('Verify error message is displayed', async () => {
            await expect(loginPage.errorMessage).toBeVisible();
            await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
        });
    });
});