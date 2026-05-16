import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/casa-simpson/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        branches: 30,
        functions: 30,
        lines: 30,
        statements: 30
      },
      exclude: [
        'node_modules/',
        'src/tests/**',
        'src/tests/__mocks__/**',
        'src/firebase/**',
        '**/*.config.*',
        '**/*.test.*',
        'seedFirestore.js'
      ]
    }
  }
})