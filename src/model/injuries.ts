import { uid } from './factory'
import { derived } from './combat'
import type { Character, CriticalWound, CritSeverity, HealingEntry } from './types'
import type { HitLocation } from '../rules/rules'

export const SEVERITIES: CritSeverity[] = ['simple', 'complex', 'difficult', 'deadly']
export const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export function blankInjury(location: HitLocation = 'torso'): CriticalWound {
  return { id: uid(), location, severity: 'simple', description: '', effect: '', when: '', treated: false, healed: false }
}

export function activeInjuries(c: Character): CriticalWound[] {
  return c.crits.filter((w) => !w.healed)
}

// The effect that applies right now: the treated effect once the wound is treated, if one was entered.
export function currentEffect(w: CriticalWound): string {
  return (w.treated && w.treatedEffect) || w.effect || ''
}

// The errata drops Deadly from the Critical Healing table (p. 174): a doctor or Healing spell can't
// count down a Deadly wound, and its permanent penalties stay even after Healing Rest (p. 103).
export function canCountDown(w: CriticalWound): boolean {
  return w.severity !== 'deadly'
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

// Healing Rest (errata p. 103): full health, and treated critical wounds are healed.
export function healingRest(c: Character, when: string): Partial<Character> {
  const patch = healHp(c, Infinity, 'Healing Rest', when)
  return { ...patch, healingStarted: false, crits: c.crits.map((w) => (w.treated && !w.healed ? { ...w, healed: true } : w)) }
}
