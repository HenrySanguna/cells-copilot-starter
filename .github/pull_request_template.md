<!--
Por qué esta plantilla: la PR es la evidencia de auditoría de cada remediación. La rellena el agente pr-preparer
(skill pr-security-summary) y la revisa y aprueba una persona. Copilot code review, si está activo, es segunda opinión.
-->
## Hallazgo
- **ID**:
- **Origen / severidad**:
- **Spec**: `specs/<ID>/`

## Vector
<!-- fuente → sink → impacto, con fichero:línea -->

## Fix
<!-- qué se cambió y por qué este enfoque -->

## Tests
<!-- nombre de cada test y payloads cubiertos; confirma que fallaban antes del fix -->

## Evidencias
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm audit --prod`
- [ ] Todas las tareas de `specs/<ID>/tasks.md` marcadas
- [ ] Revisión del agente `security-reviewer` sin bloqueos

## Riesgo de regresión

## Fuera de alcance / seguimiento
<!-- Incluye la tabla "Hallazgos derivados" del revisor: tipo, fichero:línea y símbolo, vector, severidad propuesta, skill e issue si se abrió. -->

