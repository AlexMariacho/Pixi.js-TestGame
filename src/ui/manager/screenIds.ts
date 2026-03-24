export const SCREEN_IDS = {
  main: 'main',
  dispatcherResult: 'dispatcher-result',
  meaningResult: 'meaning-result',
} as const;

export type ScreenId = (typeof SCREEN_IDS)[keyof typeof SCREEN_IDS];
