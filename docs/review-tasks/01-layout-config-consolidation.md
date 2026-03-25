# Task 01: Consolidate Result Screen Layout Config

## Goal

Remove duplicated layout offsets and shared geometry for the result screens. There should be one source of truth for result-screen positioning data instead of repeating offsets in both screen files and `desktopFrames.ts`.

## Problem

The following values are currently duplicated across multiple files:

- result window offsets
- logo offsets
- decoration offsets
- close button bounds
- other per-screen geometry derived from the same Figma layout

This makes layout changes risky because visual assets and click areas can drift apart.

## Target Outcome

- Introduce a shared config module for result-screen layout data.
- `DispatcherResultScreen.ts` and `MeaningResultScreen.ts` should consume that config instead of redefining offsets locally.
- `desktopFrames.ts` should consume the same config instead of its own copies.
- Keep behavior unchanged.

## Suggested Scope

Primary files:

- `src/ui/screens/desktopFrames.ts`
- `src/ui/screens/DispatcherResultScreen.ts`
- `src/ui/screens/MeaningResultScreen.ts`

Possible new file:

- `src/ui/screens/resultScreenLayout.ts`

## Constraints

- Keep the architecture simple.
- Do not introduce a generic abstraction that is broader than this project needs.
- Preserve current coordinates and interaction behavior.
- Follow UTF-8 and CRLF requirements.

## Validation

- Run relevant tests for UI behavior after changes.
- At minimum, run the Playwright visual checks that cover result screens if feasible.

## Notes

- Prefer naming that makes the config readable by a human scanning the file.
- If a value is truly unique to one screen, keep it scoped to that screen config entry rather than forcing fake generalization.
