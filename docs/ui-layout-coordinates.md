# UI Layout And Coordinates

## Source of truth

- Coordinates export: `src/assets/figma/coordinates.template.json`
- Raw Figma payload for node `0:1`: `src/assets/figma/page-0-1.raw.json`
- Figma-to-Pixi notes: `src/assets/figma/ui-decisions.md`
- SVG export manifests and exported desktop assets: `src/assets/textures/figma/desktop-elements-svg/`

## Base canvas

- Design canvas: `1440x1024`
- Shared tokens: `src/ui/components/designTokens.ts`
- `FIGMA_LAYOUT` currently defines:
  - `appWidth: 1440`
  - `appHeight: 1024`
  - `cardWidth: 520`
  - `cardHeight: 507`

## Coordinate model

- Screen files and layout helpers store positions in Figma design-space coordinates.
- Exported frame nodes are positioned by `figmaCsvScene.ts` relative to their source frame.
- When exported render bounds differ from plain node bounds, runtime uses Figma `absoluteRenderBounds` to align sprites more accurately.
- Per-screen offsets in `desktopFrames.ts` and `resultScreenLayout.ts` compensate for specific exported asset alignment issues without changing the source manifests.

## Responsive strategy

- Runtime keeps base scale `1` by default.
- UI starts shrinking only when viewport width or height drops below `base / 1.3`.
- Active scale formula:

```text
min(viewportWidth / (1440 / 1.3), viewportHeight / (1024 / 1.3), 1)
```

- The scaled `uiRoot` is centered inside the viewport.
- This preserves relative spacing, hit areas, and sprite composition.

## Main screen coordinates

Location: `src/ui/screens/MainScreen.ts`

- Left arrow hit area: `{ x: 521, y: 570, width: 50, height: 50 }`
- Right arrow hit area: `{ x: 869, y: 570, width: 50, height: 50 }`
- Select button hit area: `{ x: 595, y: 560, width: 250, height: 70 }`
- Title label anchor: `{ x: 521, y: 400 }`
- Select button label anchor: `{ x: 638, y: 582 }`
- Role label anchors:
  - dispatcher: `{ x: 627, y: 469 }`
  - meaning: `{ x: 596, y: 469 }`

## Result screen shared layout

Location: `src/ui/screens/resultScreenLayout.ts`

- Shared title anchor: `{ x: 521, y: 400 }`
- Dispatcher result layout:
  - window offset: `{ x: 9, y: 3 }`
  - logo offset: `{ x: 10, y: -3 }`
  - stars offset: `{ x: 10, y: 3 }`
  - result label anchor: `{ x: 613, y: 469 }`
  - close button bounds: `{ x: 704, y: 631, width: 50, height: 50 }`
- Meaning result layout:
  - window offset: `{ x: 9, y: -7 }`
  - logo offset: `{ x: 10, y: -3 }`
  - stars offset: `{ x: 10, y: 3 }`
  - close button bounds: `{ x: 704, y: 631, width: 50, height: 50 }`
  - text viewport: `{ x: 589, y: 474, width: 258, height: 129 }`
  - scroll lane: `x = 864`, `width = 15`
  - scroll button bounds:
    - up: `{ x: 864, y: 471, width: 15, height: 15 }`
    - down: `{ x: 864, y: 590, width: 15, height: 15 }`

## Typography tokens

Locations:

- `src/ui/components/designTokens.ts`
- `src/ui/components/screenTextStyles.ts`

Current families:

- Heading: `Ruslan Display`
- Body: `Alumni Sans`
- Compact text: `Anek Devanagari`

## Rule for future edits

1. If Figma coordinates or exported art change, update `src/assets/figma/*.json` and `src/assets/textures/figma/desktop-elements-svg/*` first.
2. Keep screen coordinates in design-space; avoid per-screen custom resize logic.
3. Prefer adjusting shared offsets in `desktopFrames.ts` or `resultScreenLayout.ts` instead of scattering one-off corrections across screens.
4. If interactive bounds change, update or re-run the relevant Playwright visual and interaction tests.
