import { describe, expect, it } from 'vitest'
import { applyCampaignUpdate, campaignNpcs, CAMPAIGN_IDS } from '../model/campaign'
import { effectiveStat, toCombatant } from '../model/combat'
import {
  duplicateEntry,
  entriesFromTemplate,
  entryState,
  newEncounter,
  partyEntries,
  rollInitiative,
  turnOrder,
} from '../model/encounter'
import { missingNpcPack, RETIRED_PACK } from '../model/npcPack'
import type { Character } from '../model/types'
import { PROFESSIONS, RACES, SKILL_BY_ID } from '../rules/rules'

const d10 = (n: number) => () => n as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

describe('campaign NPCs', () => {
  const list = campaignNpcs()

  it('are the Lamplighter, his Captain and a deserter, marked unverified', () => {
    expect(list.map((c) => c.id)).toEqual(CAMPAIGN_IDS)
    for (const c of list) {
      expect(c.kind).toBe('npc')
      expect(c.bestiary).toBeUndefined()
      expect(c.notes).toContain('unverified')
    }
  })

  it('only use races, professions and skills the sheet knows, and start at full health', () => {
    for (const c of list) {
      expect(RACES).toContain(c.race)
      expect(PROFESSIONS.map((p) => p.name)).toContain(c.profession)
      for (const id of [...Object.keys(c.skills), ...c.weapons.map((w) => w.skillId)]) expect(SKILL_BY_ID[id], `${c.name}: ${id}`).toBeTruthy()
      const cb = toCombatant(c)
      expect(cb.hp.current).toBe(cb.hp.max)
      expect(cb.attacks.length).toBeGreaterThan(0)
    }
  })

  it('puts the Captain in full plate with a heavy longsword, EV counted once', () => {
    const cap = list.find((c) => c.id === 'campaign-captain')!
    expect(Object.values(cap.armor).every((a) => a.piece === 'Fitted full plate' && a.sp >= 20)).toBe(true)
    expect(effectiveStat(cap, 'REF')).toBe(cap.stats.REF - 3)
    expect(cap.weapons[0].damage).toBe('6d6')
    expect(cap.weapons[0].skillId).toBe('swordsmanship')
  })
})

describe('campaign update for an existing GM list', () => {
  const pack = missingNpcPack([])
  const oldPackEntry = (id: string, edited = false): Character => {
    const c = { ...campaignNpcs()[2], id, name: id, createdAt: 1, updatedAt: edited ? 2 : 1 }
    return c
  }

  it('drops unedited retired pack NPCs, keeps edited ones and the campaign ones', () => {
    const before = [...pack, oldPackEntry(RETIRED_PACK[0]), oldPackEntry(RETIRED_PACK[1], true)]
    const ids = applyCampaignUpdate(before).map((c) => c.id)
    expect(ids).not.toContain(RETIRED_PACK[0])
    expect(ids).toContain(RETIRED_PACK[1])
    for (const c of pack) expect(ids).toContain(c.id)
  })

  it('adds the two exceptional Journal monsters and the campaign NPCs once', () => {
    const once = applyCampaignUpdate([])
    expect(once.map((c) => c.id)).toEqual(['journal-true-dragon', 'journal-higher-vampire', ...CAMPAIGN_IDS])
    expect(applyCampaignUpdate(once)).toHaveLength(once.length)
  })
})

describe('party of names in the encounter tracker', () => {
  const party = [
    { id: 'a', name: 'Ada', ref: null },
    { id: 'b', name: 'Bren', ref: 7 },
    { id: 'c', name: '  ', ref: null },
  ]

  it('adds every named player in one go, skipping blanks and anyone already in', () => {
    const first = partyEntries(party)
    expect(first.map((x) => x.name)).toEqual(['Ada', 'Bren'])
    expect(first.every((x) => x.nameOnly && x.kind === 'pc' && x.characterId === null)).toBe(true)
    expect(partyEntries(party, first.slice(0, 1)).map((x) => x.name)).toEqual(['Bren'])
  })

  it('rolls for players with REF, leaves the rest for the GM to type, and waits to start', () => {
    const e = { ...newEncounter(), entries: partyEntries(party) }
    const rolled = rollInitiative(e, false, d10(5))
    expect(rolled.entries.find((x) => x.name === 'Bren')!.initiative).toBe(12)
    expect(rolled.entries.find((x) => x.name === 'Ada')!.initiative).toBeNull()
    expect(rolled.activeId).toBeNull()
    const typed = { ...rolled, entries: rolled.entries.map((x) => (x.name === 'Ada' ? { ...x, initiative: 15 } : x)) }
    expect(turnOrder(rollInitiative(typed, false, d10(1))).map((x) => x.name)).toEqual(['Ada', 'Bren'])
  })

  it('never shows a name-only player as dying', () => {
    expect(entryState(partyEntries(party)[0])).toBe('ok')
  })
})

describe('copies of NPCs', () => {
  const deserter = campaignNpcs()[2]

  it('numbers a second batch after the first', () => {
    const first = entriesFromTemplate(deserter, 2)
    const second = entriesFromTemplate(deserter, 2, first.map((x) => x.name))
    expect([...first, ...second].map((x) => x.name)).toEqual([1, 2, 3, 4].map((n) => `Captain's deserter ${n}`))
  })

  it('duplicates a wounded combatant at full health with the next number', () => {
    const [a] = entriesFromTemplate(deserter, 1)
    const hurt = { ...a, hp: { ...a.hp, current: 3 }, defeated: true }
    const copy = duplicateEntry(hurt, [hurt])
    expect(copy.name).toBe("Captain's deserter 2")
    expect(copy.hp.current).toBe(copy.hp.max)
    expect(copy.defeated).toBe(false)
    expect(copy.id).not.toBe(hurt.id)
  })
})
