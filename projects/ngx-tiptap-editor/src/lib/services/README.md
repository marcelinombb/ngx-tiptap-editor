# Services Package

## Overview

Angular injectable services coordinating floating toolbar states, bubble menus, and KaTeX formula editor lifecycle events across the editor.

## Interface

- `[floating-menu.service.ts:FloatingMenuService]`: Injectable service tracking registered floating menus and coordinating active visibility.
- `[katex-menu.service.ts:KatexMenuService]`: Injectable service managing the KaTeX dialog state, selected formula text, and update signals.

## Invariants

- `[floating-menu.service.ts:FloatingMenuService]`: Only one contextual floating menu should be actively displayed at a given selection position.

## Side Effects

- `[katex-menu.service.ts:KatexMenuService]`: Emits reactive events through RxJS Subjects when opening, updating, or closing the formula editor dialog.

## Verification

- Run: `npm test`
