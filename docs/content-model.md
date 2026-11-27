# Content model

All content types are defined in `apps/cms/schemas` and registered in `apps/cms/schemas/index.ts`.
The schema is the source of truth: the website's types are generated from it (`pnpm typegen`), never
written by hand. This page is a map; the schema files are the detail.

Required fields are enforced by Studio validation only. Documents created before a rule existed, and
drafts, can still be missing them, so the generated types mark almost everything optional and the
website guards every field.

## Studio layout

`apps/cms/structure.ts` groups the desk into:

- **Settings**: Global Settings (`siteConfig` singleton), Measurements (`unit`), Nav Items (`navItem`)
- **Recipes**: every `recipe`
- **Pages**: Tags Page (`tagsPage` singleton), Recipes Page (`recipesPage` singleton), Pages (`page`)

Singletons are opened by fixed document IDs: `siteConfig`, `tagsPage` and `recipesPage`. The website
finds them through the `SITE_CONFIG_KEY`, `TAGS_PAGE_KEY` and `RECIPES_PAGE_KEY` environment variables.

The Studio also has Vision (GROQ playground), the Presentation tool (live preview of the website in
draft mode) and a Dashboard.

## Documents

| Type          | Purpose                                     | Key fields                                                                                                                                  |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipe`      | A recipe page at `/recipe/[slug]`           | `title`, `slug`, `picture`, `commentary`, `preheat` (°F), `bakeTime` and `totalTime` (minutes), `serves`, `ingredients[]`, `steps[]`, `tags[]`, `showBakerPercentage`; SEO group: `description`, `ogDescription`, `openGraphImage`, `disallowRobots` |
| `unit`        | A unit of measure referenced by ingredients | `name`, `abbreviation`, `system` (Imperial/Metric), `type` (Volume/Weight), `display` (Fraction/Decimal), `noUnit`, `noCount`               |
| `siteConfig`  | Global settings (singleton)                 | `title`, `url`, `lang`, `mainNav[]` (refs to `navItem`), `homepage` (ref to `page`)                                                         |
| `page`        | A general content page; the homepage is one | `title`, `slug`, `content[]` (`inlineImage`, `textSection`, `recipePreview`)                                                               |
| `recipesPage` | Content for `/recipe` (singleton)           | `title`, `intro`, `featuredRecipe` (ref), `secondaryFeatured[]` (2 to 6 recipe refs)                                                        |
| `tagsPage`    | Content for `/tags` (singleton)             | `title`, `intro`, `featuredTag`, `secondaryFeature[]` (2 to 6 tag strings)                                                                  |
| `navItem`     | One entry in the main navigation            | `name`, `page` (ref to `page`, `tagsPage` or `recipesPage`)                                                                                 |

Tags are plain strings on each recipe, not documents. `/tags` and `/tags/[slug]` are built from the
distinct values across all recipes.

## Objects

| Type                 | Used in                                   | Notes                                                                                                                         |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ingredient`         | `recipe.ingredients`                      | `name`, `amount` (a string such as `1 1/2` or `0.25`), `unit` (ref), `notes`, `usedInSteps[]`, and a `bakers` group for baker's math |
| `step`               | `recipe.steps`                            | `title` and `content[]` of `textSection` and `inlineImage`                                                                    |
| `portableText`       | Commentary, intros, text sections         | Styles: normal, H2, H3, H4, quote. Marks: strong, em, `fraction`. Annotations: `externalLink`, `internalLink`                 |
| `simplePortableText` | Short rich text                           | No block styles. Marks: strong, em, code, `fraction`. Same annotations                                                        |
| `textSection`        | `page.content`, `step.content`            | Wraps one `portableText` field                                                                                                |
| `inlineImage`        | `page.content`, `step.content`            | Image with `alt`/`emptyAlt`, `size` (Small/Medium/Full), `position` (Left/Right/Block), optional `aspectRatio`                |
| `imageWithAlt`       | `recipe.picture`, `recipe.openGraphImage` | Image with `alt`, or `emptyAlt` for decorative images                                                                         |
| `recipePreview`      | `page.content`                            | A card linking to a `recipe`; `large` switches to the featured layout                                                         |
| `externalLink`       | Portable Text annotation                  | `href`                                                                                                                        |
| `internalLink`       | Portable Text annotation                  | `reference` to a `page`, `recipe`, `tagsPage` or `recipesPage`, plus an optional `anchor`                                     |

### Ingredient amounts and units

`amount` is free text. The website shows it as a fraction when the referenced unit's `display` is
`Fraction`: `1/2` and `1 1/2` render as fractions, and decimals such as `0.25` are converted to the
nearest half, third, quarter, eighth or sixteenth (`apps/website/components/ui/fraction`). Units set
to `Decimal` show the amount as written.

### Baker's math

When `bakers.includeInBakersMath` is on, the ingredient carries a `grams` weight (pre-filled from
`amount` by `schemas/components/autofill-grams-input.tsx`), and flags for `isFlour` and
`countsTowardHydration` with a `hydrationFactor`. Recipes with `showBakerPercentage` on render a
baker's percentage table from these values.

## Changing the schema

1. Edit or add the type under `apps/cms/schemas` and register it in `schemas/index.ts`.
2. Run `pnpm typegen` and fix every type error it causes in the website.
3. If the website caches the type, update the tag map in `apps/website/app/api/revalidate/route.ts`
   so published changes revalidate (see `ARCHITECTURE.md`).
4. Run `pnpm ci:verify` and `pnpm build`.
5. Deploy the Studio after merging (`docs/deployment.md`). Editors keep using the old schema until
   the Studio is redeployed.
