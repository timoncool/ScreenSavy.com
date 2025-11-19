import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    headless: true, // Run in headless mode
  },
  testDir: 'tests', // Directory where tests are located
  timeout: 60000, // Increase timeout to 60 seconds
});
