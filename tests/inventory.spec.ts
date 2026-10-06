import { test, expect } from './fixtures';

// Part 1.3 and 1.4 solution — the converted suite.
//
// There is no login step anywhere in this file. The session for `page` comes from
// `storageState: '.auth/standard.json'` in playwright.config.ts; the session for
// `problemUserPage` comes from the fixture in ./fixtures.

test.describe('Swag Labs catalogue, signed in', () => {
  test('a signed-in user lands on the catalogue without logging in', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('a signed-in user can add a product to the cart', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // Part 1.4 — the second role, supplied by the fixture.
  test('the problem_user role also starts signed in', async ({ problemUserPage }) => {
    await problemUserPage.goto('https://www.saucedemo.com/inventory.html');

    await expect(problemUserPage.getByText('Products')).toBeVisible();
  });
});
