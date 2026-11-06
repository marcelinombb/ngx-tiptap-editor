# Core Library Package

## Overview

Primary library layer for `ngx-tiptap-editor`, implementing the root standalone Angular editor component, extension assembly factory, and DOM/ProseMirror utility functions.

## Interface

- `[tiptap-editor.ts:NgxTiptapEditor]`: Main Angular standalone rich-text editor component implementing `ControlValueAccessor`.
- `[tiptap-editor.ts:ExitusTiptapEditor]`: Export alias for `NgxTiptapEditor`.
- `[tiptap-editor.ts:EditorExtensionsConfig]`: Configuration interface specifying extension options (proxy URLs, image settings, spell check).
- `[extension-factory.ts:ExtensionFactory]`: Builder assembling core, math, image, question, table, and spell checker extensions.
- `[extension-factory.ts:ExtensionFactoryConfig]`: Configuration model consumed by the extension factory.
- `[extension-factory.ts:createCoreExtensions]`: Factory instantiating StarterKit, subscript, superscript, and text-align extensions.
- `[extension-factory.ts:createMathExtensions]`: Factory instantiating KaTeX and MathType extensions.
- `[extension-factory.ts:createImageExtensions]`: Factory assembling Figure, Figcaption, and image proxy extensions.
- `[extension-factory.ts:createQuestionExtensions]`: Factory assembling alternatives, answer boxes, association, and question paste extensions.
- `[extension-factory.ts:createTableExtensions]`: Factory instantiating enhanced table extensions with column resizing.
- `[extension-factory.ts:createSpellCheckerExtensions]`: Factory configuring remote or local spell checking extensions.
- `[utils.ts:createHTMLElement]`: Helper constructing typed HTML DOM elements.
- `[utils.ts:insertParagraph]`: Inserts an empty paragraph at the specified document index.
- `[utils.ts:findNodePosition]`: Locates the numeric position of a given ProseMirror node in the document.
- `[utils.ts:setSelectionAfter]`: Moves cursor selection immediately after the target node.
- `[utils.ts:getNodeFromSelection]`: Resolves the active node directly at the current selection.
- `[utils.ts:deleteSelectedNode]`: Dispatches transaction to delete the selected node.
- `[utils.ts:getNodeBoundingClientRect]`: Computes DOM client rect coordinates for a document node.
- `[utils.ts:cssParaObj]`: Converts CSS inline style string to key-value record.
- `[utils.ts:objParaCss]`: Converts style key-value record back to inline CSS string.
- `[utils.ts:getHTMLFromFragment]`: Serializes ProseMirror slice fragment to HTML string.
- `[utils.ts:debounce]`: Generic debounce wrapper for high-frequency callbacks.
- [Components](./components/README.md): Toolbar, dropdowns, and dialog components.
- [Directives](./directives/README.md): Click-outside and bubble menu directives.
- [Extensions](./extensions/README.md): Modular Tiptap extension implementations.
- [Services](./services/README.md): Floating menu and KaTeX state coordination services.
- [Utils](./utils/README.md): Selection inspection and node query utilities.

## Invariants

- `[tiptap-editor.ts:NgxTiptapEditor]`: Editor instance must be destroyed on `ngOnDestroy` to prevent memory leaks.
- `[tiptap-editor.ts:NgxTiptapEditor]`: Implements Angular `ControlValueAccessor` contract (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`).

## Side Effects

- `[tiptap-editor.ts:NgxTiptapEditor]`: Mounts Tiptap editor DOM elements, emits `onContentChange` and `onEditorReady` outputs, and binds ProseMirror transaction handlers.
- `[utils.ts:createHTMLElement]`: Directly invokes `document.createElement`.

## Verification

- Run: `npm test`
