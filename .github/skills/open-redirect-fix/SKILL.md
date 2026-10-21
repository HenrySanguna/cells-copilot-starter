---
name: open-redirect-fix
description: Corrige open redirects y navegaciones construidas desde parámetros (returnTo, next, redirect, location.search, location.hash, pageController.navigate). Úsala cuando un hallazgo señale una redirección controlable por el usuario.
---
<!-- Por qué importa en banca: un enlace legítimo del banco que tras el login lleva a una web clonada es phishing perfecto. -->
1. Test primero con los payloads de "Redirecciones" de `.github/skills/lit-xss-remediation/payloads.md`; debe fallar.
2. Localiza la fuente (`URLSearchParams`, `location.hash`, `document.referrer`, respuesta de API) y el sink (`location.href`, `location.assign/replace`, `window.open`, `pageController.navigate`).
3. Fix según el caso:
   - Destino interno con nombre de página Open Cells → valida contra una allowlist de nombres de ruta (`routes.ts`) y navega con `pageController.navigate(nombre)`. Es lo preferible.
   - Destino interno como ruta → `safeRedirectPath(valor)`; si devuelve `undefined`, navega a una página por defecto.
   - Destino externo legítimo → allowlist explícita de orígenes en el código, nunca una expresión regular laxa.
4. Nunca construyas la URL concatenando strings sin validar.
5. `pnpm lint && pnpm test`.
