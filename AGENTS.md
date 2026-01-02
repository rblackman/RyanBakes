# AGENTS.md

This document describes how humans and AI agents should interact with this repository.

This document is **authoritative** for architectural intent and automation behavior.

---

## Core Rules

### 1. Schema Is the Source of Truth

- Never redefine Sanity types by hand
- Never "mirror" schema shapes in the website
- Always import Sanity CMS types from `@ryan-bakes/sanity-types`

If a type mismatch exists, fix the schema or handle `undefined`.

---

### 2. Optional Means Optional

If a Sanity field is not explicitly required:

- TypeGen will mark it optional
- UI code must:
  - Guard
  - Fallback
  - Or short-circuit render

Never silence errors with non-null assertions unless explicitly justified.

### CI Is the Arbiter

- CI must pass before any change is considered valid
- Do not weaken CI checks to make changes pass
- Fix the schema, types, or code instead

If CI fails:
- Identify the failing stage (verify vs build)
- Fix the underlying issue
- Do not bypass or disable checks

---

### 3. No Legacy Codegen

Do Not:
- Use `sanity-codegen`
- Use `SanityKeyed`
- Use Ad-hoc reference types

Do:

- Use Sanity TypeGen
- Use generated reference types
- Add `_key` only where arrays require it

---

### 4. PortableText Handling

- All PortableText rendering goes through the shared `PortableText` component
- Components must accept `TypedObject | TypedObject[] | undefined`
- Callers must guard against `undefined`

---

### 5. Image Handling

- Sanity images are always passed as `ImageWithAlt | undefined`
- Callers must guard before accessing `.asset`
- Image URL generation is centralized in `useImageBuilder`

---

### 6. Build Order Matters

Correct order:

1. CMS schema extract
2. Sanity typegen
3. Website build

Any new scripts must preserve this order.

---

### 7. Lint & Type Safety Are Non-Negotiable

- Do not bypass errors with `any`
- Do not weaken tsconfig
- Do not disable lint rules to “make it work”

Fix the model or the UI.

---

## For AI Assistants

When generating code:

- Use existing patterns
- Always include braces around `if`, `else`, and `else if` statements
- Prefer explicit narrowing over assertions
- Do not reintroduce removed libraries
- Assume strict TypeScript settings

If unsure:
- Ask for clarification
- Or choose the safest, most explicit option

---

## Automation Expectations

This repository intentionally automates repetitive and mechanical tasks.

### Dependency Updates
- Dependency updates are handled by Dependabot
- Safe updates may be auto-approved and auto-merged
- Major upgrades require explicit human review

### Environment Handling
- CI writes `apps/website/.env` from repository variables
- Do not hardcode env values into workflows
- Do not remove validation steps

### Workflow Changes
When modifying GitHub Actions:
- Preserve verify → build ordering
- Preserve fork-safe behavior
- Avoid introducing third-party actions unless clearly justified

## Making Changes

When making changes:

- Test Them:
  -  When changing things in the CMS, test both CMS and Website (`pnpm run build`)
  - When changing things in the Website, test the website (`pnpm run build:website`)
- Update documentation appropriately:
  - `AGENTS.md`, `ARCHITECTURE.md`, `README.md`
- For commit comments, follow the conventions laid out in `commitlint.config.mjs`. Add an expanded description with a more complete accounting of the changes.

## For Humans

If something feels "overly strict", that's intentional.

This repo is designed to fail early, loudly, and correctly.
