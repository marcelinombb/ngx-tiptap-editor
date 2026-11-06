# Paragraph Extension Package

## Overview

Enhanced paragraph extension for Tiptap, supporting custom attributes, empty paragraph normalization, and indentation alignment.

## Interface

- `[index.ts:CustomParagraph]`: Extended Tiptap `Paragraph` node supporting inline style preservation and attribute overrides.
- `[index.ts:normalizeEmptyIndentedParagraphs]`: Utility function cleaning up redundant whitespace and tags from indented empty paragraphs in HTML strings.

## Invariants

- `[index.ts:CustomParagraph]`: Inherits standard ProseMirror block schema (`group: 'block'`, `content: 'inline*'`).

## Side Effects

- None

## Verification

- Run: `npm test`
