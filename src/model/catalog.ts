import { HIT_LOCATIONS, type HitLocation } from '../rules/rules'
import { uid } from './factory'
import type { Character, Item, Weapon } from './types'

// The weapons, armor and gear players can add from a search instead of typing. Stats, weights and
// prices (Redanian crowns) are the core rulebook's, with the page in `page`. An entry without a page
// is not priced in the book (the search marks it unverified). Everything is editable on a sheet.

// 'all' is an armor set covering head, torso, arms and legs (core p. 84).
export type ArmorCover = 'head' | 'torso' | 'legs' | 'all'

interface Base {
  name: string
  weight: number
  // Core rulebook page, or undefined if the book doesn't list it.
  page?: number
  cost?: number
}

export interface WeaponEntry extends Base {
  kind: 'weapon'
  skillId: string
  // Damage type: S, P, B or E, combined with / (core p. 72).
  type: string
  accuracy: number
  damage: string
  reliability: number
  hands: number
  range: string
  effect: string
}

export type ArmorClass = 'light' | 'medium' | 'heavy'

export interface ArmorEntry extends Base {
  kind: 'armor'
  covers: ArmorCover
  sp: number
  ev: number
  class: ArmorClass
  effect?: string
}

export interface ShieldEntry extends Base {
  kind: 'shield'
  reliability: number
  ev: number
  effect?: string
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
  type: string,
  damage: string,
  o: Partial<Omit<WeaponEntry, 'kind' | 'name' | 'skillId' | 'type' | 'damage'>> = {},
): WeaponEntry => ({ kind: 'weapon', name, skillId, type, damage, accuracy: 0, reliability: 10, hands: 1, range: '', effect: '', weight: 1, ...o })

const a = (
  name: string,
  covers: ArmorCover,
  cls: ArmorClass,
  sp: number,
  ev: number,
  weight: number,
  cost: number,
  page: number,
  effect?: string,
): ArmorEntry => ({ kind: 'armor', name, covers, class: cls, sp, ev, weight, cost, page, ...(effect ? { effect } : {}) })

const sh = (name: string, reliability: number, ev: number, weight: number, cost: number, page: number, effect?: string): ShieldEntry => ({
  kind: 'shield',
  name,
  reliability,
  ev,
  weight,
  cost,
  page,
  ...(effect ? { effect } : {}),
})

const g = (category: string, name: string, weight: number, cost: number | undefined, page: number | undefined, qty?: number): GearEntry => ({
  kind: 'gear',
  category,
  name,
  weight,
  ...(cost !== undefined ? { cost } : {}),
  ...(page ? { page } : {}),
  ...(qty ? { qty } : {}),
})

// Weapons table, core p. 73-74; elderfolk weapons p. 83; witcher swords p. 247. As printed: the iron
// long sword, gleddyf and vicovarian blade are two-handed.
export const WEAPONS: WeaponEntry[] = [
  // Swords
  w('Iron Long Sword', 'swordsmanship', 'S/P', '2d6+2', { hands: 2, weight: 1.5, cost: 160, page: 73 }),
  w('Arming Sword', 'swordsmanship', 'S/P', '2d6+4', { reliability: 15, weight: 2.5, cost: 270, page: 73 }),
  w('Gleddyf', 'swordsmanship', 'S/P', '3d6+2', { reliability: 5, hands: 2, weight: 3, cost: 285, page: 73 }),
  w("Hunter's Falchion", 'swordsmanship', 'S/P', '3d6', { reliability: 15, weight: 2, cost: 325, page: 73 }),
  w('Krigsverd', 'swordsmanship', 'S/P', '4d6+4', { accuracy: 2, weight: 2, cost: 570, page: 73 }),
  w('Esboda', 'swordsmanship', 'S/P', '5d6', { accuracy: 1, weight: 1.5, cost: 650, page: 73 }),
  w('Kord', 'swordsmanship', 'S/P', '5d6', { reliability: 15, weight: 1.5, effect: 'Bleeding (25%)', cost: 725, page: 73 }),
  w('Vicovarian Blade', 'swordsmanship', 'S/P', '5d6+4', { reliability: 15, hands: 2, weight: 1.5, effect: 'Balanced', cost: 955, page: 73 }),
  w('Torrwr', 'swordsmanship', 'S/P', '6d6', { reliability: 15, hands: 2, weight: 2, effect: 'Bleeding (50%)', cost: 1075, page: 73 }),
  w('Elven Messer', 'swordsmanship', 'P/S', '3d6+4', { accuracy: 2, reliability: 15, weight: 2, cost: 595, page: 83 }),
  w('Vrihedd Cavalry Sword', 'swordsmanship', 'P/S', '4d6+4', { accuracy: 3, reliability: 15, weight: 2.5, effect: 'Bleeding (25%)', cost: 745, page: 83 }),
  w('Meteorite Sword', 'swordsmanship', 'P/S', '5d6', { accuracy: 1, reliability: 20, hands: 2, weight: 3, effect: 'Balanced, Meteorite', cost: 875, page: 83 }),
  w('Gnomish Gwyhyr', 'swordsmanship', 'P/S', '5d6+3', { accuracy: 3, reliability: 15, hands: 2, weight: 2.5, effect: 'Bleeding (50%)', cost: 1090, page: 83 }),
  w('Tir Tochair Blade', 'swordsmanship', 'P/S', '6d6', { accuracy: 3, reliability: 15, hands: 2, weight: 3, effect: 'Bleeding (25%)', cost: 1175, page: 83 }),
  w("Witcher's Steel Sword", 'swordsmanship', 'P/S', '4d6+2', { reliability: 15, weight: 2.5, effect: 'Armor Piercing, Meteorite', page: 247 }),
  w("Witcher's Silver Sword", 'swordsmanship', 'P/S', '1d6+2', { reliability: 10, weight: 1.5, effect: 'Silver (3d6)', page: 247 }),
  // Small blades
  w('Dagger', 'small-blades', 'S/P', '1d6+2', { weight: 0.5, cost: 50, page: 73 }),
  w('Stiletto', 'small-blades', 'S/P', '1d6', { accuracy: 2, reliability: 5, weight: 0.5, effect: 'Concealment', cost: 275, page: 73 }),
  w('Poniard', 'small-blades', 'S/P', '2d6+2', { accuracy: 1, weight: 1, effect: 'Bleeding (25%)', cost: 350, page: 73 }),
  w('Jambiya', 'small-blades', 'S/P', '2d6', { accuracy: 2, weight: 0.5, effect: 'Bleeding (25%), Armor Piercing', cost: 440, page: 73 }),
  w('Halfling Rondel', 'small-blades', 'P/S', '2d6+2', { accuracy: 2, weight: 1, effect: 'Armor Piercing', cost: 485, page: 83 }),
  w('Dwarven Cleaver', 'small-blades', 'S/B', '3d6', { accuracy: 2, reliability: 15, weight: 1.5, cost: 500, page: 83 }),
  // Axes
  w('Hand Axe', 'melee', 'S', '2d6+1', { weight: 1, cost: 205, page: 73 }),
  w('Battle Axe', 'melee', 'S', '5d6', { reliability: 15, weight: 2, cost: 525, page: 73 }),
  w("Berserker's Axe", 'melee', 'S', '6d6', { reliability: 15, hands: 2, weight: 3, effect: 'Ablating, Bleeding (25%)', cost: 960, page: 73 }),
  w('Dwarven Axe', 'melee', 'S', '5d6+3', { accuracy: 3, reliability: 15, weight: 4, cost: 740, page: 83 }),
  w('Gnomish Black Axe', 'melee', 'S', '6d6+2', { accuracy: 2, reliability: 15, hands: 2, weight: 2.5, cost: 910, page: 83 }),
  // Bludgeons
  w('Brass Knuckles', 'brawling', 'B', '1d6', { accuracy: 1, reliability: 15, weight: 0.5, effect: 'Brawling', cost: 50, page: 73 }),
  w('Mace', 'melee', 'B', '5d6', { reliability: 15, weight: 2, cost: 525, page: 73 }),
  w('Highland Mauler', 'melee', 'B', '6d6+2', { reliability: 20, hands: 2, weight: 3, effect: 'Stun (-2), Meteorite', cost: 1100, page: 73 }),
  w('Mahakaman Martell', 'melee', 'B', '5d6', { reliability: 15, hands: 2, weight: 3.5, effect: 'Armor Piercing', cost: 750, page: 83 }),
  w('Meteorite Chain Mace', 'melee', 'B', '6d6', { accuracy: 2, reliability: 20, weight: 4, effect: 'Grappling, Meteorite', cost: 900, page: 83 }),
  // Pole arms
  w('Spear', 'staff-spear', 'P/B', '3d6', { hands: 2, weight: 3.5, range: 'BODY×2 m', effect: 'Long Reach', cost: 375, page: 73 }),
  w('Pole Axe', 'staff-spear', 'S/P/B', '4d6+2', { hands: 2, weight: 3, effect: 'Long Reach', cost: 460, page: 73 }),
  w('Red Halberd', 'staff-spear', 'S/P/B', '6d6+3', { hands: 2, weight: 4, effect: 'Long Reach', cost: 865, page: 73 }),
  w('Dwarven Pole Hammer', 'staff-spear', 'B/P', '5d6+2', { reliability: 15, hands: 2, weight: 4, effect: 'Long Reach, Stun (-2)', cost: 835, page: 83 }),
  w('Elven Glaive', 'staff-spear', 'S/P/B', '4d6+3', { accuracy: 2, hands: 2, weight: 3, effect: 'Long Reach, Bleeding (25%)', cost: 925, page: 83 }),
  // Staves
  w('Staff', 'staff-spear', 'B', '1d6+2', { hands: 2, weight: 3, effect: 'Long Reach, Focus (1)', cost: 335, page: 74 }),
  w('Hooked Staff', 'staff-spear', 'P/B', '2d6', { hands: 2, weight: 3.5, effect: 'Long Reach, Focus (1), Grappling', cost: 550, page: 74 }),
  w('Iron Staff', 'staff-spear', 'B', '3d6', { reliability: 15, hands: 2, weight: 4, effect: 'Long Reach, Focus (2)', cost: 675, page: 74 }),
  w('Crystal Staff', 'staff-spear', 'B', '2d6+2', { reliability: 5, hands: 2, weight: 2.5, effect: 'Long Reach, Focus (3), Greater Focus', cost: 835, page: 74 }),
  w('Gnomish Staff', 'staff-spear', 'B', '3d6+2', { accuracy: 1, reliability: 15, hands: 2, weight: 2.5, effect: 'Long Reach, Focus (3)', cost: 910, page: 83 }),
  w('Elven Walking Staff', 'staff-spear', 'B', '3d6', { accuracy: 1, hands: 2, weight: 1.5, effect: 'Long Reach, Focus (3), Greater Focus', cost: 975, page: 83 }),
  // Thrown
  w('Throwing Knife', 'athletics', 'P', '1d6', { reliability: 5, weight: 0.5, range: 'BODY×4 m', cost: 50, page: 74 }),
  w('Throwing Axe', 'athletics', 'S', '2d6', { weight: 1, range: 'BODY×2 m', cost: 75, page: 74 }),
  w('Orion', 'athletics', 'S', '1d6', { accuracy: 1, reliability: 5, weight: 0.1, range: 'BODY×4 m', cost: 100, page: 74 }),
  // Bows
  w('Short Bow', 'archery', 'P', '3d6+3', { hands: 2, weight: 1, range: '100 m', cost: 290, page: 74 }),
  w('Long Bow', 'archery', 'P', '4d6', { hands: 2, weight: 2, range: '200 m', cost: 475, page: 74 }),
  w('War Bow', 'archery', 'P', '6d6', { reliability: 15, hands: 2, weight: 3, range: '300 m', cost: 835, page: 74 }),
  w('Elven Travel Bow', 'archery', 'P', '4d6', { accuracy: 1, hands: 2, weight: 1, range: '200 m', cost: 575, page: 83 }),
  w('Elven Zefhar', 'archery', 'P', '6d6', { accuracy: 2, hands: 2, weight: 2.5, range: '350 m', effect: 'Improved Armor Piercing', cost: 1100, page: 83 }),
  // Crossbows (hand crossbows still take two hands to reload, p. 72)
  w('Hand Crossbow', 'crossbow', 'P', '2d6+2', { accuracy: 1, reliability: 5, weight: 0.5, range: '50 m', effect: 'Slow Reload', cost: 285, page: 74 }),
  w('Crossbow', 'crossbow', 'P', '4d6+2', { accuracy: 1, reliability: 5, hands: 2, weight: 3, range: '100 m', effect: 'Slow Reload', cost: 455, page: 74 }),
  w("Monster Hunter's Crossbow", 'crossbow', 'P', '6d6', { accuracy: 1, reliability: 15, hands: 2, weight: 4, range: '200 m', effect: 'Slow Reload, Armor Piercing', cost: 1125, page: 74 }),
  w('Gnomish Hand Crossbow', 'crossbow', 'P', '2d6', { accuracy: 3, weight: 1, range: '100 m', effect: 'Slow Reload', cost: 425, page: 83 }),
  w('Dwarven Heavy Crossbow', 'crossbow', 'P', '5d6', { accuracy: 3, reliability: 15, hands: 2, weight: 3.5, range: '300 m', effect: 'Slow Reload', cost: 850, page: 83 }),
]

// Armor, core p. 79-80; elderfolk armor sets p. 84. Restricted Vision: see p. 151.
export const ARMOR: ArmorEntry[] = [
  a("Verden Archer's Hood", 'head', 'light', 3, 0, 0.5, 100, 79),
  a('Double Woven Hood', 'head', 'light', 5, 0, 1, 175, 79),
  a('Spectacled Helm', 'head', 'light', 8, 0, 1, 200, 79),
  a('Chain Coif', 'head', 'medium', 12, 0, 1.5, 250, 79),
  a('Armored Hood', 'head', 'medium', 14, 0, 2, 350, 79),
  a('Temerian Armet', 'head', 'medium', 16, 0, 1.5, 475, 79, 'Restricted Vision'),
  a('Great Helm', 'head', 'heavy', 20, 0, 3.5, 575, 79, 'Restricted Vision'),
  a('Skellige Helm', 'head', 'heavy', 25, 0, 3.5, 700, 79, 'Restricted Vision'),
  a('Nilfgaardian Helm', 'head', 'heavy', 30, 0, 3, 800, 79, 'Restricted Vision'),
  a('Gambeson', 'torso', 'light', 3, 0, 1, 100, 79),
  a('Aedirnian Gambeson', 'torso', 'light', 5, 0, 1.5, 175, 79),
  a('Double Woven Gambeson', 'torso', 'light', 8, 0, 2.5, 250, 79),
  a('Brigandine', 'torso', 'medium', 12, 1, 7, 300, 79),
  a("Redanian Halberdier's Armor", 'torso', 'medium', 14, 1, 8.5, 400, 79),
  a('Lyrian Leather Jacket', 'torso', 'medium', 16, 1, 6.5, 525, 79),
  a('Plate Armor', 'torso', 'heavy', 20, 2, 14, 625, 79),
  a('Hindarsfjall Heavy Armor', 'torso', 'heavy', 25, 2, 15, 750, 79),
  a('Nilfgaardian Plate Armor', 'torso', 'heavy', 30, 2, 12, 850, 79),
  a('Cavalry Trousers', 'legs', 'light', 3, 0, 0.5, 75, 80),
  a('Padded Trousers', 'legs', 'light', 5, 0, 1, 125, 80),
  a('Double Woven Trousers', 'legs', 'light', 8, 0, 1.5, 225, 80),
  a('Armored Trousers', 'legs', 'medium', 12, 0, 3.5, 250, 80),
  a('Redanian Greaves', 'legs', 'medium', 14, 0, 4, 400, 80),
  a('Lyrian Leather Trousers', 'legs', 'medium', 16, 0, 3.5, 525, 80),
  a('Plate Greaves', 'legs', 'heavy', 20, 1, 7.5, 625, 80),
  a('Hindarsfjall Heavy Chausses', 'legs', 'heavy', 25, 1, 5, 650, 80),
  a('Nilfgaardian Greaves', 'legs', 'heavy', 30, 1, 6, 850, 80),
  a('Halfling Protective Doublet', 'torso', 'light', 8, 0, 1, 375, 84, 'Looks like a regular doublet'),
  a('Gnomish Chain', 'all', 'light', 10, 0, 5, 975, 84, 'Resistance: Slashing'),
  a('Dwarven Cloak', 'all', 'medium', 16, 0, 5, 1400, 84),
  a("Scoia'tael Armor", 'all', 'medium', 20, 1, 12, 2325, 84),
  a('Gnomish Dragoon Armor', 'all', 'heavy', 25, 2, 20, 2850, 84, 'Resistance: Slashing, Piercing'),
  a('Mahakaman Plate Armor', 'all', 'heavy', 30, 2, 30, 3525, 84, 'Resistance: Slashing, Bludgeoning, Piercing'),
]

// Shields, core p. 80 and p. 84.
export const SHIELDS: ShieldEntry[] = [
  sh('Leather Shield', 4, 0, 0.5, 50, 80),
  sh('Steel Buckler', 6, 0, 1, 150, 80),
  sh('Temerian Shield', 8, 0, 1.5, 225, 80),
  sh('Skellige Raider Shield', 10, 0, 2, 325, 80),
  sh('Kaedweni Shield', 14, 0, 2.5, 400, 80),
  sh('Steel Kite Shield', 16, 0, 3, 400, 80),
  sh('Pavise', 20, 1, 4, 500, 80, 'Full Cover'),
  sh('Nilfgaardian Pavise', 25, 1, 5, 600, 80, 'Full Cover'),
  sh('Gnomish Buckler', 15, 0, 1, 450, 84),
  sh('Elven Shield', 25, 0, 3, 700, 84),
  sh('Mahakaman Pavise', 35, 1, 5.5, 1050, 84, 'Full Cover'),
]

const tool = (name: string, weight: number, cost: number) => g('Tools', name, weight, cost, 92)
const gen = (name: string, weight: number, cost: number, qty?: number) => g('General', name, weight, cost, 93, qty)
const alc = (name: string, weight: number, cost: number) => g('Alchemical', name, weight, cost, 87)

export const GEAR: GearEntry[] = [
  // Tool kits, core p. 92
  tool('Alchemy Set', 3, 80),
  tool('Amulet, Gemstone', 0.1, 500),
  tool('Amulet, Simple', 0.1, 250),
  tool('Cooking Tools', 3, 15),
  tool('Crafting Tools', 5, 83),
  tool('Disguise Kit', 1, 58),
  tool('Fine Art Tools', 2, 55),
  tool('Fishing Gear', 0.5, 27),
  tool('Forgery Kit', 0.5, 58),
  tool('Makeup Kit', 0.5, 35),
  tool("Merchant's Tools", 1.5, 60),
  tool("Surgeon's Kit", 1, 83),
  tool('Telecommunicator', 4, 1000),
  tool("Thieves' Tools", 1, 80),
  tool("Tinker's Forge", 5, 111),
  tool('Writing Kit', 1, 25),
  // General gear, core p. 93
  gen('Bedroll', 1.5, 16),
  gen('Candles (x5)', 0.1, 1, 5),
  gen('Chalk', 0.1, 2),
  gen('Dice Poker Board', 0.5, 25),
  gen('Flint & Steel', 0.1, 6),
  gen('Grappling Hook', 0.5, 13),
  gen('Gwent Deck', 0.1, 5),
  gen('Hand Mirror', 0.5, 27),
  gen('Holy Symbol', 0.1, 14),
  gen('Hourglass', 1, 38),
  gen('Hourglass, Minute', 0.1, 18),
  gen('Instrument', 1, 38),
  gen('Journal/Ledger', 0.5, 8),
  gen('Lantern', 1, 33),
  gen('Lantern, Bullseye', 1, 39),
  gen('Loaded Dice', 0.1, 12),
  gen('Lock', 0.1, 34),
  gen('Lock, Strong', 0.1, 68),
  gen('Manacles', 0.5, 30),
  gen('Map of the Continent', 0.1, 18),
  gen('Perfume/Cologne', 0.1, 22),
  gen('Pipe', 0.1, 19),
  gen('Pitons (x5)', 0.1, 2, 5),
  gen('Prosthetic, Basic', 1, 50),
  gen('Prosthetic, Quality', 1.5, 100),
  gen('Rope, 20m', 1.5, 20),
  gen('Shackles', 2, 50),
  gen('Soap', 0.1, 4),
  gen('Tarp', 1.5, 10),
  gen('Tent', 4, 19),
  gen('Tent, Large', 8, 36),
  gen('Tobacco', 0.1, 4),
  gen('Torch', 0.1, 1),
  gen('Waterskin', 1, 8),
  // Containers, core p. 93
  g('Containers', 'Bandolier', 1, 19, 93),
  g('Containers', 'Basket', 0.5, 10, 93),
  g('Containers', 'Belt Pouch', 0.1, 7, 93),
  g('Containers', 'Sack', 0.1, 3, 93),
  g('Containers', 'Satchel', 1, 14, 93),
  g('Containers', 'Secret Pocket', 0.1, 11, 93),
  g('Containers', 'Sheath, Bow', 1.5, 24, 93),
  g('Containers', 'Sheath, Garter', 0.1, 11, 93),
  g('Containers', 'Sheath, Sleeve', 0.1, 13, 93),
  g('Containers', 'Wooden Chest', 1, 18, 93),
  g('Containers', 'Wooden Chest, Large', 10, 30, 93),
  // Food and drink, core p. 93
  g('Food & drink', 'A Simple Meal', 1, 10, 93),
  g('Food & drink', 'A Good Meal', 2.5, 30, 93),
  g('Food & drink', 'A Feast', 5, 100, 93),
  g('Food & drink', 'Raw Meat', 1, 8, 93),
  g('Food & drink', 'Sweets', 1, 5, 93),
  g('Food & drink', 'Trail Rations (1 day)', 1, 5, 93),
  g('Food & drink', 'Alcohest', 1, 8, 93),
  g('Food & drink', 'Beer', 1, 5, 93),
  g('Food & drink', 'Spirits', 1, 10, 93),
  g('Food & drink', 'Wine', 1, 8, 93),
  // Clothing, core p. 93
  g('Clothing', 'Basic Clothing', 2, 10, 93),
  g('Clothing', 'Cold Weather Clothing', 3, 45, 93),
  g('Clothing', 'Fashionable Clothing', 2, 70, 93),
  g('Clothing', 'Jewelry', 0.5, 50, 93),
  g('Clothing', "Rogue's Clothing", 1.5, 50, 93),
  // Alchemical items, core p. 87-88 (price per dose)
  alc('Acid Solution', 0.5, 56),
  alc("Adda's Tomb", 0.1, 18),
  alc('Alchemical Adhesive', 0.1, 28),
  alc('Base Powder', 0.1, 18),
  alc('Black Venom', 0.1, 45),
  alc("Bredan's Fury", 0.5, 95),
  alc('Chloroform', 0.1, 36),
  alc('Clotting Powder', 0.1, 20),
  alc('Fisstech', 0.1, 80),
  alc('Hallucinogen', 0.1, 25),
  g('Alchemical', 'Numbing Herbs', 0.1, 12, 88),
  g('Alchemical', "Pantagran's Elixir", 0.5, 67, 88),
  g('Alchemical', 'Perfume Potion', 0.5, 76, 88),
  g('Alchemical', "Poisoner's Friend", 0.1, 16, 88),
  g('Alchemical', 'Quick Fire', 0.1, 45, 88),
  g('Alchemical', 'Smelling Salts', 0.1, 25, 88),
  g('Alchemical', 'Sterilizing Fluid', 0.1, 22, 88),
  g('Alchemical', "Succubus' Breath", 0.1, 20, 88),
  g('Alchemical', "Talgar's Tears", 0.5, 79, 88),
  g('Alchemical', "Wives' Tears Potion", 0.1, 56, 88),
  g('Alchemical', 'Zerrikanian Fire', 0.5, 65, 88),
  // Ammunition, core p. 74 and 84 (standard comes 10 to a bundle)
  g('Ammunition', 'Arrows (x10)', 0.05, 1, 74, 10),
  g('Ammunition', 'Bolts (x10)', 0.05, 1, 74, 10),
  g('Ammunition', 'Blunt arrow or bolt', 0.1, 5, 74),
  g('Ammunition', 'Broadhead arrow or bolt', 0.1, 10, 74),
  g('Ammunition', 'Bodkin arrow or bolt', 0.1, 15, 74),
  g('Ammunition', 'Elven Burrower', 0.1, 50, 84),
  g('Ammunition', 'Dwarven Impact', 0.1, 50, 84),
  // Mounts, vehicles and tack, core p. 91 (weights are what a mount or vehicle weighs, so not counted)
  g('Mounts', 'Horse', 0, 520, 91),
  g('Mounts', 'Mule', 0, 200, 91),
  g('Mounts', 'Ox', 0, 278, 91),
  g('Mounts', 'War Horse', 0, 1600, 91),
  g('Mounts', 'Cart', 0, 200, 91),
  g('Mounts', 'Carriage', 0, 660, 91),
  g('Mounts', 'Saddle', 0, 100, 91),
  g('Mounts', 'Cavalry Saddle', 0, 325, 91),
  g('Mounts', 'Racing Saddle', 0, 200, 91),
  g('Mounts', 'Blinders', 0, 100, 91),
  g('Mounts', 'Saddlebags', 0, 100, 91),
  g('Mounts', 'Military Saddlebags', 0, 150, 91),
  g('Mounts', 'Leather Barding', 0, 550, 91),
  g('Mounts', 'Chain Barding', 0, 1050, 91),
  // Witcher gear, core p. 247-249 (potions, oils and decoctions weigh 0.5)
  g('Witcher', 'Witcher Medallion', 0.1, undefined, 247),
  g('Witcher', 'Decoction formula', 0, undefined, 46),
  g('Witcher', 'Oil formula', 0, undefined, 46),
  g('Witcher', 'Potion formula', 0, undefined, 46),
  // Profession starting gear the book names without a price (core p. 38-45)
  g('Starting gear', 'Crafting components (50 crowns)', 0, undefined, 39),
  g('Starting gear', 'Magical components (100 crowns)', 0, undefined, 42),
  g('Starting gear', 'Ritual components (100 crowns)', 0, undefined, 45),
  g('Starting gear', 'Trade goods (1000 crowns)', 0, undefined, 44),
  g('Starting gear', 'Journal with a lock', 0.5, undefined, 38),
  // Not priced in the book: weight is a guess.
  g('Starting gear', 'Blanket', 1, undefined, undefined),
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
  all: [...HIT_LOCATIONS],
}

export const COVER_NAMES: Record<ArmorCover, string> = { head: 'Head', torso: 'Torso and arms', legs: 'Legs', all: 'Whole body' }

// Where an entry's numbers come from, or null if the book doesn't list it.
export function sourceNote(e: CatalogEntry): string | null {
  return e.page ? `Core rulebook p. ${e.page}${e.cost !== undefined ? ` · ${e.cost} crowns` : ''}` : null
}

export function describe(e: CatalogEntry): string {
  switch (e.kind) {
    case 'weapon':
      return [e.damage, e.type, e.accuracy ? `WA ${e.accuracy > 0 ? '+' : ''}${e.accuracy}` : '', e.hands === 2 ? '2 hands' : '', e.range, e.effect].filter(Boolean).join(' · ')
    case 'armor':
      return [`${COVER_NAMES[e.covers]} · SP ${e.sp}`, e.ev ? `EV ${e.ev}` : '', e.class, e.effect].filter(Boolean).join(' · ')
    case 'shield':
      return [`Shield · Reliability ${e.reliability}`, e.ev ? `EV ${e.ev}` : '', e.effect].filter(Boolean).join(' · ')
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

export function toItem(e: CatalogEntry, notes = '', qty?: number): Item {
  const extra = e.kind === 'shield' ? `Shield, reliability ${e.reliability}${e.ev ? `, EV ${e.ev}` : ''}` : ''
  return { id: uid(), name: e.name, qty: qty ?? (e.kind === 'gear' ? (e.qty ?? 1) : 1), weight: e.weight, notes: [extra, notes].filter(Boolean).join(' · ') }
}

// Puts a catalog entry on the sheet where it belongs: weapons on the Combat tab,
// armor in the slots it covers, everything else in the inventory. `qty` overrides the bundle size;
// a weapon bought several at a time (throwing knives) also goes in the inventory with the count.
export function addToCharacter(c: Character, e: CatalogEntry, notes = '', qty?: number): Partial<Character> {
  if (e.kind === 'weapon') {
    const weapons = [...c.weapons, toWeapon(e, notes)]
    return qty && qty > 1 ? { weapons, items: [...c.items, toItem(e, notes, qty)] } : { weapons }
  }
  if (e.kind === 'armor') {
    const armor = { ...c.armor }
    for (const loc of COVERED[e.covers]) armor[loc] = { piece: e.name, sp: e.sp, maxSp: e.sp, ev: e.ev }
    return { armor }
  }
  return { items: [...c.items, toItem(e, notes, qty)] }
}

// Undoes addToCharacter for starting gear, matching on the note it was added with.
export function removeFromCharacter(c: Character, e: CatalogEntry, notes: string): Partial<Character> {
  if (e.kind === 'weapon')
    return {
      weapons: c.weapons.filter((x) => !(x.name === e.name && x.notes === notes)),
      items: c.items.filter((x) => !(x.name === e.name && x.notes.endsWith(notes))),
    }
  if (e.kind === 'armor') {
    const armor = { ...c.armor }
    for (const loc of HIT_LOCATIONS) if (armor[loc].piece === e.name) armor[loc] = { piece: '', sp: 0, maxSp: 0, ev: 0 }
    return { armor }
  }
  return { items: c.items.filter((x) => !(x.name === e.name && x.notes.endsWith(notes))) }
}

export function hasOnCharacter(c: Character, e: CatalogEntry, notes: string): boolean {
  if (e.kind === 'weapon') return c.weapons.some((x) => x.name === e.name && x.notes === notes)
  if (e.kind === 'armor') return c.armor[COVERED[e.covers][0]].piece === e.name
  return c.items.some((x) => x.name === e.name && x.notes.endsWith(notes))
}
