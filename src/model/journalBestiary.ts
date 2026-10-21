import { HIT_LOCATIONS, SKILL_BY_ID, slug, type StatKey, type Stats } from '../rules/rules'
import { newCharacter, uid } from './factory'
import { JOURNAL_MONSTERS } from './journalBestiary.data'
import type { Character } from './types'

// Monsters with full stat blocks from A Witcher's Journal, the bestiary supplement in the
// project's rules folder. Unlike the estimates in bestiary.ts, these numbers are the book's.

export interface JournalAttack {
  name: string
  base: number
  type: string
  damage: string
  reliability: number
  range: string
  effect: string
  rof: number
}

export interface JournalMonster {
  name: string
  page: number
  category: string
  threat: string
  intelligence: string
  senses: string
  // INT REF DEX BODY SPD EMP CRA WILL
  stats: [number, number, number, number, number, number, number, number]
  hp: number
  sta: number
  armor: number
  regeneration: string
  resistances: string
  immunities: string
  susceptibilities: string
  // Skill bases as printed: the stat is already included.
  skills: Record<string, number>
  dodge: number
  reposition: number | null
  block: number
  attacks: JournalAttack[]
  abilities: string[]
  bounty: string
  environment: string
  organization: string
}

export { JOURNAL_MONSTERS }

export const JOURNAL_TITLE = "A Witcher's Journal"

export function journalId(name: string): string {
  return 'journal-' + slug(name)
}

const DAMAGE_TYPE: Record<string, string> = { P: 'Piercing', S: 'Slashing', B: 'Bludgeoning', E: 'Elemental' }

function describeType(t: string): string {
  return t
    .split('/')
    .map((x) => DAMAGE_TYPE[x] ?? x)
    .join('/')
}

// Monster attacks use Melee (errata p. 51). The book gives each attack its own base, so Melee is set
// from the first attack and the others carry the difference as weapon accuracy.
export function journalCharacter(m: JournalMonster): Character {
  const c = newCharacter('npc', m.name)
  const [INT, REF, DEX, BODY, SPD, EMP, CRA, WILL] = m.stats
  const stats: Stats = { INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK: 0 }
  c.id = journalId(m.name)
  c.race = 'Monster'
  c.stats = stats
  c.luckCurrent = 0
  const skills: Record<string, number> = {}
  for (const [name, base] of Object.entries(m.skills)) {
    const def = SKILL_BY_ID[slug(name)]
    if (def) skills[def.id] = base - stats[def.stat]
    else c.customSkills.push({ id: slug(name), name, stat: 'INT' satisfies StatKey, value: base - INT })
  }
  skills['dodge-escape'] = m.dodge - REF
  const lead = m.attacks[0]
  if (lead) skills.melee = lead.base - REF
  c.skills = skills
  c.hp = { current: m.hp, maxOverride: m.hp }
  c.sta = { current: m.sta, maxOverride: m.sta }
  for (const l of HIT_LOCATIONS) c.armor[l] = { piece: m.armor ? 'Natural armor' : '', sp: m.armor, maxSp: m.armor }
  c.weapons = m.attacks.map((a) => ({
    id: uid(),
    name: a.name,
    skillId: 'melee',
    accuracy: a.base - (lead?.base ?? a.base),
    damage: a.damage,
    reliability: a.reliability,
    hands: 0,
    range: a.range,
    effect: [describeType(a.type), a.effect, `ROF ${a.rof}`].filter(Boolean).join(', '),
    notes: `Attack base ${a.base}`,
  }))
  c.perks = `Abilities (rules in ${JOURNAL_TITLE} p. ${m.page}): ${m.abilities.join(', ') || 'none'}`
  c.notes = [
    `${m.intelligence}${m.senses ? ` · ${m.senses}` : ''}`,
    m.regeneration && `Regeneration: ${m.regeneration} HP a turn`,
    m.resistances && `Resistant: ${m.resistances}`,
    m.immunities && `Immune: ${m.immunities}`,
    m.susceptibilities && `Susceptible: ${m.susceptibilities}`,
    `Defense bases: Dodge ${m.dodge}, Reposition ${m.reposition ?? '—'}, Block ${m.block}`,
    `Bounty ${m.bounty} crowns · ${m.environment} · ${m.organization}`,
    m.category === 'Beast' ? '' : 'Monsters (except beasts) take half damage from non-silver weapons, but not from fire (errata p. 162).',
  ]
    .filter(Boolean)
    .join('\n')
  c.bestiary = { category: m.category, threat: m.threat, page: m.page, confirmed: '', checked: false, source: 'journal' }
  return c
}
