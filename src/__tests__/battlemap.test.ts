import { describe, expect, it } from 'vitest'
import { livePositions, mapOf, moveToken, newMap, placeEveryone, removeToken, resizeMap, tokenLabel } from '../model/battlemap'
import { monsterEntries, newEncounter, searchNpcs, type EncounterEntry } from '../model/encounter'
import { newCharacter } from '../model/factory'
import type { Character } from '../model/types'

const MON = { name: 'Drowner', count: 3, hp: 20, sta: 20, ref: 6, sp: 2, headSp: 2, dodge: 12, attack: 13, damage: '2d6', notes: '' }
const pc = (name: string): EncounterEntry => ({ ...monsterEntries({ ...MON, name, count: 1 })[0], kind: 'pc' })

describe('battle map', () => {
  it('older fights without a map get an empty one', () => {
    const m = mapOf(newEncounter())
    expect(m.cols).toBeGreaterThan(0)
    expect(Object.keys(m.positions)).toHaveLength(0)
    expect(m.squareLabel).toBe('2 m')
  })

  it("moves old default labels to the book's 2 m but keeps typed ones", () => {
    const old = (squareLabel: string) => mapOf({ ...newEncounter(), map: { cols: 12, rows: 8, squareLabel, positions: {} } }).squareLabel
    expect(old('1 m')).toBe('2 m')
    expect(old('')).toBe('2 m')
    expect(old('5 ft')).toBe('5 ft')
    // Once checked, a GM who deliberately types 1 m keeps it.
    expect(mapOf({ ...newEncounter(), map: { ...newMap(), squareLabel: '1 m' } }).squareLabel).toBe('1 m')
  })

  it('places players on the left and the rest on the right, without overlaps', () => {
    const entries = [pc('Geralt'), pc('Yen'), ...monsterEntries(MON)]
    const m = placeEveryone(newMap(), entries)
    const ps = entries.map((x) => m.positions[x.id])
    expect(ps.every(Boolean)).toBe(true)
    expect(ps[0].x).toBe(0)
    expect(ps[2].x).toBe(m.cols - 1)
    expect(new Set(ps.map((p) => `${p.x},${p.y}`)).size).toBe(entries.length)
  })

  it('moving onto a taken square swaps the two tokens', () => {
    const [a, b] = monsterEntries({ ...MON, count: 2 })
    let m = moveToken(newMap(), [a, b], a.id, { x: 1, y: 1 })
    m = moveToken(m, [a, b], b.id, { x: 3, y: 3 })
    m = moveToken(m, [a, b], a.id, { x: 3, y: 3 })
    expect(m.positions[a.id]).toEqual({ x: 3, y: 3 })
    expect(m.positions[b.id]).toEqual({ x: 1, y: 1 })
  })

  it('a token from beside the map bumps the occupant off, and moves are kept on the grid', () => {
    const [a, b] = monsterEntries({ ...MON, count: 2 })
    let m = moveToken(newMap(), [a, b], a.id, { x: 99, y: -4 })
    expect(m.positions[a.id]).toEqual({ x: m.cols - 1, y: 0 })
    m = moveToken(m, [a, b], b.id, { x: m.cols - 1, y: 0 })
    expect(m.positions[a.id]).toBeUndefined()
    expect(removeToken(m, b.id).positions[b.id]).toBeUndefined()
  })

  it('forgets squares of combatants who left the fight', () => {
    const [a, b] = monsterEntries({ ...MON, count: 2 })
    const m = placeEveryone(newMap(), [a, b])
    expect(Object.keys(livePositions(m, [a]))).toEqual([a.id])
  })

  it('shrinking the grid pulls outside tokens to the nearest free square', () => {
    const [a, b] = monsterEntries({ ...MON, count: 2 })
    let m = moveToken(newMap(), [a, b], a.id, { x: 11, y: 7 })
    m = moveToken(m, [a, b], b.id, { x: 5, y: 5 })
    m = resizeMap(m, 6, 6)
    expect(m.positions[b.id]).toEqual({ x: 5, y: 5 })
    expect(m.positions[a.id]).not.toEqual({ x: 5, y: 5 })
    expect(m.positions[a.id].x).toBeLessThan(6)
    expect(m.positions[a.id].y).toBeLessThan(6)
    expect(resizeMap(m, 1, 500).cols).toBe(4)
    expect(resizeMap(m, 1, 500).rows).toBe(40)
  })

  it('labels tokens briefly', () => {
    expect(tokenLabel('Drowner 3')).toBe('D3')
    expect(tokenLabel('Geralt of Rivia')).toBe('GR')
    expect(tokenLabel('Pip')).toBe('Pi')
    expect(tokenLabel("Captain's deserter 2")).toBe('C2')
  })
})

describe('NPC search', () => {
  const npc = (name: string, category?: string, threat = 'Medium') =>
    ({ ...newCharacter('npc'), name, bestiary: category ? { category, threat, page: 1, confirmed: '', checked: false } : undefined }) as Character
  const list = [npc('Ghoul', 'Necrophage', 'Easy'), npc('Higher Vampire', 'Vampire', 'Hard'), npc('Bruxa', 'Vampire'), npc('Pip Dewberry')]

  it('matches name, type and threat, every word, name hits first', () => {
    expect(searchNpcs(list, '').length).toBe(4)
    expect(searchNpcs(list, 'GHO').map((c) => c.name)).toEqual(['Ghoul'])
    expect(searchNpcs(list, 'vampire').map((c) => c.name)).toEqual(['Higher Vampire', 'Bruxa'])
    expect(searchNpcs(list, 'vampire hard').map((c) => c.name)).toEqual(['Higher Vampire'])
    expect(searchNpcs(list, 'nothing here')).toEqual([])
  })
})
