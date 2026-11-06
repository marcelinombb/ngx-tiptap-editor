# Indent Extension Package

## Overview

Paragraph and list indentation extension for Tiptap, supporting keyboard shortcuts (`Tab` / `Shift+Tab`) and programmatic indent level controls.

## Interface

- `[indent.ts:Indent]`: Tiptap extension configuring indentation attributes and commands (`indent`, `outdent`).
- `[indent.ts:IndentOptions]`: Configuration interface for indent settings (types, min/max limits, default levels).
- `[indent.ts:clamp]`: Pure helper function constraining numeric values within specified bounds.
- `[indent.ts:isBulletListNode]`: Predicate function checking if a node is a bullet list.
- `[indent.ts:isOrderedListNode]`: Predicate function checking if a node is an ordered list.
- `[indent.ts:isTodoListNode]`: Predicate function checking if a node is a task/todo list.
- `[indent.ts:isListNode]`: Predicate identifying any supported list container node.

## Invariants

- `[indent.ts:clamp]`: Indentation level is strictly clamped between `min` (0) and `max` (7).
- `[indent.ts:Indent]`: Outdent cannot decrease indentation level below `min` (0).

## Side Effects

- `[indent.ts:Indent]`: Modifies ProseMirror node attributes by setting `indent` level and dispatching editor transactions.

## Verification

- Run: `npm test`
