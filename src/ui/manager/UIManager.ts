import { Container } from 'pixi.js';
import type { ScreenId } from './screenIds';
import type { BaseScreen } from '../screens/BaseScreen';

export class UIManager {
  private readonly root: Container;
  private readonly factories = new Map<ScreenId, () => BaseScreen>();
  private readonly instances = new Map<ScreenId, BaseScreen>();
  private readonly history: ScreenId[] = [];

  private currentId: ScreenId | null = null;

  constructor(root: Container) {
    this.root = root;
  }

  register(id: ScreenId, factory: () => BaseScreen): void {
    this.factories.set(id, factory);
  }

  show(id: ScreenId): void {
    this.showInternal(id, true);
  }

  goBack(): void {
    const prev = this.history.pop();
    if (!prev) {
      return;
    }

    this.showInternal(prev, false);
  }

  private showInternal(id: ScreenId, saveHistory: boolean): void {
    if (this.currentId === id) {
      return;
    }

    if (this.currentId && saveHistory) {
      const current = this.instances.get(this.currentId);
      current?.hide();
      this.history.push(this.currentId);
    } else if (this.currentId) {
      const current = this.instances.get(this.currentId);
      current?.hide();
    }

    const screen = this.getOrCreate(id);
    this.root.addChild(screen.view);
    screen.show();

    this.currentId = id;
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
    this.instances.set(id, screen);
    return screen;
  }
}
