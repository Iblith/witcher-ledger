import { parseCharacters } from '../storage/store'
import type { Character } from './types'
import { NPC_PACK_DATA } from './npcPack.data'

// Original NPCs and monsters (not from the rulebook) added to the GM's NPC list once, alongside
// the bestiary. Their ids are stable, so a GM who already has one keeps their edited copy.
// Only the ones the campaign uses ship in the app; the full pack of 30 is still in the project's
// npcs/npc-pack-1.json for Import.
export function missingNpcPack(characters: Character[]): Character[] {
  const have = new Set(characters.map((c) => c.id))
  return parseCharacters(NPC_PACK_DATA).filter((c) => !have.has(c.id))
}

// Pack entries the campaign doesn't use, dropped from the app on 2026-10-21 (Jacob's ask).
export const RETIRED_PACK = [
  'ostrid-vell',
  'jorund-pike',
  'sabina-aerdt',
  'emeric-thrane',
  'hubert-dall',
  'lesko-ferryman',
  'wendeline-faerber',
  'tamsin-reed',
  'aelirenn-vaen',
  'siana-dhuanne',
  'brokk-hammelmann',
  'gudrun-stahlfaust',
  'nimb-gnome',
  'radek-viper',
  'ghoul-alpha',
  'nekker-warband',
  'starving-wolf',
  'grey-widow',
  'cemetery-mother',
  'mossback-troll',
  'aldo-grieg',
  'thorn-stag',
  'lady-ysolde',
  'arachas-broodmother',
  'redcrest-wyvern',
  'marsh-foglet',
].map((k) => 'npc-pack1-' + k)
