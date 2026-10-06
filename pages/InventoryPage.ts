import { Page, Locator } from '@playwright/test';
import { NavBar } from './components/NavBar';

// Task 2 solution — the product catalogue at /inventory.html.
// addToCart() is parameterised, so one method covers every product.

export class InventoryPage {
  readonly nav: NavBar;

  constructor(private readonly page: Page) {
    this.nav = new NavBar(page);
  }

  title(): Locator {
    return this.page.getByText('Products');
  }

  async addToCart(product: string): Promise<void> {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: product })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  products(): Locator {
    return this.page.locator('.inventory_item');
  }
}
