import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_3 } from './desktopFrames';
import { SCREEN_TEXT } from './screenText';
import { SCREEN_TEXT_STYLES } from '../components/screenTextStyles';
import {
  DISPATCHER_RESULT_SCREEN_LAYOUT,
  RESULT_SCREEN_TITLE_BOUNDS,
  RESULT_SCREEN_TITLE_TEXT,
} from './resultScreenLayout';

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const frameScene = DESKTOP_3.buildScene();
    const titleLabel = new Text({
      text: RESULT_SCREEN_TITLE_TEXT,
      style: SCREEN_TEXT_STYLES.titleDark48,
    });
    titleLabel.position.set(RESULT_SCREEN_TITLE_BOUNDS.x, RESULT_SCREEN_TITLE_BOUNDS.y);

    const resultLabel = new Text({
      text: SCREEN_TEXT.dispatcherResult,
      style: SCREEN_TEXT_STYLES.bodyDark48,
    });
    resultLabel.position.set(
      DISPATCHER_RESULT_SCREEN_LAYOUT.resultLabelBounds.x - DISPATCHER_RESULT_SCREEN_LAYOUT.windowOffset.x,
      DISPATCHER_RESULT_SCREEN_LAYOUT.resultLabelBounds.y - DISPATCHER_RESULT_SCREEN_LAYOUT.windowOffset.y,
    );

    const closeButtonNode = frameScene.nodes.get(DESKTOP_3.elements.closeButtonGroup.nodeId);
    const closeButtonSprite = closeButtonNode?.sprite;

    this.view.addChild(frameScene.container, titleLabel, resultLabel);
    if (closeButtonSprite) {
      this.view.addChild(closeButtonSprite);
    }

    const closeButtonBounds = closeButtonNode?.bounds ?? DISPATCHER_RESULT_SCREEN_LAYOUT.closeButtonBounds;
    this.view.addChild(
      createClickArea(
        closeButtonBounds,
        () => this.uiManager.goBack(),
        closeButtonSprite ? { animateTarget: closeButtonSprite } : undefined,
      ),
    );
  }
}
