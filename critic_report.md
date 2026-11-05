# Critic Review Report: Internalizing Angular NodeView Bridge

**Target:** `docs/designs/internalizing-angular-nodeview-bridge.md` (`lines 1..176`)

## Severity Breakdown

- 🔴 **Blocker:** 0
- 🟡 **Major:** 3
- 🟢 **Nit:** 3

---

## Prioritized Findings

### 1. Omission of `stopEvent` and `ignoreMutation` Lifecycle Hooks

- **Severity:** 🟡 Major
- **Affected Scope:** Lines 81–90 (Section 4.2, Item 2: `AngularNodeView`)
- **Discrepancy Description:** The specification details `mount()`, `dom`, `contentDOM`, `update()`, `selectNode()`, and `destroy()`, but omits ProseMirror's `stopEvent(event: Event)` and `ignoreMutation(mutation: MutationRecord)` handlers.
- **Rationale & Recommendation:** In interactive Angular NodeViews containing form inputs, buttons, sliders, or math widgets (such as those in `FigureComponent` and `AnswerBoxComponent`), ProseMirror will intercept DOM events and keyboard navigation unless `stopEvent` delegates them appropriately. Additionally, Angular change detection DOM mutations will trigger ProseMirror document reparsing errors unless `ignoreMutation` ignores mutations within the Angular host. **Recommendation:** Add explicit specifications for `stopEvent` (allowing custom predicate delegation via `options.stopEvent`) and `ignoreMutation` (ignoring DOM mutations occurring inside the component container, except when mutations target `contentDOM`).

### 2. Inaccurate Angular `createComponent` Options Signature

- **Severity:** 🟡 Major
- **Affected Scope:** Lines 71–73 (Section 4.2, Item 1: `AngularRenderer`)
- **Discrepancy Description:** The text states: `Calls createComponent(ViewComponent, { environmentInjector: applicationRef.injector, elementInjector: injector })`.
- **Rationale & Recommendation:** In Angular 14+ (`@angular/core`), `CreateComponentOptions` does not define an `elementInjector` property. The correct parameter names are `injector?: Injector` and `environmentInjector?: EnvironmentInjector`. Passing `elementInjector` will result in a TypeScript compilation error or be silently ignored. **Recommendation:** Correct the specification to `createComponent(ViewComponent, { environmentInjector: this.applicationRef.injector, elementInjector: injector })` -> `createComponent(ViewComponent, { injector, environmentInjector: applicationRef.injector })`.

### 3. Missing Specification of `AngularNodeViewRendererOptions` Type Contract

- **Severity:** 🟡 Major
- **Affected Scope:** Lines 106–114 (Section 4.2, Item 4) and Section 3
- **Discrepancy Description:** `AngularNodeViewRendererOptions` is referenced in the factory signature (`options: Partial<AngularNodeViewRendererOptions>`) and in non-goal contracts, but its interface definition, exported fields, and types are never defined in Section 4.
- **Rationale & Recommendation:** Because external extensions and internal consumers depend on this interface to pass Angular's `Injector` and optional hooks, it is an essential public API surface. **Recommendation:** Add the interface definition in Section 4.2:
  ```typescript
  export interface AngularNodeViewRendererOptions {
    injector: Injector;
    stopEvent?: ((event: Event) => boolean) | null;
    update?: ((node: Node, decorations: readonly Decoration[]) => boolean) | null;
  }
  ```
  Also add `AngularNodeViewRendererOptions` to the list of public constructs exported in `projects/ngx-tiptap-editor/src/lib/node-view/index.ts`.

### 4. Ambiguity in `contentDOM` Mounting Mechanism

- **Severity:** 🟢 Nit
- **Affected Scope:** Lines 84–86 (Section 4.2, Item 2)
- **Discrepancy Description:** Line 84 states that `mount()` "constructs editable content container if node is not a leaf, appends contentDOMElement to [data-node-view-content]".
- **Rationale & Recommendation:** In both upstream `ngx-tiptap` and standard ProseMirror NodeViews, the Angular component template declares `<div data-node-view-content></div>`, and the NodeView simply discovers it via `this.renderer.dom.querySelector('[data-node-view-content]')`. Describing it as "constructing" and "appending" suggests manual DOM mutation by the adapter into the Angular view hierarchy, which would conflict with Angular's template renderer. **Recommendation:** Clarify the description: `mount()` queries `[data-node-view-content]` from the rendered component DOM and assigns it to `this.contentDOMElement`.

### 5. Explanatory Note for Upstream PascalCase `HTMLAttributes` Input

- **Severity:** 🟢 Nit
- **Affected Scope:** Line 100 (Section 4.2, Item 3)
- **Discrepancy Description:** `readonly HTMLAttributes: InputSignal<Record<string, any>>` violates standard Angular camelCase conventions (`htmlAttributes`).
- **Rationale & Recommendation:** While preserving upstream `ngx-tiptap` naming is essential for backwards compatibility with existing extensions, readers or linters may flag this casing. **Recommendation:** Add a brief inline note explaining that `HTMLAttributes` retains upstream casing intentionally to prevent breaking consumer extensions implementing `AngularNodeViewComponent`.

### 6. Redundant Prefix in Section 5

- **Severity:** 🟢 Nit
- **Affected Scope:** Lines 165, 169, 173 (Section 5: Alternatives Considered)
- **Discrepancy Description:** Each bullet under "Technical Reason for Rejection" begins with "Rejected by author:".
- **Rationale & Recommendation:** The section and sub-headers already establish that these are rejected alternatives. Prefixing each paragraph with "Rejected by author:" is repetitive. **Recommendation:** Remove redundant prefix.
