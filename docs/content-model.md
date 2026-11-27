# Content model

All content types are defined in `apps/cms/schemas` and registered in `apps/cms/schemas/index.ts`.
The schema is the source of truth: the website's types are generated from it (`pnpm typegen`), never
written by hand. This page is a map; the schema files are the detail.

Required fields are enforced by Studio validation only. Documents created before a rule existed, and
drafts, can still be missing them, so the generated types mark almost everything optional and the
website guards every field.

## Studio layout

`apps/cms/structure.ts` groups the desk into:

- **Recipes**: All recipes (A to Z), Recently updated, and Recipes by tag (one list per tag in use,
  read live from the dataset, handy for reusing existing tags)
- **Pages**: Recipes Page and Tags Page (singletons), and Other pages (`page`, including the homepage)
- **Settings**: Global Settings (`siteConfig` singleton), Navigation (`navItem`), Units of measure (`unit`)

Singletons are listed in `apps/cms/singletons.ts` and opened by fixed document IDs: `siteConfig`,
`tagsPage` and `recipesPage`. The website finds them through the `SITE_CONFIG_KEY`, `TAGS_PAGE_KEY` and
`RECIPES_PAGE_KEY` environment variables. `sanity.config.ts` hides them from "Create new" and removes
the duplicate and delete actions, so a second copy cannot be made by accident.

The recipe editor has four tabs: Recipe (title, slug, picture, commentary, times, servings, tags),
Ingredients, Steps, and Search and sharing.

The Studio also has Vision (GROQ playground), the Presentation tool (live preview of the website in
draft mode) and a Dashboard.

## Documents

| Type          | Purpose                                     | Key fields                                                                                                                                  |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipe`      | A recipe page at `/recipe/[slug]`           | `title`, `slug`, `picture`, `commentary`, `preheat` (°F), `bakeTime` and `totalTime` (minutes), `serves`, `ingredients[]`, `steps[]`, `tags[]`, `showBakerPercentage`; SEO group: `description`, optional `ogDescription` and `openGraphImage` (fall back to `description` and `picture`), `disallowRobots` |
| `unit`        | A unit of measure referenced by ingredients | `name`, `abbreviation`, `system` (Imperial/Metric), `type` (Volume/Weight), `display` (Fraction/Decimal), `noUnit`, `noCount`               |
| `siteConfig`  | Global settings (singleton)                 | `title`, `tagline` and `description` (homepage hero and default meta description), `url`, `lang`, `mainNav[]` (refs to `navItem`), `homepage` (ref to `page`) |
| `page`        | A general content page; the homepage is one | `title`, `slug`, `content[]` (`inlineImage`, `textSection`, `recipePreview`). On the homepage the blocks render below the `siteConfig` tagline |
| `recipesPage` | Content for `/recipe` (singleton)           | `title`, `intro`, `featuredRecipe` (ref), `secondaryFeatured[]` (2 to 6 recipe refs)                                                        |
| `tagsPage`    | Content for `/tags` (singleton)             | `title`, `intro`, `featuredTag`, `secondaryFeature[]` (2 to 6 tag strings). Featured tags must match a recipe tag exactly or they are skipped |
| `navItem`     | One entry in the main navigation            | `name`, `page` (ref to `page`, `tagsPage` or `recipesPage`)                                                                                 |

Recipe pages also describe the recipe to search engines as schema.org `Recipe` structured data, built
from these fields: `title`, `description`, `picture`, `totalTime` and `bakeTime` (prep time is the
difference), `serves`, `tags` (as keywords), `ingredients` (as the page shows them) and `steps` (title
and text). Empty fields are left out, so filling in times, servings and a picture is what makes a
recipe eligible for Google's recipe results. The author is "Ryan" (`defaultAuthorName` in
`apps/website/shared/config/site-defaults.ts`); there is no author field.

Tags are plain strings on each recipe, not documents. `/tags` and `/tags/[slug]` are built from the
distinct values across all recipes, so a tag exists only while a recipe uses it and matching is
exact (case and spelling).

`siteConfig.tagline` and `siteConfig.description` are optional. When empty, the website falls back to
the copy in `apps/website/shared/config/site-defaults.ts`.

### Editor checks

Shared validators live in `apps/cms/helpers/validation.ts`. Most are warnings, which never block
publishing, so older documents stay publishable:

- Portable Text that still contains "lorem ipsum" placeholder copy.
- A `tagsPage` featured or secondary tag that no recipe uses (checked live against the dataset).
- Ingredient `amount` that is not a number, fraction, range or word (for example `1,5` or `350g`).
- `serves` that is not a whole number or a low-high range.
- An ingredient not linked to any step, a bake time longer than the total time, an unusual preheat
  temperature, and descriptions longer than search engines or social sites show.
- A `unit` whose name another unit already uses.

One is an error: an ingredient's `usedInSteps` pointing at a step that does not exist, because the
website would silently drop that ingredient from the step.

## Objects

| Type                 | Used in                                   | Notes                                                                                                                         |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ingredient`         | `recipe.ingredients`                      | `name`, `amount` (a string such as `1 1/2` or `0.25`), `unit` (ref), `notes`, `usedInSteps[]` (1-based step numbers, picked with checkboxes), and a `bakers` group for baker's math |
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

### Ingredients and steps

`usedInSteps` stores step numbers (1 is the first step). The Studio shows it as a list of the recipe's
steps with checkboxes (`schemas/components/step-picker-input.tsx`), and flags any number past the last
step. Because the link is by position, reordering, adding or removing steps changes which ingredients
show with each step; check the ingredients after doing that.

### Baker's math

When `bakers.includeInBakersMath` is on, the ingredient carries a `grams` weight (filled in from
`amount` by `schemas/components/autofill-grams-input.tsx` when you click into an empty grams field and
the ingredient's unit is grams), and flags for `isFlour` and `countsTowardHydration` with a
`hydrationFactor`. Recipes with `showBakerPercentage` on render a baker's percentage table from these
values.

## Changing the schema

1. Edit or add the type under `apps/cms/schemas` and register it in `schemas/index.ts`.
2. Run `pnpm typegen` and fix every type error it causes in the website.
3. If the website caches the type, update the tag map in `apps/website/app/api/revalidate/route.ts`
   so published changes revalidate (see `ARCHITECTURE.md`).
4. Run `pnpm ci:verify` and `pnpm build`.
5. Merging to `main` deploys the Studio automatically (`docs/deployment.md`). Editors keep using
   the old schema until that deploy finishes.
