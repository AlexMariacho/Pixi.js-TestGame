import { Application } from 'pixi.js';
import { UIManager } from '../ui/manager/UIManager';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { MainScreen } from '../ui/screens/MainScreen';
import { DispatcherResultScreen } from '../ui/screens/DispatcherResultScreen';
import { MeaningResultScreen } from '../ui/screens/MeaningResultScreen';
import { FIGMA_COLORS, FIGMA_LAYOUT } from '../ui/components/designTokens';

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

  const uiManager = new UIManager(app.stage);

  uiManager.register(SCREEN_IDS.main, () => new MainScreen(uiManager));
  uiManager.register(SCREEN_IDS.dispatcherResult, () => new DispatcherResultScreen(uiManager));
  uiManager.register(SCREEN_IDS.meaningResult, () => new MeaningResultScreen(uiManager));

  return { app, uiManager };
}
