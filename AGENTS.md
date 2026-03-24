# AGENTS.md

## Project overview

This project is a Pixi.js-based UI application with screen navigation.
The architecture is intentionally simple: screens, shared UI components, and one UI manager.

## Folder structure

```text
src/
  app/
    createApp.ts        # Pixi app initialization and screen registration
    bootstrap.ts        # Bootstraps app into DOM container

  core/
    constants.ts        # App-level constants
    types.ts            # Shared core types

  ui/
    manager/
      UIManager.ts      # Screen registration and navigation (show/back)
      screenIds.ts      # Centralized screen IDs

    screens/
      BaseScreen.ts         # Base class for all screens
      MainMenuScreen.ts     # Main menu screen
      SettingsScreen.ts     # Settings screen
      ProfileScreen.ts      # Profile screen

    components/
      Button.ts         # Reusable button factory
      Label.ts          # Reusable label factory
      Panel.ts          # Reusable panel factory

    transitions/
      fadeTransition.ts # Transition hook (placeholder)

  assets/
    textures/
    fonts/
    sounds/

  utils/
    eventBus.ts         # Lightweight typed event bus
    helpers.ts          # Generic utility helpers

  index.ts              # Entry point
```

## Engineering standards (TypeScript)

1. Keep code simple and explicit.
2. Prefer composition over inheritance (except BaseScreen abstraction).
3. Use strict typing for public APIs and shared utilities.
4. Avoid `any`; use generics, unions, or explicit interfaces instead.
5. One responsibility per module/file.
6. Keep screen logic inside screens; keep reusable UI in `ui/components`.
7. Keep navigation concerns only in `UIManager`.
8. Use meaningful names for files, classes, and methods.
9. Fail fast on invalid state (for example, missing registered screens).
10. Write small, testable pure helpers in `utils` where possible.

## Pixi.js conventions

1. Each screen owns one root `Container` (`view`).
2. `build()` should construct scene graph once per screen instance.
3. `show()`/`hide()` should only control visibility/attachment lifecycle.
4. Shared visual primitives belong in `ui/components`.
5. Keep render tree shallow and predictable.

## Code style and cleanliness

1. Use consistent formatting and import order.
2. Keep functions short and focused.
3. Avoid duplicated logic; extract reusable functions early.
4. Add comments only when intent is not obvious.
5. Do not leave dead code, TODO clutter, or unused exports.

## Change policy for agents

1. Do not introduce unnecessary abstractions.
2. Preserve the current folder layout unless there is a clear reason to change it.
3. Any new screen must be registered in `UIManager` and added to `screenIds.ts`.
4. Any shared UI element should be added to `ui/components`.
5. Keep backward-compatible behavior unless explicitly asked to refactor.
