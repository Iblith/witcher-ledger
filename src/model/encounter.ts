import { rollCheck, rollD10, type D10 } from '../rules/dice'
import { HIT_LOCATIONS, type HitLocation } from '../rules/rules'
import { toCombatant, type Combatant } from './combat'
import { uid } from './factory'
import type { Character, CriticalWound } from './types'

export type EntryKind = 'pc' | 'npc' | 'monster'

// One combatant in a fight. Sheet-backed entries copy their numbers in when added, and the GM
// can write HP, Stamina and armor back to the sheets when the fight ends.
export interface EncounterEntry {
  id: string
  characterId: string | null
  kind: EntryKind
  name: string
  initiativeBase: number
  initiative: number | null
  hp: { current: number; max: number }
  sta: { current: number; max: number }
  stun: number
  woundThreshold: number
  sp: Record<HitLocation, number>
  defenses: Combatant['defenses']
  attacks: Combatant['attacks']
  conditions: string[]
  // Critical wounds taken in this fight. Older saved fights may not have the field.
  injuries?: CriticalWound[]
  notes: string
  defeated: boolean
}

export interface Encounter {
  id: string
  name: string
  round: number
  // Whose turn it is; null before the first turn. An id, not an index, so edits to initiative
  // mid-fight don't move the marker to someone else.
  activeId: string | null
  entries: EncounterEntry[]
  log: string[]
  createdAt: number
  updatedAt: number
}

export const CONDITIONS = [
  'Bleeding',
  'Poisoned',
  'Burning',
  'Staggered',
  'Stunned',
  'Prone',
  'Blinded',
  'Grappled',
  'Intoxicated',
  'Hallucinating',
] as const

// Damage multipliers for where a blow lands (humanoid hit locations).
export const LOCATION_MULTIPLIER: Record<HitLocation, number> = {
  head: 3,
  torso: 1,
  rArm: 0.5,
  lArm: 0.5,
  rLeg: 0.5,
  lLeg: 0.5,
}

// 1d10 random hit location table for humanoids.
export function rollHitLocation(d10: D10 = rollD10): HitLocation {
  const r = d10()
  if (r === 1) return 'head'
  if (r <= 4) return 'torso'
  if (r === 5) return 'rArm'
  if (r === 6) return 'lArm'
  if (r <= 8) return 'rLeg'
  return 'lLeg'
}

export function newEncounter(name = 'New encounter'): Encounter {
  const now = Date.now()
  return { id: uid(), name, round: 1, activeId: null, entries: [], log: [], createdAt: now, updatedAt: now }
}

export function entryFromCharacter(c: Character): EncounterEntry {
  const cb = toCombatant(c)
  return {
    id: uid(),
    characterId: c.id,
    kind: c.kind,
    name: c.name,
    initiativeBase: cb.initiativeBase,
    initiative: null,
    hp: { ...cb.hp },
    sta: { ...cb.sta },
    stun: cb.stun,
    woundThreshold: cb.rec,
    sp: { ...cb.sp },
    defenses: { ...cb.defenses },
    attacks: cb.attacks.map((a) => ({ ...a })),
    conditions: [],
    injuries: [],
    notes: '',
    defeated: false,
  }
}

// Copies of a bestiary or NPC sheet as independent monsters: damage to them never touches the
// template sheet when wounds are saved back.
export function entriesFromTemplate(c: Character, count: number): EncounterEntry[] {
  const n = Math.max(1, Math.floor(count))
  return Array.from({ length: n }, (_, i) => {
    const e = entryFromCharacter(c)
    return {
      ...e,
      characterId: null,
      kind: 'monster' as const,
      name: n > 1 ? `${c.name} ${i + 1}` : c.name,
      hp: { current: e.hp.max, max: e.hp.max },
      sta: { current: e.sta.max, max: e.sta.max },
      notes: c.bestiary ? c.bestiary.threat : '',
    }
  })
}

export interface MonsterInput {
  name: string
  count: number
  hp: number
  sta: number
  ref: number
  sp: number
  headSp: number
  dodge: number
  attack: number
  damage: string
  notes: string
}

export function monsterEntries(m: MonsterInput): EncounterEntry[] {
  const n = Math.max(1, Math.floor(m.count))
  const stun = Math.min(10, Math.max(1, Math.floor(m.hp / 5)))
  return Array.from({ length: n }, (_, i) => ({
    id: uid(),
    characterId: null,
    kind: 'monster' as const,
    name: n > 1 ? `${m.name} ${i + 1}` : m.name,
    initiativeBase: m.ref,
    initiative: null,
    hp: { current: m.hp, max: m.hp },
    sta: { current: m.sta, max: m.sta },
    stun,
    woundThreshold: stun,
    sp: Object.fromEntries(HIT_LOCATIONS.map((l) => [l, l === 'head' ? m.headSp : m.sp])) as Record<HitLocation, number>,
    defenses: { dodge: m.dodge, reposition: m.dodge },
    attacks: m.attack || m.damage ? [{ name: 'Attack', base: m.attack, damage: m.damage }] : [],
    conditions: [],
    injuries: [],
    notes: m.notes,
    defeated: false,
  }))
}

// Highest initiative acts first; ties go to the higher REF. Entries without a roll go last.
export function turnOrder(e: Encounter): EncounterEntry[] {
  return [...e.entries].sort((a, b) => {
    const ai = a.initiative ?? -Infinity
    const bi = b.initiative ?? -Infinity
    if (bi !== ai) return bi - ai
    return b.initiativeBase - a.initiativeBase
  })
}

export function currentEntry(e: Encounter): EncounterEntry | null {
  return e.entries.find((x) => x.id === e.activeId) ?? null
}

// Initiative is REF + 1d10. Rolls every combatant, or only those without one when onlyMissing is set.
export function rollInitiative(e: Encounter, onlyMissing = false, d10: D10 = rollD10): Encounter {
  const entries = e.entries.map((x) =>
    onlyMissing && x.initiative !== null ? x : { ...x, initiative: rollCheck('Initiative', x.initiativeBase, d10).total },
  )
  const next = { ...e, entries }
  return next.activeId ? next : { ...next, activeId: turnOrder(next).find((x) => !x.defeated)?.id ?? null }
}

export function advanceTurn(e: Encounter, dir: 1 | -1 = 1): Encounter {
  const order = turnOrder(e)
  if (!order.some((x) => !x.defeated)) return e
  let turn = order.findIndex((x) => x.id === e.activeId)
  let round = e.round
  if (turn < 0) {
    if (dir < 0) return e
    turn = -1
  }
  // Step until we land on someone still in the fight.
  for (let i = 0; i < order.length; i++) {
    turn += dir
    if (turn >= order.length) {
      turn = 0
      round += 1
    } else if (turn < 0) {
      if (round === 1) return { ...e, activeId: null }
      turn = order.length - 1
      round -= 1
    }
    if (!order[turn].defeated) break
  }
  return { ...e, activeId: order[turn].id, round }
}

export interface DamageInput {
  amount: number
  location: HitLocation
  ignoreArmor: boolean
  resistant: boolean
}

export interface DamageResult {
  entry: EncounterEntry
  hpLoss: number
  ablated: boolean
  summary: string
}

// Armor stops damage up to its SP. Whatever gets through is multiplied by the hit location,
// halved for resistance, and the armor there loses 1 SP. Damage that doesn't beat SP does nothing.
export function applyDamage(x: EncounterEntry, d: DamageInput): DamageResult {
  const sp = d.ignoreArmor ? 0 : x.sp[d.location]
  const through = Math.max(0, d.amount - sp)
  let hpLoss = Math.floor(through * LOCATION_MULTIPLIER[d.location])
  if (d.resistant) hpLoss = Math.floor(hpLoss / 2)
  const ablated = through > 0 && !d.ignoreArmor && sp > 0
  const entry: EncounterEntry = {
    ...x,
    hp: { ...x.hp, current: x.hp.current - hpLoss },
    sp: ablated ? { ...x.sp, [d.location]: sp - 1 } : x.sp,
  }
  const where = d.location === 'head' ? 'head' : d.location === 'torso' ? 'torso' : 'limb'
  const summary =
    through === 0
      ? `${x.name}: ${d.amount} to the ${where} stopped by ${sp} SP`
      : `${x.name}: ${d.amount} to the ${where}${sp ? ` − ${sp} SP` : ''} → ${hpLoss} HP${ablated ? ', armor −1 SP' : ''}`
  return { entry, hpLoss, ablated, summary }
}

export type EntryState = 'ok' | 'wounded' | 'dying' | 'defeated'

export function entryState(x: EncounterEntry): EntryState {
  if (x.defeated) return 'defeated'
  if (x.hp.current < 0) return 'dying'
  if (x.hp.current < x.woundThreshold) return 'wounded'
  return 'ok'
}

// Copies a fight's HP, Stamina, armor SP and new injuries back onto the linked character sheets.
export function writeBack(e: Encounter, characters: Character[]): Character[] {
  const byChar = new Map(e.entries.filter((x) => x.characterId).map((x) => [x.characterId!, x]))
  return characters.map((c) => {
    const x = byChar.get(c.id)
    if (!x) return c
    const armor = { ...c.armor }
    for (const l of HIT_LOCATIONS) armor[l] = { ...armor[l], sp: Math.min(x.sp[l], armor[l].maxSp || x.sp[l]) }
    // Injuries are matched by id, so saving the same fight twice doesn't duplicate them.
    const known = new Set(c.crits.map((w) => w.id))
    const crits = [...c.crits, ...(x.injuries ?? []).filter((w) => !known.has(w.id))]
    return { ...c, hp: { ...c.hp, current: x.hp.current }, sta: { ...c.sta, current: x.sta.current }, armor, crits, updatedAt: Date.now() }
  })
}

// A ready-made fight so the tracker isn't empty on first open. Named as an example.
export function sampleEncounter(characters: Character[]): Encounter {
  const e = newEncounter('Drowners at the ford (example)')
  e.entries = [
    ...characters.filter((c) => c.kind === 'pc').map(entryFromCharacter),
    ...monsterEntries({ name: 'Drowner', count: 2, hp: 20, sta: 20, ref: 6, sp: 2, headSp: 2, dodge: 12, attack: 13, damage: '2d6', notes: 'Example stats: check your bestiary. Half damage from non-silver weapons.' }),
  ]
  return e
}
