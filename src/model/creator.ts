import { rollD10, type D10 } from '../rules/dice'
import { derive, SKILL_BY_ID, SKILL_CAP_AT_CREATION, slug, STAT_KEYS, type Stats } from '../rules/rules'
import { newCharacter, uid } from './factory'
import { findEntry, removeFromCharacter } from './catalog'
import { COMBAT_SKILL_PICKS, GEAR_EXTRAS, HOME_LANGUAGE_VALUE, HOMELAND_BONUS, homeLanguageSkill, PROFESSION_GEAR, PROFESSION_SKILLS, STARTING_GEAR_NOTE } from './presets'
import type { Character, CharacterKind, Item, LifeEvent, LifeEventKind } from './types'

// Stat point pools by game type; the GM decides which one the table uses (core p. 47).
export const STAT_POOLS = [
  { id: 'average', label: 'Average', points: 60 },
  { id: 'skilled', label: 'Skilled', points: 70 },
  { id: 'heroic', label: 'Heroes', points: 75 },
  { id: 'legendary', label: 'Legends', points: 80 },
] as const

// Point-buy stats run 2-10 here; rolled stats re-roll 1s and 2s, and the Statistic Cap is 10 (p. 47).
export const STAT_MIN = 2
export const STAT_MAX = 10
// 44 points for the skill package and defining skill, at least 1 in each (core p. 49).
export const PROFESSION_SKILL_POINTS = 44

// Starting coin is a profession's base × 2d6 crowns; these are the averages (core p. 71).
export const STARTING_CROWNS: Record<string, number> = {
  Bard: 840,
  Craftsman: 840,
  Criminal: 700,
  Doctor: 1050,
  Mage: 1400,
  'Man-At-Arms': 1050,
  Merchant: 1260,
  Priest: 525,
  Witcher: 350,
}

export const FAMILY_FIELDS = [
  { id: 'fate', label: 'Family fate' },
  { id: 'parents', label: 'Parents' },
  { id: 'status', label: 'Family status' },
  { id: 'friend', label: 'Most influential friend' },
  { id: 'siblings', label: 'Siblings' },
] as const
export type FamilyField = (typeof FAMILY_FIELDS)[number]['id']

export const DECADE_KINDS: LifeEventKind[] = ['Fortune', 'Misfortune', 'Ally', 'Enemy', 'Romance', 'Other']

export interface DecadeEntry {
  id: string
  when: string
  kind: LifeEventKind
  title: string
  details: string
}

export interface CreatorDraft {
  step: number
  character: Character
  poolId: string
  poolPoints: number
  professionSkills: string[]
  family: Record<FamilyField, string>
  decades: DecadeEntry[]
  // Set when the stats were rolled instead of bought: the nine numbers to place, one per stat.
  rolled?: number[]
}

// Rolling stats (core p. 47): 1d10 nine times, re-rolling 1s and 2s, then place one on each stat.
export function rollStats(d10: D10 = rollD10): number[] {
  return Array.from({ length: STAT_KEYS.length }, () => {
    let r = d10()
    while (r <= 2) r = d10()
    return r
  })
}

export function rolledStatsPlaced(stats: Stats, rolled: number[]): boolean {
  const a = STAT_KEYS.map((k) => stats[k]).sort((x, y) => x - y)
  const b = [...rolled].sort((x, y) => x - y)
  return a.every((v, i) => v === b[i])
}

export function newDraft(kind: CharacterKind = 'pc'): CreatorDraft {
  const character = newCharacter(kind, '')
  character.stats = Object.fromEntries(STAT_KEYS.map((k) => [k, STAT_MIN])) as Stats
  return {
    step: 0,
    character,
    poolId: 'skilled',
    poolPoints: 70,
    professionSkills: [],
    family: { fate: '', parents: '', status: '', friend: '', siblings: '' },
    decades: [],
  }
}

export function statPointsSpent(stats: Stats): number {
  return STAT_KEYS.reduce((sum, k) => sum + stats[k], 0)
}

// What a skill level costs: 2 points a level for difficult skills, 1 for the rest (core p. 49).
export function skillCost(id: string, level: number): number {
  return SKILL_BY_ID[id]?.difficult ? level * 2 : level
}

// Profession skills (and the defining skill) spend the 44 profession points;
// everything else comes out of the pick-up pool, which is INT + REF (core p. 49).
export function skillBudget(d: CreatorDraft) {
  const c = d.character
  const prof = new Set(d.professionSkills)
  const home = homeLanguageSkill(c.homeland)
  let professionSpent = c.definingSkillValue
  let pickupSpent = 0
  for (const [id, raw] of Object.entries(c.skills)) {
    // The home language's first +8 is free.
    const v = skillCost(id, id === home ? Math.max(0, raw - HOME_LANGUAGE_VALUE) : raw)
    if (prof.has(id)) professionSpent += v
    else pickupSpent += v
  }
  return {
    professionSpent,
    professionTotal: PROFESSION_SKILL_POINTS,
    pickupSpent,
    pickupTotal: c.stats.INT + c.stats.REF,
    cap: SKILL_CAP_AT_CREATION,
  }
}

// One empty row per decade of adult life, starting at age 10, based on the character's age.
export function decadeRows(age: string): DecadeEntry[] {
  const n = parseInt(age, 10)
  const count = Number.isFinite(n) && n >= 10 ? Math.min(12, Math.floor((n - 10) / 10) + 1) : 1
  return Array.from({ length: count }, (_, i) => ({
    id: uid(),
    when: `Age ${10 + i * 10}s`,
    kind: 'Fortune' as LifeEventKind,
    title: '',
    details: '',
  }))
}

export interface CreatorIssue {
  step: number
  text: string
}

export function creatorIssues(d: CreatorDraft): CreatorIssue[] {
  const c = d.character
  const issues: CreatorIssue[] = []
  if (!c.name.trim()) issues.push({ step: 0, text: 'Give your character a name.' })
  if (!c.profession) issues.push({ step: 2, text: 'Choose a profession.' })
  const spent = statPointsSpent(c.stats)
  if (d.rolled) {
    if (!rolledStatsPlaced(c.stats, d.rolled)) issues.push({ step: 3, text: 'Place each rolled number on one stat.' })
  } else if (spent !== d.poolPoints) issues.push({ step: 3, text: `Statistics use ${spent} of ${d.poolPoints} points.` })
  const b = skillBudget(d)
  if (b.professionSpent > b.professionTotal)
    issues.push({ step: 4, text: `Profession skills are ${b.professionSpent - b.professionTotal} points over.` })
  if (b.pickupSpent > b.pickupTotal)
    issues.push({ step: 4, text: `Pick-up skills are ${b.pickupSpent - b.pickupTotal} points over.` })
  if (c.profession && (d.professionSkills.some((id) => (c.skills[id] ?? 0) < 1) || c.definingSkillValue < 1))
    issues.push({ step: 4, text: 'Put at least 1 point in every profession skill and your defining skill.' })
  if (c.profession === 'Man-At-Arms' && d.professionSkills.length < PROFESSION_SKILLS['Man-At-Arms'].length + COMBAT_SKILL_PICKS)
    issues.push({ step: 4, text: `Star ${COMBAT_SKILL_PICKS} combat skills to finish the Man-At-Arms skill package.` })
  return issues
}

// Turns the finished draft into a playable sheet: full HP/STA/Luck and the lifepath as life events.
export function finishDraft(d: CreatorDraft): Character {
  const c = structuredClone(d.character)
  const dv = derive(c.stats)
  c.hp = { current: dv.hp, maxOverride: null }
  c.sta = { current: dv.sta, maxOverride: null }
  c.luckCurrent = c.stats.LUCK
  const home = homeLanguageSkill(c.homeland)
  c.skills = { ...c.skills, [home]: Math.max(c.skills[home] ?? 0, HOME_LANGUAGE_VALUE) }
  // The homeland's free +1 (core p. 25).
  const bonus = HOMELAND_BONUS[c.homeland]
  if (bonus) c.skills[slug(bonus)] = (c.skills[slug(bonus)] ?? 0) + 1
  c.skills = Object.fromEntries(Object.entries(c.skills).filter(([, v]) => v > 0))
  const family: LifeEvent[] = []
  for (const f of FAMILY_FIELDS) {
    const text = d.family[f.id].trim()
    if (text) family.push({ id: uid(), when: 'Childhood', kind: f.id === 'friend' ? 'Ally' : 'Family', title: f.label, details: text })
  }
  const decades = d.decades
    .filter((e) => e.title.trim() || e.details.trim())
    .map((e) => ({ id: e.id, when: e.when, kind: e.kind, title: e.title.trim() || e.kind, details: e.details.trim() }))
  c.lifeEvents = [...family, ...decades]
  c.items = c.items.filter((i: Item) => i.name.trim())
  c.createdAt = c.updatedAt = Date.now()
  return c
}

// Takes off everything the old profession's starting gear put on the sheet.
export function clearStartingGear(c: Character): Character {
  let next = c
  const g = PROFESSION_GEAR[c.profession]
  for (const { name } of [...(g?.options ?? []), ...(g?.always ?? []), ...Object.values(GEAR_EXTRAS)]) {
    const e = findEntry(name)
    if (e) next = { ...next, ...removeFromCharacter(next, e, STARTING_GEAR_NOTE) }
  }
  return next
}
