import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { buildFrameScene, createNodeSprite } from '../components/figmaCsvScene';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const frameScene = buildFrameScene('Desktop - 3', {
      nodeIds: ['1:44', '1:165', '1:87', '1:101'],
    });

    const resultLabel = new Text({
      text: 'вот и думайте',
      style: {
        fontFamily: FIGMA_FONTS.body,
        fontSize: 48,
        fill: FIGMA_COLORS.textDark,
        fontWeight: '400',
      },
    });
    resultLabel.position.set(613, 469);

    const closeButtonSprite = createNodeSprite('23:12', 'Desktop - 4')?.sprite;

    this.view.addChild(frameScene.container, resultLabel);
    if (closeButtonSprite) {
      this.view.addChild(closeButtonSprite);
    }

    this.view.addChild(createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack()));
  }
}
