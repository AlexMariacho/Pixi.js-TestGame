import type { Container } from 'pixi.js';

const DEFAULT_DURATION_MS = 220;
const MIN_SLIDE_OFFSET_PX = 120;
const MAX_SLIDE_OFFSET_PX = 320;
const SLIDE_OFFSET_FACTOR = 0.22;
export type TransitionDirection = 'forward' | 'backward';

function easeOutCubic(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return 1 - (1 - clamped) ** 3;
}

function resolveSlideOffset(fromView: Container, toView: Container): number {
  const fromBounds = fromView.getLocalBounds();
  const toBounds = toView.getLocalBounds();
  const baseWidth = Math.max(fromBounds.width, toBounds.width, 1);
  const offset = baseWidth * SLIDE_OFFSET_FACTOR;
  return Math.min(Math.max(offset, MIN_SLIDE_OFFSET_PX), MAX_SLIDE_OFFSET_PX);
}

export function fadeTransition(
  fromView: Container,
  toView: Container,
  durationMs: number = DEFAULT_DURATION_MS,
  direction: TransitionDirection = 'forward',
): Promise<void> {
  const fromStartX = fromView.x;
  const toStartX = toView.x;
  const slideOffset = resolveSlideOffset(fromView, toView);
  const directionSign = direction === 'forward' ? 1 : -1;

  if (durationMs <= 0) {
    fromView.alpha = 1;
    fromView.x = fromStartX;
    toView.alpha = 1;
    toView.x = toStartX;
    return Promise.resolve();
  }

  fromView.alpha = 1;
  fromView.x = fromStartX;
  toView.alpha = 0;
  toView.x = toStartX + slideOffset * directionSign;

  return new Promise((resolve) => {
    const startTime = performance.now();

    const step = (now: number): void => {
      const linearProgress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = easeOutCubic(linearProgress);

      fromView.alpha = 1 - easedProgress;
      fromView.x = fromStartX - slideOffset * easedProgress * directionSign;
      toView.alpha = easedProgress;
      toView.x = toStartX + slideOffset * (1 - easedProgress) * directionSign;

      if (linearProgress >= 1) {
        fromView.alpha = 1;
        fromView.x = fromStartX;
        toView.alpha = 1;
        toView.x = toStartX;
        resolve();
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}
