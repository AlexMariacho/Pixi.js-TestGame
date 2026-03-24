import { Container, Graphics, FederatedPointerEvent } from 'pixi.js';
import { createLabel } from './Label';

export type ButtonOptions = {
  text: string;
  width?: number;
  height?: number;
  onClick: () => void;
};

export function createButton(options: ButtonOptions): Container {
  const width = options.width ?? 220;
  const height = options.height ?? 56;

  const button = new Container();
  const bg = new Graphics().roundRect(0, 0, width, height, 10).fill(0x2563eb);
  const label = createLabel(options.text, { size: 22 });

  label.anchor.set(0.5);
  label.position.set(width / 2, height / 2);

  button.addChild(bg, label);
  button.eventMode = 'static';
  button.cursor = 'pointer';

  button.on('pointertap', (_event: FederatedPointerEvent) => {
    options.onClick();
  });

  return button;
}
