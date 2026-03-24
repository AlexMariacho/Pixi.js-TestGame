import { createApp } from './createApp';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { loadFigmaFonts } from '../assets/fonts/loadFigmaFonts';

export async function bootstrap(container: HTMLElement = document.body): Promise<void> {
  await loadFigmaFonts();
  const { app, uiManager } = await createApp();

  container.appendChild(app.canvas);
  uiManager.show(SCREEN_IDS.mainMenu);
}
