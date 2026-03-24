import { Container, Graphics, Text } from 'pixi.js';
import { FIGMA_COLORS, FIGMA_FONTS, FIGMA_LAYOUT } from './designTokens';

const CARD_Y = 205;
const CARD_RADIUS = 54;
const CARD_BORDER = 14;
const DOME_Y_OFFSET = 56;
const OUTER_DOME_RADIUS = 140;
const INNER_DOME_RADIUS = OUTER_DOME_RADIUS - CARD_BORDER;

export const ORACLE_CARD_LAYOUT = {
  x: (FIGMA_LAYOUT.appWidth - FIGMA_LAYOUT.cardWidth) / 2,
  y: CARD_Y,
  width: FIGMA_LAYOUT.cardWidth,
  height: FIGMA_LAYOUT.cardHeight,
  centerX: FIGMA_LAYOUT.appWidth / 2,
} as const;

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type HeaderOptions = {
  emblemBounds: Bounds;
  titleBounds: Bounds;
  showStars?: boolean;
  starsBounds?: Bounds;
  starsColor?: number;
};

export function createOracleCardFrame(): Container {
  const { x, y, width, height, centerX } = ORACLE_CARD_LAYOUT;
  const card = new Container();

  const outer = new Graphics()
    .roundRect(x, y, width, height, CARD_RADIUS)
    .fill(FIGMA_COLORS.accent)
    .circle(centerX, y + DOME_Y_OFFSET, OUTER_DOME_RADIUS)
    .fill(FIGMA_COLORS.accent);

  const inner = new Graphics()
    .roundRect(
      x + CARD_BORDER,
      y + CARD_BORDER,
      width - CARD_BORDER * 2,
      height - CARD_BORDER * 2,
      CARD_RADIUS - 10,
    )
    .fill(FIGMA_COLORS.card)
    .circle(centerX, y + DOME_Y_OFFSET + 2, INNER_DOME_RADIUS)
    .fill(FIGMA_COLORS.card);

  card.addChild(outer, inner);
  return card;
}

export function createOracleHeader(options: HeaderOptions): Container {
  const header = new Container();
  const emblemCenterX = options.emblemBounds.x + options.emblemBounds.width / 2;
  const emblemCenterY = options.emblemBounds.y + options.emblemBounds.height / 2;

  const sun = createSunEmblem(emblemCenterX, emblemCenterY);
  const title = new Text({
    text: 'ДОБРЫЙ ВЕЧЕР',
    style: {
      fontFamily: FIGMA_FONTS.heading,
      fontSize: 48,
      fill: FIGMA_COLORS.textDark,
    },
  });
  title.position.set(options.titleBounds.x, options.titleBounds.y);

  header.addChild(sun, title);

  if (options.showStars && options.starsBounds) {
    const stars = new Text({
      text: '✦ ✦ ✦',
      style: {
        fontFamily: FIGMA_FONTS.compact,
        fontSize: 24,
        fill: options.starsColor ?? FIGMA_COLORS.accent,
      },
    });
    stars.anchor.set(0.5);
    stars.position.set(
      options.starsBounds.x + options.starsBounds.width / 2,
      options.starsBounds.y + options.starsBounds.height / 2,
    );
    header.addChild(stars);
  }

  return header;
}

type CircleButtonOptions = {
  centerX: number;
  centerY: number;
  radius?: number;
  symbol: string;
  symbolSize?: number;
  fillColor?: number;
};

export function createCircleSymbolButton(options: CircleButtonOptions): Container {
  const radius = options.radius ?? 25;
  const fillColor = options.fillColor ?? 0xc16164;

  const button = new Container();
  const shadow = new Graphics().circle(options.centerX, options.centerY + 4, radius).fill({
    color: 0x000000,
    alpha: 0.18,
  });

  const body = new Graphics().circle(options.centerX, options.centerY, radius).fill(fillColor);

  const symbol = new Text({
    text: options.symbol,
    style: {
      fontFamily: FIGMA_FONTS.body,
      fontSize: options.symbolSize ?? 40,
      fill: FIGMA_COLORS.textLight,
      fontWeight: '700',
    },
  });
  symbol.anchor.set(0.5);
  symbol.position.set(options.centerX, options.centerY + 1);
  symbol.scale.set(0.55);

  button.addChild(shadow, body, symbol);
  return button;
}

type ActionButtonOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  labelX?: number;
  labelY?: number;
};

export function createActionButton(options: ActionButtonOptions): Container {
  const button = new Container();
  const radius = options.height / 2;

  const shadow = new Graphics()
    .roundRect(options.x, options.y + 4, options.width, options.height, radius)
    .fill({ color: 0x000000, alpha: 0.18 });

  const body = new Graphics()
    .roundRect(options.x, options.y, options.width, options.height, radius)
    .fill(FIGMA_COLORS.accent);

  const label = new Text({
    text: options.label,
    style: {
      fontFamily: FIGMA_FONTS.heading,
      fontSize: 32,
      fill: FIGMA_COLORS.textLight,
    },
  });
  label.position.set(
    options.labelX ?? options.x + (options.width - label.width) / 2,
    options.labelY ?? options.y + (options.height - label.height) / 2,
  );

  button.addChild(shadow, body, label);
  return button;
}

function createSunEmblem(centerX: number, centerY: number): Container {
  const emblem = new Container();
  const rays = new Graphics();
  const rayCount = 16;
  const innerRadius = 40;
  const outerRadius = 68;
  const spread = 0.11;

  for (let index = 0; index < rayCount; index += 1) {
    const angle = (index / rayCount) * Math.PI * 2 - Math.PI / 2;
    const left = angle - spread;
    const right = angle + spread;

    rays
      .poly([
        centerX + Math.cos(left) * innerRadius,
        centerY + Math.sin(left) * innerRadius,
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius,
        centerX + Math.cos(right) * innerRadius,
        centerY + Math.sin(right) * innerRadius,
      ])
      .fill(FIGMA_COLORS.accent);
  }

  const triangle = new Graphics()
    .poly([
      centerX,
      centerY - 40,
      centerX - 44,
      centerY + 34,
      centerX + 44,
      centerY + 34,
    ])
    .fill(FIGMA_COLORS.textDark);

  const eyeOutline = new Graphics().circle(centerX, centerY + 7, 14).fill(FIGMA_COLORS.textLight);
  const eyePupil = new Graphics().circle(centerX, centerY + 7, 5).fill(FIGMA_COLORS.textDark);

  emblem.addChild(rays, triangle, eyeOutline, eyePupil);
  return emblem;
}
