# Comprehension Report: Internalizing Angular NodeView Bridge

## Feature Specification Paraphrase

### What this proposes

The document proposes internalizing the ~150-line Angular-to-ProseMirror NodeView bridge (`AngularRenderer`, `AngularNodeView`, `AngularNodeViewRenderer`, and `AngularNodeViewComponent`) directly into `ngx-tiptap-editor` under the MIT license, rather than relying on `ngx-tiptap` as a peer dependency. By hosting this bridge internally under `projects/ngx-tiptap-editor/src/lib/node-view/` and re-exporting it through `public-api.ts`, the library removes the need for consumers to install `ngx-tiptap` and `@floating-ui/dom`. This eliminates dependency bloat, decouples the library from upstream release cycles, and retains complete API compatibility for existing internal extensions and external consumers.

### How the existing system works, per this document

The existing library is an Angular 20 rich text editor built on `@tiptap/core` that renders specialized interactive widgets (such as figures, math, and question boxes) using Angular components as ProseMirror NodeViews. To bridge ProseMirror's DOM-based NodeView system to Angular's dynamic component lifecycle, the project currently imports four classes and factory functions from `ngx-tiptap`. Because `ngx-tiptap` is declared as an external `peerDependency`, consumer applications are forced to declare both `ngx-tiptap` and `@floating-ui/dom` in their own manifests, even though the rest of `ngx-tiptap`'s feature set (editor directives, bubble menus, floating menus) is unused by this repository.

---

## Implementation Plan Paraphrase

### What this proposes

The implementation plan details a 5-phase migration executed across 18 target files. The project will scaffold the internal bridge files with MIT attribution headers under `projects/ngx-tiptap-editor/src/lib/node-view/`, export them via `public-api.ts`, and update the imports across all internal extension components (`AnswerBox`, `Alternatives`, `Association`, `ColarQuestao`, and `Figure`). Once internal imports are redirected to the local bridge, `ngx-tiptap` will be removed from `package.json` files and the internal developer skill guide will be updated, concluding with build, lint, and runtime verification.

### How the existing system works, per this document

Currently, the codebase references `AngularNodeViewComponent` and `AngularNodeViewRenderer` directly from the external package `'ngx-tiptap'` across multiple extension components and utility files. `ngx-tiptap` is tracked as a peer dependency in the library's package manifest and as a direct runtime dependency in the root project manifest. Additionally, internal agent documentation (`SKILL.md`) instructs developers to build custom node views by importing these primitives from `'ngx-tiptap'`.

---

## Comprehension Gaps, Undefined Terms & Ambiguities

### 1. Undefined `AngularNodeViewRendererOptions` and Unclear `Injector` Resolution

- **Severity**: 🟡 Major
- **Affected Scope**: Section 4.2 (lines 105–114) & Section 4.3 (lines 118–130)
- **Discrepancy Description & Rationale**:
  Section 4.2(1) establishes that `AngularRenderer` requires an Angular `Injector` to create dynamic components via `createComponent(ViewComponent, { environmentInjector: applicationRef.injector, elementInjector: injector })`. Section 4.2(4) then introduces the factory `AngularNodeViewRenderer(component, options)`. However, `AngularNodeViewRendererOptions` is never defined inline or referenced in the document. A fresh reader has no way of knowing what properties this interface contains (e.g., whether `injector?: Injector` is part of these options) or how `AngularNodeView` obtains and supplies the `Injector` to `AngularRenderer` when `AngularNodeView` is instantiated during ProseMirror rendering.

### 2. Unstated Mechanism for `[data-node-view-content]` Projection

- **Severity**: 🟡 Major
- **Affected Scope**: Section 3 (lines 45–46) & Section 4.2 (lines 81–86)
- **Discrepancy Description & Rationale**:
  In Section 3 (Non-Goals), the document explicitly states that upstream directives—including `TiptapNodeViewContentDirective`—will not be implemented or exported. In Section 4.2(2), it states that `AngularNodeView.mount()` "constructs editable content container if node is not a leaf, appends `contentDOMElement` to `[data-node-view-content]`". For a developer unfamiliar with upstream `ngx-tiptap` internals, this creates a comprehension gap: if `TiptapNodeViewContentDirective` is omitted, how is `[data-node-view-content]` marked in the Angular component? The document assumes unstated prerequisite knowledge that components must manually include the raw HTML attribute `data-node-view-content` on an element in their component template.

### 3. Missing Type Origins (`DecorationWithType`, `DecorationSource`, `NodeViewRendererProps`)

- **Severity**: 🟢 Nit
- **Affected Scope**: Section 4.2 (lines 91–104, 108–114)
- **Discrepancy Description & Rationale**:
  The property specifications for `AngularNodeViewComponent` reference `InputSignal<readonly DecorationWithType[]>` and `InputSignal<DecorationSource>`, and the factory snippet references `(props) => new AngularNodeView(...)`. The origins of `DecorationWithType` and `DecorationSource` (whether imported from `@tiptap/core` or `prosemirror-view`) are not specified, leaving the type contracts slightly ambiguous for someone implementing the types from scratch.

### 4. Inconsistent Exported Bridge Construct Count in Section 6.2

- **Severity**: 🟢 Nit
- **Affected Scope**: Section 6.2 (line 212) vs. Section 1 (lines 14–18) and Section 3 (lines 38–40)
- **Discrepancy Description & Rationale**:
  Throughout Sections 1, 2, and 3, the design consistently states that four constructs are being ported and re-exported (`AngularRenderer`, `AngularNodeView`, `AngularNodeViewRenderer`, and `AngularNodeViewComponent`). However, the rationale in Section 6.2 for modifying `projects/ngx-tiptap-editor/src/public-api.ts` (line 212) explicitly lists only three: "Exposes `AngularNodeViewComponent`, `AngularNodeViewRenderer`, and `AngularRenderer` on the library's public surface...". `AngularNodeView` is omitted from this description, creating a minor contradiction regarding what is intentionally exported on the library's public surface.
