import { describe, expect, it } from 'vitest'
import { rollFlat } from '../rules/dice'
import { derive, SKILL_BY_ID, type Stats } from '../rules/rules'
import { castSpell, derived, restDay, restHour, recoverAction, staCostNumber, toCombatant } from '../model/combat'
import { applyJournalUpdate, BESTIARY, bestiaryCharacter, RETIRED_ESTIMATES } from '../model/bestiary'
import { JOURNAL_MONSTERS, journalCharacter, journalId } from '../model/journalBestiary'
import { applyDamage, entryFromCharacter, entryState, monsterEntries, recoverStamina, spendStamina } from '../model/encounter'
import { findEntry } from '../model/catalog'
import { newCharacter } from '../model/factory'

// Checks against the rules sources in the project folder: Easy Mode (EM), A Witcher's Journal (WJ)
// and the core v4 errata.

const st = (INT: number, REF: number, DEX: number, BODY: number, SPD: number, EMP: number, CRA: number, WILL: number, LUCK = 5): Stats => ({
  INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK,
})

describe('derived stats match the Easy Mode pregens', () => {
  // Name, stats, then HP, Save (Stun), REC, Leap, punch, kick as printed on the sheets.
  const pregens: Array<[string, Stats, number, number, number, number, string, string]> = [
    ['Luskar (witcher)', st(5, 11, 10, 8, 6, 1, 5, 7), 35, 7, 7, 3, '1d6+2', '1d6+6'],
    ['Aislinn (mage)', st(8, 5, 6, 4, 5, 7, 6, 10), 35, 7, 7, 3, '1d6-2', '1d6+2'],
    ['Man at arms', st(4, 10, 8, 10, 6, 5, 4, 8), 45, 9, 9, 3, '1d6+4', '1d6+8'],
    ['Dwarf doctor', st(9, 6, 6, 5, 8, 7, 10, 5), 25, 5, 5, 4, '1d6', '1d6+4'],
  ]
  for (const [name, s, hp, save, rec, leap] of pregens)
    it(name, () => {
      const d = derive(s)
      expect([d.hp, d.sta, d.stun, d.rec, d.leap]).toEqual([hp, hp, save, rec, leap])
    })
  it('punch and kick for non-dwarves', () => {
    expect([derive(pregens[0][1]).punch, derive(pregens[0][1]).kick]).toEqual(['1d6+2', '1d6+6'])
    expect([derive(pregens[1][1]).punch, derive(pregens[1][1]).kick]).toEqual(['1d6-2', '1d6+2'])
  })
  it('run, leap and encumbrance match the Journal blocks (bullvore: RUN 9, LEAP 1, ENC 120, STUN 9)', () => {
    const d = derive(st(2, 5, 4, 12, 3, 1, 2, 6))
    expect([d.run, d.leap, d.enc, d.stun, d.rec]).toEqual([9, 1, 120, 9, 9])
  })
})

describe('saves', () => {
  it('succeed only when the roll is under the Save value (EM p.14)', () => {
    expect(rollFlat('Stun', 7, () => 6).save).toEqual({ target: 7, passed: true })
    expect(rollFlat('Stun', 7, () => 7).save).toEqual({ target: 7, passed: false })
    expect(rollFlat('Stun', 7, () => 10).save?.passed).toBe(false)
  })
})

describe('recovery (EM p.18, errata p.151)', () => {
  const hurt = () => {
    const c = newCharacter('pc')
    c.stats = st(5, 5, 5, 8, 5, 5, 5, 6) // base 7
    c.sta.current = 10
    c.hp.current = 10
    return c
  }
  it('Recover action and an hour of rest give REC Stamina, halved when strenuous', () => {
    expect(recoverAction(hurt()).sta?.current).toBe(17)
    expect(restHour(hurt(), false).sta?.current).toBe(17)
    expect(restHour(hurt(), true).sta?.current).toBe(13)
  })
  it('a day of rest gives REC HP, halved when strenuous, +3 with Healing Hands, capped at max', () => {
    expect(restDay(hurt(), false, false).hp?.current).toBe(17)
    expect(restDay(hurt(), true, false).hp?.current).toBe(13)
    expect(restDay(hurt(), false, true).hp?.current).toBe(20)
    const full = hurt()
    full.hp.current = derived(full).maxHp - 1
    expect(restDay(full, false, false).hp?.current).toBe(derived(full).maxHp)
  })
})

describe('Vigor Threshold (EM p.21)', () => {
  it("Aislinn's example: threshold 5, casts 5 then 3, takes 15 HP", () => {
    const c = newCharacter('pc')
    c.vigor = 5
    const a = castSpell(c, 5, 0)
    expect(a.hpLoss).toBe(0)
    const b = castSpell({ ...c, ...a.patch }, 3, a.spent)
    expect(b.hpLoss).toBe(15)
    expect(b.patch.sta?.current).toBe(c.sta.current - 8)
  })
  it('reads the number from a cost', () => {
    expect(staCostNumber('5')).toBe(5)
    expect(staCostNumber('3 per round')).toBe(3)
    expect(staCostNumber('Varies')).toBeNull()
    expect(staCostNumber('1-5')).toBeNull()
    expect(staCostNumber('1 to 7')).toBeNull()
  })
})

describe('encounter rules', () => {
  const m = () => monsterEntries({ name: 'X', count: 1, hp: 30, sta: 30, ref: 5, sp: 2, headSp: 2, dodge: 10, attack: 10, damage: '1d6', notes: '' })[0]
  it('location multiplier rounds down with a minimum of 1 (EM p.18)', () => {
    expect(applyDamage(m(), { amount: 3, location: 'rLeg', ignoreArmor: false, resistant: false }).hpLoss).toBe(1)
  })
  it('susceptible doubles damage after armor', () => {
    expect(applyDamage(m(), { amount: 7, location: 'torso', ignoreArmor: false, resistant: false, vulnerable: true }).hpLoss).toBe(10)
  })
  it('0 HP is the death state', () => {
    expect(entryState({ ...m(), hp: { current: 0, max: 30 } })).toBe('dying')
  })
  it('Recover restores REC, extra actions spend Stamina', () => {
    const c = newCharacter('pc')
    const x = entryFromCharacter(c)
    const tired = spendStamina(spendStamina(x, 3), 1)
    expect(tired.sta.current).toBe(x.sta.current - 4)
    expect(recoverStamina(tired).sta.current).toBe(x.sta.current)
  })
  it('beasts are not resistant by default, other monsters are (errata p.162)', () => {
    expect(entryFromCharacter(journalCharacter(JOURNAL_MONSTERS.find((j) => j.name === 'Bear')!)).resistant).toBe(false)
    expect(entryFromCharacter(journalCharacter(JOURNAL_MONSTERS.find((j) => j.name === 'Troll')!)).resistant).toBe(true)
  })
})

describe("A Witcher's Journal bestiary", () => {
  const list = JOURNAL_MONSTERS.map(journalCharacter)
  it('has 33 monsters with unique ids that do not clash with the estimates', () => {
    expect(list).toHaveLength(33)
    const ids = new Set([...list.map((c) => c.id), ...BESTIARY.map((b) => bestiaryCharacter(b).id)])
    expect(ids.size).toBe(list.length + BESTIARY.length)
  })
  it('keeps the book numbers: skill bases, defenses, attack bases, HP and Stun', () => {
    for (const [i, c] of list.entries()) {
      const m = JOURNAL_MONSTERS[i]
      expect(c.bestiary?.source).toBe('journal')
      expect(derived(c).maxHp).toBe(m.hp)
      expect(derived(c).maxSta).toBe(m.sta)
      const cb = toCombatant(c)
      expect(cb.defenses.dodge, c.name).toBe(m.dodge)
      expect(cb.attacks.map((a) => a.base), c.name).toEqual(m.attacks.map((a) => a.base))
      for (const [name, base] of Object.entries(m.skills)) {
        const def = Object.values(SKILL_BY_ID).find((k) => k.name === name)
        const value = def ? c.skills[def.id] : c.customSkills.find((k) => k.name === name)?.value
        const stat = def ? c.stats[def.stat] : c.stats.INT
        expect(stat + value!, `${c.name} ${name}`).toBe(base)
      }
    }
  })
  it('spot checks the bear (WJ p.36)', () => {
    const bear = list.find((c) => c.name === 'Bear')!
    expect(derived(bear).stun).toBe(8)
    expect(bear.armor.torso.sp).toBe(10)
    expect(bear.weapons.map((w) => [w.name, w.damage])).toEqual([['Bite', '8d6'], ['Claw Slash', '4d6+5']])
  })
  it('the one-time update drops untouched retired estimates and keeps checked or edited ones', () => {
    const old = BESTIARY.map(bestiaryCharacter)
    const retired = ['Bear', 'Harpy', 'Leshen', 'Rock troll'].map((n) => bestiaryCharacter({ ...BESTIARY[0], name: n }))
    retired[0].bestiary!.checked = true
    retired[1].updatedAt += 1000
    const next = applyJournalUpdate([...old, ...retired])
    const ids = new Set(next.map((c) => c.id))
    expect(RETIRED_ESTIMATES.filter((id) => ids.has(id))).toEqual([retired[0].id, retired[1].id])
    expect(ids.has(journalId('Bear'))).toBe(true)
    expect(applyJournalUpdate(next)).toHaveLength(next.length)
  })
})

describe('catalog corrections from the Easy Mode pregens', () => {
  it('armor SP', () => {
    const sp = (n: string) => (findEntry(n) as { sp: number }).sp
    expect([sp("Verden Archer's Hood"), sp('Chain Coif'), sp('Gambeson'), sp('Aedirnian Gambeson'), sp('Double Woven Gambeson'), sp('Brigandine')]).toEqual([3, 12, 3, 5, 8, 12])
    expect([sp('Padded Trousers'), sp('Cavalry Trousers'), sp('Armored Trousers')]).toEqual([5, 3, 12])
  })
  it('ranged weapons', () => {
    const w = (n: string) => findEntry(n) as { accuracy: number; damage: string }
    expect([w('Hand Crossbow').accuracy, w('Hand Crossbow').damage]).toEqual([1, '2d6+2'])
    expect([w('Crossbow').accuracy, w('Crossbow').damage]).toEqual([1, '4d6+2'])
    expect(w('Short Bow').damage).toBe('3d6+3')
  })
})
