# EXAMPLE-001 — Tareas

- [x] T1. Test con los payloads del spec en `src/components/user-card.test.ts`. Verificación: `pnpm vitest run src/components/user-card.test.ts`
  - Evidencia RED: con `unsafeHTML(this.bio)` y `href=${this.website}` → `3 failed | 3 passed (6)`:
    - `EXAMPLE-001: strips the onerror handler from <img src=x onerror=alert(1)> in the bio`
    - `EXAMPLE-001: removes "><svg onload=alert(1)> from the bio`
    - `EXAMPLE-001: does not render a javascript:alert(1) website as a link target`
  - El test de `name` pasa también sin el fix: Lit ya escapa `${this.name}`. Se mantiene como test de regresión.
- [x] T2. Sustituir `unsafeHTML(this.bio)` por `renderSanitizedHtml(this.bio)`. Verificación: `pnpm lint && pnpm test`
- [x] T3. Validar `website` con `safeUrl()` + `ifDefined()` y no pintar el enlace si no es válido. Verificación: `pnpm lint && pnpm test`
- [x] T4. Comprobación completa. Verificación: `pnpm check`
- [x] T5. Revisión con el agente security-reviewer: LISTO PARA PR.
