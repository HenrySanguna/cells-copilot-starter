# login-001 — Tareas

- [x] T1. Test que reproduce el ataque (debe fallar). Verificación: `pnpm test -- --run src/pages/login/login-page.test.ts`
  - Evidencia RED: sin `safeRedirectPath()` en los dos caminos, `pnpm vitest run src/pages/login` → `8 failed`:
    - `LOGIN-001: does not redirect to returnUrl <payload> after login and falls back to home` × 4 (`https://evil.example/phish`, `//evil.example/phish`, `/\evil.example`, `javascript:alert(1)`)
    - `LOGIN-001: does not redirect to returnUrl <payload> received by postMessage` × 4 (mismos payloads)
- [x] T2. Fix mínimo. Verificación: `pnpm lint && pnpm test`
- [x] T3. Comprobación completa (los pasos que corre CI). Verificación: `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm audit --prod`
  - Evidencia: los cuatro en verde en CI (run 40327209574, commit `8c1cc95`).
  - `pnpm check` NO pasa: falla en su último paso (`pnpm audit` sin `--prod`) por la vulnerabilidad conocida de `happy-dom` descrita en T5, ajena a este hallazgo.
- [x] T4. Revisión con el agente security-reviewer (repetir tras las correcciones)
- [x] T5. Que `login-page.test.ts` cargue en CI. Verificación: `pnpm install --frozen-lockfile` en copia limpia + `pnpm test`
  - Evidencia RED: CI y copia limpia de `HEAD` → `Cannot find module '.../@open-cells/core/src/bridge' imported from .../src/index.js`, `1 failed | 3 passed (4)`. En local pasaba porque `node_modules/@open-cells/core/src/index.js` estaba editado a mano (`./bridge.js`).
  - Evidencia GREEN: con `server.deps.inline` en `vitest.config.ts`, copia limpia → `4 passed (4)`, `43 passed`; `pnpm lint` y `pnpm build` OK.
  - Fuera de alcance: `pnpm audit` (todas las dependencias) falla por `happy-dom` (dev, vía `vitest`, GHSA-834v-8h66-3h79); `pnpm audit --prod` sin vulnerabilidades. Va en su propio spec.
