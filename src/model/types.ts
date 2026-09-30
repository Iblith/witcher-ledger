import type { HitLocation, Stats } from '../rules/rules'

export const SCHEMA_VERSION = 1

// 'pc' sheets belong to players; 'npc' sheets are the GM's. The encounter tracker
// will pull both kinds into a fight via toCombatant() in combat.ts.
export type CharacterKind = 'pc' | 'npc'

export interface Tracker {
  current: number
  // null means "use the derived maximum"; a number overrides it (e.g. a mutation or item bonus).
  maxOverride: number | null
}

export interface ArmorSlot {
  piece: string
  sp: number
  maxSp: number
}

export interface Weapon {
  id: string
  name: string
  skillId: string
  accuracy: number
  damage: string
  reliability: number
  hands: number
  range: string
  effect: string
  notes: string
}

export type CritSeverity = 'simple' | 'complex' | 'difficult' | 'deadly'

export interface CriticalWound {
  id: string
  location: HitLocation
  severity: CritSeverity
  description: string
  treated: boolean
}

export interface Item {
  id: string
  name: string
  qty: number
  weight: number
  notes: string
}

export type SpellKind = 'Spell' | 'Sign' | 'Invocation' | 'Ritual' | 'Hex'

export interface Spell {
  id: string
  name: string
  kind: SpellKind
  staCost: string
  range: string
  duration: string
  defense: string
  effect: string
}

export interface Character {
  id: string
  schema: number
  kind: CharacterKind
  name: string
  player: string
  race: string
  profession: string
  definingSkill: string
  definingSkillValue: number
  school: string
  age: string
  gender: string
  homeland: string
  stats: Stats
  skills: Record<string, number>
  // Profession skill tree abilities and any other custom skills, keyed by name.
  customSkills: Array<{ id: string; name: string; stat: keyof Stats; value: number }>
  hp: Tracker
  sta: Tracker
  luckCurrent: number
  vigor: number
  armor: Record<HitLocation, ArmorSlot>
  weapons: Weapon[]
  crits: CriticalWound[]
  conditions: string
  items: Item[]
  crowns: number
  spells: Spell[]
  perks: string
  background: string
  notes: string
  ip: number
  createdAt: number
  updatedAt: number
}
