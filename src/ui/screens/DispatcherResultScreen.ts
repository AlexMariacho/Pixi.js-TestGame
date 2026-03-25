import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_3 } from './desktopFrames';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

const DISPATCHER_RESULT_WINDOW_OFFSET = { x: 9, y: 3 } as const;
const TITLE_BOUNDS = { x: 521, y: 400 } as const;
const TITLE_TEXT = 'Добрый вечер';
const RESULT_LABEL_BOUNDS = { x: 613, y: 469 } as const;

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const frameScene = DESKTOP_3.buildScene();
    const titleLabel = new Text({
      text: TITLE_TEXT,
      style: {
        fontFamily: FIGMA_FONTS.heading,
        fontSize: 48,
        fill: FIGMA_COLORS.textDark,
        fontWeight: '400',
      },
    });
    titleLabel.position.set(TITLE_BOUNDS.x, TITLE_BOUNDS.y);

    const resultLabel = new Text({
      text: 'вот и думайте',
      style: {
        fontFamily: FIGMA_FONTS.body,
        fontSize: 48,
        fill: FIGMA_COLORS.textDark,
        fontWeight: '400',
      },
    });
    resultLabel.position.set(
      RESULT_LABEL_BOUNDS.x - DISPATCHER_RESULT_WINDOW_OFFSET.x,
      RESULT_LABEL_BOUNDS.y - DISPATCHER_RESULT_WINDOW_OFFSET.y,
    );

    const closeButtonNode = frameScene.nodes.get(DESKTOP_3.elements.closeButtonGroup.nodeId);
    const closeButtonSprite = closeButtonNode?.sprite;

    this.view.addChild(frameScene.container, titleLabel, resultLabel);
    if (closeButtonSprite) {
      this.view.addChild(closeButtonSprite);
    }

    const closeButtonBounds = closeButtonNode?.bounds ?? { x: 704, y: 631, width: 50, height: 50 };
    this.view.addChild(
      createClickArea(
        closeButtonBounds,
        () => this.uiManager.goBack(),
        closeButtonSprite ? { animateTarget: closeButtonSprite } : undefined,
      ),
    );
  }
}
