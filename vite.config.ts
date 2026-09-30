/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// Writes the install manifest for whichever edition is being built.
function manifest(env: Record<string, string>, edition: string): Plugin {
  return {
    name: 'edition-manifest',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: JSON.stringify(
          {
            name: env.VITE_APP_TITLE,
            short_name: env.VITE_APP_SHORT,
            description:
              edition === 'gm'
                ? 'NPCs, player sheets and encounters for The Witcher TTRPG'
                : 'Your Witcher TTRPG character sheets',
            start_url: './',
            scope: './',
            display: 'standalone',
            background_color: '#111518',
            theme_color: '#111518',
            icons: [
              { src: `icons/${edition}-192.png`, sizes: '192x192', type: 'image/png' },
              { src: `icons/${edition}.svg`, sizes: 'any', type: 'image/svg+xml' },
              { src: `icons/${edition}.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
            ],
          },
          null,
          2,
        ),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const edition = mode === 'player' ? 'player' : 'gm'
  const env = loadEnv(edition, process.cwd(), 'VITE_')
  return {
    base: './',
    plugins: [react(), manifest(env, edition)],
    build: { outDir: `dist/site/${edition}`, emptyOutDir: true },
    test: { environment: 'node' },
  }
})
