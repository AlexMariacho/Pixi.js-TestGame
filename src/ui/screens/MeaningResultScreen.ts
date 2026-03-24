import { Sprite } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import desktop4Texture from '../../assets/textures/figma/desktop-4.png';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 631, width: 50, height: 50 };

export class MeaningResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    this.view.addChild(Sprite.from(desktop4Texture));
    this.view.addChild(createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack()));
  }
}
