import { slug } from '../rules/rules'

// Presets for the guided creator so players pick instead of typing.
// The project has the core v4 errata and the Easy Mode quickstart, not the core rulebook.
// Racial perks are sourced (see RACE_PERKS). Homelands, schools, profession skill lists and
// starting gear are from memory of the core book and UNVERIFIED: check them against the book.
// Everything stays editable in the creator.

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

export const HOMELANDS: HomelandGroup[] = [
  {
    region: 'Northern Kingdoms',
    language: 'common',
    homelands: ['Aedirn', 'Cidaris', 'Cintra', 'Kaedwen', 'Kovir & Poviss', 'Lyria & Rivia', 'Redania', 'Skellige', 'Temeria', 'Verden'],
  },
  {
    region: 'Nilfgaardian Empire',
    language: 'elder',
    homelands: ['Angren', 'Ebbing', 'Etolia', 'Gemmera', 'Gheso', 'Heart of Nilfgaard', 'Mag Turga', 'Maecht', 'Mettina', 'Nazair', 'Toussaint', 'Vicovaro'],
  },
  { region: 'Elderlands', language: 'elder', homelands: ['Dol Blathanna'] },
  { region: 'Elderlands', language: 'dwarven', homelands: ['Mahakam'] },
]

export function homelandLanguage(homeland: string): Language | null {
  return HOMELANDS.find((g) => g.homelands.includes(homeland))?.language ?? null
}

// Where each race usually comes from, picked for them when they choose the race.
export const DEFAULT_HOMELAND: Record<string, string> = {
  Elf: 'Dol Blathanna',
  Dwarf: 'Mahakam',
}

export const WITCHER_SCHOOLS = ['Wolf', 'Cat', 'Griffin', 'Viper', 'Bear', 'Manticore']

export interface RacePerk {
  name: string
  text: string
  // Where the text comes from. Missing: from memory of the core book, unverified.
  source?: 'errata' | 'easy-mode'
}

// Human, elf, dwarf and witcher perks as printed on the Easy Mode pregenerated characters, except
// Dwarf Tough, which follows the core errata (p. 23) because Easy Mode simplifies it.
export const RACE_PERKS: Record<string, RacePerk[]> = {
  Human: [
    { name: 'Trustworthy', text: 'Mild (+1) bonus to Charisma, Seduction and Persuasion checks against other humans.', source: 'easy-mode' },
    { name: 'Ingenuity', text: '+1 to Deduction.', source: 'easy-mode' },
    {
      name: 'Blindly Stubborn',
      text: 'Up to 3 times a session, re-roll a failed Resist Coercion or Courage check and take the higher roll.',
      source: 'easy-mode',
    },
  ],
  Elf: [
    { name: 'Artistic', text: '+1 to Fine Arts.', source: 'easy-mode' },
    { name: 'Marksman', text: '+2 to Archery (can raise it above the starting cap); draw and string a bow without taking an action.', source: 'easy-mode' },
    { name: 'Natural Attunement', text: 'Animals are not disturbed by elves: beasts treat them as friendly and will not attack unless provoked.', source: 'easy-mode' },
  ],
  Dwarf: [
    { name: 'Tough', text: '+2 SP to every location, on top of armor and never ablated.', source: 'errata' },
    { name: 'Strong', text: '+1 to Physique.', source: 'easy-mode' },
    { name: "Crafter's Eye", text: '+1 to Business; hard to bluff on appraisals.', source: 'easy-mode' },
  ],
  Witcher: [
    { name: 'Enhanced Senses', text: 'No penalties from dim light, +1 to Awareness, and can track by scent alone.', source: 'easy-mode' },
    { name: 'Resilient Mutations', text: 'Immune to diseases and able to use mutagens.', source: 'easy-mode' },
    { name: 'Lightning Reflexes', text: '+1 REF and +1 DEX, which can go above 10.', source: 'easy-mode' },
    { name: 'Dulled Emotions', text: 'No Courage checks against Intimidation, but -4 EMP (not below 1).', source: 'easy-mode' },
  ],
}

export function perksText(race: string): string {
  return (RACE_PERKS[race] ?? []).map((p) => `${p.name}: ${p.text}`).join('\n')
}

// UNVERIFIED (from memory of the core book). The ten skills each profession spends its 44 points on. "Language" is a second
// language beside the home one, swapped in when the profession is picked.
export const PROFESSION_SKILLS: Record<string, string[]> = {
  Bard: ['Charisma', 'Deceit', 'Fine Arts', 'Human Perception', 'Language', 'Performance', 'Persuasion', 'Seduction', 'Social Etiquette', 'Streetwise'],
  Craftsman: ['Alchemy', 'Awareness', 'Business', 'Crafting', 'Education', 'Endurance', 'Fine Arts', 'Physique', 'Streetwise', 'Trap Crafting'],
  Criminal: ['Athletics', 'Awareness', 'Deceit', 'Forgery', 'Intimidation', 'Pick Lock', 'Sleight of Hand', 'Small Blades', 'Stealth', 'Streetwise'],
  Doctor: ['Alchemy', 'Business', 'Charisma', 'Deduction', 'Endurance', 'First Aid', 'Human Perception', 'Resist Coercion', 'Small Blades', 'Social Etiquette'],
  Mage: ['Awareness', 'Education', 'Grooming and Style', 'Hex Weaving', 'Human Perception', 'Resist Magic', 'Ritual Crafting', 'Social Etiquette', 'Spell Casting', 'Staff/Spear'],
  'Man-At-Arms': ['Athletics', 'Brawling', 'Crossbow', 'Dodge/Escape', 'Endurance', 'Intimidation', 'Melee', 'Riding', 'Swordsmanship', 'Wilderness Survival'],
  Merchant: ['Awareness', 'Business', 'Education', 'Gambling', 'Human Perception', 'Language', 'Persuasion', 'Resist Coercion', 'Social Etiquette', 'Streetwise'],
  Priest: ['Charisma', 'Courage', 'First Aid', 'Hex Weaving', 'Human Perception', 'Leadership', 'Ritual Crafting', 'Social Etiquette', 'Spell Casting', 'Wilderness Survival'],
  Witcher: ['Alchemy', 'Athletics', 'Awareness', 'Deduction', 'Dodge/Escape', 'Riding', 'Spell Casting', 'Stealth', 'Swordsmanship', 'Wilderness Survival'],
}

// v4 errata p.49: characters start fluent in their homeland language at +8, for free.
export const HOME_LANGUAGE_VALUE = 8

export function homeLanguageSkill(homeland: string): string {
  return LANGUAGE_SKILLS[homelandLanguage(homeland) ?? 'common']
}

// The home language is already +8, so a profession's "Language" skill means a second one.
export function secondLanguageSkill(homeland: string): string {
  return homelandLanguage(homeland) === 'common' || !homelandLanguage(homeland) ? LANGUAGE_SKILLS.elder : LANGUAGE_SKILLS.common
}

export function professionSkillIds(profession: string, homeland: string): string[] {
  const lang = secondLanguageSkill(homeland)
  return (PROFESSION_SKILLS[profession] ?? []).map((n) => (n === 'Language' ? lang : slug(n)))
}

// UNVERIFIED (from memory of the core book). Each profession picks a number of these for free. Names match entries in the item catalog (catalog.ts).
export interface ProfessionGear {
  pick: number
  options: string[]
}

export const PROFESSION_GEAR: Record<string, ProfessionGear> = {
  Bard: { pick: 5, options: ['Lute', 'Dagger', 'Journal', 'Writing Kit', 'Perfume', 'Makeup Kit', 'Hand mirror', 'Fine clothes', 'Hooded cloak', 'Flask of spirits'] },
  Craftsman: { pick: 5, options: ['Crafting Tools', "Tinker's Forge", 'Alchemy Set', 'Hand Axe', 'Dagger', 'Sharpening stone', 'Diagrams', 'Small chest', 'Hooded cloak', 'Candles'] },
  Criminal: { pick: 5, options: ["Thieves' Tools", 'Dagger', 'Stiletto', 'Hand Crossbow', 'Disguise Kit', 'Forgery Kit', 'Garrote', 'Grappling hook', 'Hooded cloak', 'Dark clothes'] },
  Doctor: { pick: 5, options: ["Surgeon's Kit", 'Alchemy Set', 'Dagger', 'Sterilizing fluid', 'Numbing herbs', 'Bandages', 'Journal', 'Lantern', 'Hourglass', 'Hooded cloak'] },
  Mage: { pick: 5, options: ['Staff', 'Dagger', 'Alchemy Set', 'Ritual components', 'Writing Kit', 'Journal', 'Hand mirror', 'Perfume', 'Fine clothes', 'Makeup Kit'] },
  'Man-At-Arms': { pick: 5, options: ['Arming Sword', 'Mace', 'Spear', 'Hand Axe', 'Crossbow', 'Kite Shield', 'Gambeson', 'Brigandine', 'Dagger', 'Bedroll'] },
  Merchant: { pick: 5, options: ['Writing Kit', "Merchant's Tools", 'Dagger', 'Hand Crossbow', 'Fine clothes', 'Lock box', 'Scales', 'Mule', 'Bottle of wine', 'Hooded cloak'] },
  Priest: { pick: 5, options: ['Holy symbol', 'Staff', 'Dagger', 'Ritual components', 'Journal', 'Candles', 'Herbal remedies', 'Bandages', 'Hooded cloak', 'Traveling clothes'] },
  Witcher: { pick: 5, options: ['Witcher Steel Sword', 'Witcher Silver Sword', 'Witcher medallion', 'Alchemy Set', 'Throwing Knife', 'Hand Crossbow', 'Brigandine', 'Armored Trousers', 'Horse', 'Bedroll'] },
}

// Starting-gear items are tagged in their notes so the creator can find and untick them.
export const STARTING_GEAR_NOTE = 'Starting gear'
