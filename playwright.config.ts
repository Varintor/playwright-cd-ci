import { defineConfig, devices } from '@playwright/test';

// Part 1.2 solution — the configuration the whole lab depends on.
//
// `setup` runs first and writes .auth/standard.json and .auth/problem.json.
// `chromium` then opens every context with the standard user's session already loaded.

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/standard.json',
      },
      dependencies: ['setup'],
    },
  ],
});
