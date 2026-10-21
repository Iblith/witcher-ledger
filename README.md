# Witcher Ledger

Character sheets and a GM encounter tracker for The Witcher TTRPG.

## Two versions

- **Player**: create and manage your own characters, then "Send to GM" (copy or file).
- **GM**: Players (imported sheets only, via "Import players"), NPCs seeded with 33 monsters from A Witcher's Journal (the book's stat blocks; `src/model/journalBestiary.ts`) plus estimated core-rulebook creatures (`src/model/bestiary.ts`), and the encounter tracker.

Both install on phones (Add to Home Screen) and work offline once hosted over https.
Data stays on the device in browser storage; there is no login.

## Run it

```sh
npm install
npm run dev          # GM version dev server (npm run dev:player for the player version)
npm test             # rules, dice, storage, encounter and rules-source tests
npm run build        # builds everything below
```

Build output:
- `dist/site/`: static site to host anywhere over https (landing page, `/player/`, `/gm/`), with
  install manifests and an offline service worker.
- `dist/witcher-ledger-player.html`, `dist/witcher-ledger-gm.html`: single files for desktop.
  Open in a browser; data saves in that browser.

## Rules notes

The rules sources on hand are the core v4 errata and A Witcher's Journal; there is no copy of the
core rulebook. Code comments say which source settles each rule, and anything from memory of the
core book is marked UNVERIFIED in the code and "unverified" in the app.

- Derived stats: (BODY + WILL) / 2 drives REC and Stun (capped at 10), checked against the Journal
  stat blocks. Leap = Run / 5, Run = SPD x 3, Enc = BODY x 10. HP = STA = 5 x base is unverified.
- Saves: roll 1d10 under the Save (Stun) value; equal or higher fails. Death State starts at 0 HP.
- Recovery: the Recover action gives REC Stamina. Resting and healing are left to the core book.
- Magic: casting spends Stamina; going over the Vigor Threshold in a round is flagged as overexertion.
- Damage in the tracker: (damage - SP) x location (head x3, torso x1, limbs x1/2, unverified), then
  halved if resistant or doubled if susceptible, and armor loses 1 SP when damage gets through.

## Code map

- `src/edition.ts`: which version is being built (`VITE_EDITION`, set by `.env.player` / `.env.gm`).
- `src/model/`: character types, `toCombatant()`, encounter logic.
- `src/storage/store.ts`: browser storage behind `CharacterRepository`; import/export parsing.
- `public/sw.js`: offline caching. `scripts/`: single-file build, icon renderer, landing page.
