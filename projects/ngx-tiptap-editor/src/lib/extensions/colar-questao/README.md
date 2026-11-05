# Colar Questao Extension Package

## Overview

Educational question import and structuring extension for Tiptap, preserving metadata, title blocks, and question containment when pasting or generating standardized questions.

## Interface

- `[colar-questao.ts:ColarQuestao]`: Tiptap block node defining the question boundary and layout structure.
- `[colar-questao.ts:ColarQuestaoOptions]`: Configuration options interface for question wrapping nodes.
- `[colar-questao.component.ts:ColarQuestaoComponent]`: Angular NodeView component managing the visual layout and editable content boundaries.

## Invariants

- `[colar-questao.ts:ColarQuestao]`: Group is `'block'` and content allows one or more block nodes (`block+`).
- `[colar-questao.ts:ColarQuestao.defining]`: Set to `true` to preserve boundary integrity during paste and slice operations.

## Side Effects

- `[colar-questao.component.ts:ColarQuestaoComponent]`: Renders custom DOM wrapper in editor contentDOM area with isolated question styling.

## Verification

- Run: `npm test`
