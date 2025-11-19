// tests/ambilight-test.spec.ts
import { test, expect } from '@playwright/test';

test('Ambilight test', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => console.log(msg.text()));

  await page.goto('http://localhost:3007/ambilight-test');
  await expect(page).toHaveTitle(/ScreenSavy.com - Immersive Color Experiences/);
  await page.screenshot({ path: 'ambilight-test.png' });
});
