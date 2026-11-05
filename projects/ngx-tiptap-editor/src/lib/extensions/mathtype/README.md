# MathType Extension Package

## Overview

Wiris MathType and ChemType integration extension for Tiptap, supporting visual formula editing, chemistry notation, and WebAssembly asset integration.

## Interface

- `[mathtype.ts:MathType]`: Tiptap inline atom node representing MathType formula elements.
- `[MathTypePlugin.ts:MathTypePlugin]`: Tiptap extension configuring toolbar hooks and integration handlers.
- `[MathTypePlugin.ts:MathTypePluginKey]`: ProseMirror `PluginKey` identifying the MathType plugin instance.
- `[MathTypePlugin.ts:MathTypeOptions]`: Configuration interface for Wiris editor integration.
- `[MathTypePlugin.ts:mathIcon]`: SVG icon markup for the MathType formula button.
- `[MathTypePlugin.ts:chemIcon]`: SVG icon markup for the ChemType chemistry formula button.
- `[mathtype-integration.ts:TiptapEditorIntegration]`: Adapter class bridging Wiris DevKit `IntegrationModel` with Tiptap editor instances.

## Invariants

- `[mathtype.ts:MathType]`: Defined as an inline atom node (`group: 'inline'`, `inline: true`, `atom: true`).
- `[mathtype-integration.ts:TiptapEditorIntegration]`: Requires Wiris WebAssembly telemetry assets loaded in the host environment.

## Side Effects

- `[mathtype-integration.ts:TiptapEditorIntegration.openEditor]`: Opens Wiris modal dialog in the global browser DOM.
- `[mathtype-integration.ts:TiptapEditorIntegration.insertMathml]`: Mutates editor document by inserting rendered MathML image nodes.

## Verification

- Run: `npm test`
