import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom y no happy-dom: DOMPurify solo soporta jsdom fuera del navegador, y con happy-dom la sanitización
    // se comporta distinto (falsos verdes). Basta para renderizar componentes Lit y comprobar que un payload
    // queda como texto y no como nodo ejecutable, sin levantar un navegador real.
    environment: 'jsdom',
    // @open-cells/core@1.2.1 publica `from './bridge'` sin extensión en src/index.js y Node no lo resuelve.
    // Se procesa con Vite (que sí lo resuelve) junto con page-controller, que lo importa. Solo afecta a los tests.
    server: { deps: { inline: ['@open-cells/page-controller', '@open-cells/core'] } },
    include: ['src/**/*.test.{ts,js}'],
  },
});
