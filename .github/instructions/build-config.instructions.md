---
applyTo: "vite.config.ts,vitest.config.ts,index.html,tsconfig.json,eslint.config.js"
description: "Configuración de build, cabeceras de seguridad y herramientas"
---
<!-- Por qué: la configuración de build decide qué llega a producción (sourcemaps, scripts inline, cabeceras). -->
- `build.sourcemap` debe seguir en `false` para producción.
- No añadas `<script>` ni estilos inline en `index.html`: romperían una CSP estricta.
- La CSP y `frame-ancestors` van como cabecera HTTP (en `vite.config.ts` para preview y en el hosting en producción), nunca en `<meta>`.
- Endurece la CSP primero en `Content-Security-Policy-Report-Only` y solo después en modo bloqueante (ver skill `csp-hardening`).
- No desactives ni rebajes reglas de `eslint.config.js` (`no-restricted-syntax`, `no-restricted-imports`) para que un cambio pase.
- No cambies el entorno de tests de jsdom a otro.
