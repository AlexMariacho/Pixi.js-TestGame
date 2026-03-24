import { expect, test, type Page } from '@playwright/test';

const RIGHT_ARROW_CENTER = { x: 894, y: 595 };

async function openMainScreen(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();

  await expect
    .poll(async () => page.evaluate(() => Boolean(window.__PIXI_APP_READY__)), {
      timeout: 15000,
      message: 'Pixi app did not reach ready state',
    })
    .toBe(true);
}

test('screen 1 matches Desktop - 1', async ({ page }) => {
  await openMainScreen(page);

  await expect(page.locator('canvas')).toHaveScreenshot('Desktop - 1.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });
});

test('screen 2 matches Desktop - 2', async ({ page }) => {
  await openMainScreen(page);

  await page.mouse.click(RIGHT_ARROW_CENTER.x, RIGHT_ARROW_CENTER.y);
  await page.waitForTimeout(100);

  await expect(page.locator('canvas')).toHaveScreenshot('Desktop - 2.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });
});
