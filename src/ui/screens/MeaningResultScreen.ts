import { Container, FederatedPointerEvent, FederatedWheelEvent, Graphics, Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_4 } from './desktopFrames';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';
import { MEANING_RESULT_TEXT } from './meaningResultText';

const MEANING_RESULT_WINDOW_OFFSET = { x: 9, y: -7 } as const;
const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };
const TEXT_VIEWPORT = { x: 589, y: 474, width: 258, height: 129 };
const TITLE_BOUNDS = { x: 521, y: 400 };
const TITLE_TEXT = 'Добрый вечер';
const SCROLL_STEP = 20;
const SCROLL_THUMB_MIN_HEIGHT = 16;
const SCROLL_LANE_X = 864;
const SCROLL_LANE_WIDTH = 15;
const SCROLL_THUMB_TOP_LIMIT = 493;
const SCROLL_THUMB_BOTTOM_LIMIT = 582.628;
const SCROLL_THUMB_COLOR = 0x8c8f8f;
const SCROLL_THUMB_BORDER_COLOR = 0x787b7b;
const SCROLL_UP_BUTTON_BOUNDS = { x: 864, y: 471, width: 15, height: 15 };
const SCROLL_DOWN_BUTTON_BOUNDS = { x: 864, y: 590, width: 15, height: 15 };

type ThumbShape = {
  x: number;
  y: number;
  width: number;
  height: number;
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

export class MeaningResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const frameScene = DESKTOP_4.buildScene();
    const titleLabel = new Text({
      text: TITLE_TEXT,
      style: {
        fontFamily: FIGMA_FONTS.heading,
        fontSize: 48,
        fill: FIGMA_COLORS.textDark,
        fontWeight: '400',
      },
    });
    titleLabel.position.set(TITLE_BOUNDS.x, TITLE_BOUNDS.y);

    const closeButtonSprite = frameScene.nodes.get(DESKTOP_4.elements.closeButtonGroup.nodeId)?.sprite;
    const meaningScrollBox = this.createMeaningScrollBox();

    this.view.addChild(frameScene.container, titleLabel, meaningScrollBox);

    this.view.addChild(
      createClickArea(
        subtractOffsetFromBounds(CLOSE_BUTTON_BOUNDS, MEANING_RESULT_WINDOW_OFFSET),
        () => this.uiManager.goBack(),
        closeButtonSprite ? { animateTarget: closeButtonSprite } : undefined,
      ),
      createClickArea(
        subtractOffsetFromBounds(SCROLL_UP_BUTTON_BOUNDS, MEANING_RESULT_WINDOW_OFFSET),
        () => this.scrollByDelta(-SCROLL_STEP),
      ),
      createClickArea(
        subtractOffsetFromBounds(SCROLL_DOWN_BUTTON_BOUNDS, MEANING_RESULT_WINDOW_OFFSET),
        () => this.scrollByDelta(SCROLL_STEP),
      ),
    );
  }

  private currentScrollBox: {
    setScrollByDelta: (delta: number) => void;
  } | null = null;

  private scrollByDelta(delta: number): void {
    this.currentScrollBox?.setScrollByDelta(delta);
  }

  private createMeaningScrollBox(): Container {
    const scrollBox = new Container();
    const textViewport = subtractOffsetFromBounds(TEXT_VIEWPORT, MEANING_RESULT_WINDOW_OFFSET);
    const scrollThumbTopLimit = SCROLL_THUMB_TOP_LIMIT - MEANING_RESULT_WINDOW_OFFSET.y;

    const meaningText = new Text({
      text: MEANING_RESULT_TEXT,
      style: {
        fontFamily: FIGMA_FONTS.compact,
        fontSize: 11,
        fill: FIGMA_COLORS.textDark,
        lineHeight: 17.055,
      },
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
        SCROLL_LANE_X - MEANING_RESULT_WINDOW_OFFSET.x,
        scrollThumbTopLimit,
        SCROLL_LANE_WIDTH,
        SCROLL_THUMB_BOTTOM_LIMIT - SCROLL_THUMB_TOP_LIMIT,
      )
      .fill({ color: 0xffffff, alpha: 0.001 });
    laneHitArea.eventMode = 'static';

    const thumb = new Graphics();
    thumb.eventMode = 'static';
    thumb.cursor = 'pointer';

    const thumbShape: ThumbShape = {
      x: SCROLL_LANE_X - MEANING_RESULT_WINDOW_OFFSET.x,
      y: scrollThumbTopLimit,
      width: SCROLL_LANE_WIDTH,
      height: 45,
    };

    let scrollOffset = 0;
    let isThumbDragging = false;
    let dragStartY = 0;
    let dragStartOffset = 0;

    const getMaxScroll = (): number => Math.max(0, meaningText.height - textViewport.height);
    const getMaxThumbOffset = (): number => Math.max(0, SCROLL_THUMB_BOTTOM_LIMIT - SCROLL_THUMB_TOP_LIMIT - thumbShape.height);

    const redrawThumb = (): void => {
      thumb.clear();
      thumb
        .roundRect(thumbShape.x, thumbShape.y, thumbShape.width, thumbShape.height, 3)
        .fill(SCROLL_THUMB_COLOR)
        .roundRect(thumbShape.x, thumbShape.y, thumbShape.width, thumbShape.height, 3)
        .stroke({ color: SCROLL_THUMB_BORDER_COLOR, width: 1.2 });
    };

    const syncScrollVisuals = (): void => {
      const maxScroll = getMaxScroll();
      const laneHeight = SCROLL_THUMB_BOTTOM_LIMIT - SCROLL_THUMB_TOP_LIMIT;
      const ratio = maxScroll <= 0 ? 1 : textViewport.height / meaningText.height;
      thumbShape.height = Math.max(SCROLL_THUMB_MIN_HEIGHT, laneHeight * ratio);

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

    this.currentScrollBox = {
      setScrollByDelta: scrollBy,
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

    scrollBox.addChild(meaningText, textMask, viewportHitArea, laneHitArea, thumb);

    syncScrollVisuals();
    return scrollBox;
  }
}
