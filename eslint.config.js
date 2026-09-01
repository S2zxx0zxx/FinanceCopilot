import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['backend/**/*.js', 'src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { process: 'readonly', console: 'readonly', Buffer: 'readonly', URL: 'readonly', fetch: 'readonly', setTimeout: 'readonly' },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-throw-literal': 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
  { // Interface contract files document parameter names by design
    files: ['**/*.interface.js'],
    rules: { 'no-unused-vars': 'off' },
  },
  {
    files: ['frontend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        alert: 'readonly',
        Event: 'readonly',
        setTimeout: 'readonly'
      }
    }
  },
  {
    files: ['docs/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
      }
    }
  },
  {
    files: ['worker/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        URL: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        console: 'readonly'
      }
    }
  },
  { ignores: ['node_modules/**', '.git/**'] },
];
