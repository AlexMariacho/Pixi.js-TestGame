import { createApp } from './createApp';
import { SCREEN_IDS } from '../ui/manager/screenIds';

export async function bootstrap(container: HTMLElement = document.body): Promise<void> {
  const { app, uiManager } = await createApp();

  container.appendChild(app.canvas);
  uiManager.show(SCREEN_IDS.mainMenu);
}
