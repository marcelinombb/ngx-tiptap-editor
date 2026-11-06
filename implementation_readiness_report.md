# Stage 9 Implementation Readiness Test Report

**Target:** `docs/designs/internalizing-angular-nodeview-bridge.md` (Lines 177..231)

## Severity Summary

- 🔴 **Blockers**: 2
- 🟡 **Major**: 3
- 🟢 **Nits**: 2

---

## Prioritized Findings

### 1. Omission of Automated Test Execution & Bridge Unit Test Specs - Severity: Blocker

- **Reviewer Lens:** `egm-implementation-readiness`
- **Affected Scope:** Lines 181–185 (Phase 1), Lines 197–202 (Phase 5), Lines 207–211 (Table 6.2)
- **Discrepancy Description:** Phase 5 only validates compilation (`npm run build:lib`, `npm run build`), linting, and formatting (`npm run lint`, `npm run format:check`), completely omitting automated unit test execution (`npm test` / `npm run test:ci`). Furthermore, neither Phase 1 nor Table 6.2 provisions unit test specs (`angular-renderer.spec.ts` or `angular-node-view.spec.ts`) for the newly scaffolded bridge module in `projects/ngx-tiptap-editor/src/lib/node-view/`.
- **Recommendation:** Provision unit test files (e.g., `projects/ngx-tiptap-editor/src/lib/node-view/angular-node-view.spec.ts`) in Phase 1 and Table 6.2, and add `npm run test:ci` as an explicit mandatory step in Phase 5.

### 2. Omission of `package-lock.json` and CLI Pruning Command (`npm install`) - Severity: Blocker

- **Reviewer Lens:** `egm-codebase-details`
- **Affected Scope:** Lines 192–196 (Phase 4: Dependency Pruning & Configuration), Lines 229–230 (Table 6.2)
- **Discrepancy Description:** Phase 4 specifies editing `projects/ngx-tiptap-editor/package.json` and root `package.json` to remove `"ngx-tiptap"`, but fails to specify running `npm install` to synchronize the dependency tree and regenerate `package-lock.json`. `package-lock.json` is also omitted from the Affected Files table.
- **Recommendation:** Add `package-lock.json` as a Modified file in Table 6.2 and add an explicit CLI command (`npm install`) to Phase 4 before proceeding to Phase 5.

### 3. Incomplete Public API Export Description Omitting `AngularNodeView` - Severity: Major

- **Reviewer Lens:** `egm-codebase-details`
- **Affected Scope:** Line 212 (`projects/ngx-tiptap-editor/src/public-api.ts`) vs Lines 39–40 (Section 3) and Line 148 (Section 4.5)
- **Discrepancy Description:** Table 6.2 (line 212) defines the rationale for modifying `public-api.ts` as: _"Exposes `AngularNodeViewComponent`, `AngularNodeViewRenderer`, and `AngularRenderer` on the library's public surface to ensure backwards compatibility for consumers."_ This omits `AngularNodeView`. In Section 1 (lines 14–18) and Section 3 (lines 39–40), all four constructs are documented as required for backwards compatibility.
- **Recommendation:** Align Line 212 with Section 4.5 by explicitly stating that `public-api.ts` will `export * from './lib/node-view';` or explicitly enumerating all 4 symbols: `AngularNodeViewComponent`, `AngularNodeViewRenderer`, `AngularRenderer`, and `AngularNodeView`.

### 4. Unspecified Internal Extension Import Specifiers - Severity: Major

- **Reviewer Lens:** `egm-codebase-details`
- **Affected Scope:** Lines 189–191 (Phase 3), Lines 213–228 (Table 6.2)
- **Discrepancy Description:** Table 6.2 repeatedly notes: _"Redirects import of `...` from `'ngx-tiptap'` to internal bridge"_, without declaring the exact import string. In `tsconfig.json`, the path alias `"ngx-tiptap-editor"` points to `"./dist/ngx-tiptap-editor"`. If an implementer attempts to import from `'ngx-tiptap-editor'`, the build will fail or bind to stale pre-existing artifacts.
- **Recommendation:** Explicitly state the exact import specifier `../../node-view` across all extension rows in Section 6.2 and in Phase 3.

### 5. Missing Version Bump Specification for Semantic Release - Severity: Major

- **Reviewer Lens:** `egm-implementation-readiness`
- **Affected Scope:** Lines 192–196 (Phase 4), Line 6
- **Discrepancy Description:** The design header specifies Target Version `1.2.0` (a minor version bump dropping a peer dependency), but Phase 4 does not specify whether `projects/ngx-tiptap-editor/package.json` version should be bumped manually or via the repository's configured release scripts (`npm run release:minor` via `commit-and-tag-version`).
- **Recommendation:** Include an explicit task in Phase 4 or Phase 5 detailing the version bump to `1.2.0` in `projects/ngx-tiptap-editor/package.json`.

### 6. Demo App Verification Lacks Seeded NodeView Widget Coverage - Severity: Nit

- **Reviewer Lens:** `egm-implementation-readiness`
- **Affected Scope:** Lines 201–202 (Phase 5)
- **Discrepancy Description:** Phase 5 instructs: _"Verify runtime rendering of node views in demo editor."_ In `src/app/app.ts`, the default initialized document only contains a basic HTML table, without any of the 5 custom Angular NodeViews.
- **Recommendation:** Specify in Phase 5 that sample markup or editor commands should be used to mount each of the 5 NodeView types during manual verification.

### 7. File Naming Casing Discrepancy & Phase Traceability in Table 6.2 - Severity: Nit

- **Reviewer Lens:** `egm-style`
- **Affected Scope:** Lines 203–231 (Table 6.2)
- **Discrepancy Description:** Table 6.2 lists `Figure.ts` (PascalCase) next to `figure.component.ts` (kebab-case).
- **Recommendation:** Add a brief note clarifying `Figure.ts` casing and optionally add a "Phase" column to Table 6.2.
