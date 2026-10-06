import { type Page, expect } from '@playwright/test';

// Shared Given-steps. Keeping them here keeps every test body focused on the
// behaviour under test. Requires baseURL and testIdAttribute in playwright.config.ts.

export async function signIn(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
}

export async function signInAndAddBackpack(page: Page): Promise<void> {
  await signIn(page);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
}
