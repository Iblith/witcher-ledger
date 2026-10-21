import { HIT_LOCATIONS, type Stats } from '../rules/rules'
import { newCharacter, uid } from './factory'
import { journalCharacter, JOURNAL_MONSTERS } from './journalBestiary'
import type { Character } from './types'

// Creatures from the core rulebook bestiary (p. 270-310), used to seed the GM's NPC list alongside
// the A Witcher's Journal monsters (journalBestiary.ts). Stats, HP, STA, armor, skills, weapons,
// abilities and vulnerabilities are the book's. Skills are the book's +values (the skill level, stat
// not included). Natural attacks use the Melee skill.
// Nightwraith and Ekimmara are not in the core rulebook: they stay as marked estimates.

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
  bounty?: number
  // Not in the core rulebook: numbers are the app's estimates.
  estimate?: boolean
  confirmed?: string
  // INT REF DEX BODY SPD EMP CRA WILL LUCK
  stats: [number, number, number, number, number, number, number, number, number]
  hp: number
  sta: number
  vigor?: number
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
    page: 270,
    bounty: 10,
    stats: [3, 6, 5, 5, 4, 3, 4, 4, 0],
    hp: 20,
    sta: 20,
    sp: 5,
    skills: { athletics: 4, awareness: 6, brawling: 6, courage: 7, crossbow: 4, 'dodge-escape': 4, endurance: 5, 'resist-coercion': 5, 'resist-magic': 4, 'small-blades': 5, stealth: 3, swordsmanship: 6, 'wilderness-survival': 5 },
    attacks: [
      { name: 'Iron long sword', skill: 'swordsmanship', damage: '2d6+2' },
      { name: 'Dagger', skill: 'small-blades', damage: '1d6' },
      { name: 'Hand crossbow', skill: 'crossbow', damage: '2d6+2', effect: 'Slow Loading, WA +1', range: '50m' },
    ],
    abilities: 'None.',
    weaknesses: "Hanged Man's Venom.",
  },
  {
    name: "Scoia'tael archer",
    category: 'Humanoid',
    threat: 'Easy, Complex',
    page: 274,
    bounty: 20,
    stats: [4, 6, 7, 5, 7, 3, 4, 6, 0],
    hp: 25,
    sta: 25,
    sp: 5,
    skills: { archery: 8, athletics: 7, awareness: 9, brawling: 4, courage: 6, 'dodge-escape': 7, endurance: 7, 'resist-coercion': 6, 'resist-magic': 4, 'small-blades': 6, stealth: 8, swordsmanship: 6, 'wilderness-survival': 10 },
    attacks: [
      { name: "Hunter's falchion", skill: 'swordsmanship', damage: '3d6' },
      { name: 'Dagger', skill: 'small-blades', damage: '1d6' },
      { name: 'Throwing knives', skill: 'athletics', damage: '1d6', range: '20m' },
      { name: 'Longbow', skill: 'archery', damage: '4d6', range: '200m' },
    ],
    abilities: 'Ambush Specialist: when hiding, the whole group uses the highest Stealth roll among them.',
    weaknesses: "Hanged Man's Venom.",
  },
  {
    name: 'Mage',
    category: 'Humanoid',
    threat: 'Medium, Simple',
    page: 272,
    bounty: 100,
    stats: [7, 7, 6, 5, 5, 4, 5, 8, 0],
    hp: 30,
    sta: 30,
    vigor: 10,
    sp: 0,
    skills: { athletics: 5, awareness: 7, courage: 6, 'dodge-escape': 8, endurance: 5, 'hex-weaving': 6, 'resist-coercion': 7, 'resist-magic': 7, 'ritual-crafting': 5, 'spell-casting': 7, 'staff-spear': 6, stealth: 5, 'wilderness-survival': 5 },
    attacks: [
      { name: 'Iron staff', skill: 'staff-spear', damage: '3d6', effect: 'Focus (2), ROF 2' },
      { name: 'Dagger', skill: 'small-blades', damage: '1d6', effect: 'ROF 2' },
    ],
    abilities: 'Vigor 10. Spells: Aenye, Glamour, Blinding Dust, Rhewi, Teleportation. Rituals: Spell Jar, Ritual of Magic. Hexes: The Eternal Itch, The Hex of Shadows. The iron staff is a Focus (2).',
    weaknesses: "Hanged Man's Venom. Dimeritium: while touching it, Vigor 0 and the Dimeritium Effects table (p. 167).",
  },
  {
    name: 'Drowner',
    category: 'Necrophage',
    threat: 'Easy, Simple',
    page: 276,
    bounty: 10,
    stats: [1, 7, 7, 6, 6, 1, 1, 4, 0],
    hp: 25,
    sta: 25,
    sp: 0,
    skills: { athletics: 6, awareness: 8, brawling: 6, courage: 8, 'dodge-escape': 5, endurance: 6, melee: 6, 'resist-magic': 4, stealth: 5, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6' },
    ],
    abilities: 'Feral (INT 7 for Awareness and Wilderness Survival). Poison Immunity. Amphibious: lives underwater, no penalties for acting there. Impenetrably Dim: immune to magic affecting thoughts or emotions.',
    weaknesses: 'Necrophage Oil. Fire Vulnerability: vulnerable to fire, including being on fire.',
  },
  {
    name: 'Ghoul',
    category: 'Necrophage',
    threat: 'Easy, Difficult',
    page: 278,
    bounty: 30,
    stats: [1, 6, 7, 6, 6, 1, 1, 5, 0],
    hp: 25,
    sta: 25,
    sp: 0,
    skills: { athletics: 7, awareness: 7, brawling: 6, courage: 7, 'dodge-escape': 6, endurance: 6, melee: 6, 'resist-magic': 4, stealth: 4, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6' },
      { name: 'Bite', skill: 'melee', damage: '3d6+2', effect: 'Bleed (25%), WA -1' },
    ],
    abilities: 'Pounce: leaps without a running start. Fury: below 10 HP it moves and attacks every round and regenerates 3 a turn. Night Vision. Feral (INT 6 for Awareness and Wilderness Survival).',
    weaknesses: 'Necrophage Oil.',
  },
  {
    name: 'Grave hag',
    category: 'Necrophage',
    threat: 'Medium, Complex',
    page: 280,
    bounty: 500,
    stats: [6, 10, 10, 7, 7, 3, 3, 6, 0],
    hp: 60,
    sta: 30,
    sp: 0,
    skills: { athletics: 6, awareness: 8, brawling: 6, courage: 9, 'dodge-escape': 8, endurance: 7, melee: 8, 'resist-coercion': 10, 'resist-magic': 10, stealth: 8, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '5d6', effect: 'Bleed (50%), ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '6d6', effect: 'Poison (75%)' },
      { name: 'Tongue', skill: 'melee', damage: '3d6+2', effect: 'Poison (100%)', range: '4m' },
    ],
    abilities: 'Skull Circle: 1 hour to make; within 100 m of it, +3 to all actions. Command the Undead: instead of attacking, gives a simple order to each necrophage within 20 m. Night Vision.',
    weaknesses: 'Necrophage Oil. Whip Tongue: parry the tongue with a blade to sever it; 5 damage and no more tongue attacks.',
  },
  {
    name: 'Nekker',
    category: 'Ogroid',
    threat: 'Easy, Complex',
    page: 302,
    bounty: 10,
    stats: [2, 5, 7, 3, 6, 2, 2, 4, 0],
    hp: 15,
    sta: 15,
    sp: 0,
    skills: { athletics: 7, awareness: 8, brawling: 5, courage: 6, 'dodge-escape': 6, endurance: 6, melee: 5, 'resist-coercion': 9, 'resist-magic': 4, stealth: 8, 'wilderness-survival': 8 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '2d6' },
    ],
    abilities: 'Leader: while a chieftain lives, its warband gets +4 Courage and follows complex orders. Night Vision. Nekker chieftain (p. 303): INT 2, REF 6, DEX 8, BODY 4, SPD 7, EMP 2, CRA 2, WILL 5, STA 20, HP 20.',
    weaknesses: 'Ogroid Oil.',
  },
  {
    name: 'Noonwraith',
    category: 'Specter',
    threat: 'Medium, Difficult',
    page: 284,
    bounty: 800,
    stats: [5, 8, 6, 7, 6, 1, 1, 9, 0],
    hp: 80,
    sta: 40,
    sp: 0,
    skills: { athletics: 4, awareness: 10, brawling: 7, 'dodge-escape': 9, endurance: 7, melee: 8, 'resist-magic': 7, 'spell-casting': 8, stealth: 10, 'wilderness-survival': 5 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '5d6', effect: 'ROF 2' },
    ],
    abilities: 'Fueled By Rage. Incorporeal: immune to physical attacks, bleeding and poison. High Noon Dance: 3 copies at least 5 m from the target that defend with its stats; each drains 3 HP a round from the nearest target to heal it, and one hit kills a copy. Dust Devil: Spell Casting attack within 5 m, blinds 1d6 rounds.',
    weaknesses: 'Specter Oil. Moondust & Yrden: inside either it is no longer incorporeal. Celestial Weakness: -2 to all actions in moonlight.',
  },
  {
    name: 'Nightwraith',
    category: 'Specter',
    threat: 'Medium, Difficult',
    estimate: true,
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
    threat: 'Easy, Difficult',
    page: 282,
    bounty: 30,
    stats: [4, 6, 5, 5, 5, 1, 1, 6, 0],
    hp: 25,
    sta: 25,
    sp: 0,
    skills: { athletics: 5, awareness: 8, brawling: 6, 'dodge-escape': 6, endurance: 7, melee: 6, 'resist-magic': 6, 'spell-casting': 6, stealth: 9, swordsmanship: 7, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Wraith sword', skill: 'swordsmanship', damage: '3d6' },
      { name: 'Wraith lantern', skill: 'melee', damage: '2d6+2', effect: 'Fire (25%)' },
    ],
    abilities: 'Fueled By Rage: cannot be reasoned with or intimidated. Shift: Spell Casting as a defense to turn incorporeal; on a success the attack is negated and nothing physical affects it until its next turn. Teleportation: 10 m as its move. Night Vision. Its sword and lantern vanish when it dies.',
    weaknesses: 'Specter Oil. Moondust & Yrden: inside a moondust bomb or Yrden it cannot turn incorporeal or teleport.',
  },
  {
    name: 'Werewolf',
    category: 'Cursed One',
    threat: 'Medium, Complex',
    page: 288,
    bounty: 500,
    stats: [6, 8, 8, 7, 9, 1, 3, 5, 0],
    hp: 60,
    sta: 30,
    sp: 8,
    skills: { athletics: 8, awareness: 10, brawling: 8, courage: 10, 'dodge-escape': 8, endurance: 8, melee: 9, 'resist-coercion': 10, 'resist-magic': 9, stealth: 9, 'wilderness-survival': 9 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '4d6+2', effect: 'Bleed (25%), ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '5d6', effect: 'Bleed (75%)' },
    ],
    abilities: 'Regeneration 5 a round. Scent Tracking. Night Vision.',
    weaknesses: "Cursed Oil. Moondust Bombs: no regeneration inside the bomb's area.",
  },
  {
    name: 'Siren',
    category: 'Hybrid',
    threat: 'Easy, Complex',
    page: 290,
    bounty: 20,
    stats: [3, 7, 7, 6, 8, 3, 3, 8, 0],
    hp: 35,
    sta: 35,
    sp: 0,
    skills: { athletics: 8, awareness: 7, brawling: 7, courage: 5, 'dodge-escape': 6, endurance: 6, melee: 7, 'resist-coercion': 6, 'resist-magic': 6, 'spell-casting': 10, stealth: 8, 'wilderness-survival': 7 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '2d6+2', effect: 'WA +1' },
      { name: 'Tail', skill: 'melee', damage: '3d6+2' },
    ],
    abilities: 'Illusion: looks like a beautiful woman; DC:15 Spell Casting dispels it. Sonic Screech: Stun save at -1 for everyone within 10 m. Amphibious. Flight: knocked down only by a stun or more than 5 damage in one attack, then DC:16 Athletics or falling damage.',
    weaknesses: 'Hybrid Oil. Limited Movement: on land REF, DEX and SPD are 2.',
  },
  {
    name: 'Griffin',
    category: 'Hybrid',
    threat: 'Hard, Complex',
    page: 292,
    bounty: 1200,
    stats: [1, 10, 10, 15, 6, 1, 1, 5, 0],
    hp: 100,
    sta: 50,
    sp: 8,
    skills: { athletics: 7, awareness: 10, brawling: 7, courage: 10, 'dodge-escape': 7, endurance: 3, melee: 9, 'resist-magic': 9, stealth: 4, 'wilderness-survival': 8 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '6d6', effect: 'ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '7d6+2', effect: 'Bleed (50%)' },
    ],
    abilities: 'Sonic Screech: Stun save at -1 within 10 m. Charge: if a target is over 10 m away, a full-round claw attack at -4 for 10d6 that knocks it back 8 m. Feral (INT 8). Flight: knocked down only by a stun or more than 10 damage in one attack, then DC:16 Athletics or falling damage. Night Vision.',
    weaknesses: 'Hybrid Oil.',
  },
  {
    name: 'Endrega',
    category: 'Insectoid',
    threat: 'Easy, Difficult',
    page: 294,
    bounty: 30,
    stats: [1, 6, 7, 8, 7, 1, 1, 6, 0],
    hp: 35,
    sta: 35,
    sp: 8,
    skills: { athletics: 5, awareness: 5, brawling: 5, courage: 5, 'dodge-escape': 6, endurance: 6, melee: 6, 'resist-magic': 6, stealth: 7, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '3d6', effect: 'Sub-Species, Drone’s Quills, An endrega drone can shoot, quills out in circle with a 5m, radius. These quills can be, dodged or blocked (DC:15)., For every point below the, DC the target rolls they' },
    ],
    abilities: "Pounce. Resistances: half damage from bleeding and slashing. Poison Immunity. Feral (INT 6). Sub-species: drones shoot quills in a 5 m radius (dodge or block DC:15, 1d6 per point missed, poisoned); warriors have a 4d6 tail with 50% poison; workers' claws poison 25%.",
    weaknesses: 'Insectoid Oil.',
  },
  {
    name: 'Arachas',
    category: 'Insectoid',
    threat: 'Hard, Complex',
    page: 296,
    bounty: 1000,
    stats: [1, 9, 6, 13, 5, 1, 1, 5, 0],
    hp: 90,
    sta: 45,
    sp: 20,
    skills: { athletics: 5, awareness: 6, brawling: 5, courage: 10, 'dodge-escape': 8, endurance: 5, melee: 5, 'resist-magic': 9, stealth: 6, 'wilderness-survival': 4 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '5d6', effect: 'Poison (25%), ROF 2' },
    ],
    abilities: 'Pounce. Resistances: half damage from bleeding, slashing and piercing. Poison Immunity. Camouflage: +10 Stealth at home while still. Webbing: past 8 m it shoots web to 10 m with Athletics; grappled until DC:16 Physique or 10 damage to the web. Feral (INT 6).',
    weaknesses: 'Insectoid Oil. Soft Spot: its back has only 10 SP and no resistances.',
  },
  {
    name: 'Golem',
    category: 'Elementa',
    threat: 'Hard, Simple',
    page: 298,
    bounty: 1200,
    stats: [1, 10, 6, 13, 4, 1, 1, 4, 0],
    hp: 80,
    sta: 80, // the book prints '-': it never runs out of STA
    sp: 20,
    skills: { athletics: 2, awareness: 8, brawling: 5, 'dodge-escape': 4, physique: 10, 'resist-magic': 10, stealth: 2, 'wilderness-survival': 4 },
    attacks: [
      { name: 'Punch', skill: 'melee', damage: '8d6', effect: 'Ablating' },
    ],
    abilities: 'Crushing Force: cannot be parried, double ablation to weapons, shields and armor. Charge: over 10 m away, a full-round attack at -4 for 10d6 and 8 m knockback. Constructed: immune to bleeding, poison, fire and mind or emotion spells, never runs out of STA. Resistances: half damage from piercing and slashing.',
    weaknesses: 'Elementa Oil. Electricity Vulnerability: over 10 electrical damage forces a Stun save under 7. Dimeritium Bombs: no Crushing Force or Charge and -2 to all stats while the bomb lasts.',
  },
  {
    name: 'Fiend',
    category: 'Relict',
    threat: 'Hard, Difficult',
    page: 300,
    bounty: 1500,
    stats: [1, 13, 10, 15, 7, 1, 1, 9, 0],
    hp: 110,
    sta: 55,
    sp: 10,
    skills: { athletics: 5, awareness: 10, brawling: 8, courage: 10, 'dodge-escape': 7, endurance: 7, melee: 9, physique: 10, 'resist-magic': 10, 'spell-casting': 15, stealth: 1, 'wilderness-survival': 6 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '6d6+2', effect: 'ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '7d6', effect: 'Bleed (50%)' },
      { name: 'Horns', skill: 'melee', damage: '8d6', effect: 'WA -1' },
    ],
    abilities: 'Regeneration 5 a round. Charge: over 10 m away, a horn attack at -4 for 10d6 and 8 m knockback. Massive Bulk: immune to Aard and knockdown. Hypnosis: anyone looking makes Resist Magic against its Spell Casting or takes -4 to defense or attacks against it and is blind to the terrain for 5 rounds. Feral (INT 8).',
    weaknesses: 'Relict Oil. Moondust Bombs: no regeneration inside the area. Sensitive Hearing: staggered by a bomb hit or a loud, sharp noise.',
  },
  {
    name: 'Katakan',
    category: 'Vampire',
    threat: 'Hard, Difficult',
    page: 308,
    bounty: 1500,
    stats: [6, 14, 12, 8, 10, 3, 3, 8, 0],
    hp: 80,
    sta: 40,
    sp: 0,
    skills: { athletics: 10, awareness: 10, brawling: 7, courage: 8, 'dodge-escape': 10, endurance: 8, intimidation: 8, melee: 8, 'resist-coercion': 10, 'resist-magic': 8, stealth: 10, 'wilderness-survival': 8 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '6d6', effect: 'Bleed (50%), ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '7d6+2', effect: 'Bleed (100%)' },
    ],
    abilities: 'Regeneration 5 a round. Invisibility: +10 Stealth and +5 to attack, visible when it attacks; even when spotted, -3 to attack and defend against it; Yrden reveals it. Invisible to Magical Scanning: medallions miss it, mages need Magic Training against its Resist Magic. Telepathy with one creature within 20 m. Night Vision.',
    weaknesses: 'Vampire Oil. Black Blood Potion. Celestial Weakness: regeneration drops to 3 in sunlight. Fire Vulnerability: double damage from fire. Blood Transference: affected by anything in the blood it drinks.',
  },
  {
    name: 'Ekimmara',
    category: 'Vampire',
    threat: 'Medium, Complex',
    estimate: true,
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
    threat: 'Hard, Simple',
    page: 306,
    bounty: 1000,
    stats: [1, 10, 10, 10, 7, 1, 1, 6, 0],
    hp: 80,
    sta: 40,
    sp: 10,
    skills: { athletics: 8, awareness: 10, brawling: 7, courage: 8, 'dodge-escape': 6, endurance: 8, melee: 8, 'resist-magic': 8, stealth: 6, 'wilderness-survival': 9 },
    attacks: [
      { name: 'Claws', skill: 'melee', damage: '6d6', effect: 'ROF 2' },
      { name: 'Bite', skill: 'melee', damage: '7d6', effect: 'Poison (25%)' },
      { name: 'Tail barbs', skill: 'melee', damage: '5d6+2', effect: 'Poison (75%)' },
    ],
    abilities: 'Flight: knocked down only by a stun or more than 10 damage in one attack, then DC:16 Athletics or falling damage. Spit Venom: one target within 8 m, 3d6 with 100% poison. Resistances: half damage from piercing and slashing. Feral (INT 7).',
    weaknesses: 'Draconid Oil.',
  },
  {
    name: 'Rock troll',
    category: 'Ogroid',
    threat: 'Medium, Difficult',
    page: 304,
    bounty: 800,
    stats: [3, 8, 7, 12, 4, 6, 7, 4, 0],
    hp: 80,
    sta: 40,
    sp: 20,
    skills: { athletics: 3, awareness: 9, brawling: 8, courage: 10, 'dodge-escape': 5, endurance: 8, 'resist-coercion': 6, 'resist-magic': 8, stealth: 3, 'wilderness-survival': 7 },
    attacks: [
      { name: 'Punch', skill: 'melee', damage: '6d6', effect: 'ROF 2' },
    ],
    abilities: 'Crushing Force: cannot be parried, double ablation to weapons, shields and armor. Thrown Boulders: past 6 m it throws rubble for 5d6, range 16 m. Resistances: half damage from piercing, bludgeoning and slashing.',
    weaknesses: 'Ogroid Oil. Soft Spot: its stomach has only 5 SP and no resistances.',
  },
  {
    name: 'Wolf',
    category: 'Beast',
    threat: 'Easy, Simple',
    page: 286,
    bounty: 10,
    stats: [1, 4, 6, 5, 7, 1, 1, 4, 0],
    hp: 20,
    sta: 20,
    sp: 0,
    skills: { athletics: 6, awareness: 6, brawling: 6, courage: 6, 'dodge-escape': 6, endurance: 5, melee: 6, 'resist-magic': 2, stealth: 6, 'wilderness-survival': 9 },
    attacks: [
      { name: 'Bite', skill: 'melee', damage: '2d6' },
    ],
    abilities: 'Scent Tracking. Night Vision. Leader: while a warg lives, its pack gets +4 Courage and takes simple orders.',
    weaknesses: 'Beast Oil.',
  },
  {
    name: 'Dog',
    category: 'Beast',
    threat: 'Not rated (animal)',
    page: 310,
    stats: [1, 3, 5, 3, 5, 4, 1, 5, 0],
    hp: 20,
    sta: 20,
    sp: 0,
    skills: { athletics: 3, awareness: 9, courage: 8, 'dodge-escape': 6, endurance: 10, melee: 7, stealth: 3, 'wilderness-survival': 8 },
    attacks: [
      { name: 'Bite', skill: 'melee', damage: '2d6' },
    ],
    abilities: 'Scent Tracking. Feral (INT 7 for Awareness and Wilderness Survival).',
    weaknesses: 'Beast Oil.',
  },
]

export const BESTIARY_CATEGORIES = [...new Set(BESTIARY.map((b) => b.category))]

export function bestiaryId(name: string): string {
  return 'bestiary-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const RESISTANCE = 'Monsters (except beasts) take half damage from any weapon not made of silver (core p. 162).'

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
  c.vigor = b.vigor ?? 0
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
  c.notes = [b.bounty ? `Bounty ${b.bounty} crowns` : '', b.category === 'Humanoid' || b.category === 'Beast' ? '' : RESISTANCE]
    .filter(Boolean)
    .join('\n')
  c.bestiary = b.estimate
    ? { category: b.category, threat: b.threat, page: null, confirmed: b.confirmed ?? '', checked: false }
    : { category: b.category, threat: b.threat, page: b.page ?? null, confirmed: '', checked: false, source: 'core' }
  return c
}

// Estimated entries replaced by A Witcher's Journal stat blocks.
export const RETIRED_ESTIMATES = ['Bear', 'Harpy', 'Leshen'].map(bestiaryId)

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

// One-time update to the core rulebook stat blocks: replaces seeded estimates the GM never ticked
// or edited with the book's versions (same id, so encounters keep pointing at them), and adds the
// book creatures the list doesn't have yet.
export function applyCoreBestiaryUpdate(characters: Character[]): Character[] {
  const book = new Map(BESTIARY.filter((b) => !b.estimate).map((b) => [bestiaryId(b.name), b]))
  const untouched = (c: Character) => c.bestiary && !c.bestiary.source && !c.bestiary.checked && c.updatedAt === c.createdAt
  const next = characters.map((c) => {
    const b = book.get(c.id)
    return b && untouched(c) ? bestiaryCharacter(b) : c
  })
  const have = new Set(next.map((c) => c.id))
  return [...next, ...[...book.values()].filter((b) => !have.has(bestiaryId(b.name))).map(bestiaryCharacter)]
}
