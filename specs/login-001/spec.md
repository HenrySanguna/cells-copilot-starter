# login-001 — Redirección abierta desde `returnUrl`

## 1. Hallazgo
- **ID**: login-001
- **Herramienta de origen**: revisión manual
- **Severidad**: High
- **Fichero / componente**: src/pages/login/login-page.ts
- **Fecha**: 2026-10-23

## 2. Vector
- **Fuente no confiable**: el parámetro de consulta `returnUrl` y el evento `message` con `event.data.returnUrl`, ambos controlables por un origen externo o por un mensaje del mismo origen en contexto no validado. Válidos en [src/pages/login/login-page.ts:24-28] y [src/pages/login/login-page.ts:60-64].
- **Sink**: `window.location.href = ...`
- **Impacto**: open redirect / phishing, con posibilidad de redirigir a un sitio externo tras el login y engañar al usuario para robar credenciales o secuestrar la navegación.

## 3. Criterios de aceptación
- [ ] Payloads neutralizados:
  - `https://evil.example/phish`
  - `//evil.example/phish`
  - `/\evil.example`
  - `javascript:alert(1)`
- [ ] Comportamiento funcional que no cambia:
  - El login exitoso sigue redirigiendo a rutas internas válidas del mismo origen.
  - Si no hay destino válido, la aplicación continúa con la navegación normal a `home`.
  - Si el usuario no llega a un destino válido, no se rompe el flujo de autenticación.

## 4. Fuera de alcance
- Cambios en el backend o en la API de login.
- Revisión de otras redirecciones del repositorio distintas a la pantalla de login.

## 5. Referencias
- CWE: CWE-601
- OWASP: OWASP Top 10 / Web Security Testing Guide — Open Redirects
