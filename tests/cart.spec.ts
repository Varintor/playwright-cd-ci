import { test, expect } from '../fixtures/pages';

// Task 5 solution — the refactored cart spec plus the required NEW test.
// The second test adds ZERO new locators: it only calls methods that already
// exist on InventoryPage, NavBar and CartPage.

test.describe('Cart', () => {
  test('a signed-in user can add a product to the cart', { tag: '@smoke' },
    async ({ signedIn, cartPage }) => {
      await expect(signedIn.title()).toBeVisible();

      await signedIn.addToCart('Sauce Labs Backpack');
      await expect(signedIn.nav.cartBadge()).toHaveText('1');

      await cartPage.open();
      await expect(cartPage.items()).toHaveCount(1);
      await expect(cartPage.itemNames()).toHaveText(['Sauce Labs Backpack']);
    });

  // THE NEW TEST — no new locators.
  //   Given a signed-in user is on the catalogue
  //   When  they add two different products to the cart
  //   Then  the cart badge shows 2 and the cart lists both products
  test('adding two products puts both of them in the cart',
    async ({ signedIn, cartPage }) => {
      await signedIn.addToCart('Sauce Labs Backpack');
      await signedIn.addToCart('Sauce Labs Bike Light');

      await expect(signedIn.nav.cartBadge()).toHaveText('2');

      await cartPage.open();
      await expect(cartPage.items()).toHaveCount(2);
      await expect(cartPage.itemNames()).toHaveText([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
      ]);
    });

  test('the cart can be opened from the navigation bar',
    async ({ signedIn, cartPage }) => {
      await signedIn.addToCart('Sauce Labs Backpack');
      await signedIn.nav.openCart();

      await expect(cartPage.items()).toHaveCount(1);
    });
});
