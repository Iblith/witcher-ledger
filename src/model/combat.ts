import { derive, HIT_LOCATIONS, SKILL_BY_ID, type DerivedStats, type HitLocation, type StatKey } from '../rules/rules'
import type { Character, CharacterKind } from './types'

export interface CharacterDerived extends DerivedStats {
  maxHp: number
  maxSta: number
}

export function derived(c: Character): CharacterDerived {
  const d = derive(c.stats)
  return {
    ...d,
    maxHp: c.hp.maxOverride ?? d.hp,
    maxSta: c.sta.maxOverride ?? d.sta,
  }
}

export function skillValue(c: Character, skillId: string): number {
  return c.skills[skillId] ?? 0
}

// STAT + skill, the fixed part of every check before the d10.
export function checkBase(c: Character, skillId: string): number {
  const def = SKILL_BY_ID[skillId]
  if (def) return c.stats[def.stat] + skillValue(c, skillId)
  const custom = c.customSkills.find((k) => k.id === skillId)
  return custom ? c.stats[custom.stat] + custom.value : 0
}

export function statForSkill(c: Character, skillId: string): StatKey | undefined {
  return SKILL_BY_ID[skillId]?.stat ?? c.customSkills.find((k) => k.id === skillId)?.stat
}

export function carriedWeight(c: Character): number {
  return Math.round(c.items.reduce((sum, i) => sum + i.qty * i.weight, 0) * 10) / 10
}

// What the GM encounter tracker needs from any sheet, PC or NPC. Keeping it here means the
// tracker reads characters through one function and never reaches into sheet internals.
export interface Combatant {
  characterId: string
  kind: CharacterKind
  name: string
  initiativeBase: number
  hp: { current: number; max: number }
  sta: { current: number; max: number }
  stun: number
  rec: number
  sp: Record<HitLocation, number>
  defenses: { dodge: number; reposition: number }
  attacks: Array<{ name: string; base: number; damage: string }>
}

export function toCombatant(c: Character): Combatant {
  const d = derived(c)
  return {
    characterId: c.id,
    kind: c.kind,
    name: c.name,
    initiativeBase: c.stats.REF,
    hp: { current: c.hp.current, max: d.maxHp },
    sta: { current: c.sta.current, max: d.maxSta },
    stun: d.stun,
    rec: d.rec,
    sp: Object.fromEntries(HIT_LOCATIONS.map((l) => [l, c.armor[l].sp])) as Record<HitLocation, number>,
    defenses: {
      dodge: checkBase(c, 'dodge-escape'),
      reposition: checkBase(c, 'athletics'),
    },
    attacks: c.weapons.map((w) => ({
      name: w.name,
      base: checkBase(c, w.skillId) + w.accuracy,
      damage: w.damage,
    })),
  }
}
