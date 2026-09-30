# Witcher Ledger

Character sheets and a GM encounter tracker for The Witcher TTRPG.

## Two versions

- **Player**: create and manage your own characters, then "Send to GM" (copy or file).
- **GM**: NPCs, "Import players" to load player sheets, and the encounter tracker.

Both install on phones (Add to Home Screen) and work offline once hosted over https.
Data stays on the device in browser storage; there is no login.

## Run it

```sh
npm install
npm run dev          # GM version dev server (npm run dev:player for the player version)
npm test             # rules, dice, storage and encounter tests
npm run build        # builds everything below
```

Build output:
- `dist/site/`: static site to host anywhere over https (landing page, `/player/`, `/gm/`), with
  install manifests and an offline service worker.
- `dist/witcher-ledger-player.html`, `dist/witcher-ledger-gm.html`: single files for desktop.
  Open in a browser; data saves in that browser.

## Rules notes

Derived stats follow the core Physical table with the v4 errata (Stun capped at 10, Leap = Run/5).
Damage in the tracker: (damage - SP) x location (head x3, torso x1, limbs x1/2), halved if
resistant, and armor loses 1 SP when damage gets through.

## Code map

- `src/edition.ts`: which version is being built (`VITE_EDITION`, set by `.env.player` / `.env.gm`).
- `src/model/`: character types, `toCombatant()`, encounter logic.
- `src/storage/store.ts`: browser storage behind `CharacterRepository`; import/export parsing.
- `public/sw.js`: offline caching. `scripts/`: single-file build, icon renderer, landing page.
