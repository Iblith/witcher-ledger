import { derive, HIT_LOCATIONS, SKILL_BY_ID, type DerivedStats, type HitLocation, type StatKey } from '../rules/rules'

// Skills that armor EV hampers on top of REF and DEX (errata p. 78, EV & Magic).
const EV_MAGIC_SKILLS = new Set(['spell-casting', 'hex-weaving', 'ritual-crafting'])
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

// Total Encumbrance Value of worn armor. A piece that fills several slots (torso armor covers the
// arms, trousers both legs) counts once.
export function armorEv(c: Character): number {
  const byPiece = new Map<string, number>()
  let loose = 0
  for (const l of HIT_LOCATIONS) {
    const a = c.armor[l]
    const ev = a.ev ?? 0
    if (!ev) continue
    if (a.piece.trim()) byPiece.set(a.piece.trim(), Math.max(byPiece.get(a.piece.trim()) ?? 0, ev))
    else loose += ev
  }
  return [...byPiece.values()].reduce((s, v) => s + v, loose)
}

// Armor EV is subtracted from REF and DEX, to a minimum of 1 (errata p. 78).
export function effectiveStat(c: Character, k: StatKey): number {
  if (k !== 'REF' && k !== 'DEX') return c.stats[k]
  const ev = armorEv(c)
  return ev ? Math.max(1, c.stats[k] - ev) : c.stats[k]
}

// STAT + skill, the fixed part of every check before the d10.
export function checkBase(c: Character, skillId: string): number {
  const magic = EV_MAGIC_SKILLS.has(skillId) ? armorEv(c) : 0
  const def = SKILL_BY_ID[skillId]
  if (def) return effectiveStat(c, def.stat) + skillValue(c, skillId) - magic
  const custom = c.customSkills.find((k) => k.id === skillId)
  return custom ? effectiveStat(c, custom.stat) + custom.value : 0
}

export function statForSkill(c: Character, skillId: string): StatKey | undefined {
  return SKILL_BY_ID[skillId]?.stat ?? c.customSkills.find((k) => k.id === skillId)?.stat
}

// Recovery (Easy Mode p. 18; errata p. 48, 151). A Recover action in combat restores REC Stamina.
// Resting restores REC Stamina per hour, halved if any of that hour was strenuous.
export function recoverAction(c: Character): Partial<Character> {
  const d = derived(c)
  return { sta: { ...c.sta, current: Math.min(d.maxSta, c.sta.current + d.rec) } }
}

export function restHour(c: Character, strenuous: boolean): Partial<Character> {
  const d = derived(c)
  const gain = strenuous ? Math.floor(d.rec / 2) : d.rec
  return { sta: { ...c.sta, current: Math.min(d.maxSta, c.sta.current + gain) } }
}

// HP only returns once a DC:10 First Aid check has treated the patient: REC per day of rest, halved
// for a strenuous day, +3 a day if a Doctor's Healing Hands began the treatment.
export function restDay(c: Character, strenuous: boolean, healingHands: boolean): Partial<Character> {
  const d = derived(c)
  const gain = (strenuous ? Math.floor(d.rec / 2) : d.rec) + (healingHands ? 3 : 0)
  return { hp: { ...c.hp, current: Math.min(d.maxHp, c.hp.current + gain) } }
}

// Casting (Easy Mode p. 21, errata p. 166): every spell or Sign costs Stamina. Once the round's total
// cost passes the Vigor Threshold, each point over it costs 5 HP. `spentThisRound` is the total before
// this cast; the result says what this cast added.
export function castSpell(c: Character, cost: number, spentThisRound: number): { patch: Partial<Character>; spent: number; hpLoss: number } {
  const spent = spentThisRound + cost
  const over = (n: number) => Math.max(0, n - c.vigor)
  const hpLoss = 5 * (over(spent) - over(spentThisRound))
  return {
    patch: { sta: { ...c.sta, current: c.sta.current - cost }, hp: { ...c.hp, current: c.hp.current - hpLoss } },
    spent,
    hpLoss,
  }
}

// The leading number of a spell's STA cost text ("5", "3 per round"), or null for a range ("1-7"),
// "Varies", or anything else the caster chooses.
export function staCostNumber(text: string): number | null {
  const m = text.trim().match(/^(\d+)(?!\s*[-–to]+\s*\d)/)
  return m ? Number(m[1]) : null
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
  toughSp: number
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
    initiativeBase: effectiveStat(c, 'REF'),
    // Dwarf Tough: +2 SP everywhere on top of armor, never ablated (errata p. 23).
    toughSp: c.race === 'Dwarf' ? 2 : 0,
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
