import { Locator, type Page } from '@playwright/test';
import { ENV } from '../utils/env';

export class InventoryPage {
    readonly page: Page;
    readonly productImageOne: Locator;
    readonly productImageTwo: Locator;
    readonly productImageThree: Locator;
    readonly productImageFour: Locator;
    readonly productImageFive: Locator;
    readonly productImageSix: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productImageOne = page.getByAltText('Sauce Labs Backpack');
        this.productImageTwo = page.getByAltText('Sauce Labs Bike Light');
        this.productImageThree = page.getByAltText('Sauce Labs Bolt T-Shirt');
        this.productImageFour = page.getByAltText('Sauce Labs Fleece Jacket');
        this.productImageFive = page.getByAltText('Sauce Labs Onesie');
        this.productImageSix = page.getByAltText('Test.allTheThings() T-Shirt (Red)');
    }
}