import type { Encounter, EncounterEntry } from './encounter'

export interface Square {
  x: number
  y: number
}

// A plain positional grid for one fight: where everyone stands, nothing more. No movement, reach
// or range rules are applied; the square size is only a label the GM can change.
export interface BattleMap {
  cols: number
  rows: number
  // Free text such as "2 m" or "6 ft". Defaults to the core rulebook's 2 m.
  squareLabel: string
  // Set once the label has been checked against the book's scale. Maps saved before then carry the
  // old defaults (blank, or "1 m") and are moved to 2 m when read.
  scaleChecked?: boolean
  // Entry id -> square. Entries without a square wait beside the map.
  positions: Record<string, Square>
}

export const MAP_MIN = 4
export const MAP_MAX = 40

// "If you are using miniatures and a grid map ... each square is equal to 2m" (Core Rulebook p. 151).
export const BOOK_SQUARE = '2 m'
const OLD_DEFAULTS = ['', '1 m']

export function newMap(): BattleMap {
  return { cols: 12, rows: 8, squareLabel: BOOK_SQUARE, positions: {}, scaleChecked: true }
}

// Older saved fights have no map field and get an empty one. A label still on an old default
// becomes the book's 2 m; one the GM typed is left alone.
export function mapOf(e: Encounter): BattleMap {
  if (!e.map) return newMap()
  const m = { ...newMap(), ...e.map, scaleChecked: true }
  if (!e.map.scaleChecked && OLD_DEFAULTS.includes((e.map.squareLabel ?? '').trim())) m.squareLabel = BOOK_SQUARE
  return m
}

const clampSize = (n: number) => Math.max(MAP_MIN, Math.min(MAP_MAX, Math.floor(n) || MAP_MIN))

// Only squares of combatants still in the fight count; removed ones are forgotten.
export function livePositions(m: BattleMap, entries: EncounterEntry[]): Record<string, Square> {
  const ids = new Set(entries.map((x) => x.id))
  return Object.fromEntries(Object.entries(m.positions).filter(([id]) => ids.has(id)))
}

export function occupant(positions: Record<string, Square>, sq: Square, except?: string): string | null {
  for (const [id, p] of Object.entries(positions)) if (id !== except && p.x === sq.x && p.y === sq.y) return id
  return null
}

function nearestFree(positions: Record<string, Square>, m: BattleMap, sq: Square): Square | null {
  for (let r = 0; r < Math.max(m.cols, m.rows); r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
        const p = { x: sq.x + dx, y: sq.y + dy }
        if (p.x < 0 || p.y < 0 || p.x >= m.cols || p.y >= m.rows) continue
        if (!occupant(positions, p)) return p
      }
  return null
}

// Puts a token on a square. If someone already stands there, the two swap places (or the other
// one goes back beside the map when the moved token came from there).
export function moveToken(m: BattleMap, entries: EncounterEntry[], id: string, sq: Square): BattleMap {
  const target = { x: Math.max(0, Math.min(m.cols - 1, sq.x)), y: Math.max(0, Math.min(m.rows - 1, sq.y)) }
  const positions = livePositions(m, entries)
  const from = positions[id]
  const other = occupant(positions, target, id)
  if (other) {
    if (from) positions[other] = from
    else delete positions[other]
  }
  positions[id] = target
  return { ...m, positions }
}

export function removeToken(m: BattleMap, id: string): BattleMap {
  const positions = { ...m.positions }
  delete positions[id]
  return { ...m, positions }
}

// Players line up down the left edge and everyone else down the right, in turn order, skipping
// anyone already placed.
export function placeEveryone(m: BattleMap, order: EncounterEntry[]): BattleMap {
  const positions = livePositions(m, order)
  const place = (x: EncounterEntry, col: number) => {
    if (positions[x.id]) return
    const p = nearestFree(positions, m, { x: col, y: 0 })
    if (p) positions[x.id] = p
  }
  for (const x of order) place(x, x.kind === 'pc' ? 0 : m.cols - 1)
  return { ...m, positions }
}

// Changing the grid size keeps tokens that still fit and moves the rest to the nearest free square.
export function resizeMap(m: BattleMap, cols: number, rows: number): BattleMap {
  const next = { ...m, cols: clampSize(cols), rows: clampSize(rows), positions: {} as Record<string, Square> }
  const outside: [string, Square][] = []
  for (const [id, p] of Object.entries(m.positions)) {
    if (p.x < next.cols && p.y < next.rows) next.positions[id] = p
    else outside.push([id, p])
  }
  for (const [id, p] of outside) {
    const spot = nearestFree(next.positions, next, { x: Math.min(p.x, next.cols - 1), y: Math.min(p.y, next.rows - 1) })
    if (spot) next.positions[id] = spot
  }
  return next
}

// Short token text: "Drowner 3" -> "D3", "Geralt of Rivia" -> "GR", "Pip" -> "Pi".
export function tokenLabel(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const last = words[words.length - 1]
  if (/^\d+$/.test(last) && words.length > 1) return words[0][0].toUpperCase() + last
  const caps = words.filter((w) => /^[A-Za-zÀ-ž]/.test(w) && w[0] === w[0].toUpperCase())
  if (caps.length >= 2) return (caps[0][0] + caps[caps.length - 1][0]).toUpperCase()
  return words[0].slice(0, 2).replace(/^./, (c) => c.toUpperCase())
}
