import { BaseScreen } from './BaseScreen';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { createButton } from '../components/Button';
import { createLabel } from '../components/Label';
import { createPanel } from '../components/Panel';

export class MainMenuScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const panel = createPanel(520, 420);
    panel.position.set(380, 140);

    const title = createLabel('Main Menu', 42);
    title.position.set(160, 40);

    const settingsButton = createButton({
      text: 'Settings',
      onClick: () => this.uiManager.show(SCREEN_IDS.settings),
    });
    settingsButton.position.set(150, 160);

    const profileButton = createButton({
      text: 'Profile',
      onClick: () => this.uiManager.show(SCREEN_IDS.profile),
    });
    profileButton.position.set(150, 240);

    panel.addChild(title, settingsButton, profileButton);
    this.view.addChild(panel);
  }
}
