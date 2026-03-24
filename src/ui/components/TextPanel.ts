import { Container, Graphics } from 'pixi.js';
import { createLabel } from './Label';
import { FIGMA_COLORS, FIGMA_FONTS } from './designTokens';

export function createTextPanel(content: string): Container {
  const panel = new Container();
  const box = new Graphics()
    .roundRect(0, 0, 321, 153, 10)
    .fill(FIGMA_COLORS.panel)
    .stroke({ color: FIGMA_COLORS.textDark, width: 1 });

  const text = createLabel(content, {
    size: 10,
    color: FIGMA_COLORS.textDark,
    fontFamily: FIGMA_FONTS.compact,
    lineHeight: 17.05,
    wordWrap: true,
    wordWrapWidth: 253,
  });
  text.position.set(20, 12);

  const scrollTrack = new Graphics().roundRect(293, 7, 19, 138, 10).fill(FIGMA_COLORS.textDark);
  const scrollThumb = new Graphics().roundRect(295, 31, 15, 45, 5).fill(FIGMA_COLORS.textDark);

  const upButton = new Container();
  const upCircle = new Graphics().circle(302.5, 14.5, 7.5).fill(FIGMA_COLORS.accent);
  const upArrow = new Graphics().poly([302.5, 11, 306.5, 18, 298.5, 18]).fill(FIGMA_COLORS.textLight);
  upButton.addChild(upCircle, upArrow);

  const downButton = new Container();
  const downCircle = new Graphics().circle(302.5, 131.5, 7.5).fill(FIGMA_COLORS.accent);
  const downArrow = new Graphics().poly([302.5, 136, 306.5, 129, 298.5, 129]).fill(FIGMA_COLORS.textLight);
  downButton.addChild(downCircle, downArrow);

  panel.addChild(box, text, scrollTrack, scrollThumb, upButton, downButton);
  panel.position.set(110, 462);
  return panel;
}
