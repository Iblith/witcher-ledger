import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import {
  livePositions,
  MAP_MAX,
  MAP_MIN,
  mapOf,
  moveToken,
  occupant,
  placeEveryone,
  removeToken,
  resizeMap,
  tokenLabel,
  type BattleMap as Map,
  type Square,
} from '../model/battlemap'
import { entryState, turnOrder, type Encounter, type EncounterEntry } from '../model/encounter'
import { ConfirmButton, NumberField, TextField } from './fields'

const MIN_CELL = 26
const MAX_CELL = 72

// Where a pointer is being dragged: the token and the square under the finger (null when off the grid).
interface Drag {
  id: string
  pointerId: number
  sq: Square | null
  moved: boolean
  startX: number
  startY: number
}

export function BattleMap(props: {
  encounter: Encounter
  selectedId: string | null
  onSelect: (id: string | null) => void
  onShowInList: (id: string) => void
  onChange: (m: Map) => void
}) {
  const e = props.encounter
  const m = mapOf(e)
  const order = turnOrder(e)
  const positions = livePositions(m, e.entries)
  const offMap = order.filter((x) => !positions[x.id])
  const selected = e.entries.find((x) => x.id === props.selectedId) ?? null
  const active = e.entries.find((x) => x.id === e.activeId) ?? null
  const [settings, setSettings] = useState(false)
  const [drag, setDrag] = useState<Drag | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)

  // Squares shrink to fit a phone, down to a size a finger can still hit; past that the grid scrolls.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const cell = Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor(width / m.cols)))

  const squareAt = (clientX: number, clientY: number): Square | null => {
    const r = boardRef.current?.getBoundingClientRect()
    if (!r) return null
    const x = Math.floor((clientX - r.left) / cell)
    const y = Math.floor((clientY - r.top) / cell)
    return x < 0 || y < 0 || x >= m.cols || y >= m.rows ? null : { x, y }
  }

  const startDrag = (ev: ReactPointerEvent<HTMLElement>, id: string) => {
    if (ev.button !== 0) return
    ev.currentTarget.setPointerCapture(ev.pointerId)
    setDrag({ id, pointerId: ev.pointerId, sq: positions[id] ?? null, moved: false, startX: ev.clientX, startY: ev.clientY })
  }
  const moveDrag = (ev: ReactPointerEvent<HTMLElement>) => {
    if (!drag || drag.pointerId !== ev.pointerId) return
    // A few pixels of wobble is still a tap.
    const moved = drag.moved || Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY) > 6
    setDrag({ ...drag, moved, sq: moved ? squareAt(ev.clientX, ev.clientY) : drag.sq })
  }
  const endDrag = (ev: ReactPointerEvent<HTMLElement>) => {
    if (!drag || drag.pointerId !== ev.pointerId) return
    const d = drag
    setDrag(null)
    if (!d.moved) {
      props.onSelect(props.selectedId === d.id ? null : d.id)
      return
    }
    props.onSelect(d.id)
    if (d.sq) props.onChange(moveToken(m, e.entries, d.id, d.sq))
  }
  const cancelDrag = () => setDrag(null)

  // Tapping an empty square moves the selected token there: easier than dragging on a small phone.
  const tapBoard = (ev: MouseEvent) => {
    if (ev.target !== ev.currentTarget || !selected) return
    const sq = squareAt(ev.clientX, ev.clientY)
    if (sq && !occupant(positions, sq)) props.onChange(moveToken(m, e.entries, selected.id, sq))
  }

  const tokenProps = (x: EncounterEntry) => {
    const state = entryState(x)
    const cls = [
      'token',
      `token-${x.kind}`,
      `token-${state}`,
      x.id === e.activeId ? 'token-active' : '',
      x.id === props.selectedId ? 'token-selected' : '',
      drag?.id === x.id && drag.moved ? 'token-dragging' : '',
    ]
    return {
      className: cls.filter(Boolean).join(' '),
      title: `${x.name}${x.id === e.activeId ? ' (their turn)' : ''}${state === 'defeated' ? ' (out)' : ''}`,
      'aria-label': x.name,
      'aria-pressed': x.id === props.selectedId,
      onPointerDown: (ev: ReactPointerEvent<HTMLElement>) => startDrag(ev, x.id),
      onPointerMove: moveDrag,
      onPointerUp: endDrag,
      onPointerCancel: cancelDrag,
      onLostPointerCapture: cancelDrag,
      // Keyboard: Enter picks the token, arrow keys step it one square.
      onClick: (ev: MouseEvent) => {
        if (ev.detail === 0) props.onSelect(props.selectedId === x.id ? null : x.id)
      },
      onKeyDown: (ev: KeyboardEvent) => {
        const p = positions[x.id]
        const step: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
        if (p && step[ev.key]) {
          ev.preventDefault()
          props.onChange(moveToken(m, e.entries, x.id, { x: p.x + step[ev.key][0], y: p.y + step[ev.key][1] }))
        }
      },
    }
  }

  const ghost = drag?.moved && drag.sq ? drag.sq : null

  return (
    <section className="panel battle-map" aria-label="Battle map">
      <div className="map-head">
        <h2 className="panel-title">
          Battle map
          <span className="panel-sub">
            {m.cols} × {m.rows}
            {m.squareLabel.trim() ? ` · 1 square = ${m.squareLabel.trim()}` : ''}
          </span>
        </h2>
        {active && <span className="state-pill state-next">Turn: {active.name}</span>}
        <span className="toolbar-spacer" />
        <button type="button" className="btn-chip" aria-expanded={settings} onClick={() => setSettings(!settings)}>
          {settings ? 'Done' : 'Grid'}
        </button>
      </div>

      {settings && (
        <div className="map-settings">
          <NumberField label="Columns" value={m.cols} min={MAP_MIN} max={MAP_MAX} onChange={(v) => props.onChange(resizeMap(m, v, m.rows))} />
          <NumberField label="Rows" value={m.rows} min={MAP_MIN} max={MAP_MAX} onChange={(v) => props.onChange(resizeMap(m, m.cols, v))} />
          <TextField label="One square is" value={m.squareLabel} placeholder="e.g. 2 m" onChange={(v) => props.onChange({ ...m, squareLabel: v })} />
          <p className="hint map-settings-note">
            The square size is your call: it is only a label, and the map works out no movement, reach or range (no rulebook figure for it here,
            unverified).
          </p>
        </div>
      )}

      <div className="map-scroll" ref={wrapRef}>
        <div
          ref={boardRef}
          className="map-board"
          style={{ width: m.cols * cell, height: m.rows * cell, backgroundSize: `${cell}px ${cell}px` }}
          onClick={tapBoard}
        >
          {ghost && <div className="map-ghost" style={{ left: ghost.x * cell, top: ghost.y * cell, width: cell, height: cell }} />}
          {order
            .filter((x) => positions[x.id])
            .map((x) => {
              const p = drag?.id === x.id && drag.moved && drag.sq ? drag.sq : positions[x.id]
              return (
                <button
                  key={x.id}
                  type="button"
                  {...tokenProps(x)}
                  style={{ left: p.x * cell, top: p.y * cell, width: cell, height: cell, fontSize: Math.max(11, cell * 0.32) }}
                >
                  <span>{tokenLabel(x.name)}</span>
                </button>
              )
            })}
        </div>
      </div>

      {offMap.length > 0 && (
        <div className="map-tray">
          <span className="field-label">Not on the map</span>
          <div className="map-tray-tokens">
            {offMap.map((x) => (
              <button key={x.id} type="button" {...tokenProps(x)} style={{ width: 40, height: 40 }}>
                <span>{tokenLabel(x.name)}</span>
              </button>
            ))}
          </div>
          <p className="hint">Drag a token onto the grid, or tap it and then tap a square.</p>
        </div>
      )}

      {selected ? (
        <div className="map-selected">
          <span className={`token token-${selected.kind} token-static`} aria-hidden="true">
            <span>{tokenLabel(selected.name)}</span>
          </span>
          <strong className="map-selected-name">{selected.name}</strong>
          {!selected.nameOnly && (
            <span className="map-selected-hp">
              HP {selected.hp.current}/{selected.hp.max}
            </span>
          )}
          {selected.id === e.activeId && <span className="state-pill state-next">Their turn</span>}
          {selected.conditions.length > 0 && <span className="hint">{selected.conditions.join(', ')}</span>}
          <span className="toolbar-spacer" />
          <button type="button" className="btn-chip" onClick={() => props.onShowInList(selected.id)}>
            Show in initiative
          </button>
          {positions[selected.id] && (
            <button type="button" className="btn-chip" onClick={() => props.onChange(removeToken(m, selected.id))}>
              Take off map
            </button>
          )}
        </div>
      ) : (
        <p className="hint">Tap a token to pick it, then tap an empty square to move it, or drag it.</p>
      )}

      <div className="tracker-bar">
        {offMap.length > 0 && (
          <button type="button" className="btn" onClick={() => props.onChange(placeEveryone(m, order))}>
            Place everyone ({offMap.length})
          </button>
        )}
        <span className="toolbar-spacer" />
        {Object.keys(positions).length > 0 && (
          <ConfirmButton label="Clear positions" confirmLabel="Clear all positions" onConfirm={() => props.onChange({ ...m, positions: {} })} />
        )}
      </div>
    </section>
  )
}
