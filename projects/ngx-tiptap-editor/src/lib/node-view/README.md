# NodeView Bridge Package

## Overview

Angular NodeView bridge layer for `ngx-tiptap-editor`, providing integration primitives for rendering standalone Angular components as Tiptap / ProseMirror node views without external wrapper dependencies.

## Interface

- `[angular-node-view.component.ts:AngularNodeViewComponent]`: Abstract standalone Angular base component declaring required signal inputs for editor, node, decorations, selection state, and node manipulation callbacks.
- `[angular-node-view-renderer.ts:AngularNodeViewRenderer]`: NodeView renderer factory creating an `AngularNodeView` instance bound to an Angular component and injector.
- `[angular-node-view-renderer.ts:AngularNodeViewRendererOptions]`: Configuration options for the Angular node view renderer, including Angular `Injector`, optional custom `update` handler, and element attributes.
- `[angular-node-view-renderer.ts:RendererUpdateProps]`: Interface for update lifecycle arguments passed to custom update callbacks.
- `[angular-node-view-renderer.ts:AttrProps]`: Type definition representing static attribute dictionaries or dynamic attribute resolver functions.
- `[angular-node-view.ts:AngularNodeView]`: Concrete Tiptap `NodeView` implementation managing component mounting, ProseMirror selection synchronization, DOM content hosting, and teardown.
- `[angular-renderer.ts:AngularRenderer]`: Generic component manager dynamically instantiating Angular components via `createComponent`, updating signal inputs, and attaching views to `ApplicationRef`.

## Invariants

- `[angular-node-view.ts:AngularNodeView]`: Must deregister editor event listeners and call `renderer.destroy()` upon `destroy()` to prevent memory leaks and detached DOM nodes.
- `[angular-node-view.ts:AngularNodeView]`: `contentDOM` must evaluate to `null` when underlying node is a leaf node (`node.isLeaf === true`).

## Side Effects

- `[angular-renderer.ts:AngularRenderer]`: Dynamically instantiates Angular components and attaches host views to `ApplicationRef`.
- `[angular-node-view.ts:AngularNodeView]`: Modifies DOM class list (`ProseMirror-selectednode`), binds drag listeners, and listens to editor `selectionUpdate` events.

## Verification

- Run: `npm test`
