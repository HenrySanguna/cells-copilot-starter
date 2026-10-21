---
name: finding-triage
description: Hace triage de un informe de seguridad con varios hallazgos (SAST, pentest, Dependabot, npm/pnpm audit) agrupando duplicados y descartando falsos positivos con evidencia. Úsala cuando llegue un informe nuevo o se dude si un hallazgo es real.
---
<!-- Por qué: remediar un falso positivo cuesta lo mismo que uno real y añade riesgo de regresión sin beneficio. -->
1. Lista cada entrada del informe con su ID original.
2. Para cada una, abre el código y verifica:
   - ¿La fuente es realmente no confiable? (entrada de usuario, URL, `postMessage`, respuesta de API, storage).
   - ¿Llega al sink sin pasar por `renderSanitizedHtml()`, `safeUrl()` o `safeRedirectPath()`?
   - ¿El código es alcanzable en producción? (no solo tests, demos o código muerto).
3. Agrupa por causa raíz: varios avisos sobre el mismo sink son un único hallazgo.
4. Severidad propuesta con criterio explícito: impacto (robo de sesión, phishing, fuga de datos) × facilidad de explotación.
5. Clasifica cada entrada:
   - **Real** → skill de remediación sugerida.
   - **Duplicado de <ID>**.
   - **Falso positivo** → razón verificable con fichero:línea. Nunca "parece seguro".
   - **Necesita datos** → qué falta y a quién preguntarlo.
6. Devuelve una tabla Markdown. La decisión final de descartar la toma una persona.
