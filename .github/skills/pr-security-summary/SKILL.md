---
name: pr-security-summary
description: Redacta la descripción de una PR de remediación de seguridad (hallazgo, vector, fix, test, evidencias, riesgos) enlazando specs/<ID>/. Úsala al terminar un hallazgo y antes de abrir la PR.
---
<!-- Por qué un formato fijo: el revisor humano, Copilot code review y un auditor buscan siempre los mismos datos. -->
Rellena `.github/pull_request_template.md` con:

1. **Hallazgo**: ID, herramienta de origen, severidad, enlace a `specs/<ID>/`.
2. **Vector**: fuente → sink → impacto, con fichero:línea.
3. **Fix**: qué se cambió y por qué ese enfoque (y no otro descartado en `plan.md`).
4. **Tests**: nombre de cada test, payloads cubiertos y confirmación de que fallaban antes del fix.
5. **Evidencias**: salida resumida de `pnpm check` (lint, tests, build, audit).
6. **Riesgo de regresión**: componentes afectados y cómo se ha comprobado que siguen funcionando.
7. **Fuera de alcance / seguimiento**: lo que queda pendiente (p. ej. cambios de backend o de hosting).

Título: `fix(security): <ID> <resumen>` o `fix(deps): <ID> <paquete> <versión>`.
Nunca incluyas secretos, tokens ni datos personales reales.
