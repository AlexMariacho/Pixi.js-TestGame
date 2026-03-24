import { BaseScreen } from './BaseScreen';
import type { UIManager } from '../manager/UIManager';
import { createButton } from '../components/Button';
import { createLabel } from '../components/Label';
import { createPanel } from '../components/Panel';

export class SettingsScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const panel = createPanel(520, 420, 0x0f766e);
    panel.position.set(380, 140);

    const title = createLabel('Settings', 42);
    title.position.set(170, 40);

    const backButton = createButton({
      text: 'Back',
      onClick: () => this.uiManager.goBack(),
    });
    backButton.position.set(150, 300);

    panel.addChild(title, backButton);
    this.view.addChild(panel);
  }
}
