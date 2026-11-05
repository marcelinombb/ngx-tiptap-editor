# Demo Application Entry Package

## Overview

Root bootstrap entry point for the Angular demonstration and development application.

## Interface

- `[main.ts]`: Browser bootstrap script executing `bootstrapApplication` with root `App` component and `appConfig`.
- [Application Shell (app)](./app/README.md): Standalone demo application component and configuration.

## Invariants

- `[main.ts]`: Traps root bootstrap failures via `.catch((err) => console.error(err))`.

## Side Effects

- `[main.ts]`: Boots the Angular platform in the browser and attaches the application DOM tree to index.html.

## Verification

- Run: `npm test`
