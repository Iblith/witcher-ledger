import { parseCharacters } from '../storage/store'
import type { Character } from './types'
import { NPC_PACK_DATA } from './npcPack.data'

// Original NPCs and monsters (not from the rulebook) added to the GM's NPC list once, alongside
// the bestiary. Their ids are stable, so a GM who already has one keeps their edited copy.
export function missingNpcPack(characters: Character[]): Character[] {
  const have = new Set(characters.map((c) => c.id))
  return parseCharacters(NPC_PACK_DATA).filter((c) => !have.has(c.id))
}
