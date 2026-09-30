import { useState } from 'react'
import { uid } from '../model/factory'
import { activeInjuries, blankInjury, cap, SEVERITIES } from '../model/injuries'
import {
  LIFE_EVENT_KINDS,
  type Character,
  type CriticalWound,
  type CritSeverity,
  type LifeEvent,
  type LifeEventKind,
} from '../model/types'
import { HIT_LOCATIONS, HIT_LOCATION_NAMES, type HitLocation } from '../rules/rules'
import { ConfirmButton, TextArea, TextField } from './fields'

type Setter = (patch: Partial<Character>) => void

export function Injuries({ c, set }: { c: Character; set: Setter }) {
  const active = activeInjuries(c)
  const healed = c.crits.filter((w) => w.healed)
  const untreated = active.filter((w) => !w.treated).length
  const upd = (id: string, patch: Partial<CriticalWound>) =>
    set({ crits: c.crits.map((w) => (w.id === id ? { ...w, ...patch } : w)) })
  const remove = (id: string) => set({ crits: c.crits.filter((w) => w.id !== id) })

  return (
    <div className="stack">
      <section className="panel injury-summary">
        <div className="summary-num">
          <span className="field-label">Active injuries</span>
          <strong>{active.length}</strong>
        </div>
        <div className={'summary-num' + (untreated ? ' summary-alert' : '')}>
          <span className="field-label">Not stabilized</span>
          <strong>{untreated}</strong>
        </div>
        <div className="summary-num">
          <span className="field-label">Healed</span>
          <strong>{healed.length}</strong>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => set({ crits: [...c.crits, blankInjury()] })}>
          Add injury
        </button>
      </section>

      {active.length === 0 ? (
        <p className="hint">No active injuries. Critical wounds logged in an encounter show up here after you save wounds to sheets.</p>
      ) : (
        <div className="cards">
          {active.map((w) => (
            <div className={`card injury injury-${w.severity}${w.treated ? ' injury-treated' : ''}`} key={w.id}>
              <div className="injury-head">
                <select aria-label="Severity" value={w.severity} onChange={(e) => upd(w.id, { severity: e.target.value as CritSeverity })}>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {cap(s)}
                    </option>
                  ))}
                </select>
                <select aria-label="Location" value={w.location} onChange={(e) => upd(w.id, { location: e.target.value as HitLocation })}>
                  {HIT_LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {HIT_LOCATION_NAMES[l]}
                    </option>
                  ))}
                </select>
              </div>
              <TextField label="Injury" value={w.description} onChange={(v) => upd(w.id, { description: v })} placeholder="e.g. Cracked ribs" />
              <TextField label="Effect" value={w.effect ?? ''} onChange={(v) => upd(w.id, { effect: v })} placeholder="Penalty from the critical table" />
              <TextField label="When" value={w.when ?? ''} onChange={(v) => upd(w.id, { when: v })} placeholder="e.g. Session 4" />
              <div className="injury-actions">
                <label className="check">
                  <input type="checkbox" checked={w.treated} onChange={(e) => upd(w.id, { treated: e.target.checked })} />
                  Stabilized
                </label>
                <span className="toolbar-spacer" />
                <button type="button" className="btn" onClick={() => upd(w.id, { healed: true })}>
                  Mark healed
                </button>
                <ConfirmButton label="Delete" confirmLabel="Delete" onConfirm={() => remove(w.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {healed.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">Healed</h2>
          <ul className="history-list">
            {healed.map((w) => (
              <li key={w.id}>
                <span className={'sev-pill sev-' + w.severity}>{cap(w.severity)}</span>
                <span className="history-text">
                  {w.description || 'Unnamed injury'} <span className="hint">· {HIT_LOCATION_NAMES[w.location]}{w.when ? ` · ${w.when}` : ''}</span>
                </span>
                <button type="button" className="btn-chip" onClick={() => upd(w.id, { healed: false })}>
                  Reopen
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export function LifeEvents({ c, set }: { c: Character; set: Setter }) {
  const [filter, setFilter] = useState<LifeEventKind | 'All'>('All')
  const [draft, setDraft] = useState<Omit<LifeEvent, 'id'>>({ when: '', kind: 'Campaign', title: '', details: '' })
  const events = c.lifeEvents ?? []
  const upd = (id: string, patch: Partial<LifeEvent>) =>
    set({ lifeEvents: events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
  const move = (i: number, d: -1 | 1) => {
    const next = [...events]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set({ lifeEvents: next })
  }
  const shown = events.map((e, i) => ({ e, i })).filter(({ e }) => filter === 'All' || e.kind === filter)
  const used = LIFE_EVENT_KINDS.filter((k) => events.some((e) => e.kind === k))

  return (
    <div className="stack">
      <form
        className="panel"
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!draft.title.trim()) return
          set({ lifeEvents: [...events, { ...draft, id: uid(), title: draft.title.trim() }] })
          setDraft({ ...draft, title: '', details: '' })
        }}
      >
        <h2 className="panel-title">Add a life event</h2>
        <p className="hint">Lifepath rolls from character creation and anything that happens in play. They stay in order, oldest first.</p>
        <div className="event-form">
          <TextField label="When" value={draft.when} onChange={(v) => setDraft({ ...draft, when: v })} placeholder="Age 12, Session 3…" />
          <label className="field">
            <span className="field-label">Type</span>
            <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as LifeEventKind })}>
              {LIFE_EVENT_KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <TextField label="What happened" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="e.g. Saved a merchant's life" />
        </div>
        <TextArea label="Details" rows={2} value={draft.details} onChange={(v) => setDraft({ ...draft, details: v })} />
        <div>
          <button type="submit" className="btn btn-primary" disabled={!draft.title.trim()}>
            Add event
          </button>
        </div>
      </form>

      {used.length > 1 && (
        <div className="conditions" role="group" aria-label="Filter events">
          {(['All', ...used] as const).map((k) => (
            <button key={k} type="button" className={'cond' + (filter === k ? ' cond-on' : '')} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {k}
            </button>
          ))}
        </div>
      )}

      {events.length === 0 ? (
        <p className="hint">No life events yet.</p>
      ) : (
        <ol className="timeline">
          {shown.map(({ e, i }) => (
            <li key={e.id} className={'event event-' + e.kind.toLowerCase()}>
              <div className="event-when">
                <input aria-label="When" value={e.when} placeholder="When" onChange={(ev) => upd(e.id, { when: ev.target.value })} />
              </div>
              <div className="event-body">
                <div className="event-title-row">
                  <select aria-label="Type" className="event-kind" value={e.kind} onChange={(ev) => upd(e.id, { kind: ev.target.value as LifeEventKind })}>
                    {LIFE_EVENT_KINDS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                  <input className="event-title" aria-label="What happened" value={e.title} onChange={(ev) => upd(e.id, { title: ev.target.value })} />
                </div>
                <textarea aria-label="Details" rows={2} value={e.details} placeholder="Details" onChange={(ev) => upd(e.id, { details: ev.target.value })} />
                <div className="event-actions">
                  <button type="button" className="icon-btn" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button type="button" className="icon-btn" aria-label="Move later" disabled={i === events.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <span className="toolbar-spacer" />
                  <ConfirmButton label="Delete" confirmLabel="Delete event" onConfirm={() => set({ lifeEvents: events.filter((x) => x.id !== e.id) })} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
