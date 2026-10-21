import { uid } from './factory'
import { derived } from './combat'
import type { Character, CriticalWound, CritSeverity, HealingEntry } from './types'
import type { HitLocation } from '../rules/rules'
import { critWound, HEALING_HANDS, HEALING_SPELL, type CritWound } from './criticals'

export const SEVERITIES: CritSeverity[] = ['simple', 'complex', 'difficult', 'deadly']
export const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export function blankInjury(location: HitLocation = 'torso'): CriticalWound {
  return { id: uid(), location, severity: 'simple', description: '', effect: '', when: '', treated: false, healed: false }
}

export function activeInjuries(c: Character): CriticalWound[] {
  return c.crits.filter((w) => !w.healed)
}

// A wound filled in from the critical tables (core p. 158-160): its untreated, stabilized and treated
// effects, and how many Healing Hands rounds or Healing spells it takes (p. 174).
export function fromCritTable(w: CriticalWound, t: CritWound): CriticalWound {
  const by = w.healBy ?? 'doctor'
  return {
    ...w,
    severity: t.severity,
    description: t.name,
    effect: t.effect,
    stabilizedEffect: t.stabilized,
    treatedEffect: t.treated,
    healNeeded: by === 'doctor' ? HEALING_HANDS[t.severity].turns : HEALING_SPELL[t.severity].uses,
  }
}

// The effect that applies right now. Stabilized (First Aid or a doctor at the Healing Hands DC) gives the
// stabilized effect; once the Healing Hands rounds or Healing spells are done, the treated one (p. 158).
// Wounds typed in by hand before stabilized effects existed use the treated effect once stabilized.
export function currentEffect(w: CriticalWound): string {
  if (!w.treated) return w.effect || ''
  if (w.stabilizedEffect && !healReady(w)) return w.stabilizedEffect
  return w.treatedEffect || w.effect || ''
}

// A doctor (Healing Hands) or mage (Healing spell) can work on any severity, Deadly included (core
// p. 174), except a wound the table says cannot be treated. Deadly treated effects are permanent.
export function canCountDown(w: CriticalWound): boolean {
  return critWound(w.description)?.treated !== 'Cannot be treated'
}

export function healReady(w: CriticalWound): boolean {
  return canCountDown(w) && (w.healNeeded ?? 0) > 0 && (w.healDone ?? 0) >= (w.healNeeded ?? 0)
}

// Restores HP up to the maximum and records it. Healing past the maximum is not logged.
export function healHp(c: Character, amount: number, source: string, when: string): Partial<Character> {
  const max = derived(c).maxHp
  const gained = Math.max(0, Math.min(amount, max - c.hp.current))
  if (gained === 0) return {}
  const entry: HealingEntry = { id: uid(), when, hp: gained, source }
  const current = c.hp.current + gained
  return {
    hp: { ...c.hp, current },
    healingLog: [...(c.healingLog ?? []), entry],
    // Back at full health, the next injury needs a new check to start healing.
    healingStarted: current >= max ? false : c.healingStarted,
  }
}

// A day of rest (core p. 173): REC in HP once healing has started, half if the day was strenuous,
// +3 if a doctor started it with Healing Hands.
export function restDayHp(rec: number, strenuous: boolean, healingHands: boolean): number {
  return Math.floor(strenuous ? rec / 2 : rec) + (healingHands ? 3 : 0)
}

// Healing Rest, Melitele's invocation (core p. 113): full health, and treated critical wounds are healed;
// Deadly wounds keep their permanent penalties.
export function healingRest(c: Character, when: string): Partial<Character> {
  const patch = healHp(c, Infinity, 'Healing Rest', when)
  return { ...patch, healingStarted: false, crits: c.crits.map((w) => (w.treated && !w.healed ? { ...w, healed: true } : w)) }
}
