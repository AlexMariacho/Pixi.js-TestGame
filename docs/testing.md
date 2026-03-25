# Testing Guide

## Purpose

This guide describes the current automated checks for UI rendering and interaction behavior.

## Current automated coverage

- Test runner: Playwright
- Config: `playwright.config.ts`
- Test file: `tests/e2e/visual-main.spec.ts`
- Baselines: `tests/e2e/visual-main.spec.ts-snapshots/`
- Viewport: `1440x1024`
- Device scale factor: `1`
- Allowed visual drift for screenshot assertions: `0.1%` (`maxDiffPixelRatio: 0.001`)

## What is covered now

- Desktop 1 screenshot baseline
- Desktop 2 screenshot baseline
- Desktop 3 screenshot baseline
- Desktop 4 screenshot baseline
- Hover feedback on the main screen select button
- Meaning screen scroll interaction changes the viewport
- Navigation timing through the current animated transitions

## When to run visual tests

Run the Playwright suite for any UI-related change, including:

- `src/ui/screens/*`
- `src/ui/components/*`
- `src/ui/manager/*`
- `src/ui/transitions/*`
- Figma asset or coordinate updates under `src/assets/figma/*`
- exported SVG or manifest updates under `src/assets/textures/figma/*`
- typography, color, spacing, hit-area, or animation changes

## Commands

Run from project root:

```bash
npm run test:visual
```

Update snapshots intentionally:

```bash
npm run test:visual:update
```

Type-check the project:

```bash
npm run check
```

## How tests start the app

- Playwright launches `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`
- Tests wait for the canvas to appear
- Tests then poll `window.__PIXI_APP_READY__` before taking screenshots or sending input

That readiness flag is set in `src/app/bootstrap.ts` after fonts, assets, and the initial screen are ready.

## Recommended workflow for UI changes

1. Apply the code or asset changes.
2. Run `npm run check`.
3. Run `npm run test:visual`.
4. Inspect `test-results/` if anything fails.
5. Update snapshots only when the intended design changed.
6. Re-run `npm run test:visual` and confirm green.

## Where to inspect failures

On failure, Playwright writes artifacts to:

- `test-results/<test-name>/*-actual.png`
- `test-results/<test-name>/*-expected.png`
- `test-results/<test-name>/*-diff.png`

Use `*-diff.png` to inspect exact mismatch areas.

## Notes

- Keep snapshot filenames stable and aligned with test names.
- Do not update snapshots to hide regressions.
- If transitions, hover states, or scroll behavior change intentionally, review both screenshots and interaction assertions.
