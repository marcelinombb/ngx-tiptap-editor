# Alternatives Extension Package

## Overview

Educational multiple-choice question extension for Tiptap, structuring questions with sequential choice items (A, B, C, D...) rendered via Angular NodeViews.

## Interface

- `[alternative.ts:Alternative]`: Tiptap block node definition for grouping question alternatives.
- `[alternative.ts:AlternativeOptions]`: Configuration interface for alternative container nodes.
- `[alternative-item.ts:AlternativeItem]`: Tiptap node representing an individual choice row inside an alternative container.
- `[alternative-item.ts:AlternativeItemOptions]`: Configuration options for alternative items.
- `[alternative.component.ts:AlternativeComponent]`: Angular NodeView component managing the container element and add-item triggers.
- `[alternative-item.component.ts:AlternativeItemComponent]`: Angular component providing choice letter labels and deletion controls.

## Invariants

- `[alternative.ts:Alternative]`: Node content constraint requires one or more alternative items (`alternativeItem+`).
- `[alternative-item.ts:AlternativeItem]`: Must reside exclusively within an `alternative` parent container node.
- `[alternative-item.component.ts:AlternativeItemComponent]`: Letter indicator (A, B, C...) is strictly derived from zero-based child node index in parent.

## Side Effects

- `[alternative.component.ts:AlternativeComponent.addAlternative]`: Dispatches ProseMirror document transactions to append a new `alternativeItem` node.
- `[alternative-item.component.ts:AlternativeItemComponent.removeSelf]`: Mutates editor state by removing the target choice node from the document tree.

## Verification

- Run: `npm test`
