import { BaseScreen } from './BaseScreen';
import type { UIManager } from '../manager/UIManager';
import { SCREEN_IDS } from '../manager/screenIds';
import { createAcceptControl } from '../components/AcceptControl';
import { createDialogShell } from '../components/DialogShell';
import { createRatingStars } from '../components/RatingStars';
import { FIGMA_LAYOUT } from '../components/designTokens';

export class ProfileScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const shell = createDialogShell({ subtitle: 'вот и думайте' });
    shell.position.set((FIGMA_LAYOUT.appWidth - FIGMA_LAYOUT.cardWidth) / 2, 205);

    const stars = createRatingStars();
    const accept = createAcceptControl(() => this.uiManager.show(SCREEN_IDS.final));

    shell.addChild(stars, accept);
    this.view.addChild(shell);
  }
}
