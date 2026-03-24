import { FederatedPointerEvent, Graphics } from 'pixi.js';

export type ClickAreaBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createClickArea(bounds: ClickAreaBounds, onClick: () => void): Graphics {
  const area = new Graphics().rect(bounds.x, bounds.y, bounds.width, bounds.height).fill({
    color: 0xffffff,
    alpha: 0.001,
  });

  area.eventMode = 'static';
  area.cursor = 'pointer';
  area.on('pointertap', (_event: FederatedPointerEvent) => onClick());

  return area;
}
