# Consolidated Review Report: Internalizing Angular NodeView Bridge

**Document Target:** `docs/designs/internalizing-angular-nodeview-bridge.md`  
**Pipeline Preset:** Consolidated report with all review rubrics (Uninterrupted Full Flow)  
**Date:** 2026-11-05

---

## 1. Executive Summary & Review Verdict

The core proposal to internalize the ~150-line Angular NodeView bridge into `projects/ngx-tiptap-editor/src/lib/node-view/` is strongly validated. It eliminates significant friction for consumers by dropping external peer dependencies (`ngx-tiptap` and transitive `@floating-ui/dom`) without altering the component contract.

However, the uninterrupted multi-stage review revealed **2 Blockers** and **5 Majors** in the technical plan and implementation readiness that must be remediated before starting development:

1. The execution plan omitted automated unit tests (`npm run test:ci`) and test specs for the internalized bridge.
2. The dependency pruning step omitted running `npm install` and updating `package-lock.json`.
3. The public API surface was over-exposed (proposing to export internal engine plumbing `AngularRenderer` and `AngularNodeView` rather than keeping them private).
4. Critical ProseMirror lifecycle hooks (`stopEvent` and `ignoreMutation`) were omitted from `AngularNodeView`.

---

## 2. Traceability Matrix

| Consolidated ID | Priority   | Description                                                                                                                                                                                       | Source Stage & Lens                                                                         | Target Section                 |
| :-------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------ | :----------------------------- |
| **ACT-01**      | 🔴 Blocker | Provision bridge unit tests and enforce `npm run test:ci` in CI verification.                                                                                                                     | Stage 9 (`egm-implementation-readiness`), Stage 5/8 (`egm-zoom-out`)                        | Sec 6.1 (Phase 1 & 5), Sec 6.2 |
| **ACT-02**      | 🔴 Blocker | Add `npm install` step and `package-lock.json` to Affected Files table.                                                                                                                           | Stage 9 (`egm-codebase-details`)                                                            | Sec 6.1 (Phase 4), Sec 6.2     |
| **ACT-03**      | 🟡 Major   | Restrict public exports in `public-api.ts` to `AngularNodeViewComponent`, `AngularNodeViewRenderer`, and `AngularNodeViewRendererOptions`. Keep `AngularRenderer` and `AngularNodeView` internal. | Stage 5/8 (`egm-zoom-out`), Stage 6 (`egm-comprehension`), Stage 9 (`egm-codebase-details`) | Sec 2, Sec 4.5, Sec 6.2        |
| **ACT-04**      | 🟡 Major   | Specify ProseMirror `stopEvent` and `ignoreMutation` lifecycle handlers on `AngularNodeView`.                                                                                                     | Stage 7 (`egm-design`)                                                                      | Sec 4.2                        |
| **ACT-05**      | 🟡 Major   | Correct Angular `createComponent` options signature from `elementInjector` to standard `injector`.                                                                                                | Stage 7 (`egm-design`)                                                                      | Sec 4.2                        |
| **ACT-06**      | 🟡 Major   | Explicitly define the `AngularNodeViewRendererOptions` interface.                                                                                                                                 | Stage 6 (`egm-comprehension`), Stage 7 (`egm-structural`)                                   | Sec 4.2                        |
| **ACT-07**      | 🟡 Major   | Mandate exact relative import `../../node-view` in Phase 3 and Table 6.2 to prevent build failures.                                                                                               | Stage 9 (`egm-codebase-details`)                                                            | Sec 6.1 (Phase 3), Sec 6.2     |
| **ACT-08**      | 🟡 Major   | Document explicit version bump to `1.2.0` in `projects/ngx-tiptap-editor/package.json`.                                                                                                           | Stage 9 (`egm-implementation-readiness`)                                                    | Sec 6.1 (Phase 4)              |
| **ACT-09**      | 🟢 Nit     | Clarify that `data-node-view-content` is an HTML attribute queried from the template, not an Angular directive.                                                                                   | Stage 6 (`egm-comprehension`), Stage 7 (`egm-design`)                                       | Sec 3, Sec 4.2                 |
| **ACT-10**      | 🟢 Nit     | Prune speculative zoneless justifications and repetitive "Rejected by author:" prefixes.                                                                                                          | Stage 5/8 (`egm-zoom-out`), Stage 7 (`egm-style`)                                           | Sec 1, Sec 5                   |
| **ACT-11**      | 🟢 Nit     | Seed demo editor verification with sample interactive widgets (`Figure`, `AnswerBox`).                                                                                                            | Stage 9 (`egm-implementation-readiness`)                                                    | Sec 6.1 (Phase 5)              |

---

## 3. Prioritized Action Items

### 🔴 Blockers

#### ACT-01: Provision Unit Test Specs and Enforce `npm run test:ci`

- **Problem:** Bringing component lifecycle and DOM projection in-house without unit test coverage creates long-term regression risks.
- **Remediation:**
  1. Add `projects/ngx-tiptap-editor/src/lib/node-view/angular-node-view.spec.ts` to Phase 1 and Table 6.2.
  2. Add `npm run test:ci` to Phase 5 verification checklist.

#### ACT-02: Specify `npm install` and Add `package-lock.json`

- **Problem:** Editing `package.json` without updating `package-lock.json` breaks CI `npm ci` runs and leaves stale dependencies in `node_modules`.
- **Remediation:**
  1. Add `package-lock.json` to the Affected Files table in Section 6.2.
  2. Add `npm install` command to Phase 4 to synchronize lockfile and prune `node_modules/ngx-tiptap`.

---

### 🟡 Majors

#### ACT-03: Guard Public API Surface

- **Problem:** Exporting `AngularRenderer` and `AngularNodeView` leaks internal component instantiation mechanics and binds the library to unnecessary backwards-compatibility promises.
- **Remediation:** In `projects/ngx-tiptap-editor/src/public-api.ts`, export only:
  - `AngularNodeViewComponent`
  - `AngularNodeViewRenderer`
  - `AngularNodeViewRendererOptions`

#### ACT-04: Implement `stopEvent` and `ignoreMutation` Handlers

- **Problem:** Without `stopEvent`, ProseMirror traps clicks and keyboard inputs inside interactive widgets (buttons, math editors). Without `ignoreMutation`, Angular DOM updates cause ProseMirror re-parse errors.
- **Remediation:** Add behavioral specifications for `stopEvent` and `ignoreMutation` to `AngularNodeView` in Section 4.2.

#### ACT-05: Correct `createComponent` Parameter Signature

- **Problem:** In Angular 14+, `createComponent` takes `{ injector, environmentInjector }`, not `{ elementInjector }`.
- **Remediation:** Update Section 4.2 pseudocode to: `createComponent(ViewComponent, { injector, environmentInjector: applicationRef.injector })`.

#### ACT-06: Define `AngularNodeViewRendererOptions`

- **Problem:** The interface is referenced in factory signatures without an explicit definition.
- **Remediation:** Add definition to Section 4.2:
  ```typescript
  export interface AngularNodeViewRendererOptions {
    injector: Injector;
    stopEvent?: ((event: Event) => boolean) | null;
    update?: ((props: RendererUpdateProps) => boolean) | null;
  }
  ```

#### ACT-07: Dictate Exact Relative Imports in Extension Files

- **Problem:** Ambiguous import guidelines may lead implementers to import from `'ngx-tiptap-editor'`, failing TypeScript compilation.
- **Remediation:** Explicitly mandate `../../node-view` across all extension rows in Section 6.2.

#### ACT-08: Document Version Bump to `1.2.0`

- **Problem:** Target version 1.2.0 is listed in the header, but absent from execution steps.
- **Remediation:** Add step in Phase 4 detailing update of `projects/ngx-tiptap-editor/package.json` version to `1.2.0`.

---

### 🟢 Nits

- **ACT-09**: Explain that component templates declare `<div data-node-view-content></div>` as a raw HTML attribute for content projection.
- **ACT-10**: Remove speculative claims about zoneless primitives in Section 1 and strip redundant "Rejected by author:" prefixes in Section 5.
- **ACT-11**: Specify that the demo application verification in Phase 5 must insert at least one interactive NodeView widget to verify runtime rendering.
