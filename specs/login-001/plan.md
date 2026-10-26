# login-001 — Plan

## Enfoque
- **Skill de remediación**: open-redirect-fix
- **Resumen del fix**: Pasar `returnUrl` (query) y `event.data.returnUrl` (postMessage) por `safeRedirectPath()` antes de redirigir. Si el destino no es seguro, el login navega a `home` y el mensaje no redirige. `safeRedirectPath()` ya rechaza orígenes externos, `javascript:`, `//evil.example` y `/\evil.example` (cubierto en `src/security/safe-url.test.ts`), así que no hace falta modificar `src/security/`.

## Ficheros afectados
| Fichero | Cambio |
|---|---|
| src/pages/login/login-page.ts | Validar los dos destinos con `safeRedirectPath()`; la navegación pasa por `redirectTo()` para poder comprobarla en los tests. |
| src/pages/login/login-page.test.ts | Tests por el flujo real (envío del formulario y evento `message`) con los payloads del spec y con destinos internos legítimos. |
| vitest.config.ts | `server.deps.inline` para `@open-cells/page-controller` y `@open-cells/core`: sin ello `login-page.test.ts` no carga en CI (ver Dependencias externas). Solo afecta a los tests; no cambia dependencias, lockfile ni build. |

## Alternativas descartadas
- Validar con `startsWith('/')` o `includes('evil')`: insuficiente para `//evil.example`, `/\evil.example` y `javascript:`.
- Endurecer `safeRedirectPath()`: sus tests ya demuestran que rechaza todos los payloads del spec; cambiarla toca código compartido sin un fallo que lo justifique.
- Construir URLs concatenando strings: no valida el dominio ni el esquema.

## Riesgos de regresión
- Un `returnUrl` absoluto del mismo origen (`https://<origen>/ruta`) se convierte en ruta relativa: redirige al mismo sitio.
- Sin `returnUrl` o con uno no válido, el login navega a `home` como antes.

## Dependencias externas (backend, hosting, otros equipos)
- `@open-cells/core@1.2.1` publica `src/index.js:35` con `from './bridge'` sin extensión; Node (ESM) no lo resuelve y Vitest carga las dependencias con Node. Es el primer test que importa `@open-cells/page-controller`. Alternativas descartadas para este hallazgo: `pnpm patch` (toca `package.json` y lockfile, va en su propio spec de dependencias) y mockear `page-controller` (dejaría de probar el flujo real). Fix definitivo: corrección en el paquete por el equipo de Open Cells; al publicarse, quitar la entrada de `vitest.config.ts`.
