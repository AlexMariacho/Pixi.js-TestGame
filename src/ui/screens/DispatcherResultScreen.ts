import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { createCircleSymbolButton, createOracleCardFrame, createOracleHeader } from '../components/OracleCard';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
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

    const closeButton = createCircleSymbolButton({ centerX: 729, centerY: 656, symbol: '✕', symbolSize: 54 });

    this.view.addChild(
      createOracleCardFrame(),
      createOracleHeader({
        emblemBounds: { x: 647, y: 222, width: 145.352, height: 145.352 },
        titleBounds: { x: 521, y: 400, width: 398, height: 52 },
        showStars: true,
        starsBounds: { x: 676.176, y: 372, width: 87, height: 21.516 },
        starsColor: 0xc8c9c6,
      }),
      resultLabel,
      closeButton,
    );

    this.view.addChild(
      createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack(), { animateTarget: closeButton }),
    );
  }
}
