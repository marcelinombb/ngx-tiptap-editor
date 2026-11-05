# Tab Extension Package

## Overview

Keyboard tab behavior extension for Tiptap, managing Tab and Shift+Tab key bindings within editor nodes.

## Interface

- `[tab.ts:Tab]`: Tiptap node and keyboard shortcut extension capturing Tab keydown events.

## Invariants

- `[tab.ts:Tab]`: Preserves standard browser focus navigation when editor is not focused.

## Side Effects

- `[tab.ts:Tab]`: Prevents default browser tab navigation event and inserts tab spaces or triggers indent commands.

## Verification

- Run: `npm test`
