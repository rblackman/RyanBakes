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

| Workflow                     | Runs on                              | What it does                                                         |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `ci.yml`                     | PRs, pushes to `main`, manual        | Verify (`pnpm ci:verify`), then Build (`pnpm build`); skips Markdown-only changes; Build skipped for fork PRs |
| `codeql.yml`                 | PRs, pushes to `main`, weekly, manual | CodeQL for JavaScript and TypeScript                                |
| `dependabot-autoapprove.yml` | Dependabot PRs                       | Approves the PR and turns on squash auto-merge                       |
| `deploy-cms.yml`             | Manual, `main` only                  | Builds and deploys the Studio                                        |

The local composite action `.github/actions/write-website-env` writes `apps/website/.env` from
repository variables and secrets so CI can typecheck and build.

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

Dependabot (`.github/dependabot.yml`) opens grouped production and development npm updates every
Monday at 8:00 America/Chicago. Major versions of `next`, `react`, `react-dom` and `sanity` are
ignored and upgraded by hand.

## Rolling back

- Website: promote an earlier production deployment in the Vercel dashboard, or revert the commit on
  `main`.
- Content: use the document's history in the Studio to restore an earlier revision, then publish.
