# login-001 — Tareas

- [x] T1. Test que reproduce el ataque (debe fallar). Verificación: `pnpm test -- --run src/pages/login/login-page.test.ts`
  - Evidencia RED: sin `safeRedirectPath()` en los dos caminos, `pnpm vitest run src/pages/login` → `8 failed`:
    - `LOGIN-001: does not redirect to returnUrl <payload> after login and falls back to home` × 4 (`https://evil.example/phish`, `//evil.example/phish`, `/\evil.example`, `javascript:alert(1)`)
    - `LOGIN-001: does not redirect to returnUrl <payload> received by postMessage` × 4 (mismos payloads)
- [x] T2. Fix mínimo. Verificación: `pnpm lint && pnpm test`
- [x] T3. Comprobación completa. Verificación: `pnpm check`
  - Evidencia: los cuatro pasos de entonces en verde en CI (run 40327209574, commit `8c1cc95`). `pnpm check` fallaba en local por el `pnpm audit` sin `--prod` (`happy-dom`, ver T5).
  - Tras traer `main` (#7 y #8: `check` = store status + lint + test + build + `audit --prod`, y CI ejecuta `pnpm check`): `pnpm check` en local → store intacto, `4 passed (4)`, `43 passed`, build OK, `audit --prod` sin vulnerabilidades.
- [x] T4. Revisión con el agente security-reviewer (repetir tras las correcciones)
- [x] T5. Que `login-page.test.ts` cargue en CI. Verificación: `pnpm install --frozen-lockfile` en copia limpia + `pnpm test`
  - Evidencia RED: CI y copia limpia de `HEAD` → `Cannot find module '.../@open-cells/core/src/bridge' imported from .../src/index.js`, `1 failed | 3 passed (4)`. En local pasaba porque `node_modules/@open-cells/core/src/index.js` estaba editado a mano (`./bridge.js`).
  - Evidencia GREEN: con `server.deps.inline` en `vitest.config.ts`, copia limpia → `4 passed (4)`, `43 passed`; `pnpm lint` y `pnpm build` OK.
  - Fuera de alcance: `pnpm audit` (todas las dependencias) falla por `happy-dom` (dev, vía `vitest`, GHSA-834v-8h66-3h79); `pnpm audit --prod` sin vulnerabilidades. Va en su propio spec.
- [x] T6. Adaptar el spec al criterio estándar "Evidencia" de la plantilla (#7) y citarlo en la fila de soporte `vitest.config.ts` del plan; marcar los criterios de §3 con sus tests. Verificación: job `evidence` (`red-on-base`) en verde en la PR.
- [ ] T7. Revisión repetida con el agente security-reviewer (con `execute`: re-ejecuta los tests del hallazgo y `pnpm lint`).
