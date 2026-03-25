# Task 02: Simplify Main Screen State Model

## Goal

Reduce copy-paste and improve readability in `MainScreen.ts` by replacing the mirrored `desktop1` / `desktop2` state handling with a clearer state-driven structure.

## Problem

`MainScreen.ts` currently duplicates:

- layer fields
- sprite fields
- click area creation
- state-specific visibility handling

The screen only has two modes, but the implementation is verbose and repetitive, which makes future edits error-prone.

## Target Outcome

- Replace duplicated per-state fields with a compact declarative structure.
- Build click areas and state metadata through shared logic instead of copy-paste.
- Keep existing visuals, navigation, and interaction behavior unchanged.
- Make the selected-state flow easier to understand for a human reader.

## Suggested Scope

Primary file:

- `src/ui/screens/MainScreen.ts`

Supporting files only if necessary:

- `src/ui/screens/desktopFrames.ts`
- `src/ui/components/ClickArea.ts`

## Constraints

- Do not move navigation logic out of `MainScreen` or `UIManager`.
- Avoid introducing unnecessary inheritance or generic helpers.
- Preserve current Figma-aligned coordinates and animation targets.

## Validation

- Run the Playwright checks for Desktop 1 and Desktop 2 if feasible.
- Confirm the state toggle still updates text, visibility, and selection target correctly.

## Notes

- A small data structure such as a `Record<MainState, ...>` is preferred over many paired fields.
- Optimize for readability first, not cleverness.
