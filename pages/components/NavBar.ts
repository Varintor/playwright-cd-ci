import { Page, Locator } from '@playwright/test';

// Task 3 solution — the header bar shared by every signed-in screen.
// Composed into InventoryPage and CartPage as a `nav` field.

export class NavBar {
  constructor(private readonly page: Page) {}

  cartBadge(): Locator {
    return this.page.locator('.shopping_cart_badge');
  }

  async openCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
  }

  async signOut(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
}
