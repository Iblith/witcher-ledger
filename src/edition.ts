// The app ships as two builds from one codebase: `npm run build:player` and `npm run build:gm`.
// Players create and manage their own characters and send them to the GM; the GM keeps NPCs,
// imports the players' sheets and runs encounters.
export type Edition = 'player' | 'gm'

export const EDITION: Edition = import.meta.env.VITE_EDITION === 'player' ? 'player' : 'gm'
export const IS_GM = EDITION === 'gm'

export const EDITION_LABEL = IS_GM ? "Game Master's ledger" : "Player's ledger"

// Separate storage per edition, so a GM who also plays can run both on one device.
export const STORAGE_PREFIX = IS_GM ? 'witcher-ttrpg' : 'witcher-ttrpg-player'
