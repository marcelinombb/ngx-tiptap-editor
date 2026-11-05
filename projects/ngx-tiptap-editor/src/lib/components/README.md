# Components Package

## Overview

Angular UI components comprising the editor toolbar, dropdown menus, character pickers, table insertion grids, and configuration dialogs.

## Interface

- `[editor-toolbar.component.ts:EditorToolbarComponent]`: Main editor toolbar component rendering action buttons, formatting toggles, and dropdown triggers.
- `[editor-button.component.ts:EditorButtonComponent]`: Reusable toolbar button component with active state highlighting and tooltip support.
- `[editor-dropdown.component.ts:EditorDropdownComponent]`: Dropdown menu container component with click-outside dismissal.
- `[editor-dropdown.component.ts:EditorDropdownService]`: Coordination service managing active dropdown states across the toolbar.
- `[special-characters.component.ts:SpecialCharactersComponent]`: Interactive modal grid for selecting and inserting categorized Unicode characters.
- `[table-grid.component.ts:TableGridComponent]`: Interactive row/column matrix picker for inserting new tables.
- `[answer-box-config.component.ts:AnswerBoxConfigComponent]`: Configuration panel component for customizing answer box dimensions and styles.
- [Floating Menus](./floating-menus/README.md): Contextual bubble menus for formulas, tables, and images.

## Invariants

- `[editor-dropdown.component.ts:EditorDropdownService]`: Ensures at most one toolbar dropdown remains open at any given moment.
- `[editor-toolbar.component.ts:EditorToolbarComponent]`: Requires a valid Tiptap `editor` instance before binding toolbar button active states.

## Side Effects

- `[editor-toolbar.component.ts:EditorToolbarComponent]`: Executes ProseMirror transaction commands against the editor instance.
- `[special-characters.component.ts:SpecialCharactersComponent.insertCharacter]`: Inserts selected character strings into the active editor cursor position.

## Verification

- Run: `npm test`
