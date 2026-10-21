import type { CritSeverity } from './types'

// Critical wounds, core rulebook p. 158-160. A critical lands when the attack beats the defense by 7 or
// more; the level sets bonus damage that armor can't stop, and the target makes a Stun save (p. 158).
// The extracted text prints the Complex and Difficult tables under each other's headings; the rows
// below follow the wounds (fractures are Complex, compound fractures Difficult).

export interface CritLevel {
  severity: CritSeverity
  beatBy: number
  bonus: number
}

export const CRIT_LEVELS: CritLevel[] = [
  { severity: 'simple', beatBy: 7, bonus: 3 },
  { severity: 'complex', beatBy: 10, bonus: 5 },
  { severity: 'difficult', beatBy: 13, bonus: 8 },
  { severity: 'deadly', beatBy: 15, bonus: 10 },
]

export function critLevel(severity: CritSeverity): CritLevel {
  return CRIT_LEVELS.find((l) => l.severity === severity)!
}

// The critical level for an attack that beat the defense by `margin`, or null under 7.
export function critForMargin(margin: number): CritLevel | null {
  return [...CRIT_LEVELS].reverse().find((l) => margin >= l.beatBy) ?? null
}

export type CritArea = 'head' | 'torso' | 'arm' | 'leg'

export interface CritWound {
  severity: CritSeverity
  // The 2d6 roll range on the table.
  roll: [number, number]
  name: string
  area: CritArea
  effect: string
  stabilized: string
  treated: string
}

const c = (severity: CritSeverity, roll: [number, number], name: string, area: CritArea, effect: string, stabilized: string, treated: string): CritWound => ({
  severity,
  roll,
  name,
  area,
  effect,
  stabilized,
  treated,
})

export const CRIT_WOUNDS: CritWound[] = [
  c('simple', [12, 12], 'Cracked Jaw', 'head', '-2 to Magical Skills and Verbal Combat', '-1 to Magical Skills and Verbal Combat', '-1 to Magical Skills'),
  c('simple', [11, 11], 'Disfiguring Scar', 'head', '-3 to empathic Verbal Combat', '-1 to empathic Verbal Combat', '-1 to Seduction'),
  c('simple', [9, 10], 'Cracked Ribs', 'torso', '-2 BODY (not Health Points)', '-1 BODY', '-10 Encumbrance'),
  c('simple', [6, 8], 'Foreign Object', 'torso', 'Recovery and Critical Healing quartered', 'Recovery and Critical Healing halved', '-2 Recovery, -1 Critical Healing'),
  c('simple', [4, 5], 'Sprained Arm', 'arm', '-2 to actions with that arm', '-1 to actions with that arm', '-1 Physique'),
  c('simple', [2, 3], 'Sprained Leg', 'leg', '-2 SPD, Dodge/Escape and Athletics', '-1 SPD, Dodge/Escape and Athletics', '-1 SPD'),
  c('complex', [12, 12], 'Minor Head Wound', 'head', '-1 INT, WILL and STUN', '-1 INT and WILL', '-1 WILL'),
  c('complex', [11, 11], 'Lost Teeth', 'head', 'Lose 1d10 teeth; -3 to magical skills and Verbal Combat', '-2 to magical skills and Verbal Combat', '-1 to magical skills and Verbal Combat'),
  c('complex', [9, 10], 'Ruptured Spleen', 'torso', 'Stun save every 5 rounds; bleeding', 'Stun save every 10 rounds', '-2 Stun'),
  c('complex', [6, 8], 'Broken Ribs', 'torso', '-2 BODY, -1 REF and DEX', '-1 BODY and REF', '-1 BODY'),
  c('complex', [4, 5], 'Fractured Arm', 'arm', '-3 to actions with that arm', '-2 to actions with that arm', '-1 to actions with that arm'),
  c('complex', [2, 3], 'Fractured Leg', 'leg', '-3 SPD, Dodge/Escape and Athletics', '-2 SPD, Dodge/Escape and Athletics', '-1 SPD, Dodge/Escape and Athletics'),
  c('difficult', [12, 12], 'Skull Fracture', 'head', '-1 INT and DEX, quadruple damage from head wounds; bleeding', '-1 INT and DEX, quadruple damage from head wounds', 'Quadruple damage from head wounds'),
  c('difficult', [11, 11], 'Concussion', 'head', 'Stun save every 1d6 rounds; -2 INT, REF and DEX', '-1 INT, REF and DEX', '-1 INT and DEX'),
  c('difficult', [9, 10], 'Torn Stomach', 'torso', '-2 to all actions; 4 acid damage per round', '-2 to all actions', '-1 to all actions'),
  c('difficult', [6, 8], 'Sucking Chest Wound', 'torso', '-3 BODY and SPD; suffocating', '-2 BODY and SPD', '-1 BODY and SPD'),
  c('difficult', [4, 5], 'Compound Arm Fracture', 'arm', 'Arm useless; bleeding', 'Arm useless', 'Arm in a sling, but it can hold things'),
  c('difficult', [2, 3], 'Compound Leg Fracture', 'leg', 'Quarter SPD, Dodge/Escape and Athletics; bleeding', 'Half SPD, Dodge/Escape and Athletics', '-2 SPD, Dodge/Escape and Athletics'),
  c('deadly', [12, 12], 'Separated Spine/Decapitated', 'head', 'Dies immediately', 'Cannot be stabilized', 'Cannot be treated'),
  c('deadly', [11, 11], 'Damaged Eye', 'head', '-5 sight-based Awareness, -4 DEX; bleeding', '-3 sight-based Awareness, -2 DEX', 'Permanent -1 sight-based Awareness and DEX'),
  c('deadly', [9, 10], 'Heart Damage', 'torso', 'Immediate Death save; then bleeding, quarter Stamina, SPD and BODY', 'Half Stamina, SPD and BODY', 'Permanently +2 damage per round from bleeding'),
  c('deadly', [6, 8], 'Septic Shock', 'torso', 'Quarter Stamina, -3 INT, WILL, REF and DEX; poisoned', 'Half Stamina, -1 INT, WILL, REF and DEX', 'Permanent -5 Stamina'),
  c('deadly', [4, 5], 'Dismembered Arm', 'arm', 'Arm unusable; bleeding', 'Arm useless', 'Can be replaced with a prosthetic'),
  c('deadly', [2, 3], 'Dismembered Leg', 'leg', 'Quarter SPD, Dodge/Escape and Athletics; bleeding', 'Quarter SPD, Dodge/Escape and Athletics', 'Can be replaced with a prosthetic'),
]

export function critWound(name: string): CritWound | undefined {
  return CRIT_WOUNDS.find((w) => w.name === name)
}

export function critWoundForRoll(severity: CritSeverity, roll: number): CritWound | undefined {
  return CRIT_WOUNDS.find((w) => w.severity === severity && roll >= w.roll[0] && roll <= w.roll[1])
}

// Healing Hands (rounds of work, then a roll that beats the DC) and Healing spell (uses that beat the
// DC) per severity, core p. 174.
export const HEALING_HANDS: Record<CritSeverity, { turns: number; dc: number }> = {
  simple: { turns: 2, dc: 12 },
  complex: { turns: 4, dc: 14 },
  difficult: { turns: 6, dc: 16 },
  deadly: { turns: 8, dc: 18 },
}

export const HEALING_SPELL: Record<CritSeverity, { uses: number; dc: number }> = {
  simple: { uses: 4, dc: 14 },
  complex: { uses: 6, dc: 16 },
  difficult: { uses: 8, dc: 18 },
  deadly: { uses: 10, dc: 20 },
}

// Critical Healing (core p. 174): days for a treated wound's penalty to fade, by BODY (3 to 13).
// Deadly wounds have no column: their treated effects stay.
const CRIT_HEAL_DAYS: Record<Exclude<CritSeverity, 'deadly'>, number[]> = {
  simple: [5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1],
  complex: [9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1],
  difficult: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
}

export function critHealDays(body: number, severity: CritSeverity): number | null {
  if (severity === 'deadly') return null
  const row = CRIT_HEAL_DAYS[severity]
  return row[Math.max(0, Math.min(row.length - 1, body - 3))]
}
