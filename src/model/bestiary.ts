import { HIT_LOCATIONS, type Stats } from '../rules/rules'
import { newCharacter, uid } from './factory'
import { journalCharacter, JOURNAL_MONSTERS } from './journalBestiary'
import type { Character } from './types'

// Creatures from the core rulebook bestiary, used to seed the GM's NPC list alongside the
// A Witcher's Journal monsters (journalBestiary.ts).
//
// The core rulebook is not in the project, so the numbers below are ESTIMATES for play, not the
// book's stat blocks. `confirmed` lists what the v4 errata itself says about a creature (and `page`
// is set only where the errata cites one). GMs check each entry against their book and correct it
// on the sheet. Creatures the Journal covers (bear, harpy, leshen, troll) were dropped from this
// list in favour of the Journal's stat blocks; see RETIRED_ESTIMATES.

interface Attack {
  name: string
  skill: string
  damage: string
  effect?: string
  range?: string
}

export interface BestiaryDef {
  name: string
  category: string
  threat: string
  page?: number
  confirmed?: string
  // INT REF DEX BODY SPD EMP CRA WILL LUCK
  stats: [number, number, number, number, number, number, number, number, number]
  hp: number
  sta: number
  sp: number
  headSp?: number
  skills: Record<string, number>
  attacks: Attack[]
  abilities: string
  weaknesses: string
}

export const BESTIARY: BestiaryDef[] = [
  {
    name: 'Bandit',
    category: 'Humanoid',
    threat: 'Easy, Simple',
    page: 271,
    confirmed: 'Has Brawling +6 and a hand crossbow with WA +1.',
    stats: [4, 6, 5, 6, 5, 3, 3, 4, 0],
    hp: 30,
    sta: 30,
    sp: 5,
    headSp: 0,
    skills: { awareness: 3, brawling: 6, 'dodge-escape': 3, swordsmanship: 4, crossbow: 3, intimidation: 4, courage: 3 },
    attacks: [
      { name: 'Iron sword', skill: 'swordsmanship', damage: '2d6+2' },
      { name: 'Hand crossbow', skill: 'crossbow', damage: '2d6+2', effect: 'WA +1', range: '50m' },
    ],
    abilities: 'Works in gangs.',
    weaknesses: 'None beyond being human.',
  },
  {
    name: "Scoia'tael archer",
    category: 'Humanoid',
    threat: 'Medium, Simple',
    page: 275,
    confirmed: 'Throwing knives have a range of 20m.',
    stats: [5, 7, 8, 5, 6, 4, 4, 5, 0],
    hp: 25,
    sta: 25,
    sp: 5,
    headSp: 3,
    skills: { archery: 6, 'small-blades': 4, 'dodge-escape': 5, stealth: 6, awareness: 5, 'wilderness-survival': 5, athletics: 4 },
    attacks: [
      { name: 'Elven war bow', skill: 'archery', damage: '4d6', range: '200m' },
      { name: 'Throwing knives', skill: 'athletics', damage: '1d6+2', range: '20m' },
    ],
    abilities: 'Ambush tactics; fights from cover.',
    weaknesses: 'None beyond being an elf.',
  },
  {
    name: 'Drowner',
    category: 'Necrophage',
    threat: 'Easy, Simple',
    stats: [1, 5, 5, 5, 5, 1, 1, 3, 0],
    hp: 25,
    sta: 25,
    sp: 2,
    skills: { melee: 4, 'dodge-escape': 3, awareness: 3, athletics: 3, stealth: 4 },
    attacks: [{ name: 'Claws', skill: 'melee', damage: '2d6', effect: 'ROF 2' }],
    abilities: 'Aquatic: moves and fights underwater without penalty.',
    weaknesses: 'Necrophage oil; Igni; fighting on dry land.',
  },
  {
    name: 'Ghoul',
    category: 'Necrophage',
    threat: 'Easy, Complex',
    page: 278,
    confirmed: 'RUN is 18. Dodges with REF, not DEX (combat example). The errata changes its bite effect.',
    stats: [1, 6, 5, 6, 6, 1, 1, 4, 0],
    hp: 30,
    sta: 30,
    sp: 3,
    skills: { melee: 5, 'dodge-escape': 4, awareness: 4, athletics: 4, stealth: 3 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6', effect: 'ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '2d6', effect: 'Check the errata for the bite effect' },
    ],
    abilities: 'Pack hunter; frenzies when wounded.',
    weaknesses: 'Necrophage oil.',
  },
  {
    name: 'Grave hag',
    category: 'Necrophage',
    threat: 'Medium, Complex',
    stats: [5, 7, 6, 6, 6, 3, 3, 6, 0],
    hp: 45,
    sta: 45,
    sp: 4,
    skills: { melee: 6, 'dodge-escape': 5, awareness: 6, stealth: 6, deceit: 5 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6', effect: 'ROF 2' },
      { name: 'Tongue lash', skill: 'melee', damage: '2d6', range: '4m' },
    ],
    abilities: 'Can take the shape of an old woman.',
    weaknesses: 'Necrophage oil; Igni.',
  },
  {
    name: 'Nekker',
    category: 'Ogroid',
    threat: 'Easy, Simple',
    confirmed: 'Named in the errata’s Ganging Up example (surrounded by four nekkers).',
    stats: [2, 6, 5, 3, 6, 1, 2, 3, 0],
    hp: 15,
    sta: 15,
    sp: 1,
    skills: { melee: 4, 'dodge-escape': 5, athletics: 5, stealth: 5, awareness: 3 },
    attacks: [{ name: 'Claws', skill: 'melee', damage: '1d6+2', effect: 'ROF 2' }],
    abilities: 'Attacks in swarms; burrows.',
    weaknesses: 'Ogroid oil; Dancing Star bombs on their burrows.',
  },
  {
    name: 'Noonwraith',
    category: 'Specter',
    threat: 'Medium, Difficult',
    page: 279,
    confirmed: 'Creates 3 copies at least 5m from its target. Copies use its defense, do not attack, and drain 3 HP a round each from the nearest target to heal it. Hitting a copy kills it.',
    stats: [4, 8, 6, 5, 7, 2, 2, 7, 0],
    hp: 40,
    sta: 40,
    sp: 0,
    skills: { melee: 6, 'dodge-escape': 6, awareness: 5, 'resist-magic': 6 },
    attacks: [{ name: 'Claws', skill: 'melee', damage: '3d6', effect: 'ROF 2' }],
    abilities: 'Incorporeal; takes damage only from silver and magic. Copies (see confirmed).',
    weaknesses: 'Specter oil; Yrden makes it corporeal; Moon Dust.',
  },
  {
    name: 'Nightwraith',
    category: 'Specter',
    threat: 'Medium, Difficult',
    stats: [4, 8, 6, 5, 7, 2, 2, 7, 0],
    hp: 45,
    sta: 45,
    sp: 0,
    skills: { melee: 6, 'dodge-escape': 6, awareness: 6, 'resist-magic': 6 },
    attacks: [{ name: 'Claws', skill: 'melee', damage: '3d6+2', effect: 'ROF 2' }],
    abilities: 'Incorporeal; stronger by moonlight.',
    weaknesses: 'Specter oil; Yrden; Moon Dust.',
  },
  {
    name: 'Wraith',
    category: 'Specter',
    threat: 'Easy, Complex',
    stats: [3, 6, 5, 4, 6, 2, 2, 5, 0],
    hp: 30,
    sta: 30,
    sp: 0,
    skills: { melee: 5, 'dodge-escape': 5, awareness: 4, stealth: 5 },
    attacks: [{ name: 'Blade', skill: 'melee', damage: '2d6+2' }],
    abilities: 'Incorporeal; can fade and reappear.',
    weaknesses: 'Specter oil; Yrden.',
  },
  {
    name: 'Werewolf',
    category: 'Cursed',
    threat: 'Hard, Complex',
    stats: [4, 8, 6, 9, 8, 3, 3, 6, 0],
    hp: 60,
    sta: 60,
    sp: 5,
    skills: { melee: 7, 'dodge-escape': 6, awareness: 7, athletics: 6, stealth: 5 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6+2', effect: 'ROF 2, bleed' },
      { name: 'Bite', skill: 'melee', damage: '4d6' },
    ],
    abilities: 'Regenerates each round; howl to call wolves.',
    weaknesses: 'Cursed oil; Moon Dust stops regeneration.',
  },
  {
    name: 'Siren',
    category: 'Hybrid',
    threat: 'Medium, Complex',
    page: 291,
    confirmed: 'Has Spell Casting +10.',
    stats: [5, 7, 6, 4, 8, 4, 2, 7, 0],
    hp: 30,
    sta: 30,
    sp: 2,
    skills: { melee: 5, 'dodge-escape': 6, awareness: 5, seduction: 7, 'spell-casting': 10 },
    attacks: [{ name: 'Talons', skill: 'melee', damage: '2d6+2', effect: 'ROF 2' }],
    abilities: 'Flight; aquatic; charming song.',
    weaknesses: 'Hybrid oil; Aard grounds it.',
  },
  {
    name: 'Griffin',
    category: 'Hybrid',
    threat: 'Hard, Complex',
    confirmed: 'The errata updates the Griffin decoction, which comes from its mutagen.',
    stats: [4, 8, 6, 10, 9, 2, 2, 6, 0],
    hp: 80,
    sta: 80,
    sp: 8,
    skills: { melee: 7, 'dodge-escape': 6, awareness: 7, athletics: 6 },
    attacks: [
      { name: 'Talons', skill: 'melee', damage: '4d6', effect: 'ROF 2' },
      { name: 'Beak', skill: 'melee', damage: '3d6+2' },
    ],
    abilities: 'Flight; dive attack; territorial.',
    weaknesses: 'Hybrid oil; Aard grounds it; Grapeshot.',
  },
  {
    name: 'Endrega',
    category: 'Insectoid',
    threat: 'Easy, Complex',
    page: 294,
    confirmed: 'Has a bestiary entry on page 294 (art credit in the errata).',
    stats: [1, 6, 5, 5, 6, 1, 1, 4, 0],
    hp: 30,
    sta: 30,
    sp: 6,
    skills: { melee: 5, 'dodge-escape': 4, awareness: 4, athletics: 4 },
    attacks: [{ name: 'Mandibles', skill: 'melee', damage: '2d6+2', effect: 'Poison' }],
    abilities: 'Armored carapace; nests in groups.',
    weaknesses: 'Insectoid oil; fire.',
  },
  {
    name: 'Arachas',
    category: 'Insectoid',
    threat: 'Hard, Complex',
    stats: [2, 6, 5, 10, 5, 1, 1, 6, 0],
    hp: 70,
    sta: 70,
    sp: 12,
    skills: { melee: 6, 'dodge-escape': 3, awareness: 5 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '4d6', effect: 'ROF 2' },
      { name: 'Web spit', skill: 'melee', damage: '—', effect: 'Grapple', range: '10m' },
    ],
    abilities: 'Heavy carapace; webs.',
    weaknesses: 'Insectoid oil; Igni.',
  },
  {
    name: 'Golem',
    category: 'Elementa',
    threat: 'Hard, Difficult',
    page: 299,
    confirmed: 'Its punch has the Ablating effect.',
    stats: [1, 4, 3, 14, 4, 1, 1, 10, 0],
    hp: 120,
    sta: 120,
    sp: 20,
    skills: { brawling: 6, 'dodge-escape': 1, 'resist-magic': 8, courage: 10 },
    attacks: [{ name: 'Punch', skill: 'brawling', damage: '5d6', effect: 'Ablating' }],
    abilities: 'Immune to bleeding, poison and fear. Created and bound by a mage.',
    weaknesses: 'Elementa oil; Dimeritium bombs.',
  },
  {
    name: 'Fiend',
    category: 'Relict',
    threat: 'Hard, Difficult',
    page: 291,
    confirmed: 'Has Spell Casting +15 (the errata cites page 291).',
    stats: [5, 7, 5, 14, 7, 1, 1, 10, 0],
    hp: 120,
    sta: 120,
    sp: 12,
    skills: { melee: 7, 'dodge-escape': 3, awareness: 7, 'spell-casting': 15, 'resist-magic': 8 },
    attacks: [
      { name: 'Antlers', skill: 'melee', damage: '6d6', effect: 'Knockdown' },
      { name: 'Hooves', skill: 'melee', damage: '4d6' },
    ],
    abilities: 'Hypnotic third eye; charge (full round action, per errata).',
    weaknesses: 'Relict oil; Samum bombs blind its eye.',
  },
  {
    name: 'Katakan',
    category: 'Vampire',
    threat: 'Hard, Complex',
    confirmed: 'The errata renames the vampire crafting component (Vampire Fangs).',
    stats: [6, 8, 6, 8, 8, 3, 3, 7, 0],
    hp: 60,
    sta: 60,
    sp: 4,
    skills: { melee: 7, 'dodge-escape': 7, awareness: 7, stealth: 8, athletics: 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6+2', effect: 'ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '3d6', effect: 'Drains blood' },
    ],
    abilities: 'Invisibility; regenerates.',
    weaknesses: 'Vampire oil; Black Blood; Moon Dust.',
  },
  {
    name: 'Ekimmara',
    category: 'Vampire',
    threat: 'Medium, Complex',
    stats: [5, 7, 6, 7, 7, 3, 3, 6, 0],
    hp: 50,
    sta: 50,
    sp: 4,
    skills: { melee: 6, 'dodge-escape': 6, awareness: 6, stealth: 6 },
    attacks: [{ name: 'Claws', skill: 'melee', damage: '3d6', effect: 'ROF 2' }],
    abilities: 'Regenerates; drinks blood.',
    weaknesses: 'Vampire oil; Black Blood; Igni.',
  },
  {
    name: 'Wyvern',
    category: 'Draconid',
    threat: 'Hard, Complex',
    page: 306,
    confirmed: 'Weighs 408kg (errata change from 900kg).',
    stats: [3, 7, 5, 10, 8, 1, 1, 6, 0],
    hp: 80,
    sta: 80,
    sp: 10,
    skills: { melee: 7, 'dodge-escape': 5, awareness: 6, athletics: 5 },
    attacks: [
      { name: 'Bite', skill: 'melee', damage: '4d6' },
      { name: 'Tail sting', skill: 'melee', damage: '3d6', effect: 'Poison' },
    ],
    abilities: 'Flight; dive attack.',
    weaknesses: 'Draconid oil; Aard grounds it; Grapeshot.',
  },
  {
    name: 'Wolf',
    category: 'Beast',
    threat: 'Easy, Simple',
    page: 286,
    confirmed: 'Tamed wolves use these stats (errata, lifepath).',
    stats: [2, 6, 5, 4, 7, 2, 1, 4, 0],
    hp: 20,
    sta: 20,
    sp: 0,
    skills: { melee: 4, 'dodge-escape': 4, awareness: 6, athletics: 5, stealth: 4 },
    attacks: [{ name: 'Bite', skill: 'melee', damage: '2d6', effect: 'Knockdown' }],
    abilities: 'Pack tactics; keen smell.',
    weaknesses: 'Beasts take full damage from steel (no silver needed).',
  },
  {
    name: 'Dog',
    category: 'Beast',
    threat: 'Easy, Simple',
    page: 310,
    confirmed: 'Tamed wild dogs use these stats (errata, lifepath).',
    stats: [2, 5, 5, 3, 6, 3, 1, 3, 0],
    hp: 15,
    sta: 15,
    sp: 0,
    skills: { melee: 3, 'dodge-escape': 3, awareness: 6, athletics: 4 },
    attacks: [{ name: 'Bite', skill: 'melee', damage: '1d6+2' }],
    abilities: 'Keen smell.',
    weaknesses: 'Beasts take full damage from steel (no silver needed).',
  },
]

export const BESTIARY_CATEGORIES = [...new Set(BESTIARY.map((b) => b.category))]

export function bestiaryId(name: string): string {
  return 'bestiary-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const RESISTANCE = 'Monsters (except beasts) take half damage from non-silver weapons, but not from fire (errata p. 162).'

export function bestiaryCharacter(b: BestiaryDef): Character {
  const c = newCharacter('npc', b.name)
  const [INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK] = b.stats
  c.id = bestiaryId(b.name)
  c.race = b.category === 'Humanoid' ? (b.name.startsWith('Scoia') ? 'Elf' : 'Human') : 'Monster'
  c.stats = { INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK } satisfies Stats
  c.skills = { ...b.skills }
  c.hp = { current: b.hp, maxOverride: b.hp }
  c.sta = { current: b.sta, maxOverride: b.sta }
  c.luckCurrent = LUCK
  for (const l of HIT_LOCATIONS) {
    const sp = l === 'head' ? (b.headSp ?? b.sp) : b.sp
    c.armor[l] = { piece: sp ? 'Natural armor' : '', sp, maxSp: sp }
  }
  if (b.category === 'Humanoid') for (const l of HIT_LOCATIONS) c.armor[l].piece = c.armor[l].sp ? 'Armor' : ''
  c.weapons = b.attacks.map((a) => ({
    id: uid(),
    name: a.name,
    skillId: a.skill,
    accuracy: 0,
    damage: a.damage,
    reliability: 0,
    hands: 0,
    range: a.range ?? '',
    effect: a.effect ?? '',
    notes: '',
  }))
  c.perks = `Abilities: ${b.abilities}\nWeaknesses: ${b.weaknesses}`
  c.notes = b.category === 'Humanoid' || b.category === 'Beast' ? '' : RESISTANCE
  c.bestiary = { category: b.category, threat: b.threat, page: b.page ?? null, confirmed: b.confirmed ?? '', checked: false }
  return c
}

// Estimated entries replaced by A Witcher's Journal stat blocks.
export const RETIRED_ESTIMATES = ['Bear', 'Harpy', 'Leshen', 'Rock troll'].map(bestiaryId)

export function allBestiary(): Character[] {
  return [...JOURNAL_MONSTERS.map(journalCharacter), ...BESTIARY.map(bestiaryCharacter)]
}

// Bestiary entries the GM's list doesn't have (never seeded, or deleted since).
export function missingBestiary(characters: Character[]): Character[] {
  const have = new Set(characters.map((c) => c.id))
  return allBestiary().filter((c) => !have.has(c.id))
}

// One-time update for GMs whose list was seeded before the Journal arrived: adds the Journal
// monsters and drops the retired estimates, unless the GM ticked or edited them.
export function applyJournalUpdate(characters: Character[]): Character[] {
  const retired = new Set(RETIRED_ESTIMATES)
  const kept = characters.filter((c) => !(retired.has(c.id) && c.bestiary && !c.bestiary.checked && c.updatedAt === c.createdAt))
  const have = new Set(kept.map((c) => c.id))
  return [...kept, ...JOURNAL_MONSTERS.map(journalCharacter).filter((c) => !have.has(c.id))]
}
