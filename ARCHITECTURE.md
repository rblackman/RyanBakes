# Architecture

How the pieces of RyanBakes fit together: where content comes from, how it gets typed, fetched,
cached and rendered, and how edits in the Studio reach the live site.

Core principle:

> Sanity is the source of truth. Types are generated from it. The website consumes them defensively.

---

## Repository layout

```text
.
├── apps/
│   ├── cms/                    Sanity Studio
│   │   ├── schemas/
│   │   │   ├── documents/      recipe, unit, page, siteConfig, recipesPage, tagsPage, navItem
│   │   │   ├── objects/        ingredient, step, portableText, images, links, ...
│   │   │   ├── components/     custom Studio inputs
│   │   │   └── index.ts        registers every type
│   │   ├── helpers/            validation rules and Portable Text helpers
│   │   ├── structure.ts        desk layout (Recipes, Pages, Settings)
│   │   ├── singletons.ts       the one-of-a-kind documents and their fixed IDs
│   │   ├── sanity.config.ts    plugins: structure, vision, presentation, dashboard; singleton rules
│   │   └── sanity.cli.ts       project ID, dataset, TypeGen config
│   └── website/                Next.js App Router site
│       ├── app/                routes; route-only components live in app/<route>/features/
│       ├── components/
│       │   ├── ui/             small reusable pieces (image, fraction, tag, portable-text, ...)
│       │   ├── features/       larger shared sections (content blocks, baker's percentage, ...)
│       │   ├── menu/           main navigation (header)
│       │   └── footer/         site footer with the same links as the menu
│       ├── queries/
│       │   ├── live/           GROQ through sanityFetch: cache-tagged, draft-aware
│       │   └── static/         GROQ through the plain client: slug and tag lists
│       ├── shared/
│       │   ├── config/         Zod env schema, validated client and server env
│       │   └── lib/            Sanity client, defineLive setup and image URL helpers
│       ├── helpers/            pure functions (throwError, canonical URLs, ...)
│       ├── hooks/              small client-side React hooks
│       ├── styles/             global.css and variables.css
│       ├── types/              hand-written types that are not Sanity's (Keyed, ...)
│       ├── scripts/            validate-env.ts
│       └── flags.ts            Vercel feature flags
├── packages/
│   └── sanity-types/           generated sanity.types.ts (gitignored)
├── docs/                       content model and deployment guides
└── .agents/ .claude/ .copilot/ vendored AI agent skills (see AGENTS.md)
```

The website imports through path aliases defined in `apps/website/tsconfig.json`: `@apps/*`,
`@components/*`, `@helpers/*`, `@hooks/*`, `@queries/*`, `@shared/*` and `@t/*` (for `types/`).

---

## Content flow

```text
apps/cms/schemas  ──sanity schema extract──▶  apps/cms/schema.json
                                                      │
                                         sanity typegen generate
                                                      ▼
                               packages/sanity-types/sanity.types.ts
                                                      │
                        import type { Recipe } from "@ryan-bakes/sanity-types"
                                                      ▼
            apps/website/queries ──GROQ──▶ Sanity Content Lake ──▶ server components ──▶ HTML
```

1. **Schema.** Content types live in `apps/cms/schemas` and use `defineType`, `defineField` and
   `defineArrayMember`. Validation lives only there. See [`docs/content-model.md`](./docs/content-model.md).
2. **Types.** `pnpm typegen` extracts the schema and runs Sanity TypeGen. The output is generated,
   gitignored and never edited by hand. The website build runs it in `prebuild`.
3. **Queries.** Every GROQ query lives in `apps/website/queries`, one exported function per file.
   Components never build GROQ.
4. **Rendering.** Pages are server components. Only a few leaf components are client components
   (`bake-mode-toggle`, `disable-draft-mode`). The `Image` component is a server component that
   renders `next-sanity`'s image component. No Sanity client runs in the browser.

### Two kinds of queries

| Folder            | Fetches with                                    | Used for                                                       |
| ----------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `queries/live/`   | `sanityFetch` from `defineLive` (`next-sanity`) | Page content. Cache-tagged, live-updating, draft-aware         |
| `queries/static/` | `sanityClient.fetch`                            | Lists for `generateStaticParams`, at build time                |

The client (`shared/lib/sanity.ts`) uses the CDN, the `published` perspective, a pinned
`apiVersion`, and stega encoding pointed at the Studio URL so the Presentation tool can map rendered
text back to fields.

### Routes

| Route                       | Source                                                                     |
| --------------------------- | -------------------------------------------------------------------------- |
| `/`                         | `siteConfig` tagline and description, the content blocks of the `page` referenced by `siteConfig.homepage`, then the most used tags |
| `/recipe`                   | `recipesPage` singleton: featured recipe and secondary featured recipes    |
| `/recipe/[slug]`            | One `recipe`; prebuilt for every slug via `generateStaticParams`           |
| `/tags`                     | `tagsPage` intro and featured tags, then every distinct tag with its recipe count |
| `/tags/[slug]`              | Recipes with that tag; prebuilt for every tag; 404 when no recipe uses it  |
| `/studio`                   | Redirect to `NEXT_PUBLIC_SANITY_STUDIO_URL`                                |
| `/api/revalidate`           | Sanity webhook target (below)                                              |
| `/api/draft-mode/enable`    | Turns on draft mode for the Presentation tool                              |
| `/api/draft-mode/disable`   | Turns it off                                                               |
| `/.well-known/vercel/flags` | Flags discovery endpoint for the Vercel toolbar                            |

The root layout loads `siteConfig` for the page title template and `<html lang>`, renders a skip
link and the main navigation, wraps every page in the one `<main id="main-content">` landmark, and
mounts `<SanityLive />`. Pages don't render their own `<main>`. Each page has exactly one `<h1>`, its
title; the site name in the navigation is a paragraph.

---

## Caching and revalidation

Live queries tag their results. When a document is published, a Sanity webhook POSTs it to
`/api/revalidate`. The route checks the `sanity-webhook-signature` header against
`SANITY_REVALIDATE_SECRET`, maps the document to tags, and calls `revalidateTag` for each one:

| Published `_type` | Tags revalidated                                                                  |
| ----------------- | --------------------------------------------------------------------------------- |
| `recipe`          | `recipe`, `recipesPage`, `tagsPage`, `recipe:<id>`, `recipe:<slug>`, `tag:<tag>`  |
| `page`            | `page`, `page:<id>`                                                               |
| `recipesPage`     | `recipesPage`, `page:<id>`                                                        |
| `tagsPage`        | `tagsPage`, `page:<id>`                                                           |
| `siteConfig`      | `siteConfig`, `siteConfig:<id>`                                                   |
| `navItem`         | `navItem`                                                                         |
| `unit`            | `unit`                                                                            |

The webhook projection must include `_id`, `_type`, `slug` and `tags`. When you add a query, give it
tags that this map already revalidates, or extend the map in the same change.

`queries/static/` results carry no tags, so they only change on the next build.

---

## Draft mode and visual editing

The Studio's Presentation tool loads the website in an iframe and calls `/api/draft-mode/enable`,
which uses `SANITY_VIEWER_TOKEN` to read drafts. While draft mode is on, the layout renders
`<VisualEditing />` (click-to-edit overlays) and a button to leave draft mode, and the Vercel
toolbar is shown. The Studio allows `http://localhost:3000`, `https://ryan-bakes.com` and an optional
Vercel preview host (`SANITY_STUDIO_VERCEL_PREVIEW_URL`).

---

## Images

Sanity images are stored as `imageWithAlt` or `inlineImage`. Render them with the `Image` component
in `components/ui/image`. It wraps `Image` from `next-sanity/image`, which builds a `srcset` on the
Sanity image CDN (`cdn.sanity.io`) with `auto=format` (AVIF or WebP when the browser supports it) and
applies the crop and hotspot set in the Studio. Images never go through Vercel's image optimizer.

- Pass the display `width` and the `aspectRatio`; the CDN crops to that ratio around the hotspot.
- Pass `sizes` when the rendered width differs from `width`, and `preload` only on the image that is
  likely the page's largest contentful paint (the recipe hero and the featured recipe).
- Alt text comes from the image's `alt` field, or is empty when `emptyAlt` is set.

For a plain URL, such as an Open Graph image, use `urlForImage` or `socialImageUrl` from
`shared/lib/image.ts`. They use `@sanity/image-url`, so the parameters are the CDN's real ones (`w`,
`h`, `fit`, `fm`, `q`). Every caller checks that `asset` exists first.

---

## Environment

`shared/config/env.schema.ts` defines two Zod schemas: client (`NEXT_PUBLIC_*`) and server.
`env.client.ts` and `env.server.ts` parse `process.env` when imported, and `scripts/validate-env.ts`
runs both before `dev` and `build`. A missing or malformed value stops the process. The full list is
in the README.

---

## Styling

Global styles and design tokens are in `styles/global.css` and `styles/variables.css`. Components use
CSS Modules next to the component (`foo.module.css`). There is no CSS framework.

`variables.css` holds the colors (soft neutral surfaces, enamel blue as the brand colour, jade as
the accent), a spacing scale (`--space-1` to `--space-7`), a type scale (`--font-size-*`), the font
stacks, and the shared card look (`--surface`, `--border`, `--radius`, `--card-shadow`). Headings use
`--font-serif` (EB Garamond) and everything else `--font-sans` (Source Sans 3). Both are self-hosted by
`next/font/google` in `app/layout.tsx`, so pages make no font requests to Google.
`global.css` sets the heading sizes, section spacing and the page column (`--max-content-width`),
which the header, content and footer share. Recipe cards (`components/ui/card`) and featured recipes
lay out in a responsive grid; their title link covers the whole card. Data tables share
`components/ui/table/table.module.css`.

---

## Design principles

1. **Schema is truth.** Fix the schema, not the consumer.
2. **Generated types are authoritative.** Never hand-write or mirror a Sanity type.
3. **The UI is defensive.** Every optional field is guarded or has a fallback.
4. **Builds fail loudly.** Invalid env, schema drift or type errors stop the build.
5. **Generated code is never edited.**

### Common failure modes

- Reading `slug.current`, `asset` or a reference without checking it exists
- Passing `undefined` into Portable Text
- Adding a query whose cache tags the webhook never revalidates
- Changing the schema without running `pnpm typegen`, or without redeploying the Studio
