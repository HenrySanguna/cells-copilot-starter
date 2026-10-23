# cells-copilot-starter

Proyecto Open Cells (LitElement) de partida para **remediar vulnerabilidades front-end con GitHub Copilot** en un entorno bancario. Trae montada la configuración estable de Copilot (AGENTS.md, instrucciones por ruta, 6 custom agents, 13 skills), un flujo spec-driven ligero con un ejemplo resuelto, y un repositorio de GitHub que simula las protecciones de un repo corporativo.

Todo lo experimental o lo que un banco suele bloquear se ha dejado fuera a propósito (ver [Qué no incluye](#qué-no-incluye-y-por-qué)).

---

## Ruta rápida

```powershell
pnpm install --frozen-lockfile
pnpm dev          # http://localhost:5173
pnpm check        # lint + tests + build + audit (lo mismo que CI)
```

1. Abre **esta carpeta** como raíz en VS Code (no la carpeta padre): si no, Copilot no encuentra `.github/agents` ni `.github/skills`.
2. Acepta las extensiones recomendadas.
3. En el chat, elige el agente `security-planner` en el selector de agentes y escribe `/` para ver las skills.
4. Recorre el ejemplo [EXAMPLE-001](#recorrido-guiado-example-001).

Requisitos: Node ≥ 22, pnpm ≥ 12, VS Code con GitHub Copilot (chat en modo Agent).

---

## Mapa del proyecto

```text
cells-copilot-starter/
├── AGENTS.md                         # fuente única de contexto, comandos y reglas
├── specs/
│   ├── _template/                    # spec.md, plan.md, tasks.md vacíos
│   └── EXAMPLE-001/                  # hallazgo de ejemplo resuelto
├── src/
│   ├── security/                     # sanitize.ts (DOMPurify) y safe-url.ts, con tests
│   ├── components/user-card.ts       # componente del ejemplo, con tests
│   └── pages/, router/               # scaffold de Open Cells
├── .github/
│   ├── copilot-instructions.md       # fino: remite a AGENTS.md
│   ├── instructions/                 # 6 reglas por ruta (applyTo)
│   ├── agents/                       # 6 custom agents
│   ├── skills/                       # 13 skills
│   ├── workflows/ci.yml              # CI = pnpm check
│   ├── dependabot.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── eslint.config.js                  # las reglas de AGENTS.md como errores de lint
├── pnpm-workspace.yaml               # política de cadena de suministro
├── vite.config.ts / vitest.config.ts
└── .vscode/                          # settings.json y extensions.json del equipo
```

Cada fichero de configuración lleva comentarios `Por qué:` que explican la decisión. En los Markdown son comentarios HTML: no se ven al renderizar y apenas gastan tokens.

---

## Cómo se carga el contexto en Copilot

| Pieza | Cuándo llega al modelo | Para qué |
|---|---|---|
| `AGENTS.md` | Siempre (chat y agentes) | Reglas y comandos. Portable a otras IA. |
| `.github/copilot-instructions.md` | Siempre, en casi todas las superficies | Duplica solo lo crítico por si AGENTS.md no se carga. |
| `.github/instructions/*.instructions.md` | Solo al tocar ficheros que encajan con `applyTo` | Reglas específicas sin gastar tokens en el resto. |
| Custom agent | Al elegirlo en el selector o por handoff | Rol con herramientas limitadas. |
| Skill | Cuando la petición encaja con su `description`, o con `/nombre` | Procedimiento paso a paso. Carga progresiva. |

**Precedencia si se contradicen:** personales > por ruta > `copilot-instructions.md` > `AGENTS.md` > organización. Las instrucciones afectan al chat y a los agentes, **no al autocompletado**.

**Doble barrera:** las reglas de AGENTS.md piden a la IA que no use sinks peligrosos; `eslint.config.js` lo impide de verdad. Si `unsafeHTML`, `innerHTML`, `eval`… aparecen fuera de `src/security/`, `pnpm lint` falla en local, en el agente y en CI.

### Instrucciones por ruta

| Fichero | `applyTo` | Qué fija |
|---|---|---|
| `lit-security` | `src/**/*.{ts,js}` | Sinks, URLs, handlers, storage, postMessage, CSP |
| `tests` | `**/*.test.{ts,js}` | Un test por vector, payloads, DOM real, jsdom |
| `deps` | `package.json`, `pnpm-*` | Versión parcheada mínima, overrides, no relajar la política |
| `security-core` | `src/security/**` | No ampliar allowlists, un solo unsafeHTML |
| `build-config` | `vite/vitest/eslint/tsconfig`, `index.html` | Sourcemaps, CSP por cabecera, no rebajar el lint |
| `specs` | `specs/**/*.md` | Formato de spec/plan/tasks, sin secretos |

---

## Catálogo de agentes

Ninguno fija `model:`: el catálogo de modelos rota cada mes y el banco tendrá su lista aprobada; un modelo fijado que se retira rompe el agente.

| Agente | Herramientas | Rol | Pasa a |
|---|---|---|---|
| `finding-triager` | lectura | Convierte un informe en hallazgos: duplicados, falsos positivos con evidencia, severidad | planner / dependency-auditor |
| `security-planner` | lectura | Fuente → sink → impacto; propone `plan.md` y `tasks.md` | implementer |
| `dependency-auditor` | lectura + terminal | `pnpm audit`, `pnpm why`, directa vs transitiva | implementer |
| `security-implementer` | lectura + edición + terminal | Test primero, fix mínimo, marca tareas | reviewer |
| `security-reviewer` | lectura + cambios pendientes | Revisión con contexto limpio y criterios de bloqueo | pr-preparer |
| `pr-preparer` | lectura + cambios pendientes | Descripción de PR con evidencias | — |

**Por qué separar roles:** el planner no puede editar, así que no "arregla de paso"; el reviewer no escribió el código, así que no tiene el sesgo del autor. Solo el implementer puede escribir.

Los **handoffs** añaden un botón al final de la respuesta que pasa al agente siguiente con un prompt preparado. Todos usan `send: false`: la persona revisa antes de enviar.

## Catálogo de skills

| Skill | Cuándo | Fase |
|---|---|---|
| `finding-triage` | Llega un informe con varios hallazgos | 0 |
| `security-spec` | Empezar cualquier hallazgo | 1 |
| `sink-inventory` | Buscar otras apariciones del patrón antes de planificar | 2 |
| `lit-xss-remediation` (+ `payloads.md`) | Sink DOM en un componente | 3 |
| `open-redirect-fix` | `returnTo`, `location.search`, `navigate` desde parámetros | 3 |
| `postmessage-hardening` | Listener `message` sin validar origen, `postMessage('*')` | 3 |
| `sensitive-storage-fix` | Tokens o datos personales en storage o logs | 3 |
| `hardcoded-secret-response` | Secreto en el código (solo con `/`, nunca automática) | 3 |
| `csp-hardening` | Falta CSP, clickjacking, recursos inline | 3 |
| `build-hardening` | Sourcemaps, `console`, variables `VITE_` en el bundle | 3 |
| `dependency-cve-fix` | Paquete vulnerable | 3 |
| `security-test-writer` | Test que reproduce el ataque | 3 |
| `pr-security-summary` | Descripción de la PR | 5 |

Formato: una carpeta por skill con `SKILL.md`; `name` igual a la carpeta (minúsculas, números y guiones, ≤ 64); `description` dice qué hace **y cuándo usarla** (≤ 1024), porque es lo único que el agente ve hasta decidir cargarla. Copilot también lee `.claude/skills/` y `.agents/skills/`, así que estas skills sirven para Claude copiando la carpeta.

---

## Flujo spec-driven ligero

| Fase | Quién | Salida |
|---|---|---|
| 0. Triage | `finding-triager` | Hallazgos con ID y descartes razonados |
| 1. Spec | `/security-spec` | `specs/<ID>/spec.md` |
| 2. Plan | `security-planner` o `dependency-auditor` | `plan.md` y `tasks.md` |
| 3. Implementación | `security-implementer` + skill | Código, tests, casillas marcadas |
| 4. Revisión | `security-reviewer` | Informe con veredicto |
| 5. PR | `pr-preparer` | Descripción de PR; **aprueba una persona** |

**Por qué este flujo y no Spec Kit:** cada hallazgo es un cambio pequeño y Spec Kit genera demasiados artefactos; además no hace falta instalar Python/uv, y deja en git el rastro spec → plan → tareas → código que pide una auditoría. El coste: las plantillas las mantienes tú y no hay comando de coherencia automático; lo cubre `security-reviewer`.

### Recorrido guiado: EXAMPLE-001

El ejemplo ya está resuelto para que veas el resultado de cada fase:

1. Lee `specs/EXAMPLE-001/spec.md`: el hallazgo (XSS en `user-card`), el vector y los criterios de aceptación.
2. Lee `plan.md` y `tasks.md`: enfoque, alternativas descartadas y tareas marcadas.
3. Abre `src/components/user-card.test.ts`: un test por payload, nombrados con el ID.
4. Abre `src/components/user-card.ts`: `renderSanitizedHtml()` y `safeUrl()` en lugar de `unsafeHTML` y `href` directo.
5. Ejecuta `pnpm dev`: la home muestra la tarjeta con los payloads neutralizados.
6. Prueba la barrera: cambia `renderSanitizedHtml(this.bio)` por `unsafeHTML(this.bio)` y ejecuta `pnpm lint` y `pnpm test`. Los dos fallan. Deshaz el cambio.

### Hallazgo nuevo, paso a paso

Ver [docs/flujo-copilot.md](docs/flujo-copilot.md): qué escribir en cada fase, qué revisas tú, cómo encadenar varios hallazgos y qué modelo usar en cada fase.

---

## Configuración de VS Code

**Ya configurado en el proyecto** (`.vscode/`, versionado):

- Los 4 ajustes de instrucciones: `useInstructionFiles`, `useAgentsMdFile`, `includeApplyingInstructions`, `includeReferencedInstructions`.
- ESLint corrige al guardar; la búsqueda excluye `node_modules`, `dist`, `types` y el lockfile.
- Extensiones recomendadas: ESLint, lit-plugin, Vitest Explorer.

**Lo que tienes que hacer tú:**

1. Abrir `cells-copilot-starter` como carpeta raíz del workspace.
2. Iniciar sesión en Copilot (en el banco, con la cuenta corporativa).
3. Comprobar en el selector de herramientas del chat que existen los nombres usados en `tools` (`read`, `search`, `edit`, `execute`, `search/changes`, `todos`, `vscode/askQuestions`, `web/fetch`). Pueden cambiar entre versiones; si alguno no aparece, ajústalo en el `.agent.md`.
4. Abrir el editor de personalizaciones del chat (*Chat: Configure Agents / Skills*) y verificar que aparecen los 6 agentes y las 13 skills sin errores.
5. Opcional: tienes `github.copilot.nextEditSuggestions.enabled: false` en tus ajustes de usuario. Las *next edit suggestions* no gastan créditos; actívalas si te resultan útiles.

### Plan B: si el banco no permite subir la configuración de IA

Copia las piezas como **personales**; solo te afectan a ti y no tocan el repo:

```powershell
Copy-Item .github\agents\*        $HOME\.copilot\agents\       -Recurse
Copy-Item .github\skills\*        $HOME\.copilot\skills\       -Recurse
Copy-Item .github\instructions\*  $HOME\.copilot\instructions\ -Recurse
```

---

## Simulación del repo del banco

Repositorio: `HenrySanguna/cells-copilot-starter` (público: con el plan gratuito de GitHub es la única forma de que rulesets, CodeQL y push protection se apliquen de verdad).

| Protección | Estado | Equivalente en el banco |
|---|---|---|
| Ruleset `main-protection` | PR obligatoria, revisión de CODEOWNERS, conversaciones resueltas, check `ci` verde, historial lineal, sin force push ni borrado | Protección de rama corporativa |
| Bypass del ruleset | Solo rol admin y **solo vía PR** | En el banco no habría bypass: aprueba otra persona. Aquí existe porque no puedes aprobar tu propia PR |
| CODEOWNERS | `AGENTS.md`, `.github/`, `src/security/`, ESLint y ficheros de pnpm | Equipo AppSec como propietario |
| CI (`ci.yml`) | `pnpm check` en cada PR; acciones fijadas por SHA; token de solo lectura | Pipeline corporativo |
| CodeQL (default setup) | Análisis de JS/TS en cada PR | SAST corporativo |
| Secret scanning + push protection | Rechaza pushes con secretos conocidos | Igual |
| Dependabot | Alertas, PRs de seguridad y actualizaciones semanales con 3 días de espera | Igual |
| Merge | Solo squash; la rama se borra al fusionar | Política de merge del equipo |

**Lo que no se puede simular sin Copilot Business/Enterprise:** instrucciones de organización, exclusión de contenido, lista de modelos aprobados, políticas de Copilot (agente, code review, terminal) y presupuesto de créditos.

**Opcional, cercano a banca:** exigir commits firmados. Configura la firma con SSH (`git config --global gpg.format ssh`, `git config --global user.signingkey <ruta a tu .pub>`, `git config --global commit.gpgsign true`), sube la clave a GitHub como *Signing key* y añade la regla "Require signed commits" al ruleset.

### Trabajo diario contra el repo

```powershell
git switch -c fix/EXAMPLE-002-xss-account-alias
# ... flujo SDD ...
git commit -m "fix(security): EXAMPLE-002 sanitize account alias"
git push -u origin HEAD
gh pr create --fill
```

---

## Reglas siempre

- No fijes `model:` en ficheros compartidos.
- La aprobación de las PR es humana; los agentes y Copilot code review son segunda opinión.
- Los secretos nunca entran en el repo (la exclusión de contenido no se respeta en modo Agent).
- Créditos: el chat y los agentes gastan; el autocompletado no. Usa modelos ligeros para tareas mecánicas (triage largo, PR) y los potentes para el análisis.
- No relajes ESLint ni `pnpm-workspace.yaml` para que algo pase: es justo lo que deben frenar.

### Decisiones técnicas del proyecto

| Decisión | Por qué |
|---|---|
| pnpm con `minimumReleaseAge`, `trustPolicy`, `blockExoticSubdeps`, `allowBuilds` | Frena versiones secuestradas recién publicadas, degradaciones de procedencia, dependencias desde git y scripts de instalación no revisados |
| TypeScript 7 para `tsc` + TypeScript 6 con alias para ESLint | typescript-eslint aún no soporta TS 7; es la convivencia que recomienda Microsoft |
| Vitest + jsdom (no happy-dom) | DOMPurify solo soporta jsdom fuera del navegador; con happy-dom la sanitización daba falsos verdes |
| `renderSanitizedHtml()` como único `unsafeHTML` | Un solo punto auditable; ESLint prohíbe el resto |
| CSP en `Report-Only` en `vite preview` | Ver qué rompería antes de bloquear; en producción la pone el hosting |

## Qué no incluye y por qué

| Pieza | Motivo |
|---|---|
| Prompt files | En migración a skills; solo funcionan en el harness Local |
| MCP y hooks | Desactivados por defecto en empresa |
| `AGENTS.md` anidados | Experimental en VS Code |
| Agente en la nube | Ejecuta fuera de tu máquina y abre PR solo; suele estar restringido en banca |
| `allowed-tools` en skills | Experimental; las herramientas se limitan desde el agente |
| Spec Kit | Demasiados artefactos para hallazgos pequeños; requiere Python/uv |

## Preguntas para los admins del banco

1. Plan (Business o Enterprise), presupuesto de créditos y si el uso adicional está bloqueado.
2. Lista de modelos aprobados.
3. Si el modo Agent está habilitado en el IDE y si Copilot code review está activo (y si puede aprobar).
4. Exclusiones de contenido vigentes.
5. Si existen instrucciones de organización.
6. Si se pueden subir `AGENTS.md`, `.github/instructions`, `.github/agents` y `.github/skills`, y quién los revisa.
7. Política de ejecución de comandos en terminal por el agente.
