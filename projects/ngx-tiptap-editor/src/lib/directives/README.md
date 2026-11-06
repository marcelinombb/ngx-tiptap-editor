# Directives Package

## Overview

Angular directives supporting Tiptap editor interactions, including click-outside detection for floating dropdowns and bubble menu lifecycle integration.

## Interface

- `[click-outside.directive.ts:ClickOutsideDirective]`: Standalone Angular directive detecting pointer clicks outside its host element and emitting the `appClickOutside` event.
- `[tiptap-bubble-menu.directive.ts:TiptapBubbleMenuDirective]`: Standalone directive mounting and positioning Tiptap BubbleMenu floating panels relative to editor text selection.

## Invariants

- `[tiptap-bubble-menu.directive.ts:TiptapBubbleMenuDirective]`: Requires an initialized `editor` instance before mounting the underlying BubbleMenu ProseMirror plugin.

## Side Effects

- `[click-outside.directive.ts:ClickOutsideDirective]`: Listens to global `document:click` events.
- `[tiptap-bubble-menu.directive.ts:TiptapBubbleMenuDirective]`: Injects and positions floating DOM elements into the document tree.

## Verification

- Run: `npm test`
