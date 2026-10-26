# login-001 — Tareas

- [x] T1. Test que reproduce el ataque (debe fallar). Verificación: `pnpm test -- --run src/pages/login/login-page.test.ts`
  - Evidencia RED: sin `safeRedirectPath()` en los dos caminos, `pnpm vitest run src/pages/login` → `8 failed`:
    - `LOGIN-001: does not redirect to returnUrl <payload> after login and falls back to home` × 4 (`https://evil.example/phish`, `//evil.example/phish`, `/\evil.example`, `javascript:alert(1)`)
    - `LOGIN-001: does not redirect to returnUrl <payload> received by postMessage` × 4 (mismos payloads)
- [x] T2. Fix mínimo. Verificación: `pnpm lint && pnpm test`
- [x] T3. Comprobación completa. Verificación: `pnpm check`
- [x] T4. Revisión con el agente security-reviewer (repetir tras las correcciones)
