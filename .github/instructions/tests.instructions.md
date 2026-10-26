---
applyTo: "**/*.test.{ts,js}"
description: "Convenciones de tests de seguridad"
---
<!-- Por qué: un test de seguridad que pasa sin comprobar el DOM real da una falsa sensación de seguridad. -->
- Vitest + jsdom. No cambies a happy-dom: DOMPurify no se comporta igual allí y da falsos verdes.
- Un test por vector: el payload debe aparecer como texto, nunca como nodo ejecutable ni atributo `on*`.
- Payloads mínimos: `<img src=x onerror=alert(1)>`, `javascript:alert(1)`, `"><svg onload=alert(1)>`. Más en `.github/skills/lit-xss-remediation/payloads.md`.
- Nombra el test con el ID del hallazgo: `it('EXAMPLE-001: ...')`.
- Incluye al menos un test del comportamiento funcional que no debe cambiar (contenido legítimo sigue funcionando).
- Comprueba el DOM renderizado (`shadowRoot.querySelector`), no el string de la plantilla.
- Prueba por la interfaz pública: dispara el flujo real (submit, click, `MessageEvent`) y comprueba su efecto. No llames a métodos internos con casts (`as unknown as`).
- El test debe fallar antes del fix. Si pasa sin el fix, no prueba nada.
