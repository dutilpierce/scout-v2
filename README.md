# Scout v2 (Plasmo + React + TypeScript + Tailwind v4 in Shadow DOM)

This project ships a Google Search sidebar that recommends two AI tools:
- One **Free/Freemium** option
- One **Trial/Sponsored** option

It is structured as:
- **Dumb UI**: `src/content.tsx` (lightweight React, minimal logic)
- **Background Brain**: `src/background.ts` (all matching / processing)

## Key Tailwind v4 + Shadow DOM Fix
Plasmo injects UI into a Shadow DOM. Tailwind v4 emits CSS variables on `:root`, which the Shadow DOM cannot see.

Fixes implemented:
1. `getStyle` replacement hack: `cssText.replaceAll(':root', ':host')`
2. Manual hoisting of essential variables in `src/style.css` under `@layer theme { :host { ... } }`

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run package
```

The packaged extension will be in `build/chrome-mv3-prod/`.

## Test in Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `build/chrome-mv3-dev/` (for dev) OR `build/chrome-mv3-prod/` (for packaged)

## Customize tools
Edit `src/data/tools.ts`.
