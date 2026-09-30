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

// The ten skills each profession spends its 44 points on. "Language" means the
// character's homeland language and is swapped in when the profession is picked.
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

export function professionSkillIds(profession: string, homeland: string): string[] {
  const lang = LANGUAGE_SKILLS[homelandLanguage(homeland) ?? 'common']
  return (PROFESSION_SKILLS[profession] ?? []).map((n) => (n === 'Language' ? lang : slug(n)))
}

export interface GearOption {
  name: string
  qty?: number
  weight?: number
  fromErrata?: boolean
}

export interface ProfessionGear {
  pick: number
  options: GearOption[]
}

export const PROFESSION_GEAR: Record<string, ProfessionGear> = {
  Bard: {
    pick: 5,
    options: [{ name: 'Lute' }, { name: 'Dagger' }, { name: 'Journal' }, { name: 'Writing kit' }, { name: 'Perfume' }, { name: 'Makeup kit' }, { name: 'Hand mirror' }, { name: 'Fine clothes' }, { name: 'Hooded cloak' }, { name: 'Flask of spirits' }],
  },
  Craftsman: {
    pick: 5,
    options: [{ name: 'Crafting tools', fromErrata: true }, { name: "Tinker's forge" }, { name: 'Alchemy set' }, { name: 'Hand axe' }, { name: 'Dagger' }, { name: 'Sharpening stone' }, { name: 'Diagrams', qty: 3 }, { name: 'Small chest' }, { name: 'Hooded cloak' }, { name: 'Candles', qty: 5 }],
  },
  Criminal: {
    pick: 5,
    options: [{ name: "Thieves' tools" }, { name: 'Dagger' }, { name: 'Stiletto' }, { name: 'Hand crossbow' }, { name: 'Disguise kit' }, { name: 'Forgery kit' }, { name: 'Garrote' }, { name: 'Grappling hook' }, { name: 'Hooded cloak' }, { name: 'Dark clothes' }],
  },
  Doctor: {
    pick: 5,
    options: [{ name: "Surgeon's kit", fromErrata: true }, { name: 'Alchemy set' }, { name: 'Dagger' }, { name: 'Sterilizing fluid', qty: 5 }, { name: 'Numbing herbs', qty: 5 }, { name: 'Bandages', qty: 10 }, { name: 'Journal' }, { name: 'Lantern' }, { name: 'Hourglass' }, { name: 'Hooded cloak' }],
  },
  Mage: {
    pick: 5,
    options: [{ name: 'Staff' }, { name: 'Dagger' }, { name: 'Alchemy set' }, { name: 'Ritual components' }, { name: 'Writing kit' }, { name: 'Journal' }, { name: 'Hand mirror' }, { name: 'Perfume' }, { name: 'Fine clothes' }, { name: 'Makeup kit' }],
  },
  'Man-At-Arms': {
    pick: 5,
    options: [{ name: 'Arming sword' }, { name: 'Mace' }, { name: 'Spear' }, { name: 'Hand axe' }, { name: 'Crossbow and bolts' }, { name: 'Kite shield' }, { name: 'Gambeson' }, { name: 'Brigandine' }, { name: 'Dagger' }, { name: 'Bedroll' }],
  },
  Merchant: {
    pick: 5,
    options: [{ name: 'Writing kit' }, { name: 'Ledger' }, { name: 'Dagger' }, { name: 'Hand crossbow' }, { name: 'Fine clothes' }, { name: 'Lock box' }, { name: 'Scales' }, { name: 'Pack mule' }, { name: 'Bottle of wine', qty: 2 }, { name: 'Hooded cloak' }],
  },
  Priest: {
    pick: 5,
    options: [{ name: 'Holy symbol' }, { name: 'Staff' }, { name: 'Dagger' }, { name: 'Ritual components' }, { name: 'Journal' }, { name: 'Candles', qty: 5 }, { name: 'Incense' }, { name: 'Bandages', qty: 10 }, { name: 'Herbal remedies', qty: 3 }, { name: 'Hooded cloak' }],
  },
  Witcher: {
    pick: 5,
    options: [{ name: 'Steel sword' }, { name: 'Silver sword' }, { name: 'Witcher medallion' }, { name: 'Alchemy set' }, { name: 'Throwing knives', qty: 5 }, { name: 'Hand crossbow' }, { name: 'Brigandine' }, { name: 'Armored trousers' }, { name: 'Horse' }, { name: 'Bedroll' }],
  },
}

// Starting-gear items are tagged in their notes so the creator can find and untick them.
export const STARTING_GEAR_NOTE = 'Starting gear'
