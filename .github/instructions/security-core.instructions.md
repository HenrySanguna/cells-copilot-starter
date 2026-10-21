---
applyTo: "src/security/**"
description: "Reglas para el código de seguridad compartido (sanitize, safe-url)"
---
<!-- Por qué un fichero propio: un cambio aquí afecta a TODOS los componentes. Es el código con más riesgo del repo. -->
# Código de seguridad compartido
- Estos wrappers son el único punto de entrada para HTML no confiable y URLs dinámicas. No crees alternativas en otros ficheros.
- Nunca amplíes una allowlist (esquemas de URL, etiquetas o atributos de DOMPurify) sin un hallazgo que lo pida explícitamente.
- `renderSanitizedHtml()` es el único uso permitido de unsafeHTML del proyecto. No añadas otro.
- Cualquier cambio exige: test nuevo que lo cubra, ejecución de toda la suite y revisión con el agente `security-reviewer`.
- Prefiere bloquear de más (devolver `undefined` o string vacío) a dejar pasar un caso dudoso.
- Estos ficheros están en CODEOWNERS: la PR necesitará aprobación de AppSec.
