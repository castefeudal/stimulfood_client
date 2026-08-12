# STIMUL FOOD — client premium site

Production-oriented static-first client experience for STIMUL FOOD.

## Architecture

- `src/` — editable source.
- `src/data/menu.public.json` — public nutrition/product dataset only.
- `src/data/site.json` — pricing, offer semantics and product notes.
- `src/assets/core.js` — navigation, forms, analytics abstraction.
- `src/assets/home.js` — home metrics, package configurator, nutrition calculator.
- `src/assets/menu.js` — menu explorer, filters, day/dish dialogs.
- `dist/` — generated publication.
- `build.py` — validates data and rebuilds `dist`.

## Important security rule

The client bundle must never contain ingredient procurement prices, day cost, wholesale assumptions or investor economics. `build.py` intentionally fails if forbidden cost fields appear in public JSON.

## Run locally

```bash
python build.py
cd dist
python -m http.server 8000
```

Open `http://localhost:8000`.

## Change menu / pricing

- Menu: `src/data/menu.public.json`.
- Pricing and trial-offer semantics: `src/data/site.json`.
- Do not manually duplicate prices in HTML. UI reads them from data.

## Lead form

Set `formEndpoint` in `src/assets/config.js`. The included Cloudflare Pages function can receive requests at `/api/lead` when D1 is configured. Without a server endpoint the UI explicitly operates in demo mode and does not pretend that a request was delivered.

## Activation boundary

- Add confirmed legal/business details to `privacy.html`.
- Replace concept product imagery with verified production photography after control cooking.
- Confirm delivery windows, storage regimes and shelf life before publishing them as facts.
- Configure canonical production domain in `build.py` crawler files.

## Internal source data

`private-data/menu.internal.json` preserves the original full recipe/economic dataset, including procurement economics. It is outside `src/` and therefore never copied to the public `dist` build. Use it as the internal source when regenerating public product data.

`private-data/` is listed in `.gitignore`. The public repository contains only the sanitized `src/data/` snapshot. `build.py` regenerates the public snapshot when local private data exists; in CI without private data it validates and builds the committed sanitized snapshot.

## Brand assets

`src/assets/mark.svg` is the selected plate + S-route + five-meal symbol. Alternate vector directions are kept in `src/assets/brand/` for comparison and future brand refinement.
