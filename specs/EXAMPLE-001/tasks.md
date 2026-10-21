# EXAMPLE-001 — Tareas

- [x] T1. Test con los payloads del spec en `src/components/user-card.test.ts`. Resultado antes del fix: 3 tests de ataque fallan. Verificación: `pnpm test`
- [x] T2. Sustituir `unsafeHTML(this.bio)` por `renderSanitizedHtml(this.bio)`. Verificación: `pnpm lint && pnpm test`
- [x] T3. Validar `website` con `safeUrl()` + `ifDefined()` y no pintar el enlace si no es válido. Verificación: `pnpm lint && pnpm test`
- [x] T4. Comprobación completa. Verificación: `pnpm check`
- [x] T5. Revisión con el agente security-reviewer: LISTO PARA PR.
