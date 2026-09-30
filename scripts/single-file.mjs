// Inlines one edition's Vite build into a single self-contained HTML file for desktop use
// (dist/witcher-ledger-<edition>.html). Data still saves in the browser that opens it.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const edition = process.argv[2] === 'player' ? 'player' : 'gm'
const root = new URL('../dist/', import.meta.url).pathname
const dir = join(root, 'site', edition)
let html = readFileSync(join(dir, 'index.html'), 'utf8')

html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+)"><\/script>/, (_, f) => {
  const js = readFileSync(join(dir, f), 'utf8').replace(/<\/script/g, '<\\/script')
  return ''.concat('<script type="module">', js, '</script>')
})
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+)">/, (_, f) =>
  ''.concat('<style>', readFileSync(join(dir, f), 'utf8'), '</style>'),
)
// A single file has no manifest or icon files beside it; embed the icon and drop the rest.
const icon = 'data:image/png;base64,' + readFileSync(join(dir, 'icons', `${edition}-192.png`)).toString('base64')
html = html
  .replace(/\s*<link rel="manifest"[^>]*>/, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')
  .replace(/(<link rel="icon" type="image\/png" href=")[^"]*/, (_, a) => a + icon)
// The module script must run after #root exists, so move it to the end of the body.
const script = html.match(/<script type="module">[\s\S]*?<\/script>/)[0]
html = html.replace(script, () => '').replace('</body>', () => script + '</body>')
writeFileSync(join(root, `witcher-ledger-${edition}.html`), html)

// Body-only variant for hosts that supply their own document skeleton (e.g. a Claude Artifact).
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta[^>]*>\s*/g, '')
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]
writeFileSync(join(root, `witcher-ledger-${edition}.artifact.html`), head.trim() + '\n' + body.trim() + '\n')
console.log(`wrote dist/witcher-ledger-${edition}.html`, Math.round(html.length / 1024) + ' KB')
