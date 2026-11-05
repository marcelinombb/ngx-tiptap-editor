# Association Extension Package

## Overview

Two-column matching/association question extension for educational evaluations, rendering paired columns of interactive items via Angular NodeViews.

## Interface

- `[association.ts:Association]`: Tiptap block node defining the top-level two-column matching container.
- `[association.ts:AssociationOptions]`: Options interface for association container configuration.
- `[association-column.ts:AssociationColumn]`: Tiptap node representing a single column within an association block.
- `[association-column.ts:AssociationColumnOptions]`: Options interface for association column definitions.
- `[association-item.ts:AssociationItem]`: Tiptap node representing individual items inside a column.
- `[association-item.ts:AssociationItemOptions]`: Options interface for association item definitions.
- `[association.component.ts:AssociationComponent]`: Angular NodeView component managing container layout and column coordination.
- `[association-column.component.ts:AssociationColumnComponent]`: Angular NodeView component rendering column wrappers.
- `[association-item.component.ts:AssociationItemComponent]`: Angular component managing item labels and deletion actions.

## Invariants

- `[association.ts:Association]`: Schema strictly mandates exactly two child columns (`associationColumn associationColumn`).
- `[association-column.ts:AssociationColumn]`: Content rule requires one or more association items (`associationItem+`).
- `[association-item.ts:AssociationItem]`: Must reside inside an `associationColumn` container.

## Side Effects

- `[association.component.ts:AssociationComponent.addItem]`: Emits ProseMirror transactions to synchronize item creation between paired columns.
- `[association-item.component.ts:AssociationItemComponent.removeItem]`: Mutates editor document state by removing target item nodes.

## Verification

- Run: `npm test`
