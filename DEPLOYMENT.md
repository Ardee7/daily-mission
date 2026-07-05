# Cloudflare Pages Deployment

This MVP is configured as a static Next.js export for Cloudflare Pages.

The app does not need a Worker because it has no backend, no auth, no database, and stores MVP data in the browser with `localStorage`.

## Cloudflare Settings

Create a **Pages** project, not a Worker project.

- Framework preset: `Next.js` or `None`
- Build command: `npm run pages:build`
- Build output directory: `out`
- Root directory: `/`
- Node.js version: latest available LTS

Leave the deploy command blank if Cloudflare shows one. Static Pages deployments only need the build command and output directory.

The `pages:build` script uses `next build --webpack` and verifies that `out/index.html` exists before Cloudflare tries to upload assets.

## Local Check

```bash
npm run pages:build
```

This writes the static site to `out/`.

## If Cloudflare Says `Output directory "out" not found`

The build ran, but the static export folder was not created.

Check these:

- Push the latest `next.config.ts`. It must include `output: "export"`.
- Push the latest `package.json`. It must include `pages:build`.
- In Cloudflare, set build command to `npm run pages:build`.
- Set build output directory to `out`.
- Clear build cache and redeploy.

Using `npm run pages:build` makes this easier to diagnose because the build fails immediately if `out/index.html` is missing.

## If Cloudflare Still Mentions OpenNext

Cloudflare is using an old project type or stale settings.

Fix it by doing one of these:

- Create a fresh **Cloudflare Pages** project for this repo.
- Make sure the project is not a Worker.
- Clear build cache and redeploy.
- Confirm `wrangler.jsonc` and `open-next.config.ts` are not present in the pushed branch.

## Custom Domain

After the first successful Pages deployment:

Workers & Pages -> your Pages project -> Custom domains.
