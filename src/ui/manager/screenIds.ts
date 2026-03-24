export const SCREEN_IDS = {
  mainMenu: 'main-menu',
  settings: 'settings',
  profile: 'profile',
  final: 'final',
} as const;

export type ScreenId = (typeof SCREEN_IDS)[keyof typeof SCREEN_IDS];
