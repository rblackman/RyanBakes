# Deployment and operations

How each part of RyanBakes is built, deployed and kept in sync. This page names settings and
secrets; it never contains their values.

## Website (Vercel)

- The Vercel project `ryan-bakes` is connected to this repository through Vercel's GitHub
  integration. There is no deploy workflow in `.github/`.
- Pushes to `main` build and deploy to production: `ryan-bakes.com` and `www.ryan-bakes.com`.
- Every other branch and pull request gets a preview deployment, and Vercel comments the URL on the
  PR. Previews are behind Vercel Authentication; the custom domains are public.
- The project runs Node 22.x. The build runs the website's `prebuild` (Studio schema extract,
  TypeGen and env validation) before `next build`.
- Environment variables are set in the Vercel project settings for Production and Preview. They
  must cover every name in `apps/website/.env.example`, or the build fails at env validation.

## Content updates (Sanity webhook)

Publishing in the Studio does not trigger a rebuild. A Sanity webhook (configured in the Sanity project's
API settings) POSTs the published document to `https://ryan-bakes.com/api/revalidate`, and the route revalidates
the matching cache tags (see `ARCHITECTURE.md`).

- The webhook's secret must equal `SANITY_REVALIDATE_SECRET` in Vercel. A mismatch returns 401 and
  the site keeps serving cached content.
- Its projection must include `_id`, `_type`, `slug` and `tags`.
- The route logs every request with a `[revalidate]` prefix, so Vercel runtime logs show whether a
  webhook arrived and which tags it cleared.

Pages that only change at build time (the lists of recipe slugs and tags) update on the next
deployment.

## Sanity Studio

- The Studio is deployed to Sanity hosting with `sanity deploy`. Its URL is the value of
  `NEXT_PUBLIC_SANITY_STUDIO_URL`, and `/studio` on the website redirects there.
- Deploy from the **Deploy CMS** workflow (`.github/workflows/deploy-cms.yml`): run it by hand on
  `main`. It uses the `production` GitHub environment, runs typegen and the Studio build, then
  deploys with the `SANITY_AUTH_TOKEN` secret.
- Or deploy from a machine that is signed in to Sanity: `pnpm deploy:cms`.
- Deploy the Studio after merging any schema change. Until then, editors use the old schema.

## GitHub Actions

| Workflow                     | Runs on                               | What it does |
| ---------------------------- | ------------------------------------- | ------------ |
| `ci.yml`                     | Every PR, pushes to `main`, manual    | **Verify** (typegen, `biome ci`, `tsc` for both apps; same checks as `pnpm ci:verify`, no secrets needed), then **Build** (`pnpm build`, skipped for fork PRs). Also **Dependency review** (PRs; fails on new high or critical vulnerabilities) and **Lint workflows** (actionlint). |
| `pr-title.yml`               | PRs (opened, edited, updated)         | Runs commitlint on the PR title (`.github/commitlint-pr-title.config.mjs`: repo rules, no default ignores), because squash merges use it as the commit message. Skips bot PRs. |
| `codeql.yml`                 | PRs, pushes to `main`, weekly, manual | CodeQL (`security-extended`) for JavaScript/TypeScript and for the workflows themselves |
| `dependabot-autoapprove.yml` | Dependabot PRs                        | Turns on squash auto-merge for single-commit patch and minor updates; the rest wait for a person |
| `deploy-cms.yml`             | Manual, `main` only                   | Builds and deploys the Studio |

`ci.yml` has no path filter on purpose: the `main` ruleset requires the **Verify (typegen, biome,
tsc)** and **Build (non-fork PRs + main)** checks, and a skipped workflow would leave them pending.
Rename those jobs only together with the ruleset.

Local composite actions:

- `.github/actions/setup` enables Corepack, sets up Node with the pnpm store cache and runs
  `pnpm install --frozen-lockfile`.
- `.github/actions/write-website-env` writes `apps/website/.env` from repository variables and
  secrets for the Build job and the Studio deploy. Dependabot PRs read **Dependabot** secrets, so
  `SANITY_REVALIDATE_SECRET` and `SANITY_VIEWER_TOKEN` must be set there too for their Build job.

### Repository variables and secrets

Variables (non-secret identifiers): `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SANITY_KEY`,
`NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SITE_CONFIG_KEY`,
`RECIPES_PAGE_KEY`, `TAGS_PAGE_KEY`.

Secrets: `SANITY_REVALIDATE_SECRET`, `SANITY_VIEWER_TOKEN`, `SANITY_AUTH_TOKEN` (Studio deploys only).

When you add an environment variable, add it in all of these places in one change:

1. `apps/website/shared/config/env.schema.ts` (and `env.client.ts` if it is `NEXT_PUBLIC_`)
2. `apps/website/.env.example` and the table in `README.md`
3. The Vercel project settings
4. A GitHub variable or secret, and the `write-website-env` action and the workflows that call it

## Dependencies

Dependabot (`.github/dependabot.yml`) opens grouped production and development npm updates, and one
grouped GitHub Actions update, every Monday at 8:00 America/Chicago. It waits 3 days after a release
(7 for majors) before proposing it, and titles PRs `build(deps): ...`. Major versions of `next`,
`react`, `react-dom` and `sanity` are ignored and upgraded by hand. The actionlint image in `ci.yml`
is pinned by digest and bumped by hand.

The auto-merge workflow turns on squash auto-merge only when the PR has a single commit and every
updated dependency is a patch or minor bump. Anything else (a major, an unknown update type, extra
commits pushed on top) is left for a person, and the workflow turns auto-merge back off if an
earlier run had turned it on. That also clears auto-merge you turned on by hand for such a PR
whenever Dependabot rebases it.

## Rolling back

- Website: promote an earlier production deployment in the Vercel dashboard, or revert the commit on
  `main`.
- Content: use the document's history in the Studio to restore an earlier revision, then publish.
