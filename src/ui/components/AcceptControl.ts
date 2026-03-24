import { Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import { FIGMA_COLORS } from './designTokens';

export function createAcceptControl(onClick: () => void): Container {
  const control = new Container();
  const circle = new Graphics().circle(25, 25, 25).fill(FIGMA_COLORS.accent);

  const vertical = new Graphics().roundRect(21, 8, 8, 34, 4).fill(FIGMA_COLORS.textLight);
  const horizontal = new Graphics().roundRect(8, 21, 34, 8, 4).fill(FIGMA_COLORS.textLight);

  control.addChild(circle, vertical, horizontal);
  control.position.set(235, 440);
  control.eventMode = 'static';
  control.cursor = 'pointer';
  control.on('pointertap', (_event: FederatedPointerEvent) => onClick());
  return control;
}
