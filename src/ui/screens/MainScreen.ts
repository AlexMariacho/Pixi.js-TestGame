import { Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { createActionButton, createCircleSymbolButton, createOracleCardFrame, createOracleHeader } from '../components/OracleCard';
import { FIGMA_COLORS, FIGMA_FONTS } from '../components/designTokens';

type MainState = 'dispatcher' | 'meaning';

const LEFT_ARROW_BOUNDS = { x: 521, y: 570, width: 50, height: 50 };
const RIGHT_ARROW_BOUNDS = { x: 869, y: 570, width: 50, height: 50 };
const SELECT_BUTTON_BOUNDS = { x: 595, y: 560, width: 250, height: 70 };
const DISPATCHER_ROLE_BOUNDS = { x: 627, y: 469 };
const MEANING_ROLE_BOUNDS = { x: 596, y: 469 };

export class MainScreen extends BaseScreen {
  private readonly roleLabel = new Text({
    text: 'я диспетчер',
    style: {
      fontFamily: FIGMA_FONTS.body,
      fontSize: 48,
      fill: FIGMA_COLORS.textDark,
      fontWeight: '400',
    },
  });
  private selectedState: MainState = 'dispatcher';

  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const leftArrowButton = createCircleSymbolButton({ centerX: 546, centerY: 595, symbol: '◀', symbolSize: 44 });
    const rightArrowButton = createCircleSymbolButton({ centerX: 894, centerY: 595, symbol: '▶', symbolSize: 44 });
    const selectButton = createActionButton({
      x: SELECT_BUTTON_BOUNDS.x,
      y: SELECT_BUTTON_BOUNDS.y,
      width: SELECT_BUTTON_BOUNDS.width,
      height: SELECT_BUTTON_BOUNDS.height,
      label: 'ВЫБРАТЬ',
      labelX: 638,
      labelY: 582,
    });

    this.view.addChild(
      createOracleCardFrame(),
      createOracleHeader({
        emblemBounds: { x: 647, y: 222, width: 145.352, height: 145.352 },
        titleBounds: { x: 521, y: 400, width: 398, height: 52 },
      }),
      this.roleLabel,
      leftArrowButton,
      rightArrowButton,
      selectButton,
    );

    this.view.addChild(
      createClickArea(LEFT_ARROW_BOUNDS, () => this.toggleState(), { animateTarget: leftArrowButton }),
      createClickArea(RIGHT_ARROW_BOUNDS, () => this.toggleState(), { animateTarget: rightArrowButton }),
      createClickArea(SELECT_BUTTON_BOUNDS, () => this.selectCurrentState(), { animateTarget: selectButton }),
    );

    this.syncState();
  }

  private toggleState(): void {
    this.selectedState = this.selectedState === 'dispatcher' ? 'meaning' : 'dispatcher';
    this.syncState();
  }

  private selectCurrentState(): void {
    if (this.selectedState === 'dispatcher') {
      this.uiManager.show(SCREEN_IDS.dispatcherResult);
      return;
    }

    this.uiManager.show(SCREEN_IDS.meaningResult);
  }

  private syncState(): void {
    const isDispatcher = this.selectedState === 'dispatcher';
    this.roleLabel.text = isDispatcher ? 'я диспетчер' : 'а что это значит?';
    this.roleLabel.position.set(
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.x : MEANING_ROLE_BOUNDS.x,
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.y : MEANING_ROLE_BOUNDS.y,
    );
  }
}
