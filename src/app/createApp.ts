import { Container, Application } from 'pixi.js';
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

export async function createApp(container: HTMLElement = document.body): Promise<AppContext> {
  const app = new Application();

  await app.init({
    resizeTo: container,
    background: `#${FIGMA_COLORS.canvas.toString(16).padStart(6, '0')}`,
    antialias: true,
    autoDensity: true,
    resolution: Math.max(window.devicePixelRatio || 1, 2),
    roundPixels: true,
  });

  const uiRoot = new Container();
  app.stage.addChild(uiRoot);

  const uiManager = new UIManager(uiRoot);

  uiManager.register(SCREEN_IDS.main, () => new MainScreen(uiManager));
  uiManager.register(SCREEN_IDS.dispatcherResult, () => new DispatcherResultScreen(uiManager));
  uiManager.register(SCREEN_IDS.meaningResult, () => new MeaningResultScreen(uiManager));

  const syncResponsiveLayout = (): void => {
    const viewportWidth = app.screen.width;
    const viewportHeight = app.screen.height;
    const shrinkThresholdFactor = 1.3;
    const shrinkStartWidth = FIGMA_LAYOUT.appWidth / shrinkThresholdFactor;
    const shrinkStartHeight = FIGMA_LAYOUT.appHeight / shrinkThresholdFactor;
    const layoutScale = Math.min(viewportWidth / shrinkStartWidth, viewportHeight / shrinkStartHeight, 1);
    const centeredX = (viewportWidth - FIGMA_LAYOUT.appWidth * layoutScale) / 2;
    const centeredY = (viewportHeight - FIGMA_LAYOUT.appHeight * layoutScale) / 2;

    uiRoot.scale.set(layoutScale);
    uiRoot.position.set(centeredX, centeredY);
  };

  app.renderer.on('resize', syncResponsiveLayout);
  syncResponsiveLayout();

  return { app, uiManager };
}
