import { test, expect } from '@playwright/test';

test.describe('Retro TV UI Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modes/video/retro-tv');
    // Wait for the YouTube player to be ready
    await page.waitForSelector('iframe[src*="youtube.com"]');
    await page.waitForTimeout(5000); // Wait for animations and player to settle
  });

  test('should have correct TV proportions and screen corner radius', async ({ page }) => {
    const speaker = page.locator('.speaker');
    const speakerBoundingBox = await speaker.boundingBox();
    expect(speakerBoundingBox?.width).toBeLessThan(150);

    const screen = page.locator('.error-noise');
    const borderRadius = await screen.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });
    expect(borderRadius).toBe('15px');
  });

  test('should have left-aligned playback controls', async ({ page }) => {
    const playbackControls = page.locator('.playback-controls');
    const justifyContent = await playbackControls.evaluate((el) => {
      return window.getComputedStyle(el).justifyContent;
    });
    expect(justifyContent).toBe('flex-start');
  });

  test('should have a consistently styled volume slider', async ({ page }) => {
    const volumeSlider = page.locator('.control-panel input[type="range"]');
    const channelSlider = page.locator('.channel input[type="range"]');

    const volumeSliderStyle = await volumeSlider.evaluate(el => JSON.stringify(window.getComputedStyle(el)));
    const channelSliderStyle = await channelSlider.evaluate(el => JSON.stringify(window.getComputedStyle(el)));

    const parsedVolumeStyle = JSON.parse(volumeSliderStyle);
    const parsedChannelStyle = JSON.parse(channelSliderStyle);

    // We can't compare the whole objects as some properties might differ (like position)
    // So we compare some key properties to ensure they are visually similar
    expect(parsedVolumeStyle.width).toEqual(parsedChannelStyle.width);
    expect(parsedVolumeStyle.position).toEqual(parsedChannelStyle.position);
    expect(parsedVolumeStyle.left).toEqual(parsedChannelStyle.left);
  });

  test('should have a visible and functional power button with indicator', async ({ page }) => {
    const powerButtonContainer = page.locator('.power');
    await expect(powerButtonContainer).toBeVisible();

    const powerIndicator = powerButtonContainer.locator('::after');

    // Check initial state (powered on)
    let initialColor = await powerIndicator.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(initialColor).toBe('rgb(124, 252, 0)'); // #7cfc00

    // Turn off
    await powerButtonContainer.locator('button').click();
    await page.waitForTimeout(500); // Wait for state to update

    // Check powered off state
    let offColor = await powerIndicator.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(offColor).toBe('rgb(165, 42, 42)'); // #a52a2a

    // Turn back on
    await powerButtonContainer.locator('button').click();
    await page.waitForTimeout(500);

    // Check final state (powered on again)
    let finalColor = await powerIndicator.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(finalColor).toBe('rgb(124, 252, 0)');
  });
});
