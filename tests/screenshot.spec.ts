import { test, expect } from '@playwright/test';

test.describe('Retro TV UI Verification', () => {
  test('Take a screenshot', async ({ page }) => {
    await page.goto('/modes/video/retro-tv');
    await page.waitForTimeout(10000); // Wait for animations and player to settle
    await page.screenshot({ path: 'test-results/screenshot.png' });
  });
});
