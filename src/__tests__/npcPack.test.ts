import { describe, expect, it } from 'vitest'
import { derived, toCombatant } from '../model/combat'
import { missingNpcPack } from '../model/npcPack'
import { PROFESSIONS, RACES, SKILL_BY_ID } from '../rules/rules'

describe('original NPC pack', () => {
  const pack = missingNpcPack([])

  it('loads 30 GM NPCs with unique ids', () => {
    expect(pack).toHaveLength(30)
    expect(new Set(pack.map((c) => c.id)).size).toBe(30)
    for (const c of pack) expect(c.kind).toBe('npc')
  })

  it('only uses races, professions and skills the sheet knows', () => {
    for (const c of pack) {
      expect(RACES).toContain(c.race)
      expect(['', ...PROFESSIONS.map((p) => p.name)]).toContain(c.profession)
      for (const id of [...Object.keys(c.skills), ...c.weapons.map((w) => w.skillId)]) expect(SKILL_BY_ID[id], `${c.name}: ${id}`).toBeTruthy()
    }
  })

  it('starts every sheet at full health and works in the encounter tracker', () => {
    for (const c of pack) {
      expect(c.hp.current).toBe(derived(c).maxHp)
      expect(toCombatant(c).attacks.length).toBeGreaterThan(0)
    }
  })

  it('skips entries the GM already has', () => {
    expect(missingNpcPack(pack.slice(1)).map((c) => c.id)).toEqual([pack[0].id])
  })
})
