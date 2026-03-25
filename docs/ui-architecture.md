# UI Architecture

## Core runtime

- Pixi app initialization and responsive root layout: `src/app/createApp.ts`
- Bootstrap entrypoint and font loading: `src/app/bootstrap.ts`
- Single navigation entrypoint: `src/ui/manager/UIManager.ts`
- Screen IDs (source of truth): `src/ui/manager/screenIds.ts`

## Runtime flow

1. `src/index.ts` resolves the `#app` container and calls `bootstrap()`.
2. `bootstrap()` loads bundled Figma fonts, creates the app, attaches the canvas, shows the main screen, and sets `window.__PIXI_APP_READY__` for Playwright.
3. `createApp()` preloads Figma SVG assets, initializes Pixi, creates one shared `uiRoot` container, registers screens, and applies centered responsive scaling.

## Screen model

- Every screen extends `BaseScreen` and owns one root `Container` (`view`).
- `build()` creates display objects once.
- `show()` / `hide()` control visibility and attachment lifecycle only.
- Screen instances are created lazily by `UIManager` and then reused.

## Registered screens

- `main` -> `MainScreen`
- `dispatcher-result` -> `DispatcherResultScreen`
- `meaning-result` -> `MeaningResultScreen`

## Shared UI building blocks

- Theme tokens: `src/ui/components/designTokens.ts`
- Shared text styles: `src/ui/components/screenTextStyles.ts`
- Pointer hit areas: `src/ui/components/ClickArea.ts`
- Hover/press animation binding: `src/ui/components/pressable.ts`
- Meaning screen scrollable viewport: `src/ui/components/MeaningScrollBox.ts`

## Figma-driven rendering pipeline

- Coordinate source: `src/assets/figma/coordinates.template.json`
- Raw Figma payload used for render bounds: `src/assets/figma/page-0-1.raw.json`
- SVG export manifests: `src/assets/textures/figma/desktop-elements-svg/`
- Scene builder: `src/ui/components/figmaCsvScene.ts`
- Frame-level element maps: `src/ui/screens/desktopFrames.ts`

`figmaCsvScene.ts` resolves exported SVG files through CSV manifests, maps them back to Figma node IDs, and builds Pixi `Sprite` containers positioned in design-space. `desktopFrames.ts` sits one layer above that and declares which exported nodes belong to each desktop screen variant.

## Navigation behavior

- `UIManager.register(id, factory)` stores lazy screen factories and throws on duplicate registration.
- `UIManager.show(id)` navigates forward and pushes the current screen into history.
- `UIManager.goBack()` pops history and returns to the previous screen.
- Unknown screen IDs throw `Screen not registered`.
- If a transition is running, the latest navigation request is deferred and executed after the transition finishes.

## Transition behavior

- Transition implementation: `src/ui/transitions/fadeTransition.ts`
- Current effect: fade plus horizontal slide
- Direction:
  - forward when moving away from `main`
  - backward when returning to `main`
- Default duration: `220ms`

## Current screen responsibilities

- `MainScreen.ts`: role toggle state, title/button labels, arrow/select hit areas, navigation to result screens
- `DispatcherResultScreen.ts`: Desktop 3 frame assembly, result label placement, close button back-navigation
- `MeaningResultScreen.ts`: Desktop 4 frame assembly, close button, scroll controls, `MeaningScrollBox` integration

## Layout ownership

- Global app canvas size and color tokens live in `designTokens.ts`.
- Result-screen offsets and interactive bounds live in `resultScreenLayout.ts`.
- Main-screen state-specific bounds remain in `MainScreen.ts`.
- Long-form meaning text lives in `meaningResultText.ts`; short UI labels live in `screenText.ts`.
