import { slug } from '../rules/rules'

// Presets for the guided creator so players pick instead of typing. Everything here is from the
// core rulebook (page cited per block) and stays editable in the creator.

export const LANGUAGE_SKILLS = {
  common: 'language-common-speech',
  elder: 'language-elder-speech',
  dwarven: 'language-dwarven',
} as const
export type Language = keyof typeof LANGUAGE_SKILLS

export const LANGUAGE_NAMES: Record<Language, string> = {
  common: 'Common Speech',
  elder: 'Elder Speech',
  dwarven: 'Dwarven',
}

export interface HomelandGroup {
  region: string
  language: Language
  homelands: string[]
}

// Lifepath homelands (core p. 25). Northerners speak Common Speech; Nilfgaard, Dol Blathanna and
// Skellige speak Elder Speech; Mahakam speaks Dwarven (p. 49). Cintra is a Northern origin.
export const HOMELANDS: HomelandGroup[] = [
  {
    region: 'Northern Kingdoms',
    language: 'common',
    homelands: ['Redania', 'Kaedwen', 'Temeria', 'Aedirn', 'Lyria & Rivia', 'Kovir & Poviss', 'Cidaris', 'Verden', 'Cintra'],
  },
  { region: 'Northern Kingdoms', language: 'elder', homelands: ['Skellige'] },
  {
    region: 'Nilfgaardian Empire',
    language: 'elder',
    homelands: ['Heart of Nilfgaard', 'Vicovaro', 'Angren', 'Nazair', 'Mettina', 'Mag Turga', 'Gheso', 'Ebbing', 'Maecht', 'Gemmera', 'Etolia'],
  },
  { region: 'Elderlands', language: 'elder', homelands: ['Dol Blathanna'] },
  { region: 'Elderlands', language: 'dwarven', homelands: ['Mahakam'] },
]

// The free +1 each homeland gives (core p. 25).
export const HOMELAND_BONUS: Record<string, string> = {
  Redania: 'Education',
  Kaedwen: 'Endurance',
  Temeria: 'Charisma',
  Aedirn: 'Crafting',
  'Lyria & Rivia': 'Resist Coercion',
  'Kovir & Poviss': 'Business',
  Skellige: 'Courage',
  Cidaris: 'Sailing',
  Verden: 'Wilderness Survival',
  Cintra: 'Human Perception',
  'Heart of Nilfgaard': 'Deceit',
  Vicovaro: 'Education',
  Angren: 'Wilderness Survival',
  Nazair: 'Brawling',
  Mettina: 'Riding',
  'Mag Turga': 'Endurance',
  Gheso: 'Stealth',
  Ebbing: 'Deduction',
  Maecht: 'Charisma',
  Gemmera: 'Intimidation',
  Etolia: 'Courage',
  'Dol Blathanna': 'Social Etiquette',
  Mahakam: 'Crafting',
}

export function homelandLanguage(homeland: string): Language | null {
  return HOMELANDS.find((g) => g.homelands.includes(homeland))?.language ?? null
}

// Where each race usually comes from, picked for them when they choose the race.
export const DEFAULT_HOMELAND: Record<string, string> = {
  Elf: 'Dol Blathanna',
  Dwarf: 'Mahakam',
}

// The five schools and what each gives (core p. 238).
export const WITCHER_SCHOOLS = ['Wolf', 'Gryphon', 'Cat', 'Viper', 'Bear']
export const SCHOOL_PERKS: Record<string, string> = {
  Wolf: 'No penalty for Strong Strikes',
  Gryphon: '+2 Vigor Threshold',
  Cat: 'Immune to non-magical charm attempts',
  Viper: 'No penalties for dual wielding',
  Bear: '-2 to overall armor penalty',
}

export interface RacePerk {
  name: string
  text: string
}

// Racial perks: core p. 22-24.
export const RACE_PERKS: Record<string, RacePerk[]> = {
  Human: [
    { name: 'Trustworthy', text: '+1 to Charisma, Seduction and Persuasion checks against other humans.' },
    { name: 'Ingenuity', text: '+1 to Deduction.' },
    {
      name: 'Blindly Stubborn',
      text: 'Reroll a failed Resist Coercion or Courage roll 3 times per session and take the higher roll; a reroll that still fails cannot be rerolled again.',
    },
  ],
  Elf: [
    { name: 'Artistic', text: '+1 to Fine Arts.' },
    { name: 'Marksman', text: '+2 to Archery, which can go past the skill cap; draw and string a bow without taking an action.' },
    {
      name: 'Natural Attunement',
      text: "Beasts are friendly and won't attack unless provoked; automatically finds any commonly available (or lower) plant substance that grows in the area.",
    },
  ],
  Dwarf: [
    { name: 'Tough', text: 'Natural SP 2 on top of any armor, never lowered by weapon attacks or ablation.' },
    { name: 'Strong', text: '+1 to Physique and +25 Encumbrance.' },
    { name: "Crafter's Eye", text: '+1 to Business; hard to bluff.' },
  ],
  Witcher: [
    { name: 'Enhanced Senses', text: 'No penalties in dim light, +1 to Awareness, and can track by scent alone.' },
    { name: 'Resilient Mutation', text: 'Immune to diseases and able to use mutagens.' },
    { name: 'Lightning Reflexes', text: '+1 REF and +1 DEX, which can go past 10.' },
    { name: 'Dulled Emotions', text: 'No Courage checks against Intimidation; -4 EMP (not below 1), and EMP can never go above 6.' },
  ],
}

export function perksText(race: string): string {
  return (RACE_PERKS[race] ?? []).map((p) => `${p.name}: ${p.text}`).join('\n')
}

// The ten skills of each profession's skill package (core p. 38-46). "Language" is a language
// beside the home one; a Merchant's package has two. A Man-At-Arms picks five of COMBAT_SKILLS on
// top of the five listed.
export const PROFESSION_SKILLS: Record<string, string[]> = {
  Bard: ['Charisma', 'Deceit', 'Performance', 'Language', 'Human Perception', 'Persuasion', 'Streetwise', 'Fine Arts', 'Seduction', 'Social Etiquette'],
  Craftsman: ['Athletics', 'Alchemy', 'Business', 'Crafting', 'Education', 'Endurance', 'Fine Arts', 'Persuasion', 'Physique', 'Streetwise'],
  Criminal: ['Athletics', 'Awareness', 'Deceit', 'Forgery', 'Intimidation', 'Pick Lock', 'Sleight of Hand', 'Small Blades', 'Stealth', 'Streetwise'],
  Doctor: ['Alchemy', 'Business', 'Charisma', 'Courage', 'Deduction', 'Human Perception', 'Resist Coercion', 'Small Blades', 'Social Etiquette', 'Wilderness Survival'],
  Mage: ['Education', 'Grooming and Style', 'Hex Weaving', 'Human Perception', 'Resist Magic', 'Ritual Crafting', 'Seduction', 'Social Etiquette', 'Spell Casting', 'Staff/Spear'],
  'Man-At-Arms': ['Courage', 'Dodge/Escape', 'Intimidation', 'Physique', 'Wilderness Survival'],
  Merchant: ['Business', 'Charisma', 'Education', 'Gambling', 'Human Perception', 'Language', 'Language', 'Persuasion', 'Resist Coercion', 'Small Blades', 'Streetwise'],
  Priest: ['Charisma', 'Courage', 'First Aid', 'Hex Weaving', 'Human Perception', 'Leadership', 'Ritual Crafting', 'Spell Casting', 'Teaching', 'Wilderness Survival'],
  Witcher: ['Alchemy', 'Athletics', 'Awareness', 'Deduction', 'Dodge/Escape', 'Riding', 'Spell Casting', 'Stealth', 'Swordsmanship', 'Wilderness Survival'],
}

// "Any 5 Combat Skills" for a Man-At-Arms (core p. 43); other skills by GM agreement.
export const COMBAT_SKILLS = ['Archery', 'Athletics', 'Brawling', 'Crossbow', 'Melee', 'Riding', 'Small Blades', 'Staff/Spear', 'Swordsmanship', 'Tactics']
export const COMBAT_SKILL_PICKS = 5

// Characters start fluent in their homeland language at +8, for free (core p. 49).
export const HOME_LANGUAGE_VALUE = 8

export function homeLanguageSkill(homeland: string): string {
  return LANGUAGE_SKILLS[homelandLanguage(homeland) ?? 'common']
}

// The home language is already +8, so a profession's "Language" skill means another one: the first
// of the other two languages, then the second for a Merchant's two.
export function otherLanguageSkills(homeland: string): string[] {
  const home = homelandLanguage(homeland) ?? 'common'
  const order: Language[] = home === 'common' ? ['elder', 'dwarven'] : home === 'elder' ? ['common', 'dwarven'] : ['common', 'elder']
  return order.map((l) => LANGUAGE_SKILLS[l])
}

export function secondLanguageSkill(homeland: string): string {
  return otherLanguageSkills(homeland)[0]
}

export function professionSkillIds(profession: string, homeland: string): string[] {
  const langs = otherLanguageSkills(homeland)
  let n = 0
  return (PROFESSION_SKILLS[profession] ?? []).map((name) => (name === 'Language' ? langs[Math.min(n++, langs.length - 1)] : slug(name)))
}

// Starting gear (core p. 38-46): pick a number of the options; `always` comes with the profession
// (a Merchant's cart, a witcher's swords and formulae). Names match entries in the item catalog
// (catalog.ts); qty overrides the catalog's bundle size.
export interface GearOption {
  name: string
  qty?: number
}

export interface ProfessionGear {
  pick: number
  options: GearOption[]
  always?: GearOption[]
}

const o = (name: string, qty?: number): GearOption => (qty ? { name, qty } : { name })

export const PROFESSION_GEAR: Record<string, ProfessionGear> = {
  Bard: {
    pick: 5,
    options: [o('Dice Poker Board'), o('Gwent Deck'), o('Hand Mirror'), o('Instrument'), o('Spirits'), o('Dagger'), o('Perfume/Cologne'), o('Belt Pouch'), o('Sheath, Garter'), o('Journal with a lock')],
  },
  Craftsman: {
    pick: 5,
    options: [o('Crafting components (50 crowns)'), o('Alchemy Set'), o('Crafting Tools'), o('Hourglass'), o('Iron Long Sword'), o('Lock'), o('Mace'), o("Merchant's Tools"), o('Wooden Chest'), o("Tinker's Forge")],
  },
  Criminal: {
    pick: 5,
    options: [o('Brass Knuckles'), o('Lantern, Bullseye'), o('Chloroform'), o('Loaded Dice'), o('Satchel'), o('Secret Pocket'), o('Sheath, Sleeve'), o('Stiletto'), o("Thieves' Tools"), o('Throwing Knife', 5)],
  },
  Doctor: {
    pick: 5,
    options: [o('Blanket'), o('Candles (x5)', 2), o('Clotting Powder', 10), o('Dagger'), o('Hourglass'), o('Tent, Large'), o('Numbing Herbs', 10), o('Sterilizing Fluid', 10), o("Surgeon's Kit"), o('Writing Kit')],
  },
  Mage: {
    pick: 5,
    options: [o('Magical components (100 crowns)'), o('Belt Pouch'), o('Dagger'), o('Sheath, Garter'), o('Hand Mirror'), o('Hourglass'), o('Journal/Ledger'), o('Makeup Kit'), o('Staff'), o('Writing Kit')],
  },
  'Man-At-Arms': {
    pick: 5,
    options: [o('Armored Trousers'), o('Battle Axe'), o('Brigandine'), o('Chain Coif'), o('Crossbow'), o('Kord'), o('Satchel'), o('Spear'), o('Steel Buckler'), o('Throwing Knife', 5)],
  },
  Merchant: {
    pick: 3,
    options: [o('Crossbow'), o('Dagger'), o('Journal/Ledger'), o('Tent, Large'), o("Merchant's Tools"), o('Writing Kit')],
    always: [o('Mule'), o('Cart'), o('Trade goods (1000 crowns)')],
  },
  Priest: {
    pick: 5,
    options: [o('Ritual components (100 crowns)'), o('Alchemy Set'), o('Clotting Powder', 5), o('Dagger'), o('Holy Symbol'), o('Hourglass'), o('Numbing Herbs', 5), o('Staff'), o('Sterilizing Fluid', 5), o("Surgeon's Kit")],
  },
  Witcher: {
    pick: 2,
    options: [o('Alchemy Set'), o('Double Woven Gambeson'), o('Hand Crossbow'), o('Horse'), o('Throwing Knife', 5)],
    always: [o("Witcher's Steel Sword"), o("Witcher's Silver Sword"), o('Witcher Medallion'), o('Decoction formula'), o('Oil formula', 2), o('Potion formula', 2)],
  },
}

// The crossbows in the gear lists come with 20 bolts (core p. 43-44).
// Packs: the book's "bolts x20" (p. 43-44) is two Bolts (x10), "candles x10" (p. 41) two Candles (x5).
export const GEAR_EXTRAS: Record<string, GearOption> = { Crossbow: o('Bolts (x10)', 2) }

// Starting-gear items are tagged in their notes so the creator can find and untick them.
export const STARTING_GEAR_NOTE = 'Starting gear'
