import { describe, expect, it } from 'vitest'
import { rollFlat } from '../rules/dice'
import { derive, SKILL_BY_ID, type Stats } from '../rules/rules'
import { castSpell, derived, recoverAction, staCostNumber, toCombatant } from '../model/combat'
import { applyJournalUpdate, BESTIARY, bestiaryCharacter, RETIRED_ESTIMATES } from '../model/bestiary'
import { JOURNAL_MONSTERS, journalCharacter, journalId } from '../model/journalBestiary'
import { advanceTurn, applyDamage, defenseBase, entryFromCharacter, entryState, monsterEntries, newEncounter, recoverStamina, spendStamina, takeDefense } from '../model/encounter'
import { newCharacter } from '../model/factory'

// Checks against the rules sources in the project folder: A Witcher's Journal (WJ) and the core v4
// errata.

const st = (INT: number, REF: number, DEX: number, BODY: number, SPD: number, EMP: number, CRA: number, WILL: number, LUCK = 5): Stats => ({
  INT, REF, DEX, BODY, SPD, EMP, CRA, WILL, LUCK,
})

describe('derived stats', () => {
  it('run, leap and encumbrance match the Journal blocks (bullvore: RUN 9, LEAP 1, ENC 120, STUN 9)', () => {
    const d = derive(st(2, 5, 4, 12, 3, 1, 2, 6))
    expect([d.run, d.leap, d.enc, d.stun, d.rec]).toEqual([9, 1, 120, 9, 9])
  })
})

describe('saves', () => {
  it('succeed only when the roll is under the Save value (errata p.47)', () => {
    expect(rollFlat('Stun', 7, () => 6).save).toEqual({ target: 7, passed: true })
    expect(rollFlat('Stun', 7, () => 7).save).toEqual({ target: 7, passed: false })
    expect(rollFlat('Stun', 7, () => 10).save?.passed).toBe(false)
  })
})

describe('Recover action (errata p.151)', () => {
  it('gives REC Stamina, capped at max', () => {
    const c = newCharacter('pc')
    c.stats = st(5, 5, 5, 8, 5, 5, 5, 6) // base 7
    c.sta.current = 10
    expect(recoverAction(c).sta?.current).toBe(17)
    c.sta.current = derived(c).maxSta - 1
    expect(recoverAction(c).sta?.current).toBe(derived(c).maxSta)
  })
})

describe('Vigor Threshold', () => {
  it('spends Stamina, and 5 HP per point past the threshold in a round (core p. 166)', () => {
    const c = newCharacter('pc')
    c.vigor = 5
    const a = castSpell(c, 5, 0)
    expect(a.overThreshold).toBe(false)
    const b = castSpell({ ...c, ...a.patch }, 3, a.spent)
    expect(b.overThreshold).toBe(true)
    expect(b.patch.sta?.current).toBe(c.sta.current - 8)
    expect(b.hpCost).toBe(15)
    expect(b.patch.hp?.current).toBe(c.hp.current - 15)
    // Only the points newly past the threshold cost HP.
    const d = castSpell({ ...c, ...b.patch }, 1, b.spent)
    expect(d.hpCost).toBe(5)
    expect(castSpell(c, 5, 0).patch.hp).toBeUndefined()
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
  it('susceptible doubles damage (WJ p.13)', () => {
    expect(applyDamage(m(), { amount: 7, location: 'torso', ignoreArmor: false, resistant: false, vulnerable: true }).hpLoss).toBe(10)
  })
  it('0 HP is the death state (core p. 153)', () => {
    expect(entryState({ ...m(), hp: { current: 0, max: 30 } })).toBe('dying')
  })
  it('Recover restores REC, extra actions spend Stamina', () => {
    const c = newCharacter('pc')
    const x = entryFromCharacter(c)
    const tired = spendStamina(spendStamina(x, 3), 1)
    expect(tired.sta.current).toBe(x.sta.current - 4)
    expect(recoverStamina(tired).sta.current).toBe(x.sta.current)
  })
  it('charges 1 STA per defense after the first, unless actively dodging (core p. 151)', () => {
    const x = m()
    const one = takeDefense(x)
    expect(one.sta.current).toBe(30)
    const two = takeDefense(one)
    expect([two.sta.current, two.defensesThisRound]).toEqual([29, 2])
    expect(takeDefense({ ...one, activelyDodging: true }).sta.current).toBe(30)
  })
  it('Ganging Up takes 1 off defense per melee attacker past the first (core p. 153)', () => {
    expect(defenseBase({ ...m(), meleeAttackers: 4 })).toBe(m().defenses.dodge - 3)
    expect(defenseBase({ ...m(), meleeAttackers: 1 })).toBe(m().defenses.dodge)
  })
  it('a new round clears the defense counts', () => {
    const x = { ...m(), initiative: 10, defensesThisRound: 2, meleeAttackers: 3, activelyDodging: true }
    const e = { ...newEncounter(), entries: [x], activeId: x.id }
    const next = advanceTurn(e)
    expect(next.round).toBe(2)
    expect(next.entries[0]).toMatchObject({ defensesThisRound: 0, meleeAttackers: 0, activelyDodging: false })
  })
  it('critical bonus damage ignores armor (core p. 158)', () => {
    expect(applyDamage(m(), { amount: 2, location: 'torso', ignoreArmor: false, resistant: false, critBonus: 5 }).hpLoss).toBe(5)
  })
  it('beasts are not resistant by default, other monsters are (errata p.162)', () => {
    expect(entryFromCharacter(journalCharacter(JOURNAL_MONSTERS.find((j) => j.name === 'Bear')!)).resistant).toBe(false)
    expect(entryFromCharacter(journalCharacter(JOURNAL_MONSTERS.find((j) => j.name === 'Troll')!)).resistant).toBe(true)
  })
})

describe("A Witcher's Journal bestiary", () => {
  const list = JOURNAL_MONSTERS.map(journalCharacter)
  it('has 35 monsters with unique ids that do not clash with the estimates', () => {
    expect(list).toHaveLength(35)
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

describe('errata checks on creation and the sheet', () => {
  it('rolls nine stats, re-rolling 1s and 2s (errata p.47)', async () => {
    const { rollStats, rolledStatsPlaced } = await import('../model/creator')
    const seq = [1, 2, 3, 10, 4, 5, 6, 7, 8, 9, 2, 3]
    const r = rollStats(() => seq.shift()!)
    expect(r).toEqual([3, 10, 4, 5, 6, 7, 8, 9, 3])
    expect(rolledStatsPlaced(st(10, 3, 4, 5, 6, 7, 8, 9, 3), r)).toBe(true)
    expect(rolledStatsPlaced(st(10, 10, 4, 5, 6, 7, 8, 9, 3), r)).toBe(false)
  })
  it('armor EV lowers REF and DEX skills (min 1) and magic skills, counting a piece once (errata p.78)', async () => {
    const { checkBase, effectiveStat, armorEv } = await import('../model/combat')
    const { addToCharacter, findEntry } = await import('../model/catalog')
    const c = newCharacter('pc')
    c.stats = st(5, 6, 6, 5, 5, 5, 5, 5)
    c.skills = { swordsmanship: 4, 'spell-casting': 3, awareness: 2 }
    const armor = findEntry('Brigandine')!
    const worn = { ...c, ...addToCharacter(c, armor) }
    const ev = (armor as { ev: number }).ev
    expect(armorEv(worn)).toBe(ev)
    expect(checkBase(worn, 'swordsmanship')).toBe(6 - ev + 4)
    expect(checkBase(worn, 'spell-casting')).toBe(5 + 3 - ev)
    expect(checkBase(worn, 'awareness')).toBe(7)
    worn.armor.head = { piece: 'Great helm', sp: 20, maxSp: 20, ev: 9 }
    expect(effectiveStat(worn, 'REF')).toBe(1)
  })
  it('Dwarf Tough adds 2 SP in fights that ablation never touches (errata p.23)', () => {
    const c = newCharacter('pc')
    c.race = 'Dwarf'
    c.armor.torso = { piece: 'Gambeson', sp: 3, maxSp: 3 }
    const x = entryFromCharacter(c)
    expect(applyDamage(x, { amount: 5, location: 'torso', ignoreArmor: false, resistant: false }).hpLoss).toBe(0)
    const r = applyDamage(x, { amount: 8, location: 'torso', ignoreArmor: false, resistant: false })
    expect(r.hpLoss).toBe(3)
    expect(r.entry.sp.torso).toBe(2)
    const bare = applyDamage(x, { amount: 4, location: 'head', ignoreArmor: false, resistant: false })
    expect([bare.hpLoss, bare.entry.sp.head]).toEqual([2 * 3, 0])
  })
})

describe('healing and critical wounds (errata p. 103, 173-174)', () => {
  const hurt = async () => {
    const { blankInjury } = await import('../model/injuries')
    const c = newCharacter('pc')
    c.hp.current = 5
    c.healingStarted = true
    c.crits = [{ ...blankInjury(), treated: true, severity: 'complex' }, { ...blankInjury(), severity: 'simple' }]
    return c
  }
  it('heals up to max HP, logs only what came back, and clears the started flag at full health', async () => {
    const { healHp } = await import('../model/injuries')
    const c = await hurt()
    const max = derived(c).maxHp
    const p = healHp(c, 3, 'Rest', 'Day 1')
    expect(p.hp?.current).toBe(8)
    expect(p.healingLog?.[0]).toMatchObject({ hp: 3, source: 'Rest', when: 'Day 1' })
    expect(p.healingStarted).toBe(true)
    const top = healHp(c, 999, 'Potion', '')
    expect([top.hp?.current, top.healingLog?.[0].hp, top.healingStarted]).toEqual([max, max - 5, false])
    expect(healHp({ ...c, hp: { ...c.hp, current: max } }, 3, 'Rest', '')).toEqual({})
  })
  it('Healing Rest restores full HP and heals treated wounds only', async () => {
    const { healingRest } = await import('../model/injuries')
    const c = await hurt()
    const p = healingRest(c, '')
    expect(p.hp?.current).toBe(derived(c).maxHp)
    expect(p.crits?.map((w) => !!w.healed)).toEqual([true, false])
  })
  it('treated effect replaces the effect once treated; Deadly wounds can be healed too (core p. 174)', async () => {
    const { blankInjury, canCountDown, currentEffect, healReady } = await import('../model/injuries')
    const w = { ...blankInjury(), effect: '-2 REF', treatedEffect: '-1 REF' }
    expect(currentEffect(w)).toBe('-2 REF')
    expect(currentEffect({ ...w, treated: true })).toBe('-1 REF')
    expect(currentEffect({ ...w, treated: true, treatedEffect: '' })).toBe('-2 REF')
    expect(healReady({ ...w, healNeeded: 3, healDone: 2 })).toBe(false)
    expect(healReady({ ...w, healNeeded: 3, healDone: 3 })).toBe(true)
    expect(canCountDown({ ...w, severity: 'deadly' })).toBe(true)
    expect(canCountDown({ ...w, severity: 'deadly', description: 'Separated Spine/Decapitated' })).toBe(false)
    expect(healReady({ ...w, severity: 'deadly', healNeeded: 1, healDone: 1 })).toBe(true)
  })
})

describe('critical wounds and healing from the core book', () => {
  it('fills a wound from the tables with its three effects and the doctor rounds (core p. 158-160, 174)', async () => {
    const { blankInjury, currentEffect, fromCritTable } = await import('../model/injuries')
    const { critWound, critForMargin, critHealDays, critWoundForRoll } = await import('../model/criticals')
    const w = fromCritTable(blankInjury(), critWound('Fractured Arm')!)
    expect(w).toMatchObject({ severity: 'complex', healNeeded: 4, effect: '-3 to actions with that arm' })
    expect(currentEffect({ ...w, treated: true })).toBe('-2 to actions with that arm')
    expect(currentEffect({ ...w, treated: true, healDone: 4 })).toBe('-1 to actions with that arm')
    expect(critWoundForRoll('difficult', 12)?.name).toBe('Skull Fracture')
    expect(critWoundForRoll('simple', 7)?.name).toBe('Foreign Object')
    expect([critForMargin(6), critForMargin(7)?.bonus, critForMargin(14)?.severity, critForMargin(20)?.bonus]).toEqual([null, 3, 'difficult', 10])
    expect([critHealDays(5, 'complex'), critHealDays(13, 'difficult'), critHealDays(2, 'simple'), critHealDays(6, 'deadly')]).toEqual([7, 2, 5, null])
  })
  it('heals REC a day, half if strenuous, +3 with Healing Hands (core p. 173)', async () => {
    const { restDayHp } = await import('../model/injuries')
    expect([restDayHp(5, false, false), restDayHp(5, true, false), restDayHp(5, false, true), restDayHp(5, true, true)]).toEqual([5, 2, 8, 5])
  })
})
