import { Container, FederatedPointerEvent, FederatedWheelEvent, Graphics, Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { createCircleSymbolButton, createOracleCardFrame, createOracleHeader } from '../components/OracleCard';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';
import { bindPressable } from '../components/pressable';
import { MEANING_RESULT_TEXT } from './meaningResultText';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };
const TEXT_PANEL_BOUNDS = { x: 569, y: 462, width: 321, height: 153, radius: 10 };
const TEXT_VIEWPORT = { x: 589, y: 474, width: 263, height: 129 };
const SCROLLBAR_BOUNDS = { x: 862, y: 469, width: 19, height: 138 };
const SCROLL_STEP = 20;
const SCROLL_THUMB_MIN_HEIGHT = 16;
const SCROLL_BUTTON_RADIUS = 7.372;
const UP_BUTTON_CENTER_X = 871.5;
const UP_BUTTON_CENTER_Y = 478.5;
const DOWN_BUTTON_CENTER_X = 871.5;
const DOWN_BUTTON_CENTER_Y = 597.5;
const SCROLL_LANE_X = 864;
const SCROLL_LANE_WIDTH = 15;
const SCROLL_THUMB_TOP_LIMIT = 493;
const SCROLL_THUMB_BOTTOM_LIMIT = 582.628;
const SCROLL_WELL_COLOR = 0xd0d1cf;
const SCROLL_THUMB_COLOR = 0x8c8f8f;
const SCROLL_THUMB_BORDER_COLOR = 0x787b7b;
const SCROLL_WELL_RADIUS = SCROLLBAR_BOUNDS.width / 2;
const ARROW_HALF_WIDTH = 3.75;
const ARROW_HALF_HEIGHT = 3.686;

type ThumbShape = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class MeaningResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const meaningScrollBox = this.createMeaningScrollBox();
    const closeButton = createCircleSymbolButton({ centerX: 729, centerY: 656, symbol: '✕', symbolSize: 54 });

    this.view.addChild(
      createOracleCardFrame(),
      createOracleHeader({
        emblemBounds: { x: 657, y: 219, width: 145.352, height: 145.352 },
        titleBounds: { x: 521, y: 400, width: 398, height: 52 },
        showStars: true,
        starsBounds: { x: 686, y: 372, width: 87, height: 21.516 },
        starsColor: FIGMA_COLORS.accent,
      }),
      meaningScrollBox,
      closeButton,
    );

    this.view.addChild(
      createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack(), { animateTarget: closeButton }),
    );
  }

  private createMeaningScrollBox(): Container {
    const scrollBox = new Container();

    const panel = new Graphics()
      .roundRect(
        TEXT_PANEL_BOUNDS.x,
        TEXT_PANEL_BOUNDS.y,
        TEXT_PANEL_BOUNDS.width,
        TEXT_PANEL_BOUNDS.height,
        TEXT_PANEL_BOUNDS.radius,
      )
      .fill(FIGMA_COLORS.panel)
      .roundRect(
        TEXT_PANEL_BOUNDS.x,
        TEXT_PANEL_BOUNDS.y,
        TEXT_PANEL_BOUNDS.width,
        TEXT_PANEL_BOUNDS.height,
        TEXT_PANEL_BOUNDS.radius,
      )
      .stroke({ color: 0x6b6b6b, width: 4 });

    const meaningText = new Text({
      text: MEANING_RESULT_TEXT,
      style: {
        fontFamily: FIGMA_FONTS.compact,
        fontSize: 11,
        fontWeight: '400',
        fontStyle: 'normal',
        fill: FIGMA_COLORS.textDark,
        lineHeight: 17.055,
        letterSpacing: 0,
      },
    });
    meaningText.position.set(TEXT_VIEWPORT.x, TEXT_VIEWPORT.y);
    meaningText.resolution = Math.max(window.devicePixelRatio || 1, 2);
    meaningText.roundPixels = true;

    const textMask = new Graphics()
      .rect(TEXT_VIEWPORT.x, TEXT_VIEWPORT.y, TEXT_VIEWPORT.width, TEXT_VIEWPORT.height)
      .fill(0xffffff);
    meaningText.mask = textMask;

    const viewportHitArea = new Graphics()
      .rect(TEXT_VIEWPORT.x, TEXT_VIEWPORT.y, TEXT_VIEWPORT.width, TEXT_VIEWPORT.height)
      .fill({ color: 0xffffff, alpha: 0.001 });
    viewportHitArea.eventMode = 'static';

    const scrollBarBackground = new Graphics()
      .roundRect(
        SCROLLBAR_BOUNDS.x,
        SCROLLBAR_BOUNDS.y,
        SCROLLBAR_BOUNDS.width,
        SCROLLBAR_BOUNDS.height,
        SCROLL_WELL_RADIUS,
      )
      .fill(SCROLL_WELL_COLOR);

    const laneHitArea = new Graphics()
      .rect(SCROLL_LANE_X, SCROLL_THUMB_TOP_LIMIT, SCROLL_LANE_WIDTH, SCROLL_THUMB_BOTTOM_LIMIT - SCROLL_THUMB_TOP_LIMIT)
      .fill({ color: 0xffffff, alpha: 0.001 });
    laneHitArea.eventMode = 'static';
    laneHitArea.cursor = 'pointer';

    const thumb = new Graphics();
    thumb.eventMode = 'static';
    thumb.cursor = 'pointer';

    const thumbShape: ThumbShape = {
      x: SCROLL_LANE_X,
      y: SCROLL_THUMB_TOP_LIMIT,
      width: SCROLL_LANE_WIDTH,
      height: 45,
    };
    let scrollOffset = 0;
    let isThumbDragging = false;
    let dragStartY = 0;
    let dragStartOffset = 0;

    const getMaxScroll = (): number => Math.max(0, meaningText.height - TEXT_VIEWPORT.height);
    const getMaxThumbOffset = (): number =>
      Math.max(0, SCROLL_THUMB_BOTTOM_LIMIT - SCROLL_THUMB_TOP_LIMIT - thumbShape.height);

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
      const ratio = maxScroll <= 0 ? 1 : TEXT_VIEWPORT.height / meaningText.height;
      thumbShape.height = Math.max(SCROLL_THUMB_MIN_HEIGHT, laneHeight * ratio);

      const maxThumbOffset = getMaxThumbOffset();
      const scrollRatio = maxScroll <= 0 ? 0 : scrollOffset / maxScroll;
      thumbShape.y = SCROLL_THUMB_TOP_LIMIT + maxThumbOffset * scrollRatio;

      meaningText.y = Math.round(TEXT_VIEWPORT.y - scrollOffset);
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
      const nextThumbOffset = Math.min(Math.max(thumbY - SCROLL_THUMB_TOP_LIMIT, 0), maxThumbOffset);
      const scrollRatio = maxThumbOffset <= 0 ? 0 : nextThumbOffset / maxThumbOffset;
      setScroll(scrollRatio * maxScroll);
    };

    const upButton = this.createScrollButton(UP_BUTTON_CENTER_X, UP_BUTTON_CENTER_Y, 'up', () => scrollBy(-SCROLL_STEP));
    const downButton = this.createScrollButton(DOWN_BUTTON_CENTER_X, DOWN_BUTTON_CENTER_Y, 'down', () => scrollBy(SCROLL_STEP));

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

    scrollBox.addChild(
      panel,
      scrollBarBackground,
      laneHitArea,
      upButton,
      downButton,
      meaningText,
      textMask,
      viewportHitArea,
      thumb,
    );

    syncScrollVisuals();
    return scrollBox;
  }

  private createScrollButton(
    centerX: number,
    centerY: number,
    direction: 'up' | 'down',
    onClick: () => void,
  ): Container {
    const button = new Container();
    button.position.set(centerX, centerY);

    const body = new Graphics().circle(0, 0, SCROLL_BUTTON_RADIUS).fill(0xa62b30);
    const trianglePoints =
      direction === 'up'
        ? [
            0,
            -ARROW_HALF_HEIGHT,
            ARROW_HALF_WIDTH,
            ARROW_HALF_HEIGHT,
            -ARROW_HALF_WIDTH,
            ARROW_HALF_HEIGHT,
          ]
        : [
            0,
            ARROW_HALF_HEIGHT,
            ARROW_HALF_WIDTH,
            -ARROW_HALF_HEIGHT,
            -ARROW_HALF_WIDTH,
            -ARROW_HALF_HEIGHT,
          ];
    const icon = new Graphics().poly(trianglePoints).fill(FIGMA_COLORS.textLight);

    const hitArea = new Graphics()
      .circle(0, 0, SCROLL_BUTTON_RADIUS + 2)
      .fill({ color: 0xffffff, alpha: 0.001 });
    bindPressable(hitArea, button, onClick, { pressedOffsetY: 1.4, animationDurationMs: 90 });

    button.addChild(body, icon, hitArea);
    return button;
  }
}
