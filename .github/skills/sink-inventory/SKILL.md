---
name: sink-inventory
description: Inventaría todos los sinks peligrosos del código (HTML, URL, ejecución de código, storage, postMessage) con búsquedas concretas. Úsala antes de planificar un hallazgo para encontrar otras apariciones del mismo patrón, o para una auditoría inicial del repo.
---
<!-- Por qué: un informe suele señalar UNA aparición; el mismo patrón copiado en otros componentes queda sin arreglar. -->
Busca en `src/` (excluye `node_modules`, `dist`, `types`) y agrupa los resultados por categoría:

| Categoría | Patrones a buscar |
|---|---|
| HTML | `unsafeHTML`, `unsafeSVG`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `createContextualFragment` |
| Código | `eval(`, `new Function`, `setTimeout(` / `setInterval(` con string |
| URL / navegación | `href=${`, `src=${`, `action=${`, `formaction=${`, `location.href =`, `location.assign`, `location.replace`, `window.open(`, `navigate(` con datos de URL |
| Fuentes de URL | `location.search`, `location.hash`, `URLSearchParams`, `document.referrer` |
| Storage | `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie` |
| Mensajería | `addEventListener('message'`, `onmessage`, `postMessage(` |
| Logs | `console.log`, `console.debug` con tokens, usuarios o respuestas de API |
| Secretos | `apiKey`, `secret`, `token`, `password`, `Bearer `, cadenas largas base64/hex |

Para cada resultado indica: fichero:línea, si la fuente es confiable y si ya pasa por un wrapper de `src/security/`.
`src/security/` es el único sitio donde `unsafeHTML` es legítimo.
Devuelve solo los resultados que necesitan acción y un recuento por categoría.
