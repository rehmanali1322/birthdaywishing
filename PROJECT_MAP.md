# Project Map

```text
birthdaywishing-premium/
├── index.html                    Public birthday experience
├── styles.css                    Complete responsive visual system
├── app.js                        Story/scene/audio/interaction manager
├── netlify.toml                  Netlify build + headers
├── package.json                  Zero-dependency build/test commands
│
├── config/
│   ├── birthday-config.js        MAIN personalization file
│   └── runtime.js                Browser-local Studio overrides
│
├── assets/
│   ├── audio/                    Background music
│   ├── illustrations/            Teddy + gift artwork
│   ├── photos/                   Replaceable photo placeholders
│   ├── uploads/                  Put optional cake/candle/media here
│   └── media-db.js               Studio IndexedDB media storage
│
├── studio/
│   ├── index.html                Owner customization/preview screen
│   └── studio.js                 Local Studio upload logic
│
├── scripts/
│   ├── build.mjs                 Creates dist/
│   ├── dev.mjs                   Local zero-dependency web server
│   ├── lint.mjs                  Syntax/static source checks
│   └── typecheck.mjs             Config/data/media contract checks
│
├── tests/
│   ├── config.test.mjs           Data-driven config tests
│   ├── integration.test.mjs      Scene/action/asset integration tests
│   └── e2e.py                    Real Chromium browser QA
│
└── docs / guides
```

## Public story chapters

1. Surprise entrance
2. Storybook opening + hero photo
3. One-year stats
4. Interactive gift
5. Interactive birthday cake/candle
6. Swipe memory gallery
7. Tap-to-reveal appreciation cards
8. Mamu letter/envelope
9. First-birthday finale + replay
