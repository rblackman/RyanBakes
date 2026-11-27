# RyanBakes

Source for [ryan-bakes.com](https://ryan-bakes.com/), a personal recipe site. Recipes are written in a
Sanity Studio and rendered by a Next.js site hosted on Vercel.

This is a pnpm monorepo with two apps and one generated package:

| Path                    | What it is                                                        |
| ----------------------- | ----------------------------------------------------------------- |
| `apps/website`          | Next.js (App Router) site that renders the recipes                |
| `apps/cms`              | Sanity Studio where content is authored                           |
| `packages/sanity-types` | TypeScript types generated from the Studio schema (not committed) |

More detail lives in:

- [`ARCHITECTURE.md`](./ARCHITECTURE.md): how content flows from Sanity to the page, caching and revalidation
- [`docs/content-model.md`](./docs/content-model.md): every Sanity document and object type
- [`docs/deployment.md`](./docs/deployment.md): Vercel, Studio deploys, the webhook, CI and secrets
- [`AGENTS.md`](./AGENTS.md): rules, conventions and commands for anyone (human or AI) changing the code

---

## Quick start

### Prerequisites

- Node.js 22 (the `engines` field and the Vercel project both pin 22.x)
- pnpm through Corepack: `corepack enable` (the root `packageManager` field pins the version)
- Access to the Sanity project if you want to run the Studio or read draft content

A dev container (`.devcontainer/devcontainer.json`) is included with Node 22, pnpm and the GitHub CLI.

### Install

```bash
corepack enable
pnpm install
```

`pnpm install` also installs the Husky git hooks (see [Commits and hooks](#commits-and-hooks)).

### Configure the website

```bash
cp apps/website/.env.example apps/website/.env
```

Fill in the values. Every variable is required: the dev server and the build both stop until
`apps/website/.env` passes validation. See [Environment variables](#environment-variables).

The Studio needs no `.env` for local work. It reads two optional variables:

- `SANITY_STUDIO_DATASET`: dataset to edit (defaults to `production`)
- `SANITY_STUDIO_VERCEL_PREVIEW_URL`: a Vercel preview host to allow in the Presentation tool

### Generate types

```bash
pnpm typegen
```

This extracts the Studio schema to `apps/cms/schema.json` and writes
`packages/sanity-types/sanity.types.ts`. Both files are generated and gitignored. Run it after
cloning and after any schema change. The website's `prebuild` runs it for you; `pnpm dev:website`
does not, so the editor shows missing-type errors until you run it once.

### Run

```bash
pnpm dev:website   # http://localhost:3000
pnpm dev:cms       # http://localhost:3333
pnpm dev:all       # both, in parallel
```

---

## Commands

All commands run from the repo root.

| Command                  | What it does                                                                     |
| ------------------------ | -------------------------------------------------------------------------------- |
| `pnpm dev:website`       | Next.js dev server (validates env first)                                         |
| `pnpm dev:cms`           | Sanity Studio dev server                                                         |
| `pnpm dev:all`           | Both dev servers in parallel                                                     |
| `pnpm typegen`           | Schema extract, then Sanity TypeGen                                              |
| `pnpm ci:verify`         | Exactly what CI's Verify job runs: typegen, `biome check .`, `tsc` for both apps |
| `pnpm typecheck`         | `tsc --noEmit` for the website and the Studio                                    |
| `pnpm typecheck:website` | `tsc --noEmit` for the website only                                              |
| `pnpm typecheck:cms`     | `tsc --noEmit` for the Studio only                                               |
| `pnpm lint`              | `biome check --write` over `apps/website` (fixes what it can)                    |
| `pnpm format`            | `biome format --write` over `apps/website`                                       |
| `pnpm validate:env`      | Validate `apps/website/.env` against the Zod schema                              |
| `pnpm build`             | Build the Studio and the website                                                 |
| `pnpm build:website`     | Website build (runs typegen and env validation first)                            |
| `pnpm build:cms`         | Studio build                                                                     |
| `pnpm start`             | Serve the last website build                                                     |
| `pnpm deploy:cms`        | Deploy the Studio to Sanity hosting (needs Sanity auth)                          |

`pnpm lint` and `pnpm format` only cover the website because the Studio has no such scripts. For
the whole repo, run `pnpm -w exec biome check .` (what CI runs) or add `--write` to fix.

Before opening a pull request, run `pnpm ci:verify`. Also run `pnpm build` if you changed the
schema, a query or routing.

---

## Environment variables

The website validates its environment with Zod (`apps/website/shared/config/env.schema.ts`) when
the dev server starts, before a build, and when the server modules load. `apps/website/.env.example`
lists every name.

| Name                            | Used by          | Notes                                                       |
| ------------------------------- | ---------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`          | Browser + server | Canonical origin for URLs and metadata                      |
| `NEXT_PUBLIC_SANITY_KEY`        | Browser + server | Sanity project ID (8 characters)                            |
| `NEXT_PUBLIC_SANITY_DATASET`    | Browser + server | Sanity dataset                                              |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Browser + server | Hosted Studio URL; target of the `/studio` redirect         |
| `SITE_CONFIG_KEY`               | Server           | Document ID of the `siteConfig` singleton                   |
| `RECIPES_PAGE_KEY`              | Server           | Document ID of the `recipesPage` singleton                  |
| `TAGS_PAGE_KEY`                 | Server           | Document ID of the `tagsPage` singleton                     |
| `SANITY_REVALIDATE_SECRET`      | Server           | Secret. Must match the Sanity webhook's signing secret      |
| `SANITY_VIEWER_TOKEN`           | Server           | Secret. Sanity Viewer token for draft mode and live preview |

Anything that starts with `NEXT_PUBLIC_` ends up in the browser bundle, so never put a secret in one.

---

## Commits and hooks

- Commit messages follow Conventional Commits and are checked by commitlint
  (`commitlint.config.mjs`). Allowed types: `build`, `add`, `feature`, `bug`, `chore`, `docs`,
  `refactor`, `revert`, `test`, `style`, `perf`, `package`. Header at most 100 characters,
  lower-case subject, no trailing period, body lines at most 100 characters.
- The pre-commit hook runs lint-staged (`.lintstagedrc.mjs`): Biome on staged files, and `tsc` for
  whichever app has staged TypeScript.

---

## CI and deployment

- **CI** (`.github/workflows/ci.yml`) runs on every pull request and push to `main`: a Verify job
  (the `pnpm ci:verify` checks), then a Build job (`pnpm build`) that is skipped for PRs from forks,
  plus dependency review and workflow linting. PR titles are checked with commitlint.
- **Lighthouse** (`.github/workflows/lighthouse.yml`) builds the site on every pull request and
  audits the home page, `/tags` and a recipe on mobile and desktop. Scores and failed audits are in
  the job summary, and the full reports are in the run's `lighthouse-reports` artifact. Not a
  required check yet.
- **CodeQL** scans JavaScript, TypeScript and the workflows on PRs, on pushes to `main` and weekly.
- **Dependabot** opens weekly grouped npm and GitHub Actions updates; a workflow turns on auto-merge
  for patch and minor updates, and majors wait for review. See [docs/deployment.md](docs/deployment.md#github-actions).
- **Website**: Vercel's GitHub integration builds every branch. `main` goes to production at
  ryan-bakes.com; other branches get preview URLs.
- **Studio**: deployed by hand, from the "Deploy CMS" workflow (main only) or `pnpm deploy:cms`.
- **Content changes** reach the live site through a Sanity webhook to `/api/revalidate`.

Details are in [`docs/deployment.md`](./docs/deployment.md).

---

## License

See [`LICENSE`](./LICENSE).
