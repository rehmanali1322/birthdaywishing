# Update Your Existing Netlify Birthday Site

This guide is specifically for the setup already completed earlier:

```text
GitHub repository: birthdaywishing
Netlify URL: https://birthdaywishesmaker.netlify.app
```

## Safest update method

1. Keep a backup of your current project folder.
2. Extract the new ZIP into a separate folder.
3. In your existing GitHub-connected `birthdaywishing` local folder, **do not delete the hidden `.git` folder**.
4. Replace the old project source files with the contents of this new project.
5. Personalize `config/birthday-config.js` and your photos/music.
6. Open terminal inside that Git repository.
7. Run:

```bash
npm install
npm run check
npm run build
```

8. Push:

```bash
git add .
git commit -m "Premium 1st birthday redesign"
git push
```

9. Open Netlify → your `birthdaywishesmaker` project → Deploys.
10. Wait for the new deploy to show **Published**.
11. Open:

```text
https://birthdaywishesmaker.netlify.app
```

The included `netlify.toml` changes the old `.next` publish setup to this project's `dist` output automatically.
