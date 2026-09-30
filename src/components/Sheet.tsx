import { useState } from 'react'
import { checkBase, derived, carriedWeight } from '../model/combat'
import { applyProfession, uid } from '../model/factory'
import type { Character, Item, Spell, SpellKind, Weapon } from '../model/types'
import {
  HIT_LOCATIONS,
  HIT_LOCATION_NAMES,
  PROFESSIONS,
  RACES,
  SKILLS,
  SKILL_BY_ID,
  SKILL_CAP,
  STAT_KEYS,
  STAT_NAMES,
  slug,
  type StatKey,
} from '../rules/rules'
import { activeInjuries, cap } from '../model/injuries'
import { addToCharacter, ARMOR, COVER_NAMES, type ArmorCover, type CatalogEntry } from '../model/catalog'
import { CatalogSearch } from './CatalogSearch'
import { Injuries, LifeEvents } from './LifeAndInjuries'
import { ConfirmButton, NumberField, NumberInput, Pool, TextArea, TextField } from './fields'

type Tab = 'overview' | 'skills' | 'combat' | 'injuries' | 'life' | 'gear' | 'magic' | 'notes'
const TABS: Array<[Tab, string]> = [
  ['overview', 'Overview'],
  ['skills', 'Skills'],
  ['combat', 'Combat'],
  ['injuries', 'Injuries'],
  ['life', 'Life events'],
  ['gear', 'Gear'],
  ['magic', 'Magic'],
  ['notes', 'Notes'],
]

export interface SheetProps {
  character: Character
  onChange: (c: Character) => void
  onRoll: (label: string, base: number) => void
}

export function Sheet({ character: c, onChange, onRoll }: SheetProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const set = (patch: Partial<Character>) => onChange({ ...c, ...patch })
  return (
    <div className="sheet">
      <SheetHeader c={c} set={set} onChange={onChange} />
      <nav className="tabs" role="tablist" aria-label="Sheet sections">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={'tab' + (tab === id ? ' tab-active' : '')}
            onClick={() => setTab(id)}
          >
            {label}
            {id === 'injuries' && activeInjuries(c).length > 0 && <span className="tab-badge">{activeInjuries(c).length}</span>}
          </button>
        ))}
      </nav>
      <div className="tab-panel" role="tabpanel">
        {tab === 'overview' && <Overview c={c} set={set} onRoll={onRoll} />}
        {tab === 'skills' && <Skills c={c} set={set} onRoll={onRoll} />}
        {tab === 'combat' && <Combat c={c} set={set} onRoll={onRoll} onOpenInjuries={() => setTab('injuries')} />}
        {tab === 'injuries' && <Injuries c={c} set={set} />}
        {tab === 'life' && <LifeEvents c={c} set={set} />}
        {tab === 'gear' && <Gear c={c} set={set} />}
        {tab === 'magic' && <Magic c={c} set={set} onRoll={onRoll} />}
        {tab === 'notes' && <Notes c={c} set={set} />}
      </div>
    </div>
  )
}

type Setter = (patch: Partial<Character>) => void

function SheetHeader({ c, set, onChange }: { c: Character; set: Setter; onChange: (c: Character) => void }) {
  return (
    <header className="sheet-header">
      <div className="sheet-title-row">
        <input
          className="sheet-name"
          aria-label="Character name"
          value={c.name}
          onChange={(e) => set({ name: e.target.value })}
        />
      </div>
      <div className="grid-identity">
        {c.kind === 'pc' && <TextField label="Player" value={c.player} onChange={(v) => set({ player: v })} />}
        <label className="field">
          <span className="field-label">Race</span>
          <select value={c.race} onChange={(e) => set({ race: e.target.value })}>
            {RACES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Profession</span>
          <select value={c.profession} onChange={(e) => onChange(applyProfession(c, e.target.value))}>
            <option value="">None</option>
            {PROFESSIONS.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
        {(c.race === 'Witcher' || c.profession === 'Witcher') && (
          <TextField label="School" value={c.school} onChange={(v) => set({ school: v })} placeholder="Wolf, Cat…" />
        )}
        <TextField label="Homeland" value={c.homeland} onChange={(v) => set({ homeland: v })} />
        <TextField label="Age" value={c.age} onChange={(v) => set({ age: v })} />
        <TextField label="Gender" value={c.gender} onChange={(v) => set({ gender: v })} />
        <NumberField label="Improvement points" value={c.ip} min={0} onChange={(v) => set({ ip: v })} />
      </div>
    </header>
  )
}

function Overview({ c, set, onRoll }: { c: Character; set: Setter; onRoll: SheetProps['onRoll'] }) {
  const d = derived(c)
  const setStat = (k: StatKey, v: number) => set({ stats: { ...c.stats, [k]: v } })
  return (
    <div className="stack">
      <section className="pools" aria-label="Health and resources">
        <Pool
          label="Health"
          tone="hp"
          current={c.hp.current}
          max={d.maxHp}
          onChange={(v) => set({ hp: { ...c.hp, current: v } })}
          footer={
            c.hp.current < 0 ? (
              <p className="pool-note">Death state: stats at 1/3, Death save vs Stun {d.stun}</p>
            ) : c.hp.current < d.woundThreshold ? (
              <p className="pool-note">Below wound threshold ({d.woundThreshold})</p>
            ) : null
          }
        />
        <Pool
          label="Stamina"
          tone="sta"
          current={c.sta.current}
          max={d.maxSta}
          onChange={(v) => set({ sta: { ...c.sta, current: v } })}
          footer={c.sta.current <= 0 ? <p className="pool-note">Out of Stamina: stunned, can only recover</p> : null}
        />
        <Pool label="Luck" tone="luck" current={c.luckCurrent} max={c.stats.LUCK} onChange={(v) => set({ luckCurrent: v })} />
      </section>

      <section className="panel">
        <h2 className="panel-title">Statistics</h2>
        <div className="stat-grid">
          {STAT_KEYS.map((k) => (
            <div className="stat" key={k}>
              <button
                type="button"
                className="stat-key"
                title={`Roll ${STAT_NAMES[k]} (stat ×1 + 1d10)`}
                onClick={() => onRoll(STAT_NAMES[k], c.stats[k])}
              >
                {k}
              </button>
              <NumberInput ariaLabel={STAT_NAMES[k]} value={c.stats[k]} min={0} max={20} onChange={(v) => setStat(k, v)} />
              <span className="stat-name">{STAT_NAMES[k]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Derived</h2>
        <dl className="derived">
          <Derived label="Stun" value={d.stun} />
          <Derived label="Recovery" value={d.rec} />
          <Derived label="Run" value={`${d.run} m`} />
          <Derived label="Leap" value={`${d.leap} m`} />
          <Derived label="Encumbrance" value={d.enc} />
          <Derived label="Resolve" value={d.resolve} />
          <Derived label="Punch" value={d.punch} />
          <Derived label="Kick" value={d.kick} />
          <Derived label="Vigor" value={c.vigor} />
        </dl>
        <div className="overrides">
          <OverrideField label="Max HP override" value={c.hp.maxOverride} onChange={(v) => set({ hp: { ...c.hp, maxOverride: v } })} />
          <OverrideField label="Max STA override" value={c.sta.maxOverride} onChange={(v) => set({ sta: { ...c.sta, maxOverride: v } })} />
          <NumberField label="Vigor threshold" value={c.vigor} min={0} onChange={(v) => set({ vigor: v })} />
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Defining skill</h2>
        <div className="row-fields">
          <TextField label="Name" value={c.definingSkill} onChange={(v) => set({ definingSkill: v })} />
          <NumberField label="Value" value={c.definingSkillValue} min={0} max={SKILL_CAP} onChange={(v) => set({ definingSkillValue: v })} />
        </div>
      </section>
    </div>
  )
}

function OverrideField(props: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <label className="field">
      <span className="field-label">{props.label}</span>
      <input
        type="number"
        className="num"
        placeholder="auto"
        value={props.value ?? ''}
        onChange={(e) => props.onChange(e.target.value === '' ? null : Number(e.target.value))}
      />
    </label>
  )
}

function Derived({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="derived-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function Skills({ c, set, onRoll }: { c: Character; set: Setter; onRoll: SheetProps['onRoll'] }) {
  const [trainedOnly, setTrainedOnly] = useState(false)
  const [newName, setNewName] = useState('')
  const [newStat, setNewStat] = useState<StatKey>('INT')
  const setSkill = (id: string, v: number) => set({ skills: { ...c.skills, [id]: Math.max(0, v) } })
  return (
    <div className="stack">
      <label className="check">
        <input type="checkbox" checked={trainedOnly} onChange={(e) => setTrainedOnly(e.target.checked)} />
        Show trained skills only
      </label>
      <div className="skill-columns">
        {STAT_KEYS.filter((k) => k !== 'SPD' && k !== 'LUCK').map((stat) => {
          const skills = SKILLS.filter((s) => s.stat === stat && (!trainedOnly || (c.skills[s.id] ?? 0) > 0))
          const custom = c.customSkills.filter((s) => s.stat === stat && (!trainedOnly || s.value > 0))
          if (skills.length + custom.length === 0) return null
          return (
            <section className="panel skill-group" key={stat}>
              <h2 className="panel-title">
                {STAT_NAMES[stat]} <span className="panel-sub">{stat} {c.stats[stat]}</span>
              </h2>
              <ul className="skill-list">
                {skills.map((s) => (
                  <SkillRow
                    key={s.id}
                    name={s.name}
                    value={c.skills[s.id] ?? 0}
                    base={checkBase(c, s.id)}
                    onChange={(v) => setSkill(s.id, v)}
                    onRoll={() => onRoll(s.name, checkBase(c, s.id))}
                  />
                ))}
                {custom.map((s) => (
                  <SkillRow
                    key={s.id}
                    name={s.name}
                    custom
                    value={s.value}
                    base={c.stats[s.stat] + s.value}
                    onChange={(v) =>
                      set({ customSkills: c.customSkills.map((k) => (k.id === s.id ? { ...k, value: Math.max(0, v) } : k)) })
                    }
                    onRemove={() => set({ customSkills: c.customSkills.filter((k) => k.id !== s.id) })}
                    onRoll={() => onRoll(s.name, c.stats[s.stat] + s.value)}
                  />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
      <form
        className="panel add-row"
        onSubmit={(e) => {
          e.preventDefault()
          const name = newName.trim()
          if (!name) return
          set({ customSkills: [...c.customSkills, { id: 'custom-' + slug(name) + '-' + uid().slice(0, 4), name, stat: newStat, value: 1 }] })
          setNewName('')
        }}
      >
        <h2 className="panel-title">Add a skill</h2>
        <p className="hint">For profession skill-tree abilities, extra languages, or anything the list lacks.</p>
        <div className="row-fields">
          <TextField label="Skill name" value={newName} onChange={setNewName} placeholder="e.g. Heliotrope" />
          <label className="field">
            <span className="field-label">Stat</span>
            <select value={newStat} onChange={(e) => setNewStat(e.target.value as StatKey)}>
              {STAT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn">
            Add skill
          </button>
        </div>
      </form>
    </div>
  )
}

function SkillRow(props: {
  name: string
  value: number
  base: number
  custom?: boolean
  onChange: (v: number) => void
  onRoll: () => void
  onRemove?: () => void
}) {
  return (
    <li className={'skill' + (props.value > 0 ? ' skill-trained' : '')}>
      <span className="skill-name">
        {props.name}
        {props.custom && <span className="tag">custom</span>}
      </span>
      <NumberInput ariaLabel={`${props.name} points`} value={props.value} min={0} max={20} onChange={props.onChange} className="skill-input" />
      <button type="button" className="roll-btn" onClick={props.onRoll} title={`Roll ${props.name}: ${props.base} + 1d10`}>
        {props.base}
      </button>
      {props.onRemove && (
        <button type="button" className="icon-btn" aria-label={`Remove ${props.name}`} onClick={props.onRemove}>
          ×
        </button>
      )}
    </li>
  )
}

function Combat({ c, set, onRoll, onOpenInjuries }: { c: Character; set: Setter; onRoll: SheetProps['onRoll']; onOpenInjuries: () => void }) {
  const updWeapon = (id: string, patch: Partial<Weapon>) =>
    set({ weapons: c.weapons.map((w) => (w.id === id ? { ...w, ...patch } : w)) })
  const weaponSkills = SKILLS.filter((s) =>
    ['brawling', 'melee', 'small-blades', 'staff-spear', 'swordsmanship', 'archery', 'crossbow', 'athletics'].includes(s.id),
  )
  return (
    <div className="stack">
      <section className="panel">
        <h2 className="panel-title">Defense</h2>
        <div className="defense-row">
          <button type="button" className="btn" onClick={() => onRoll('Dodge', checkBase(c, 'dodge-escape'))}>
            Dodge {checkBase(c, 'dodge-escape')}
          </button>
          <button type="button" className="btn" onClick={() => onRoll('Reposition', checkBase(c, 'athletics'))}>
            Reposition {checkBase(c, 'athletics')}
          </button>
          <button type="button" className="btn" onClick={() => onRoll('Initiative', c.stats.REF)}>
            Initiative {c.stats.REF}
          </button>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Armor</h2>
        <div className="armor-pickers">
          {(['head', 'torso', 'legs'] as ArmorCover[]).map((cover) => (
            <label className="field" key={cover}>
              <span className="field-label">{COVER_NAMES[cover]}</span>
              <select
                value={ARMOR.find((e) => e.covers === cover && c.armor[cover === 'head' ? 'head' : cover === 'torso' ? 'torso' : 'rLeg'].piece === e.name)?.name ?? ''}
                onChange={(e) => {
                  const entry = ARMOR.find((x) => x.name === e.target.value)
                  if (entry) set(addToCharacter(c, entry))
                }}
              >
                <option value="">Choose armor…</option>
                {ARMOR.filter((e) => e.covers === cover).map((e) => (
                  <option key={e.name} value={e.name}>
                    {e.name} (SP {e.sp}{e.ev ? `, EV ${e.ev}` : ''})
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Piece</th>
                <th>SP</th>
                <th>Max</th>
                <th aria-label="Repair" />
              </tr>
            </thead>
            <tbody>
              {HIT_LOCATIONS.map((loc) => {
                const a = c.armor[loc]
                const upd = (patch: Partial<typeof a>) => set({ armor: { ...c.armor, [loc]: { ...a, ...patch } } })
                return (
                  <tr key={loc} className={a.sp < a.maxSp ? 'row-damaged' : ''}>
                    <th scope="row">{HIT_LOCATION_NAMES[loc]}</th>
                    <td>
                      <input aria-label={`${HIT_LOCATION_NAMES[loc]} armor piece`} value={a.piece} onChange={(e) => upd({ piece: e.target.value })} />
                    </td>
                    <td>
                      <span className="sp-cell">
                        <button type="button" className="icon-btn" aria-label="Ablate 1 SP" onClick={() => upd({ sp: Math.max(0, a.sp - 1) })}>
                          −
                        </button>
                        <NumberInput ariaLabel={`${HIT_LOCATION_NAMES[loc]} SP`} value={a.sp} min={0} onChange={(v) => upd({ sp: v })} />
                      </span>
                    </td>
                    <td>
                      <NumberInput ariaLabel={`${HIT_LOCATION_NAMES[loc]} max SP`} value={a.maxSp} min={0} onChange={(v) => upd({ maxSp: v, sp: a.sp === a.maxSp ? v : Math.min(a.sp, v) })} />
                    </td>
                    <td>
                      {a.sp < a.maxSp && (
                        <button type="button" className="btn-chip" onClick={() => upd({ sp: a.maxSp })}>
                          Repair
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Weapons</h2>
        {c.weapons.length === 0 && <p className="hint">No weapons yet.</p>}
        <div className="cards">
          {c.weapons.map((w) => {
            const base = checkBase(c, w.skillId) + w.accuracy
            return (
              <div className="card" key={w.id}>
                <div className="card-head">
                  <input className="card-name" aria-label="Weapon name" value={w.name} onChange={(e) => updWeapon(w.id, { name: e.target.value })} />
                  <button type="button" className="roll-btn" onClick={() => onRoll(`${w.name} attack`, base)} title="Roll attack">
                    {base}
                  </button>
                </div>
                <div className="card-fields">
                  <label className="field">
                    <span className="field-label">Skill</span>
                    <select value={w.skillId} onChange={(e) => updWeapon(w.id, { skillId: e.target.value })}>
                      {weaponSkills.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({SKILL_BY_ID[s.id].stat})
                        </option>
                      ))}
                    </select>
                  </label>
                  <TextField label="Damage" value={w.damage} onChange={(v) => updWeapon(w.id, { damage: v })} />
                  <NumberField label="Accuracy" value={w.accuracy} onChange={(v) => updWeapon(w.id, { accuracy: v })} />
                  <NumberField label="Reliability" value={w.reliability} min={0} onChange={(v) => updWeapon(w.id, { reliability: v })} />
                  <NumberField label="Hands" value={w.hands} min={1} max={2} onChange={(v) => updWeapon(w.id, { hands: v })} />
                  <TextField label="Range" value={w.range} onChange={(v) => updWeapon(w.id, { range: v })} />
                  <TextField label="Effect" value={w.effect} onChange={(v) => updWeapon(w.id, { effect: v })} />
                </div>
                <ConfirmButton label="Remove" confirmLabel="Remove weapon" onConfirm={() => set({ weapons: c.weapons.filter((x) => x.id !== w.id) })} />
              </div>
            )
          })}
        </div>
        <CatalogSearch
          label="Add a weapon from the book"
          kinds={['weapon']}
          placeholder="e.g. Arming sword, Crossbow, Halberd"
          onPick={(e: CatalogEntry) => set(addToCharacter(c, e))}
          onCustom={(name) =>
            set({
              weapons: [...c.weapons, { id: uid(), name, skillId: 'swordsmanship', accuracy: 0, damage: '1d6', reliability: 10, hands: 1, range: '', effect: '', notes: '' }],
            })
          }
        />
      </section>

      <section className="panel">
        <h2 className="panel-title">Injuries</h2>
        {activeInjuries(c).length === 0 ? (
          <p className="hint">No active injuries.</p>
        ) : (
          <ul className="history-list">
            {activeInjuries(c).map((w) => (
              <li key={w.id}>
                <span className={'sev-pill sev-' + w.severity}>{cap(w.severity)}</span>
                <span className="history-text">
                  {w.description || 'Unnamed injury'} <span className="hint">· {HIT_LOCATION_NAMES[w.location]}{w.treated ? ' · stabilized' : ''}</span>
                  {w.effect && <span className="injury-effect">{w.effect}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div>
          <button type="button" className="btn" onClick={onOpenInjuries}>
            Manage injuries
          </button>
        </div>
      </section>

      <section className="panel">
        <TextArea label="Conditions and status effects" rows={3} value={c.conditions} onChange={(v) => set({ conditions: v })} />
      </section>
    </div>
  )
}

function Gear({ c, set }: { c: Character; set: Setter }) {
  const d = derived(c)
  const weight = carriedWeight(c)
  const upd = (id: string, patch: Partial<Item>) => set({ items: c.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })
  return (
    <div className="stack">
      <section className="panel gear-summary">
        <NumberField label="Crowns" value={c.crowns} min={0} onChange={(v) => set({ crowns: v })} />
        <div className={'weight' + (weight > d.enc ? ' weight-over' : '')}>
          <span className="field-label">Carried weight</span>
          <span className="weight-value">
            {weight} / {d.enc} kg
          </span>
          {weight > d.enc && <span className="hint">Over encumbrance</span>}
        </div>
      </section>
      <section className="panel">
        <h2 className="panel-title">Inventory</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Weight (kg)</th>
                <th>Notes</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {c.items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <input aria-label="Item name" value={i.name} onChange={(e) => upd(i.id, { name: e.target.value })} />
                  </td>
                  <td>
                    <NumberInput ariaLabel="Quantity" value={i.qty} min={0} onChange={(v) => upd(i.id, { qty: v })} />
                  </td>
                  <td>
                    <NumberInput ariaLabel="Weight" value={i.weight} min={0} step={0.1} onChange={(v) => upd(i.id, { weight: v })} />
                  </td>
                  <td>
                    <input aria-label="Notes" value={i.notes} onChange={(e) => upd(i.id, { notes: e.target.value })} />
                  </td>
                  <td>
                    <button type="button" className="icon-btn" aria-label={`Remove ${i.name}`} onClick={() => set({ items: c.items.filter((x) => x.id !== i.id) })}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CatalogSearch
          label="Add an item from the book"
          kinds={['gear', 'shield', 'weapon', 'armor']}
          placeholder="e.g. Rope, Lantern, Trail rations"
          onPick={(e: CatalogEntry) => set(addToCharacter(c, e))}
          onCustom={(name) => set({ items: [...c.items, { id: uid(), name, qty: 1, weight: 0, notes: '' }] })}
        />
      </section>
    </div>
  )
}

const SPELL_KINDS: SpellKind[] = ['Spell', 'Sign', 'Invocation', 'Ritual', 'Hex']

function Magic({ c, set, onRoll }: { c: Character; set: Setter; onRoll: SheetProps['onRoll'] }) {
  const upd = (id: string, patch: Partial<Spell>) => set({ spells: c.spells.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  const castBase = checkBase(c, 'spell-casting')
  return (
    <div className="stack">
      <section className="panel defense-row">
        <span>
          Vigor threshold <strong>{c.vigor}</strong>
        </span>
        <button type="button" className="btn" onClick={() => onRoll('Spell Casting', castBase)}>
          Cast {castBase}
        </button>
        <button type="button" className="btn" onClick={() => onRoll('Resist Magic', checkBase(c, 'resist-magic'))}>
          Resist Magic {checkBase(c, 'resist-magic')}
        </button>
      </section>
      {c.spells.length === 0 && <p className="hint">No spells, signs or invocations yet.</p>}
      <div className="cards">
        {c.spells.map((s) => (
          <div className="card" key={s.id}>
            <div className="card-head">
              <input className="card-name" aria-label="Spell name" value={s.name} onChange={(e) => upd(s.id, { name: e.target.value })} />
              <select aria-label="Type" value={s.kind} onChange={(e) => upd(s.id, { kind: e.target.value as SpellKind })}>
                {SPELL_KINDS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="card-fields">
              <TextField label="STA cost" value={s.staCost} onChange={(v) => upd(s.id, { staCost: v })} />
              <TextField label="Range" value={s.range} onChange={(v) => upd(s.id, { range: v })} />
              <TextField label="Duration" value={s.duration} onChange={(v) => upd(s.id, { duration: v })} />
              <TextField label="Defense" value={s.defense} onChange={(v) => upd(s.id, { defense: v })} />
            </div>
            <TextArea label="Effect" rows={2} value={s.effect} onChange={(v) => upd(s.id, { effect: v })} />
            <ConfirmButton label="Remove" confirmLabel="Remove spell" onConfirm={() => set({ spells: c.spells.filter((x) => x.id !== s.id) })} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn"
        onClick={() =>
          set({ spells: [...c.spells, { id: uid(), name: 'New spell', kind: 'Spell', staCost: '', range: '', duration: '', defense: '', effect: '' }] })
        }
      >
        Add spell
      </button>
    </div>
  )
}

function Notes({ c, set }: { c: Character; set: Setter }) {
  return (
    <div className="stack">
      <section className="panel">
        <TextArea label="Racial perks and profession abilities" rows={4} value={c.perks} onChange={(v) => set({ perks: v })} />
      </section>
      <section className="panel">
        <TextArea label="Lifepath and background" rows={8} value={c.background} onChange={(v) => set({ background: v })} />
      </section>
      <section className="panel">
        <TextArea label="Notes" rows={8} value={c.notes} onChange={(v) => set({ notes: v })} />
      </section>
    </div>
  )
}
