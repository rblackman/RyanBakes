# Ryan Bakes

## Monorepo layout

This repository is now organized as a pnpm workspace:

- `apps/website` — the existing Next.js app.
- `apps/*` — future applications (for example, a Sanity studio).
- `packages/*` — place shared libraries or config packages here as the monorepo grows.

## Common commands

Run workspace tasks from the repo root:

- `pnpm dev` — start the website locally.
- `pnpm lint` — lint all workspace packages.
- `pnpm typecheck` — type-check all workspace packages.
- `pnpm build` — build all workspace packages.
