import { useEffect, useMemo, useRef, useState } from 'react'
import { EDITION_LABEL, IS_GM } from './edition'
import { EncounterTracker } from './components/EncounterTracker'
import { Sheet } from './components/Sheet'
import { ConfirmButton } from './components/fields'
import { derived } from './model/combat'
import { currentEntry, newEncounter, sampleEncounter, writeBack, type Encounter } from './model/encounter'
import { newCharacter, sampleCharacters, uid } from './model/factory'
import type { Character, CharacterKind } from './model/types'
import { rollCheck, rollFlat, type CheckRoll } from './rules/dice'
import { exportJson, LocalEncounterRepository, LocalStorageRepository, parseCharacters } from './storage/store'

const repo = new LocalStorageRepository()
const encounterRepo = new LocalEncounterRepository()
type Filter = 'all' | CharacterKind
type Mode = 'characters' | 'encounters'

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(
    () => repo.load() ?? sampleCharacters().filter((c) => IS_GM || c.kind === 'pc'),
  )
  const [selectedId, setSelectedId] = useState<string | null>(() => characters[0]?.id ?? null)
  const [filter, setFilter] = useState<Filter>('all')
  const [rolls, setRolls] = useState<CheckRoll[]>([])
  const [transfer, setTransfer] = useState<null | { mode: 'export'; ids: string[] } | { mode: 'import' }>(null)
  const [showRosterOnPhone, setShowRosterOnPhone] = useState(true)
  const [mode, setMode] = useState<Mode>('characters')
  const [encounters, setEncounters] = useState<Encounter[]>(() => encounterRepo.load() ?? (IS_GM ? [sampleEncounter(characters)] : []))
  const [encounterId, setEncounterId] = useState<string | null>(() => encounters[0]?.id ?? null)

  useEffect(() => repo.save(characters), [characters])
  useEffect(() => encounterRepo.save(encounters), [encounters])
  const encounter = encounters.find((e) => e.id === encounterId) ?? null
  const updateEncounter = (e: Encounter) =>
    setEncounters((list) => list.map((x) => (x.id === e.id ? { ...e, updatedAt: Date.now() } : x)))

  const selected = characters.find((c) => c.id === selectedId) ?? null
  const visible = useMemo(
    () => characters.filter((c) => !IS_GM || filter === 'all' || c.kind === filter).sort((a, b) => a.name.localeCompare(b.name)),
    [characters, filter],
  )

  const update = (c: Character) =>
    setCharacters((list) => list.map((x) => (x.id === c.id ? { ...c, updatedAt: Date.now() } : x)))
  const add = (c: Character) => {
    setCharacters((list) => [...list, c])
    setSelectedId(c.id)
    setShowRosterOnPhone(false)
  }
  const remove = (id: string) => {
    setCharacters((list) => list.filter((c) => c.id !== id))
    setSelectedId(null)
    setShowRosterOnPhone(true)
  }
  const roll = (label: string, base: number, flat = false) =>
    setRolls((r) => [flat ? rollFlat(label) : rollCheck(label, base), ...r].slice(0, 12))

  return (
    <div className={'app' + (showRosterOnPhone ? ' phone-roster' : ' phone-sheet')}>
      <aside className="roster" aria-label="Characters">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1 className="brand-name">Witcher Ledger</h1>
            <p className="brand-sub">{EDITION_LABEL}</p>
          </div>
        </div>
        {IS_GM && (
        <div className="mode-switch" role="tablist" aria-label="Section">
          <button type="button" role="tab" aria-selected={mode === 'characters'} onClick={() => setMode('characters')}>
            Characters
          </button>
          <button type="button" role="tab" aria-selected={mode === 'encounters'} onClick={() => setMode('encounters')}>
            Encounters
          </button>
        </div>
        )}
        {mode === 'encounters' ? (
          <EncounterRail
            encounters={encounters}
            selectedId={encounterId}
            onSelect={(id) => {
              setEncounterId(id)
              setShowRosterOnPhone(false)
            }}
            onNew={() => {
              const e = newEncounter()
              setEncounters((list) => [...list, e])
              setEncounterId(e.id)
              setShowRosterOnPhone(false)
            }}
          />
        ) : (
        <>
        {IS_GM && (
        <div className="seg" role="group" aria-label="Filter characters">
          {(
            [
              ['all', 'All'],
              ['pc', 'Players'],
              ['npc', 'NPCs'],
            ] as const
          ).map(([f, label]) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>
        )}
        <ul className="roster-list">
          {visible.map((c) => {
            const d = derived(c)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={'roster-item' + (c.id === selectedId ? ' roster-active' : '')}
                  onClick={() => {
                    setSelectedId(c.id)
                    setShowRosterOnPhone(false)
                  }}
                >
                  <span className="roster-name">{c.name || 'Unnamed'}</span>
                  <span className="roster-meta">
                    {IS_GM && <span className={'kind-pill kind-' + c.kind}>{c.kind === 'pc' ? 'Player' : 'NPC'}</span>}
                    {[IS_GM && c.kind === 'pc' ? c.player : '', c.race, c.profession].filter(Boolean).join(' · ')}
                  </span>
                  <span className={'roster-hp' + (c.hp.current <= d.maxHp / 4 ? ' roster-hp-low' : '')}>
                    HP {c.hp.current}/{d.maxHp}
                  </span>
                </button>
              </li>
            )
          })}
          {visible.length === 0 && <li className="hint">No characters here yet.</li>}
        </ul>
        <div className="roster-actions">
          <button type="button" className="btn btn-primary" onClick={() => add(newCharacter(IS_GM && filter !== 'pc' ? 'npc' : 'pc'))}>
            {IS_GM ? (filter === 'pc' ? 'New player character' : 'New NPC') : 'New character'}
          </button>
          <button type="button" className="btn" onClick={() => setTransfer({ mode: 'import' })}>
            {IS_GM ? 'Import players' : 'Import'}
          </button>
          <button type="button" className="btn" onClick={() => setTransfer({ mode: 'export', ids: characters.map((c) => c.id) })}>
            {IS_GM ? 'Export all' : 'Back up all'}
          </button>
        </div>
        </>
        )}
      </aside>

      <main className="main">
        {mode === 'encounters' ? (
          encounter ? (
            <>
              <div className="sheet-toolbar">
                <button type="button" className="btn btn-quiet phone-only" onClick={() => setShowRosterOnPhone(true)}>
                  ← Encounters
                </button>
                <span className="toolbar-spacer" />
                <ConfirmButton
                  key={encounter.id}
                  label="Delete"
                  confirmLabel={`Delete ${encounter.name || 'encounter'}`}
                  onConfirm={() => {
                    setEncounters((list) => list.filter((e) => e.id !== encounter.id))
                    setEncounterId(null)
                    setShowRosterOnPhone(true)
                  }}
                />
              </div>
              <EncounterTracker
                key={encounter.id}
                encounter={encounter}
                characters={characters}
                onChange={updateEncounter}
                onRoll={roll}
                onWriteBack={() => setCharacters((list) => writeBack(encounter, list))}
              />
            </>
          ) : (
            <div className="empty">
              <h2>No encounter open</h2>
              <p>Pick a fight from the list or start a new one.</p>
            </div>
          )
        ) : selected ? (
          <>
            <div className="sheet-toolbar">
              <button type="button" className="btn btn-quiet phone-only" onClick={() => setShowRosterOnPhone(true)}>
                ← Characters
              </button>
              <span className="toolbar-spacer" />
              <button type="button" className="btn btn-quiet" onClick={() => add({ ...structuredClone(selected), id: uid(), name: selected.name + ' (copy)' })}>
                Duplicate
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setTransfer({ mode: 'export', ids: [selected.id] })}>
                {IS_GM ? 'Export' : 'Send to GM'}
              </button>
              <ConfirmButton key={selected.id} label="Delete" confirmLabel={`Delete ${selected.name || 'character'}`} onConfirm={() => remove(selected.id)} />
            </div>
            <Sheet character={selected} onChange={update} onRoll={roll} />
          </>
        ) : (
          <div className="empty">
            <h2>No character open</h2>
            <p>Pick someone from the list or create a new sheet.</p>
          </div>
        )}
      </main>

      <RollLog rolls={rolls} onClear={() => setRolls([])} />

      {transfer && (
        <TransferDialog
          state={transfer}
          characters={characters}
          onClose={() => setTransfer(null)}
          onImport={(incoming) => {
            setCharacters((list) => {
              const byId = new Map(list.map((c) => [c.id, c]))
              for (const c of incoming) byId.set(c.id, c)
              return [...byId.values()]
            })
            setSelectedId(incoming[0].id)
            setShowRosterOnPhone(false)
            setTransfer(null)
          }}
        />
      )}
    </div>
  )
}

function RollLog({ rolls, onClear }: { rolls: CheckRoll[]; onClear: () => void }) {
  if (rolls.length === 0)
    return (
      <aside className="rolls rolls-empty" aria-live="polite">
        Tap any gold-ringed number to roll it with 1d10.
      </aside>
    )
  const [latest, ...older] = rolls
  return (
    <aside className="rolls" aria-live="polite" aria-label="Dice rolls">
      <div className={'roll-latest roll-' + latest.outcome}>
        <span className="roll-total">{latest.total}</span>
        <span className="roll-detail">
          <strong>{latest.label}</strong>
          <span>
            {latest.base ? `${latest.base} + ` : ''}
            {describeDice(latest)}
            {latest.outcome === 'critical' && ' · 10 exploded'}
            {latest.outcome === 'fumble' && ' · fumble'}
          </span>
        </span>
        <button type="button" className="btn-chip" onClick={onClear}>
          Clear
        </button>
      </div>
      {older.length > 0 && (
        <ol className="roll-history">
          {older.map((r) => (
            <li key={r.at + r.label} className={'roll-' + r.outcome}>
              <span>{r.label}</span>
              <span className="roll-small">{r.total}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

// Embedded viewers (like a shared preview frame) block downloads, so only offer Copy there.
const isFramed = (() => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
})()

function EncounterRail(props: {
  encounters: Encounter[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}) {
  const list = [...props.encounters].sort((a, b) => b.updatedAt - a.updatedAt)
  return (
    <>
      <ul className="roster-list">
        {list.map((e) => {
          const cur = currentEntry(e)
          return (
            <li key={e.id}>
              <button
                type="button"
                className={'roster-item' + (e.id === props.selectedId ? ' roster-active' : '')}
                onClick={() => props.onSelect(e.id)}
              >
                <span className="roster-name">{e.name || 'Unnamed fight'}</span>
                <span className="roster-meta">
                  {e.entries.length} combatant{e.entries.length === 1 ? '' : 's'}
                  {cur ? ` · ${cur.name}'s turn` : ''}
                </span>
                <span className="roster-hp">R{e.round}</span>
              </button>
            </li>
          )
        })}
        {list.length === 0 && <li className="hint">No encounters yet.</li>}
      </ul>
      <div className="roster-actions">
        <button type="button" className="btn btn-primary" onClick={props.onNew}>
          New encounter
        </button>
      </div>
    </>
  )
}

function describeDice(r: CheckRoll): string {
  if (r.dice.length === 1) return `d10 (${r.dice[0]})`
  const sign = r.outcome === 'fumble' ? ' − ' : ' + '
  return `d10 (${r.dice[0]}${sign}${r.dice.slice(1).join(sign)})`
}

function TransferDialog(props: {
  state: { mode: 'export'; ids: string[] } | { mode: 'import' }
  characters: Character[]
  onClose: () => void
  onImport: (c: Character[]) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal()
  }, [])
  const json = props.state.mode === 'export' ? exportJson(props.characters.filter((c) => (props.state as { ids: string[] }).ids.includes(c.id))) : ''

  const tryImport = (raw: string) => {
    try {
      const list = parseCharacters(JSON.parse(raw))
      props.onImport(list)
    } catch (e) {
      setMessage(e instanceof SyntaxError ? 'That text is not valid JSON. Paste the whole export, including the first { and last }.' : (e as Error).message)
    }
  }

  return (
    <dialog ref={ref} className="dialog" onClose={props.onClose}>
      {props.state.mode === 'export' ? (
        <>
          <h2>Export {props.state.ids.length === 1 ? 'character' : `${props.state.ids.length} characters`}</h2>
          <p className="hint">
            {IS_GM
              ? 'Keep this as a backup, or send a sheet back to its player. They paste it into Import.'
              : 'Send this to your GM (message, email or file). They paste it into Import players in the GM version. Send it again after changes and it replaces the old copy.'}
          </p>
          <textarea id="export-json" readOnly rows={12} value={json} onFocus={(e) => e.target.select()} />
          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigator.clipboard
                  .writeText(json)
                  .then(() => setMessage('Copied to clipboard.'))
                  .catch(() => setMessage('Copy was blocked. Select the text above and copy it.'))
              }}
            >
              Copy
            </button>
            {!isFramed && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
                a.download = 'witcher-characters.json'
                a.click()
                setMessage('If no file appeared, use Copy instead.')
              }}
            >
              Download file
            </button>
            )}
            <button type="button" className="btn btn-quiet" onClick={() => ref.current?.close()}>
              Close
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>{IS_GM ? 'Import player characters' : 'Import characters'}</h2>
          <p className="hint">Paste an export, or load a .json file. A character with the same ID replaces the existing sheet.</p>
          <textarea id="import-json" rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder='{"app":"witcher-ttrpg", …}' />
          <label className="field">
            <span className="field-label">Or load a file</span>
            <input
              id="import-file"
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) tryImport(await f.text())
              }}
            />
          </label>
          <div className="dialog-actions">
            <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={() => tryImport(text)}>
              Import
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => ref.current?.close()}>
              Cancel
            </button>
          </div>
        </>
      )}
      {message && <p className="dialog-message">{message}</p>}
    </dialog>
  )
}
