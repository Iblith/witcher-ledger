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
  isNameOnlySheet,
  turnOrder,
  writeBack,
} from '../model/encounter'
import { newPlayer } from '../model/factory'
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

describe('players added by name, race and profession', () => {
  const ada = newPlayer('  Ada ', 'Elf', 'Bard')
  const bren = newPlayer('Bren', 'Human', 'Mage')
  const full = { ...newPlayer('Cass', 'Dwarf', 'Man-At-Arms'), stats: { ...ada.stats, REF: 7 } }
  const players = [bren, ada, full, campaignNpcs()[0]]

  it('keeps the name, race and profession and leaves the rest blank', () => {
    expect([ada.name, ada.race, ada.profession, ada.definingSkill, ada.kind]).toEqual(['Ada', 'Elf', 'Bard', 'Busking', 'pc'])
    expect(isNameOnlySheet(ada)).toBe(true)
    expect(isNameOnlySheet(full)).toBe(false)
  })

  it('adds every player in one go, name-only or full sheet, skipping NPCs and anyone already in', () => {
    const first = partyEntries(players)
    expect(first.map((x) => x.name)).toEqual(['Ada', 'Bren', 'Cass'])
    expect(first.map((x) => !!x.nameOnly)).toEqual([true, true, false])
    expect(first[0].notes).toBe('Elf · Bard')
    expect(partyEntries(players, first.slice(0, 1)).map((x) => x.name)).toEqual(['Bren', 'Cass'])
  })

  it('rolls for full sheets, leaves name-only players to type their own, and waits to start', () => {
    const e = { ...newEncounter(), entries: partyEntries(players) }
    const rolled = rollInitiative(e, false, d10(5))
    expect(rolled.entries.find((x) => x.name === 'Cass')!.initiative).toBe(12)
    expect(rolled.entries.find((x) => x.name === 'Ada')!.initiative).toBeNull()
    expect(rolled.activeId).toBeNull()
    const typed = { ...rolled, entries: rolled.entries.map((x) => (x.nameOnly ? { ...x, initiative: x.name === 'Ada' ? 15 : 3 } : x)) }
    expect(turnOrder(rollInitiative(typed, false, d10(1))).map((x) => x.name)).toEqual(['Ada', 'Cass', 'Bren'])
  })

  it('never shows a name-only player as dying, or saves its empty numbers to the sheet', () => {
    const [entry] = partyEntries([ada])
    expect(entryState(entry)).toBe('ok')
    const e = { ...newEncounter(), entries: [{ ...entry, hp: { current: -5, max: 0 } }] }
    expect(writeBack(e, [ada])[0]).toBe(ada)
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
