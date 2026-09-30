import { STORAGE_PREFIX } from '../edition'
import { newCharacter } from '../model/factory'
import type { Encounter } from '../model/encounter'
import { SCHEMA_VERSION, type Character } from '../model/types'

// Persistence goes through this interface so a shared backend can replace the browser store
// later without touching the UI.
export interface CharacterRepository {
  load(): Character[] | null
  save(characters: Character[]): void
}

const KEY = `${STORAGE_PREFIX}:characters`

export class LocalStorageRepository implements CharacterRepository {
  private storage: Storage | undefined

  constructor(storage: Storage | undefined = safeStorage()) {
    this.storage = storage
  }

  load(): Character[] | null {
    try {
      const raw = this.storage?.getItem(KEY)
      if (!raw) return null
      return parseCharacters(JSON.parse(raw))
    } catch {
      return null
    }
  }

  save(characters: Character[]): void {
    try {
      this.storage?.setItem(KEY, JSON.stringify({ schema: SCHEMA_VERSION, characters }))
    } catch {
      // Storage can be full or blocked (private windows); the app keeps working in memory.
    }
  }
}

function safeStorage(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

// Accepts a saved store, an export file with many characters, or a single exported character.
// Missing fields are filled from a blank sheet so older or hand-edited files still load.
export function parseCharacters(data: unknown): Character[] {
  const list: unknown[] = Array.isArray(data)
    ? data
    : isObj(data) && Array.isArray(data.characters)
      ? data.characters
      : isObj(data) && typeof data.name === 'string'
        ? [data]
        : []
  if (list.length === 0) throw new Error('No characters found in that file.')
  return list.filter(isObj).map(normalize)
}

function normalize(raw: Record<string, unknown>): Character {
  const blank = newCharacter(raw.kind === 'npc' ? 'npc' : 'pc')
  const merged = { ...blank, ...raw } as Character
  merged.stats = { ...blank.stats, ...(isObj(raw.stats) ? raw.stats : {}) }
  merged.armor = { ...blank.armor, ...(isObj(raw.armor) ? raw.armor : {}) }
  merged.hp = { ...blank.hp, ...(isObj(raw.hp) ? raw.hp : {}) }
  merged.sta = { ...blank.sta, ...(isObj(raw.sta) ? raw.sta : {}) }
  merged.schema = SCHEMA_VERSION
  if (typeof merged.id !== 'string' || !merged.id) merged.id = blank.id
  return merged
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function exportJson(characters: Character[]): string {
  return JSON.stringify({ app: 'witcher-ttrpg', schema: SCHEMA_VERSION, characters }, null, 2)
}

const ENCOUNTER_KEY = `${STORAGE_PREFIX}:encounters`

export class LocalEncounterRepository {
  private storage: Storage | undefined

  constructor(storage: Storage | undefined = safeStorage()) {
    this.storage = storage
  }

  load(): Encounter[] | null {
    try {
      const raw = this.storage?.getItem(ENCOUNTER_KEY)
      if (!raw) return null
      const data = JSON.parse(raw)
      return Array.isArray(data?.encounters) ? data.encounters : null
    } catch {
      return null
    }
  }

  save(encounters: Encounter[]): void {
    try {
      this.storage?.setItem(ENCOUNTER_KEY, JSON.stringify({ schema: SCHEMA_VERSION, encounters }))
    } catch {
      // Same as characters: keep working in memory if storage is unavailable.
    }
  }
}
