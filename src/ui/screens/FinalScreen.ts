import { BaseScreen } from './BaseScreen';
import type { UIManager } from '../manager/UIManager';
import { createAcceptControl } from '../components/AcceptControl';
import { createDialogShell } from '../components/DialogShell';
import { createRatingStars } from '../components/RatingStars';
import { createTextPanel } from '../components/TextPanel';
import { FIGMA_LAYOUT } from '../components/designTokens';

const FINAL_TEXT =
  'Почему вообще люди ждут конца света? И почему, если таковой предстоит, ' +
  'он обязательно должен быть для большинства человеческого рода ужасным?.. ' +
  'Ответ на первый вопрос состоит, по-видимому, в том, что существование мира, ' +
  'как подсказывает людям разум, имеет ценность лишь постольку, поскольку ' +
  'разумные существа соответствуют';

export class FinalScreen extends BaseScreen {
  constructor(private readonly uiManager: UIManager) {
    super();
  }

  build(): void {
    const shell = createDialogShell({ subtitle: '' });
    shell.position.set((FIGMA_LAYOUT.appWidth - FIGMA_LAYOUT.cardWidth) / 2, 205);

    const stars = createRatingStars();
    const panel = createTextPanel(FINAL_TEXT);
    const accept = createAcceptControl(() => this.uiManager.goBack());

    shell.addChild(stars, panel, accept);
    this.view.addChild(shell);
  }
}
