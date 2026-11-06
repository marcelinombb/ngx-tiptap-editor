# Library Source Package

## Overview

Entry point package for the `ngx-tiptap-editor` Angular library, exposing the public API boundary and aggregating core editor modules.

## Interface

- `[public-api.ts]`: Canonical public API surface re-exporting `NgxTiptapEditor`, `ExtensionFactory`, UI components, directives, node view bridge (`AngularNodeViewComponent`, `AngularNodeViewRenderer`), and extension definitions.
- [Core Library (lib)](./lib/README.md): Implementation package containing editor components, directives, extensions, and services.

## Invariants

- `[public-api.ts]`: All public library symbols exported for consumer packaging must pass ng-packagr bundling checks without circular dependency leaks.

## Side Effects

- None

## Verification

- Run: `npm test`
