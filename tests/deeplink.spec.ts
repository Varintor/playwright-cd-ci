import { test, expect } from '@playwright/test';

// Part 2 solution — skip the pages that are not the subject of the test.
//
// The stored session (playwright.config.ts → storageState) already removed the login page.
// The same reasoning removes every other page a test walks through but does not test:
//
//   2.1  deep-link straight to the page under test
//   2.2  seed the precondition through the fastest layer the application offers
//   2.3  recognise the point where skipping stops being honest
//
// saucedemo keeps the cart in localStorage under the key `cart-contents`, as an array of
// product ids. That array is this application's "API": it is the fastest layer available.

const BACKPACK = 4;
const BIKE_LIGHT = 0;

test.describe('2.1 — the page under test, opened directly', () => {
  test('the cart page opens with no click-through at all', async ({ page }) => {
    await page.goto('/cart.html');

    await expect(page.getByText('Your Cart')).toBeVisible();
  });

  // The control: the same destination, reached the long way. Compare the two durations in
  // the list reporter — the difference is one page load and one click per test, every test.
  test('the long way round reaches the same page', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('.shopping_cart_link').click();

    await expect(page.getByText('Your Cart')).toBeVisible();
  });
});

test.describe('2.2 — the precondition, seeded instead of clicked', () => {
  test('a two-item cart without a single Add to cart click', async ({ page }) => {
    // addInitScript runs before the page's own scripts, on every navigation in this context.
    await page.addInitScript(
      items => window.localStorage.setItem('cart-contents', JSON.stringify(items)),
      [BACKPACK, BIKE_LIGHT],
    );

    await page.goto('/cart.html');

    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  // The pay-off: the test's subject is the checkout summary, so everything before it is setup.
  test('the order total is correct for a seeded cart', async ({ page }) => {
    await page.addInitScript(
      items => window.localStorage.setItem('cart-contents', JSON.stringify(items)),
      [BACKPACK, BIKE_LIGHT],
    );

    await page.goto('/checkout-step-one.html');

    await page.locator('#first-name').fill('Ada');
    await page.locator('#last-name').fill('Lovelace');
    await page.locator('#postal-code').fill('50200');
    await page.locator('#continue').click();

    await expect(page.locator('.summary_total_label')).toHaveText('Total: $43.18');
  });
});

test.describe('2.3 — where skipping stops being honest', () => {
  // This test is GREEN and WORTHLESS, and that is the lesson. The overview page is reachable
  // with an empty cart, so "the user can complete an order" is asserted about an order of
  // nothing. Skipping is only legitimate for pages the test does not claim anything about.
  test('an order of nothing completes happily — a green test that proves nothing', async ({ page }) => {
    await page.goto('/checkout-step-two.html');

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $0.00');

    await page.locator('#finish').click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // The honest version of the same journey: the cart is a real precondition, so it is seeded,
  // and every page the test makes a claim about is actually visited.
  test('the honest version asserts on an order that exists', async ({ page }) => {
    await page.addInitScript(
      items => window.localStorage.setItem('cart-contents', JSON.stringify(items)),
      [BACKPACK],
    );

    await page.goto('/checkout-step-one.html');

    await page.locator('#first-name').fill('Ada');
    await page.locator('#last-name').fill('Lovelace');
    await page.locator('#postal-code').fill('50200');
    await page.locator('#continue').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39');

    await page.locator('#finish').click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});

// The counter-example, kept as a test so the limit is visible in the report: the deep link
// only works because the session is stored. Signed out, the application refuses it.
test('2.4 — a deep link without a session is refused', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/cart.html');

  await expect(page.locator('[data-test="error"]'))
    .toHaveText("Epic sadface: You can only access '/cart.html' when you are logged in.");

  await context.close();
});
