import { useEffect, useRef, useState } from 'react'
import {
  advanceTurn,
  applyDamage,
  CONDITION_HELP,
  CONDITIONS,
  duplicateEntry,
  entryFromCharacter,
  entriesFromTemplate,
  entryState,
  monsterEntries,
  isNameOnlySheet,
  partyEntries,
  playerEntry,
  recoverStamina,
  rollHitLocation,
  spendStamina,
  defenseBase,
  defenseCost,
  gangUpPenalty,
  takeDefense,
  rollInitiative,
  searchNpcs,
  turnOrder,
  type Encounter,
  type EncounterEntry,
  type MonsterInput,
} from '../model/encounter'
import type { Character } from '../model/types'
import { HIT_LOCATIONS, HIT_LOCATION_NAMES, type HitLocation } from '../rules/rules'
import { ConfirmButton, NumberField, NumberInput, TextField } from './fields'
import { BattleMap } from './BattleMap'
import { STORAGE_PREFIX } from '../edition'
import { blankInjury, cap, fromCritTable } from '../model/injuries'
import { critLevel, critWound, critWoundForRoll, CRIT_LEVELS, CRIT_WOUNDS } from '../model/criticals'
import { roll2d6 } from '../rules/dice'
import type { CritSeverity } from '../model/types'

const SP_SHORT: Record<HitLocation, string> = { head: 'H', torso: 'T', rArm: 'RA', lArm: 'LA', rLeg: 'RL', lLeg: 'LL' }
const STATE_LABEL = { ok: '', wounded: 'Wounded', dying: 'Death state', defeated: 'Out' } as const

type View = 'initiative' | 'map'
// Which tab each fight was last on. Kept on this device only, so flipping tabs doesn't count as
// editing the fight (that would reorder the encounter list).
const VIEW_KEY = `${STORAGE_PREFIX}:encounter-view`
function loadView(id: string): View {
  try {
    return JSON.parse(localStorage.getItem(VIEW_KEY) ?? '{}')[id] === 'map' ? 'map' : 'initiative'
  } catch {
    return 'initiative'
  }
}
function saveView(id: string, v: View) {
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify({ ...JSON.parse(localStorage.getItem(VIEW_KEY) ?? '{}'), [id]: v }))
  } catch {
    // Private windows: the tab just isn't remembered.
  }
}

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
  // One selection shared by the map tokens and the rows below.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setViewState] = useState<View>(() => loadView(e.id))
  const setView = (v: View) => {
    setViewState(v)
    saveView(e.id, v)
  }
  // Set by the map's "Show in initiative": once the list is on screen, scroll to that row.
  const scrollTo = useRef<string | null>(null)
  useEffect(() => {
    if (view !== 'initiative' || !scrollTo.current) return
    document.getElementById(`entry-${scrollTo.current}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    scrollTo.current = null
  }, [view])
  // Remembers which version of the fight was saved, so a new hit shows the button again.
  const [savedEntries, setSavedEntries] = useState<EncounterEntry[] | null>(null)
  const wroteBack = savedEntries === e.entries
  const order = turnOrder(e)
  const linked = e.entries.filter((x) => x.characterId && !x.nameOnly).length
  const players = characters.filter((c) => c.kind === 'pc')
  const partyToAdd = partyEntries(characters, e.entries)
  const waiting = e.entries.filter((x) => x.playerRolls && x.initiative === null)
  const cleared = e.entries.filter((x) => x.defeated && !x.characterId && !x.nameOnly)
  const upNextId = e.activeId ? advanceTurn(e, 1).activeId : null

  const log = (line: string, next: Encounter) => ({ ...next, log: [`R${next.round}: ${line}`, ...next.log].slice(0, 60) })
  const updEntry = (id: string, patch: Partial<EncounterEntry>) =>
    onChange({ ...e, entries: e.entries.map((x) => (x.id === id ? { ...x, ...patch } : x)) })
  const addEntries = (entries: EncounterEntry[]) =>
    onChange(log(`${entries.map((x) => x.name).join(', ')} joined`, { ...e, entries: [...e.entries, ...entries] }))
  const nextTurn = (dir: 1 | -1) => {
    const next = advanceTurn(e, dir)
    onChange(next.round > e.round ? log(`Round ${next.round} begins`, next) : next)
  }

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
        {e.entries.some((x) => x.initiative === null && !x.playerRolls) && e.entries.some((x) => x.initiative !== null) && (
          <button type="button" className="btn" onClick={() => onChange(rollInitiative(e, true))}>
            Roll for newcomers
          </button>
        )}
        {partyToAdd.length > 0 && (
          <button
            type="button"
            className="btn"
            title={`Add ${partyToAdd.map((x) => x.name).join(', ')}`}
            onClick={() => addEntries(partyToAdd)}
          >
            Add party ({partyToAdd.length})
          </button>
        )}
        <span className="toolbar-spacer" />
        <button type="button" className="btn btn-quiet" onClick={() => nextTurn(-1)} disabled={!e.activeId}>
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={() => nextTurn(1)} disabled={e.entries.length === 0}>
          {e.activeId ? 'Next turn' : 'Start fight'}
        </button>
      </div>

      {waiting.length > 0 && (
        <PlayerRolls
          key={waiting.map((x) => x.id).join()}
          waiting={waiting}
          onSet={(rolls) => {
            const entries = e.entries.map((x) => (x.id in rolls ? { ...x, initiative: rolls[x.id] } : x))
            onChange(log(`Player rolls: ${waiting.filter((x) => x.id in rolls).map((x) => `${x.name} ${rolls[x.id]}`).join(', ')}`, { ...e, entries }))
          }}
        />
      )}

      <div className="tabs encounter-tabs" role="tablist" aria-label="Encounter view">
        <button type="button" role="tab" aria-selected={view === 'initiative'} className={'tab' + (view === 'initiative' ? ' tab-active' : '')} onClick={() => setView('initiative')}>
          Initiative
        </button>
        <button type="button" role="tab" aria-selected={view === 'map'} className={'tab' + (view === 'map' ? ' tab-active' : '')} onClick={() => setView('map')}>
          Map
        </button>
      </div>

      {view === 'map' ? (
        e.entries.length === 0 ? (
          <div className="panel">
            <p className="hint">No one is in this fight yet. Add combatants on the Initiative tab and they appear here as tokens.</p>
          </div>
        ) : (
          <BattleMap
            encounter={e}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onShowInList={(id) => {
              setSelectedId(id)
              scrollTo.current = id
              setView('initiative')
            }}
            onChange={(map) => onChange({ ...e, map })}
          />
        )
      ) : (
      <>
      {e.entries.length === 0 ? (
        <div className="panel">
          <p className="hint">
            No one is in this fight yet. {players.length > 0 ? 'Add your party with one tap above, then add' : 'Add your players on the Players tab, then add'} NPCs,
            creatures from the bestiary or quick monsters with Add combatants.
          </p>
        </div>
      ) : (
        <ol className="turn-list">
          {order.map((x) => (
            <EntryRow
              key={x.id}
              x={x}
              active={x.id === e.activeId}
              upNext={x.id === upNextId && upNextId !== e.activeId}
              selected={x.id === selectedId}
              onSelect={() => setSelectedId(x.id === selectedId ? null : x.id)}
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
              onDuplicate={() => addEntries([duplicateEntry(x, e.entries)])}
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
        {cleared.length > 0 && (
          <button
            type="button"
            className="btn btn-quiet"
            title="Remove defeated monsters and NPC copies. Players and linked sheets stay."
            onClick={() =>
              onChange(
                log(`Cleared ${cleared.map((x) => x.name).join(', ')}`, {
                  ...e,
                  entries: e.entries.filter((x) => !cleared.includes(x)),
                  activeId: cleared.some((x) => x.id === e.activeId) ? null : e.activeId,
                }),
              )
            }
          >
            Clear defeated ({cleared.length})
          </button>
        )}
        {linked > 0 && (
          <button
            type="button"
            className="btn"
            title="Copy HP, Stamina, armor SP and new injuries back to the character sheets"
            onClick={() => {
              onWriteBack()
              setSavedEntries(e.entries)
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
      </>
      )}

      {adding && (
        <AddDialog
          characters={characters}
          entries={e.entries}
          onClose={() => setAdding(false)}
          onAdd={(entries) => {
            addEntries(entries)
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
  upNext: boolean
  selected: boolean
  onSelect: () => void
  damageOpen: boolean
  onToggleDamage: () => void
  onChange: (patch: Partial<EncounterEntry>) => void
  onDamage: (r: ReturnType<typeof applyDamage>) => void
  onRemove: () => void
  onDuplicate: () => void
  onRoll: TrackerProps['onRoll']
}) {
  const { x } = props
  const [showConds, setShowConds] = useState(false)
  const state = entryState(x)
  const pct = x.hp.max > 0 ? Math.max(0, Math.min(100, (x.hp.current / x.hp.max) * 100)) : 0
  const staPct = x.sta.max > 0 ? Math.max(0, Math.min(100, (x.sta.current / x.sta.max) * 100)) : 0
  return (
    <li
      id={`entry-${x.id}`}
      className={`entry entry-${x.kind} entry-${state}${props.active ? ' entry-active' : ''}${props.selected ? ' entry-selected' : ''}`}
      aria-current={props.active ? 'step' : undefined}
      // Tapping a bare part of the row picks its token on the map; the controls keep their own taps.
      onClick={(ev) => {
        if (!(ev.target as HTMLElement).closest('input, button, select, label, textarea, form, a')) props.onSelect()
      }}
    >
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
        <span className="entry-ref">{x.playerRolls ? 'own roll' : `REF ${x.initiativeBase}`}</span>
      </div>

      <div className="entry-main">
        <div className="entry-title">
          <input className="entry-name" aria-label="Combatant name" value={x.name} onChange={(ev) => props.onChange({ name: ev.target.value })} />
          <span className={'kind-pill kind-' + x.kind}>{x.kind === 'pc' ? 'Player' : x.kind === 'npc' ? 'NPC' : 'Monster'}</span>
          {STATE_LABEL[state] && <span className={'state-pill state-' + state}>{STATE_LABEL[state]}</span>}
          {props.upNext && <span className="state-pill state-next">Up next</span>}
          {x.conditions.map((c) => (
            <button
              key={c}
              type="button"
              className="cond cond-on"
              title={`${CONDITION_HELP[c as (typeof CONDITIONS)[number]] ?? ''} Click to clear.`}
              onClick={() => props.onChange({ conditions: x.conditions.filter((y) => y !== c) })}
            >
              {c} ×
            </button>
          ))}
        </div>

        {!x.nameOnly && (
        <>
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
              <span key={l} className="sp-chip" title={`${HIT_LOCATION_NAMES[l]} SP${x.toughSp ? ` (${x.sp[l]} armor + ${x.toughSp} Tough)` : ''}`}>
                <span>{SP_SHORT[l]}</span>
                <strong>{x.sp[l] + (x.toughSp ?? 0)}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="entry-actions">
          <button type="button" className={'btn' + (props.damageOpen ? ' btn-primary' : '')} onClick={props.onToggleDamage}>
            Damage
          </button>
          <button
            type="button"
            className="roll-btn roll-labeled"
            onClick={() => {
              const cost = defenseCost(x)
              props.onRoll(`${x.name} dodge${gangUpPenalty(x) ? ` (ganged up −${gangUpPenalty(x)})` : ''}${cost ? ', −1 STA' : ''}`, defenseBase(x))
              props.onChange(takeDefense(x))
            }}
            title={`Each defense after the first this round costs 1 STA unless they are actively dodging (core p. 151). Defenses so far: ${x.defensesThisRound ?? 0}`}
          >
            Dodge {defenseBase(x)}
            {defenseCost(x) ? ' · −1 STA' : ''}
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
          <button
            type="button"
            className="roll-btn roll-labeled"
            onClick={() => props.onRoll(`${x.name} Stun save (under ${x.stun})`, x.stun, true)}
            title={`Roll 1d10: under ${x.stun} saves, ${x.stun} or more fails`}
          >
            {state === 'dying' ? 'Death save' : 'Stun save'} {x.stun}
          </button>
          <button type="button" className="btn" onClick={() => props.onChange(recoverStamina(x))} title="Full-round Recover action: regain Stamina equal to REC">
            Recover +{x.rec ?? x.woundThreshold}
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => props.onChange(spendStamina(x, 3))} title="Extra action at -3, costs 3 Stamina (players only)">
            Extra action −3
          </button>
          <button
            type="button"
            className={'btn-chip' + (x.activelyDodging ? ' cond-on' : '')}
            aria-pressed={!!x.activelyDodging}
            onClick={() => props.onChange({ activelyDodging: !x.activelyDodging })}
            title="Full round: −2 to anyone striking them in melee this round, and no Stamina cost for defending (core p. 151)"
          >
            Actively dodging
          </button>
          <label className="gang-up" title="Ganging Up: −1 to defense per melee attacker past the first (core p. 153). Clears each round.">
            <span className="field-label">Melee attackers</span>
            <NumberInput ariaLabel={`${x.name} melee attackers`} value={x.meleeAttackers ?? 0} min={0} onChange={(v) => props.onChange({ meleeAttackers: v })} />
          </label>
        </div>

        {props.damageOpen && <DamageForm x={x} onApply={props.onDamage} />}
        </>
        )}

        {(x.injuries ?? []).length > 0 && (
          <ul className="entry-injuries">
            {(x.injuries ?? []).map((w) => (
              <li key={w.id}>
                <span className={'sev-pill sev-' + w.severity}>{cap(w.severity)}</span>
                {w.description || 'Critical wound'} · {HIT_LOCATION_NAMES[w.location]}
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Remove injury"
                  onClick={() => props.onChange({ injuries: (x.injuries ?? []).filter((y) => y.id !== w.id) })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="btn-chip cond-toggle" aria-expanded={showConds} onClick={() => setShowConds(!showConds)}>
          {showConds ? 'Hide conditions' : 'Conditions'}
        </button>
        {showConds && (
        <div className="conditions">
          {CONDITIONS.map((c) => {
            const on = x.conditions.includes(c)
            return (
              <button
                key={c}
                type="button"
                className={'cond' + (on ? ' cond-on' : '')}
                aria-pressed={on}
                title={CONDITION_HELP[c]}
                onClick={() => props.onChange({ conditions: on ? x.conditions.filter((y) => y !== c) : [...x.conditions, c] })}
              >
                {c}
              </button>
            )
          })}
        </div>
        )}
        {x.notes && <p className="hint">{x.notes}</p>}
      </div>

      <div className="entry-side">
        <label className="check">
          <input type="checkbox" checked={x.defeated} onChange={(ev) => props.onChange({ defeated: ev.target.checked })} />
          Out
        </label>
        {!x.nameOnly && (
          <button type="button" className="btn btn-quiet" title="Add another copy at full health" onClick={props.onDuplicate}>
            +1 copy
          </button>
        )}
        <ConfirmButton label="Remove" confirmLabel="Remove" onConfirm={props.onRemove} />
      </div>
    </li>
  )
}

function DamageForm({ x, onApply }: { x: EncounterEntry; onApply: (r: ReturnType<typeof applyDamage>) => void }) {
  const [amount, setAmount] = useState(0)
  const [location, setLocation] = useState<HitLocation>('torso')
  const [ignoreArmor, setIgnoreArmor] = useState(false)
  const [resistant, setResistant] = useState(x.resistant ?? x.kind === 'monster')
  const [vulnerable, setVulnerable] = useState(false)
  const [crit, setCrit] = useState(false)
  const [severity, setSeverity] = useState<CritSeverity>('simple')
  const [critText, setCritText] = useState('')
  // Critical bonus damage goes straight through armor (core p. 158).
  const bonus = crit ? critLevel(severity).bonus : 0
  const base = applyDamage(x, { amount, location, ignoreArmor, resistant, vulnerable, critBonus: bonus })
  const table = critWound(critText.trim())
  const blank = { ...blankInjury(location), severity, description: critText.trim() }
  const injury = crit ? (table ? fromCritTable(blank, table) : blank) : null
  const preview = injury
    ? {
        ...base,
        entry: { ...base.entry, injuries: [...(x.injuries ?? []), injury] },
        summary: `${amount > 0 ? base.summary : `${x.name}: ${base.hpLoss} HP`}; ${severity} critical (+${bonus}) to the ${HIT_LOCATION_NAMES[location].toLowerCase()}${injury.description ? ` (${injury.description})` : ''}, Stun save`,
      }
    : base
  // Rolls the wound on the 2d6 table for this severity, and moves the location to match.
  const rollWound = () => {
    const t = critWoundForRoll(severity, roll2d6())
    if (!t) return
    setCritText(t.name)
    if (t.area === 'head' || t.area === 'torso') setLocation(t.area)
    else if (t.area === 'arm' && location !== 'rArm' && location !== 'lArm') setLocation('rArm')
    else if (t.area === 'leg' && location !== 'rLeg' && location !== 'lLeg') setLocation('rLeg')
  }
  const canApply = amount > 0 || crit
  return (
    <form
      className="damage-form"
      onSubmit={(ev) => {
        ev.preventDefault()
        if (canApply) onApply(preview)
      }}
    >
      <NumberField label="Damage rolled" value={amount} min={0} onChange={setAmount} />
      <label className="field">
        <span className="field-label">Location</span>
        <span className="loc-row">
          <select value={location} onChange={(ev) => setLocation(ev.target.value as HitLocation)}>
            {HIT_LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {HIT_LOCATION_NAMES[l]} (SP {x.sp[l] + (x.toughSp ?? 0)})
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
        <label className="check">
          <input type="checkbox" checked={vulnerable} onChange={(ev) => setVulnerable(ev.target.checked)} />
          Susceptible (double)
        </label>
        <label className="check">
          <input type="checkbox" checked={crit} onChange={(ev) => setCrit(ev.target.checked)} />
          Critical wound
        </label>
      </div>
      {crit && (
        <div className="crit-fields">
          <label className="field">
            <span className="field-label">Severity</span>
            <select value={severity} onChange={(ev) => setSeverity(ev.target.value as CritSeverity)}>
              {CRIT_LEVELS.map((l) => (
                <option key={l.severity} value={l.severity}>
                  {cap(l.severity)} · beat defense by {l.beatBy}+ · +{l.bonus} damage
                </option>
              ))}
            </select>
          </label>
          <TextField label="Wound" value={critText} onChange={setCritText} placeholder="Pick or roll" list="crit-wounds" />
          <datalist id="crit-wounds">
            {CRIT_WOUNDS.filter((t) => t.severity === severity).map((t) => (
              <option key={t.name} value={t.name} />
            ))}
          </datalist>
          <button type="button" className="btn-chip" onClick={rollWound}>
            Roll 2d6
          </button>
          {table && <p className="hint">{table.effect}. Stabilized: {table.stabilized}. Treated: {table.treated} (core p. 158-160).</p>}
        </div>
      )}
      <div className="damage-preview">
        <span>
          {amount > 0 ? `${preview.hpLoss} HP${preview.ablated ? ', armor −1 SP' : ''}` : crit ? 'Critical only' : 'Enter the damage roll'}
          {crit && amount > 0 ? ' + critical' : ''}
        </span>
        <button type="submit" className="btn btn-primary" disabled={!canApply}>
          Apply
        </button>
      </div>
    </form>
  )
}

// The players' own initiative rolls, typed in together. Numbers are kept here until Set, so an
// entry doesn't jump around the turn order while the GM is still typing.
function PlayerRolls({ waiting, onSet }: { waiting: EncounterEntry[]; onSet: (rolls: Record<string, number>) => void }) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const rolls = Object.fromEntries(
    Object.entries(draft)
      .filter(([, v]) => v.trim() !== '' && Number.isFinite(Number(v)))
      .map(([k, v]) => [k, Number(v)]),
  )
  const filled = Object.keys(rolls).length
  return (
    <form
      className="panel player-rolls"
      onSubmit={(ev) => {
        ev.preventDefault()
        if (filled) onSet(rolls)
      }}
    >
      <h2 className="panel-title">Players' initiative</h2>
      <p className="hint">Ask each player for their initiative roll (REF + 1d10) and type it in. Roll initiative never overwrites these.</p>
      <div className="player-rolls-grid">
        {waiting.map((x) => (
          <label className="field" key={x.id}>
            <span className="field-label">{x.name}</span>
            <input
              type="number"
              inputMode="numeric"
              className="num"
              value={draft[x.id] ?? ''}
              placeholder="–"
              onChange={(ev) => setDraft({ ...draft, [x.id]: ev.target.value })}
            />
          </label>
        ))}
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={!filled}>
          {filled === waiting.length || !filled ? 'Set rolls' : `Set ${filled} of ${waiting.length}`}
        </button>
      </div>
    </form>
  )
}

const BLANK_MONSTER: MonsterInput = { name: '', count: 1, hp: 20, sta: 20, ref: 6, sp: 0, headSp: 0, dodge: 10, attack: 12, damage: '2d6', notes: '' }

function AddDialog(props: {
  characters: Character[]
  entries: EncounterEntry[]
  onClose: () => void
  onAdd: (entries: EncounterEntry[]) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [m, setM] = useState<MonsterInput>(BLANK_MONSTER)
  const already = new Set(props.entries.map((x) => x.characterId).filter(Boolean) as string[])
  const partyToAdd = partyEntries(props.characters, props.entries)
  // Any NPC sheet can be added as copies: the GM's own and campaign NPCs first, then the bestiary.
  const npcs = props.characters.filter((c) => c.kind === 'npc')
  const mine = npcs.filter((c) => !c.bestiary).sort((a, b) => a.name.localeCompare(b.name))
  const beasts = npcs.filter((c) => c.bestiary).sort((a, b) => a.bestiary!.category.localeCompare(b.bestiary!.category) || a.name.localeCompare(b.name))
  const [templateId, setTemplateId] = useState(mine[0]?.id ?? beasts[0]?.id ?? '')
  const [templateCount, setTemplateCount] = useState(1)
  const template = npcs.find((c) => c.id === templateId)
  const [query, setQuery] = useState('')
  const found = searchNpcs([...mine, ...beasts], query)
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal()
  }, [])
  const setMon = (patch: Partial<MonsterInput>) => setM({ ...m, ...patch })
  const pcs = props.characters.filter((c) => c.kind === 'pc').sort((a, b) => a.name.localeCompare(b.name))
  return (
    <dialog ref={ref} className="dialog dialog-wide" onClose={props.onClose}>
      <h2>Add combatants</h2>
      <section className="stack">
        <h3 className="panel-title">Your party</h3>
        {pcs.length === 0 ? (
          <p className="hint">No players yet. Add them on the Players tab with a name, race and profession.</p>
        ) : (
          <>
            <p className="hint">
              Players added with just a name join as a name, and they roll their own initiative. Full sheets bring their numbers, and their wounds
              can be saved back after the fight.
            </p>
            <div>
              <button type="button" className="btn btn-primary" disabled={partyToAdd.length === 0} onClick={() => props.onAdd(partyToAdd)}>
                {partyToAdd.length === 0 ? 'Whole party is in the fight' : `Add whole party to initiative (${partyToAdd.length})`}
              </button>
            </div>
            <ul className="pick-list">
              {pcs.map((c) => (
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
                    {isNameOnlySheet(c) && <span className="hint">name only</span>}
                    {already.has(c.id) && <span className="hint">already in</span>}
                  </label>
                </li>
              ))}
            </ul>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={picked.size === 0}
                onClick={() => props.onAdd(props.characters.filter((c) => picked.has(c.id)).map(playerEntry))}
              >
                Add {picked.size || ''} selected
              </button>
            </div>
          </>
        )}
      </section>
      {npcs.length > 0 && (
        <>
          <hr className="rule" />
          <section className="stack">
            <h3 className="panel-title">NPCs and the bestiary</h3>
            <label className="field">
              <span className="field-label">Search</span>
              <input
                type="search"
                value={query}
                placeholder="Name, type or threat, e.g. drowner, vampire, hard"
                aria-controls="npc-results"
                onChange={(ev) => setQuery(ev.target.value)}
                onKeyDown={(ev) => {
                  // Enter picks the top hit, so "ghoul" + Enter is enough.
                  if (ev.key === 'Enter' && found[0]) {
                    ev.preventDefault()
                    setTemplateId(found[0].id)
                  }
                }}
              />
            </label>
            <ul className="npc-results" id="npc-results" role="listbox" aria-label="NPCs and monsters">
              {found.length === 0 && <li className="hint">Nothing matches “{query}”. Quick-add it below instead.</li>}
              {found.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.id === templateId}
                    className={'npc-result' + (c.id === templateId ? ' npc-result-on' : '')}
                    onClick={() => setTemplateId(c.id)}
                  >
                    <span className="npc-result-name">{c.name}</span>
                    <span className="npc-result-meta">{c.bestiary ? `${c.bestiary.category} · ${c.bestiary.threat}` : 'Your NPC'}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="card-fields">
              <NumberField label="How many" value={templateCount} min={1} max={20} onChange={setTemplateCount} />
            </div>
            {template && (
              <p className="hint">
                {template.bestiary
                  ? `${template.bestiary.threat} · HP ${template.hp.maxOverride ?? template.hp.current} · ${template.bestiary.source === 'journal' ? `A Witcher's Journal p. ${template.bestiary.page}` : template.bestiary.checked ? 'Checked against the book' : 'Estimated stats, not yet checked against the book'}`
                  : `${template.notes.split('\n')[0]} · HP ${template.hp.maxOverride ?? template.hp.current}`}
              </p>
            )}
            <p className="hint">Added as copies: their damage never touches the sheet.</p>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!template}
                onClick={() => template && props.onAdd(entriesFromTemplate(template, templateCount, props.entries.map((x) => x.name)))}
              >
                Add {templateCount > 1 ? `${templateCount} × ${template?.name ?? ''}` : template?.name ?? ''}
              </button>
              {template && !template.bestiary && (
                <button
                  type="button"
                  className="btn"
                  disabled={already.has(template.id)}
                  title="Adds the sheet itself, so its wounds can be saved back after the fight"
                  onClick={() => props.onAdd([entryFromCharacter(template)])}
                >
                  {already.has(template.id) ? 'Sheet already in' : 'Add the sheet (keeps wounds)'}
                </button>
              )}
            </div>
          </section>
        </>
      )}
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

