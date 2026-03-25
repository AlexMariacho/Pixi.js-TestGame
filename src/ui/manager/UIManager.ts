import { Container } from 'pixi.js';
import type { ScreenId } from './screenIds';
import { SCREEN_IDS } from './screenIds';
import type { BaseScreen } from '../screens/BaseScreen';
import { FIGMA_LAYOUT } from '../components/designTokens';
import { fadeTransition } from '../transitions/fadeTransition';
import type { TransitionDirection } from '../transitions/fadeTransition';

type PendingNavigation = {
  id: ScreenId;
  saveHistory: boolean;
};

const ANIMATED_SCREEN_IDS = new Set<ScreenId>([
  SCREEN_IDS.main,
  SCREEN_IDS.dispatcherResult,
  SCREEN_IDS.meaningResult,
]);
const TRANSITION_DURATION_MS = 220;

export class UIManager {
  private readonly root: Container;
  private readonly factories = new Map<ScreenId, () => BaseScreen>();
  private readonly instances = new Map<ScreenId, BaseScreen>();
  private readonly history: ScreenId[] = [];

  private currentId: ScreenId | null = null;
  private isTransitioning = false;
  private pendingNavigation: PendingNavigation | null = null;

  constructor(root: Container) {
    this.root = root;
  }

  register(id: ScreenId, factory: () => BaseScreen): void {
    if (this.factories.has(id)) {
      throw new Error(`Screen already registered: ${id}`);
    }

    this.factories.set(id, factory);
  }

  show(id: ScreenId): void {
    this.navigate(id, true);
  }

  goBack(): void {
    const prev = this.history.pop();
    if (!prev) {
      return;
    }

    this.navigate(prev, false);
  }

  private navigate(id: ScreenId, saveHistory: boolean): void {
    if (this.isTransitioning) {
      this.pendingNavigation = { id, saveHistory };
      return;
    }

    void this.showInternal(id, saveHistory);
  }

  private async showInternal(id: ScreenId, saveHistory: boolean): Promise<void> {
    if (this.currentId === id) {
      return;
    }

    this.isTransitioning = true;

    try {
      const previousId = this.currentId;
      const previousScreen = previousId ? this.instances.get(previousId) ?? null : null;
      const nextScreen = this.getOrCreate(id);

      if (previousId && saveHistory) {
        this.history.push(previousId);
      }

      nextScreen.view.alpha = 1;
      this.root.addChild(nextScreen.view);
      nextScreen.show();

      if (previousId && previousScreen) {
        if (this.canAnimateTransition(previousId, id)) {
          await fadeTransition(
            previousScreen.view,
            nextScreen.view,
            TRANSITION_DURATION_MS,
            this.resolveTransitionDirection(previousId, id),
          );
        }

        previousScreen.hide();
      }

      nextScreen.view.alpha = 1;
      this.currentId = id;
    } finally {
      this.isTransitioning = false;

      if (this.pendingNavigation) {
        const pending = this.pendingNavigation;
        this.pendingNavigation = null;
        this.navigate(pending.id, pending.saveHistory);
      }
    }
  }

  private getOrCreate(id: ScreenId): BaseScreen {
    const existing = this.instances.get(id);
    if (existing) {
      return existing;
    }

    const factory = this.factories.get(id);
    if (!factory) {
      throw new Error(`Screen not registered: ${id}`);
    }

    const screen = factory();
    screen.build();
    this.centerScreenVertically(screen);
    this.instances.set(id, screen);
    return screen;
  }

  private centerScreenVertically(screen: BaseScreen): void {
    const bounds = screen.view.getLocalBounds();
    const screenCenterY = bounds.y + bounds.height / 2;
    const layoutCenterY = FIGMA_LAYOUT.appHeight / 2;
    screen.view.y += layoutCenterY - screenCenterY;
  }

  private canAnimateTransition(fromId: ScreenId, toId: ScreenId): boolean {
    return ANIMATED_SCREEN_IDS.has(fromId) && ANIMATED_SCREEN_IDS.has(toId);
  }

  private resolveTransitionDirection(fromId: ScreenId, toId: ScreenId): TransitionDirection {
    if (toId === SCREEN_IDS.main && fromId !== SCREEN_IDS.main) {
      return 'backward';
    }

    return 'forward';
  }
}
