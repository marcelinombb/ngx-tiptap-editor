# Intermediate Zoom Out Report: Internalizing Angular NodeView Bridge

**Document Target:** `docs/designs/internalizing-angular-nodeview-bridge.md` (Lines 1–231)  
**Standard:** Zoom Out Standard (Architecture Minimalism / YAGNI / Anti-Weeds)  
**Context Inputs:** `zoom_out_report.md`, `comprehension_report.md`, `critic_report.md`

---

## 1. Evaluation of Previous Stage Findings (Scope Creep & Complexity Audit)

1. **Reject Comprehension Finding 3 (Demanding Third-Party Type Origins as Document Bloat)**
   - _Previous Finding:_ Comprehension report requested specifying module origins for `DecorationWithType`, `DecorationSource`, and `NodeViewRendererProps`.
   - _Zoom Out Evaluation:_ **Scope Creep / Weeds**. Demanding that a high-level architectural document act as a TypeScript symbol dictionary for standard ProseMirror/Tiptap internal types adds zero architectural value.

2. **Contain Critic Findings 1 & 3 (Prescribing ProseMirror Hook Implementations & Interface Snippets)**
   - _Previous Finding:_ Critic report recommended adding explicit code specifications for `stopEvent`, `ignoreMutation`, and a full TypeScript interface declaration for `AngularNodeViewRendererOptions`.
   - _Zoom Out Evaluation:_ **Complexity Spike Risk**. While runtime support for `stopEvent` and `ignoreMutation` is functionally required by ProseMirror, adding full function signatures and interface definitions drops the document back into implementation-level pseudocode. The design document should specify the behavioral requirement without bloating the specification with low-level TypeScript interfaces.

3. **Reinforce Zoom Out Finding 1 & Comprehension Finding 4 (Resisting Public API Bloat)**
   - _Previous Finding:_ Initial Zoom Out identified that exporting `AngularRenderer` and `AngularNodeView` leaks internal plumbing; Comprehension noted an inconsistency in export count (3 vs 4).
   - _Zoom Out Evaluation:_ **Validated Blocker for Simplicity**. Neither internal extensions nor external consumers ever interact with `AngularRenderer` or `AngularNodeView`. Exporting them creates unnecessary public API surface and maintenance baggage.

---

## 2. Prioritized Review Findings

### 1. Public API Surface Over-Exposure (Leaking Internal Plumbing)

- **Severity:** 🟡 Major
- **Affected Scope:** Section 2 (lines 31–32), Section 4.5 (lines 146–149), Section 6.2 (line 212)
- **Simplicity Rationale:** The document proposes re-exporting internal engine mechanics (`AngularRenderer` and `AngularNodeView`) through `public-api.ts`. Extension authors only ever extend `AngularNodeViewComponent` and register via `AngularNodeViewRenderer(component, options)`. Upstream `ngx-tiptap` itself kept `AngularNodeView` private. Exporting internal orchestration classes widens the public API surface and leaks dynamic component creation details.
- **Recommendation:** Restrict public exports in `public-api.ts` to `AngularNodeViewComponent`, `AngularNodeViewRenderer`, and `AngularNodeViewRendererOptions`. Keep `AngularRenderer` and `AngularNodeView` internal to `lib/node-view/`.

### 2. Altitude Drop into Implementation Weeds in Section 4.2

- **Severity:** 🟡 Major
- **Affected Scope:** Section 4.2 (lines 67–115)
- **Simplicity Rationale:** Section 4.2 drops into low-level code details (enumerating all 11 signal inputs line-by-line, detailing call sequences, and reproducing a 7-line concrete JavaScript factory function).
- **Recommendation:** Summarize Section 4.2 into architectural responsibilities, data flow, and public contracts. Move concrete method signatures and property listings to PR implementation diffs.

### 3. Omission of Automated Regression Testing Strategy

- **Severity:** 🟡 Major
- **Affected Scope:** Section 6.1 (Phase 5, lines 197–202)
- **Simplicity Rationale:** Phase 5 specifies build compilation, linting, and manual testing in the demo app, but omits automated unit tests (`npm run test:ci`). Because this design brings dynamic component lifecycle and teardown in-house, lacking automated test coverage creates a long-term maintenance hazard.
- **Recommendation:** Explicitly add automated unit test execution (`npm run test:ci`) to Phase 5.

### 4. Speculative Optimization Justification (YAGNI on Zoneless Primitives)

- **Severity:** 🟢 Nit
- **Affected Scope:** Section 1 (line 23)
- **Simplicity Rationale:** The problem statement justifies internalizing the bridge by arguing the project "cannot adopt zoneless execution primitives". Yet the plan copies the exact existing change detection mechanics without introducing zoneless features.
- **Recommendation:** Remove speculative references to zoneless execution primitives.

### 5. Micro-File Fragmentation for ~150 Lines of Code

- **Severity:** 🟢 Nit
- **Affected Scope:** Section 4.1 (lines 58–65), Section 6.2 (lines 205–211)
- **Simplicity Rationale:** The plan splits ~150 lines of tightly coupled adapter logic across 5 separate files and a barrel export, where several files contain under 15 lines of code.
- **Recommendation:** Consolidate into 2–3 cohesive files (e.g., `angular-node-view.component.ts` for the base class, and `angular-node-view-renderer.ts` combining the renderer, adapter, and factory).
