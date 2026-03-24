import { Sprite } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import desktop1Texture from '../../assets/textures/figma/desktop-1.png';
import desktop2Texture from '../../assets/textures/figma/desktop-2.png';

type MainState = 'dispatcher' | 'meaning';

const LEFT_ARROW_BOUNDS = { x: 521, y: 570, width: 50, height: 50 };
const RIGHT_ARROW_BOUNDS = { x: 869, y: 570, width: 50, height: 50 };
const SELECT_BUTTON_BOUNDS = { x: 595, y: 560, width: 250, height: 70 };

export class MainScreen extends BaseScreen {
  private readonly dispatcherSprite = Sprite.from(desktop1Texture);
  private readonly meaningSprite = Sprite.from(desktop2Texture);
  private selectedState: MainState = 'dispatcher';

  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    this.view.addChild(this.dispatcherSprite, this.meaningSprite);

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
    const isDispatcherState = this.selectedState === 'dispatcher';
    this.dispatcherSprite.visible = isDispatcherState;
    this.meaningSprite.visible = !isDispatcherState;
  }
}
