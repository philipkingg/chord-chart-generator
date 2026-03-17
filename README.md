# Chord Chart Generator

An interactive guitar chord diagram creator. Click the fretboard to place finger positions and the chord name is detected automatically.

Built with Vite + React + TypeScript. Hosted on GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/chord-chart-generator/`

## Deploy to GitHub Pages

First-time setup — authenticate git with a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope
3. Set your remote URL with the token:
   ```bash
   git remote set-url origin https://philipkingg:<YOUR_TOKEN>@github.com/philipkingg/chord-chart-generator.git
   ```

Then deploy:

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch.

Finally, in the GitHub repo go to **Settings → Pages** and set the source branch to `gh-pages`.

The site will be live at `https://philipkingg.github.io/chord-chart-generator/`
