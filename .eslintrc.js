module.exports = {
  root: true,
  extends: ['airbnb-typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
    createDefaultProgram: true,
  },
  plugins: ['react', '@typescript-eslint', 'eslint-comments', 'import'],
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {},
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-use-before-declare': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-array-index-key': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-param-reassign': 'off',
    'import/no-cycle': 'off',
    'react/require-default-props': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        groups: [['builtin', 'external', 'internal'], 'parent', 'index', 'sibling'],
        pathGroups: [
          {
            pattern: './*.module.scss',
            group: 'sibling',
            position: 'after',
          },
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'consistent-return': 'off',
    'no-restricted-imports': ['error', { patterns: ['../*'] }],
  },
};
