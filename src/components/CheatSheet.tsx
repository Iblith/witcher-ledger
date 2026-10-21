import { useEffect, useState } from 'react'
import { CHEAT_SHEET, searchCheatSheet, type CheatEntry, type CheatTopic } from '../model/cheatsheet'

// The GM's table reference: one collapsible section per topic, each rule a collapsible entry with
// its core-book page. Typing in the search box opens every matching entry.
export function CheatSheet({ jumpTo }: { jumpTo: { id: string; at: number } | null }) {
  const [query, setQuery] = useState('')
  // Open/closed per topic, with when it was last toggled so a later pick from the side list wins.
  const [open, setOpen] = useState<Record<string, { open: boolean; at: number }>>({})
  const searching = query.trim().length > 0
  const results = searchCheatSheet(query)
  const isOpen = (id: string) => (jumpTo?.id === id && jumpTo.at > (open[id]?.at ?? 0)) || (open[id]?.open ?? false)

  // Picking a topic from the side list opens it and scrolls there.
  useEffect(() => {
    if (jumpTo) requestAnimationFrame(() => document.getElementById('cheat-' + jumpTo.id)?.scrollIntoView({ block: 'start' }))
  }, [jumpTo])

  return (
    <div className="cheat">
      <div className="cheat-head">
        <h2 className="sheet-name">Cheat sheet</h2>
        <p className="hint">
          From the core rulebook (v1.35, errata included). Tap a rule to open it; the page is beside each one. Lines marked Unverified are
          our reading, not the book’s words.
        </p>
        <input type="search" className="cheat-search" aria-label="Search the cheat sheet" placeholder="Search, e.g. stun, parry, vigor" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {results.map(({ topic, entries }) => (
        <details
          key={topic.id + (searching ? ':q' : '')}
          id={'cheat-' + topic.id}
          className="cheat-topic panel"
          open={searching || isOpen(topic.id)}
          onToggle={(e) => {
            const now = (e.currentTarget as HTMLDetailsElement).open
            if (!searching && now !== isOpen(topic.id)) setOpen((o) => ({ ...o, [topic.id]: { open: now, at: Date.now() } }))
          }}
        >
          <summary>
            <span className="cheat-topic-title">{topic.title}</span>
            <span className="hint">{searching ? `${entries.length} match${entries.length === 1 ? '' : 'es'}` : topic.blurb}</span>
          </summary>
          <div className="cheat-entries">
            {entries.map((e) => (
              <Entry key={e.title + (searching ? ':q' : '')} entry={e} open={searching} />
            ))}
          </div>
        </details>
      ))}
      {results.length === 0 && <p className="hint">Nothing matches “{query}”.</p>}
    </div>
  )
}

function Entry({ entry: e, open }: { entry: CheatEntry; open: boolean }) {
  return (
    <details className="cheat-entry" open={open || undefined}>
      <summary>
        <span className="cheat-entry-title">{e.title}</span>
        <span className="cheat-page">{e.page}</span>
      </summary>
      <div className="cheat-body">
        {e.lines && e.lines.length > 0 && (
          <ul className="cheat-lines">
            {e.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
        {e.table && (
          <table className="cheat-table">
            <thead>
              <tr>
                {e.table.cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {e.table.rows.map((r) => (
                <tr key={r.join('|')}>
                  {r.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {e.items && (
          <ul className="cheat-items">
            {e.items.map((it) => (
              <li key={it.head}>
                <strong>{it.head}</strong>
                {it.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </li>
            ))}
          </ul>
        )}
        {e.reading && (
          <p className="cheat-reading">
            <strong>Unverified:</strong> {e.reading}
          </p>
        )}
        {e.errata && <p className="cheat-errata">{e.errata}</p>}
      </div>
    </details>
  )
}

// Side list for the cheat sheet section: one row per topic.
export function CheatTopics({ onPick }: { onPick: (t: CheatTopic) => void }) {
  return (
    <ul className="roster-list">
      {CHEAT_SHEET.map((t) => (
        <li key={t.id}>
          <button type="button" className="roster-item" onClick={() => onPick(t)}>
            <span className="roster-name">{t.title}</span>
            <span className="roster-meta">{t.blurb}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
