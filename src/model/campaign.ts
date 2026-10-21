import { HIT_LOCATIONS, type HitLocation, type Stats } from '../rules/rules'
import { derived } from './combat'
import { applyProfession, newCharacter } from './factory'
import { journalCharacter, JOURNAL_MONSTERS } from './journalBestiary'
import { RETIRED_PACK } from './npcPack'
import type { ArmorSlot, Character, Spell, Weapon } from './types'

// NPCs made for Jacob's campaign (The Lamplighter's Gates). These are original stat blocks, not
// from any book: stats, skills and abilities are UNVERIFIED estimates for play, and each sheet says
// so. The Captain's and the deserters' armor and weapons are core rulebook items (catalog.ts).

// Named on 2026-10-21; GMs seeded before that have him as "The Captain".
export const CAPTAIN_NAME = 'Captain Darvel aep Moriann'

const UNVERIFIED = 'Original stat block made for this campaign. Every number is an estimate (unverified), not from a book.'
const UNVERIFIED_BOOK_GEAR =
  'Original stat block made for this campaign: stats, skills and abilities are estimates (unverified). Armor and weapons are core rulebook items (armor p. 79-80, weapons p. 73-74).'

function stats(s: string): Stats {
  const [INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK] = s.split(' ').map(Number)
  return { INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK }
}

// One armor piece per entry; a piece listed on several locations counts its EV once (combat.ts).
function armor(spec: Array<[HitLocation[], string, number, number]>): Record<HitLocation, ArmorSlot> {
  const a = Object.fromEntries(HIT_LOCATIONS.map((l) => [l, { piece: '', sp: 0, maxSp: 0 }])) as Record<HitLocation, ArmorSlot>
  for (const [locs, piece, sp, ev] of spec) for (const l of locs) a[l] = { piece, sp, maxSp: sp, ev }
  return a
}

function weapon(id: string, w: Omit<Weapon, 'id' | 'notes'> & { notes?: string }): Weapon {
  return { notes: '', ...w, id }
}

function spell(id: string, s: Omit<Spell, 'id'>): Spell {
  return { ...s, id }
}

function npc(id: string, name: string, profession: string, fill: Partial<Character>, hp: number | null, sta: number | null): Character {
  const c = applyProfession({ ...newCharacter('npc', name), id, ...fill }, profession)
  c.hp = { current: 0, maxOverride: hp }
  c.sta = { current: 0, maxOverride: sta }
  c.luckCurrent = c.stats.LUCK
  // Start at full: the derived maximum unless overridden.
  const d = derived(c)
  c.hp.current = d.maxHp
  c.sta.current = d.maxSta
  return c
}

const ARMS: HitLocation[] = ['rArm', 'lArm']
const LEGS: HitLocation[] = ['rLeg', 'lLeg']

function lamplighter(): Character {
  const id = 'campaign-lamplighter'
  return npc(
    id,
    'The Lamplighter',
    'Mage',
    {
      race: 'Human',
      gender: 'Male',
      age: 'Looks 40',
      stats: stats('10 6 6 5 6 7 8 9 4'),
      skills: {
        awareness: 5,
        education: 8,
        deduction: 5,
        'monster-lore': 3,
        'social-etiquette': 5,
        'language-common-speech': 8,
        'language-elder-speech': 7,
        'staff-spear': 4,
        'dodge-escape': 4,
        'grooming-and-style': 6,
        persuasion: 5,
        deceit: 5,
        'human-perception': 4,
        alchemy: 4,
        crafting: 5,
        courage: 4,
        'spell-casting': 8,
        'ritual-crafting': 9,
        'resist-magic': 6,
      },
      definingSkillValue: 6,
      vigor: 7,
      armor: armor([[['torso', ...ARMS], 'Enchanted greatcoat', 6, 0]]),
      weapons: [
        weapon(`${id}-w0`, { name: 'Focus staff', skillId: 'staff-spear', accuracy: 0, damage: '1d6+2', reliability: 10, hands: 2, range: '', effect: 'Focus (2), Long Reach' }),
        weapon(`${id}-w1`, { name: 'Dagger', skillId: 'small-blades', accuracy: 0, damage: '1d6+2', reliability: 10, hands: 1, range: '', effect: '' }),
      ],
      spells: [
        spell(`${id}-s0`, { name: 'Lantern Flare', kind: 'Spell', staCost: '4', range: '4m radius', duration: '1 round', defense: 'Dodge (look away)', effect: 'A burst of white gate-light: everyone facing him who fails is blinded until the end of their next turn.' }),
        spell(`${id}-s1`, { name: 'Gate Step', kind: 'Spell', staCost: '6', range: '15m', duration: 'Immediate', defense: 'None', effect: 'Steps through a pocket portal to a spot he can see. Takes his move; leaves a smell of ozone.' }),
        spell(`${id}-s2`, { name: 'Arc of Sparks', kind: 'Spell', staCost: '5', range: '8m', duration: 'Immediate', defense: 'Dodge', effect: '4d6 fire to one target; 25% chance to set them Burning.' }),
        spell(`${id}-s3`, { name: 'Kindled Glyph', kind: 'Ritual', staCost: '6', range: 'Touch', duration: 'Until triggered', defense: 'Dodge/Escape DC 14 for half', effect: 'A painted fire ward: 3d6 fire to everyone within 2m when disturbed (the ward on his desk in the Saltcellar). Magic Training DC 16 spots and dispels it.' }),
        spell(`${id}-s4`, { name: 'Paired Gate', kind: 'Ritual', staCost: '10 to open', range: 'About 100 miles', duration: 'Until collapsed', defense: 'None', effect: 'Links a carved stone frame to an anchor stone. Weeks to build, one round to open, moves about 20 people. Overloads if more go through than it was tuned for. He can collapse it behind him.' }),
      ],
      items: [
        { id: `${id}-i0`, name: 'Grimoire of gate theory', qty: 1, weight: 1.5, notes: 'Worth a fortune to an academy' },
        { id: `${id}-i1`, name: 'Portal reagents and chalk', qty: 1, weight: 1, notes: '' },
        { id: `${id}-i2`, name: 'Receipt book: "the gate, and its twin"', qty: 1, weight: 0.2, notes: 'He has sold six paired gates across the region' },
      ],
      crowns: 600,
      perks:
        'Always a way out: if he drops below 15 HP within reach of one of his gates, he spends a round and 10 STA to flee through it.\nDimeritium shackles stop all his magic.\nVain and talkative: flattery or professional curiosity gets him chatting (Deduction or Magic Training DC 14 to learn something useful).',
      background:
        'A renegade mage who sells paired gates to anyone who pays. The smugglers named him for the glow of his portals; nobody knows his real name. He thinks Lord Kerrow is only running contraband and has no idea the Order of the Pale Flame is buying his gates, and wants him delivered alive once the last shipment is through.',
      notes: `Campaign villain · Threat: Hard\n\n${UNVERIFIED}\n\nTactics: never fights fair or long. Flare, then Gate Step out of reach, then sparks from cover. Shown the Order's ledger, he can flee through his half-built gate, help the party for protection, or be handed over.`,
    },
    null,
    50,
  )
}

// Full plate from the core rulebook: Great Helm SP 20, Plate Armor SP 20 EV 2 (torso and arms),
// Plate Greaves SP 20 EV 1 (core p. 79-80). EV 3 in all, off REF and DEX.
function captainArmor(): Record<HitLocation, ArmorSlot> {
  return armor([
    [['head'], 'Great Helm', 20, 0],
    [['torso', ...ARMS], 'Plate Armor', 20, 2],
    [LEGS, 'Plate Greaves', 20, 1],
  ])
}

// A Torrwr (core p. 73): 6d6, Bleeding (50%), two-handed, reliability 15.
function captainSword(id: string): Weapon {
  return weapon(`${id}-w0`, {
    name: 'Torrwr "Last Orders"',
    skillId: 'swordsmanship',
    accuracy: 0,
    damage: '6d6',
    reliability: 15,
    hands: 2,
    range: '',
    effect: 'Bleeding (50%)',
    notes: 'A Torrwr (core p. 73), swung two-handed. His own blade; the deserters will die before they let it be taken.',
  })
}

// Double Woven Hood SP 5, Double Woven Gambeson SP 8, Double Woven Trousers SP 8 (core p. 79-80).
function deserterArmor(): Record<HitLocation, ArmorSlot> {
  return armor([
    [['head'], 'Double Woven Hood', 5, 0],
    [['torso', ...ARMS], 'Double Woven Gambeson', 8, 0],
    [LEGS, 'Double Woven Trousers', 8, 0],
  ])
}

// Arming Sword and Crossbow (core p. 73-74).
function deserterWeapons(id: string): Weapon[] {
  return [
    weapon(`${id}-w0`, { name: 'Arming Sword', skillId: 'swordsmanship', accuracy: 0, damage: '2d6+4', reliability: 15, hands: 1, range: '', effect: '' }),
    weapon(`${id}-w1`, { name: 'Crossbow', skillId: 'crossbow', accuracy: 1, damage: '4d6+2', reliability: 5, hands: 2, range: '100 m', effect: 'Slow Reload' }),
  ]
}

function captain(): Character {
  const id = 'campaign-captain'
  return npc(
    id,
    CAPTAIN_NAME,
    'Man-At-Arms',
    {
      race: 'Human',
      gender: 'Male',
      age: 'Mid 40s',
      stats: stats('6 10 7 10 5 5 4 8 3'),
      skills: {
        awareness: 6,
        tactics: 7,
        'language-common-speech': 6,
        swordsmanship: 9,
        melee: 5,
        brawling: 6,
        'dodge-escape': 4,
        riding: 5,
        athletics: 5,
        physique: 7,
        endurance: 7,
        leadership: 8,
        'human-perception': 5,
        courage: 8,
        intimidation: 7,
        'resist-coercion': 6,
      },
      definingSkillValue: 6,
      armor: captainArmor(),
      weapons: [
        captainSword(id),
        weapon(`${id}-w1`, { name: 'Gauntlet strike', skillId: 'brawling', accuracy: 0, damage: '1d6+2', reliability: 10, hands: 1, range: '', effect: 'Stun (−2)' }),
      ],
      items: [
        { id: `${id}-i0`, name: "Map case and dispatch satchel (from the Saltcellar)", qty: 1, weight: 2, notes: '' },
        { id: `${id}-i1`, name: 'Officer’s cloak, unit badge cut off', qty: 1, weight: 1, notes: '' },
      ],
      crowns: 150,
      perks:
        'Devastating cut: when a sword attack beats the defense by 5 or more, add 2d6 damage.\nRally (his action): every deserter who can hear him shakes off Staggered and regains 5 STA.\nHold the line: while he stands, his men do not rout.\nFull plate: the sheet already applies the EV (REF and DEX shown 3 lower). The great helm has Restricted Vision (core p. 151).',
      background:
        "Commander of a company that deserted after a lost battle; prices on all their heads. Kerrow hides them in return for muscle, and the Lamplighter's gate moved them out of the Saltcellar. Tired, fair and honest about what his men are. He refuses to have a prisoner quietly drowned. One of his men dropped a Nilfgaardian-style gauntlet in the ritual chamber.",
      notes: `The Lamplighter's captain · Threat: Hard (Deadly with 6–8 deserters)\n\n${UNVERIFIED_BOOK_GEAR}\n\nNamed by Jacob's ask on 2026-10-21. He is a soldier, not a fanatic: with the Order's ledger in hand the party can talk him down (Persuasion DC 18). If not, he fights in the cellar with his deserters, front and centre, cutting at whoever hurt his men last.`,
    },
    60,
    50,
  )
}

function deserter(): Character {
  const id = 'campaign-deserter'
  return npc(
    id,
    "Captain's deserter",
    'Man-At-Arms',
    {
      race: 'Human',
      stats: stats('4 6 6 6 5 4 4 5 2'),
      skills: { awareness: 3, swordsmanship: 5, 'dodge-escape': 4, crossbow: 4, athletics: 3, endurance: 4, courage: 4, gambling: 3 },
      definingSkillValue: 2,
      armor: deserterArmor(),
      weapons: deserterWeapons(id),
      perks: 'Fights hard while the Captain stands. If he falls or surrenders, each one makes a Courage check (DC 14) or yields.',
      background: 'One of the roughly 14 soldiers who followed the Captain through the gate. They want a pardon and a way home.',
      notes: `Rank-and-file soldier · Threat: Easy (use 6–8 with the Captain)\n\n${UNVERIFIED_BOOK_GEAR}\n\nAdd several at once from the encounter tracker.`,
    },
    null,
    null,
  )
}

export function nameCaptain(characters: Character[]): Character[] {
  return characters.map((c) => (c.id === 'campaign-captain' && c.name === 'The Captain' ? { ...c, name: CAPTAIN_NAME } : c))
}

export const CAMPAIGN_IDS = ['campaign-lamplighter', 'campaign-captain', 'campaign-deserter']

export function campaignNpcs(): Character[] {
  return [lamplighter(), captain(), deserter()]
}

// Journal monsters added after the first Journal update (exceptional monsters, base stat blocks).
const NEW_JOURNAL = ['True Dragon', 'Higher Vampire']

// One-time update for a GM list seeded before 2026-10-21: drops the pack NPCs the campaign doesn't
// use (unless the GM edited them), and adds the two exceptional Journal monsters and the campaign
// NPCs. Anything the GM deletes afterwards stays deleted.
export function applyCampaignUpdate(characters: Character[]): Character[] {
  const retired = new Set(RETIRED_PACK)
  const kept = characters.filter((c) => !(retired.has(c.id) && c.updatedAt === c.createdAt))
  const have = new Set(kept.map((c) => c.id))
  const journal = JOURNAL_MONSTERS.filter((m) => NEW_JOURNAL.includes(m.name)).map(journalCharacter)
  return [...kept, ...[...journal, ...campaignNpcs()].filter((c) => !have.has(c.id))]
}

// New armor at the same wear as the old: keeps any SP the old piece had lost.
function reArmor(old: Record<HitLocation, ArmorSlot>, next: Record<HitLocation, ArmorSlot>): Record<HitLocation, ArmorSlot> {
  const out = { ...next }
  for (const l of HIT_LOCATIONS) {
    const lost = Math.max(0, (old[l]?.maxSp ?? 0) - (old[l]?.sp ?? 0))
    out[l] = { ...next[l], sp: Math.max(0, next[l].maxSp - lost) }
  }
  return out
}

// One-time update (core rulebook pass, 2026-10-21): the Captain's and the deserters' armor and
// weapons become the book's items. Applies to each sheet that still carries the original gear, even
// if the GM has played it since; wounds, names and everything else stay as they are.
export function applyCampaignGearUpdate(characters: Character[]): Character[] {
  const note = (s: string) => s.replace(UNVERIFIED, UNVERIFIED_BOOK_GEAR)
  return characters.map((c) => {
    if (c.id === 'campaign-captain' && c.weapons[0]?.name === 'Longsword "Last Orders"')
      return {
        ...c,
        armor: reArmor(c.armor, captainArmor()),
        weapons: [captainSword(c.id), ...c.weapons.slice(1)],
        perks: c.perks
          .replace('when a longsword attack', 'when a sword attack')
          .replace('(REF and DEX shown 3 lower).', '(REF and DEX shown 3 lower). The great helm has Restricted Vision (core p. 151).'),
        notes: note(c.notes),
      }
    if (c.id === 'campaign-deserter' && c.weapons[1]?.name === 'Crossbow' && c.weapons[1].effect === 'Armor Piercing')
      return { ...c, armor: reArmor(c.armor, deserterArmor()), weapons: deserterWeapons(c.id), notes: note(c.notes) }
    return c
  })
}
