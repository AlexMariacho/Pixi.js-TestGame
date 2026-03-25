# Task 04: Extract Meaning Scroll Box Component

## Goal

Improve readability of `MeaningResultScreen.ts` by extracting the scroll-box implementation into a dedicated UI component with a small explicit API.

## Problem

`MeaningResultScreen.ts` currently mixes:

- screen composition
- scroll layout constants
- thumb drawing
- pointer and wheel event handling
- scroll state math

The behavior is understandable only after reading a long method end to end.

## Target Outcome

- Move scroll-box behavior into a dedicated component module.
- Keep `MeaningResultScreen.ts` focused on composing the screen.
- Preserve current scrolling behavior, visuals, and hit areas.
- Leave a simple interface for scrolling from external buttons.

## Suggested Scope

Primary files:

- `src/ui/screens/MeaningResultScreen.ts`

Possible new component:

- `src/ui/components/MeaningScrollBox.ts`

Possible shared support:

- `src/ui/screens/resultScreenLayout.ts`
- `src/ui/components/designTokens.ts`

## Constraints

- Keep the component specific to current project needs.
- Avoid introducing a large reusable widget framework.
- Preserve public behavior and visual output.

## Validation

- Run the visual test for Desktop 4 if feasible.
- Add or update automated coverage if the component extraction changes observable UI behavior.

## Notes

- Prefer an API that exposes only what the screen needs, for example a view/container and `scrollByDelta`.
- Keep names concrete and local to the domain.
