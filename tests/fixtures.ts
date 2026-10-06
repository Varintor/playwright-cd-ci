import { test as base, type Page } from '@playwright/test';

// Part 1.4 solution — a fixture that hands a test a page signed in as the second role.
//
// Usage in a spec:
//   import { test, expect } from './fixtures';
//   test('...', async ({ problemUserPage }) => { ... });
//
// A test may take both `page` (the project's default role) and `problemUserPage`
// (the second role) at the same time — which is the case `test.use()` cannot serve.

type RoleFixtures = {
  problemUserPage: Page;
};

export const test = base.extend<RoleFixtures>({
  problemUserPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/problem.json',
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export { expect } from '@playwright/test';
