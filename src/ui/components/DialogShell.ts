import { Container, Graphics } from 'pixi.js';
import { createLabel } from './Label';
import { FIGMA_COLORS, FIGMA_FONTS, FIGMA_LAYOUT } from './designTokens';

export type DialogShellOptions = {
  subtitle: string;
};

function createAvatarIcon(): Container {
  const icon = new Container();

  const star = new Graphics()
    .star(0, 0, 8, 72, 42)
    .fill(FIGMA_COLORS.accent);

  const face = new Graphics()
    .poly([
      -41, -6,
      0, -41,
      41, -6,
      24, 37,
      -24, 37,
    ])
    .fill(FIGMA_COLORS.textDark)
    .stroke({ color: FIGMA_COLORS.textLight, width: 2 });

  const leftEye = new Graphics().circle(-13, 7, 13).fill(FIGMA_COLORS.textLight);
  const rightEye = new Graphics().circle(13, 7, 4).fill(FIGMA_COLORS.textDark);

  icon.addChild(star, face, leftEye, rightEye);
  icon.position.set(FIGMA_LAYOUT.cardWidth / 2, 88);
  return icon;
}

export function createDialogShell(options: DialogShellOptions): Container {
  const shell = new Container();

  const circle = new Graphics().circle(260, 178, 178.5).fill(FIGMA_COLORS.card);
  const card = new Graphics().roundRect(10, 107, 500, 400, 50).fill(FIGMA_COLORS.card);

  const title = createLabel('ДОБРЫЙ ВЕЧЕР', {
    size: 48,
    color: FIGMA_COLORS.textDark,
    fontFamily: FIGMA_FONTS.heading,
    align: 'center',
  });
  title.anchor.set(0.5);
  title.position.set(260, 220);

  const subtitle = createLabel(options.subtitle, {
    size: 48,
    color: FIGMA_COLORS.textDark,
    fontFamily: FIGMA_FONTS.body,
    align: 'center',
  });
  subtitle.anchor.set(0.5);
  subtitle.position.set(260, 289);

  shell.addChild(circle, card, createAvatarIcon(), title, subtitle);
  return shell;
}
