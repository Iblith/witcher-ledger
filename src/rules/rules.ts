// Core rules data for The Witcher TTRPG (R. Talsorian).
//
// Source: the core rulebook (v1.35, third printing, which already carries the errata), cited by
// page. The v4 errata and A Witcher's Journal fill in where noted. Anything still marked UNVERIFIED
// is not settled by those books.

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
  // Difficult skills cost 2 points per level (core p. 49, marked "(2)" in the list).
  difficult?: boolean
}

// The skill list and each skill's governing stat: core p. 49.
const s = (stat: StatKey, names: string[]): SkillDef[] =>
  names.map((name) => ({ id: slug(name), name, stat, ...(DIFFICULT.has(name) || name.startsWith('Language') ? { difficult: true } : {}) }))

const DIFFICULT = new Set(['Monster Lore', 'Tactics', 'Alchemy', 'Crafting', 'Trap Crafting', 'Hex Weaving', 'Spell Casting', 'Resist Magic', 'Ritual Crafting'])

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
  // The stat the defining skill rolls with.
  definingStat: StatKey
  // Starting Vigor Threshold.
  vigor: number
  page: number
}

// Defining skills, their stats and Vigor: core p. 38-46.

export const PROFESSIONS: ProfessionDef[] = [
  { name: 'Bard', definingSkill: 'Busking', definingStat: 'EMP', vigor: 0, page: 38 },
  { name: 'Craftsman', definingSkill: 'Patch Job', definingStat: 'CRA', vigor: 0, page: 39 },
  { name: 'Criminal', definingSkill: 'Practiced Paranoia', definingStat: 'INT', vigor: 0, page: 40 },
  { name: 'Doctor', definingSkill: 'Healing Hands', definingStat: 'CRA', vigor: 0, page: 41 },
  { name: 'Mage', definingSkill: 'Magic Training', definingStat: 'INT', vigor: 5, page: 42 },
  { name: 'Man-At-Arms', definingSkill: 'Tough As Nails', definingStat: 'BODY', vigor: 0, page: 43 },
  { name: 'Merchant', definingSkill: 'Well Traveled', definingStat: 'INT', vigor: 0, page: 44 },
  { name: 'Priest', definingSkill: 'Initiate of the Gods', definingStat: 'EMP', vigor: 2, page: 45 },
  { name: 'Witcher', definingSkill: 'Witcher Training', definingStat: 'INT', vigor: 2, page: 46 },
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

// Physical table (core p. 48): HP, STA, REC and Stun key off (BODY + WILL) / 2, rounded down.
// HP = STA = 5 × base, REC = base, Stun = base capped at 10. Run = SPD × 3 and Leap = Run / 5 (p. 47),
// Enc = BODY × 10 (p. 48), Punch and Kick from the Hand to Hand table (p. 48), Wound Threshold =
// max HP / 5 (p. 156) and Resolve = (WILL + INT) / 2 × 5 (Verbal Combat, p. 176).
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

// Character creation: skills start capped at 6, and 10 once play begins; racial perks can go past
// either (core p. 49).
export const SKILL_CAP_AT_CREATION = 6
export const SKILL_CAP = 10
