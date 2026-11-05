# Table Extension Package

## Overview

Advanced table extension suite for Tiptap and Angular, featuring responsive column resizing, cell decorations, empty paragraph normalization, and colgroup synchronization.

## Interface

- `[index.ts:TableExtensions]`: Array of configured Tiptap extensions including Table, TableRow, TableHeader, TableCell, and column resizing plugins.
- `[index.ts:TableOptions]`: Configuration options interface for table behavior and resizability.
- `[index.ts:fixTableEmptyParagraphs]`: Utility function cleaning empty paragraphs within serialized table HTML.
- `[TableView.ts:TableView]`: Custom ProseMirror NodeView managing table DOM structure, colgroups, and cell selections.
- `[TableView.ts:updateColumns]`: Helper function synchronizing table column widths with DOM style declarations.
- `[TableView.ts:getColStyleDeclaration]`: Formatter generating CSS width string rules for column elements.
- `[custom-column-resizing.ts:columnResizing]`: ProseMirror plugin factory enabling mouse-driven table column resizing handles.
- `[custom-column-resizing.ts:columnResizingPluginKey]`: PluginKey identifying active column resizing state.
- `[custom-column-resizing.ts:ResizeState]`: State tracker managing handle hover positions and active drag deltas.
- `[table-resizing-math.ts:calculateColumnResize]`: Mathematical engine calculating column width redistribution under min-width constraints.
- `[table-resizing-math.ts:ColumnResizeCalculationParams]`: Input interface for column width recalculations.
- `[table-resizing-math.ts:ColumnResizeResult]`: Result interface returning recalculated column widths and validity flags.

## Invariants

- `[table-resizing-math.ts:calculateColumnResize]`: Column width adjustments never drop below the minimum column width threshold.
- `[custom-column-resizing.ts:ResizeState]`: Active dragging state must be null or contain valid start position coordinates and column indices.

## Side Effects

- `[custom-column-resizing.ts:columnResizing]`: Registers global `mousemove` and `mouseup` event listeners on the `window` object during resize drags.
- `[TableView.ts:TableView]`: Directly manipulates `colgroup` and `col` DOM elements within table nodes.

## Verification

- Run: `npm test`
