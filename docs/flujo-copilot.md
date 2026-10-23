# Cómo trabajar con Copilot en este repo

Guía práctica del flujo de `AGENTS.md`: qué escribir en el chat en cada fase, qué revisas tú y qué modelo usar.

---

## Antes de empezar

- VS Code con `cells-copilot-starter` abierto como carpeta raíz y el chat en modo **Agent**.
- Las **skills** se invocan escribiendo `/nombre` en el chat (`/security-spec`, `/finding-triage`…).
- Los **agentes** se eligen en el selector de agentes del chat (`security-planner`, `security-implementer`…). Al terminar, cada agente ofrece un botón de handoff para pasar al siguiente; revisa el prompt antes de enviarlo.

### Convenciones de nombres

| Qué | Formato | Ejemplo |
|---|---|---|
| ID del hallazgo | El ID original de la herramienta o del ticket si existe; si no, `<ÁREA>-<NNN>` | `GHSA-xxxx-xxxx-xxxx`, `LOGIN-001` |
| Carpeta del spec | `specs/<ID>/` | `specs/LOGIN-001/` |
| Rama | `fix/<ID>-<resumen-corto>` | `fix/LOGIN-001-open-redirect` |
| Commit | `fix(security): <ID> <qué se corrige>` | `fix(security): LOGIN-001 validate returnUrl` |

Usa siempre el mismo ID en la carpeta, la rama, el commit, los nombres de los tests y la PR: es lo que permite seguir un hallazgo de principio a fin en una auditoría.

---

## Resumen del flujo

```text
Triage ──► Specs (en lote) ──► [tú revisas los specs]
                                     │
               por cada hallazgo, en un chat nuevo:
                                     ▼
             Plan ──► Fix ──► Revisión ──► PR ──► [una persona aprueba]
```

Tus puntos de control son tres: **revisar el spec**, **revisar el plan** y **aprobar la PR**. El resto lo hace Copilot.

---

## 1. Triage

En un chat nuevo, con el informe o el código que quieres analizar:

```text
/finding-triage src/pages/login/
```

Sale una tabla con un ID, una severidad y un veredicto por hallazgo (real, duplicado o falso positivo). Comprueba que cada descarte tiene una evidencia razonada.

## 2. Specs en lote

En el **mismo chat** del triage, porque la tabla ya está en el contexto:

```text
/security-spec genera los specs de todos los hallazgos reales del triage
```

Se crea `specs/<ID>/spec.md` por hallazgo, con `plan.md` y `tasks.md` vacíos. En un chat nuevo, Copilot no recuerda el triage: pasa los datos completos (`/security-spec <ID> <origen> <severidad> <fichero> <descripción>`) o pega la fila de la tabla. Si falta el ID, la ubicación o la severidad, la skill te lo pregunta.

**Revisa cada spec antes de seguir**: el vector, los payloads que deben quedar neutralizados y el comportamiento que no debe cambiar. El spec es el contrato del resto del flujo, y desde aquí es la fuente de verdad, no la memoria del chat.

## 3. Un hallazgo cada vez

Empieza por el de mayor severidad. Crea la rama y abre un **chat nuevo** para que el hallazgo trabaje con contexto limpio:

```powershell
git switch -c fix/<ID>-<resumen-corto> <rama base>
```

| Paso | Agente | Le dices | Tú revisas |
|---|---|---|---|
| Plan | `security-planner` (`dependency-auditor` si es una dependencia) | `planifica specs/<ID>` | `plan.md` y `tasks.md` |
| Fix | `security-implementer` | `implementa specs/<ID>` | el diff y que el test reproduzca el ataque |
| Revisión | `security-reviewer` | `revisa specs/<ID>` | si hay bloqueos, vuelve al Fix |
| PR | `pr-preparer` | `prepara la PR de specs/<ID>` | la descripción |

Después:

```powershell
git commit -m "fix(security): <ID> <qué se corrige>"
git push -u origin HEAD
gh pr create --base <rama base>
```

Pega la descripción del `pr-preparer` en la PR. La aprueba siempre una persona.

## 4. Siguiente hallazgo

Cuando la PR anterior esté mergeada, actualiza la rama base y repite el paso 3:

```powershell
git switch <rama base>
git pull
```

**Por qué el plan no se hace en lote como los specs:** el spec dice *qué* hay que conseguir y no depende del código; el plan dice *cómo*, y depende del código que haya en ese momento. Si dos hallazgos tocan el mismo fichero, el plan del segundo escrito antes de aplicar el primero queda desfasado: líneas que ya no existen y conflictos de merge. Solo cuando los hallazgos están en ficheros distintos se pueden planificar todos de una vez.

---

## Qué rechazar en tus puntos de control

Copilot redacta; tú decides. Estas son las señales de que hay que pedir que lo rehaga.

**Un mal triage:**
- Descarta un hallazgo sin evidencia ("no parece explotable") en lugar de señalar el fichero:línea que lo neutraliza.
- Marca como real algo que el framework ya protege. Por ejemplo, `${valor}` en una plantilla `html` de Lit se escapa: no es XSS.
- Mezcla dos vectores distintos en un solo hallazgo, o separa en dos lo que es el mismo sink con el mismo fix.
- Asigna la severidad sin explicar el impacto (robo de sesión, phishing, fuga de datos) ni lo fácil que es explotarlo.

**Un mal spec:**
- El vector no tiene fuente, sink e impacto concretos: "la página tiene un XSS" no basta; "`?help=` → `href` del enlace de ayuda → ejecuta JavaScript al hacer clic" sí.
- Los criterios de aceptación no incluyen payloads concretos, solo "que sea seguro".
- No dice qué comportamiento debe seguir funcionando. Por ejemplo, que un `returnUrl` interno legítimo siga redirigiendo.
- Ya describe la solución técnica ("usar `safeUrl()`"): eso va en el plan.
- Añade requisitos que el hallazgo no pedía.

**Un mal plan:**
- Propone escribir su propia validación en lugar de usar `src/security/` (`safeUrl()`, `safeRedirectPath()`, `sanitizeHtml()`).
- Relaja una allowlist, una regla de ESLint o la política de `pnpm-workspace.yaml` para que algo pase.
- No incluye una tarea de test que reproduzca el ataque antes del fix.

## Si el `security-reviewer` bloquea

El reviewer termina con un veredicto: **BLOQUEA**, **CAMBIOS MENORES** o **LISTO PARA PR**.

1. **Primer bloqueo:** vuelve al `security-implementer` en el mismo chat, pasándole los bloqueos del informe ("corrige los bloqueos del reviewer"). Después, vuelve a pedir la revisión.
2. **Segundo bloqueo por el mismo motivo:** no sigas iterando. El problema ya no está en el código, sino en el plan o en el spec:
   - Si el reviewer señala un criterio del spec que el fix no puede cumplir, revisa el spec.
   - Si el enfoque del plan no resuelve el vector, vuelve al `security-planner` y rehaz `plan.md` y `tasks.md`.
   - Si no está claro, decide tú o consulta a AppSec antes de seguir.
3. **CAMBIOS MENORES:** puedes corregirlos y continuar a la PR sin otra revisión completa.

El veredicto del reviewer nunca aprueba la PR: es una segunda opinión. La aprobación es siempre humana.

## Hallazgos de dependencias

Cuando el hallazgo es un paquete vulnerable (`pnpm audit`, Dependabot o un aviso CVE/GHSA), el plan lo hace `dependency-auditor` en lugar de `security-planner`:

| Paso | Agente o skill | Qué hace |
|---|---|---|
| Spec | `/security-spec` | Usa el ID del aviso (`GHSA-…` o `CVE-…`) como ID del hallazgo |
| Plan | `dependency-auditor` | Ejecuta solo comandos de lectura (`pnpm audit`, `pnpm why`, `pnpm outdated`) y determina la versión parcheada mínima, si la dependencia es directa o transitiva y quién la arrastra. No modifica ficheros |
| Fix | `security-implementer` con la skill `dependency-cve-fix` | Directa → actualiza a la versión parcheada mínima. Transitiva → actualiza primero el paquete padre; si no hay versión que lo resuelva, añade un `overrides:` en `pnpm-workspace.yaml` |
| Revisión y PR | Igual que el resto | La PR documenta el ID del aviso, la versión antes y después, si es directa o transitiva, y por qué se usó un override |

Si la versión parcheada es más reciente de lo que permite `minimumReleaseAge`, o la bloquea `trustPolicy`, **no relajes la política**: documenta el bloqueo en el spec y decide con AppSec si se espera o se acepta una excepción.

## Secreto en el código

Un secreto expuesto (API key, token, credencial, clave privada) es un **incidente**, no un hallazgo más. La skill `hardcoded-secret-response` solo se ejecuta si la invocas tú con `/hardcoded-secret-response`; Copilot no la carga por su cuenta.

1. **Rota el secreto primero**, con el equipo responsable. Borrarlo del código no lo invalida: sigue en el historial de git y en los bundles ya publicados.
2. **No copies el valor** en el chat, los specs, los tests, los commits ni la PR. Refiérete a él por fichero y línea.
3. Decide si el secreto debe estar en el front. Si es una clave pública por diseño (por ejemplo, la clave publicable de un proveedor), se documenta y se cierra como aceptado con la aprobación de AppSec. Si no, la llamada debe pasar por un backend, y eso se anota en el plan como dependencia de otro equipo.
4. Retira el valor del código. No lo sustituyas por otro secreto en un `.env` versionado.
5. Añade, si es posible, un test o una regla que impida reintroducirlo.
6. La limpieza del historial de git la decide AppSec; no reescribas el historial por tu cuenta.

---

## Qué modelo usar en cada fase

En el selector de modelos del chat hay dos controles ([documentación de VS Code](https://code.visualstudio.com/docs/agent-customization/language-models)):

- **Auto → Optimize for**: Copilot elige el modelo según el nivel. **Efficiency** prioriza gastar menos créditos, **Balance** equilibra capacidad y gasto, e **Intelligence** prioriza modelos más capaces para tareas complejas. Tu organización puede fijar uno por defecto, que aparece como *Default*.
- **Thinking Effort** (None, Low, Medium, High): solo aparece al elegir un modelo de razonamiento concreto, con la flecha **>** junto a su nombre. Por defecto el modelo decide cuánto razonar. Subirlo gasta más créditos.

Usa **Auto** y cambia solo *Optimize for* según la fase:

| Fase | Optimize for | Por qué |
|---|---|---|
| Triage | Balance | Descartar falsos positivos exige criterio, pero el informe se revisa después |
| Specs | Balance | Es redactar a partir del triage; tú lo revisas |
| Plan | **Intelligence** | Análisis fuente → sink → impacto y elegir el enfoque. Un mal plan arrastra todo lo demás |
| Fix | Balance | El cómo ya está decidido en el plan; el test y el lint frenan los errores |
| Revisión | **Intelligence** | Encontrar bypasses y casos que faltan es donde un error cuesta más |
| PR | Efficiency | Es resumir el spec y el diff |

Si eliges un modelo concreto en lugar de Auto (por ejemplo, porque el banco tiene una lista de modelos aprobados), deja el *Thinking Effort* por defecto y súbelo a **High** solo en el plan y la revisión.

Los agentes del repo no fijan `model:` a propósito: el catálogo de modelos cambia a menudo, y un modelo fijado que se retira rompe el agente.

---

## Practicar con la página vulnerable

La rama `test/vulnerable-login-page` añade una página `/login` con fallos de seguridad intencionados para probar el flujo. No se mergea en `main`, así que en ese caso la **rama base** del paso 3 es `test/vulnerable-login-page` y las PR de fix van contra ella.

Open Cells usa routing por hash, así que la página se abre en `http://localhost:5173/#!/login`. Los parámetros que lee la página van antes del `#!`:

```text
http://localhost:5173/?returnUrl=https://evil.example&help=javascript:alert(document.domain)#!/login
```
