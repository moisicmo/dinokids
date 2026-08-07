import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['build/**', '.react-router/**', 'node_modules/**', 'app/components/ui/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // El patrón "if (page > maxPage) setPage(maxPage)" dentro de un useEffect se usa
      // a propósito en varias tablas (clamp de paginación tras un refetch) — es intencional,
      // no un bug real, así que se baja a warning en vez de bloquear `yarn lint`.
      'react-hooks/set-state-in-effect': 'warn',

      // El proyecto usa parámetros/vars con prefijo _ a propósito en algunos callbacks;
      // no marcar esos como error, pero sí el resto de variables sin usar.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // El codebase usa `any` en algunos puntos (respuestas de Axios sin tipar, props
      // de librerías de terceros) — bajarlo a warning, no bloquear el build por esto.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
);
