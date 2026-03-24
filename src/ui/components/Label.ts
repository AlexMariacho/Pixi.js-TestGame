import { Text } from 'pixi.js';

export function createLabel(text: string, size = 28, color = 0xf8fafc): Text {
  return new Text({
    text,
    style: {
      fill: color,
      fontSize: size,
      fontFamily: 'Arial',
    },
  });
}
