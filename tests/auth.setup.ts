import { test as setup, expect } from '@playwright/test';

// Part 1.2 and 1.4 solution — the completed skeleton.
//
// Selected by playwright.config.ts with { name: 'setup', testMatch: /.*\.setup\.ts/ },
// and run before every other project through `dependencies: ['setup']`.
//
// Both paths are relative to the project root (the working directory of the run).

const standardFile = '.auth/standard.json';
const problemFile = '.auth/problem.json';

setup('authenticate as standard_user', async ({ page }) => {
  // Given — the login page (baseURL is https://www.saucedemo.com)
  await page.goto('/');

  // When — sign in with the standard account
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Then — prove the login worked before saving anything.
  await expect(page.getByText('Products')).toBeVisible();

  // Finally — write the cookies and localStorage of this context to disk.
  await page.context().storageState({ path: standardFile });
});

setup('authenticate as problem_user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('problem_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products')).toBeVisible();

  await page.context().storageState({ path: problemFile });
});
