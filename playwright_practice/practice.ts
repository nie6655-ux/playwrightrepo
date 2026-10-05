import { test, expect } from '@playwright/test';

test('test search feature', async ({ page }) => {
  await page.goto('https://shop.example.com/search');

  // Fill search input
  await page.getByPlaceholder('Search products...').fill('Mechanical Keyboard');

  // Wait for loading spinner to disappear
  await expect(page.locator('div.spinner')).toBeHidden();

  // Target specific card and click button
  const targetCard = page
    .locator('.product-card')
    .filter({ hasText: 'RGB Mechanical Keyboard' });

  await targetCard.getByRole('button', { name: 'Add to Wishlist' }).click();

  // Assert toast notification
  await expect(page.getByRole('status')).toHaveText('Added to Wishlist');
});

import { test, expect } from '@playwright/test';

test('test user account settings page', async ({ page }) => {
  await page.goto('https://shop.example.com/account/addresses');
  
  // 1. Locate and click delete on the specific address card
  const addressCard = page.locator('.address-card').filter({ hasText: 'Secondary Address' });
  await addressCard.getByRole('button', { name: 'Delete' }).click();

  // 2. Verify modal heading (Using getByRole or locator text)
  const modal = page.getByRole('dialog');
  await expect(modal.getByRole('heading', { name: 'Confirm Deletion' })).toBeVisible();

  // 3. Select radio option and submit inside the modal
  await modal.getByLabel('No longer needed').check();
  await modal.getByRole('button', { name: 'Confirm Delete' }).click();

  // 4. Assert modal closes and success banner appears
  await expect(modal).toBeHidden();
  await expect(page.locator('.alert-success')).toHaveText('Address removed');
});



import { test, expect } from '@playwright/test';

test('test export feature', async ({ page }) => {
  await page.goto('https://shop.example.com/reports');
  const exportBtn = page.getByRole('button', { name: 'Export PDF' });

  // 1. Destructure the popup resolution from Promise.all
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    exportBtn.click() // No semicolon inside the array
  ]);

  // 2. Assert URL and content on the NEW tab context
  await expect(newPage).toHaveURL(/.*reports\/pdf-view/);
  await expect(newPage.getByRole('heading', { name: 'Monthly Summary' })).toBeVisible();
});




import { test, expect } from '@playwright/test';

test('test upload', async ({ page }) => {
  await page.goto('https://admin.example.com/documents');

  // 1. Target file input using getByLabel or locator
  await page.getByLabel('Choose Document').setInputFiles('./sample-doc.pdf');

  // 2. Assert ID element #status text
  await expect(page.locator('#status')).toHaveText('sample-doc.pdf uploaded');

  // 3. Click button
  await page.getByRole('button', { name: 'Submit Document' }).click();

  // 4. Assert success alert using CSS compound class or getByRole
  await expect(page.locator('.alert-success')).toHaveText('Document processed successfully');
});


import { test, expect } from '@playwright/test';

test('test employee management table', async ({page}) => {
    await page.goto('https://admin.example.com/employees');
    const dropdownDept = page.locator('#dept-select');
    await dropdownDept.selectOption('Engineering');

    const userRow = page.getByRole('row').filter({hasText: 'Sarah Connor'});
    await userRow.getByRole('button', {name: 'View Details'}).click();
    await expect(page).toHaveURL(/.*employees\/sarah-connor/);
});


import { test, expect } from '@playwright/test';

test('test user registration', async ({page}) => {
    await page.goto('https://app.example.com/profile/edit');
    const accountRole = page.locator('#role-select');
    await accountRole.selectOption('Administrator');

    const profileUpload = page.locator('#avatar-upload');
    await profileUpload.setInputFiles('./avatar.png');

    await page.getByRole('button', {name: 'Save Profile'}).click();
    await expect(page.locator('#status-message')).toBeVisible();
    await expect(page.locator('#status-message')).toHaveText('Profile updated successfully');
});


import { test, expect } from '@playwright/test';

test('test navigation bar', async ({ page }) => {
  await page.goto('https://app.example.com/dashboard');

  // 1. Hover over the main menu button
  const productsBtn = page.getByRole('button', { name: 'Products' });
  await productsBtn.hover();

  // 2. Assert dropdown visibility
  await expect(page.locator('.dropdown-menu')).toBeVisible();

  // 3. Click link directly (same-tab navigation)
  await page.getByRole('link', { name: 'Inventory' }).click();

  // 4. Assert heading on the updated page
  await expect(page.getByRole('heading', { level: 1, name: 'Inventory Management' })).toBeVisible();
});


import { test, expect } from '@playwright/test';

test('test a table where users can select multiple items', async ({ page }) => {
  await page.goto('https://app.example.com/items');

  // 1. Target row and check the checkbox inside it
  const alphaRow = page.getByRole('row').filter({ hasText: 'Item Alpha' });
  await alphaRow.getByRole('checkbox').check();

  const betaRow = page.getByRole('row').filter({ hasText: 'Item Beta' });
  await betaRow.getByRole('checkbox').check();

  // 2. Click delete button
  await page.getByRole('button', { name: 'Delete Selected' }).click();

  // 3. Assert confirmation text
  await expect(page.locator('#confirm-msg')).toHaveText('2 items deleted');
});