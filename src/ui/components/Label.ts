import { Text } from 'pixi.js';

export type LabelOptions = {
  size?: number;
  color?: number;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  wordWrap?: boolean;
  wordWrapWidth?: number;
};

export function createLabel(text: string, options: LabelOptions = {}): Text {
  const {
    size = 28,
    color = 0xf8fafc,
    fontFamily = 'Arial',
    align = 'left',
    lineHeight,
    wordWrap = false,
    wordWrapWidth,
  } = options;

  return new Text({
    text,
    style: {
      fill: color,
      fontSize: size,
      fontFamily,
      align,
      lineHeight,
      wordWrap,
      wordWrapWidth,
    },
  });
}
