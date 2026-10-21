---
name: security-test-writer
description: Escribe el test que reproduce un ataque front-end (XSS, URL, redirección, storage, postMessage) con Vitest + jsdom sobre componentes Lit. Úsala al empezar la implementación de cualquier fix, antes de tocar el código.
---
<!-- Por qué test primero: un test que pasa antes del fix no demuestra nada; el que falla y luego pasa es la evidencia del arreglo. -->
1. Crea el test junto al código: `src/<ruta>/<componente>.test.ts`.
2. Monta el componente y espera al render:
   ```ts
   const el = document.createElement('mi-componente') as MiComponente;
   Object.assign(el, { prop: payload });
   document.body.append(el);
   await el.updateComplete;
   ```
3. Comprueba el **DOM renderizado** (`el.shadowRoot!.querySelector(...)`), nunca el string de la plantilla:
   - XSS → no existe el nodo peligroso o no tiene atributos `on*`; el texto del payload aparece como `textContent`.
   - URL → el atributo no existe o no empieza por un esquema peligroso.
   - Storage → `localStorage.getItem(clave)` es `null` tras el flujo.
4. Usa `it.each` con los payloads de `.github/skills/lit-xss-remediation/payloads.md`.
5. Nombra cada test con el ID: `it('<ID>: ...')`.
6. Añade un test del comportamiento legítimo que no debe cambiar.
7. Ejecuta `pnpm test` y confirma que los tests de ataque **fallan** antes del fix. Anota el resultado en `tasks.md`.
8. Limpia el DOM entre tests (`afterEach(() => document.body.replaceChildren())`).

Ejemplo: `src/components/user-card.test.ts`.
