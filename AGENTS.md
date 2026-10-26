<!--
Por qué este fichero: AGENTS.md es la fuente ÚNICA de contexto y reglas. Es un estándar abierto, así que sirve
también para Claude Code, Codex y otras IA. Los demás ficheros (.github/copilot-instructions.md, instructions/,
agents/, skills/) remiten aquí o lo concretan, y nunca lo contradicen.
Solo hay uno, en la raíz: los AGENTS.md anidados en subcarpetas son experimentales en VS Code.
Los comentarios HTML como este no se renderizan y apenas gastan tokens.
-->
# AGENTS.md — Remediación de seguridad front-end (Open Cells / LitElement)

## Contexto
- Web components LitElement sobre Open Cells (`@open-cells/core`, page/element controllers) + utilidades TypeScript.
- Objetivo: remediar vulnerabilidades front-end (XSS, open redirect, almacenamiento inseguro, postMessage, dependencias, CSP, build). NO se añaden features.
- Cada cambio va vinculado a un hallazgo (ID de ticket/alerta) y a su carpeta `specs/<ID>/`.
- Ejemplo completo y resuelto: `specs/EXAMPLE-001/` + `src/components/user-card.ts`.

## Comandos
<!-- Por qué pnpm --frozen-lockfile: instala exactamente el lockfile revisado; si no coincide con package.json, falla. -->
- Instalar: `pnpm install --frozen-lockfile`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Build: `pnpm build`
- Auditoría de dependencias: `pnpm audit --prod`
- Todo lo anterior (lo que corre CI): `pnpm check`

## Reglas no negociables
<!-- Por qué se repiten aquí aunque ESLint ya las aplica: el lint detecta, pero estas reglas evitan que la IA proponga el código. -->
- Prohibido: `unsafeHTML`, `unsafeSVG`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`.
- HTML no confiable → solo vía `renderSanitizedHtml()` / `sanitizeHtml()` de `src/security/sanitize.ts`.
- URLs dinámicas → solo vía `safeUrl()` de `src/security/safe-url.ts`. Redirecciones desde parámetros → `safeRedirectPath()`.
- No relajar `src/security/*` (allowlists, política de DOMPurify) sin un hallazgo que lo justifique y revisión de AppSec.
- No modificar `src/security/*`, tampoco para endurecerlo, sin un test nuevo que falle con el código actual. Si los tests del wrapper ya cubren el payload, el fix va en el componente.
- Cada fix se limita a su hallazgo: lo que pertenece a otro hallazgo (aunque esté en el mismo fichero) va en su propio spec.
- No leer ni modificar: ficheros `.env*`, secretos, `.npmrc`, `.github/workflows/`. `pnpm-lock.yaml` y `pnpm-workspace.yaml` solo en tareas de dependencias.
  <!-- Por qué está escrito aquí: la exclusión de contenido que configura el admin NO se respeta en modo Agent del IDE. -->
- Nunca copies el valor de un secreto encontrado en código a chats, specs, commits ni PR: cita solo fichero y línea.
- Cada fix incluye un test que reproduce el ataque y demuestra que queda neutralizado.
- No añadas dependencias nuevas sin justificarlo en el spec.
- Si algo es ambiguo, pregunta. No inventes requisitos.

## Flujo (SDD ligero)
- Antes de implementar, lee `specs/<ID>/spec.md` y `specs/<ID>/plan.md`. Si no existen, no implementes: créalos primero.
- Marca en `specs/<ID>/tasks.md` cada tarea terminada.
- Las PR enlazan `specs/<ID>/` y las aprueba siempre una persona.

| Fase | Quién | Salida |
|---|---|---|
| 0. Triage | Agente `finding-triager` (skill `finding-triage`) | Lista de hallazgos con ID, severidad y descartes razonados |
| 1. Spec | Skill `security-spec` | `specs/<ID>/spec.md` |
| 2. Plan y tareas | Agente `security-planner` (o `dependency-auditor` si es una dependencia) | `plan.md` y `tasks.md` |
| 3. Implementación | Agente `security-implementer` + skill de remediación | Código, tests y casillas marcadas |
| 4. Revisión | Agente `security-reviewer` | Informe con bloqueos |
| 5. PR | Agente `pr-preparer` (skill `pr-security-summary`) | Descripción de PR y PR creada tras confirmación |

## Skills de remediación disponibles
`lit-xss-remediation`, `open-redirect-fix`, `postmessage-hardening`, `sensitive-storage-fix`, `hardcoded-secret-response`,
`csp-hardening`, `build-hardening`, `dependency-cve-fix`. De apoyo: `sink-inventory`, `security-test-writer`.
