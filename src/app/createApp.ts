import { Application } from 'pixi.js';
import { UIManager } from '../ui/manager/UIManager';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { MainMenuScreen } from '../ui/screens/MainMenuScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { ProfileScreen } from '../ui/screens/ProfileScreen';
import { FinalScreen } from '../ui/screens/FinalScreen';
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

  uiManager.register(SCREEN_IDS.mainMenu, () => new MainMenuScreen(uiManager));
  uiManager.register(SCREEN_IDS.settings, () => new SettingsScreen(uiManager));
  uiManager.register(SCREEN_IDS.profile, () => new ProfileScreen(uiManager));
  uiManager.register(SCREEN_IDS.final, () => new FinalScreen(uiManager));

  return { app, uiManager };
}
