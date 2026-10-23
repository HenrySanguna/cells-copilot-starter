# login-001 — Plan

## Enfoque
- **Skill de remediación**: open-redirect-fix
- **Resumen del fix**: Validar `returnUrl` y `event.data.returnUrl` con `safeRedirectPath()`, ignorar mensajes de origen no confiable y navegar siempre a `home` si el destino no es seguro. Esto bloquea redirecciones a orígenes externos, `javascript:` y variantes ambiguas como `//evil.example` o `/\evil.example`.

## Ficheros afectados
| Fichero | Cambio |
|---|---|
| src/pages/login/login-page.ts | Eliminar la navegación directa sin validar y centralizar la resolución del destino seguro. |
| src/security/safe-url.ts | Añadir validación estricta para rutas internas y rechazar `//`, `\` y orígenes diferentes al actual. |
| src/pages/login/login-page.test.ts | Añadir pruebas del payload atacante y de la navegación legítima del mismo origen. |

## Alternativas descartadas
- Validar con `startsWith('/')` o `includes('evil')`: insuficiente para `//evil.example`, `/\evil.example` y `javascript:`.
- Permitir cualquier origen externo: habilita phishing/open redirect.
- Construir URLs concatenando strings: no valida el dominio ni el esquema y puede aceptar destinos no seguros.

## Riesgos de regresión
- Un `returnUrl` realmente interno pero con query string o hash puede quedar bloqueado si el formato es raro; en ese caso se fuerza la navegación a `home` y se mantiene la seguridad.
- Si la validación es demasiado restrictiva, el flujo de autenticación podría perder un destino previo útil; la política segura prioriza la seguridad frente a una redirección no validada.

## Dependencias externas (backend, hosting, otros equipos)
- Ninguna. El cambio es totalmente front-end y no requiere coordinación con backend ni hosting.
