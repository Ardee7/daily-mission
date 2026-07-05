# Cloudflare Deployment

This app is configured for Cloudflare Workers using the OpenNext adapter.

## Local Checks

```bash
npm run build
npm run preview
```

Use `npm run preview` when you want a Cloudflare-like runtime locally. It builds the app with OpenNext and serves it through Wrangler.

## Deploy From Local Machine

```bash
npx wrangler login
npm run deploy
```

The deployed Worker name is configured in `wrangler.jsonc` as `daily-missions`.

## Deploy From Cloudflare/Git

Create a Workers project connected to this repository and use one of these setups.

Recommended:

- Project name: `daily-missions`
- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`
- Root directory: `/`
- Node.js version: latest available LTS

Local machine:

```bash
npx wrangler login
npm run deploy
```

Do not use `npm run build` as the only build command for Cloudflare. It creates the regular Next.js `.next` output, but Cloudflare deployment needs the OpenNext `.open-next` Worker bundle.

Do not use `npx wrangler deploy` as the Cloudflare dashboard deploy command for this project. Wrangler detects OpenNext and calls the OpenNext deploy step, but it can fail if the OpenNext build step did not run first in the same build workspace.

No environment variables are required for the MVP. Data is stored in the browser with `localStorage`.

## Custom Domain

After the first deployment, attach your domain in Cloudflare:

Workers & Pages -> daily-missions -> Settings -> Domains & Routes.

## Troubleshooting

### `npm error Missing script: "deploy"`

Cloudflare is building a copy of the repo where `package.json` does not contain the `deploy` script.

Check these:

- Push the latest `package.json`, `package-lock.json`, `wrangler.jsonc`, and `open-next.config.ts` to the branch connected in Cloudflare.
- Confirm Cloudflare is connected to the same branch you pushed.
- If this is inside a monorepo or subfolder, set the Cloudflare root directory to the folder that contains this `package.json`.
- Retry the deployment after pushing. If it still uses the old script list, clear build cache and deploy again.

The audit warnings in the build log are not what caused this failure; the missing `deploy` script did.

### `Could not find compiled Open Next config, did you run the build command?`

Cloudflare ran the deploy step before the OpenNext build artifact existed.

Use these dashboard settings:

- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`

Do not set the build command to `npm run build`, and do not set the deploy command to `npx wrangler deploy` for this OpenNext setup.
