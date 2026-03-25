import { SCREEN_TEXT } from './screenText';

export const RESULT_SCREEN_TITLE_TEXT = SCREEN_TEXT.title;
export const RESULT_SCREEN_TITLE_BOUNDS = { x: 521, y: 400 } as const;

export const DISPATCHER_RESULT_SCREEN_LAYOUT = {
  windowOffset: { x: 9, y: 3 } as const,
  logoOffset: { x: 10, y: -3 } as const,
  starsOffset: { x: 10, y: 3 } as const,
  resultLabelBounds: { x: 613, y: 469 } as const,
  closeButtonBounds: { x: 704, y: 631, width: 50, height: 50 } as const,
} as const;

export const MEANING_RESULT_SCREEN_LAYOUT = {
  windowOffset: { x: 9, y: -7 } as const,
  logoOffset: { x: 10, y: -3 } as const,
  starsOffset: { x: 10, y: 3 } as const,
  closeButtonBounds: { x: 704, y: 631, width: 50, height: 50 } as const,
  textViewport: { x: 589, y: 474, width: 258, height: 129 } as const,
  scrollStep: 20,
  scrollThumbMinHeight: 16,
  scrollLaneX: 864,
  scrollLaneWidth: 15,
  scrollThumbTopLimit: 493,
  scrollThumbBottomLimit: 582.628,
  scrollThumbColor: 0x8c8f8f,
  scrollThumbBorderColor: 0x787b7b,
  scrollUpButtonBounds: { x: 864, y: 471, width: 15, height: 15 } as const,
  scrollDownButtonBounds: { x: 864, y: 590, width: 15, height: 15 } as const,
} as const;

export type MeaningResultScreenLayout = typeof MEANING_RESULT_SCREEN_LAYOUT;
