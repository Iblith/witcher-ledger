import { HIT_LOCATIONS, PROFESSIONS, STAT_KEYS, type HitLocation, type Stats } from '../rules/rules'
import { SCHEMA_VERSION, type ArmorSlot, type Character, type CharacterKind } from './types'
import { derived } from './combat'

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function emptyArmor(): Record<HitLocation, ArmorSlot> {
  return Object.fromEntries(HIT_LOCATIONS.map((l) => [l, { piece: '', sp: 0, maxSp: 0 }])) as Record<
    HitLocation,
    ArmorSlot
  >
}

export function newCharacter(kind: CharacterKind = 'pc', name = 'New character'): Character {
  const stats = Object.fromEntries(STAT_KEYS.map((k) => [k, 5])) as Stats
  const now = Date.now()
  const c: Character = {
    id: uid(),
    schema: SCHEMA_VERSION,
    kind,
    name,
    player: '',
    race: 'Human',
    profession: '',
    definingSkill: '',
    definingSkillValue: 0,
    school: '',
    age: '',
    gender: '',
    homeland: '',
    stats,
    skills: {},
    customSkills: [],
    hp: { current: 0, maxOverride: null },
    sta: { current: 0, maxOverride: null },
    luckCurrent: stats.LUCK,
    vigor: 0,
    armor: emptyArmor(),
    weapons: [],
    crits: [],
    lifeEvents: [],
    conditions: '',
    items: [],
    crowns: 0,
    spells: [],
    perks: '',
    background: '',
    notes: '',
    ip: 0,
    createdAt: now,
    updatedAt: now,
  }
  const d = derived(c)
  c.hp.current = d.maxHp
  c.sta.current = d.maxSta
  return c
}

export function applyProfession(c: Character, profession: string): Character {
  const p = PROFESSIONS.find((x) => x.name === profession)
  return {
    ...c,
    profession,
    definingSkill: p ? p.definingSkill : c.definingSkill,
    vigor: p ? p.vigor : c.vigor,
  }
}

// Filled-in examples so a fresh install shows what a sheet looks like. They're named as examples.
export function sampleCharacters(): Character[] {
  const witcher = newCharacter('pc', 'Vesemir-style witcher (example)')
  Object.assign(witcher, {
    player: 'Example player',
    race: 'Witcher',
    profession: 'Witcher',
    definingSkill: 'Witcher Training',
    definingSkillValue: 3,
    school: 'Wolf',
    age: '74',
    homeland: 'Kaedwen',
    stats: { INT: 6, REF: 8, DEX: 7, BODY: 7, SPD: 6, EMP: 3, CRA: 5, WILL: 6, LUCK: 3 },
    skills: {
      awareness: 5,
      'monster-lore': 5,
      'wilderness-survival': 3,
      'dodge-escape': 5,
      swordsmanship: 6,
      riding: 3,
      athletics: 4,
      endurance: 3,
      alchemy: 4,
      courage: 4,
      'spell-casting': 3,
      'resist-magic': 3,
    },
    vigor: 2,
    crowns: 120,
    luckCurrent: 3,
    perks: 'Witcher mutations: enhanced senses, resistant to poisons and disease, emotionless.',
  })
  witcher.armor.torso = { piece: 'Brigandine', sp: 10, maxSp: 10 }
  witcher.armor.rLeg = witcher.armor.lLeg = { piece: 'Armored trousers', sp: 8, maxSp: 8 }
  witcher.weapons = [
    { id: uid(), name: 'Steel sword', skillId: 'swordsmanship', accuracy: 0, damage: '2d6+2', reliability: 10, hands: 2, range: '', effect: '', notes: '' },
    { id: uid(), name: 'Silver sword', skillId: 'swordsmanship', accuracy: 0, damage: '1d6+2 (3d6 vs monsters)', reliability: 10, hands: 2, range: '', effect: 'Silver', notes: '' },
  ]
  witcher.spells = [
    { id: uid(), name: 'Igni', kind: 'Sign', staCost: '1-5', range: '4m', duration: 'Immediate', defense: 'Dodge/Block', effect: '1d6 per STA spent, 50% ignite' },
    { id: uid(), name: 'Quen', kind: 'Sign', staCost: '1-5', range: 'Self', duration: 'Active', defense: 'None', effect: 'Shield of 5 SP per STA spent' },
  ]
  witcher.lifeEvents = [
    { id: uid(), when: 'Age 7', kind: 'Family', title: 'Taken by the witchers', details: 'Claimed under the Law of Surprise and brought to Kaer Morhen.' },
    { id: uid(), when: 'Age 30s', kind: 'Enemy', title: 'Crossed a Nilfgaardian officer', details: 'Refused a contract; the officer swore revenge.' },
    { id: uid(), when: 'Session 1', kind: 'Campaign', title: 'Took the drowner contract at the ford', details: '' },
  ]
  witcher.crits = [
    { id: uid(), location: 'torso', severity: 'complex', description: 'Cracked ribs', effect: 'Check the critical wound table for its penalty', when: 'Session 1', treated: true, healed: false },
  ]
  witcher.items = [
    { id: uid(), name: 'Swallow potion', qty: 2, weight: 0.1, notes: '' },
    { id: uid(), name: 'Rations', qty: 5, weight: 0.5, notes: '' },
  ]
  resetTrackers(witcher)

  const bandit = newCharacter('npc', 'Road bandit (example)')
  Object.assign(bandit, {
    race: 'Human',
    stats: { INT: 4, REF: 6, DEX: 5, BODY: 6, SPD: 5, EMP: 3, CRA: 3, WILL: 4, LUCK: 0 },
    skills: { awareness: 3, brawling: 3, 'dodge-escape': 3, melee: 4, intimidation: 4, streetwise: 3 },
    crowns: 15,
    notes: 'Works in a gang of 3-5 near the Pontar crossings.',
  })
  bandit.armor.torso = { piece: 'Gambeson', sp: 4, maxSp: 4 }
  bandit.weapons = [
    { id: uid(), name: 'Hand axe', skillId: 'melee', accuracy: 0, damage: '3d6', reliability: 7, hands: 1, range: '', effect: '', notes: '' },
  ]
  resetTrackers(bandit)

  return [witcher, bandit]
}

function resetTrackers(c: Character) {
  const d = derived(c)
  c.hp.current = d.maxHp
  c.sta.current = d.maxSta
  c.luckCurrent = c.stats.LUCK
}
