import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_4 } from './desktopFrames';
import { Text } from 'pixi.js';
import { SCREEN_TEXT_STYLES } from '../components/screenTextStyles';
import {
  MEANING_RESULT_SCREEN_LAYOUT,
  RESULT_SCREEN_TITLE_BOUNDS,
  RESULT_SCREEN_TITLE_TEXT,
} from './resultScreenLayout';
import { createMeaningScrollBox } from '../components/MeaningScrollBox';

function subtractOffsetFromBounds<T extends { x: number; y: number }>(
  bounds: T,
  offset: { x: number; y: number },
): T {
  return {
    ...bounds,
    x: bounds.x - offset.x,
    y: bounds.y - offset.y,
  };
}

export class MeaningResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const layout = MEANING_RESULT_SCREEN_LAYOUT;
    const frameScene = DESKTOP_4.buildScene();
    const titleLabel = new Text({
      text: RESULT_SCREEN_TITLE_TEXT,
      style: SCREEN_TEXT_STYLES.titleDark48,
    });
    titleLabel.position.set(RESULT_SCREEN_TITLE_BOUNDS.x, RESULT_SCREEN_TITLE_BOUNDS.y);

    const closeButtonSprite = frameScene.nodes.get(DESKTOP_4.elements.closeButtonGroup.nodeId)?.sprite;
    const meaningScrollBox = createMeaningScrollBox(layout);

    this.view.addChild(frameScene.container, titleLabel, meaningScrollBox.view);

    this.view.addChild(
      createClickArea(
        subtractOffsetFromBounds(layout.closeButtonBounds, layout.windowOffset),
        () => this.uiManager.goBack(),
        closeButtonSprite ? { animateTarget: closeButtonSprite } : undefined,
      ),
      createClickArea(
        subtractOffsetFromBounds(layout.scrollUpButtonBounds, layout.windowOffset),
        () => meaningScrollBox.setScrollByDelta(-layout.scrollStep),
      ),
      createClickArea(
        subtractOffsetFromBounds(layout.scrollDownButtonBounds, layout.windowOffset),
        () => meaningScrollBox.setScrollByDelta(layout.scrollStep),
      ),
    );
  }
}
