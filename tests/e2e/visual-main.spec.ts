import { expect, test, type Page } from '@playwright/test';

const RIGHT_ARROW_CENTER = { x: 894, y: 595 };
const SELECT_BUTTON_CENTER = { x: 720, y: 595 };
const SCROLL_DOWN_CENTER = { x: 863, y: 605 };
const TRANSITION_WAIT_MS = 260;

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

async function clearHoverState(page: Page): Promise<void> {
  await page.mouse.move(100, 100);
  await page.waitForTimeout(400);
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
  await clearHoverState(page);

  await expect(page.locator('canvas')).toHaveScreenshot('Desktop - 2.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });
});

test('main buttons apply and reset hover visual state', async ({ page }) => {
  await openMainScreen(page);

  const canvas = page.locator('canvas');
  const initialScreenshot = await canvas.screenshot({
    animations: 'disabled',
    caret: 'hide',
  });

  await page.mouse.move(SELECT_BUTTON_CENTER.x, SELECT_BUTTON_CENTER.y);
  await page.waitForTimeout(120);

  const hoveredScreenshot = await canvas.screenshot({
    animations: 'disabled',
    caret: 'hide',
  });
  expect(hoveredScreenshot.equals(initialScreenshot)).toBe(false);

  await page.mouse.move(100, 100);
  await page.waitForTimeout(120);

  const resetScreenshot = await canvas.screenshot({
    animations: 'disabled',
    caret: 'hide',
  });
  expect(resetScreenshot.equals(initialScreenshot)).toBe(true);
});

test('screen 3 matches Desktop - 3', async ({ page }) => {
  await openMainScreen(page);

  await page.mouse.click(SELECT_BUTTON_CENTER.x, SELECT_BUTTON_CENTER.y);
  await page.waitForTimeout(TRANSITION_WAIT_MS);
  await clearHoverState(page);

  await expect(page.locator('canvas')).toHaveScreenshot('Desktop - 3.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });
});

test('screen 4 matches Desktop - 4', async ({ page }) => {
  await openMainScreen(page);

  await page.mouse.click(RIGHT_ARROW_CENTER.x, RIGHT_ARROW_CENTER.y);
  await page.waitForTimeout(100);
  await page.mouse.click(SELECT_BUTTON_CENTER.x, SELECT_BUTTON_CENTER.y);
  await page.waitForTimeout(TRANSITION_WAIT_MS);
  await clearHoverState(page);

  await expect(page.locator('canvas')).toHaveScreenshot('Desktop - 4.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });
});

test('meaning screen scroll buttons change the viewport', async ({ page }) => {
  await openMainScreen(page);

  await page.mouse.click(RIGHT_ARROW_CENTER.x, RIGHT_ARROW_CENTER.y);
  await page.waitForTimeout(100);
  await page.mouse.click(SELECT_BUTTON_CENTER.x, SELECT_BUTTON_CENTER.y);
  await page.waitForTimeout(TRANSITION_WAIT_MS);
  await clearHoverState(page);

  const canvas = page.locator('canvas');
  const beforeScroll = await canvas.screenshot({
    animations: 'disabled',
    caret: 'hide',
  });

  await page.mouse.click(SCROLL_DOWN_CENTER.x, SCROLL_DOWN_CENTER.y);
  await page.waitForTimeout(120);

  const afterScroll = await canvas.screenshot({
    animations: 'disabled',
    caret: 'hide',
  });

  expect(afterScroll.equals(beforeScroll)).toBe(false);
});
