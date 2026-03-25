import { FIGMA_COLORS, FIGMA_FONTS } from './designTokens';

export const SCREEN_TEXT_STYLES = {
  titleDark48: {
    fontFamily: FIGMA_FONTS.heading,
    fontSize: 48,
    fill: FIGMA_COLORS.textDark,
    fontWeight: '400',
  } as const,
  bodyDark48: {
    fontFamily: FIGMA_FONTS.body,
    fontSize: 48,
    fill: FIGMA_COLORS.textDark,
    fontWeight: '400',
  } as const,
  buttonLight32: {
    fontFamily: FIGMA_FONTS.heading,
    fontSize: 32,
    fill: FIGMA_COLORS.textLight,
    fontWeight: '400',
  } as const,
  compactDark11: {
    fontFamily: FIGMA_FONTS.compact,
    fontSize: 11,
    fill: FIGMA_COLORS.textDark,
    lineHeight: 17.055,
  } as const,
} as const;
