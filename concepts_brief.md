# Internalizing Angular NodeView Bridge into ngx-tiptap-editor

- **Author:** marcelinombb
- **Date:** 2026-11-05

## Overview

`ngx-tiptap-editor` currently relies on `ngx-tiptap` solely for its Angular-to-ProseMirror NodeView bridge (`AngularRenderer`, `AngularNodeView`, `AngularNodeViewRenderer`, and `AngularNodeViewComponent`). All other features from `ngx-tiptap` (directives for editor creation, bubble menus, and floating menus) are unused or already custom-built.

This initiative extracts and internalizes the ~150-line bridge directly into `ngx-tiptap-editor` under MIT license attribution. It eliminates `ngx-tiptap` and its indirect peer dependencies (such as `@floating-ui/dom`) from consumer peer requirements while maintaining full API compatibility for internal and third-party custom extensions.

## Analysis

### 1. Codebase Details & Architecture

- **Current Footprint:** Only 4 symbols are used across 10 extension files: `AngularRenderer`, `AngularNodeView`, `AngularNodeViewRenderer`, and `AngularNodeViewComponent`.
- **Proposed Target Structure:**
  - `projects/ngx-tiptap-editor/src/lib/node-view/angular-node-view.component.ts`: Base class defining Angular signal inputs for NodeView properties (`editor`, `node`, `decorations`, `innerDecorations`, `view`, `selected`, `extension`, `HTMLAttributes`, `getPos`, `updateAttributes`, `deleteNode`).
  - `projects/ngx-tiptap-editor/src/lib/node-view/angular-renderer.ts`: Generic bridge wrapper instantiating standalone Angular components dynamically via Angular's `createComponent()` and synchronizing inputs via `setInput()`.
  - `projects/ngx-tiptap-editor/src/lib/node-view/angular-node-view.ts`: Concrete ProseMirror `NodeView` subclass handling DOM mount, selection synchronization, content projection (`[data-node-view-content]`), and cleanup.
  - `projects/ngx-tiptap-editor/src/lib/node-view/angular-node-view-renderer.ts`: Factory function `AngularNodeViewRenderer()`.
  - `projects/ngx-tiptap-editor/src/lib/node-view/index.ts`: Barrel export re-exported through `public-api.ts`.

### 2. Legal & Attribution Compliance

- Upstream repository `https://github.com/sibiraj-s/ngx-tiptap` is published under the standard MIT License (Copyright (c) 2021 Sibiraj).
- Extraction is fully permissible under MIT terms.
- Required action: Embed the original MIT license notice and copyright header at the top of each extracted source file and document upstream attribution in the project's documentation or NOTICE file.

### 3. Maintenance Burden vs. Autonomy Trade-Off

- **Maintenance Ownership:** Once internalized, compatibility fixes for future Angular major releases (e.g. Angular 21 zoneless reactivity, signal changes) or Tiptap core breaking changes must be maintained within `ngx-tiptap-editor`.
- **Offsetting Value:** The implementation is compact (~150 lines), contains no complex algorithms, and decouples the library from external release lag and peer dependency pinning issues.

### 4. Technical Risks & Edge Cases

- **Change Detection & Content DOM:** Leaf nodes (nodes without inner editable text) must set `contentDOM = null`, whereas container nodes must locate `[data-node-view-content]` and append the ProseMirror editable container.
- **Selection State Sync:** `handleSelectionUpdate()` must remain synchronized with ProseMirror transactions to trigger `selected` signal updates correctly without triggering unnecessary Angular change detection cycles.
- **Attributes Binding:** Attribute updates must correctly apply rendered attributes from `@tiptap/core` via `getRenderedAttributes()`.

## Goals vs. Non-Goals

- **In-Scope Goals:**
  - Implement the internal NodeView bridge in `projects/ngx-tiptap-editor/src/lib/node-view/`.
  - Re-export `AngularNodeViewComponent`, `AngularNodeViewRenderer`, and `AngularRenderer` via `projects/ngx-tiptap-editor/src/public-api.ts`.
  - Refactor all internal extension call sites (`answer-box`, `colar-questao`, `figure`, `association`, `alternatives`) to import from the internal module.
  - Remove `"ngx-tiptap"` from root `package.json` dependencies and `projects/ngx-tiptap-editor/package.json` peerDependencies.
  - Include proper MIT copyright notice acknowledging Sibiraj.
  - Update developer guide skill (`.agents/skills/tiptap-angular-nodeview/SKILL.md`).

- **Out-of-Scope Non-Goals:**
  - Re-implementing unused `ngx-tiptap` directives (`TiptapEditorDirective`, `TiptapFloatingMenuDirective`, `TiptapDraggableDirective`, `TiptapNodeViewContentDirective`).
  - Changing public method signatures or introducing breaking changes for existing custom extension components.
  - Rewriting existing extension components to use non-standard contracts.

## Alternatives Weighed

- **Alternative 1: Keep `ngx-tiptap` as a peer dependency**
  - _Reason for rejection:_ Forces consumers to install an external package and unnecessary transitive dependencies (`@floating-ui/dom`) for a ~150-line bridge, while subjecting consumers to upstream release delays.
- **Alternative 2: Move `ngx-tiptap` to bundled dependencies**
  - _Reason for rejection:_ In ng-packagr/Angular libraries, bundling another Angular library into runtime dependencies creates duplicate Angular compilation symbols, module resolution issues, and inflates the distribution package.
- **Alternative 3: Rewrite renderer with a completely new custom contract**
  - _Reason for rejection:_ Violates the strict requirement to maintain API compatibility for existing extensions and third-party custom NodeViews.

## Key Decisions & Staging for Next Steps

1. **Extraction Strategy:** Copy and adapt `AngularRenderer`, `AngularNodeView`, and `AngularNodeViewRenderer` into `projects/ngx-tiptap-editor/src/lib/node-view/`, retaining MIT copyright headers.
2. **Public API Contract:** Re-export all four bridge constructs from `public-api.ts` to preserve backwards compatibility.
3. **Execution Sequencing:**
   - Phase 1: Create `src/lib/node-view/` with bridge code and MIT notice.
   - Phase 2: Update internal extensions to point to internal bridge.
   - Phase 3: Export from `public-api.ts`.
   - Phase 4: Purge `ngx-tiptap` from `package.json` files and verify builds (`npm run build:lib`, `npm run build`).
