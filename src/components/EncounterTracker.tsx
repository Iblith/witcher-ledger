import { useEffect, useRef, useState } from 'react'
import {
  advanceTurn,
  applyDamage,
  CONDITIONS,
  entryFromCharacter,
  entryState,
  monsterEntries,
  rollHitLocation,
  rollInitiative,
  turnOrder,
  type Encounter,
  type EncounterEntry,
  type MonsterInput,
} from '../model/encounter'
import type { Character } from '../model/types'
import { HIT_LOCATIONS, HIT_LOCATION_NAMES, type HitLocation } from '../rules/rules'
import { ConfirmButton, NumberField, NumberInput, TextField } from './fields'

const SP_SHORT: Record<HitLocation, string> = { head: 'H', torso: 'T', rArm: 'RA', lArm: 'LA', rLeg: 'RL', lLeg: 'LL' }
const STATE_LABEL = { ok: '', wounded: 'Wounded', dying: 'Death state', defeated: 'Out' } as const

export interface TrackerProps {
  encounter: Encounter
  characters: Character[]
  onChange: (e: Encounter) => void
  onRoll: (label: string, base: number, flat?: boolean) => void
  onWriteBack: () => void
}

export function EncounterTracker({ encounter: e, characters, onChange, onRoll, onWriteBack }: TrackerProps) {
  const [adding, setAdding] = useState(false)
  const [damageFor, setDamageFor] = useState<string | null>(null)
  const [wroteBack, setWroteBack] = useState(false)
  const order = turnOrder(e)
  const linked = e.entries.filter((x) => x.characterId).length

  const log = (line: string, next: Encounter) => ({ ...next, log: [`R${next.round}: ${line}`, ...next.log].slice(0, 60) })
  const updEntry = (id: string, patch: Partial<EncounterEntry>) =>
    onChange({ ...e, entries: e.entries.map((x) => (x.id === id ? { ...x, ...patch } : x)) })

  return (
    <div className="tracker">
      <header className="tracker-head">
        <input className="sheet-name" aria-label="Encounter name" value={e.name} onChange={(ev) => onChange({ ...e, name: ev.target.value })} />
        <div className="round-box" aria-label={`Round ${e.round}`}>
          <span className="field-label">Round</span>
          <span className="round-num">{e.round}</span>
        </div>
      </header>

      <div className="tracker-bar">
        <button type="button" className="btn" onClick={() => onChange(log('Rolled initiative', rollInitiative(e)))} disabled={e.entries.length === 0}>
          Roll initiative
        </button>
        {e.entries.some((x) => x.initiative === null) && e.entries.some((x) => x.initiative !== null) && (
          <button type="button" className="btn" onClick={() => onChange(rollInitiative(e, true))}>
            Roll for newcomers
          </button>
        )}
        <span className="toolbar-spacer" />
        <button type="button" className="btn btn-quiet" onClick={() => onChange(advanceTurn(e, -1))} disabled={!e.activeId}>
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onChange(advanceTurn(e, 1))} disabled={e.entries.length === 0}>
          {e.activeId ? 'Next turn' : 'Start fight'}
        </button>
      </div>

      {e.entries.length === 0 ? (
        <div className="panel">
          <p className="hint">No one is in this fight yet. Add characters from your roster or quick-add monsters.</p>
        </div>
      ) : (
        <ol className="turn-list">
          {order.map((x) => (
            <EntryRow
              key={x.id}
              x={x}
              active={x.id === e.activeId}
              damageOpen={damageFor === x.id}
              onToggleDamage={() => setDamageFor(damageFor === x.id ? null : x.id)}
              onChange={(patch) => updEntry(x.id, patch)}
              onDamage={(result) => {
                const next = { ...e, entries: e.entries.map((y) => (y.id === x.id ? result.entry : y)) }
                onChange(log(result.summary, next))
                setDamageFor(null)
              }}
              onRemove={() =>
                onChange({ ...e, entries: e.entries.filter((y) => y.id !== x.id), activeId: e.activeId === x.id ? null : e.activeId })
              }
              onRoll={onRoll}
            />
          ))}
        </ol>
      )}

      <div className="tracker-bar">
        <button type="button" className="btn" onClick={() => setAdding(true)}>
          Add combatants
        </button>
        <span className="toolbar-spacer" />
        {linked > 0 && (
          <button
            type="button"
            className="btn"
            title="Copy HP, Stamina and armor SP back to the character sheets"
            onClick={() => {
              onWriteBack()
              setWroteBack(true)
            }}
          >
            {wroteBack ? 'Saved to sheets' : `Save wounds to ${linked} sheet${linked > 1 ? 's' : ''}`}
          </button>
        )}
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() =>
            onChange({
              ...e,
              round: 1,
              activeId: null,
              entries: e.entries.map((x) => ({ ...x, initiative: null })),
              log: ['Fight reset', ...e.log],
            })
          }
        >
          Reset rounds
        </button>
      </div>

      {e.log.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">Combat log</h2>
          <ol className="combat-log">
            {e.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </section>
      )}

      {adding && (
        <AddDialog
          characters={characters}
          already={new Set(e.entries.map((x) => x.characterId).filter(Boolean) as string[])}
          onClose={() => setAdding(false)}
          onAdd={(entries) => {
            onChange(log(`${entries.map((x) => x.name).join(', ')} joined`, { ...e, entries: [...e.entries, ...entries] }))
            setAdding(false)
          }}
        />
      )}
    </div>
  )
}

function EntryRow(props: {
  x: EncounterEntry
  active: boolean
  damageOpen: boolean
  onToggleDamage: () => void
  onChange: (patch: Partial<EncounterEntry>) => void
  onDamage: (r: ReturnType<typeof applyDamage>) => void
  onRemove: () => void
  onRoll: TrackerProps['onRoll']
}) {
  const { x } = props
  const state = entryState(x)
  const pct = x.hp.max > 0 ? Math.max(0, Math.min(100, (x.hp.current / x.hp.max) * 100)) : 0
  const staPct = x.sta.max > 0 ? Math.max(0, Math.min(100, (x.sta.current / x.sta.max) * 100)) : 0
  return (
    <li className={`entry entry-${x.kind} entry-${state}${props.active ? ' entry-active' : ''}`} aria-current={props.active ? 'step' : undefined}>
      <div className="entry-init">
        <span className="field-label">Init</span>
        <input
          type="number"
          className="num"
          aria-label={`${x.name} initiative`}
          value={x.initiative ?? ''}
          placeholder="–"
          onChange={(ev) => props.onChange({ initiative: ev.target.value === '' ? null : Number(ev.target.value) })}
        />
        <span className="entry-ref">REF {x.initiativeBase}</span>
      </div>

      <div className="entry-main">
        <div className="entry-title">
          <input className="entry-name" aria-label="Combatant name" value={x.name} onChange={(ev) => props.onChange({ name: ev.target.value })} />
          <span className={'kind-pill kind-' + x.kind}>{x.kind === 'pc' ? 'Player' : x.kind === 'npc' ? 'NPC' : 'Monster'}</span>
          {STATE_LABEL[state] && <span className={'state-pill state-' + state}>{STATE_LABEL[state]}</span>}
        </div>

        <div className="entry-pools">
          <div className="mini-pool mini-hp">
            <span className="field-label">HP</span>
            <NumberInput ariaLabel={`${x.name} HP`} value={x.hp.current} onChange={(v) => props.onChange({ hp: { ...x.hp, current: v } })} />
            <span className="pool-max">/ {x.hp.max}</span>
            <div className="pool-bar" aria-hidden="true">
              <div className="pool-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="mini-pool mini-sta">
            <span className="field-label">STA</span>
            <NumberInput ariaLabel={`${x.name} Stamina`} value={x.sta.current} onChange={(v) => props.onChange({ sta: { ...x.sta, current: v } })} />
            <span className="pool-max">/ {x.sta.max}</span>
            <div className="pool-bar" aria-hidden="true">
              <div className="pool-fill" style={{ width: `${staPct}%` }} />
            </div>
          </div>
          <div className="sp-strip" aria-label="Armor SP by location">
            {HIT_LOCATIONS.map((l) => (
              <span key={l} className="sp-chip" title={`${HIT_LOCATION_NAMES[l]} SP`}>
                <span>{SP_SHORT[l]}</span>
                <strong>{x.sp[l]}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="entry-actions">
          <button type="button" className={'btn' + (props.damageOpen ? ' btn-primary' : '')} onClick={props.onToggleDamage}>
            Damage
          </button>
          <button type="button" className="roll-btn roll-labeled" onClick={() => props.onRoll(`${x.name} dodge`, x.defenses.dodge)}>
            Dodge {x.defenses.dodge}
          </button>
          {x.attacks.map((a, i) => (
            <button
              key={i}
              type="button"
              className="roll-btn roll-labeled"
              title={`Damage ${a.damage}`}
              onClick={() => props.onRoll(`${x.name}: ${a.name}`, a.base)}
            >
              {a.name} {a.base}
            </button>
          ))}
          <button type="button" className="roll-btn roll-labeled" onClick={() => props.onRoll(`${x.name} Stun save (need ${x.stun} or less)`, 0, true)} title={`Roll 1d10, ${x.stun} or less to stay up`}>
            Stun {x.stun}
          </button>
        </div>

        {props.damageOpen && <DamageForm x={x} onApply={props.onDamage} />}

        <div className="conditions">
          {CONDITIONS.map((c) => {
            const on = x.conditions.includes(c)
            return (
              <button
                key={c}
                type="button"
                className={'cond' + (on ? ' cond-on' : '')}
                aria-pressed={on}
                onClick={() => props.onChange({ conditions: on ? x.conditions.filter((y) => y !== c) : [...x.conditions, c] })}
              >
                {c}
              </button>
            )
          })}
        </div>
        {x.notes && <p className="hint">{x.notes}</p>}
      </div>

      <div className="entry-side">
        <label className="check">
          <input type="checkbox" checked={x.defeated} onChange={(ev) => props.onChange({ defeated: ev.target.checked })} />
          Out
        </label>
        <ConfirmButton label="Remove" confirmLabel="Remove" onConfirm={props.onRemove} />
      </div>
    </li>
  )
}

function DamageForm({ x, onApply }: { x: EncounterEntry; onApply: (r: ReturnType<typeof applyDamage>) => void }) {
  const [amount, setAmount] = useState(0)
  const [location, setLocation] = useState<HitLocation>('torso')
  const [ignoreArmor, setIgnoreArmor] = useState(false)
  const [resistant, setResistant] = useState(x.kind === 'monster')
  const preview = applyDamage(x, { amount, location, ignoreArmor, resistant })
  return (
    <form
      className="damage-form"
      onSubmit={(ev) => {
        ev.preventDefault()
        if (amount > 0) onApply(preview)
      }}
    >
      <NumberField label="Damage rolled" value={amount} min={0} onChange={setAmount} />
      <label className="field">
        <span className="field-label">Location</span>
        <span className="loc-row">
          <select value={location} onChange={(ev) => setLocation(ev.target.value as HitLocation)}>
            {HIT_LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {HIT_LOCATION_NAMES[l]} (SP {x.sp[l]})
              </option>
            ))}
          </select>
          <button type="button" className="btn-chip" onClick={() => setLocation(rollHitLocation())}>
            Roll
          </button>
        </span>
      </label>
      <div className="damage-checks">
        <label className="check">
          <input type="checkbox" checked={ignoreArmor} onChange={(ev) => setIgnoreArmor(ev.target.checked)} />
          Ignore armor
        </label>
        <label className="check">
          <input type="checkbox" checked={resistant} onChange={(ev) => setResistant(ev.target.checked)} />
          Resistant (half)
        </label>
      </div>
      <div className="damage-preview">
        <span>{amount > 0 ? `${preview.hpLoss} HP${preview.ablated ? ', armor −1 SP' : ''}` : 'Enter the damage roll'}</span>
        <button type="submit" className="btn btn-primary" disabled={amount <= 0}>
          Apply
        </button>
      </div>
    </form>
  )
}

const BLANK_MONSTER: MonsterInput = { name: '', count: 1, hp: 20, sta: 20, ref: 6, sp: 0, headSp: 0, dodge: 10, attack: 12, damage: '2d6', notes: '' }

function AddDialog(props: {
  characters: Character[]
  already: Set<string>
  onClose: () => void
  onAdd: (entries: EncounterEntry[]) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [m, setM] = useState<MonsterInput>(BLANK_MONSTER)
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal()
  }, [])
  const setMon = (patch: Partial<MonsterInput>) => setM({ ...m, ...patch })
  const available = [...props.characters].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))
  return (
    <dialog ref={ref} className="dialog dialog-wide" onClose={props.onClose}>
      <h2>Add combatants</h2>
      <section className="stack">
        <h3 className="panel-title">From your characters</h3>
        {available.length === 0 && <p className="hint">No character sheets yet.</p>}
        <ul className="pick-list">
          {available.map((c) => (
            <li key={c.id}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={picked.has(c.id)}
                  onChange={(ev) => {
                    const next = new Set(picked)
                    if (ev.target.checked) next.add(c.id)
                    else next.delete(c.id)
                    setPicked(next)
                  }}
                />
                {c.name}
                <span className={'kind-pill kind-' + c.kind}>{c.kind === 'pc' ? 'Player' : 'NPC'}</span>
                {props.already.has(c.id) && <span className="hint">already in</span>}
              </label>
            </li>
          ))}
        </ul>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={picked.size === 0}
            onClick={() => props.onAdd(props.characters.filter((c) => picked.has(c.id)).map(entryFromCharacter))}
          >
            Add {picked.size || ''} selected
          </button>
        </div>
      </section>
      <hr className="rule" />
      <form
        className="stack"
        onSubmit={(ev) => {
          ev.preventDefault()
          if (m.name.trim()) props.onAdd(monsterEntries({ ...m, name: m.name.trim() }))
        }}
      >
        <h3 className="panel-title">Quick-add a monster</h3>
        <div className="card-fields">
          <TextField label="Name" value={m.name} onChange={(v) => setMon({ name: v })} placeholder="e.g. Nekker" />
          <NumberField label="How many" value={m.count} min={1} max={20} onChange={(v) => setMon({ count: v })} />
          <NumberField label="HP" value={m.hp} min={1} onChange={(v) => setMon({ hp: v })} />
          <NumberField label="STA" value={m.sta} min={0} onChange={(v) => setMon({ sta: v })} />
          <NumberField label="REF" value={m.ref} min={0} onChange={(v) => setMon({ ref: v })} />
          <NumberField label="Body SP" value={m.sp} min={0} onChange={(v) => setMon({ sp: v })} />
          <NumberField label="Head SP" value={m.headSp} min={0} onChange={(v) => setMon({ headSp: v })} />
          <NumberField label="Dodge total" value={m.dodge} min={0} onChange={(v) => setMon({ dodge: v })} />
          <NumberField label="Attack total" value={m.attack} min={0} onChange={(v) => setMon({ attack: v })} />
          <TextField label="Damage" value={m.damage} onChange={(v) => setMon({ damage: v })} />
        </div>
        <TextField label="Notes" value={m.notes} onChange={(v) => setMon({ notes: v })} placeholder="Weaknesses, abilities" />
        <div className="dialog-actions">
          <button type="submit" className="btn btn-primary" disabled={!m.name.trim()}>
            Add {m.count > 1 ? `${m.count} monsters` : 'monster'}
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  )
}
