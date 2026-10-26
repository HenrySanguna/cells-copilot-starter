# EXAMPLE-001 — Plan

## Enfoque
- **Skill de remediación**: `lit-xss-remediation`
- **Resumen del fix**: `bio` pasa por `renderSanitizedHtml()` (DOMPurify con la política central) y `website` por `safeUrl()` con `ifDefined()`, de modo que una URL no permitida no genera enlace.

## Ficheros afectados
| Fichero | Cambio | Criterio del spec que lo exige |
|---|---|---|
| `src/components/user-card.test.ts` | Nuevo: tests con los payloads del spec | §3, los siete criterios: es su evidencia |
| `src/components/user-card.ts` | Sustituir `unsafeHTML` y el `href` directo por los wrappers de `src/security/` | §3, criterios 1 a 6 (payloads neutralizados y comportamiento que no cambia) |

## Alternativas descartadas
- Pintar `bio` como texto plano: rompe el formato que el negocio quiere mantener (criterio de aceptación 5).
- Llamar a DOMPurify directamente en el componente: duplicaría la política; el wrapper único es más auditable.

## Fuera de alcance
- Validación de `bio` y `website` en el backend: la hace el equipo de API (ver Dependencias externas).

## Riesgos de regresión
- HTML de `bio` que hoy usa etiquetas no permitidas (`style`, `form`) dejará de verse: aceptado por negocio.

## Dependencias externas (backend, hosting, otros equipos)
- Validación en backend de `website` y `bio` (fuera de alcance).
