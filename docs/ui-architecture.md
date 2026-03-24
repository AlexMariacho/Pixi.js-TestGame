# UI Architecture

## Core runtime
- Pixi app bootstrap: `src/app/createApp.ts`
- Single navigation entrypoint: `src/ui/manager/UIManager.ts`
- Screen IDs (source of truth): `src/ui/manager/screenIds.ts`

## Screen model
- Every screen extends `BaseScreen` and owns one root `Container` (`view`).
- `build()` creates display objects once.
- `show()` / `hide()` control visibility and attachment lifecycle only.

## Registered screens
- `main` -> `MainScreen`
- `dispatcher-result` -> `DispatcherResultScreen`
- `meaning-result` -> `MeaningResultScreen`

## Shared UI primitives
- Visual shell and controls: `src/ui/components/OracleCard.ts`
- Theme tokens (colors, fonts, layout size): `src/ui/components/designTokens.ts`
- Pointer hit areas: `src/ui/components/ClickArea.ts`

## Navigation behavior
- `UIManager.show(id)` pushes current screen into history.
- `UIManager.goBack()` pops history and returns to previous screen.
- `UIManager` throws on unknown screen ID (`Screen not registered`).
