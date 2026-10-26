<!-- Ejemplo didáctico resuelto. Muestra el rastro completo spec → plan → tareas → código → test. -->
# EXAMPLE-001 — XSS almacenado en `user-card` (bio y web personal)

## 1. Hallazgo
- **ID**: EXAMPLE-001
- **Herramienta de origen**: SAST (ficticio)
- **Severidad**: Alta
- **Fichero / componente**: `src/components/user-card.ts`
- **Fecha**: 2026-10-21

## 2. Vector
- **Fuente no confiable**: campos `bio` y `website` del perfil, editables por el propio usuario y mostrados a otros.
- **Sink** (`src/components/user-card.ts`, `render()`):
  - `bio` se pintaba con `unsafeHTML(this.bio)`.
  - `website` se pintaba en `<a href=${this.website}>` sin validar el esquema.
- **Impacto**: ejecución de JavaScript en la sesión de quien ve el perfil (robo de sesión, operaciones en su nombre).

## 3. Criterios de aceptación
- [x] `<img src=x onerror=alert(1)>` en `bio` no deja ningún atributo `onerror`. Test: `EXAMPLE-001: strips the onerror handler from <img src=x onerror=alert(1)> in the bio`.
- [x] `"><svg onload=alert(1)>` en `bio` no deja ningún `<svg>` ni atributo `onload`. Test: `EXAMPLE-001: removes "><svg onload=alert(1)> from the bio`.
- [x] `javascript:alert(1)` en `website` no genera enlace. Test: `EXAMPLE-001: does not render a javascript:alert(1) website as a link target`.
- [x] `<img src=x onerror=alert(1)>` en `name` se muestra como texto. Test: `EXAMPLE-001: renders <img src=x onerror=alert(1)> in the name as text, not as a node`.
- [x] El formato básico de `bio` (`<b>`, `<em>`) sigue funcionando. Test: `keeps safe bio formatting`.
- [x] Una web `https://` válida sigue mostrándose como enlace con `rel="noopener noreferrer"`. Test: `keeps a valid https website as a safe external link`.
- [x] Evidencia: los tests del hallazgo fallan sin el fix, pasan con él y se ejecutan en CI con una instalación limpia. Ver T1 en `tasks.md`.

## 4. Fuera de alcance
- Validación de los campos en el backend (seguimiento con el equipo de API).
- Rediseño visual del componente.

## 5. Referencias
- CWE-79 (Cross-site Scripting)
- OWASP ASVS V5.3 (Output Encoding and Injection Prevention)
