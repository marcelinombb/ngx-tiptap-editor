# Answer Box Extension Package

## Overview

Educational answer box extension for Tiptap and Angular, supporting structured response areas with configurable borders, line counts, and optional headers for tests and assignments.

## Interface

- `[answer-box.ts:AnswerBox]`: Tiptap block node defining configurable student answer areas.
- `[answer-box.ts:AnswerBoxOptions]`: Interface defining options including default modes (`caixa`, `linhas`, `linhas-numeradas`) and line constraints.
- `[answer-box-header.ts:AnswerBoxHeader]`: Tiptap block node defining an optional text header row inside the answer box.
- `[answer-box.component.ts:AnswerBoxComponent]`: Angular NodeView component handling interactive rendering and mode styling.

## Invariants

- `[answer-box.ts:AnswerBox]`: Schema enforces content structure of `answerBoxHeader? block*`.
- `[answer-box.ts:AnswerBox.addAttributes]`: `totalLines` attribute is constrained between 1 and 20.
- `[answer-box.component.ts:AnswerBoxComponent]`: Display mode is strictly restricted to `'caixa'`, `'linhas'`, or `'linhas-numeradas'`.

## Side Effects

- `[answer-box.component.ts:AnswerBoxComponent.updateAttributes]`: Mutates ProseMirror node attributes via Tiptap transaction dispatcher.
- `[answer-box.component.ts:AnswerBoxComponent]`: Updates dynamic CSS variables on component DOM host (`--total-lines`).

## Verification

- Run: `npm test`
