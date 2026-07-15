import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works on GitHub Pages project subpaths
  // (https://<user>.github.io/<repo>/) and from a packaged extension page.
  // Combined with HashRouter, deep links work with no server rewrite.
  base: './',
  // Absolute path of the unpacked extension (the folder holding manifest.json),
  // shown on the local install page.
  define: {
    __EXTENSION_DIR__: JSON.stringify(path.resolve(__dirname, '..')),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
