import { Container, Graphics } from 'pixi.js';
import { bindPressable, type PressableOptions } from './pressable';

export type ClickAreaBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ClickAreaOptions = {
  animateTarget?: Container | Graphics;
  pressable?: PressableOptions;
};

export function createClickArea(bounds: ClickAreaBounds, onClick: () => void, options?: ClickAreaOptions): Graphics {
  const area = new Graphics().rect(bounds.x, bounds.y, bounds.width, bounds.height).fill({
    color: 0xffffff,
    alpha: 0.001,
  });

  const animationTarget = options?.animateTarget;
  if (animationTarget) {
    bindPressable(area, animationTarget, onClick, options?.pressable);
    return area;
  }

  area.eventMode = 'static';
  area.cursor = 'pointer';
  area.on('pointertap', onClick);

  return area;
}
