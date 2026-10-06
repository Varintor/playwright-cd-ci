import { test, expect } from '@playwright/test';

// Think first #5 solution — the specs whose subject IS the login page must NOT inherit
// the stored session, or they open the site already signed in and assert nothing.
//
// This one line overrides the project-level storageState for the whole file.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Swag Labs login page, signed out', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('presents the sign-in form', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
  });

  test('a standard user can sign in', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('an invalid password shows an error message', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match any user in this service');
    await expect(page).not.toHaveURL(/inventory/);
  });
});
