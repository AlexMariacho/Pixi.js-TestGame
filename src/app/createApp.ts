import { Application, Assets } from 'pixi.js';
import { UIManager } from '../ui/manager/UIManager';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { MainScreen } from '../ui/screens/MainScreen';
import { DispatcherResultScreen } from '../ui/screens/DispatcherResultScreen';
import { MeaningResultScreen } from '../ui/screens/MeaningResultScreen';
import { FIGMA_COLORS, FIGMA_LAYOUT } from '../ui/components/designTokens';
import desktop1Texture from '../assets/textures/figma/desktop-1.png';
import desktop2Texture from '../assets/textures/figma/desktop-2.png';
import desktop3Texture from '../assets/textures/figma/desktop-3.png';
import desktop4Texture from '../assets/textures/figma/desktop-4.png';

export type AppContext = {
  app: Application;
  uiManager: UIManager;
};

export async function createApp(): Promise<AppContext> {
  const app = new Application();

  await app.init({
    width: FIGMA_LAYOUT.appWidth,
    height: FIGMA_LAYOUT.appHeight,
    background: `#${FIGMA_COLORS.canvas.toString(16).padStart(6, '0')}`,
    antialias: true,
  });

  await Assets.load([desktop1Texture, desktop2Texture, desktop3Texture, desktop4Texture]);

  const uiManager = new UIManager(app.stage);

  uiManager.register(SCREEN_IDS.main, () => new MainScreen(uiManager));
  uiManager.register(SCREEN_IDS.dispatcherResult, () => new DispatcherResultScreen(uiManager));
  uiManager.register(SCREEN_IDS.meaningResult, () => new MeaningResultScreen(uiManager));

  return { app, uiManager };
}
