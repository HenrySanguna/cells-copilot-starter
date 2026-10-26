# login-001 — Redirección abierta desde `returnUrl`

## 1. Hallazgo
- **ID**: login-001
- **Herramienta de origen**: revisión manual
- **Severidad**: High
- **Fichero / componente**: src/pages/login/login-page.ts
- **Fecha**: 2026-10-23

## 2. Vector
- **Fuente no confiable**: el parámetro de consulta `returnUrl` y el evento `message` con `event.data.returnUrl`, ambos controlables por un origen externo o por un mensaje del mismo origen en contexto no validado. Se leen en `src/pages/login/login-page.ts`, método `login()` (`returnUrl` de la query) y listener `onMessage` (`event.data.returnUrl`).
- **Sink**: `window.location.href = ...`
- **Impacto**: open redirect / phishing, con posibilidad de redirigir a un sitio externo tras el login y engañar al usuario para robar credenciales o secuestrar la navegación.

## 3. Criterios de aceptación
- [x] Payloads neutralizados:
  - `https://evil.example/phish`
  - `//evil.example/phish`
  - `/\evil.example`
  - `javascript:alert(1)`

  Tests: `LOGIN-001: does not redirect to returnUrl <payload> after login and falls back to home` y `LOGIN-001: does not redirect to returnUrl <payload> received by postMessage`, cada uno con los cuatro payloads.
- [x] Comportamiento funcional que no cambia:
  - El login exitoso sigue redirigiendo a rutas internas válidas del mismo origen.
  - Si no hay destino válido, la aplicación continúa con la navegación normal a `home`.
  - Si el usuario no llega a un destino válido, no se rompe el flujo de autenticación.

  Tests: `LOGIN-001: still redirects to a same-origin returnUrl after login`, `LOGIN-001: still redirects to a same-origin returnUrl received by postMessage`, `LOGIN-001: navigates home after login when there is no returnUrl` y el fallback a `home` de los tests de payloads.
- [x] Evidencia: los tests del hallazgo fallan sin el fix, pasan con él y se ejecutan en CI con una instalación limpia. Ver T1 y T5 en `tasks.md`.

## 4. Fuera de alcance
- Cambios en el backend o en la API de login.
- Revisión de otras redirecciones del repositorio distintas a la pantalla de login.
- Validación del origen de los mensajes (`event.origin`) en el listener de `postMessage`: pertenece al hallazgo de postMessage. Este hallazgo solo valida el destino de la redirección.
- Cambios en `src/security/`: `safeRedirectPath()` ya cubre los payloads de este spec.

## 5. Referencias
- CWE: CWE-601
- OWASP: OWASP Top 10 / Web Security Testing Guide — Open Redirects
