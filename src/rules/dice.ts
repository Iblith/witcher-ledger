export type D10 = () => number

export const rollD10: D10 = () => 1 + Math.floor(Math.random() * 10)

export interface CheckRoll {
  label: string
  base: number
  dice: number[]
  dieTotal: number
  total: number
  outcome: 'normal' | 'critical' | 'fumble'
  at: number
}

// A skill check is STAT + skill + 1d10. A 10 explodes: roll again and add, repeating on 10s.
// A 1 is a fumble: roll again and subtract, and that penalty also keeps rolling on 10s.
export function rollCheck(label: string, base: number, d10: D10 = rollD10): CheckRoll {
  const first = d10()
  const dice = [first]
  let dieTotal = first
  let outcome: CheckRoll['outcome'] = 'normal'
  if (first === 10 || first === 1) {
    outcome = first === 10 ? 'critical' : 'fumble'
    const sign = first === 10 ? 1 : -1
    let next: number
    do {
      next = d10()
      dice.push(next)
      dieTotal += sign * next
    } while (next === 10)
  }
  return { label, base, dice, dieTotal, total: base + dieTotal, outcome, at: Date.now() }
}

// Saves (Stun, Death) are a plain 1d10 that must come in under the target; no exploding.
export function rollFlat(label: string, d10: D10 = rollD10): CheckRoll {
  const r = d10()
  return { label, base: 0, dice: [r], dieTotal: r, total: r, outcome: 'normal', at: Date.now() }
}
