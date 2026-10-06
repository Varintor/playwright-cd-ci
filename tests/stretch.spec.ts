import { test, expect } from '@playwright/test';

// Part 4 stretch solutions — one worked answer for each of the three options.
// These tests rely on the stored session, so they contain no login steps.

test('a footer link opens in a new tab', async ({ page, context }) => {
  await page.goto('/inventory.html');

  // Start waiting BEFORE the click: the tab may open faster than the next line runs.
  const pagePromise = context.waitForEvent('page');

  // saucedemo's footer links are named after the networks: X, Facebook, LinkedIn.
  await page.getByRole('link', { name: 'LinkedIn' }).click();

  const popup = await pagePromise;

  // Assert on the URL the tab was opened with; loading a third-party site is not the subject
  // of this test, and waiting for it makes the test slow and flaky.
  await expect(popup).toHaveURL(/linkedin\.com\/company\/sauce-labs/);
});

test('the catalogue still functions with every image blocked', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,svg,webp}', route => route.abort());

  await page.goto('/inventory.html');

  await expect(page.getByText('Products')).toBeVisible();
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('the loading state is visible while the response is delayed', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await route.fulfill({ json: [{ name: 'Strawberry', id: 21 }] });
  });

  await page.goto('https://demo.playwright.dev/api-mocking', { waitUntil: 'commit' });

  // The delay is what makes this assertion possible at all.
  await expect(page.getByText('Loading...')).toBeVisible();

  // And the data still arrives afterwards.
  await expect(page.getByText('Strawberry')).toBeVisible();
});
