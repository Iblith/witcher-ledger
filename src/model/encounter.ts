import { rollCheck, rollD10, type D10 } from '../rules/dice'
import { HIT_LOCATIONS, type HitLocation } from '../rules/rules'
import { toCombatant, type Combatant } from './combat'
import { uid } from './factory'
import type { BattleMap } from './battlemap'
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
  // Stamina regained per Recover action. Older saved fights may not have it (woundThreshold is the same number).
  rec?: number
  // Takes half damage by default in the damage form (monsters vs non-silver). Older fights: monsters only.
  resistant?: boolean
  // Natural SP on every location that armor damage never reduces (Dwarf Tough).
  toughSp?: number
  sp: Record<HitLocation, number>
  defenses: Combatant['defenses']
  attacks: Combatant['attacks']
  conditions: string[]
  // Critical wounds taken in this fight. Older saved fights may not have the field.
  injuries?: CriticalWound[]
  notes: string
  defeated: boolean
  // A player added by name only, with no sheet: the tracker shows just initiative and conditions.
  nameOnly?: boolean
  // The player rolls their own initiative and the GM types it in; "Roll initiative" leaves it alone.
  playerRolls?: boolean
  // This round: defenses taken so far, whether they spent their turn actively dodging, and how many
  // melee attackers are on them (Ganging Up). Cleared when a new round begins.
  defensesThisRound?: number
  activelyDodging?: boolean
  meleeAttackers?: number
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
  // Where everyone stands. Older saved fights have none.
  map?: BattleMap
  createdAt: number
  updatedAt: number
}

export const CONDITIONS = [
  'Bleeding',
  'Poisoned',
  'Burning',
  'Frozen',
  'Staggered',
  'Stunned',
  'Prone',
  'Blinded',
  'Unconscious',
  'Grappled',
  'Intoxicated',
  'Hallucinating',
] as const

// What each condition does, shown on hover: the Effect table (core p. 161) in the cheat sheet's words.
export const CONDITION_HELP: Record<(typeof CONDITIONS)[number], string> = {
  Bleeding: '2 damage per turn. DC 15 First Aid (1 action) or a Healing spell stops it (p. 161).',
  Poisoned: '3 damage per turn, armor doesn’t help. DC 15 Endurance (1 action) ends it (p. 161).',
  Burning: '5 damage to every location per turn, armor soaks it, and armor and weapons lose 1 per turn. Spend a turn on water or stop, drop and roll (p. 161).',
  Frozen: '−3 SPD and −1 REF. DC 16 Physique (1 action) breaks free (p. 161).',
  Staggered: '−2 to attack and defense until the start of their next turn (p. 161).',
  Stunned: 'No actions, and attackers only need to beat DC 10. A Stun save ends it and takes the whole turn; getting hit ends it at once (p. 161).',
  Prone: '−2 to attack and defense until they use their move to stand (p. 163).',
  Blinded: '−3 to attack and defense, −5 sight Awareness, until they spend a turn clearing their eyes (p. 161).',
  Unconscious: 'Non-lethal damage equal to their Stamina knocks them out; treated as stunned until they recover 20 Stamina and pass a Stun save (p. 153).',
  Grappled: 'Can’t move away, −2 to physical actions; Dodge/Escape against the grappler’s Brawling to slip free each turn (p. 163).',
  Intoxicated: '−2 REF, DEX and INT, −3 Verbal Combat, 25% chance of a blackout (p. 161).',
  Hallucinating: 'DC 15 Deduction to see through each false image (p. 161).',
}

// Damage multipliers for where a blow lands, and the 1d10 humanoid location table (core p. 152).
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
    rec: cb.rec,
    toughSp: cb.toughSp,
    // Monsters resist non-silver weapons; beasts and people don't (errata p. 162).
    resistant: c.race === 'Monster' && c.bestiary?.category !== 'Beast',
    sp: { ...cb.sp },
    defenses: { ...cb.defenses },
    attacks: cb.attacks.map((a) => ({ ...a })),
    conditions: [],
    injuries: [],
    notes: '',
    defeated: false,
  }
}

// The lines of a sheet's notes a GM wants mid-fight: threat, weaknesses and immunities.
export function quickNotes(c: Character): string {
  const lines = c.notes.split('\n').filter((l) => /^(Susceptible|Immune|Resistant|Regeneration):/.test(l))
  return [c.bestiary ? c.bestiary.threat : c.notes.split('\n')[0], ...lines].filter(Boolean).join(' · ')
}

// Copies of a bestiary or NPC sheet as independent monsters: damage to them never touches the
// template sheet when wounds are saved back. `taken` are names already in the fight, so a second
// batch of drowners carries on from "Drowner 3" instead of repeating "Drowner 1".
export function entriesFromTemplate(c: Character, count: number, taken: string[] = []): EncounterEntry[] {
  const n = Math.max(1, Math.floor(count))
  const used = new Set(taken)
  const numbered = n > 1 || used.has(c.name) || used.has(`${c.name} 1`)
  let next = 1
  const name = () => {
    if (!numbered) return c.name
    while (used.has(`${c.name} ${next}`)) next++
    used.add(`${c.name} ${next}`)
    return `${c.name} ${next}`
  }
  return Array.from({ length: n }, () => {
    const e = entryFromCharacter(c)
    return {
      ...e,
      characterId: null,
      kind: 'monster' as const,
      name: name(),
      hp: { current: e.hp.max, max: e.hp.max },
      sta: { current: e.sta.max, max: e.sta.max },
      notes: quickNotes(c),
    }
  })
}

// A player sheet the GM added with just a name, race and profession: stats untouched, no
// weapons or skills. It joins a fight as a name only and the player rolls their own initiative.
export function isNameOnlySheet(c: Character): boolean {
  return (
    c.kind === 'pc' &&
    Object.values(c.stats).every((v) => v === 5) &&
    c.weapons.length === 0 &&
    Object.values(c.skills).every((v) => !v)
  )
}

function nameOnlyEntry(c: Character): EncounterEntry {
  return {
    id: uid(),
    characterId: c.id,
    kind: 'pc',
    name: c.name,
    initiativeBase: 0,
    initiative: null,
    hp: { current: 0, max: 0 },
    sta: { current: 0, max: 0 },
    stun: 0,
    woundThreshold: 0,
    sp: Object.fromEntries(HIT_LOCATIONS.map((l) => [l, 0])) as Record<HitLocation, number>,
    defenses: { dodge: 0, reposition: 0 },
    attacks: [],
    conditions: [],
    injuries: [],
    notes: [c.race, c.profession].filter(Boolean).join(' · '),
    defeated: false,
    nameOnly: true,
    playerRolls: true,
  }
}

// A player sheet as a combatant: name only while the sheet is still blank, the full sheet otherwise.
export function playerEntry(c: Character): EncounterEntry {
  return isNameOnlySheet(c) ? nameOnlyEntry(c) : entryFromCharacter(c)
}

// Every player on the Players tab who isn't in the fight yet, in one go.
export function partyEntries(characters: Character[], already: EncounterEntry[] = []): EncounterEntry[] {
  const inFight = new Set(already.map((x) => x.characterId).filter(Boolean))
  return characters
    .filter((c) => c.kind === 'pc' && !inFight.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(playerEntry)
}

// Another copy of a combatant at full health, named after the last copy ("Bandit 3" -> "Bandit 4").
export function duplicateEntry(x: EncounterEntry, all: EncounterEntry[]): EncounterEntry {
  const stem = x.name.replace(/\s+\d+$/, '')
  const names = new Set(all.map((y) => y.name))
  let n = 2
  while (names.has(`${stem} ${n}`)) n++
  return {
    ...x,
    id: uid(),
    characterId: null,
    kind: x.kind === 'pc' ? 'pc' : 'monster',
    name: `${stem} ${n}`,
    initiative: null,
    hp: { ...x.hp, current: x.hp.max },
    sta: { ...x.sta, current: x.sta.max },
    conditions: [],
    injuries: [],
    defeated: false,
  }
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
  // Quick-add has no BODY or WILL, so Stun is a rough guess from HP. Edit it if the book says otherwise.
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
    rec: stun,
    resistant: true,
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
// Players who roll their own are never rolled for: the GM types their number in.
export function rollInitiative(e: Encounter, onlyMissing = false, d10: D10 = rollD10): Encounter {
  const entries = e.entries.map((x) =>
    x.playerRolls || (onlyMissing && x.initiative !== null) ? x : { ...x, initiative: rollCheck('Initiative', x.initiativeBase, d10).total },
  )
  const next = { ...e, entries }
  // Wait for players' own rolls before marking whose turn it is, so the top of the order is right.
  if (next.activeId || entries.some((x) => x.initiative === null)) return next
  return { ...next, activeId: turnOrder(next).find((x) => !x.defeated)?.id ?? null }
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
  // A new round clears the per-round defense counts (core p. 151, 153).
  const entries = round > e.round ? e.entries.map(newRoundEntry) : e.entries
  return { ...e, entries, activeId: order[turn].id, round }
}

export interface DamageInput {
  amount: number
  // Critical wound bonus damage, which armor can't stop (core p. 158).
  critBonus?: number
  location: HitLocation
  ignoreArmor: boolean
  resistant: boolean
  // Susceptible to this attack type: double damage (A Witcher's Journal p. 13).
  vulnerable?: boolean
}

export interface DamageResult {
  entry: EncounterEntry
  hpLoss: number
  ablated: boolean
  summary: string
}

// Armor stops damage up to its SP. Whatever gets through is multiplied by the hit location (rounded
// down), then halved for resistance (errata p. 154) or doubled for susceptibility (Journal p. 13), and
// the armor there loses 1 SP. Damage that doesn't beat SP does nothing.
export function applyDamage(x: EncounterEntry, d: DamageInput): DamageResult {
  const armorSp = d.ignoreArmor ? 0 : x.sp[d.location]
  const sp = d.ignoreArmor ? 0 : armorSp + (x.toughSp ?? 0)
  const through = Math.max(0, d.amount - sp)
  let hpLoss = Math.floor(through * LOCATION_MULTIPLIER[d.location])
  if (d.resistant && !d.vulnerable) hpLoss = Math.floor(hpLoss / 2)
  if (d.vulnerable && !d.resistant) hpLoss *= 2
  hpLoss += d.critBonus ?? 0
  const ablated = through > 0 && !d.ignoreArmor && armorSp > 0
  const entry: EncounterEntry = {
    ...x,
    hp: { ...x.hp, current: x.hp.current - hpLoss },
    sp: ablated ? { ...x.sp, [d.location]: armorSp - 1 } : x.sp,
  }
  const where = d.location === 'head' ? 'head' : d.location === 'torso' ? 'torso' : 'limb'
  const summary =
    through === 0
      ? `${x.name}: ${d.amount} to the ${where} stopped by ${sp} SP`
      : `${x.name}: ${d.amount} to the ${where}${sp ? ` − ${sp} SP` : ''} → ${hpLoss} HP${ablated ? ', armor −1 SP' : ''}`
  return { entry, hpLoss, ablated, summary }
}

export type EntryState = 'ok' | 'wounded' | 'dying' | 'defeated'

// 0 HP or less is the Death State (errata p. 153).
export function entryState(x: EncounterEntry): EntryState {
  if (x.defeated) return 'defeated'
  if (x.nameOnly) return 'ok'
  if (x.hp.current <= 0) return 'dying'
  if (x.hp.current < x.woundThreshold) return 'wounded'
  return 'ok'
}

// Recover action (a full round): regain Stamina equal to REC, up to the maximum (core p. 151).
export function recoverStamina(x: EncounterEntry): EncounterEntry {
  const rec = x.rec ?? x.woundThreshold
  return { ...x, sta: { ...x.sta, current: Math.min(x.sta.max, x.sta.current + rec) } }
}

// An extra action costs 3 STA (core p. 151).
export function spendStamina(x: EncounterEntry, amount: number): EncounterEntry {
  return { ...x, sta: { ...x.sta, current: x.sta.current - amount } }
}

// Forced into more than one defense in a round, each one costs 1 STA, unless they spent their turn
// actively dodging (core p. 151). The book doesn't say whether the first is free once a second
// comes; like the cheat sheet, the app charges from the second defense on.
export function defenseCost(x: EncounterEntry): number {
  return !x.activelyDodging && (x.defensesThisRound ?? 0) >= 1 ? 1 : 0
}

export function takeDefense(x: EncounterEntry): EncounterEntry {
  const cost = defenseCost(x)
  return { ...spendStamina(x, cost), defensesThisRound: (x.defensesThisRound ?? 0) + 1 }
}

// Ganging Up (core p. 153): −1 to defense per melee attacker past the first. Actively dodging puts −2
// on anyone striking them in melee that round (p. 151), which is the attacker's penalty, not theirs.
export function gangUpPenalty(x: EncounterEntry): number {
  return Math.max(0, (x.meleeAttackers ?? 0) - 1)
}

export function defenseBase(x: EncounterEntry): number {
  return x.defenses.dodge - gangUpPenalty(x)
}

function newRoundEntry(x: EncounterEntry): EncounterEntry {
  return { ...x, defensesThisRound: 0, activelyDodging: false, meleeAttackers: 0 }
}

// Copies a fight's HP, Stamina, armor SP and new injuries back onto the linked character sheets.
export function writeBack(e: Encounter, characters: Character[]): Character[] {
  // Name-only players carry no numbers, so there is nothing to save to their sheets.
  const byChar = new Map(e.entries.filter((x) => x.characterId && !x.nameOnly).map((x) => [x.characterId!, x]))
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

// Type-to-filter over NPC sheets: every word must appear in the name, bestiary type, threat or the
// first line of the notes. Name matches come first.
export function searchNpcs(list: Character[], query: string): Character[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return list
  const hay = (c: Character) => [c.name, c.bestiary?.category, c.bestiary?.threat, c.notes.split('\n')[0]].filter(Boolean).join(' ').toLowerCase()
  const hits = list.filter((c) => words.every((w) => hay(c).includes(w)))
  const byName = (c: Character) => (words.every((w) => c.name.toLowerCase().includes(w)) ? 0 : 1)
  return hits.sort((a, b) => byName(a) - byName(b))
}
