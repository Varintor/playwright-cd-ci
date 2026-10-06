import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

// Task 4 solution — one file provides page objects to every spec.
// `signedIn` is a COMPOSED fixture: it depends on loginPage and inventoryPage,
// so Playwright builds those first and only for the tests that ask for it.

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  signedIn: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  signedIn: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.signIn('standard_user', 'secret_sauce');
    await use(inventoryPage);
    // anything after use(...) is teardown; it runs even when the test fails
  },
});

export { expect } from '@playwright/test';
