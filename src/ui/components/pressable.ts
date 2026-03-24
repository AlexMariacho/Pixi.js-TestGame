import { Container, Graphics, Ticker } from 'pixi.js';

type PressableTarget = Container | Graphics;

export type PressableOptions = {
  pressedOffsetY?: number;
  pressedAlpha?: number;
  hoverAlpha?: number;
  pressedScale?: number;
  hoverScale?: number;
  animationDurationMs?: number;
};

const DEFAULT_OPTIONS: Required<PressableOptions> = {
  pressedOffsetY: 0,
  pressedAlpha: 0.9,
  hoverAlpha: 0.93,
  pressedScale: 1.15,
  hoverScale: 1.08,
  animationDurationMs: 70,
};

export function bindPressable(
  interactive: PressableTarget,
  visualTarget: PressableTarget,
  onTap: () => void,
  options?: PressableOptions,
): void {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const baseY = visualTarget.y;
  const baseX = visualTarget.x;
  const baseAlpha = visualTarget.alpha;
  const baseScaleX = visualTarget.scale.x;
  const baseScaleY = visualTarget.scale.y;
  const baseBounds = visualTarget.getLocalBounds();
  const centerX = baseBounds.x + baseBounds.width / 2;
  const centerY = baseBounds.y + baseBounds.height / 2;
  let pressed = false;
  let hovered = false;
  let targetX = baseX;
  let targetY = baseY;
  let targetAlpha = baseAlpha;
  let targetScaleX = baseScaleX;
  let targetScaleY = baseScaleY;
  let tickerAttached = false;

  interactive.eventMode = 'static';
  interactive.cursor = 'pointer';

  const updateTargets = (): void => {
    const scaleFactor = pressed ? settings.pressedScale : hovered ? settings.hoverScale : 1;
    targetScaleX = baseScaleX * scaleFactor;
    targetScaleY = baseScaleY * scaleFactor;
    targetX = baseX + centerX * (baseScaleX - targetScaleX);
    targetY = baseY + centerY * (baseScaleY - targetScaleY) + (pressed ? settings.pressedOffsetY : 0);

    if (pressed) {
      targetAlpha = baseAlpha * settings.pressedAlpha;
      return;
    }

    targetAlpha = hovered ? baseAlpha * settings.hoverAlpha : baseAlpha;
  };

  const detachTicker = (): void => {
    if (!tickerAttached) {
      return;
    }

    Ticker.shared.remove(animate);
    tickerAttached = false;
  };

  const attachTicker = (): void => {
    if (tickerAttached) {
      return;
    }

    tickerAttached = true;
    Ticker.shared.add(animate);
  };

  const animate = (ticker: Ticker): void => {
    if (interactive.destroyed || visualTarget.destroyed) {
      detachTicker();
      return;
    }

    const blend = 1 - Math.exp(-ticker.deltaMS / settings.animationDurationMs);
    visualTarget.x += (targetX - visualTarget.x) * blend;
    visualTarget.y += (targetY - visualTarget.y) * blend;
    visualTarget.alpha += (targetAlpha - visualTarget.alpha) * blend;
    visualTarget.scale.x += (targetScaleX - visualTarget.scale.x) * blend;
    visualTarget.scale.y += (targetScaleY - visualTarget.scale.y) * blend;

    const doneX = Math.abs(visualTarget.x - targetX) < 0.01;
    const doneY = Math.abs(visualTarget.y - targetY) < 0.01;
    const doneAlpha = Math.abs(visualTarget.alpha - targetAlpha) < 0.01;
    const doneScaleX = Math.abs(visualTarget.scale.x - targetScaleX) < 0.001;
    const doneScaleY = Math.abs(visualTarget.scale.y - targetScaleY) < 0.001;
    if (!doneX || !doneY || !doneAlpha || !doneScaleX || !doneScaleY) {
      return;
    }

    visualTarget.x = targetX;
    visualTarget.y = targetY;
    visualTarget.alpha = targetAlpha;
    visualTarget.scale.set(targetScaleX, targetScaleY);
    detachTicker();
  };

  const refreshState = (): void => {
    updateTargets();
    attachTicker();
  };

  interactive.on('pointerover', () => {
    hovered = true;
    refreshState();
  });
  interactive.on('pointerout', () => {
    hovered = false;
    pressed = false;
    refreshState();
  });
  interactive.on('pointerdown', () => {
    pressed = true;
    refreshState();
  });
  interactive.on('pointerup', () => {
    pressed = false;
    refreshState();
  });
  interactive.on('pointerupoutside', () => {
    pressed = false;
    refreshState();
  });
  interactive.on('pointertap', onTap);
}
