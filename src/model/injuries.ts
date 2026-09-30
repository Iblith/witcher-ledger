import { uid } from './factory'
import type { Character, CriticalWound, CritSeverity } from './types'
import type { HitLocation } from '../rules/rules'

export const SEVERITIES: CritSeverity[] = ['simple', 'complex', 'difficult', 'deadly']
export const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export function blankInjury(location: HitLocation = 'torso'): CriticalWound {
  return { id: uid(), location, severity: 'simple', description: '', effect: '', when: '', treated: false, healed: false }
}

export function activeInjuries(c: Character): CriticalWound[] {
  return c.crits.filter((w) => !w.healed)
}
