import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'unused-imports': unusedImports,
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'unused-imports/no-unused-imports': 'error',

      // Phase 17b: Tell ESLint that JSX usage counts as variable usage.
      // Without these, the linter falsely flags every component used only
      // in JSX (e.g., <Layout />) as an unused import.
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      // React 17+ doesn't need `import React` for JSX. Allow files that
      // import React without using it explicitly (the new JSX transform
      // handles it). If you ever roll back to pre-17, flip this to 'error'.
      'react/react-in-jsx-scope': 'off',
    },
  },
])