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

Create a Workers project connected to this repository and use:

- Build command: `npm run deploy`
- Root directory: `/`
- Node.js version: latest available LTS

No environment variables are required for the MVP. Data is stored in the browser with `localStorage`.

## Custom Domain

After the first deployment, attach your domain in Cloudflare:

Workers & Pages -> daily-missions -> Settings -> Domains & Routes.
