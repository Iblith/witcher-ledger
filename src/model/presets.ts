import { slug } from '../rules/rules'

// Presets for the guided creator so players pick instead of typing.
// The project only has the v4 errata, not the core rulebook. Anything marked
// `fromErrata` is confirmed there; the rest is from memory of the core book and
// should be checked against it. Everything stays editable in the creator.

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
  fromErrata?: boolean
}

export const RACE_PERKS: Record<string, RacePerk[]> = {
  Human: [
    { name: 'Trustworthy', text: 'People tend to trust humans; bonus to social skills with other humans.' },
    { name: 'Ingenuity', text: '+1 to Deduction.' },
    { name: 'Blindly Stubborn', text: 'Hard to talk out of a course of action once set on it.' },
  ],
  Elf: [
    { name: 'Artistic', text: '+1 to Fine Arts.' },
    { name: 'Marksman', text: '+2 to Archery; can raise it above the starting cap.', fromErrata: true },
    { name: 'Natural Attunement', text: 'Beasts are not hostile unless provoked; finds plants and herbs easily.' },
  ],
  Dwarf: [
    { name: 'Tough', text: '+2 SP to every location, on top of armor and never ablated.', fromErrata: true },
    { name: 'Strong', text: 'Extra Encumbrance.' },
    { name: 'Crafty', text: '+1 to Business.' },
  ],
  Witcher: [
    { name: 'Enhanced Senses', text: 'No penalty in dim light; can track by scent.' },
    { name: 'Resilient Mutation', text: 'Immune to disease, resistant to poison and toxicity.' },
    { name: 'Lightning Reflexes', text: '+1 REF and +1 DEX, which can go above the usual maximum.' },
    { name: 'Dulled Emotions', text: 'Emotions are muted, which makes most people uneasy.' },
  ],
}

export function perksText(race: string): string {
  return (RACE_PERKS[race] ?? []).map((p) => `${p.name}: ${p.text}`).join('\n')
}

// The ten skills each profession spends its 44 points on. "Language" is a second
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

// Each profession picks a number of these for free. Names match entries in the item catalog (catalog.ts).
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
