# UI Layout And Coordinates

## Source of truth
- Coordinates export: `src/assets/figma/coordinates.template.json`
- Raw Figma payload for node `0:1`: `src/assets/figma/page-0-1.raw.json`
- Extracted implementation decisions: `src/assets/figma/ui-decisions.md`

## Base canvas
- Design canvas: `1440x1024`
- Set in `FIGMA_LAYOUT` (`src/ui/components/designTokens.ts`)

## Responsive strategy
- Screens keep Figma coordinates in design-space (`1440x1024`).
- Runtime keeps base scale `1` by default (no upscaling and no immediate downscaling).
- UI starts shrinking only when viewport is smaller than `base / 1.3` on either axis.
- Active scale formula: `min(viewportWidth / (1440 / 1.3), viewportHeight / (1024 / 1.3), 1)`.
- Scaled UI is centered in viewport (letterboxing when aspect ratio differs).
- This preserves proportions of all elements and hit areas.

## Main interactive bounds (Desktop - 1)
- Left arrow hit area: `{ x: 521, y: 570, width: 50, height: 50 }`
- Right arrow hit area: `{ x: 869, y: 570, width: 50, height: 50 }`
- Select button hit area: `{ x: 595, y: 560, width: 250, height: 70 }`
- Used in `src/ui/screens/MainScreen.ts`

## Token mapping
- Colors/fonts/layout come from `designTokens.ts`.
- Reusable card geometry and button drawing come from `OracleCard.ts`.
- Screen files should only place screen-specific text/content and click areas.

## Rule for future edits
- If Figma coordinates change, update `src/assets/figma/*.json` first, then sync screen constants.
- Keep screen coordinates in design-space; avoid per-screen manual resize math.
