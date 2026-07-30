# Test Report

## Final QA status

The project was actually tested in the build environment before packaging.

### Commands run successfully

```text
npm install --package-lock-only --ignore-scripts
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run check
npm run test:e2e
```

### Dependency status

- npm runtime dependencies: **0**
- npm audit at install step: **0 vulnerabilities**

### Unit/integration tests

7 tests passed:

- First-birthday config age/label
- Data-driven recipient replacement
- Memory configuration replacement
- All nine story scenes present
- JavaScript ID selectors match actual DOM IDs
- Story actions have handlers
- Required static image/audio references exist

### Real browser E2E

Chromium browser automation passed on:

- 320 × 568 small phone
- 360 × 800 Android-style phone
- 390 × 844 iPhone-style phone
- 430 × 932 large phone
- 1440 × 900 desktop

The browser journey tested:

- Opening/loader
- No horizontal overflow
- First-screen CTA visibility on mobile
- Music mute/unmute
- Story chapter progression
- Gift interaction/reveal
- Cake/candle interaction
- Memory navigation
- Appreciation-card reveal
- Letter/envelope interaction
- Finale
- Replay reset
- Studio text persistence
- Studio image upload persistence using IndexedDB
- Broken image fallback
- Long recipient name on 320px width
- `prefers-reduced-motion`
- Console error collection during tested flows

### Visual QA fixes made

1. **320 × 568 CTA clipping** — opening scene was retuned for short phones so the CTA fits in the first viewport.
2. **Reason-card mobile GPU flip issue** — replaced unreliable 3D back-face flipping with a robust premium reveal transition.
3. **Custom cake stacking** — coded candle remains interactive/visible when a custom cake image is used.
4. **Finale transition capture** — confirmed previous letter scene clears cleanly after transition.
5. **Music autoplay behavior** — audio begins only from user gesture and remains safely controllable.

### Known limitations

- `/studio/` uploads are browser-local preview overrides. A static website cannot write uploaded files back into your GitHub repository. Permanent media for the public Netlify link must be placed in the project's `assets/` folders and pushed to GitHub.
- Browser E2E requires Chromium plus Python Playwright if you run `tests/e2e.py` yourself. Normal website use/build has no such requirement.
- The sample recipient name/photos are placeholders because the real nephew name/photos were not provided with the request. Replace them before the final family-facing deploy.
