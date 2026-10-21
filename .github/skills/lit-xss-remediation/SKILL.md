---
name: lit-xss-remediation
description: Remedia XSS en componentes LitElement/Open Cells (unsafeHTML, innerHTML, atributos URL, handlers desde strings). Úsala cuando un hallazgo señale un sink DOM en un web component.
---
<!-- Por qué los payloads van en un fichero aparte: carga progresiva; solo se leen cuando hace falta escribir el test. -->
1. Escribe primero un test con los payloads de [payloads.md](./payloads.md) (skill `security-test-writer`); debe fallar.
2. Clasifica el sink:
   - `unsafeHTML` → si el contenido no necesita HTML, interpólalo como texto `${valor}`; si lo necesita, `renderSanitizedHtml(valor)`.
   - Atributo URL (`href`, `src`, `action`, `formaction`) → `href=${ifDefined(safeUrl(valor))}`.
   - `innerHTML` imperativo → reescribe con plantilla html``.
   - Handler desde string (`setAttribute('onclick', ...)`) → `@click=${this.handler}`.
   - Contenido en `<style>` o `style=` dinámico → `styleMap` con valores validados o clases.
3. Aplica el fix mínimo. No cambies la API pública del componente (propiedades, eventos) salvo que el plan lo diga.
4. Ejecuta `pnpm lint` y `pnpm test`.
5. Resume para la PR: sink, fuente, fix, test.

Ejemplo completo: `src/components/user-card.ts` y `specs/EXAMPLE-001/`.
