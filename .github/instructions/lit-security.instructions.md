---
applyTo: "src/**/*.{ts,js}"
description: "Reglas de seguridad para componentes LitElement / Open Cells"
---
<!-- Por qué applyTo: estas reglas solo se envían al modelo cuando se toca código de src/, así no gastan tokens en otras tareas. -->
# Seguridad en componentes Lit
- `${valor}` dentro de html`` ya se escapa como texto: NO lo sustituyas por unsafeHTML.
- unsafeHTML existente → elimínalo o sustitúyelo por `renderSanitizedHtml(valor)`, y añade test con `<img src=x onerror=alert(1)>`.
- Atributos URL (href, src, action, formaction) → `safeUrl()` con `ifDefined()`; Lit no bloquea `javascript:`.
- Redirecciones o `pageController.navigate`/`location` construidos desde parámetros de URL → `safeRedirectPath()`.
- Nada de atributos on* ni handlers construidos a partir de strings. Usa `@click=${...}`.
- No manipules `shadowRoot.innerHTML` ni `this.innerHTML`; usa plantillas.
- No guardes tokens, credenciales ni datos personales en `localStorage`/`sessionStorage`, ni los saques por `console`.
- Listeners de `message` → valida `event.origin` contra una allowlist y la forma del mensaje; nunca `postMessage(datos, '*')`.
- Compatible con CSP estricta: sin estilos ni scripts inline generados dinámicamente (usa `static styles`).
