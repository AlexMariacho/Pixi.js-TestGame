import { Container, FederatedPointerEvent, FederatedWheelEvent, Graphics, Text } from 'pixi.js';
import { SCREEN_TEXT_STYLES } from './screenTextStyles';
import { MEANING_RESULT_TEXT } from '../screens/meaningResultText';
import type { MeaningResultScreenLayout } from '../screens/resultScreenLayout';

type MeaningScrollBoxShape = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MeaningScrollBox = {
  view: Container;
  setScrollByDelta(delta: number): void;
};

function subtractOffsetFromBounds<T extends { x: number; y: number }>(
  bounds: T,
  offset: { x: number; y: number },
): T {
  return {
    ...bounds,
    x: bounds.x - offset.x,
    y: bounds.y - offset.y,
  };
}

export function createMeaningScrollBox(layout: MeaningResultScreenLayout): MeaningScrollBox {
  const view = new Container();
  const textViewport = subtractOffsetFromBounds(layout.textViewport, layout.windowOffset);
  const scrollThumbTopLimit = layout.scrollThumbTopLimit - layout.windowOffset.y;

  const meaningText = new Text({
    text: MEANING_RESULT_TEXT,
    style: SCREEN_TEXT_STYLES.compactDark11,
  });
  meaningText.position.set(textViewport.x, textViewport.y);
  meaningText.resolution = Math.max(window.devicePixelRatio || 1, 2);
  meaningText.roundPixels = true;

  const textMask = new Graphics().rect(textViewport.x, textViewport.y, textViewport.width, textViewport.height).fill(0xffffff);
  meaningText.mask = textMask;

  const viewportHitArea = new Graphics()
    .rect(textViewport.x, textViewport.y, textViewport.width, textViewport.height)
    .fill({ color: 0xffffff, alpha: 0.001 });
  viewportHitArea.eventMode = 'static';

  const laneHitArea = new Graphics()
    .rect(
      layout.scrollLaneX - layout.windowOffset.x,
      scrollThumbTopLimit,
      layout.scrollLaneWidth,
      layout.scrollThumbBottomLimit - layout.scrollThumbTopLimit,
    )
    .fill({ color: 0xffffff, alpha: 0.001 });
  laneHitArea.eventMode = 'static';

  const thumb = new Graphics();
  thumb.eventMode = 'static';
  thumb.cursor = 'pointer';

  const thumbShape: MeaningScrollBoxShape = {
    x: layout.scrollLaneX - layout.windowOffset.x,
    y: scrollThumbTopLimit,
    width: layout.scrollLaneWidth,
    height: 45,
  };

  let scrollOffset = 0;
  let isThumbDragging = false;
  let dragStartY = 0;
  let dragStartOffset = 0;

  const getMaxScroll = (): number => Math.max(0, meaningText.height - textViewport.height);
  const getMaxThumbOffset = (): number =>
    Math.max(0, layout.scrollThumbBottomLimit - layout.scrollThumbTopLimit - thumbShape.height);

  const redrawThumb = (): void => {
    thumb.clear();
    thumb
      .roundRect(thumbShape.x, thumbShape.y, thumbShape.width, thumbShape.height, 3)
      .fill(layout.scrollThumbColor)
      .roundRect(thumbShape.x, thumbShape.y, thumbShape.width, thumbShape.height, 3)
      .stroke({ color: layout.scrollThumbBorderColor, width: 1.2 });
  };

  const syncScrollVisuals = (): void => {
    const maxScroll = getMaxScroll();
    const laneHeight = layout.scrollThumbBottomLimit - layout.scrollThumbTopLimit;
    const ratio = maxScroll <= 0 ? 1 : textViewport.height / meaningText.height;
    thumbShape.height = Math.max(layout.scrollThumbMinHeight, laneHeight * ratio);

    const maxThumbOffset = getMaxThumbOffset();
    const scrollRatio = maxScroll <= 0 ? 0 : scrollOffset / maxScroll;
    thumbShape.y = scrollThumbTopLimit + maxThumbOffset * scrollRatio;

    meaningText.y = Math.round(textViewport.y - scrollOffset);
    thumb.alpha = maxScroll > 0 ? 1 : 0.5;
    redrawThumb();
  };

  const setScroll = (nextOffset: number): void => {
    const maxScroll = getMaxScroll();
    scrollOffset = Math.round(Math.min(Math.max(nextOffset, 0), maxScroll));
    syncScrollVisuals();
  };

  const scrollBy = (delta: number): void => {
    setScroll(scrollOffset + delta);
  };

  const setScrollByThumbY = (thumbY: number): void => {
    const maxScroll = getMaxScroll();
    if (maxScroll <= 0) {
      setScroll(0);
      return;
    }

    const maxThumbOffset = getMaxThumbOffset();
    const nextThumbOffset = Math.min(Math.max(thumbY - scrollThumbTopLimit, 0), maxThumbOffset);
    const scrollRatio = maxThumbOffset <= 0 ? 0 : nextThumbOffset / maxThumbOffset;
    setScroll(scrollRatio * maxScroll);
  };

  viewportHitArea.on('wheel', (event: FederatedWheelEvent) => {
    scrollBy(event.deltaY);
    event.preventDefault();
  });

  laneHitArea.on('pointertap', (event: FederatedPointerEvent) => {
    setScrollByThumbY(event.global.y - thumbShape.height / 2);
  });

  thumb.on('pointerdown', (event: FederatedPointerEvent) => {
    isThumbDragging = true;
    dragStartY = event.global.y;
    dragStartOffset = scrollOffset;
  });

  thumb.on('globalpointermove', (event: FederatedPointerEvent) => {
    if (!isThumbDragging) {
      return;
    }

    const maxScroll = getMaxScroll();
    const maxThumbOffset = getMaxThumbOffset();
    const thumbDelta = event.global.y - dragStartY;
    const scrollDelta = maxThumbOffset <= 0 ? 0 : (thumbDelta / maxThumbOffset) * maxScroll;
    setScroll(dragStartOffset + scrollDelta);
  });

  thumb.on('pointerup', () => {
    isThumbDragging = false;
  });

  thumb.on('pointerupoutside', () => {
    isThumbDragging = false;
  });

  view.addChild(meaningText, textMask, viewportHitArea, laneHitArea, thumb);

  syncScrollVisuals();

  return {
    view,
    setScrollByDelta: scrollBy,
  };
}
