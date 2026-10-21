import { describe, expect, it } from 'vitest'
import { rollCheck } from '../rules/dice'
import { derive, PROFESSIONS, SKILL_BY_ID, slug, type Stats } from '../rules/rules'
import { COMBAT_SKILLS, HOMELAND_BONUS, HOMELANDS, homeLanguageSkill, PROFESSION_GEAR, professionSkillIds, STARTING_GEAR_NOTE } from '../model/presets'
import { addToCharacter, CATALOG, findEntry, hasOnCharacter, removeFromCharacter, search } from '../model/catalog'
import { checkBase, derived, toCombatant } from '../model/combat'
import { allBestiary, BESTIARY, bestiaryCharacter, missingBestiary } from '../model/bestiary'
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

import { advanceTurn, applyDamage, entriesFromTemplate, entryFromCharacter, monsterEntries, rollHitLocation, rollInitiative, turnOrder, writeBack, newEncounter } from '../model/encounter'

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

describe('injuries and life events', () => {
  it('fills life events on older sheets', () => {
    const [c] = parseCharacters({ name: 'Old sheet' })
    expect(c.lifeEvents).toEqual([])
  })

  it('writes fight injuries to the sheet once', () => {
    const [witcher] = sampleCharacters()
    const e = newEncounter('t')
    const entry = entryFromCharacter(witcher)
    entry.injuries = [{ id: 'w1', location: 'lArm', severity: 'complex', description: 'Fractured arm', treated: false }]
    e.entries = [entry]
    const once = writeBack(e, [witcher])
    const twice = writeBack(e, once)
    expect(twice[0].crits.map((w) => w.id)).toEqual([...witcher.crits.map((w) => w.id), 'w1'])
  })
})

import { creatorIssues, decadeRows, finishDraft, newDraft, skillBudget } from '../model/creator'

describe('character creator', () => {
  it('flags missing name, profession and unspent stat points', () => {
    const steps = creatorIssues(newDraft()).map((x) => x.step)
    expect(steps).toEqual([0, 2, 3])
  })

  it('splits skill points into profession and pick-up pools', () => {
    const d = newDraft()
    d.character.stats.INT = 6
    d.character.stats.REF = 7
    d.character.skills = { swordsmanship: 5, awareness: 3 }
    d.character.definingSkillValue = 4
    d.professionSkills = ['swordsmanship']
    expect(skillBudget(d)).toMatchObject({ professionSpent: 9, professionTotal: 44, pickupSpent: 3, pickupTotal: 13 })
  })

  it('charges 2 points a level for difficult skills (core p. 49)', () => {
    const d = newDraft()
    d.character.skills = { alchemy: 3, 'spell-casting': 2, awareness: 2 }
    d.professionSkills = ['alchemy']
    expect(skillBudget(d)).toMatchObject({ professionSpent: 6, pickupSpent: 6 })
  })

  it('wants a point in every profession skill, and five combat skills for a Man-At-Arms (core p. 43, 49)', () => {
    const d = newDraft()
    d.character.profession = 'Man-At-Arms'
    d.professionSkills = ['courage']
    const texts = creatorIssues(d).map((x) => x.text)
    expect(texts.some((t) => t.includes('at least 1 point'))).toBe(true)
    expect(texts.some((t) => t.includes('combat skills'))).toBe(true)
  })

  it('adds the homeland +1 when finished (core p. 25)', () => {
    const d = newDraft()
    d.character.homeland = 'Redania'
    d.character.skills = { education: 2 }
    expect(finishDraft(d).skills.education).toBe(3)
    expect(finishDraft(d).skills['language-common-speech']).toBe(8)
  })

  it('makes one decade row per decade from age 10', () => {
    expect(decadeRows('34').map((r) => r.when)).toEqual(['Age 10s', 'Age 20s', 'Age 30s'])
  })

  it('turns the lifepath into life events and fills the pools', () => {
    const d = newDraft()
    d.character.name = 'Test'
    d.character.stats = { INT: 7, REF: 8, DEX: 8, BODY: 7, SPD: 7, EMP: 6, CRA: 8, WILL: 7, LUCK: 12 }
    d.family.fate = 'At least some of your family is alive'
    d.decades = [{ id: 'a', when: 'Age 10s', kind: 'Enemy', title: 'Made an enemy', details: '' }, { id: 'b', when: 'Age 20s', kind: 'Fortune', title: '', details: '' }]
    const c = finishDraft(d)
    expect(c.lifeEvents.map((e) => [e.kind, e.title])).toEqual([['Family', 'Family fate'], ['Enemy', 'Made an enemy']])
    expect([c.hp.current, c.sta.current, c.luckCurrent]).toEqual([35, 35, 12])
  })
})

describe('bestiary', () => {
  it('seeds NPC sheets with valid skills, unique ids and fixed HP', () => {
    const list = BESTIARY.map(bestiaryCharacter)
    expect(new Set(list.map((c) => c.id)).size).toBe(list.length)
    for (const c of list) {
      expect(c.kind).toBe('npc')
      for (const id of Object.keys(c.skills)) expect(SKILL_BY_ID[id], `${c.name}: ${id}`).toBeDefined()
      for (const w of c.weapons) expect(SKILL_BY_ID[w.skillId], `${c.name}: ${w.name}`).toBeDefined()
      expect(derived(c).maxHp).toBe(c.hp.current)
      expect(c.bestiary?.checked).toBe(false)
    }
  })

  it('restores only missing entries and adds fight copies that never write back', () => {
    const all = allBestiary()
    expect(missingBestiary(all)).toHaveLength(0)
    expect(missingBestiary(all.slice(1)).map((c) => c.name)).toEqual([all[0].name])
    const ghoul = all.find((c) => c.name === 'Ghoul')!
    const entries = entriesFromTemplate(ghoul, 3)
    expect(entries.map((e) => e.name)).toEqual(['Ghoul 1', 'Ghoul 2', 'Ghoul 3'])
    expect(entries.every((e) => e.characterId === null && e.kind === 'monster' && e.hp.current === ghoul.hp.current)).toBe(true)
    // Ghoul RUN is 18 (core p. 278).
    expect(derived(ghoul).run).toBe(18)
  })
})

describe('creator presets', () => {
  it('lists the book skill package for every profession (core p. 38-46)', () => {
    for (const p of PROFESSIONS) {
      const ids = professionSkillIds(p.name, 'Redania')
      // A Man-At-Arms picks five combat skills on top of five set ones; a Merchant has two languages.
      expect(ids, p.name).toHaveLength(p.name === 'Man-At-Arms' ? 5 : p.name === 'Merchant' ? 11 : 10)
      expect(new Set(ids).size, p.name).toBe(ids.length)
      for (const id of ids) expect(SKILL_BY_ID[id], `${p.name}: ${id}`).toBeDefined()
    }
    for (const n of COMBAT_SKILLS) expect(SKILL_BY_ID[slug(n)], n).toBeDefined()
    expect(professionSkillIds('Merchant', 'Redania').filter((id) => id.startsWith('language-'))).toEqual(['language-elder-speech', 'language-dwarven'])
    expect(professionSkillIds('Mage', 'Redania')).toContain('seduction')
    expect(professionSkillIds('Priest', 'Redania')).toContain('teaching')
  })
  it('speaks Elder Speech in Skellige and gives each homeland its +1 (core p. 25, 49)', () => {
    expect(homeLanguageSkill('Skellige')).toBe('language-elder-speech')
    expect(homeLanguageSkill('Cintra')).toBe('language-common-speech')
    for (const g of HOMELANDS) for (const h of g.homelands) expect(SKILL_BY_ID[slug(HOMELAND_BONUS[h])], h).toBeDefined()
  })
  it('gives the home language free and a different one as a profession skill (core p. 49)', () => {
    expect(homeLanguageSkill('Mahakam')).toBe('language-dwarven')
    expect(homeLanguageSkill('Vicovaro')).toBe('language-elder-speech')
    expect(homeLanguageSkill('')).toBe('language-common-speech')
    for (const home of ['Mahakam', 'Vicovaro', 'Redania', '']) {
      const second = professionSkillIds('Bard', home).find((id) => id.startsWith('language-'))
      expect(second, home).toBeDefined()
      expect(second, home).not.toBe(homeLanguageSkill(home))
    }
  })
  it('has gear to pick for every profession, all of it in the catalog', () => {
    for (const p of PROFESSIONS) {
      const gear = PROFESSION_GEAR[p.name]
      expect(gear.options.length, p.name).toBeGreaterThanOrEqual(gear.pick)
      for (const { name } of [...gear.options, ...(gear.always ?? [])]) expect(findEntry(name), `${p.name}: ${name}`).toBeDefined()
    }
  })
})

describe('item catalog', () => {
  it('has no duplicate names and every weapon uses a real skill', () => {
    const names = CATALOG.map((e) => e.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
    for (const e of CATALOG) if (e.kind === 'weapon') expect(SKILL_BY_ID[e.skillId], e.name).toBeDefined()
  })
  it('finds entries by prefix first', () => {
    expect(search('cross', ['weapon'])[0].name).toBe('Crossbow')
    expect(search('rope', ['gear'])[0].name).toBe('Rope, 20m')
  })
  it('puts weapons, armor and gear where they belong', () => {
    let c = newCharacter()
    c = { ...c, ...addToCharacter(c, findEntry('Arming Sword')!) }
    expect(c.weapons[0]).toMatchObject({ name: 'Arming Sword', skillId: 'swordsmanship' })
    c = { ...c, ...addToCharacter(c, findEntry('Brigandine')!) }
    expect(c.armor.torso).toMatchObject({ piece: 'Brigandine', sp: 12, maxSp: 12 })
    expect(c.armor.rArm.piece, 'torso armor covers the arms (core p. 79)').toBe('Brigandine')
    expect(c.armor.torso.ev).toBe(1)
    expect(c.armor.head.piece).toBe('')
    c = { ...c, ...addToCharacter(c, findEntry('Rope, 20m')!) }
    expect(c.items[0]).toMatchObject({ name: 'Rope, 20m', weight: 1.5 })
    c = { ...c, ...addToCharacter(c, findEntry('Gnomish Chain')!) }
    expect(c.armor.head.piece, 'armor sets cover everything (core p. 84)').toBe('Gnomish Chain')
    expect(c.armor.lLeg.sp).toBe(10)
  })
  it('carries the book numbers (core p. 73-80)', () => {
    expect(findEntry('Arming Sword')).toMatchObject({ damage: '2d6+4', reliability: 15, weight: 2.5, cost: 270, page: 73 })
    expect(findEntry('Crossbow')).toMatchObject({ accuracy: 1, damage: '4d6+2', range: '100 m', effect: 'Slow Reload' })
    expect(findEntry("Witcher's Silver Sword")).toMatchObject({ hands: 1, effect: 'Silver (3d6)', page: 247 })
    expect(findEntry('Nilfgaardian Plate Armor')).toMatchObject({ sp: 30, ev: 2, class: 'heavy' })
    expect(findEntry('Padded Trousers')).toMatchObject({ sp: 5, ev: 0, weight: 1 })
    expect(findEntry('Steel Kite Shield')).toMatchObject({ reliability: 16, weight: 3 })
    for (const e of CATALOG) if (e.name !== 'Blanket') expect(e.page, e.name).toBeGreaterThan(0)
  })
  it('adds throwing knives as one weapon and a stack in the pack', () => {
    let c = newCharacter()
    c = { ...c, ...addToCharacter(c, findEntry('Throwing Knife')!, STARTING_GEAR_NOTE, 5) }
    expect(c.weapons).toHaveLength(1)
    expect(c.items[0]).toMatchObject({ name: 'Throwing Knife', qty: 5 })
    c = { ...c, ...removeFromCharacter(c, findEntry('Throwing Knife')!, STARTING_GEAR_NOTE) }
    expect([c.weapons.length, c.items.length]).toEqual([0, 0])
  })
  it('takes starting gear back off again', () => {
    let c = newCharacter()
    for (const n of ["Witcher's Steel Sword", 'Brigandine', 'Bedroll']) {
      const e = findEntry(n)!
      c = { ...c, ...addToCharacter(c, e, STARTING_GEAR_NOTE) }
      expect(hasOnCharacter(c, e, STARTING_GEAR_NOTE), n).toBe(true)
    }
    for (const n of ["Witcher's Steel Sword", 'Brigandine', 'Bedroll']) {
      const e = findEntry(n)!
      c = { ...c, ...removeFromCharacter(c, e, STARTING_GEAR_NOTE) }
      expect(hasOnCharacter(c, e, STARTING_GEAR_NOTE), n).toBe(false)
    }
    expect(c.weapons).toHaveLength(0)
    expect(c.items).toHaveLength(0)
    expect(c.armor.torso.piece).toBe('')
  })
})
