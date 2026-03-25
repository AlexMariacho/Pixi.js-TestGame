# AGENTS.md

## Project overview

This project is a Pixi.js-based UI application with screen navigation and Figma-synced visuals.
The architecture is intentionally compact: one app bootstrap layer, one UI manager, a small set of screens, shared UI helpers, and exported design assets.

## Detailed docs (for agents)

- UI architecture: [docs/ui-architecture.md](docs/ui-architecture.md)
- UI layout and coordinates: [docs/ui-layout-coordinates.md](docs/ui-layout-coordinates.md)
- Figma sync workflow: [docs/figma-sync.md](docs/figma-sync.md)
- Testing guide: [docs/testing.md](docs/testing.md)

## Folder structure

```text
src/
  app/          # App bootstrap and Pixi initialization
  assets/       # Figma artifacts, exported textures, fonts, sounds
  ui/
    manager/    # Screen registration and navigation
    screens/    # Screen implementations and screen-specific data
    components/ # Shared UI, interaction, typography, and rendering helpers
    transitions/# Screen transition logic
  utils/        # Generic helpers
  index.ts      # Entry point

tests/
  e2e/          # Visual and interaction regression tests

docs/           # Architecture, layout, Figma sync, and testing docs
```

## Engineering standards (TypeScript)

1. Keep code simple and explicit.
2. Prefer composition over inheritance except for the shared screen base abstraction.
3. Use strict typing for public APIs and shared utilities.
4. Avoid `any`; prefer explicit interfaces, unions, and generics.
5. Keep one responsibility per module.
6. Keep screen-specific behavior inside `ui/screens`; move reusable logic into `ui/components` or `utils`.
7. Keep navigation concerns in `UIManager`.
8. Use meaningful names for files, classes, and methods.
9. Fail fast on invalid state.
10. Keep shared helpers small and testable where practical.

## Pixi.js conventions

1. Each screen owns one root `Container` (`view`).
2. `build()` should construct scene graph once per screen instance.
3. `show()` / `hide()` should only control visibility and attachment lifecycle.
4. Shared interactive primitives belong in `ui/components`.
5. Keep the render tree shallow and predictable.
6. Prefer Figma-derived coordinates and shared layout data over scattered manual positioning logic.

## Architecture notes

1. Exported Figma artifacts are the visual source of truth for layout and frame composition.
2. Screens compose shared UI/rendering helpers rather than owning low-level asset plumbing directly.
3. The UI manager owns screen lifecycle, navigation history, and transitions between registered screens.
4. Layout constants should stay centralized when they are shared by multiple screens or components.

## Code style and cleanliness

1. Use consistent formatting and import order.
2. Keep functions short and focused.
3. Avoid duplicated logic; extract reusable code early.
4. Add comments only when intent is not obvious.
5. Do not leave dead code, TODO clutter, or unused exports.

## Encoding and line endings

1. All script and source files must be saved in `UTF-8` encoding.
2. Use `CRLF` line endings for all text files in this project.
3. Do not mix encodings or line-ending styles within a file.

## Change policy for agents

1. Do not introduce unnecessary abstractions.
2. Preserve the current folder layout unless there is a clear reason to change it.
3. Any new screen must be registered in `UIManager` and added to `screenIds.ts`.
4. Any shared UI element should be added to `ui/components`.
5. Keep backward-compatible behavior unless explicitly asked to refactor.
6. If changes affect UI, update the relevant automated tests and run the relevant test commands before finishing.
7. If Figma-driven layout or assets change, sync the exported artifacts before adjusting code-level layout constants.
