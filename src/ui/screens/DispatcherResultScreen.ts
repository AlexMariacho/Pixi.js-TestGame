import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_3 } from './desktopFrames';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const frameScene = DESKTOP_3.buildScene();

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

    const closeButtonNode = frameScene.nodes.get(DESKTOP_3.elements.closeButtonGroup.nodeId);
    const closeButtonSprite = closeButtonNode?.sprite;

    this.view.addChild(frameScene.container, resultLabel);
    if (closeButtonSprite) {
      this.view.addChild(closeButtonSprite);
    }

    const closeButtonBounds = closeButtonNode?.bounds ?? { x: 704, y: 631, width: 50, height: 50 };
    this.view.addChild(createClickArea(closeButtonBounds, () => this.uiManager.goBack(), closeButtonSprite ? { animateTarget: closeButtonSprite } : undefined));
  }
}
