import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import lit from 'eslint-plugin-lit';
import globals from 'globals';

// Las reglas no negociables de AGENTS.md, convertidas en errores de lint.
// Por qué: las instrucciones para Copilot son una petición al modelo, no una garantía. El lint corre en local,
// en CI y en el agente implementer (pnpm check), así que un sink prohibido no llega a main aunque la IA lo escriba.
const dangerousSinks = [
  {
    selector: 'MemberExpression[property.name=/^(innerHTML|outerHTML)$/]',
    message: 'Prohibido innerHTML/outerHTML. Usa plantillas html`` o renderSanitizedHtml() de src/security/sanitize.ts.',
  },
  {
    selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
    message: 'Prohibido insertAdjacentHTML. Usa plantillas html``.',
  },
  {
    selector: "CallExpression[callee.object.name='document'][callee.property.name=/^(write|writeln)$/]",
    message: 'Prohibido document.write.',
  },
  {
    selector: "CallExpression[callee.name='eval']",
    message: 'Prohibido eval.',
  },
  {
    selector: "NewExpression[callee.name='Function'], CallExpression[callee.name='Function']",
    message: 'Prohibido new Function: ejecuta strings como código.',
  },
];

const unsafeDirectives = [
  'lit/directives/unsafe-html.js',
  'lit/directives/unsafe-svg.js',
  'lit-html/directives/unsafe-html.js',
  'lit-html/directives/unsafe-svg.js',
].map((name) => ({
  name,
  message: 'Prohibido unsafeHTML/unsafeSVG fuera de src/security/. Usa renderSanitizedHtml().',
}));

export default defineConfig(
  { ignores: ['dist/', 'types/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  lit.configs['flat/recommended'],
  {
    languageOptions: { globals: globals.browser },
    rules: {
      // Regla global del equipo: nada de any.
      '@typescript-eslint/no-explicit-any': 'error',
      // setTimeout('codigo') y similares son eval encubierto.
      'no-implied-eval': 'error',
      'no-restricted-syntax': ['error', ...dangerousSinks],
      'no-restricted-imports': ['error', { paths: unsafeDirectives }],
    },
  },
  {
    // Única excepción: el wrapper de sanitize.ts es el ÚNICO sitio que puede importar unsafeHTML,
    // y solo para pintar HTML que ya pasó por DOMPurify. Los sinks de dangerousSinks siguen prohibidos aquí.
    files: ['src/security/**/*.ts'],
    ignores: ['src/security/**/*.test.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
);
