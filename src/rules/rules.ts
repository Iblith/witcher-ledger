// Core rules data for The Witcher TTRPG (R. Talsorian).
//
// Sources in the project (no core rulebook): the core v4 errata, the Easy Mode quickstart and
// A Witcher's Journal. What each one settles is noted next to the data. Anything marked
// UNVERIFIED is from memory of the core book and should be checked against it.

export const STAT_KEYS = ['INT', 'REF', 'DEX', 'BODY', 'SPD', 'EMP', 'CRA', 'WILL', 'LUCK'] as const
export type StatKey = (typeof STAT_KEYS)[number]

export const STAT_NAMES: Record<StatKey, string> = {
  INT: 'Intelligence',
  REF: 'Reflex',
  DEX: 'Dexterity',
  BODY: 'Body',
  SPD: 'Speed',
  EMP: 'Empathy',
  CRA: 'Craft',
  WILL: 'Will',
  LUCK: 'Luck',
}

export interface SkillDef {
  id: string
  name: string
  stat: StatKey
  // Listed with this governing stat in Easy Mode (p. 14-15). False: the skill and its stat are
  // from memory of the core book.
  sourced: boolean
}

// The skills Easy Mode lists, with the stat it gives each. Alchemy is the one disagreement: Easy Mode
// says INT, but the core book (from memory, unverified) puts it under CRA, and this app keeps CRA.
const EASY_MODE_SKILLS = new Set([
  'Alchemy', 'Archery', 'Athletics', 'Awareness', 'Brawling', 'Business', 'Courage', 'Crafting', 'Crossbow', 'Deceit',
  'Deduction', 'Disguise', 'Dodge/Escape', 'Education', 'Endurance', 'First Aid', 'Gambling', 'Human Perception',
  'Intimidation', 'Melee', 'Monster Lore', 'Performance', 'Persuasion', 'Pick Lock', 'Riding', 'Physique',
  'Resist Coercion', 'Resist Magic', 'Seduction', 'Sleight of Hand', 'Small Blades', 'Social Etiquette',
  'Spell Casting', 'Staff/Spear', 'Stealth', 'Streetwise', 'Swordsmanship', 'Tactics', 'Wilderness Survival',
])

const s = (stat: StatKey, names: string[]): SkillDef[] =>
  names.map((name) => ({ id: slug(name), name, stat, sourced: EASY_MODE_SKILLS.has(name) && name !== 'Alchemy' }))

export function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const SKILLS: SkillDef[] = [
  ...s('INT', [
    'Awareness',
    'Business',
    'Deduction',
    'Education',
    'Language: Common Speech',
    'Language: Elder Speech',
    'Language: Dwarven',
    'Monster Lore',
    'Social Etiquette',
    'Streetwise',
    'Tactics',
    'Teaching',
    'Wilderness Survival',
  ]),
  ...s('REF', [
    'Brawling',
    'Dodge/Escape',
    'Melee',
    'Riding',
    'Sailing',
    'Small Blades',
    'Staff/Spear',
    'Swordsmanship',
  ]),
  ...s('DEX', ['Archery', 'Athletics', 'Crossbow', 'Sleight of Hand', 'Stealth']),
  ...s('BODY', ['Physique', 'Endurance']),
  ...s('EMP', [
    'Charisma',
    'Deceit',
    'Fine Arts',
    'Gambling',
    'Grooming and Style',
    'Human Perception',
    'Leadership',
    'Persuasion',
    'Performance',
    'Seduction',
  ]),
  ...s('CRA', ['Alchemy', 'Crafting', 'Disguise', 'First Aid', 'Forgery', 'Pick Lock', 'Trap Crafting']),
  ...s('WILL', [
    'Courage',
    'Hex Weaving',
    'Intimidation',
    'Spell Casting',
    'Resist Magic',
    'Resist Coercion',
    'Ritual Crafting',
  ]),
]

export const SKILL_BY_ID: Record<string, SkillDef> = Object.fromEntries(SKILLS.map((k) => [k.id, k]))

export const RACES = ['Human', 'Elf', 'Dwarf', 'Witcher', 'Monster', 'Other'] as const

export interface ProfessionDef {
  name: string
  definingSkill: string
  // Starting Vigor Threshold. Easy Mode pregens confirm Witcher 2, Mage 5 and 0 for Bard, Criminal,
  // Doctor and Man-At-Arms. Craftsman, Merchant and Priest are UNVERIFIED.
  vigor: number
}

export const PROFESSIONS: ProfessionDef[] = [
  { name: 'Bard', definingSkill: 'Busking', vigor: 0 },
  { name: 'Craftsman', definingSkill: 'Patch Job', vigor: 0 },
  { name: 'Criminal', definingSkill: 'Practiced Paranoia', vigor: 0 },
  { name: 'Doctor', definingSkill: 'Healing Hands', vigor: 0 },
  { name: 'Mage', definingSkill: 'Magical Training', vigor: 5 },
  { name: 'Man-At-Arms', definingSkill: 'Tough As Nails', vigor: 0 },
  { name: 'Merchant', definingSkill: 'Well Traveled', vigor: 0 },
  { name: 'Priest', definingSkill: 'Initiate of the Gods', vigor: 2 },
  { name: 'Witcher', definingSkill: 'Witcher Training', vigor: 2 },
]

export const HIT_LOCATIONS = ['head', 'torso', 'rArm', 'lArm', 'rLeg', 'lLeg'] as const
export type HitLocation = (typeof HIT_LOCATIONS)[number]

export const HIT_LOCATION_NAMES: Record<HitLocation, string> = {
  head: 'Head',
  torso: 'Torso',
  rArm: 'Right arm',
  lArm: 'Left arm',
  rLeg: 'Right leg',
  lLeg: 'Left leg',
}

export type Stats = Record<StatKey, number>

export interface DerivedStats {
  hp: number
  sta: number
  rec: number
  stun: number
  run: number
  leap: number
  enc: number
  resolve: number
  woundThreshold: number
  punch: string
  kick: string
}

// Physical table: everything keys off (BODY + WILL) / 2, rounded down. Checked against the Easy Mode
// pregens and the Journal stat blocks: HP = STA = 5 × base for characters (monsters set their own),
// REC = Stun = base with Stun capped at 10 (errata), Run = SPD × 3, Leap = Run / 5, Enc = BODY × 10,
// and Punch/Kick follow BODY as below. Resolve is UNVERIFIED (not in any source on hand).
// Easy Mode calls Stun "Save".
export function physicalBase(stats: Stats): number {
  return Math.floor((stats.BODY + stats.WILL) / 2)
}

const BODY_DAMAGE: Array<[max: number, punch: string, kick: string]> = [
  [2, '1d6-4', '1d6'],
  [4, '1d6-2', '1d6+2'],
  [6, '1d6', '1d6+4'],
  [8, '1d6+2', '1d6+6'],
  [10, '1d6+4', '1d6+8'],
  [12, '1d6+6', '1d6+10'],
  [Infinity, '1d6+8', '1d6+12'],
]

export function derive(stats: Stats): DerivedStats {
  const base = physicalBase(stats)
  const run = stats.SPD * 3
  const [, punch, kick] = BODY_DAMAGE.find(([max]) => stats.BODY <= max)!
  return {
    hp: base * 5,
    sta: base * 5,
    rec: base,
    stun: Math.min(base, 10),
    run,
    leap: Math.floor(run / 5),
    enc: stats.BODY * 10,
    resolve: Math.floor((stats.WILL + stats.INT) / 2) * 5,
    woundThreshold: base,
    punch,
    kick,
  }
}

// Character creation: skills start capped at 6, and 10 once play begins (race perks can exceed it).
export const SKILL_CAP_AT_CREATION = 6
export const SKILL_CAP = 10
