# Special Characters Extension Package

## Overview

Unicode character catalog and metadata definitions for the special character insertion component.

## Interface

- `[unicodeSource.ts:UnicodeCategory]`: Interface describing categories of special characters with names and item lists.
- `[unicodeSource.ts:unicodeCategories]`: Static array of categorized Unicode symbols (mathematical operators, Greek alphabet, arrows, currency, symbols).

## Invariants

- `[unicodeSource.ts:unicodeCategories]`: Categories array is an immutable reference dataset of valid Unicode characters.

## Side Effects

- None

## Verification

- Run: `npm test`
