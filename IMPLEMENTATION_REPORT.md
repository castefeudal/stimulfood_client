# STIMUL FOOD Client - implementation report

## What changed

The original landing page was rebuilt as a static-first product interface with a shared design system, dynamic menu data, a guided order flow and explicit evidence/limitation states.

### Product UX
- Premium responsive hero and product/value presentation.
- Dynamic 14-day / 70-meal menu explorer with search, meal filters, allergen exclusion and sorting.
- Detailed day and dish dialogs with prepared output, kcal, protein/fat/carbs, ingredients and simple/technical gram views.
- Nutrition dashboard derived from the menu dataset.
- Mifflin-St Jeor energy-context calculator with activity/goal inputs and non-medical disclaimers.
- Dynamic package configurator driven by a single pricing source.
- Guided three-step lead form and explicit demo/production delivery states.
- Quality, fit/non-fit, recipe-status and allergen transparency sections.

### Data architecture
- `private-data/menu.internal.json` preserves the original full internal source including procurement economics.
- `src/data/menu.public.json` contains only public product/nutrition fields.
- `src/data/site.json` is the commercial source of truth for package/trial semantics.
- `tools/generate_public_data.py` regenerates and sanitizes public product data.
- `build.py` fails if forbidden cost/procurement fields appear in the public bundle.

### Pricing inconsistency resolved
- `42.90 BYN` is treated as the first trial day.
- `45.90 BYN` is the standard one-day package.
- Trial pricing does not silently stack with package discounts.
- UI reads pricing from one data object instead of hard-coded repetitions.

### Brand/design
- New plate + S-route + five-meal-dot identity is the selected `mark.svg`.
- Two alternate SVG concept directions are preserved in `src/assets/brand/` for future brand review.
- New favicon and unified green/cream/gold design tokens.
- Responsive typography, grid, cards, macro bars, dialog system, focus states and reduced-motion support.

### Data that still requires operational confirmation
- Production kitchen and supplier confirmations.
- Final storage regimes and shelf life after control production.
- Actual delivery windows and service area rules.
- Legal operator/privacy details.
- Verified production photography after control cooking.
- Real pilot metrics and testimonials after they exist.

## Run

```bash
python build.py
cd dist
python -m http.server 8000
```

`dist/` is the publication artifact. Edit `src/`, then rebuild.

## QA

Final automated QA validates menu integrity, public-data leakage, pricing relationships, local references and JS syntax. A true Chromium screenshot/runtime pass could not be completed in the execution sandbox because local/file navigation is blocked by administrator browser policy; responsive behavior is therefore implemented and statically checked but should receive one final device/browser visual pass before public launch.
