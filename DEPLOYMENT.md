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
- Build command: leave blank
- Deploy command: `npm run deploy`
- Root directory: `/`
- Node.js version: latest available LTS

Alternative:

- Project name: `daily-missions`
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node.js version: latest available LTS

Do not use `npm run build` as the only build command for Cloudflare. It creates the regular Next.js `.next` output, but Cloudflare deployment needs the OpenNext `.open-next` Worker bundle.

No environment variables are required for the MVP. Data is stored in the browser with `localStorage`.

## Custom Domain

After the first deployment, attach your domain in Cloudflare:

Workers & Pages -> daily-missions -> Settings -> Domains & Routes.
