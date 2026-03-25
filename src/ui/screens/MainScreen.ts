import { Container, Graphics, Text } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { BaseScreen } from './BaseScreen';
import { SCREEN_TEXT } from './screenText';
import { createClickArea } from '../components/ClickArea';
import { DESKTOP_1, DESKTOP_2 } from './desktopFrames';
import { SCREEN_TEXT_STYLES } from '../components/screenTextStyles';

type MainState = 'dispatcher' | 'meaning';

type RoleBounds = {
  x: number;
  y: number;
};

type MainStateConfig = {
  layer: Container;
  leftArrowSprite: Container | null;
  rightArrowSprite: Container | null;
  selectButtonSprite: Container | null;
  clickAreas: Graphics[];
  roleText: string;
  roleBounds: RoleBounds;
};

const LEFT_ARROW_BOUNDS = { x: 521, y: 570, width: 50, height: 50 };
const RIGHT_ARROW_BOUNDS = { x: 869, y: 570, width: 50, height: 50 };
const SELECT_BUTTON_BOUNDS = { x: 595, y: 560, width: 250, height: 70 };
const TITLE_BOUNDS = { x: 521, y: 400 };
const SELECT_BUTTON_LABEL_BOUNDS = { x: 638, y: 582 };
const DISPATCHER_ROLE_BOUNDS = { x: 627, y: 469 };
const MEANING_ROLE_BOUNDS = { x: 596, y: 469 };

export class MainScreen extends BaseScreen {
  private readonly titleLabel = new Text({
    text: SCREEN_TEXT.title,
    style: SCREEN_TEXT_STYLES.titleDark48,
  });

  private readonly roleLabel = new Text({
    text: SCREEN_TEXT.dispatcherRole,
    style: SCREEN_TEXT_STYLES.bodyDark48,
  });

  private readonly selectButtonLabel = new Text({
    text: SCREEN_TEXT.selectButton,
    style: SCREEN_TEXT_STYLES.buttonLight32,
  });

  private readonly states: Record<MainState, MainStateConfig>;
  private selectedState: MainState = 'dispatcher';

  constructor(private readonly uiManager: UIManager) {
    super();

    const desktop1Scene = DESKTOP_1.buildScene();
    const desktop2Scene = DESKTOP_2.buildScene();

    this.states = {
      dispatcher: {
        layer: desktop1Scene.container,
        leftArrowSprite: desktop1Scene.nodes.get(DESKTOP_1.elements.leftArrowGroup)?.sprite ?? null,
        rightArrowSprite: desktop1Scene.nodes.get(DESKTOP_1.elements.rightArrowGroup)?.sprite ?? null,
        selectButtonSprite: desktop1Scene.nodes.get(DESKTOP_1.elements.selectButtonRect)?.sprite ?? null,
        clickAreas: [],
        roleText: SCREEN_TEXT.dispatcherRole,
        roleBounds: DISPATCHER_ROLE_BOUNDS,
      },
      meaning: {
        layer: desktop2Scene.container,
        leftArrowSprite: desktop2Scene.nodes.get(DESKTOP_2.elements.leftArrowGroup)?.sprite ?? null,
        rightArrowSprite: desktop2Scene.nodes.get(DESKTOP_2.elements.rightArrowGroup)?.sprite ?? null,
        selectButtonSprite: desktop2Scene.nodes.get(DESKTOP_2.elements.selectButtonRect)?.sprite ?? null,
        clickAreas: [],
        roleText: SCREEN_TEXT.meaningRole,
        roleBounds: MEANING_ROLE_BOUNDS,
      },
    };
  }

  build(): void {
    this.titleLabel.position.set(TITLE_BOUNDS.x, TITLE_BOUNDS.y);
    this.selectButtonLabel.position.set(SELECT_BUTTON_LABEL_BOUNDS.x, SELECT_BUTTON_LABEL_BOUNDS.y);

    this.view.addChild(
      this.states.dispatcher.layer,
      this.states.meaning.layer,
      this.titleLabel,
      this.roleLabel,
      this.selectButtonLabel,
    );

    this.addStateClickAreas('dispatcher');
    this.addStateClickAreas('meaning');

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
    const activeState = this.states[this.selectedState];
    const inactiveState = this.states[this.selectedState === 'dispatcher' ? 'meaning' : 'dispatcher'];

    activeState.layer.visible = true;
    inactiveState.layer.visible = false;

    this.setClickAreasVisible(activeState.clickAreas, true);
    this.setClickAreasVisible(inactiveState.clickAreas, false);

    this.roleLabel.text = activeState.roleText;
    this.roleLabel.position.set(activeState.roleBounds.x, activeState.roleBounds.y);
  }

  private addStateClickAreas(stateId: MainState): void {
    const state = this.states[stateId];
    const toggleHandler = () => this.toggleState();
    const selectHandler = () => this.selectCurrentState();

    const leftArrowArea = createClickArea(
      LEFT_ARROW_BOUNDS,
      toggleHandler,
      state.leftArrowSprite ? { animateTarget: state.leftArrowSprite } : undefined,
    );
    const rightArrowArea = createClickArea(
      RIGHT_ARROW_BOUNDS,
      toggleHandler,
      state.rightArrowSprite ? { animateTarget: state.rightArrowSprite } : undefined,
    );
    const selectButtonArea = createClickArea(
      SELECT_BUTTON_BOUNDS,
      selectHandler,
      state.selectButtonSprite ? { animateTarget: state.selectButtonSprite } : undefined,
    );

    state.clickAreas.push(leftArrowArea, rightArrowArea, selectButtonArea);
    this.view.addChild(leftArrowArea, rightArrowArea, selectButtonArea);
  }

  private setClickAreasVisible(clickAreas: Graphics[], visible: boolean): void {
    for (const area of clickAreas) {
      area.visible = visible;
    }
  }
}
