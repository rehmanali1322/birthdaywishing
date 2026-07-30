# Deploy to Netlify

This project is designed to deploy as a simple static site with a tiny Node build step.

## Build configuration

The included `netlify.toml` contains:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

You do not need Supabase, a database, API keys, or environment variables for this direct birthday wish.

## Before deployment

Run:

```bash
npm install
npm run check
npm run build
```

Then personalize `config/birthday-config.js` and replace the photo/music files you want.

## GitHub-connected Netlify deployment

Commit and push:

```bash
git add .
git commit -m "Premium first birthday redesign"
git push
```

Netlify will see the GitHub push and build automatically.

## Existing Netlify UI still says `.next`?

That is okay once this repository contains `netlify.toml`.

The file explicitly sets `publish = "dist"`; Netlify's file-based configuration takes precedence over conflicting build/publish settings in the UI.

If you prefer to make the UI match too, set:

```text
Build command: npm run build
Publish directory: dist
Base directory: blank
```

## Existing environment variables

Old variables such as:

```text
NEXT_PUBLIC_APP_MODE
NEXT_PUBLIC_SITE_URL
```

are not used by this version. They may be removed from Netlify, but leaving them there does not affect this static site.

## Domain

Your existing Netlify domain can stay exactly the same. No new Netlify account/site is required if you replace the code in the same GitHub repository connected to that site.
