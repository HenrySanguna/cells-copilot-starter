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
4. Para vectores sin DOM (redirección, `postMessage`), dispara el flujo real por la interfaz pública y comprueba el efecto:
   - Redirección → si el componente no tiene un método de navegación, el fix añade uno pequeño (p. ej. `redirectTo(path)`) que el test espía. jsdom no permite espiar `window.location`.
     ```ts
     vi.spyOn(el, 'redirectTo').mockImplementation(() => undefined);
     el.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true }));
     await vi.waitFor(() => expect(el.pageController.navigate).toHaveBeenCalledWith('home'));
     expect(el.redirectTo).not.toHaveBeenCalled();
     ```
   - `postMessage` → dispara un `MessageEvent` real, con `origin` cuando el vector depende de él:
     ```ts
     window.dispatchEvent(new MessageEvent('message', { data: payload, origin: 'https://evil.example' }));
     ```
   - Nunca llames a un método interno del componente con un cast (`as unknown as`) para probar la validación: así el test no demuestra que el flujo real la use.
5. Usa `it.each` con los payloads de `.github/skills/lit-xss-remediation/payloads.md`.
6. Nombra cada test con el ID: `it('<ID>: ...')`.
7. Añade un test del comportamiento legítimo que no debe cambiar.
8. Ejecuta `pnpm test` y confirma que los tests de ataque **fallan** antes del fix. Pega en `tasks.md`, bajo T1, los nombres de los tests que fallan y el resumen de `pnpm test`.
9. Limpia entre tests: el DOM (`afterEach(() => document.body.replaceChildren())`), el storage y los mocks (`vi.restoreAllMocks()`, `vi.unstubAllGlobals()`).

Ejemplo: `src/components/user-card.test.ts`.
