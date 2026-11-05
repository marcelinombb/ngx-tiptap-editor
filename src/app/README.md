# Demo Application Package

## Overview

Root application shell demonstrating and testing `ngx-tiptap-editor` features in an interactive browser environment.

## Interface

- `[app.ts:App]`: Standalone root Angular component demonstrating editor configuration, formula rendering, and event binding.
- `[app.config.ts:appConfig]`: Application configuration providing routing, zone event coalescing, and client-side hydrations.
- `[app.routes.ts:routes]`: Angular route definitions for the demo application.

## Invariants

- `[app.ts:App]`: Binds reactive test content and image proxy configuration matching the library specification.

## Side Effects

- `[app.ts:App.handleContentChange]`: Logs content change strings and editor ready events to the browser console.

## Verification

- Run: `npm test`
