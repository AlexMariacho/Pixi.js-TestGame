import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { createLabel } from './Label';
import { FIGMA_COLORS, FIGMA_FONTS } from './designTokens';

function asInteractive(target: Container, handler: () => void): void {
  target.eventMode = 'static';
  target.cursor = 'pointer';
  target.on('pointertap', (_event: FederatedPointerEvent) => handler());
}

function createArrowButton(direction: 'left' | 'right', onClick: () => void): Container {
  const button = new Container();
  const circle = new Graphics().circle(25, 25, 25).fill(FIGMA_COLORS.accent);

  const trianglePoints =
    direction === 'left'
      ? [31, 11, 10, 25, 31, 39]
      : [19, 11, 40, 25, 19, 39];
  const triangle = new Graphics().poly(trianglePoints).fill(FIGMA_COLORS.textLight);

  button.addChild(circle, triangle);
  asInteractive(button, onClick);
  return button;
}

function createSelectButton(onClick: () => void): Container {
  const button = new Container();
  const bg = new Graphics().roundRect(0, 0, 250, 70, 35).fill(FIGMA_COLORS.accent);
  const label = createLabel('ВЫБРАТЬ', {
    size: 32,
    color: FIGMA_COLORS.textLight,
    fontFamily: FIGMA_FONTS.heading,
    align: 'center',
  });
  label.anchor.set(0.5);
  label.position.set(125, 35);

  button.addChild(bg, label);
  asInteractive(button, onClick);
  return button;
}

export type NavigationControlsOptions = {
  onPrev: () => void;
  onNext: () => void;
  onSelect: () => void;
};

export function createNavigationControls(options: NavigationControlsOptions): Container {
  const controls = new Container();
  const prev = createArrowButton('left', options.onPrev);
  const next = createArrowButton('right', options.onNext);
  const select = createSelectButton(options.onSelect);

  prev.position.set(61, 365);
  select.position.set(135, 355);
  next.position.set(409, 365);

  controls.addChild(prev, select, next);
  return controls;
}
