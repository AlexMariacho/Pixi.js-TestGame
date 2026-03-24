# Testing Guide

## Purpose
This guide describes how to run visual regression checks for UI screens and how to work with baselines.

## When To Run Visual Tests
Run visual tests for any UI-related change, including:
- screen layout updates (`src/ui/screens/*`)
- shared UI components (`src/ui/components/*`)
- visual/navigation interaction changes
- typography, colors, spacing, or coordinate changes

## Current Visual Test Scope
- Tests: `tests/e2e/visual-main.spec.ts`
- Baselines: `tests/e2e/visual-main.spec.ts-snapshots/`
- Viewport: `1440x1024` (configured in `playwright.config.ts`)
- Allowed visual drift: `0.1%` (`maxDiffPixelRatio: 0.001` in tests)

## Commands
Run from project root:

```bash
npm run test:visual
```

Update snapshots intentionally (only when mockups/design were updated):

```bash
npm run test:visual:update
```

## Recommended Workflow For Screen Changes
1. Apply UI changes in code.
2. Run `npm run test:visual`.
3. If failed, inspect generated diff images under `test-results/`.
4. Fix layout/styles until tests pass.
5. Update baselines with `npm run test:visual:update` only if expected design changed.
6. Re-run `npm run test:visual` to confirm green status.

## Where To Inspect Failures
On failure, Playwright writes artifacts to:
- `test-results/<test-name>/*-actual.png`
- `test-results/<test-name>/*-expected.png`
- `test-results/<test-name>/*-diff.png`

Use `*-diff.png` to see exact mismatch areas.

## Notes
- Keep snapshot filenames stable and aligned with test names.
- Do not update snapshots to hide regressions.
- UI changes should be merged only after relevant visual tests pass.
