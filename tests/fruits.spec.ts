import { test, expect } from '@playwright/test';

// Part 3 and Part 4 solution — the completed mocking skeleton.
//
// The application calls fetch('api/v1/fruits') with a RELATIVE url, so the pattern must
// begin with '*/**/' — see Think first #11.

const APP = 'https://demo.playwright.dev/api-mocking';
const FRUITS = '*/**/api/v1/fruits';

test('an empty catalogue lists nothing', async ({ page }) => {
  await page.route(FRUITS, route => route.fulfill({ json: [] }));

  await page.goto(APP);

  await expect(page.getByText('Loading...')).toBeHidden();
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('a single product is listed by name', async ({ page }) => {
  await page.route(FRUITS, route =>
    route.fulfill({ json: [{ name: 'Strawberry', id: 21 }] }),
  );

  await page.goto(APP);

  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByText('Strawberry')).toBeVisible();
});

test('fifty products are all listed', async ({ page }) => {
  const many = Array.from({ length: 50 }, (_, i) => ({ name: `Fruit ${i + 1}`, id: i + 1 }));

  await page.route(FRUITS, route => route.fulfill({ json: many }));

  await page.goto(APP);

  await expect(page.getByRole('listitem')).toHaveCount(50);
});

// Think first #12 — the page never handles the rejected fetch, so it stays on 'Loading...'.
// This test documents the current behaviour and makes the case for fixing it.
test('a server error is not handled by the page', async ({ page }) => {
  await page.route(FRUITS, route =>
    route.fulfill({
      status: 500,
      contentType: 'text/plain',
      body: 'Internal Server Error',
    }),
  );

  await page.goto(APP);

  await expect(page.getByText('Loading...')).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

// Part 4 — a second mocked failure, by a different mechanism.
test('an aborted request leaves the page in the same state', async ({ page }) => {
  await page.route(FRUITS, route => route.abort('failed'));

  await page.goto(APP);

  await expect(page.getByText('Loading...')).toBeVisible();
});

// A control run with no interception: proof that the assertions above only hold
// because the test controls the response.
test('without a mock the real API supplies the data', async ({ page }) => {
  await page.goto(APP);

  await expect(page.getByRole('listitem').first()).toBeVisible();
  await expect(page.getByText('Loading...')).toBeHidden();
});
