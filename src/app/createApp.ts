import { Application } from 'pixi.js';
import { UIManager } from '../ui/manager/UIManager';
import { SCREEN_IDS } from '../ui/manager/screenIds';
import { MainMenuScreen } from '../ui/screens/MainMenuScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { ProfileScreen } from '../ui/screens/ProfileScreen';

export type AppContext = {
  app: Application;
  uiManager: UIManager;
};

export async function createApp(): Promise<AppContext> {
  const app = new Application();

  await app.init({
    width: 1280,
    height: 720,
    background: '#0f172a',
    antialias: true,
  });

  const uiManager = new UIManager(app.stage);

  uiManager.register(SCREEN_IDS.mainMenu, () => new MainMenuScreen(uiManager));
  uiManager.register(SCREEN_IDS.settings, () => new SettingsScreen(uiManager));
  uiManager.register(SCREEN_IDS.profile, () => new ProfileScreen(uiManager));

  return { app, uiManager };
}
