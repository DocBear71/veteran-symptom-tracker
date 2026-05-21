import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    // Run tests in Node environment (no browser needed for pure functions)
    environment: 'node',
    // Glob pattern — finds any *.test.js file anywhere in src/
    include: ['src/**/*.test.js'],
    // Reporter: verbose shows individual test names
    reporter: 'verbose',
  },
})