import { Page, Locator } from '@playwright/test';
import { NavBar } from './components/NavBar';

// Task 2 solution — the cart at /cart.html.

export class CartPage {
  readonly nav: NavBar;

  constructor(private readonly page: Page) {
    this.nav = new NavBar(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  items(): Locator {
    return this.page.locator('.cart_item');
  }

  itemNames(): Locator {
    return this.page.locator('.inventory_item_name');
  }
}
