# Task 03: Extract Shared Text and Typography

## Goal

Move repeated UI text and repeated Pixi `Text` style definitions into shared constants or tiny helpers so the code is easier to read and maintain.

## Problem

Several screens repeat:

- the same title text
- the same title bounds
- near-identical heading and body text style objects

This increases noise and makes copy updates harder than necessary.

## Target Outcome

- Extract shared screen text constants.
- Extract shared text-style helpers or constants where this improves readability.
- Keep per-screen differences explicit.
- Do not over-engineer the solution.

## Suggested Scope

Primary files:

- `src/ui/screens/MainScreen.ts`
- `src/ui/screens/DispatcherResultScreen.ts`
- `src/ui/screens/MeaningResultScreen.ts`

Possible new or updated shared modules:

- `src/ui/components/designTokens.ts`
- `src/ui/screens/screenText.ts`
- `src/ui/components/textStyles.ts`

## Constraints

- Keep literal texts human-readable in one obvious place.
- Avoid introducing a large theme system.
- Do not change rendered appearance.

## Validation

- Run the relevant visual tests if feasible.
- Check that title and body labels render exactly as before.

## Notes

- Shared constants are the priority.
- Helper functions are acceptable only if they clearly reduce noise.
