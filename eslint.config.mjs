import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    ignorePatterns: ['node_modules/*', 'public/mockServiceWorker.js'],
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          'import/order': [
            'error',
            {
              groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
                'object',
              ],
              'newlines-between': 'always',
              alphabetize: { order: 'asc', caseInsensitive: true },
            },
          ],
        },
      },
    ],
  }),
];

export default eslintConfig;
