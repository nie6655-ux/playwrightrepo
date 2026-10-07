import { Locator, type Page } from '@playwright/test';
import { ENV } from '../utils/env';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;
    readonly errorMessage: Locator;
    readonly productImageOne: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginBtn = page.getByRole('button', { name: 'Login'});
        this.errorMessage = page.getByText('Epic sadface: Sorry, this user has been locked out.');
        this.productImageOne = page.getByAltText('Sauce Labs Backpack');
    }

    async navigateToLogin() {
        await this.page.goto(ENV.BASE_URL);
    }

    async login(user: string, pass: string) {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginBtn.click();
    }
}