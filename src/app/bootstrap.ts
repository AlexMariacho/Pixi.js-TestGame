import { createApp } from './createApp';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { loadFigmaFonts } from '../assets/fonts/loadFigmaFonts';

export async function bootstrap(container: HTMLElement = document.body): Promise<void> {
  try {
    await loadFigmaFonts();
  } catch (error) {
    console.warn('Failed to load figma fonts. Continuing with fallback fonts.', error);
  }

  const { app, uiManager } = await createApp(container);

  container.appendChild(app.canvas);
  uiManager.show(SCREEN_IDS.main);
}
