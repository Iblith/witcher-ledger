import { useId, useState } from 'react'
import { describe, search, type CatalogEntry, type CatalogKind } from '../model/catalog'

// Type to search the item catalog, then tap a result to add it. With onCustom,
// a name that isn't in the catalog can still be added as a plain item.
export function CatalogSearch(props: {
  label: string
  kinds: CatalogKind[]
  onPick: (e: CatalogEntry) => void
  onCustom?: (name: string) => void
  placeholder?: string
}) {
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const results = search(q, props.kinds, q.trim() ? 12 : 8)
  const pick = (e: CatalogEntry) => {
    props.onPick(e)
    setQ('')
    setOpen(false)
  }
  const custom = () => {
    if (!props.onCustom || !q.trim()) return
    props.onCustom(q.trim())
    setQ('')
    setOpen(false)
  }
  return (
    <div className="catalog-search">
      <label className="field" htmlFor={id}>
        <span className="field-label">{props.label}</span>
        <input
          id={id}
          type="search"
          value={q}
          placeholder={props.placeholder ?? 'Search by name'}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
            if (e.key !== 'Enter') return
            e.preventDefault()
            const exact = results.find((r) => r.name.toLowerCase() === q.trim().toLowerCase())
            if (exact) pick(exact)
            else if (props.onCustom) custom()
            else if (results[0]) pick(results[0])
          }}
        />
      </label>
      {open && (
        <ul className="catalog-results" id={`${id}-list`} role="listbox">
          {results.map((r) => (
            <li key={r.kind + r.name} role="option" aria-selected={false}>
              <button type="button" className="catalog-result" onClick={() => pick(r)}>
                <span className="catalog-name">{r.name}</span>
                <span className="catalog-desc">{describe(r)}</span>
              </button>
            </li>
          ))}
          {props.onCustom && q.trim() && !results.some((r) => r.name.toLowerCase() === q.trim().toLowerCase()) && (
            <li>
              <button type="button" className="catalog-result" onClick={custom}>
                <span className="catalog-name">Add “{q.trim()}”</span>
                <span className="catalog-desc">As your own item</span>
              </button>
            </li>
          )}
          {results.length === 0 && !props.onCustom && <li className="hint catalog-empty">Nothing matches “{q}”.</li>}
          <li>
            <button type="button" className="btn-chip catalog-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
