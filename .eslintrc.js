module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Includes Prettier rules
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2020: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
  rules: {
    // Remove ESLint formatting rules
    'indent': 'off', // Disable base indent rule
    '@typescript-eslint/indent': 'off', // Disable TypeScript-specific indent rule

    // Keep other ESLint rules for code quality
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'max-len': ['warn', { code: 120 }],
    'brace-style': ['error', '1tbs'],
    'eol-last': ['error', 'always'],
    'arrow-parens': ['error', 'always'],

    // Import order
 "simple-import-sort/imports": [
      "warn",
      {
        "groups": [
          // External modules
          ["^nest", "^@?\\w"],
          // Internal imports from 'src'
          ["^src/"],
          // Remaining internal imports
          ["^"]
        ]
      }
    ],
    "simple-import-sort/exports": "warn",

    // Prettier rules are enforced by the plugin:prettier/recommended
    'prettier/prettier': 'error',
  },
};
