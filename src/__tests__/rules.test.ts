import { describe, expect, it } from 'vitest'
import { rollCheck } from '../rules/dice'
import { derive, type Stats } from '../rules/rules'
import { checkBase, toCombatant } from '../model/combat'
import { newCharacter, sampleCharacters } from '../model/factory'
import { exportJson, LocalStorageRepository, parseCharacters } from '../storage/store'

const stats = (o: Partial<Stats>): Stats => ({ INT: 5, REF: 5, DEX: 5, BODY: 5, SPD: 5, EMP: 5, CRA: 5, WILL: 5, LUCK: 5, ...o })
const seq = (...n: number[]) => () => n.shift()!

describe('derived stats', () => {
  it('follows the physical table', () => {
    const d = derive(stats({ BODY: 7, WILL: 6, SPD: 6, INT: 6 }))
    expect(d).toMatchObject({ hp: 30, sta: 30, rec: 6, stun: 6, run: 18, leap: 3, enc: 70, resolve: 30, punch: '1d6+2', kick: '1d6+6' })
  })
  it('caps Stun at 10 (errata)', () => {
    expect(derive(stats({ BODY: 13, WILL: 12 })).stun).toBe(10)
  })
})

describe('dice', () => {
  it('adds stat + skill + d10', () => {
    expect(rollCheck('x', 11, seq(6))).toMatchObject({ total: 17, outcome: 'normal' })
  })
  it('explodes on 10 and keeps going', () => {
    expect(rollCheck('x', 10, seq(10, 10, 3))).toMatchObject({ dieTotal: 23, total: 33, outcome: 'critical' })
  })
  it('subtracts the reroll on a 1', () => {
    expect(rollCheck('x', 10, seq(1, 4))).toMatchObject({ dieTotal: -3, total: 7, outcome: 'fumble' })
  })
})

describe('characters', () => {
  it('starts new sheets at full HP and STA', () => {
    const c = newCharacter()
    expect(c.hp.current).toBe(25)
    expect(c.sta.current).toBe(25)
  })
  it('builds a combatant for the encounter tracker', () => {
    const [witcher] = sampleCharacters()
    const cb = toCombatant(witcher)
    expect(cb.hp.max).toBe(30)
    expect(cb.sp.torso).toBe(10)
    expect(cb.defenses.dodge).toBe(13)
    expect(cb.attacks[0].base).toBe(checkBase(witcher, 'swordsmanship'))
  })
})

describe('storage', () => {
  it('round-trips through export and import', () => {
    const list = sampleCharacters()
    expect(parseCharacters(JSON.parse(exportJson(list)))).toEqual(list)
  })
  it('fills missing fields on a partial import', () => {
    const [c] = parseCharacters({ name: 'Old sheet', stats: { BODY: 8 } })
    expect(c.stats.BODY).toBe(8)
    expect(c.stats.WILL).toBe(5)
    expect(c.armor.head).toEqual({ piece: '', sp: 0, maxSp: 0 })
  })
  it('rejects files with no characters', () => {
    expect(() => parseCharacters({ foo: 1 })).toThrow(/No characters/)
  })
  it('saves and loads through storage', () => {
    const mem = new Map<string, string>()
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) } as Storage
    const repo = new LocalStorageRepository(storage)
    expect(repo.load()).toBeNull()
    const list = sampleCharacters()
    repo.save(list)
    expect(repo.load()).toEqual(list)
  })
})

import { advanceTurn, applyDamage, entryFromCharacter, monsterEntries, rollHitLocation, rollInitiative, turnOrder, writeBack, newEncounter } from '../model/encounter'

describe('encounters', () => {
  const [witcher] = sampleCharacters()
  const mk = () => {
    const e = newEncounter('t')
    e.entries = [entryFromCharacter(witcher), ...monsterEntries({ name: 'Drowner', count: 2, hp: 20, sta: 20, ref: 6, sp: 2, headSp: 2, dodge: 12, attack: 13, damage: '2d6', notes: '' })]
    return e
  }

  it('numbers multiple monsters', () => {
    expect(mk().entries.map((x) => x.name)).toEqual([witcher.name, 'Drowner 1', 'Drowner 2'])
  })

  it('orders by initiative then REF and starts on the top combatant', () => {
    const e = rollInitiative(mk(), false, seq(5, 9, 7))
    expect(turnOrder(e).map((x) => x.initiative)).toEqual([15, 13, 13])
    expect(e.activeId).toBe(turnOrder(e)[0].id)
  })

  it('advances turns, skips the defeated and counts rounds', () => {
    let e = rollInitiative(mk(), false, seq(5, 9, 7))
    const [, a, b] = turnOrder(e)
    e = { ...e, entries: e.entries.map((x) => (x.id === a.id ? { ...x, defeated: true } : x)) }
    e = advanceTurn(e)
    expect(e.activeId).toBe(b.id)
    e = advanceTurn(e)
    expect(e.round).toBe(2)
    expect(e.activeId).toBe(turnOrder(e)[0].id)
    e = advanceTurn(e, -1)
    expect([e.round, e.activeId]).toEqual([1, b.id])
  })

  it('applies armor, location multiplier and ablation', () => {
    const x = entryFromCharacter(witcher) // torso SP 10, HP 30
    const torso = applyDamage(x, { amount: 14, location: 'torso', ignoreArmor: false, resistant: false })
    expect([torso.hpLoss, torso.entry.hp.current, torso.entry.sp.torso]).toEqual([4, 26, 9])
    const head = applyDamage(x, { amount: 5, location: 'head', ignoreArmor: false, resistant: false })
    expect([head.hpLoss, head.entry.sp.head]).toEqual([15, 0])
    const blocked = applyDamage(x, { amount: 8, location: 'torso', ignoreArmor: false, resistant: false })
    expect([blocked.hpLoss, blocked.entry.sp.torso]).toEqual([0, 10])
    const limb = applyDamage(x, { amount: 13, location: 'lLeg', ignoreArmor: false, resistant: true })
    expect(limb.hpLoss).toBe(1)
  })

  it('maps the hit location table', () => {
    expect([1, 2, 4, 5, 6, 7, 8, 9, 10].map((n) => rollHitLocation(() => n))).toEqual(['head', 'torso', 'torso', 'rArm', 'lArm', 'rLeg', 'rLeg', 'lLeg', 'lLeg'])
  })

  it('writes wounds back to linked sheets only', () => {
    const e = mk()
    e.entries[0] = applyDamage(e.entries[0], { amount: 14, location: 'torso', ignoreArmor: false, resistant: false }).entry
    const [w2, bandit] = writeBack(e, sampleCharacters().map((c, i) => (i === 0 ? witcher : c)))
    expect([w2.hp.current, w2.armor.torso.sp]).toEqual([26, 9])
    expect(bandit.hp.current).toBe(25)
  })
})
