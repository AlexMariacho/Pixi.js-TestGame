import { BaseScreen } from './BaseScreen';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { createDialogShell } from '../components/DialogShell';
import { createNavigationControls } from '../components/NavigationControls';
import { FIGMA_LAYOUT } from '../components/designTokens';

export class MainMenuScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const shell = createDialogShell({ subtitle: 'я диспетчер' });
    shell.position.set((FIGMA_LAYOUT.appWidth - FIGMA_LAYOUT.cardWidth) / 2, 205);

    const controls = createNavigationControls({
      onPrev: () => this.uiManager.goBack(),
      onNext: () => this.uiManager.show(SCREEN_IDS.settings),
      onSelect: () => this.uiManager.show(SCREEN_IDS.settings),
    });

    shell.addChild(controls);
    this.view.addChild(shell);
  }
}
