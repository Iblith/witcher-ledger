import { useEffect, useMemo, useRef, useState } from 'react'
import { EDITION_LABEL, IS_GM, STORAGE_PREFIX } from './edition'
import { CharacterCreator } from './components/CharacterCreator'
import { EncounterTracker } from './components/EncounterTracker'
import { Sheet } from './components/Sheet'
import { ConfirmButton } from './components/fields'
import { missingBestiary } from './model/bestiary'
import { derived } from './model/combat'
import { currentEntry, newEncounter, sampleEncounter, writeBack, type Encounter } from './model/encounter'
import { newCharacter, sampleCharacters, uid } from './model/factory'
import type { Character } from './model/types'
import { rollCheck, rollFlat, type CheckRoll } from './rules/dice'
import { exportJson, LocalEncounterRepository, LocalStorageRepository, parseCharacters } from './storage/store'

const repo = new LocalStorageRepository()
const encounterRepo = new LocalEncounterRepository()
// GM sections: imported player sheets, the GM's own NPCs plus the bestiary, and fights.
// The Player version only ever shows 'players' (its own characters).
type Mode = 'players' | 'npcs' | 'encounters'
type NpcFilter = 'all' | 'mine' | 'bestiary'
const SEEDED_KEY = `${STORAGE_PREFIX}:bestiary-seeded`

function storageFlag(key: string, value?: string): string | null {
  try {
    if (value !== undefined) localStorage.setItem(key, value)
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function initialCharacters(): Character[] {
  const list = repo.load() ?? sampleCharacters().filter((c) => c.kind === 'pc')
  // The GM's NPC list starts with the core bestiary, once; deleted entries stay deleted
  // until the GM restores them.
  return IS_GM && !storageFlag(SEEDED_KEY) ? [...list, ...missingBestiary(list)] : list
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [selectedId, setSelectedId] = useState<string | null>(() => characters.find((c) => c.kind === 'pc')?.id ?? null)
  const [npcFilter, setNpcFilter] = useState<NpcFilter>('all')
  const [query, setQuery] = useState('')
  const [rolls, setRolls] = useState<CheckRoll[]>([])
  const [transfer, setTransfer] = useState<null | { mode: 'export'; ids: string[] } | { mode: 'import' }>(null)
  const [showRosterOnPhone, setShowRosterOnPhone] = useState(true)
  const [mode, setMode] = useState<Mode>('players')
  const [creating, setCreating] = useState(false)
  const [encounters, setEncounters] = useState<Encounter[]>(() => encounterRepo.load() ?? (IS_GM ? [sampleEncounter(characters)] : []))
  const [encounterId, setEncounterId] = useState<string | null>(() => encounters[0]?.id ?? null)

  useEffect(() => repo.save(characters), [characters])
  useEffect(() => {
    if (IS_GM) storageFlag(SEEDED_KEY, '1')
  }, [])
  useEffect(() => encounterRepo.save(encounters), [encounters])
  const encounter = encounters.find((e) => e.id === encounterId) ?? null
  const updateEncounter = (e: Encounter) =>
    setEncounters((list) => list.map((x) => (x.id === e.id ? { ...e, updatedAt: Date.now() } : x)))

  const inSection = (c: Character) => !IS_GM || (mode === 'players' ? c.kind === 'pc' : c.kind === 'npc')
  const selected = characters.find((c) => c.id === selectedId && inSection(c)) ?? null
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return characters
      .filter((c) => {
        if (!IS_GM) return true
        if (mode === 'players') return c.kind === 'pc'
        if (c.kind !== 'npc') return false
        if (npcFilter === 'mine' && c.bestiary) return false
        if (npcFilter === 'bestiary' && !c.bestiary) return false
        return !q || c.name.toLowerCase().includes(q) || (c.bestiary?.category.toLowerCase().includes(q) ?? false)
      })
      .sort((a, b) => Number(!!a.bestiary) - Number(!!b.bestiary) || a.name.localeCompare(b.name))
  }, [characters, mode, npcFilter, query])
  const missing = IS_GM && mode === 'npcs' ? missingBestiary(characters) : []

  const update = (c: Character) =>
    setCharacters((list) => list.map((x) => (x.id === c.id ? { ...c, updatedAt: Date.now() } : x)))
  const add = (c: Character) => {
    setCreating(false)
    setCharacters((list) => [...list, c])
    setSelectedId(c.id)
    setShowRosterOnPhone(false)
  }
  const startCreator = () => {
    setMode('players')
    setCreating(true)
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
          <button type="button" role="tab" aria-selected={mode === 'players'} onClick={() => setMode('players')}>
            Players
          </button>
          <button type="button" role="tab" aria-selected={mode === 'npcs'} onClick={() => setMode('npcs')}>
            NPCs
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
        {IS_GM && mode === 'npcs' && (
        <>
        <div className="seg" role="group" aria-label="Filter NPCs">
          {(
            [
              ['all', 'All'],
              ['mine', 'My NPCs'],
              ['bestiary', 'Bestiary'],
            ] as const
          ).map(([f, label]) => (
            <button key={f} type="button" aria-pressed={npcFilter === f} onClick={() => setNpcFilter(f)}>
              {label}
            </button>
          ))}
        </div>
        <input className="roster-search" type="search" aria-label="Search NPCs" placeholder="Search name or type" value={query} onChange={(e) => setQuery(e.target.value)} />
        </>
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
                    setCreating(false)
                    setShowRosterOnPhone(false)
                  }}
                >
                  <span className="roster-name">{c.name || 'Unnamed'}</span>
                  <span className="roster-meta">
                    {c.bestiary && <span className="kind-pill kind-beast">{c.bestiary.category}</span>}
                    {(c.bestiary ? [c.bestiary.threat] : [IS_GM ? c.player : '', c.race, c.profession]).filter(Boolean).join(' · ')}
                  </span>
                  <span className={'roster-hp' + (c.hp.current <= d.maxHp / 4 ? ' roster-hp-low' : '')}>
                    HP {c.hp.current}/{d.maxHp}
                  </span>
                </button>
              </li>
            )
          })}
          {visible.length === 0 && (
            <li className="hint">
              {IS_GM && mode === 'players' ? 'No players yet. Ask them to tap Send to GM in the Player version, then use Import players.' : 'No characters here yet.'}
            </li>
          )}
        </ul>
        <div className="roster-actions">
          {IS_GM ? (
            mode === 'npcs' ? (
              <>
                <button type="button" className="btn btn-primary" onClick={() => add(newCharacter('npc'))}>
                  New NPC
                </button>
                {missing.length > 0 && (
                  <button type="button" className="btn" onClick={() => setCharacters((list) => [...list, ...missingBestiary(list)])}>
                    Restore bestiary ({missing.length})
                  </button>
                )}
              </>
            ) : null
          ) : (
            <>
              <button type="button" className="btn btn-primary" onClick={startCreator}>
                Create a character
              </button>
              <button type="button" className="btn" onClick={() => add(newCharacter('pc'))}>
                Blank sheet
              </button>
            </>
          )}
          <button type="button" className={'btn' + (IS_GM && mode === 'players' ? ' btn-primary' : '')} onClick={() => setTransfer({ mode: 'import' })}>
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
        ) : creating ? (
          <>
            <div className="sheet-toolbar phone-only-bar">
              <button type="button" className="btn btn-quiet phone-only" onClick={() => setShowRosterOnPhone(true)}>
                ← Characters
              </button>
            </div>
            <CharacterCreator onCreate={add} onCancel={() => setCreating(false)} />
          </>
        ) : selected ? (
          <>
            <div className="sheet-toolbar">
              <button type="button" className="btn btn-quiet phone-only" onClick={() => setShowRosterOnPhone(true)}>
                ← {IS_GM ? (mode === 'players' ? 'Players' : 'NPCs') : 'Characters'}
              </button>
              <span className="toolbar-spacer" />
              {(!IS_GM || selected.kind === 'npc') && (
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => add({ ...structuredClone(selected), id: uid(), name: selected.name + (selected.bestiary ? '' : ' (copy)'), bestiary: undefined })}
              >
                {selected.bestiary ? 'Copy to my NPCs' : 'Duplicate'}
              </button>
              )}
              <button type="button" className="btn btn-quiet" onClick={() => setTransfer({ mode: 'export', ids: [selected.id] })}>
                {IS_GM ? 'Export' : 'Send to GM'}
              </button>
              <ConfirmButton key={selected.id} label="Delete" confirmLabel={`Delete ${selected.name || 'character'}`} onConfirm={() => remove(selected.id)} />
            </div>
            {selected.bestiary && <BestiaryNote c={selected} onChange={update} />}
            {IS_GM && selected.kind === 'pc' && (
              <p className="hint imported-note">Imported from {selected.player || 'the player'}. Importing their next export replaces this copy, including anything you changed here.</p>
            )}
            <Sheet character={selected} onChange={update} onRoll={roll} />
          </>
        ) : (
          <div className="empty">
            <h2>{IS_GM ? (mode === 'players' ? 'No player open' : 'No NPC open') : 'No character open'}</h2>
            <p>{IS_GM && mode === 'players' ? 'Pick a player from the list, or import one.' : 'Pick someone from the list or create a new sheet.'}</p>
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

function BestiaryNote({ c, onChange }: { c: Character; onChange: (c: Character) => void }) {
  const b = c.bestiary!
  return (
    <section className={'panel bestiary-note' + (b.checked ? ' bestiary-checked' : '')}>
      <div className="bestiary-head">
        <strong>
          {b.category} · {b.threat}
          {b.page ? ` · core rulebook p. ${b.page}` : ''}
        </strong>
        <span className={'sev-pill ' + (b.checked ? 'sev-simple' : 'sev-complex')}>{b.checked ? 'Checked' : 'Estimated stats'}</span>
      </div>
      <p className="hint">
        {b.checked
          ? 'You marked these stats as checked against your book.'
          : 'These numbers are estimates, not copied from the core rulebook. Compare them with your book and fix anything that differs.'}
      </p>
      {b.confirmed && <p className="hint">Confirmed by the errata: {b.confirmed}</p>}
      <label className="check">
        <input type="checkbox" checked={b.checked} onChange={(e) => onChange({ ...c, bestiary: { ...b, checked: e.target.checked } })} />
        I've checked these stats against my book
      </label>
    </section>
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
