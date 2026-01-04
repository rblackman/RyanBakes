# RyanBakes

This repository contains the full Ryan-Bakes.com application stack, organized as a PNPM monorepo. It includes:

- A **Sanity Studio CMS** for content authoring
- A **Next.js website** (App Router) for rendering content
- A **generated type package** shared between CMS and website
- Centralized tooling for linting, type-checking, and builds

The repo is designed to ensure **schema-first, type-safe content flow** from Sanity into the website.

---

## Repository Structure

```
.
├── apps/
│   ├── cms/                # Sanity Studio (v5+)
│   │   ├── schemas/        # Document & object schemas
│   │   ├── sanity.config.ts
│   │   ├── sanity.cli.ts   # Includes typegen config
│   │   └── schema.json     # Extracted schema (generated)
│   │
│   └── website/            # Next.js App Router site
│       ├── app/            # Routes & server components
│       ├── queries/        # GROQ queries
│       ├── hooks/
│       └── next.config.mjs
│
├── packages/
│   └── sanity-types/       # Generated, shared TypeScript types
│       └── sanity.types.ts # (generated, gitignored)
│
├── .lintstagedrc.mjs
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json      # TypeScript config shared across all projects.
└── tsconfig.json           # TypeScript config for root project.
```

---

## Architecture Overview

### 1. Schema-first CMS

- All content models live in `apps/cms/schemas`
- Portable Text, references, and objects are explicitly defined
- Required vs optional fields are enforced in schema validation
- The CMS is the **single source of truth**

### 2. Type Generation Pipeline

Sanity TypeGen is used for type generation.

Flow:
```
Sanity Schemas
   ↓
sanity schema extract
   ↓
schema.json
   ↓
sanity typegen generate
   ↓
packages/sanity-types/sanity.types.ts
```

- Generated types include documents, objects, references, and images
- Website imports types from `@ryan-bakes/sanity-types`
- No runtime dependency on the CMS package

### 3. Website (Next.js)

- Uses **Next.js App Router**
- All data fetching is server-side (`server-only`)
- GROQ queries return typed results
- Components defensively handle optional fields (`undefined`)
- PortableText rendering is centralized and typed

### 4. Strict Type Safety

The repo intentionally uses:

- `exactOptionalPropertyTypes`
- Strict null checks
- No implicit `any`
- No fake “shape-matching” interfaces

If Sanity says a field is optional, the UI must handle it.

---

## Scripts

### Root-level

```bash
pnpm run dev:all         # Run CMS + website in parallel
pnpm run dev:website     # Run just website
pnpm run dev:cms         # Run just CMS

pnpm run build:all       # Typegen + build all apps
pnpm run build:cms       # Typegen build just CMS
pnpm run build:website   # Website build (invokes CMS typegen via prebuild)
pnpm run format          # Biome formatting
pnpm run lint            # Biome check
pnpm run typecheck       # TypeScript checks
```

### CMS

```bash
pnpm --filter cms dev
pnpm --filter cms build
pnpm --filter cms typegen
```

### Website

```bash
pnpm --filter website dev
pnpm --filter website build
```

### Website Conventions

- App Router pages define `metadata` or `generateMetadata` to ensure titles and descriptions are present for every route.
- Component props favor `type` aliases wrapped in `Readonly<>` instead of `interface` to keep contracts immutable and consistent.
- Optional Sanity fields remain optional in UI code; guard and provide fallbacks rather than asserting.

---

---

## CI & Automation

This repository uses GitHub Actions for continuous verification and deployment safety.

### CI Workflow
On pull requests and pushes to `main`:

- **Verify**
  - Sanity schema extract + typegen
  - Biome linting
  - TypeScript checks (strict, `exactOptionalPropertyTypes`)
- **Build**
  - Runs full workspace build
  - Skipped for fork PRs (repo variables unavailable)

Docs-only changes (`.md`, `docs/`) skip CI entirely.

### Vercel Preview
- Pull requests (non-forks) deploy preview builds via Vercel
- Preview URLs are automatically commented on the PR
- Uses deterministic `vercel build` + `deploy --prebuilt`

### Dependency Updates
- Dependabot opens weekly dependency update PRs
- Safe updates are auto-approved and auto-merged after CI passes
- Major framework upgrades are handled manually

## Linting & Type Checking

- **Biome** for formatting and linting
- **TypeScript** for correctness
- **lint-staged** runs:
  - `tsc` for the website
  - Biome on all staged files
- Husky enforces checks at commit time

You can run everything manually:

```bash
pnpm -w exec biome check .
pnpm -w exec tsc -p apps/website/tsconfig.json --noEmit
```

---

## Environment Variables

The website validates env vars at build time using Zod.

Required (example):

```env
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SANITY_KEY=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_STUDIO_GRAMS_UNIT_ID=
SANITY_REVALIDATE_SECRET=
```

### CI Variables

CI uses GitHub **repository variables** (not secrets) for build-time configuration.

These values are non-sensitive identifiers (dataset names, document keys, etc.)
and are written to `apps/website/.env` during CI. `SANITY_STUDIO_GRAMS_UNIT_ID`
is also exported for schema extraction in the CMS workflow (baker math validation).

The `SANITY_REVALIDATE_SECRET` is provided via a secret or repo variable and must
match the secret configured on the Sanity webhook that posts to
`/api/revalidate`; webhook requests are validated using the
`sanity-webhook-signature` header.

Sensitive credentials (e.g., deploy tokens) are stored as GitHub Secrets.

---

## Key Design Decisions

- Generated types are not checked in
- `schema.json` is generated and checked in
- No client-side GROQ
- No implicit assumptions about content existence

---

## Philosophy

> The CMS may lie. TypeScript never should.

If content is optional, the UI must survive it.
