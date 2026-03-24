import { Container } from 'pixi.js';

export abstract class BaseScreen {
  public readonly view = new Container();

  abstract build(): void;

  show(): void {
    this.view.visible = true;
  }

  hide(): void {
    this.view.visible = false;
    if (this.view.parent) {
      this.view.parent.removeChild(this.view);
    }
  }

  destroy(): void {
    this.view.destroy({ children: true });
  }
}
