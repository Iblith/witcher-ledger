// Renders the app icons (PNG) for both editions. Run: node scripts/icons.cjs <path-to-playwright>
const { chromium } = require(process.argv[2] || 'playwright')
const path = require('path')
const svg = (label, ring) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#111518"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="${ring}" stroke-width="22"/>
  <circle cx="256" cy="256" r="118" fill="none" stroke="${ring}" stroke-width="4" opacity="0.6"/>
  <text x="256" y="${label.length > 1 ? 292 : 300}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
    font-weight="700" font-size="${label.length > 1 ? 104 : 130}" fill="${ring}">${label}</text>
</svg>`
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage()
  for (const [ed, label, ring] of [['player', 'W', '#d4aa4f'], ['gm', 'GM', '#b8c9d4']]) {
    await p.setContent(`<html><body style="margin:0">${svg(label, ring)}</body></html>`)
    for (const size of [192]) {
      await p.setViewportSize({ width: size, height: size })
      await p.evaluate((s) => { const el = document.querySelector('svg'); el.setAttribute('width', s); el.setAttribute('height', s) }, size)
      await p.screenshot({ path: path.join(__dirname, '..', 'public', 'icons', `${ed}-${size}.png`) })
    }
  }
  await b.close()
})()
