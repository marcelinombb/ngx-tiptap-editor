# KaTeX Extension Package

## Overview

KaTeX mathematical expression extension for Tiptap, enabling inline LaTeX rendering, interactive formula editing, and visual preview.

## Interface

- `[katex.ts:Katex]`: Tiptap atom node representing LaTeX mathematical formulas in documents.
- `[katex.ts:KatexOptions]`: Options interface for KaTeX configuration.
- `[katex.ts:parseLatex]`: Parsing helper extracting raw LaTeX string content from text tokens.
- `[KatexPlugin.ts:KatexPlugin]`: ProseMirror plugin managing cursor movement and selection states around LaTeX formulas.
- `[katexView.ts:KatexView]`: ProseMirror NodeView managing formula element rendering and click interactions.
- `[katexView.ts:updateLatexDisplay]`: Rendering helper applying `katex.render` to the container DOM element.

## Invariants

- `[katex.ts:Katex]`: Defined as an inline atom node (`inline: true`, `atom: true`, `group: 'inline'`).
- `[katexView.ts:updateLatexDisplay]`: Any KaTeX rendering errors are caught locally, displaying fallback error text without breaking the editor document state.

## Side Effects

- `[katexView.ts:updateLatexDisplay]`: Invokes external `katex.render` directly mutating container DOM innerHTML.
- `[katexView.ts:KatexView]`: Attaches click and double-click DOM listeners to trigger formula editing.

## Verification

- Run: `npm test`
