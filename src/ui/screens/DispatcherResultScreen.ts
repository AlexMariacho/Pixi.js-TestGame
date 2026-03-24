import { Sprite } from 'pixi.js';
import type { UIManager } from '../manager/UIManager';
import { BaseScreen } from './BaseScreen';
import { createClickArea } from '../components/ClickArea';
import desktop3Texture from '../../assets/textures/figma/desktop-3.png';

const CLOSE_BUTTON_BOUNDS = { x: 704, y: 590, width: 50, height: 50 };

export class DispatcherResultScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    this.view.addChild(Sprite.from(desktop3Texture));
    this.view.addChild(createClickArea(CLOSE_BUTTON_BOUNDS, () => this.uiManager.goBack()));
  }
}
