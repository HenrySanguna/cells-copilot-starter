import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom y no happy-dom: DOMPurify solo soporta jsdom fuera del navegador, y con happy-dom la sanitización
    // se comporta distinto (falsos verdes). Basta para renderizar componentes Lit y comprobar que un payload
    // queda como texto y no como nodo ejecutable, sin levantar un navegador real.
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,js}'],
  },
});
