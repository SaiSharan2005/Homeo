module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // Reduce noise and prevent ESLint from blocking dev server
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'warn',
    'no-empty': 'warn',
    'no-var': 'warn',
    'prefer-const': 'warn',
    // Custom rule to prevent fetch/axios usage outside services
    // Note: custom restriction rules removed for now to avoid missing plugin issue
    // Additional rules for better code quality
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // Allow fetch/axios in services directory
      files: ['src/services/**/*.js', 'src/services/**/*.jsx'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    {
      // Allow fetch/axios in test files
      files: ['**/*.test.js', '**/*.test.jsx', '**/__tests__/**/*.js'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
