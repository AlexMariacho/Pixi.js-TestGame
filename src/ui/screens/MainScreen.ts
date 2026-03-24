import { Container, Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_1, DESKTOP_2 } from './desktopFrames';
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

  private readonly desktop1Layer: Container;
  private readonly desktop2Layer: Container;
  private selectedState: MainState = 'dispatcher';

  constructor(private readonly uiManager: UIManager) {
    super();

    this.desktop1Layer = DESKTOP_1.buildScene().container;
    this.desktop2Layer = DESKTOP_2.buildScene().container;
  }

  build(): void {
    this.view.addChild(this.desktop1Layer, this.desktop2Layer, this.roleLabel);

    this.view.addChild(
      createClickArea(LEFT_ARROW_BOUNDS, () => this.toggleState()),
      createClickArea(RIGHT_ARROW_BOUNDS, () => this.toggleState()),
      createClickArea(SELECT_BUTTON_BOUNDS, () => this.selectCurrentState()),
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

    this.desktop1Layer.visible = isDispatcher;
    this.desktop2Layer.visible = !isDispatcher;

    this.roleLabel.text = isDispatcher ? 'я диспетчер' : 'а что это значит?';
    this.roleLabel.position.set(
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.x : MEANING_ROLE_BOUNDS.x,
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.y : MEANING_ROLE_BOUNDS.y,
    );
  }
}
