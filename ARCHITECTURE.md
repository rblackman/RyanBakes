# Architecture Overview

This document describes the architecture of the **RyanBakes** monorepo, including data flow, build orchestration, and the design decisions that connect Sanity CMS, generated types, and the Next.js website.

---

## High-Level Architecture

```
RyanBakes-Website/
├─ apps/
│  ├─ cms/                 # Sanity Studio (v5)
│  └─ website/             # Next.js App Router site
├─ packages/
│  └─ sanity-types/        # Generated Sanity TypeGen output
├─ shared/                 # Shared runtime utilities (env, config)
└─ tooling/
```

Core principle:

> **Sanity is the source of truth → types are generated → the website consumes types defensively**

---

## Data Flow

### 1. Schema Definition (CMS)

- All schemas live in `apps/cms/schemas`
- Uses Sanity v5 APIs (`defineType`, `defineField`, `defineArrayMember`)
- Validation rules live **only** in schema files
- Required-ness is enforced at the schema level, not assumed in the website

Examples:
- `recipe`
- `unit`
- `ingredient`
- `portableText`
- `imageWithAlt`

---

### 2. Schema Extraction

Sanity CLI extracts a *runtime schema snapshot*:

```bash
sanity schema extract --path ./schema.json
```

Notes:
- `schema.json` is **generated**
- `schema.json` is not committed.
- It is never manually edited

---

### 3. Type Generation

Sanity TypeGen consumes `schema.json`:

```bash
sanity typegen generate
```

Output:
```
packages/sanity-types/sanity.types.ts
```

Rules:
- This file is **fully generated**
- No hand edits
- Consumers must adapt to optional fields

---

### 4. Type Consumption (Website)

The Next.js app imports types from:

```ts
import type { Recipe, Unit, ImageWithAlt } from "@ryan-bakes/sanity-types";
```

Key constraints:
- All fields may be `undefined`
- References may be missing
- Arrays may be empty or undefined

The UI must:
- Guard every access
- Provide sensible fallbacks
- Never assume presence

---

## Website Architecture

### App Router

- Uses Next.js App Router
- All data fetching happens in **server components**
- No Sanity client usage in the browser

Structure:
```
app/
├─ (components)/           # Shared server components
├─ recipe/
│  ├─ [slug]/
│  │  ├─ page.tsx
│  │  └─ (components)/
│  └─ page.tsx
└─ tags/
```

---

### Queries Layer

Located in:
```
apps/website/queries/
```

Responsibilities:
- Own all GROQ queries
- Shape query results
- Minimize data sent to components

Rules:
- Query return types are explicit
- Components do not construct GROQ
- Queries may return partial documents

---

### Components

Components are **pure renderers**:

- No fetching
- No schema assumptions
- Handle `undefined` gracefully

Patterns:
- `value ?? ""`
- `array ?? []`
- Early returns when required data is missing

---

## Portable Text Strategy

- Portable Text types are generated
- Rendering handled via a wrapper component
- Custom marks (fraction, links) are explicitly mapped

Design goal:
> **Rendering never throws due to malformed content**

---

## Images

### ImageWithAlt Pattern

- Images are optional everywhere
- Asset references may be missing
- `createImageBuilder` handles low-level URL construction

Rules:
- No image access without existence checks
- Hero, featured, and OG images all guard asset presence

---

## Ingredients & Units

### Units

- Units are documents
- Ingredients reference units
- Resolution happens at render time

Behavior:
- Missing unit → render amount only
- Missing display config → defaults applied

---

## Environment Configuration

- Validation is handled with Zod
- `validate-env.ts` runs during build
- Required vars:
  - `NEXT_PUBLIC_SANITY_KEY`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_BASE_URL`

Website builds assume:
> **Environment is valid or build should fail**

---

## Build Orchestration

### TypeGen Dependency Chain

```
Sanity Schemas
   ↓
schema.json
   ↓
sanity-types
   ↓
Next.js build
```

### Root Commands

- `typegen` runs only in `apps/cms`
- Website `prebuild` may invoke typegen (deployment-safe)
- Full builds run from repo root

---

## Linting & Type Safety

- Biome handles formatting and linting
- TypeScript is strict
- `exactOptionalPropertyTypes` is enabled

Implications:
- Optional means *optional*
- Props must accept `undefined` explicitly
- No implicit narrowing

---

## Design Principles (Non-Negotiable)

1. **Schema is truth**
2. **Generated types are authoritative**
3. **UI is defensive**
4. **No silent assumptions**
5. **Builds fail loudly**
6. **Generated code is never edited**
7. **If TypeScript complains, it is probably right**

---

## Common Failure Modes

- Forgetting optional checks on references
- Assuming `slug.current` exists
- Passing `undefined` into PortableText
- Treating generated types as exact mirrors of content reality

These are expected—and the architecture is designed to surface them early.

---

## Summary

This architecture intentionally trades convenience for correctness.

The result:
- Fewer runtime crashes
- Predictable builds
- Clear ownership boundaries
- Confidence when refactoring schemas

If something feels “annoyingly strict,” that is by design.
