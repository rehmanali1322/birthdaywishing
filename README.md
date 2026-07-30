# Little Star — Premium 1st Birthday Experience

A direct, responsive birthday-wishing web experience made for a **1-year-old nephew**. It is intentionally not a dashboard or generic generator: the public root URL opens the birthday story itself.

The visual direction was rebuilt from the supplied reference videos: full-screen story chapters, cute centered cards, falling celebration stickers, tap interactions, photo memories, emotional copy, and simple premium pacing — translated from romantic/girlfriend styling into a warm baby-storybook celebration.

## Highlights

- 9 full-screen interactive chapters
- Mobile + desktop responsive design
- Continuous falling celebration stickers/confetti (no harsh blast effect)
- Original bundled instrumental birthday/lullaby audio
- Music mute/unmute control
- Interactive gift reveal
- Premium coded cake with a real candle interaction
- Custom cake + custom candle image override support
- Swipe/click memory gallery
- Tap-to-reveal appreciation cards
- Envelope/letter reveal
- Emotional first-birthday finale + replay
- Reduced-motion support
- Broken-image fallback
- No external CDN, font, image, music, framework, or runtime dependency
- `noindex` privacy default
- Dedicated `/studio/` for local text/media preview overrides
- Netlify-ready `netlify.toml`

## Tech

This version deliberately uses **plain HTML, modern CSS and JavaScript modules** instead of a heavy framework. For a one-person birthday wish this produces a smaller, faster and more reliable Netlify deployment.

There are **zero npm runtime dependencies**.

## Run on your PC

Requirements: Node.js 18.18+.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Owner Studio:

```text
http://localhost:3000/studio/
```

## Production build

```bash
npm run build
```

The deploy-ready website is generated in:

```text
dist/
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The repository also includes `tests/e2e.py`, used during final QA with Chromium/Playwright.

## Most important personalization file

```text
config/birthday-config.js
```

Change the sample name `Ayaan` to your nephew's real name before the final Netlify push. See `CUSTOMIZE.md`.

## Photos

Replace:

```text
assets/photos/hero.svg
assets/photos/photo-1.svg
assets/photos/photo-2.svg
assets/photos/photo-3.svg
assets/photos/photo-4.svg
assets/photos/final.svg
```

PNG, JPG and WebP files are fine too; update paths in `config/birthday-config.js` when extensions/names change.

## Music

A safe original instrumental is already bundled:

```text
assets/audio/birthday-lullaby.wav
```

To use your own licensed/personal song, put it in `assets/audio/` and change:

```js
media: {
  music: "assets/audio/your-song.mp3"
}
```

Audio starts only after the first user tap so mobile browser autoplay rules are respected.

## Netlify

The repository includes:

```text
netlify.toml
```

It sets:

```text
Build command: npm run build
Publish directory: dist
```

For an existing Netlify project, the committed `netlify.toml` overrides conflicting build/publish values configured in the Netlify UI.

See `DEPLOYMENT.md` and `NETLIFY_UPDATE_STEPS.md`.
