import { HIT_LOCATIONS, type HitLocation, type Stats } from '../rules/rules'
import { derived } from './combat'
import { applyProfession, newCharacter } from './factory'
import { journalCharacter, JOURNAL_MONSTERS } from './journalBestiary'
import { RETIRED_PACK } from './npcPack'
import type { ArmorSlot, Character, Spell, Weapon } from './types'

// NPCs made for Jacob's campaign (The Lamplighter's Gates). These are original stat blocks, not
// from any book: every number is an UNVERIFIED estimate for play, and each sheet says so. Weapon
// and armor numbers follow the app's item catalog where a catalog item fits (also unverified).

// Named on 2026-10-21; GMs seeded before that have him as "The Captain".
export const CAPTAIN_NAME = 'Captain Darvel aep Moriann'

const UNVERIFIED = 'Original stat block made for this campaign. Every number is an estimate (unverified), not from a book.'

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

function captain(): Character {
  const id = 'campaign-captain'
  const plate: HitLocation[] = ['torso', ...ARMS, ...LEGS]
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
      // Fitted full plate, one piece over every location, so its EV of 3 counts once (REF and DEX -3).
      armor: (() => {
        const a = armor([[plate, 'Fitted full plate', 25, 3]])
        a.head = { piece: 'Fitted full plate', sp: 20, maxSp: 20, ev: 3 }
        return a
      })(),
      weapons: [
        weapon(`${id}-w0`, {
          name: 'Longsword "Last Orders"',
          skillId: 'swordsmanship',
          accuracy: 1,
          damage: '6d6',
          reliability: 20,
          hands: 2,
          range: '',
          effect: 'Armor Piercing, Bleeding (50%), Balanced',
          notes: 'Hand-and-a-half longsword, swung two-handed. His own blade; the deserters will die before they let it be taken.',
        }),
        weapon(`${id}-w1`, { name: 'Gauntlet strike', skillId: 'brawling', accuracy: 0, damage: '1d6+2', reliability: 10, hands: 1, range: '', effect: 'Stun (−2)' }),
      ],
      items: [
        { id: `${id}-i0`, name: "Map case and dispatch satchel (from the Saltcellar)", qty: 1, weight: 2, notes: '' },
        { id: `${id}-i1`, name: 'Officer’s cloak, unit badge cut off', qty: 1, weight: 1, notes: '' },
      ],
      crowns: 150,
      perks:
        'Devastating cut: when a longsword attack beats the defense by 5 or more, add 2d6 damage.\nRally (his action): every deserter who can hear him shakes off Staggered and regains 5 STA.\nHold the line: while he stands, his men do not rout.\nFull plate: the sheet already applies the EV (REF and DEX shown 3 lower).',
      background:
        "Commander of a company that deserted after a lost battle; prices on all their heads. Kerrow hides them in return for muscle, and the Lamplighter's gate moved them out of the Saltcellar. Tired, fair and honest about what his men are. He refuses to have a prisoner quietly drowned. One of his men dropped a Nilfgaardian-style gauntlet in the ritual chamber.",
      notes: `The Lamplighter's captain · Threat: Hard (Deadly with 6–8 deserters)\n\n${UNVERIFIED}\n\nNamed by Jacob's ask on 2026-10-21. He is a soldier, not a fanatic: with the Order's ledger in hand the party can talk him down (Persuasion DC 18). If not, he fights in the cellar with his deserters, front and centre, cutting at whoever hurt his men last.`,
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
      armor: armor([
        [['head'], 'Armored Hood', 8, 0],
        [['torso', ...ARMS], 'Double Woven Gambeson', 8, 0],
        [LEGS, 'Lyrian Leather Trousers', 8, 0],
      ]),
      weapons: [
        weapon(`${id}-w0`, { name: 'Arming Sword', skillId: 'swordsmanship', accuracy: 0, damage: '2d6+2', reliability: 10, hands: 1, range: '', effect: '' }),
        weapon(`${id}-w1`, { name: 'Crossbow', skillId: 'crossbow', accuracy: 0, damage: '4d6', reliability: 10, hands: 2, range: '100 m', effect: 'Armor Piercing' }),
      ],
      perks: 'Fights hard while the Captain stands. If he falls or surrenders, each one makes a Courage check (DC 14) or yields.',
      background: 'One of the roughly 14 soldiers who followed the Captain through the gate. They want a pardon and a way home.',
      notes: `Rank-and-file soldier · Threat: Easy (use 6–8 with the Captain)\n\n${UNVERIFIED}\n\nAdd several at once from the encounter tracker.`,
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
