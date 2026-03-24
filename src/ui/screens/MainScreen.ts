import { Container, Graphics, Text } from 'pixi.js';
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
const TITLE_BOUNDS = { x: 521, y: 400 };
const SELECT_BUTTON_LABEL_BOUNDS = { x: 638, y: 582 };
const DISPATCHER_ROLE_BOUNDS = { x: 627, y: 469 };
const MEANING_ROLE_BOUNDS = { x: 596, y: 469 };

const TITLE_TEXT = 'ДОБРЫЙ ВЕЧЕР';
const SELECT_BUTTON_TEXT = 'ВЫБРАТЬ';
const DISPATCHER_ROLE_TEXT = 'я диспетчер';
const MEANING_ROLE_TEXT = 'а что это значит?';

export class MainScreen extends BaseScreen {
  private readonly titleLabel = new Text({
    text: TITLE_TEXT,
    style: {
      fontFamily: FIGMA_FONTS.heading,
      fontSize: 48,
      fill: FIGMA_COLORS.textDark,
      fontWeight: '400',
    },
  });

  private readonly roleLabel = new Text({
    text: DISPATCHER_ROLE_TEXT,
    style: {
      fontFamily: FIGMA_FONTS.body,
      fontSize: 48,
      fill: FIGMA_COLORS.textDark,
      fontWeight: '400',
    },
  });

  private readonly selectButtonLabel = new Text({
    text: SELECT_BUTTON_TEXT,
    style: {
      fontFamily: FIGMA_FONTS.heading,
      fontSize: 32,
      fill: FIGMA_COLORS.textLight,
      fontWeight: '400',
    },
  });

  private readonly desktop1Layer: Container;
  private readonly desktop2Layer: Container;
  private readonly desktop1LeftArrowSprite: Container | null;
  private readonly desktop1RightArrowSprite: Container | null;
  private readonly desktop1SelectButtonSprite: Container | null;
  private readonly desktop2LeftArrowSprite: Container | null;
  private readonly desktop2RightArrowSprite: Container | null;
  private readonly desktop2SelectButtonSprite: Container | null;
  private readonly desktop1ClickAreas: Graphics[] = [];
  private readonly desktop2ClickAreas: Graphics[] = [];
  private selectedState: MainState = 'dispatcher';

  constructor(private readonly uiManager: UIManager) {
    super();

    const desktop1Scene = DESKTOP_1.buildScene();
    const desktop2Scene = DESKTOP_2.buildScene();

    this.desktop1Layer = desktop1Scene.container;
    this.desktop2Layer = desktop2Scene.container;

    this.desktop1LeftArrowSprite = desktop1Scene.nodes.get(DESKTOP_1.elements.leftArrowGroup)?.sprite ?? null;
    this.desktop1RightArrowSprite = desktop1Scene.nodes.get(DESKTOP_1.elements.rightArrowGroup)?.sprite ?? null;
    this.desktop1SelectButtonSprite = desktop1Scene.nodes.get(DESKTOP_1.elements.selectButtonRect)?.sprite ?? null;

    this.desktop2LeftArrowSprite = desktop2Scene.nodes.get(DESKTOP_2.elements.leftArrowGroup)?.sprite ?? null;
    this.desktop2RightArrowSprite = desktop2Scene.nodes.get(DESKTOP_2.elements.rightArrowGroup)?.sprite ?? null;
    this.desktop2SelectButtonSprite = desktop2Scene.nodes.get(DESKTOP_2.elements.selectButtonRect)?.sprite ?? null;
  }

  build(): void {
    this.titleLabel.position.set(TITLE_BOUNDS.x, TITLE_BOUNDS.y);
    this.selectButtonLabel.position.set(SELECT_BUTTON_LABEL_BOUNDS.x, SELECT_BUTTON_LABEL_BOUNDS.y);

    this.view.addChild(this.desktop1Layer, this.desktop2Layer, this.titleLabel, this.roleLabel, this.selectButtonLabel);

    const desktop1LeftArrowArea = createClickArea(LEFT_ARROW_BOUNDS, () => this.toggleState(), this.desktop1LeftArrowSprite ? { animateTarget: this.desktop1LeftArrowSprite } : undefined);
    const desktop1RightArrowArea = createClickArea(RIGHT_ARROW_BOUNDS, () => this.toggleState(), this.desktop1RightArrowSprite ? { animateTarget: this.desktop1RightArrowSprite } : undefined);
    const desktop1SelectButtonArea = createClickArea(SELECT_BUTTON_BOUNDS, () => this.selectCurrentState(), this.desktop1SelectButtonSprite ? { animateTarget: this.desktop1SelectButtonSprite } : undefined);

    const desktop2LeftArrowArea = createClickArea(LEFT_ARROW_BOUNDS, () => this.toggleState(), this.desktop2LeftArrowSprite ? { animateTarget: this.desktop2LeftArrowSprite } : undefined);
    const desktop2RightArrowArea = createClickArea(RIGHT_ARROW_BOUNDS, () => this.toggleState(), this.desktop2RightArrowSprite ? { animateTarget: this.desktop2RightArrowSprite } : undefined);
    const desktop2SelectButtonArea = createClickArea(SELECT_BUTTON_BOUNDS, () => this.selectCurrentState(), this.desktop2SelectButtonSprite ? { animateTarget: this.desktop2SelectButtonSprite } : undefined);

    this.desktop1ClickAreas.push(desktop1LeftArrowArea, desktop1RightArrowArea, desktop1SelectButtonArea);
    this.desktop2ClickAreas.push(desktop2LeftArrowArea, desktop2RightArrowArea, desktop2SelectButtonArea);

    this.view.addChild(
      desktop1LeftArrowArea,
      desktop1RightArrowArea,
      desktop1SelectButtonArea,
      desktop2LeftArrowArea,
      desktop2RightArrowArea,
      desktop2SelectButtonArea,
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
    for (const area of this.desktop1ClickAreas) {
      area.visible = isDispatcher;
    }
    for (const area of this.desktop2ClickAreas) {
      area.visible = !isDispatcher;
    }

    this.roleLabel.text = isDispatcher ? DISPATCHER_ROLE_TEXT : MEANING_ROLE_TEXT;
    this.roleLabel.position.set(
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.x : MEANING_ROLE_BOUNDS.x,
      isDispatcher ? DISPATCHER_ROLE_BOUNDS.y : MEANING_ROLE_BOUNDS.y,
    );
  }
}
