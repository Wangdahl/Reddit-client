import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { 
    ignores: ['dist'] 
  },
  {
    // Default config for JavaScript/JSX files (browser environment)
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Override for files in the /server folder (Node environment)
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    env: {
      node: true,
    },
  },
  {
    // Override for test files using Vitest
    // This applies to any file ending in .test.js, .spec.jsx, etc.
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    env: {
      vitest: true,  // Vitest automatically provides globals like describe, it, and expect.
    },
  },
];
