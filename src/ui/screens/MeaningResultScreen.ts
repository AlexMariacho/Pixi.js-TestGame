import { Graphics, Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { createCircleSymbolButton, createOracleCardFrame, createOracleHeader } from '../components/OracleCard';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };

export class MeaningResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const textPanel = new Graphics()
      .roundRect(569, 462, 321, 153, 10)
      .fill(FIGMA_COLORS.panel)
      .roundRect(569, 462, 321, 153, 10)
      .stroke({ color: 0x6b6b6b, width: 4 });

    const scrollBar = new Graphics()
      .roundRect(862, 469, 19, 138, 4)
      .fill(0xd0d1cf)
      .circle(871.5, 500.372, 7.372)
      .fill(0xa62b30)
      .roundRect(864, 493, 15, 45, 2)
      .fill(0xa62b30)
      .circle(871.5, 597.372, 7.372)
      .fill(0xa62b30)
      .poly([871.5, 474.652, 875.25, 482.024, 867.75, 482.024])
      .fill(FIGMA_COLORS.textLight)
      .poly([871.5, 600.058, 875.25, 592.686, 867.75, 592.686])
      .fill(FIGMA_COLORS.textLight);

    const meaningText = new Text({
      text: [
        'Почему вообще люди ждут конца света?',
        'И почему, если таковой предстоит, он обязательно',
        'должен быть для большинства человеческого рода',
        'ужасным?..',
        'Ответ на первый вопрос состоит, по-видимому,',
        'в том, что существование мира, как подсказывает',
        'людям разум, имеет ценность лишь постольку,',
        'поскольку разумные существа соответствуют',
      ].join('\n'),
      style: {
        fontFamily: FIGMA_FONTS.compact,
        fontSize: 10,
        fill: FIGMA_COLORS.textDark,
        lineHeight: 17.055,
      },
    });
    meaningText.position.set(589, 474);

    this.view.addChild(
      createOracleCardFrame(),
      createOracleHeader({
        emblemBounds: { x: 647, y: 222, width: 145.352, height: 145.352 },
        titleBounds: { x: 521, y: 400, width: 398, height: 52 },
        showStars: true,
        starsBounds: { x: 676.176, y: 372, width: 87, height: 21.516 },
        starsColor: FIGMA_COLORS.accent,
      }),
      textPanel,
      scrollBar,
      meaningText,
      createCircleSymbolButton({ centerX: 729, centerY: 656, symbol: '✕', symbolSize: 54 }),
    );

    this.view.addChild(createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack()));
  }
}
