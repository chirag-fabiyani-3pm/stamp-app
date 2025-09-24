import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Disable React in JSX scope requirement for new JSX transform
      'react/react-in-jsx-scope': 'off',
      // Disable prop-types validation as we use TypeScript
      'react/prop-types': 'off',
      // Configure unused imports and vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Disable base rule in favor of plugin
      // Allow any type in some cases but warn about it
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unnecessary try/catch in some cases
      'no-useless-catch': 'warn',
      // Allow empty object types (common in interfaces)
      '@typescript-eslint/no-empty-object-type': 'warn',
      // Allow case declarations
      'no-case-declarations': 'off',
    },
  },
];
