import { test, expect } from '../fixtures/pages';

// Task 6 solution — the three debugging-clinic specs, repaired and rewritten
// against the project's own page objects and fixtures.
//
// A — stale locator      : '[data-test="add-to-cart-sauce-labs-backpak"]' matched
//                          nothing (typo: "backpak"). Fixed by using the
//                          parameterised InventoryPage.addToCart(), which composes
//                          the locator from the product name.
// B — race condition     : `await locator.textContent()` reads the DOM once, before
//                          the badge exists. Fixed by a retrying web-first
//                          assertion, expect(locator).toHaveText('1').
// C — wrong fixture data : the clinic fixture signed in as `locked_out_user`, so the
//                          run never left the login page. Fixed by using the
//                          project's `signedIn` fixture (standard_user).

test.describe('Debugging clinic — repaired', () => {
  // A
  test('a product can be added to the cart from the catalogue',
    async ({ signedIn }) => {
      await signedIn.addToCart('Sauce Labs Backpack');

      await expect(signedIn.nav.cartBadge()).toHaveText('1');
    });

  // B
  test('the cart badge counts the products added', async ({ signedIn }) => {
    await signedIn.addToCart('Sauce Labs Backpack');

    // retrying assertion, not a one-shot textContent() read
    await expect(signedIn.nav.cartBadge()).toHaveText('1');
  });

  // C
  test('a signed-in user sees the product catalogue', async ({ signedIn, page }) => {
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(signedIn.title()).toBeVisible();
    await expect(signedIn.products()).toHaveCount(6);
  });
});
