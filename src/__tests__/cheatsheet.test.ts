import { describe, expect, it } from 'vitest'
import { CHEAT_SHEET, searchCheatSheet } from '../model/cheatsheet'

describe('GM cheat sheet', () => {
  it('covers the five topics Jacob asked for', () => {
    expect(CHEAT_SHEET.map((t) => t.title)).toEqual(['Combat', 'Social combat', 'Saves', 'Criticals', 'Magic'])
  })

  it('gives every entry a page reference and some content', () => {
    for (const t of CHEAT_SHEET)
      for (const e of t.entries) {
        expect(e.page, e.title).toMatch(/p\. \d+|see each page/)
        expect((e.lines?.length ?? 0) + (e.table?.rows.length ?? 0) + (e.items?.length ?? 0), e.title).toBeGreaterThan(0)
      }
  })

  it('has six wounds in each critical table', () => {
    const crit = CHEAT_SHEET.find((t) => t.id === 'criticals')!
    for (const level of ['Simple', 'Complex', 'Difficult', 'Deadly'])
      expect(crit.entries.find((e) => e.title === level)?.items).toHaveLength(6)
  })

  it('searches across topics with every word', () => {
    const hits = searchCheatSheet('stun save')
    expect(hits.map((h) => h.topic.id)).toContain('saves')
    expect(searchCheatSheet('parry')[0].entries.map((e) => e.title)).toContain('Defenses')
    expect(searchCheatSheet('zzzz')).toEqual([])
    expect(searchCheatSheet('').flatMap((h) => h.entries)).toHaveLength(CHEAT_SHEET.flatMap((t) => t.entries).length)
  })
})
