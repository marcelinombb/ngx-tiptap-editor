# Spell Checker Extension Package

## Overview

Interactive spell checking extension for Tiptap, highlighting misspelled words using ProseMirror decorations and displaying contextual correction suggestions.

## Interface

- `[SpellCheckerPlugin.ts:SpellCheckerExtension]`: Tiptap extension integrating spell checking decorations and suggestion events.
- `[SpellCheckerView.ts:SpellCheckerView]`: View helper managing suggestion tooltip positioning and click interactions.
- `[spell-checker.ts:SpellChecker]`: Core engine managing word tokenization, debounced checking, and cache lookups.
- `[spell-checker.ts:SpellCheckerConfig]`: Configuration interface for spell checking endpoints and language codes.
- `[spell-checker.ts:WordCheckResult]`: Interface describing spelling errors, offsets, and suggested corrections.

## Invariants

- `[spell-checker.ts:SpellChecker]`: Word verification requests are debounced to prevent network thrashing during active user typing.
- `[SpellCheckerPlugin.ts:SpellCheckerExtension]`: Spelling highlights are rendered exclusively via ephemeral ProseMirror decorations without altering document schema.

## Side Effects

- `[spell-checker.ts:SpellChecker.checkWords]`: Sends asynchronous HTTP requests to configured remote spell checking API.
- `[SpellCheckerView.ts:SpellCheckerView]`: Inserts and positions suggestion tooltip DOM elements into the document body.

## Verification

- Run: `npm test`
