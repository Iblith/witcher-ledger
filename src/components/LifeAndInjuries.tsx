import { useState } from 'react'
import { uid } from '../model/factory'
import { derived } from '../model/combat'
import { activeInjuries, blankInjury, canCountDown, cap, currentEffect, healHp, healingRest, healReady, SEVERITIES } from '../model/injuries'
import {
  LIFE_EVENT_KINDS,
  type Character,
  type CriticalWound,
  type CritSeverity,
  type LifeEvent,
  type LifeEventKind,
} from '../model/types'
import { HIT_LOCATIONS, HIT_LOCATION_NAMES, type HitLocation } from '../rules/rules'
import { ConfirmButton, NumberField, NumberInput, TextArea, TextField } from './fields'

type Setter = (patch: Partial<Character>) => void

export function Injuries({ c, set }: { c: Character; set: Setter }) {
  const active = activeInjuries(c)
  const healed = c.crits.filter((w) => w.healed)
  const untreated = active.filter((w) => !w.treated).length
  const deadlyHealed = healed.some((w) => w.severity === 'deadly')
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
          <span className="field-label">Not treated</span>
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

      <Healing c={c} set={set} />

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
              <TextField
                label="Effect once treated"
                value={w.treatedEffect ?? ''}
                onChange={(v) => upd(w.id, { treatedEffect: v })}
                placeholder="The table's treated effect, if different"
              />
              <TextField label="When" value={w.when ?? ''} onChange={(v) => upd(w.id, { when: v })} placeholder="e.g. Session 4" />
              {currentEffect(w) && (
                <p className="injury-now">
                  <span className="field-label">In effect now</span> {currentEffect(w)}
                </p>
              )}
              {w.treated && canCountDown(w) && <HealTracker w={w} upd={(patch) => upd(w.id, patch)} />}
              {w.severity === 'deadly' && (
                <p className="hint">
                  Deadly wounds aren't on the Critical Healing table, and their permanent penalties stay even after Healing Rest (errata p. 103, 174).
                </p>
              )}
              <div className="injury-actions">
                <label className="check">
                  <input type="checkbox" checked={w.treated} onChange={(e) => upd(w.id, { treated: e.target.checked })} />
                  Treated
                </label>
                <span className="toolbar-spacer" />
                <button type="button" className={'btn' + (healReady(w) ? ' btn-primary' : '')} onClick={() => upd(w.id, { healed: true })}>
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
                  {w.severity === 'deadly' && w.treatedEffect && <span className="injury-effect">Permanent: {w.treatedEffect}</span>}
                </span>
                <button type="button" className="btn-chip" onClick={() => upd(w.id, { healed: false })}>
                  Reopen
                </button>
              </li>
            ))}
          </ul>
          {deadlyHealed && <p className="hint">Deadly wounds keep their permanent penalties after healing.</p>}
        </section>
      )}
    </div>
  )
}

// HP healing and a record of it. Healing over time only starts after a DC:14 Healing Hands or First Aid
// check (errata p. 173); how much comes back each day is in the core book, so the player enters it.
function Healing({ c, set }: { c: Character; set: Setter }) {
  const max = derived(c).maxHp
  const [amount, setAmount] = useState(1)
  const [source, setSource] = useState('Rest')
  const [when, setWhen] = useState('')
  const log = c.healingLog ?? []
  const full = c.hp.current >= max
  return (
    <section className="panel stack">
      <div className="healing-head">
        <h2 className="panel-title">Healing</h2>
        <span className="healing-hp">
          HP <strong>{c.hp.current}</strong> / {max}
        </span>
      </div>
      <label className="check">
        <input type="checkbox" checked={!!c.healingStarted} disabled={full} onChange={(e) => set({ healingStarted: e.target.checked })} />
        Healing started (someone passed a DC:14 Healing Hands or First Aid check)
      </label>
      <div className="healing-form">
        <NumberField label="HP" value={amount} min={1} onChange={setAmount} />
        <TextField label="From" value={source} onChange={setSource} list="heal-sources" />
        <TextField label="When" value={when} onChange={setWhen} placeholder="e.g. Day 3" />
        <datalist id="heal-sources">
          <option value="Rest" />
          <option value="Healing Hands" />
          <option value="Potion" />
          <option value="Magic Healing" />
        </datalist>
        <button type="button" className="btn btn-primary" disabled={full} onClick={() => set(healHp(c, amount, source.trim() || 'Healing', when.trim()))}>
          Heal
        </button>
      </div>
      <div className="injury-actions">
        <button type="button" className="btn" disabled={full} onClick={() => set(healHp(c, 3, 'Magic Healing', when.trim()))} title="Errata p. 103: 3 HP per turn">
          Magic Healing turn +3 HP
        </button>
        <ConfirmButton
          label="Healing Rest"
          confirmLabel="Heal fully and heal treated wounds"
          onConfirm={() => set(healingRest(c, when.trim()))}
        />
      </div>
      {!c.healingStarted && !full && <p className="hint">Rest won't bring HP back until the healing process has been started.</p>}
      <p className="hint">
        Healing Rest restores full HP and heals every treated critical wound (errata p. 103). Daily healing amounts are in the core book.
      </p>
      {log.length > 0 && (
        <ul className="history-list">
          {[...log].reverse().map((h) => (
            <li key={h.id}>
              <span className="heal-pill">+{h.hp}</span>
              <span className="history-text">
                {h.source} {h.when && <span className="hint">· {h.when}</span>}
              </span>
              <button type="button" className="btn-chip" onClick={() => set({ healingLog: log.filter((x) => x.id !== h.id) })}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// Counts Healing Hands rounds or successful Healing spells toward the number the wound needs.
function HealTracker({ w, upd }: { w: CriticalWound; upd: (patch: Partial<CriticalWound>) => void }) {
  const by = w.healBy ?? 'doctor'
  const needed = w.healNeeded ?? 0
  const done = w.healDone ?? 0
  const unit = by === 'doctor' ? 'Healing Hands rounds' : 'Healing spells that beat the DC'
  return (
    <div className="heal-tracker">
      <div className="healing-form">
        <label className="field">
          <span className="field-label">Healed by</span>
          <select value={by} onChange={(e) => upd({ healBy: e.target.value as 'doctor' | 'mage' })}>
            <option value="doctor">Doctor</option>
            <option value="mage">Mage</option>
          </select>
        </label>
        <NumberField label="Needed" value={needed} min={0} onChange={(v) => upd({ healNeeded: v })} />
        <label className="field">
          <span className="field-label">Done</span>
          <span className="heal-count">
            <NumberInput ariaLabel={`${unit} done`} value={done} min={0} onChange={(v) => upd({ healDone: v })} />
            <button type="button" className="btn" onClick={() => upd({ healDone: done + 1 })}>
              +1
            </button>
          </span>
        </label>
      </div>
      {needed > 0 && (
        <div className="heal-bar" role="progressbar" aria-valuemin={0} aria-valuemax={needed} aria-valuenow={Math.min(done, needed)} aria-label="Healing progress">
          <span style={{ width: `${Math.min(100, (done / needed) * 100)}%` }} />
        </div>
      )}
      <p className="hint">
        {healReady(w)
          ? 'Done: mark the wound healed once the last roll beats its DC.'
          : `${unit}. Take the number and DC for this severity from the ${by === 'doctor' ? 'Healing Hands' : 'Healing Spell'} table in your book (errata p. 173).`}
      </p>
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
