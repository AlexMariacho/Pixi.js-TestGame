import { Container, Graphics } from 'pixi.js';
import { FIGMA_COLORS } from './designTokens';

export function createRatingStars(): Container {
  const row = new Container();

  for (let index = 0; index < 3; index += 1) {
    const star = new Graphics().star(0, 0, 5, 11, 5.5).fill(FIGMA_COLORS.textDark);
    star.position.set(index * 33, 0);
    row.addChild(star);
  }

  row.position.set(220, 372);
  return row;
}
