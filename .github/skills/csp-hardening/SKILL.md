---
name: csp-hardening
description: Introduce o endurece la Content-Security-Policy y las cabeceras de seguridad (frame-ancestors, X-Content-Type-Options, Referrer-Policy) de la app. Úsala cuando un hallazgo señale ausencia de CSP, clickjacking o recursos inline incompatibles con CSP.
---
<!-- Por qué Report-Only primero: una CSP bloqueante mal ajustada rompe la app en producción; en modo informe solo avisa. -->
1. Inventaria lo que la CSP bloquearía: scripts y estilos inline, `style=` dinámicos, recursos de terceros (fuentes, imágenes, analítica), `eval`.
2. Elimina primero las causas en el código (mueve estilos a `static styles`, aloja recursos en local) en vez de abrir la política.
3. Ajusta `contentSecurityPolicy` en `vite.config.ts` empezando por `Content-Security-Policy-Report-Only`. Política base:
   `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.
4. Prueba con `pnpm preview` y revisa la consola del navegador: cada aviso es un recurso a eliminar o, solo si es legítimo, a permitir por origen exacto.
5. Nunca añadas `'unsafe-inline'` ni `'unsafe-eval'` a `script-src`.
6. Cuando no haya avisos, propón (no apliques) pasar a `Content-Security-Policy` bloqueante, y recuerda que en producción la cabecera la pone el hosting/CDN: anótalo en el plan.
7. `frame-ancestors` no funciona en `<meta>`: solo cabecera HTTP.
