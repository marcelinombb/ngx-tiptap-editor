# Utils Package

## Overview

Selection inspection and node traversal utilities for ProseMirror and Tiptap editor states.

## Interface

- `[tiptap-selection.ts:FoundNode]`: Interface defining a resolved node and its document position (`node`, `pos`).
- `[tiptap-selection.ts:findNodeFromSelection]`: Utility finding a ProseMirror node of a target type within the active editor selection or ancestry.
- `[tiptap-selection.ts:findFigureNode]`: Specialized helper resolving the enclosing `Figure` node from an active `Selection` or `EditorState`.

## Invariants

- `[tiptap-selection.ts:findNodeFromSelection]`: Returns `undefined` safely when the requested node type is absent from the current selection hierarchy.

## Side Effects

- None

## Verification

- Run: `npm test`
