import { Container, Graphics } from 'pixi.js';

export function createPanel(width: number, height: number, color = 0x1e293b): Container {
  const panel = new Container();
  const bg = new Graphics().roundRect(0, 0, width, height, 16).fill(color);

  panel.addChild(bg);
  return panel;
}
