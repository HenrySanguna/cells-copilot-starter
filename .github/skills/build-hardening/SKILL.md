---
name: build-hardening
description: Corrige problemas de configuración de build que exponen información en producción (sourcemaps publicados, console/debugger, variables de entorno filtradas al bundle, endpoints de desarrollo). Úsala cuando un hallazgo afecte a vite.config, tsconfig o al bundle generado.
---
<!-- Por qué: lo que hay en dist/ es público. Un sourcemap publicado entrega el código fuente completo, comentarios incluidos. -->
1. Ejecuta `pnpm build` y revisa `dist/`: ¿hay `.map`?, ¿aparecen URLs internas, claves o textos de depuración? (`grep` sobre `dist/assets`).
2. Sourcemaps: `build.sourcemap` en `false` en `vite.config.ts`. Si el equipo los necesita para monitorización, `'hidden'` y subida privada a la herramienta, nunca publicados.
3. Variables de entorno: Vite incluye en el bundle TODO lo que empiece por `VITE_`. Ningún secreto puede llevar ese prefijo.
4. Depuración: elimina `debugger` y `console.*` con datos; si hace falta, configura su eliminación en build.
5. Endpoints o flags de desarrollo (`localhost`, mocks, `isDev`) no deben llegar a producción.
6. Test o comprobación: añade una verificación reproducible (p. ej. que `dist/` no contenga `.map`) y documenta el comando en `tasks.md`.
7. `pnpm build && pnpm test`.
