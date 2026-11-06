# Floating Menus Component Package

## Overview

Contextual floating bubble menus for Tiptap node interaction in Angular, providing targeted toolbars for answer boxes, images/figures, KaTeX formulas, and table manipulation.

## Interface

- `[answer-box-floating-menu.component.ts:AnswerBoxFloatingMenuComponent]`: Angular standalone component providing configuration controls (modes, line counts, borders, headers) for active AnswerBox nodes.
- `[image-floating-menu.component.ts:ImageFloatingMenuComponent]`: Angular standalone component rendering alignment, resizing, cropping, and caption toggles for Figure nodes.
- `[katex-floating-menu.component.ts:KatexFloatingMenuComponent]`: Angular standalone component providing inline and block LaTeX formula editing controls.
- `[table-floating-menu.component.ts:TableFloatingMenuComponent]`: Angular standalone component exposing cell merge/split, row/column addition and deletion, and table border toggles.

## Invariants

- `[answer-box-floating-menu.component.ts:AnswerBoxFloatingMenuComponent.totalLines]`: Line count must be constrained within range 1 to 20 (`Math.min(Math.max(val, 1), 20)`).
- `[answer-box-floating-menu.component.ts:AnswerBoxFloatingMenuComponent.editor]`: Menu remains visible only while selection is within an `answerBox` node.
- `[image-floating-menu.component.ts:ImageFloatingMenuComponent.editor]`: Active figure selection must be resolved via `findFigureNode` before menu controls execute.
- `[table-floating-menu.component.ts:TableFloatingMenuComponent.ngOnDestroy]`: Must clean up DOM subscriptions and bubble menu positioning listeners on teardown.

## Side Effects

- `[answer-box-floating-menu.component.ts:AnswerBoxFloatingMenuComponent.updateLines]`: Dispatches ProseMirror transactions to update `answerBox` node attributes.
- `[image-floating-menu.component.ts:ImageFloatingMenuComponent.setAlignment]`: Modifies CSS classes and ProseMirror figure node attributes.
- `[katex-floating-menu.component.ts:KatexFloatingMenuComponent.saveLatex]`: Mutates editor state by committing updated LaTeX expressions to the underlying ProseMirror node.
- `[table-floating-menu.component.ts:TableFloatingMenuComponent]`: Executes ProseMirror table commands (`addRowAfter`, `deleteColumn`, `mergeCells`, `splitCell`) mutating editor document structure.

## Verification

- Run: `npm test`
