# DealSift — Black Friday 2026 Deal Finder

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Schyd/black-friday-deal-finder-01/rank.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Schyd/black-friday-deal-finder-01/reward.svg)](https://make.fun/competitions/black-friday-deal-finder-01)

A static deal finder for Black Friday & Cyber Monday 2026: **26 real deals from 6 stores across 8 categories**, every price checked by hand on Nov 27, 2026 from the store's own product page (or a deal roundup naming the store). Each card shows the product, store, sale price, usual price, discount %, a link to the store, the check time, the source, and an honest signal — New low / Strong price / Routine sale / Inflated — so a big % off an inflated list price never outranks a real low.

## What it does

- Search across product names, brands and notes
- Filter by category, store, discount (25%+ / 40%+ / 50%+) and signal
- Sort by best deals first (discount % weighted by signal), biggest discount, biggest $ saving, lowest price, or name
- Same product compared across stores where it is listed twice (AirPods Pro 3: Amazon $149 and Walmart $149)
- Phone layout (single column under 600px)
- Works fully offline: no network requests, no frameworks, system fonts only

## Run it

Open `app/index.html` in a browser, or serve `app/` with any static server. `main.ts` (Node 22+) copies `app/` and `screenshots/` to `$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE).
