import { useEffect, useState, type ReactNode } from 'react'
import { IS_GM, STORAGE_PREFIX } from '../edition'
import {
  creatorIssues,
  DECADE_KINDS,
  decadeRows,
  FAMILY_FIELDS,
  finishDraft,
  newDraft,
  PROFESSION_SKILL_POINTS,
  skillBudget,
  STARTING_CROWNS,
  STAT_MAX,
  STAT_MIN,
  STAT_POOLS,
  statPointsSpent,
  type CreatorDraft,
} from '../model/creator'
import { applyProfession, uid } from '../model/factory'
import type { Character, LifeEventKind } from '../model/types'
import { rollD10 } from '../rules/dice'
import { derive, PROFESSIONS, SKILLS, STAT_KEYS, STAT_NAMES, type StatKey } from '../rules/rules'
import { NumberInput, TextArea, TextField } from './fields'

const DRAFT_KEY = `${STORAGE_PREFIX}:creator-draft`

const STEPS = ['Basics', 'Race', 'Profession', 'Statistics', 'Skills', 'Lifepath', 'Gear', 'Review'] as const

const RACE_INFO: Record<string, string> = {
  Human: 'The most numerous people on the Continent, found in every kingdom and trade.',
  Elf: 'The Aen Seidhe, an elder race with long memories and little love for humans.',
  Dwarf: 'Stout folk from the mountains of Mahakam, known for craft, trade and grudges.',
  Witcher: 'A mutated monster hunter trained at a school. Witchers use their own lifepath.',
}

function loadDraft(): CreatorDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as CreatorDraft) : null
  } catch {
    return null
  }
}

function saveDraft(d: CreatorDraft | null) {
  try {
    if (d) localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    else localStorage.removeItem(DRAFT_KEY)
  } catch {
    // A draft is a convenience; the creator still works without storage.
  }
}

export function CharacterCreator({ onCreate, onCancel }: { onCreate: (c: Character) => void; onCancel: () => void }) {
  const [d, setD] = useState<CreatorDraft>(() => loadDraft() ?? newDraft())
  useEffect(() => saveDraft(d), [d])

  const c = d.character
  const setC = (patch: Partial<Character>) => setD({ ...d, character: { ...c, ...patch } })
  const go = (step: number) => {
    setD({ ...d, step: Math.max(0, Math.min(STEPS.length - 1, step)) })
  }
  // New step: back to the top of the scrolling panel, with the current step tab in view on phones.
  useEffect(() => {
    document.querySelector('.main')?.scrollTo?.({ top: 0 })
    document.querySelector('.step-current')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [d.step])
  const issues = creatorIssues(d)

  return (
    <div className="creator">
      <header className="creator-head">
        <div>
          <p className="field-label">Character creator</p>
          <h2 className="creator-title">{c.name.trim() || 'New character'}</h2>
        </div>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => {
            saveDraft(null)
            onCancel()
          }}
        >
          Discard
        </button>
      </header>

      <nav className="steps" aria-label="Creation steps">
        <ol>
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                className={'step' + (i === d.step ? ' step-current' : '') + (issues.some((x) => x.step === i) ? ' step-issue' : '')}
                aria-current={i === d.step ? 'step' : undefined}
                onClick={() => go(i)}
              >
                <span className="step-num">{i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="creator-body">
        {d.step === 0 && <Basics d={d} setC={setC} />}
        {d.step === 1 && <Race d={d} setC={setC} />}
        {d.step === 2 && <Profession d={d} setD={setD} />}
        {d.step === 3 && <Statistics d={d} setD={setD} setC={setC} />}
        {d.step === 4 && <Skills d={d} setD={setD} setC={setC} />}
        {d.step === 5 && <Lifepath d={d} setD={setD} />}
        {d.step === 6 && <Gear d={d} setC={setC} />}
        {d.step === 7 && <Review d={d} go={go} />}
      </div>

      <footer className="creator-foot">
        <button type="button" className="btn" onClick={() => go(d.step - 1)} disabled={d.step === 0}>
          Back
        </button>
        <span className="toolbar-spacer" />
        {d.step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => go(d.step + 1)}>
            Next: {STEPS[d.step + 1]}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={issues.some((x) => x.step === 0 || x.step === 2)}
            onClick={() => {
              saveDraft(null)
              onCreate(finishDraft(d))
            }}
          >
            Create character
          </button>
        )}
      </footer>
    </div>
  )
}

type StepProps = {
  d: CreatorDraft
  setD: (d: CreatorDraft) => void
  setC: (patch: Partial<Character>) => void
}

function Step({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section className="stack">
      <div>
        <h3 className="step-title">{title}</h3>
        <p className="hint step-intro">{intro}</p>
      </div>
      {children}
    </section>
  )
}

function Basics({ d, setC }: Omit<StepProps, 'setD'>) {
  const c = d.character
  return (
    <Step title="Who are you?" intro="Start with the basics. You can change any of this later on the sheet.">
      <div className="panel grid-identity">
        <TextField label="Character name" value={c.name} onChange={(v) => setC({ name: v })} placeholder="e.g. Vernossiel" />
        <TextField label="Player name" value={c.player} onChange={(v) => setC({ player: v })} />
        <TextField label="Age" value={c.age} onChange={(v) => setC({ age: v })} />
        <TextField label="Gender" value={c.gender} onChange={(v) => setC({ gender: v })} />
        {IS_GM && (
          <label className="field">
            <span className="field-label">Sheet type</span>
            <select value={c.kind} onChange={(e) => setC({ kind: e.target.value as Character['kind'] })}>
              <option value="pc">Player character</option>
              <option value="npc">NPC</option>
            </select>
          </label>
        )}
      </div>
    </Step>
  )
}

function Race({ d, setC }: Omit<StepProps, 'setD'>) {
  const c = d.character
  return (
    <Step title="Choose your race" intro="Your race sets your perks. Copy the perks from the race section of the core rulebook into the box below.">
      <div className="choice-grid">
        {Object.entries(RACE_INFO).map(([race, text]) => (
          <button
            key={race}
            type="button"
            className={'choice' + (c.race === race ? ' choice-on' : '')}
            aria-pressed={c.race === race}
            onClick={() => setC({ race, school: race === 'Witcher' ? c.school : '' })}
          >
            <strong>{race}</strong>
            <span>{text}</span>
          </button>
        ))}
      </div>
      <div className="panel">
        <div className="row-fields">
          <TextField label="Homeland" value={c.homeland} onChange={(v) => setC({ homeland: v })} placeholder="e.g. Temeria, Nilfgaard, Mahakam" />
          {c.race === 'Witcher' && <TextField label="School" value={c.school} onChange={(v) => setC({ school: v })} placeholder="Wolf, Cat, Griffin…" />}
        </div>
        <TextArea label="Racial perks" rows={3} value={c.perks} onChange={(v) => setC({ perks: v })} />
      </div>
    </Step>
  )
}

function Profession({ d, setD }: Omit<StepProps, 'setC'>) {
  const c = d.character
  return (
    <Step title="Choose your profession" intro="Your profession gives you a defining skill and the skills you'll spend profession points on.">
      <div className="choice-grid">
        {PROFESSIONS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={'choice' + (c.profession === p.name ? ' choice-on' : '')}
            aria-pressed={c.profession === p.name}
            onClick={() => {
              const next = applyProfession(c, p.name)
              next.crowns = STARTING_CROWNS[p.name] ?? next.crowns
              if (p.name === 'Witcher') next.race = 'Witcher'
              setD({ ...d, character: next })
            }}
          >
            <strong>{p.name}</strong>
            <span>
              Defining skill: {p.definingSkill}
              {p.vigor ? ` · Vigor ${p.vigor}` : ''}
            </span>
            <span className="choice-meta">About {STARTING_CROWNS[p.name]} crowns to start</span>
          </button>
        ))}
      </div>
    </Step>
  )
}

function Statistics({ d, setD, setC }: StepProps) {
  const c = d.character
  const spent = statPointsSpent(c.stats)
  const left = d.poolPoints - spent
  const dv = derive(c.stats)
  const setStat = (k: StatKey, v: number) => setC({ stats: { ...c.stats, [k]: Math.max(STAT_MIN, Math.min(STAT_MAX, v)) } })
  return (
    <Step
      title="Assign your statistics"
      intro={`Split your points across the nine stats, between ${STAT_MIN} and ${STAT_MAX} each. Ask your GM which power level the campaign uses.`}
    >
      <div className="panel">
        <div className="pool-picker">
          {STAT_POOLS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={'cond' + (d.poolId === p.id ? ' cond-on' : '')}
              aria-pressed={d.poolId === p.id}
              onClick={() => setD({ ...d, poolId: p.id, poolPoints: p.points })}
            >
              {p.label} ({p.points})
            </button>
          ))}
          <label className="pool-custom">
            <span className="field-label">Custom</span>
            <NumberInput ariaLabel="Custom stat points" value={d.poolPoints} min={18} onChange={(v) => setD({ ...d, poolId: 'custom', poolPoints: v })} />
          </label>
        </div>
        <Budget label="Stat points left" left={left} total={d.poolPoints} />
      </div>
      <div className="stat-grid">
        {STAT_KEYS.map((k) => (
          <div className="stat" key={k}>
            <span className="stat-key-static">{k}</span>
            <div className="stepper">
              <button type="button" className="icon-btn" aria-label={`Lower ${STAT_NAMES[k]}`} onClick={() => setStat(k, c.stats[k] - 1)} disabled={c.stats[k] <= STAT_MIN}>
                −
              </button>
              <span className="stepper-value">{c.stats[k]}</span>
              <button type="button" className="icon-btn" aria-label={`Raise ${STAT_NAMES[k]}`} onClick={() => setStat(k, c.stats[k] + 1)} disabled={c.stats[k] >= STAT_MAX || left <= 0}>
                +
              </button>
            </div>
            <span className="stat-name">{STAT_NAMES[k]}</span>
          </div>
        ))}
      </div>
      <dl className="derived panel">
        {(
          [
            ['Health', dv.hp],
            ['Stamina', dv.sta],
            ['Stun', dv.stun],
            ['Recovery', dv.rec],
            ['Run', `${dv.run} m`],
            ['Encumbrance', dv.enc],
            ['Punch', dv.punch],
            ['Kick', dv.kick],
          ] as const
        ).map(([l, v]) => (
          <div className="derived-item" key={l}>
            <dt>{l}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Step>
  )
}

function Budget({ label, left, total }: { label: string; left: number; total: number }) {
  return (
    <div className={'budget' + (left < 0 ? ' budget-over' : left === 0 ? ' budget-done' : '')}>
      <span className="field-label">{label}</span>
      <strong>
        {left} <span className="hint">of {total}</span>
      </strong>
    </div>
  )
}

function Skills({ d, setD, setC }: StepProps) {
  const c = d.character
  const b = skillBudget(d)
  const prof = new Set(d.professionSkills)
  const [onlyProf, setOnlyProf] = useState(false)
  const toggleProf = (id: string) =>
    setD({ ...d, professionSkills: prof.has(id) ? d.professionSkills.filter((x) => x !== id) : [...d.professionSkills, id] })
  const setSkill = (id: string, v: number) => setC({ skills: { ...c.skills, [id]: Math.max(0, Math.min(b.cap, v)) } })
  return (
    <Step
      title="Train your skills"
      intro={
        <>
          Star the skills your profession lists in the rulebook; those and your defining skill spend the {PROFESSION_SKILL_POINTS} profession points.
          Everything else uses pick-up points (INT + REF). No skill can start above {b.cap}.
        </>
      }
    >
      <div className="panel budgets">
        <Budget label="Profession points left" left={b.professionTotal - b.professionSpent} total={b.professionTotal} />
        <Budget label="Pick-up points left" left={b.pickupTotal - b.pickupSpent} total={b.pickupTotal} />
        <label className="check">
          <input type="checkbox" checked={onlyProf} onChange={(e) => setOnlyProf(e.target.checked)} />
          Starred only
        </label>
      </div>
      <div className="panel">
        <div className="row-fields">
          <TextField label="Defining skill" value={c.definingSkill} onChange={(v) => setC({ definingSkill: v })} />
          <label className="field">
            <span className="field-label">Points</span>
            <NumberInput ariaLabel="Defining skill points" value={c.definingSkillValue} min={0} max={b.cap} onChange={(v) => setC({ definingSkillValue: Math.max(0, Math.min(b.cap, v)) })} />
          </label>
        </div>
      </div>
      <div className="skill-columns">
        {STAT_KEYS.filter((k) => k !== 'SPD' && k !== 'LUCK').map((stat) => {
          const skills = SKILLS.filter((s) => s.stat === stat && (!onlyProf || prof.has(s.id)))
          if (skills.length === 0) return null
          return (
            <section className="panel skill-group" key={stat}>
              <h3 className="panel-title">
                {STAT_NAMES[stat]} <span className="panel-sub">{stat} {c.stats[stat]}</span>
              </h3>
              <ul className="skill-list">
                {skills.map((s) => (
                  <li key={s.id} className={'skill creator-skill' + ((c.skills[s.id] ?? 0) > 0 ? ' skill-trained' : '')}>
                    <button
                      type="button"
                      className={'star' + (prof.has(s.id) ? ' star-on' : '')}
                      aria-pressed={prof.has(s.id)}
                      aria-label={`${s.name} is a profession skill`}
                      onClick={() => toggleProf(s.id)}
                    >
                      ★
                    </button>
                    <span className="skill-name">{s.name}</span>
                    <NumberInput ariaLabel={`${s.name} points`} value={c.skills[s.id] ?? 0} min={0} max={b.cap} onChange={(v) => setSkill(s.id, v)} className="skill-input" />
                    <span className="skill-total" title="Stat + skill">
                      {c.stats[stat] + (c.skills[s.id] ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </Step>
  )
}

function Lifepath({ d, setD }: Omit<StepProps, 'setC'>) {
  const c = d.character
  const [lastRoll, setLastRoll] = useState<number | null>(null)
  const setFamily = (id: string, v: string) => setD({ ...d, family: { ...d.family, [id]: v } })
  const updDecade = (id: string, patch: Partial<CreatorDraft['decades'][number]>) =>
    setD({ ...d, decades: d.decades.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
  return (
    <Step
      title="Walk your lifepath"
      intro="Roll on the lifepath tables in the core rulebook, or choose results with your GM's permission, and note what you got. Everything here becomes your Life events timeline."
    >
      <div className="panel dice-helper">
        <button type="button" className="btn" onClick={() => setLastRoll(rollD10())}>
          Roll 1d10
        </button>
        <span className="dice-result" aria-live="polite">
          {lastRoll === null ? 'Roll, then look the number up in the matching table.' : lastRoll}
        </span>
      </div>
      {c.race === 'Witcher' && (
        <p className="hint">Witchers were taken from their families young, so their family rolls are mostly for color. Use the witcher lifepath in the rulebook for the rest.</p>
      )}
      <section className="panel">
        <h3 className="panel-title">Family</h3>
        <div className="card-fields family-fields">
          {FAMILY_FIELDS.map((f) => (
            <TextField key={f.id} label={f.label} value={d.family[f.id]} onChange={(v) => setFamily(f.id, v)} />
          ))}
        </div>
      </section>
      <section className="panel">
        <h3 className="panel-title">Life events by decade</h3>
        <p className="hint">For each decade from age 10, roll for a fortune or misfortune, allies and enemies, or romance.</p>
        {d.decades.length === 0 && (
          <div>
            <button type="button" className="btn" onClick={() => setD({ ...d, decades: decadeRows(c.age) })}>
              Add rows for age {c.age || '?'}
            </button>
          </div>
        )}
        <ul className="decade-list">
          {d.decades.map((e) => (
            <li key={e.id} className="decade">
              <input aria-label="When" value={e.when} onChange={(ev) => updDecade(e.id, { when: ev.target.value })} />
              <select aria-label="Type" value={e.kind} onChange={(ev) => updDecade(e.id, { kind: ev.target.value as LifeEventKind })}>
                {DECADE_KINDS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
              <input aria-label="What happened" placeholder="What happened" value={e.title} onChange={(ev) => updDecade(e.id, { title: ev.target.value })} />
              <button type="button" className="icon-btn" aria-label="Remove row" onClick={() => setD({ ...d, decades: d.decades.filter((x) => x.id !== e.id) })}>
                ×
              </button>
            </li>
          ))}
        </ul>
        {d.decades.length > 0 && (
          <div>
            <button
              type="button"
              className="btn"
              onClick={() => setD({ ...d, decades: [...d.decades, { id: uid(), when: '', kind: 'Fortune', title: '', details: '' }] })}
            >
              Add event
            </button>
          </div>
        )}
      </section>
    </Step>
  )
}

function Gear({ d, setC }: Omit<StepProps, 'setD'>) {
  const c = d.character
  const [name, setName] = useState('')
  return (
    <Step title="Gear and coin" intro="Note the gear your profession gives you, plus your starting crowns. Weapons and armor go on the Combat tab once the sheet is made.">
      <div className="panel row-fields">
        <label className="field">
          <span className="field-label">Crowns</span>
          <NumberInput ariaLabel="Crowns" value={c.crowns} min={0} onChange={(v) => setC({ crowns: v })} />
        </label>
        {c.profession && <p className="hint">The average for a {c.profession} is {STARTING_CROWNS[c.profession]} crowns.</p>}
      </div>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          setC({ items: [...c.items, { id: uid(), name: name.trim(), qty: 1, weight: 0, notes: '' }] })
          setName('')
        }}
      >
        <div className="row-fields">
          <TextField label="Add an item" value={name} onChange={setName} placeholder="e.g. Surgeon's kit" />
          <button type="submit" className="btn">
            Add
          </button>
        </div>
        {c.items.length > 0 && (
          <ul className="history-list">
            {c.items.map((i) => (
              <li key={i.id}>
                <span className="history-text">{i.name}</span>
                <button type="button" className="icon-btn" aria-label={`Remove ${i.name}`} onClick={() => setC({ items: c.items.filter((x) => x.id !== i.id) })}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    </Step>
  )
}

function Review({ d, go }: { d: CreatorDraft; go: (n: number) => void }) {
  const c = d.character
  const dv = derive(c.stats)
  const issues = creatorIssues(d)
  const trained = SKILLS.filter((s) => (c.skills[s.id] ?? 0) > 0)
  const events = finishDraft(d).lifeEvents
  return (
    <Step title="Review" intro="Check everything over. Anything flagged can be fixed now or later on the sheet.">
      {issues.length > 0 && (
        <ul className="issues">
          {issues.map((x, i) => (
            <li key={i}>
              <button type="button" className="btn-chip" onClick={() => go(x.step)}>
                {STEPS[x.step]}
              </button>
              {x.text}
            </li>
          ))}
        </ul>
      )}
      <div className="review-grid">
        <section className="panel">
          <h3 className="panel-title">{c.name || 'Unnamed'}</h3>
          <p>
            {[c.race, c.profession, c.homeland && `from ${c.homeland}`, c.age && `age ${c.age}`].filter(Boolean).join(' · ')}
          </p>
          <p className="hint">
            {c.definingSkill ? `${c.definingSkill} ${c.definingSkillValue}` : 'No defining skill'} · {c.crowns} crowns
          </p>
        </section>
        <section className="panel">
          <h3 className="panel-title">Statistics</h3>
          <p className="review-stats">
            {STAT_KEYS.map((k) => (
              <span key={k}>
                {k} <strong>{c.stats[k]}</strong>
              </span>
            ))}
          </p>
          <p className="hint">
            HP {dv.hp} · STA {dv.sta} · Stun {dv.stun} · Run {dv.run} m
          </p>
        </section>
        <section className="panel">
          <h3 className="panel-title">Skills</h3>
          <p>{trained.length ? trained.map((s) => `${s.name} ${c.skills[s.id]}`).join(', ') : 'No skills trained yet.'}</p>
        </section>
        <section className="panel">
          <h3 className="panel-title">Lifepath</h3>
          {events.length ? (
            <ul className="history-list">
              {events.map((e) => (
                <li key={e.id}>
                  <span className="hint">{e.when}</span> <span className="history-text">{e.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="hint">No lifepath events yet.</p>
          )}
        </section>
      </div>
    </Step>
  )
}
