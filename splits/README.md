# Splits

Splits is a front-end-only React MVP for splitting expenses around a single shared activity like a dinner, trip, or event. It helps a group answer four questions quickly:

- who paid how much
- who should bear how much
- who should transfer money to whom
- what exact expense inputs produced that result

The app uses browser `localStorage` for auto-save and can generate shareable snapshot links by encoding the current activity into the URL.

Release history is tracked in [`CHANGELOG.md`](./CHANGELOG.md).
H5 layout spacing rules are tracked in [`H5_SPACING_GUIDELINES.md`](./H5_SPACING_GUIDELINES.md).

## Stack

- React
- Vite
- TypeScript
- Minimal plain CSS
- `lz-string` for compact shareable snapshot URLs
- `@vercel/analytics` for visitor metrics
- `@vercel/speed-insights` for performance metrics

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Deploy to Vercel

The current production deployment uses Vercel with the custom domain below:

```text
https://splits.greta-x.com/
```

For this repository, the deploy target is the `splits/` subdirectory inside the repo root.

### Vercel setup

1. Import the GitHub repository into Vercel.
2. Set `Root Directory` to `splits`.
3. Use the `Vite` framework preset.
4. Confirm the build settings:

```text
Build Command: npm run build
Output Directory: dist
```

5. Deploy.

### Domain setup

- Primary product URL: `https://splits.greta-x.com/`
- Apex domain `https://greta-x.com/` is configured to redirect to `https://splits.greta-x.com/`

### Analytics and performance

The project already includes:

- Vercel Analytics
- Vercel Speed Insights

After each deploy, visit the live site and then check the Vercel dashboard:

- `Analytics` for traffic and page views
- `Speed Insights` for performance data

## Terminal release flow

Typical release flow from the repo root:

```bash
cd /Users/greta/Documents/Playground
git add .
git commit -m "Describe the change"
git push origin main
```

If `node` or `npm` is missing in a fresh terminal session, run:

```bash
source ~/.zprofile
```

## Project structure

```text
splits/
  index.html
  package.json
  tsconfig.json
  tsconfig.app.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
    styles.css
    types.ts
    utils.ts
```

## What the MVP includes

- Create a single activity with a name
- Add, rename, and remove participants
- Add, edit, and delete expenses
- Equal split per expense across selected participants
- Clear expense review list showing payer, included participants, and per-person share
- Per-person totals for paid, owed, and net balance
- Settlement suggestions showing who should pay whom
- Auto-save in `localStorage`
- Shareable snapshot links that reconstruct the activity in the browser
- English / Chinese language switch with local preference persistence
- Vercel Analytics and Vercel Speed Insights

## Notes

- This is intentionally front-end only: no backend, auth, database, or real-time sync.
- Share links are static snapshots of the current activity state, not collaborative live documents.
- The app currently formats currency as USD to keep the MVP simple.
