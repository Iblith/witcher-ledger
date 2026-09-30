import { HIT_LOCATIONS, type HitLocation } from '../rules/rules'
import { uid } from './factory'
import type { Character, Item, Weapon } from './types'

// The weapons, armor and gear players can add from a search instead of typing.
// The project only has the v4 errata, not the core rulebook. Names come from the
// book (many are listed in the errata's crafting and gear sections); the numbers
// are best recollection unless `errata` says what the errata confirms. Everything
// is editable once it is on a sheet.

export type ArmorCover = 'head' | 'torso' | 'legs'

interface Base {
  name: string
  weight: number
  // What the v4 errata confirms about this entry, if anything.
  errata?: string
}

export interface WeaponEntry extends Base {
  kind: 'weapon'
  skillId: string
  accuracy: number
  damage: string
  reliability: number
  hands: number
  range: string
  effect: string
}

export interface ArmorEntry extends Base {
  kind: 'armor'
  covers: ArmorCover
  sp: number
  ev: number
}

export interface ShieldEntry extends Base {
  kind: 'shield'
  reliability: number
}

export interface GearEntry extends Base {
  kind: 'gear'
  category: string
  qty?: number
}

export type CatalogEntry = WeaponEntry | ArmorEntry | ShieldEntry | GearEntry
export type CatalogKind = CatalogEntry['kind']

const w = (
  name: string,
  skillId: string,
  damage: string,
  o: Partial<Omit<WeaponEntry, 'kind' | 'name' | 'skillId' | 'damage'>> = {},
): WeaponEntry => ({ kind: 'weapon', name, skillId, damage, accuracy: 0, reliability: 10, hands: 1, range: '', effect: '', weight: 1, ...o })

const a = (name: string, covers: ArmorCover, sp: number, ev: number, weight: number, errata?: string): ArmorEntry => ({
  kind: 'armor',
  name,
  covers,
  sp,
  ev,
  weight,
  errata,
})

const sh = (name: string, reliability: number, weight: number): ShieldEntry => ({ kind: 'shield', name, reliability, weight })

const g = (category: string, name: string, weight: number, o: Partial<Pick<GearEntry, 'qty' | 'errata'>> = {}): GearEntry => ({
  kind: 'gear',
  category,
  name,
  weight,
  ...o,
})

export const WEAPONS: WeaponEntry[] = [
  // Swords
  w('Arming Sword', 'swordsmanship', '2d6+2', { weight: 1.5 }),
  w("Hunter's Falchion", 'swordsmanship', '2d6+2', { weight: 1.5, effect: 'Bleeding (25%)' }),
  w('Iron Long Sword', 'swordsmanship', '2d6+2', { weight: 2 }),
  w('Gleddyf', 'swordsmanship', '3d6', { accuracy: 1, weight: 1.5 }),
  w('Kord', 'swordsmanship', '3d6+2', { reliability: 15, hands: 2, weight: 2.5, effect: 'Bleeding (25%)' }),
  w('Krigsverd', 'swordsmanship', '4d6', { accuracy: 1, reliability: 15, weight: 2 }),
  w('Vicovarian Blade', 'swordsmanship', '4d6+2', { accuracy: 1, reliability: 15, weight: 1.5, effect: 'Balanced, Bleeding (25%)' }),
  w('Meteorite Sword', 'swordsmanship', '3d6+2', { accuracy: 1, reliability: 15, weight: 1.5, effect: 'Meteorite' }),
  w('Tir Tochair Blade', 'swordsmanship', '4d6', { accuracy: 2, reliability: 15, weight: 1.5, effect: 'Balanced' }),
  w('Gnomish Gwyhyr', 'swordsmanship', '4d6+2', { accuracy: 2, reliability: 15, weight: 1.5, effect: 'Balanced, Bleeding (50%)' }),
  w('Mahakaman Sihil', 'swordsmanship', '4d6+2', { accuracy: 1, reliability: 20, weight: 2, effect: 'Armor Piercing, Balanced' }),
  w('Witcher Steel Sword', 'swordsmanship', '4d6+2', { accuracy: 2, reliability: 15, weight: 2, effect: 'Balanced, Meteorite', errata: 'One-handed' }),
  w('Witcher Silver Sword', 'swordsmanship', '1d6+2 (5d6 vs silver-vulnerable)', { accuracy: 2, reliability: 10, weight: 2, effect: 'Silver', errata: 'One-handed' }),
  // Small blades
  w('Dagger', 'small-blades', '1d6+2', { weight: 0.5 }),
  w('Hunting Knife', 'small-blades', '1d6+2', { weight: 0.5, effect: 'Bleeding (25%)' }),
  w('Stiletto', 'small-blades', '1d6+2', { weight: 0.5, effect: 'Armor Piercing' }),
  w('Poniard', 'small-blades', '1d6+4', { weight: 0.5, effect: 'Armor Piercing, Balanced' }),
  w('Jambiya', 'small-blades', '2d6', { accuracy: 1, weight: 0.5, effect: 'Bleeding (25%)' }),
  w('Throwing Knife', 'athletics', '1d6', { weight: 0.5, range: 'BODY×4 m', effect: 'Thrown' }),
  w('Orion', 'athletics', '1d6', { accuracy: 1, weight: 0.1, range: 'BODY×4 m', effect: 'Thrown', errata: 'WA +1, weight 0.1' }),
  // Axes, maces and hammers
  w('Hand Axe', 'melee', '3d6', { weight: 1.5 }),
  w('Throwing Axe', 'athletics', '2d6+2', { weight: 1, range: 'BODY×2 m', effect: 'Thrown' }),
  w('Mace', 'melee', '4d6', { weight: 2, effect: 'Stun (−2)' }),
  w('Club', 'melee', '1d6+2', { weight: 1, effect: 'Nonlethal' }),
  w('Battle Axe', 'melee', '5d6', { accuracy: -1, reliability: 15, hands: 2, weight: 3, effect: 'Bleeding (50%)' }),
  w('Warhammer', 'melee', '5d6', { accuracy: -1, reliability: 15, hands: 2, weight: 3, effect: 'Armor Piercing, Stun (−2)' }),
  w('Mahakaman Martell', 'melee', '5d6+2', { reliability: 20, hands: 2, weight: 3.5, effect: 'Armor Piercing, Balanced' }),
  w('Highland Mauler', 'melee', '6d6', { accuracy: -2, reliability: 20, hands: 2, weight: 5, effect: 'Improved Armor Piercing, Stun (−4)' }),
  w('Brass Knuckles', 'brawling', '1d6', { weight: 0.2, effect: 'Brawling', errata: 'Has the Brawling effect' }),
  // Staves and polearms
  w('Staff', 'staff-spear', '1d6+2', { hands: 2, weight: 2, effect: 'Focus (1), Long Reach' }),
  w('Elven Walking Staff', 'staff-spear', '2d6', { accuracy: 1, hands: 2, weight: 1.5, effect: 'Focus (2), Long Reach' }),
  w('Crystal Staff', 'staff-spear', '2d6', { hands: 2, weight: 2, effect: 'Focus (2), Long Reach' }),
  w('Iron Staff', 'staff-spear', '3d6', { reliability: 15, hands: 2, weight: 3, effect: 'Focus (2), Long Reach, Stun (−2)' }),
  w('Spear', 'staff-spear', '3d6', { hands: 2, weight: 3, effect: 'Long Reach' }),
  w('Pole Axe', 'staff-spear', '5d6', { reliability: 15, hands: 2, weight: 4, effect: 'Long Reach, Armor Piercing' }),
  w('Halberd', 'staff-spear', '5d6+2', { reliability: 15, hands: 2, weight: 4, effect: 'Long Reach, Bleeding (25%)' }),
  w('Red Halberd', 'staff-spear', '6d6', { accuracy: 1, reliability: 20, hands: 2, weight: 4, effect: 'Long Reach, Bleeding (50%)' }),
  // Bows and crossbows
  w('Short Bow', 'archery', '2d6+2', { hands: 2, weight: 1, range: '100 m' }),
  w('Long Bow', 'archery', '4d6', { hands: 2, weight: 1.5, range: '200 m' }),
  w('War Bow', 'archery', '5d6', { accuracy: 1, reliability: 15, hands: 2, weight: 1.5, range: '300 m' }),
  w('Elven Travel Bow', 'archery', '4d6', { accuracy: 2, hands: 2, weight: 1, range: '200 m' }),
  w('Elven Zefhar', 'archery', '5d6', { accuracy: 2, reliability: 15, hands: 2, weight: 1.5, range: '300 m', effect: 'Improved Armor Piercing' }),
  w('Hand Crossbow', 'crossbow', '2d6', { weight: 1, range: '50 m' }),
  w('Crossbow', 'crossbow', '4d6', { hands: 2, weight: 2, range: '100 m', effect: 'Armor Piercing' }),
  w("Monster Hunter's Crossbow", 'crossbow', '4d6+2', { accuracy: 1, reliability: 15, hands: 2, weight: 2, range: '150 m', effect: 'Armor Piercing' }),
]

export const ARMOR: ArmorEntry[] = [
  a('Double Woven Hood', 'head', 5, 0, 0.5),
  a('Armored Hood', 'head', 8, 0, 1),
  a('Temerian Armet', 'head', 14, 1, 2),
  a('Great Helm', 'head', 20, 1, 3),
  a('Nilfgaardian Helm', 'head', 20, 1, 3),
  a('Gambeson', 'torso', 3, 0, 2, 'Torso armor also covers the arms'),
  a('Double Woven Gambeson', 'torso', 8, 0, 3, 'Torso armor also covers the arms'),
  a('Lyrian Leather Jacket', 'torso', 8, 0, 3, 'Torso armor also covers the arms'),
  a('Brigandine', 'torso', 12, 1, 5, 'Torso armor also covers the arms'),
  a("Redanian Halberdier's Armor", 'torso', 15, 1, 6, 'Torso armor also covers the arms'),
  a('Scoia’tael Armor', 'torso', 14, 0, 4, 'Torso armor also covers the arms'),
  a('Hindarsfjall Heavy Armor', 'torso', 20, 2, 8, 'Torso armor also covers the arms'),
  a('Plate Armor', 'torso', 20, 2, 10, 'Torso armor also covers the arms'),
  a('Gnomish Dragoon Armor', 'torso', 20, 1, 7, 'Torso armor also covers the arms'),
  a('Nilfgaardian Plate Armor', 'torso', 25, 3, 11, 'Torso armor also covers the arms'),
  a('Padded Trousers', 'legs', 3, 0, 1.5),
  a('Lyrian Leather Trousers', 'legs', 8, 0, 2),
  a('Armored Trousers', 'legs', 12, 1, 3),
  a('Redanian Greaves', 'legs', 12, 1, 3),
  a('Hindarsfjall Heavy Chausses', 'legs', 20, 2, 5),
  a('Plate Greaves', 'legs', 20, 2, 6),
  a('Nilfgaardian Greaves', 'legs', 25, 3, 6),
]

export const SHIELDS: ShieldEntry[] = [
  sh('Steel Buckler', 10, 1),
  sh('Kite Shield', 15, 3),
  sh('Temerian Shield', 15, 3),
  sh('Elven Shield', 20, 2),
  sh('Mahakaman Pavise', 30, 6),
]

export const GEAR: GearEntry[] = [
  // Tool kits (names from the errata's rarity list)
  ...[
    'Alchemy Set',
    'Amulet, Gemstone',
    'Amulet, Simple',
    'Cooking Tools',
    'Crafting Tools',
    'Disguise Kit',
    'Fine Art Tools',
    'Fishing Gear',
    'Forgery Kit',
    'Makeup Kit',
    "Merchant's Tools",
    "Surgeon's Kit",
    'Telecommunicator',
    "Thieves' Tools",
    "Tinker's Forge",
    'Writing Kit',
  ].map((n) => g('Tools', n, n === "Tinker's Forge" ? 5 : n.startsWith('Amulet') ? 0.1 : 1, { errata: 'Listed in the Tool Kits table' })),
  // General gear
  g('General', 'Torch', 0.1, { errata: 'Weight 0.1, cost 1' }),
  g('General', 'Waterskin', 1, { errata: 'Weight 1, cost 8' }),
  g('General', 'Backpack', 1),
  g('General', 'Bedroll', 1.5),
  g('General', 'Blanket', 1),
  g('General', 'Candles', 0.1, { qty: 5 }),
  g('General', 'Chalk', 0.1),
  g('General', 'Flint and steel', 0.1),
  g('General', 'Grappling hook', 1),
  g('General', 'Hand mirror', 0.2),
  g('General', 'Hourglass', 0.5),
  g('General', 'Journal', 0.5),
  g('General', 'Lantern', 1),
  g('General', 'Lock box', 2),
  g('General', 'Manacles', 1),
  g('General', 'Oil flask', 0.5),
  g('General', 'Padlock', 0.5),
  g('General', 'Pouch', 0.1),
  g('General', 'Rope (20 m)', 2),
  g('General', 'Sack', 0.5),
  g('General', 'Satchel', 0.5),
  g('General', 'Scales', 1),
  g('General', 'Sharpening stone', 0.5),
  g('General', 'Shovel', 2),
  g('General', 'Small chest', 2),
  g('General', 'Spyglass', 0.5),
  g('General', 'Tent', 5),
  g('General', 'Witcher medallion', 0.1),
  g('General', 'Holy symbol', 0.1),
  g('General', 'Garrote', 0.1),
  g('General', 'Diagrams', 0.1, { qty: 3 }),
  g('General', 'Ritual components', 0.5),
  // Medicine and alchemy
  g('Medicine', 'Bandages', 0.1, { qty: 10 }),
  g('Medicine', 'Sterilizing fluid', 0.1, { qty: 5 }),
  g('Medicine', 'Numbing herbs', 0.1, { qty: 5 }),
  g('Medicine', 'Herbal remedies', 0.1, { qty: 3 }),
  // Clothing
  g('Clothing', 'Hooded cloak', 1),
  g('Clothing', 'Traveling clothes', 1),
  g('Clothing', 'Fine clothes', 1),
  g('Clothing', 'Dark clothes', 1),
  g('Clothing', 'Boots', 1),
  g('Clothing', 'Gloves', 0.2),
  g('Clothing', 'Perfume', 0.1),
  // Instruments
  g('Instruments', 'Lute', 1.5),
  g('Instruments', 'Flute', 0.5),
  g('Instruments', 'Drum', 1.5),
  g('Instruments', 'Bagpipe', 2),
  // Food and drink
  g('Food & drink', 'Trail rations (1 day)', 1, { errata: 'Weight 1, cost 5' }),
  g('Food & drink', 'Bread', 0.5),
  g('Food & drink', 'Cheese', 0.5),
  g('Food & drink', 'Bottle of wine', 1, { qty: 2 }),
  g('Food & drink', 'Flask of spirits', 0.5),
  g('Food & drink', 'Pipe and tobacco', 0.2),
  // Ammunition
  g('Ammunition', 'Arrows', 0.1, { qty: 20 }),
  g('Ammunition', 'Crossbow bolts', 0.1, { qty: 20 }),
  // Mounts and tack
  g('Mounts', 'Horse', 0),
  g('Mounts', 'Mule', 0),
  g('Mounts', 'War horse', 0),
  g('Mounts', 'Saddle', 0),
  g('Mounts', 'Saddlebags', 0),
  g('Mounts', 'Cart', 0),
]

export const CATALOG: CatalogEntry[] = [...WEAPONS, ...ARMOR, ...SHIELDS, ...GEAR]

const BY_NAME = new Map(CATALOG.map((e) => [e.name.toLowerCase(), e]))
export function findEntry(name: string): CatalogEntry | undefined {
  return BY_NAME.get(name.toLowerCase())
}

const COVERED: Record<ArmorCover, HitLocation[]> = {
  head: ['head'],
  torso: ['torso', 'rArm', 'lArm'],
  legs: ['rLeg', 'lLeg'],
}

export const COVER_NAMES: Record<ArmorCover, string> = { head: 'Head', torso: 'Torso and arms', legs: 'Legs' }

export function describe(e: CatalogEntry): string {
  switch (e.kind) {
    case 'weapon':
      return [e.damage, e.accuracy ? `WA ${e.accuracy > 0 ? '+' : ''}${e.accuracy}` : '', e.hands === 2 ? '2 hands' : '', e.range, e.effect].filter(Boolean).join(' · ')
    case 'armor':
      return `${COVER_NAMES[e.covers]} · SP ${e.sp}${e.ev ? ` · EV ${e.ev}` : ''}`
    case 'shield':
      return `Shield · Reliability ${e.reliability}`
    case 'gear':
      return e.category + (e.qty && e.qty > 1 ? ` · ×${e.qty}` : '')
  }
}

export function search(query: string, kinds: CatalogKind[], limit = 12): CatalogEntry[] {
  const q = query.trim().toLowerCase()
  const pool = CATALOG.filter((e) => kinds.includes(e.kind))
  if (!q) return pool.slice(0, limit)
  const starts = pool.filter((e) => e.name.toLowerCase().startsWith(q))
  const rest = pool.filter((e) => !starts.includes(e) && (e.name.toLowerCase().includes(q) || describe(e).toLowerCase().includes(q)))
  return [...starts, ...rest].slice(0, limit)
}

export function toWeapon(e: WeaponEntry, notes = ''): Weapon {
  return { id: uid(), name: e.name, skillId: e.skillId, accuracy: e.accuracy, damage: e.damage, reliability: e.reliability, hands: e.hands, range: e.range, effect: e.effect, notes }
}

export function toItem(e: CatalogEntry, notes = ''): Item {
  const extra = e.kind === 'shield' ? `Shield, reliability ${e.reliability}` : ''
  return { id: uid(), name: e.name, qty: e.kind === 'gear' ? (e.qty ?? 1) : 1, weight: e.weight, notes: [extra, notes].filter(Boolean).join(' · ') }
}

// Puts a catalog entry on the sheet where it belongs: weapons on the Combat tab,
// armor in the slots it covers, everything else in the inventory.
export function addToCharacter(c: Character, e: CatalogEntry, notes = ''): Partial<Character> {
  if (e.kind === 'weapon') return { weapons: [...c.weapons, toWeapon(e, notes)] }
  if (e.kind === 'armor') {
    const armor = { ...c.armor }
    for (const loc of COVERED[e.covers]) armor[loc] = { piece: e.name, sp: e.sp, maxSp: e.sp }
    return { armor }
  }
  return { items: [...c.items, toItem(e, notes)] }
}

// Undoes addToCharacter for starting gear, matching on the note it was added with.
export function removeFromCharacter(c: Character, e: CatalogEntry, notes: string): Partial<Character> {
  if (e.kind === 'weapon') return { weapons: c.weapons.filter((x) => !(x.name === e.name && x.notes === notes)) }
  if (e.kind === 'armor') {
    const armor = { ...c.armor }
    for (const loc of HIT_LOCATIONS) if (armor[loc].piece === e.name) armor[loc] = { piece: '', sp: 0, maxSp: 0 }
    return { armor }
  }
  return { items: c.items.filter((x) => !(x.name === e.name && x.notes.endsWith(notes))) }
}

export function hasOnCharacter(c: Character, e: CatalogEntry, notes: string): boolean {
  if (e.kind === 'weapon') return c.weapons.some((x) => x.name === e.name && x.notes === notes)
  if (e.kind === 'armor') return c.armor[COVERED[e.covers][0]].piece === e.name
  return c.items.some((x) => x.name === e.name && x.notes.endsWith(notes))
}
