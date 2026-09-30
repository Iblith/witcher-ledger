import { useId, useState, type ReactNode } from 'react'

export function TextField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  list?: string
}) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{props.label}</span>
      <input
        id={id}
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        list={props.list}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  )
}

export function NumberInput(props: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  ariaLabel: string
  className?: string
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      className={'num ' + (props.className ?? '')}
      aria-label={props.ariaLabel}
      value={Number.isFinite(props.value) ? props.value : 0}
      min={props.min}
      max={props.max}
      step={props.step ?? 1}
      onChange={(e) => {
        const n = e.target.value === '' ? 0 : Number(e.target.value)
        if (Number.isFinite(n)) props.onChange(n)
      }}
    />
  )
}

export function NumberField(props: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{props.label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        className="num"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        onChange={(e) => {
          const n = e.target.value === '' ? 0 : Number(e.target.value)
          if (Number.isFinite(n)) props.onChange(n)
        }}
      />
    </label>
  )
}

export function TextArea(props: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{props.label}</span>
      <textarea id={id} rows={props.rows ?? 4} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </label>
  )
}

// A current/max pool (HP, Stamina, Luck) with quick +/- buttons for use at the table.
export function Pool(props: {
  label: string
  current: number
  max: number
  onChange: (v: number) => void
  tone: 'hp' | 'sta' | 'luck' | 'vigor'
  footer?: ReactNode
}) {
  const pct = props.max > 0 ? Math.max(0, Math.min(100, (props.current / props.max) * 100)) : 0
  const low = props.current <= props.max / 4
  return (
    <div className={`pool pool-${props.tone}${props.current < 0 ? ' pool-dying' : low ? ' pool-low' : ''}`}>
      <div className="pool-head">
        <span className="pool-label">{props.label}</span>
        <span className="pool-value">
          <NumberInput
            ariaLabel={`${props.label} current`}
            value={props.current}
            onChange={props.onChange}
            className="pool-input"
          />
          <span className="pool-max">/ {props.max}</span>
        </span>
      </div>
      <div className="pool-bar" aria-hidden="true">
        <div className="pool-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="pool-buttons">
        {[-5, -1, 1, 5].map((d) => (
          <button key={d} type="button" className="btn-chip" onClick={() => props.onChange(props.current + d)}>
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
        <button type="button" className="btn-chip" onClick={() => props.onChange(props.max)}>
          Full
        </button>
      </div>
      {props.footer}
    </div>
  )
}

export function ConfirmButton(props: { label: string; confirmLabel: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false)
  if (!armed)
    return (
      <button type="button" className="btn btn-quiet" onClick={() => setArmed(true)}>
        {props.label}
      </button>
    )
  return (
    <span className="confirm">
      <button type="button" className="btn btn-danger" onClick={props.onConfirm}>
        {props.confirmLabel}
      </button>
      <button type="button" className="btn btn-quiet" onClick={() => setArmed(false)}>
        Cancel
      </button>
    </span>
  )
}
