
import { test, expect } from '@playwright/test';

test('verify retro tv page', async ({ page }) => {
  await page.goto('http://localhost:3005/modes/video/retro-tv');
  // Wait for the Retro TV component to be visible
  await expect(page.locator('.old-tv')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2000); // Wait a bit for everything to settle
  await page.screenshot({ path: 'retro-tv-verification-base.png' });
});
